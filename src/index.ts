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
const corsOptions = {
  origin: [
    "https://ornate-buttercream-64f6ac.netlify.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "https://view-flax-xi.vercel.app",
    "https://view-rocky-aulakhs-projects.vercel.app/",
    "https://view-git-main-rocky-aulakhs-projects.vercel.app/",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

dotenv.config({ path: "./.env" });
app.use(cors(corsOptions));
app.options("/user/checklogin", (req, res) => {
  res.header("Access-Control-Allow-Origin", [
    "https://ornate-buttercream-64f6ac.netlify.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "https://view-flax-xi.vercel.app",
    "https://view-rocky-aulakhs-projects.vercel.app/",
    "https://view-git-main-rocky-aulakhs-projects.vercel.app/",
  ]);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204); // No Content
});

app.use(cookieParser());
app.use(bodyParser.json());

app.use("/user", auth);

app.get("/", async (req, res) => {
  //const data = new user(createUser());
  // console.log(createUser());
  const data = await user.find();
  res.send(data);
});
