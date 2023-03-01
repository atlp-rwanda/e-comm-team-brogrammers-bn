import { Sequelize } from "sequelize"


const dbUser = process.env.POSTGRES_USER
const dbPassword = process.env.POSTGRES_PASSWORD
const dbName = process.env.POSTGRES_DB
const dbHost = process.env.POSTGRES_HOST
const dbPort = process.env.POSTGRES_PORT


// const sequelize = new Sequelize(`postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`)

// Using this connection - the above env variables were not working
const sequelize = new Sequelize(`postgres://admin:admin123@database:5432/ecommerce`)

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connectDB()

export default sequelize
