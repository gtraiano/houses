import dotenv from 'dotenv';
import express from "express";
import cors from 'cors';
import db from '../src/db';
import housesRouter from './routes/houses';

// config
dotenv.config({ path: '../.env' });
const port = process.env.BACKEND_PORT || 4000;

const app = express();
// allow for cross origin requests
app.use(cors());
// serve welcome html
app.use('/', express.static('public'));
// houses route
app.use('/houses', housesRouter);

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  await db.init(true);
  console.log(`DB initialized [data origin: ${db.synced ? 'online' : 'local'}]`);
});