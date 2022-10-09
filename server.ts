import express from 'express'
import cors from 'cors'
import routes from './src/routes/routes'
import * as dotenv from 'dotenv'
import { initAirtable } from './src/utils/helper-airtable'
import { initMixpanel } from './src/utils/helper-mixpanel'
import { User } from "./src/models/user";

dotenv.config()
const PORT = Number(process.env.PORT) || 4080;

declare global {
    namespace Express {
        export interface Request {
            user?: User;
            jwt?: string;
        }
    }
}

const init = async () => {
    await initAirtable()
    await initMixpanel()

    const app = express();
    app.use(express.json({ limit: "20mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    app.use('/v1', routes);

    // Listen
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

init()
