import path from "path";
import cors from "cors";
import helmet from "helmet";
import express, { json, urlencoded } from "express";
import { db } from "@/config/database";
import routes from "@/routes";
import cookieParser from "cookie-parser";
import deserializeUser from "@/middleware/deserializeUser";
const http = require('http');

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(cookieParser());
app.use(json());
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'X-Access-Token', 'X-Key', 'Cookies', 'Cache-Control', 'Set-Cookie'],
  credentials: true
}
));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(urlencoded({ extended: true }));
app.use('/image', express.static(path.join(__dirname, "../../public/uploads")));
app.use(deserializeUser)

db.authenticate()
  .then(() => console.log("[DB] Connection has been established successfully."))
  .catch((error) =>
    console.error("[DB] Unable to connect to the database:", error)
  );

app.use(routes);

io.on('connection', (socket: any) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


export default server;