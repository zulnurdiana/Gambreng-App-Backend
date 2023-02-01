import path from "path";
import cors from "cors";
import helmet from "helmet";
import express, { json, urlencoded } from "express";
import { db } from "@/config/database";
import routes from "@/routes";
const app = express();

app.use(json());
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'X-Access-Token', 'X-Key', 'Cookies', 'Cache-Control', 'Set-Cookie'],
  credentials: true
}
));
app.use(helmet());
app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
db.authenticate()
  .then(() => console.log("[DB] Connection has been established successfully."))
  .catch((error) =>
    console.error("[DB] Unable to connect to the database:", error)
  );
app.use(routes);
export default app;