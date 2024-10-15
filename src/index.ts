import bodyParser from "body-parser";
import express from "express";
import auth from "./routes/user.js";
import cors from "cors";
import user from "./schema/user.js";
import createUser from "./utils/faker.js";
import { app } from "./socket.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import "./notify-socket.js";
dotenv.config({ path: "./.env" });

const corsOptions = {
  origin: "https://view-bd5lrcnqx-rocky-aulakhs-projects.vercel.app", // Exact frontend domain
  methods: "GET,POST,PUT,DELETE",
  credentials: true, // Allow cookies and other credentials
};

app.options('*', cors(corsOptions)); 
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/user", auth);

app.get("/", async (req, res) => {
  //const data = new user(createUser());
  // console.log(createUser());
  const data = await user.find();
  res.send(data);
});
