import env from 'dotenv';

env.config();

export default {
  schedule: process.env.DB_BACKUP_CLONE, // daily at midnight
  retention: 7, // number of backups to keep
  storage: {
    type: 'local', // can be 'local' or 'cloud'
    path: 'backups', // local path for backup files
    bucket: 'my-bucket', // S3 bucket for cloud storage
    region: 'us-east-1', // S3 region
  },
  db: {
    url: process.env.DATABASE_URL,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
  },
};
