import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import { Types, Schema, model, connect } from "mongoose";
dotenv.config();
// export interface IExercise {
// 	_id: mongoose.Types.ObjectId;
// 	username: string;
// 	count: number;
// 	log: [
// 		{
// 			description: string;
// 			duration: number;
// 			date: string;
// 		}
// 	];
// }
const ExerciseSchema = new Schema({
	_id: String,
	username: String,
	count: Number,
	log: [
		{
			description: String,
			duration: Number,
			date: String,
			_id: String,
		},
	],
});
export function generateId() {
	return new Types.ObjectId().toString();
}

const DB = mongoose.models.Exercise || model("Exercise", ExerciseSchema);
run().catch((err) => console.log(err));
async function run() {
	await connect(process.env.MONGO_URI!, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	} as ConnectOptions);
	console.log("Connected to Distribution API Database - Initial Connection");
}
run();

export default DB;
