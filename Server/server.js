import dotenv from "dotenv";
dotenv.config();

import app from "./App.js"; 
import { server } from "./src/socket/socekt.js";

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
