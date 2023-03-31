// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
import multer from 'multer';
import path from 'path';

export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, next) => {
    const ext = path.extname(file.originalname);
    const supported = ['.png', '.jpg', '.jpeg', '.webp'];
    if (!supported.includes(ext)) {
      next(new Error(`file type not supported\ntry ${supported} are supported`), false);
    }
    next(null, true);
  }
});
