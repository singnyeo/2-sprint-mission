import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export {PORT, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET};
