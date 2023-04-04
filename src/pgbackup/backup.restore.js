/* eslint-disable no-unused-vars */
import { exec } from 'child_process';
import config from './backupconfig';

const restore = (filename, cb, ecb) => {
  if (filename) {
    let cmd;
    if (config.db.url && config.db.url !== null) {
      cmd = `psql -d ${config.db.url} < ./${config.storage.path}/${filename}`;
    } else {
      cmd = `psql -h ${config.db.host} -p ${config.db.port} -U ${config.db.user} -d ${config.db.database} < ./${config.storage.path}/${filename}`;
    }

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        if (ecb) ecb(`Restore failed: ${error.message}`);
      } else if (cb) cb();
    });
  }
};

export default restore;

/**
 * restore a specific backup file
 * in terminal run:
 *   - npm run pgrestore <backup file>
*/
restore(process.argv.splice(2).join(' '));
