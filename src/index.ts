import bodyParser from 'body-parser';
import express from 'express';
import auth from './routes/user.js';
import cors from 'cors';
import user from './schema/user.js';
import createUser from './utils/faker.js';
import {app} from './socket.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import "./notify-socket.js";
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

dotenv.config({ path: "./.env" });
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/user",auth );

app.get('/', async (req, res) => {
  //const data = new user(createUser());
  // console.log(createUser());
  const data = await user.find();
  res.send(data);
});


