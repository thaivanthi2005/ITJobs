import express, { Request, Response } from "express";
import cors from "cors";
import router from "./router/index.route";
import dotenv from "dotenv";
import { connectDB } from "./config/database";

//Load biến môi trường
dotenv.config();

const app = express();
const port = 4000;
connectDB();
// Cấu hình CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, //cho phép gửi cookie
  }),
);
app.use(express.json());

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

// app.post("/user/register", (req: Request, res: Response) => {
//   console.log(req.body);
//   res.json({
//     code: "succes",
//     message: "Đăng kí tài khoản thành công",
//   });
// });
app.use("/", router);

app.listen(port, () => {
  console.log(`Website đang chạy trên cổng ${port}`);
});
