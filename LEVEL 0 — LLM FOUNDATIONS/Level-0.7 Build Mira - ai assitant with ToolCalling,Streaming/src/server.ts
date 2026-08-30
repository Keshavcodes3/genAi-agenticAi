import "dotenv/config";

import app from "./app.js";
import { connectToDb } from "./config/database.js";

const PORT = Number(process.env.PORT ?? 4000);

const startServer = async (): Promise<void> => {
    try {
        await connectToDb();

        app.listen(PORT, () => {
            console.log(`Mira API running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start Mira:", error);
        process.exit(1);
    }
};

startServer();