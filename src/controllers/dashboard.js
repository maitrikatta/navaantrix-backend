import csvtojson from "csvtojson";
import mongoose from "mongoose";
const { Schema } = mongoose;

const studentSchema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  firstname: String,
  lastname: String,
  age: Number,
});

const Student = mongoose.model("Student", studentSchema);

async function getJSONArr(filePath) {
  return csvtojson()
    .fromFile(filePath)
    .then((rows) => rows);
}

async function insertData(filePath) {
  const arr = await getJSONArr(filePath);
  if (!arr.length) return { err: true, message: "No records found in csv" };
  try {
    const data = await Student.insertMany(arr);
    if (data.length)
      return { err: false, message: `${data.length} fresh record inserted` };
  } catch (error) {
    if (error.code === 11000)
      return { err: true, message: "Records exists with same id" };
  }
}
async function updateData(filePath) {
  const arr = await getJSONArr(filePath);
  const docs = [];
  arr.forEach((doc) => {
    if (doc && doc.id) {
      const res = Student.updateOne({ id: doc.id }, doc);
      docs.push(res);
    }
  });
  try {
    const iDocs = await Promise.all(docs);
    const updateCount = iDocs.filter((item) => item.modifiedCount === 1);
    return {
      err: false,
      message: `${updateCount.length} item updated out of ${iDocs.length}`,
    };
  } catch (error) {
    console.log("Error while inserting docs:", error.message);
    return { err: false, message: error.message };
  }
}
async function deleteData(filePath) {
  const arr = await getJSONArr(filePath);
  const ids = arr.map((doc) => doc.id && doc.id);
  return Student.deleteMany({ id: { $in: ids } })
    .then((res) => ({
      err: false,
      message: { deletedCount: res.deletedCount },
    }))
    .catch((err) => ({ err: true, message: err.message }));
}
async function readData() {
  const arr = await Student.find({}, { _id: 0, __v: 0 });
  if (arr.length) return { err: false, data: arr, message: "Records found." };
  else return { err: false, message: "No records found." };
}
export { insertData, updateData, deleteData, readData };
