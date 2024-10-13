var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bodyParser from 'body-parser';
import auth from './routes/user.js';
import cors from 'cors';
import user from './schema/user.js';
import { app } from './socket.js';
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
app.use("/user", auth);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const data = new user(createUser());
    // console.log(createUser());
    const data = yield user.find();
    res.send(data);
}));
