import express from "express";
import cors from "cors";
import multer from "multer";
import {
  insertData,
  updateData,
  deleteData,
  readData,
} from "./controllers/dashboard.js";
import { createObject } from "./controllers/obejects.js";

import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder for uploads.
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set a unique filename for each uploaded file.
  },
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/dashboard", upload.single("csvFile"), async (req, res) => {
  console.log(req.body);
  switch (req.body.action) {
    case "CREATE": {
      const data = await insertData(req.file.path);
      res.send(data);
      break;
    }
    case "UPDATE": {
      const data = await updateData(req.file.path);
      res.send(data);
      break;
    }
    case "DELETE": {
      const data = await deleteData(req.file.path);
      res.send(data);
      break;
    }
    case "READ": {
      const data = await readData();
      res.send(data);
      break;
    }
    default:
      res.send({ err: true, message: "Did not match action" });
  }
});

app.post("/objects", upload.none(), async (req, res) => {
  const data = await createObject(req.body);
  res.send({ err: false, message: data });
});
app.listen(8000, async () => {
  console.log(`Server is spinning on port:`, 8000);
  mongoose.connect("mongodb://127.0.0.1:27017/myapp").then((conn) => {
    console.log("Connected to database...");
  });
  const files = await fs.readdir("uploads");
  const deletedPromises = files.map((file) => {
    return fs.unlink(path.join("uploads", file));
  });
  Promise.all(deletedPromises);
});
