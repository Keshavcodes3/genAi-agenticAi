import app from "./src/App.js";
import connectDB from "./src/Config/Database.js";

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Trigger restart
