import express from 'express';
import fs from 'fs';
import backupconfig from './backupconfig';
import restore from './backup.restore';
import isAuthenticated from '../middlewares/verifyToken';
import checkRole from '../middlewares/Checkrole';

const routes = express.Router();

const getTime = (file) => fs.statSync(`${file}`).mtime.getTime();
const getFiles = (folder) => (fs.readdirSync(folder)).sort((a, b) => getTime(`${folder}/${b}`) - getTime(`${folder}/${a}`));

routes.get(
  '/backups',
  isAuthenticated,
  checkRole(['admin']),
  (req, res) => {
    const backupPath = backupconfig.storage.path;
    const files = getFiles(backupPath);
    return res.json({ message: 'here is your backups', files });
  }
);

routes.get(
  '/restore',
  isAuthenticated,
  checkRole(['admin']),
  (req, res) => {
    try {
      const backupPath = backupconfig.storage.path;
      const backup = getFiles(backupPath)[0];

      if (!backup) return res.status(400).json({ message: 'no backup exist' });
      return restore(
        backup,
        () => res.json({ message: 'backups restored', backup }),
        (e) => res.status(500).json({ message: 'restore database fail', error: e })
      );
    } catch (error) {
      return res.status(500).json({ message: 'restore database fail' });
    }
  }
);

routes.get(
  '/restore/:filename',
  isAuthenticated,
  checkRole(['admin']),
  (req, res) => {
    try {
      const { filename } = req.params;
      const backupPath = backupconfig.storage.path;
      const file = `${backupPath}/${filename}`;
      if (!fs.existsSync(file)) {
        return res.status(400).json({ message: 'backup don\'t exist', filename });
      }

      return restore(
        filename,
        () => res.json({ message: 'backups restored', backup: file }),
        (e) => res.status(500).json({ message: 'restore database fail', error: e })
      );
    } catch (error) {
      return res.status(500).json({ message: 'restore database fail' });
    }
  }
);

export default routes;
