import connectDB from "./db.js";
import app from "./app.js";
import { validateEnv } from "./config/env.js";
validateEnv();
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
