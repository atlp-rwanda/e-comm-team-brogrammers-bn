import express from "express";
import env from "dotenv"
import cors from "cors";
import morgan from "morgan";
import allroutes from "./routes/index"
env.config();
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});



const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

app.use(allroutes)
app.use((req, res) => {
  res.status(404).json({message: 'Page not found'})
})

const port = process.env.PORT
app.listen(port, () => {
  console.log('server started,', port)
})
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
export default app