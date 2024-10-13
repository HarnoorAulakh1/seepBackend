import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: "./.env" });
const secret = process.env.secret;
export default function createToken(payload) {
    return jwt.sign(payload, secret, { expiresIn: '1h' });
}
