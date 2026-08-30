import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

/** Always load Backend/.env regardless of process.cwd() */
const backendRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../..'
);

dotenv.config({ path: path.join(backendRoot, '.env') });
