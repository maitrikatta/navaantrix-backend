import mongoose from "mongoose";
const { Schema } = mongoose;

const studentSchema = new Schema({
  id: Number,
  firstname: String,
  lastname: string,
  age: Number,
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
