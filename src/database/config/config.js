import dotenv from 'dotenv'
dotenv.config()

export default{
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
  }
}