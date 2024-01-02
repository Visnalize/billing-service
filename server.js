import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";
import testMode from "./middlewares/testmode.js";
import products from "./routes/products.js";
import verify from "./routes/verify.js";

configDotenv();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: /localhost|visnalize.com/ }));
app.use(testMode);
app.get("/verify", verify);
app.get("/products", products);
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
