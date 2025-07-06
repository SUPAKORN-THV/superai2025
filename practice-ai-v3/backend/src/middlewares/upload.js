import multer from 'multer';
import { v4 as uuid } from 'uuid';
import path from 'path';

const storage = multer.diskStorage({
  destination: '/tmp',
  filename: (_, file, cb) => cb(null, `${uuid()}${path.extname(file.originalname)}`)
});

export default multer({ storage });