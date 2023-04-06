/* eslint-disable no-unused-vars */
import { exec } from 'child_process';
import { CronJob } from 'cron';
import moment from 'moment';
import config from './backupconfig';

const backup = () => {
  const date = moment().format('YYYYMMDD-HHmmss');
  const filename = `${config.storage.path}/backup-${date}.sql`;

  let cmd;
  if (config.db.url && config.db.url !== null) {
    cmd = `pg_dump -d ${config.db.url} -f ${filename}`;
  } else {
    cmd = `pg_dump -h ${config.db.host} -p ${config.db.port} -U ${config.db.user} -F c -b -v -f ${filename} ${config.db.database}`;
  }
  return exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup failed: ${error.message}`);
    }
  });
};

const job = new CronJob(config.schedule, backup, null, true, 'UTC');

job.start();
