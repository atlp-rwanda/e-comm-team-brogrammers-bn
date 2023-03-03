import { Sequelize } from 'sequelize';

/**
 * The connection credentials used below,
 * come from /docker-compose.yml in database "environment"
 */
const sequelize = new Sequelize(
    `postgres://admin:admin123@database:5432/ecommerce`
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export default sequelize;
