import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DB, { generateId } from "./utils/db";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/api/users", async (req, res) => {
	const { username } = req.body;
	const _id = generateId();
	await DB.create({ _id, username });
	return res.json({ _id, username });
});

app.get("/api/users", async (req, res) => {
	const data = await DB.find();
	return res.json(data);
});

/**
 *
 */
interface IData {
	description: string;
	duration: number;
	date?: string;
}
async function findAndUpdate(
	_id: string,
	description: string,
	duration: number,
	date: string
) {
	return await DB.findByIdAndUpdate(
		{
			_id,
		},
		{
			$push: { log: { description, duration, date } },
		},
		{ safe: true, upsert: true, new: true }
	);
}
app.post("/api/users/:_id/exercises", async (req, res) => {
	const { description, duration, date }: IData = req.body;
	const { _id } = req.params;
	let data;
	if (!date) {
		const dateNow = new Date().toDateString();
		data = await findAndUpdate(_id, description, duration, dateNow);
	} else {
		const dateString = new Date(date).toDateString();
		data = await findAndUpdate(_id, description, duration, dateString);
	}

	return res.json({
		_id: data._id,
		username: data.username,
		date: data.log[0].date,
		duration: data.log[0].duration,
		description: data.log[0].description,
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server Listening On Port ${PORT}`);
});
