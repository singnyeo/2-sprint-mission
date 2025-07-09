import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import { PORT } from './lib/constants.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(router);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});