import mongoose from "mongoose";

const { Schema } = mongoose;
async function createObject(body) {
  const { objectFields } = body;
  const Objects = new Schema({});
  const schema = {};
  if (objectFields && Array.isArray(objectFields)) {
    objectFields.forEach((field) => {
      schema[field.fieldName.toLowerCase()] = field.fieldType.toUpperCase();
    });
  }
  return schema;
}
async function getObject() {}

export { createObject, getObject };
