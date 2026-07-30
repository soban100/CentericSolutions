import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT || "4000");

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
