import app from './app'
import env from "dotenv"
env.config();
import { Sequelize } from 'sequelize';
const port = process.env.PORT || 6000

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
  });
app.listen(port,()=>{
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