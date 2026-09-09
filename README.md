# ITJobs — Backend API

REST API tuyển dụng IT (ITJobs): ứng viên tìm việc / nộp CV, nhà tuyển dụng quản lý tin tuyển dụng & hồ sơ ứng tuyển. Frontend chạy CORS tại `http://localhost:3000`, backend mặc định cổng **4000**.

---

## Repository

| Thành phần | Link |
| ---------- | ---- |
| Backend (repo này) | https://github.com/thaivanthi2005/ITJobs_BE |

---

## Tính năng chính

### Ứng viên (User)

- Đăng ký / đăng nhập / đăng xuất
- Cập nhật hồ sơ cá nhân (họ tên, phone, avatar upload Cloudinary)
- Kiểm tra phiên đăng nhập (`/auth/check`) — phân biệt user / company theo JWT
- Nộp CV ứng tuyển (upload file CV lên Cloudinary)
- Xem danh sách CV đã gửi (kèm thông tin job + công ty, trạng thái)

### Nhà tuyển dụng (Company)

- Đăng ký / đăng nhập / đăng xuất
- Cập nhật hồ sơ công ty (logo, địa chỉ, mô hình, mô tả…)
- CRUD tin tuyển dụng (tạo / danh sách có phân trang / chi tiết sửa / cập nhật / xóa)
- Upload tối đa **8 ảnh** mô tả job (Cloudinary)
- Quản lý CV ứng tuyển: danh sách, chi tiết (đánh dấu đã xem), đổi trạng thái, xóa
- Danh sách công ty công khai + trang chi tiết công ty kèm job đang đăng

### Công khai (không cần đăng nhập)

- Danh sách thành phố (`/city/list`)
- Tìm kiếm job: ngôn ngữ / công nghệ, thành phố, công ty, từ khóa, vị trí, hình thức làm việc + phân trang
- Chi tiết tin tuyển dụng
- Nộp CV ứng tuyển

---

## Công nghệ sử dụng

| Thành phần        | Công nghệ                                                                 |
| ----------------- | ------------------------------------------------------------------------- |
| Runtime           | Node.js + **TypeScript**                                                  |
| Backend           | **Express 5**                                                             |
| Database          | **MongoDB** + **Mongoose 9**                                              |
| Auth              | **JWT** (`jsonwebtoken`) lưu cookie `token` (httpOnly, hết hạn **1 ngày**) — dùng cho **user và company** |
| Mật khẩu          | **bcryptjs** (salt rounds 10)                                             |
| Cookie            | `cookie-parser`                                                           |
| CORS              | `cors` — origin `http://localhost:3000`, `credentials: true`              |
| Validate          | **Joi** (register / login user & company, apply CV)                       |
| Upload ảnh / file | **Multer** + **multer-storage-cloudinary** → **Cloudinary**               |
| Env               | `dotenv`                                                                  |
| Dev               | **Nodemon** + **tsx** (`npm start`)                                       |
| Package manager   | npm / yarn                                                                |

### Auth hoạt động thế nào

1. Login user / company thành công → `jwt.sign({ id, email })` với `JWT_SECRET`, `expiresIn: "1d"` → set cookie `token` (httpOnly, `sameSite: "lax"`, `secure` khi `NODE_ENV=production`).
2. Middleware `verifyTokenUser` / `verifyTokenCompany` đọc `req.cookies.token` → `jwt.verify` → load account từ collection tương ứng → gắn `req.account`.
3. `/auth/check` verify token rồi trả `infoUser` **hoặc** `infoCompany` tùy account tồn tại.
4. `/auth/logout` → `clearCookie("token")`.

### Quy tắc mật khẩu (Joi)

Ít nhất **8 ký tự**, có chữ hoa, chữ thường, số và ký tự đặc biệt `@$!%*?&`.

---

## Cấu trúc thư mục

```
Product_JOB_BE/
├── config/              # Kết nối MongoDB
├── controller/          # Logic API (user, company, job, auth, search, city)
├── helper/              # Cloudinary storage (Multer)
├── interfaces/          # Kiểu Request mở rộng (req.account)
├── middleware/          # verifyTokenUser, verifyTokenCompany
├── model/               # Mongoose schemas
├── router/              # Route theo module + index mount
├── validates/           # Joi validate body
├── index.ts             # Entry point (Express + CORS + cookie)
├── tsconfig.json
├── package.json
└── .env                 # Biến môi trường (không commit)
```

### Collections MongoDB

| Model           | Collection         | Mô tả                          |
| --------------- | ------------------ | ------------------------------ |
| `AccountUser`   | `accounts-user`    | Tài khoản ứng viên             |
| `AccountCompany`| `accounts-company` | Tài khoản nhà tuyển dụng       |
| `Job`           | `jobs`             | Tin tuyển dụng                 |
| `CV`            | `cvs`              | Hồ sơ ứng tuyển                |
| `City`          | `cities`           | Danh mục thành phố             |

---

## Cài đặt & chạy local

### Yêu cầu

- Node.js >= 18
- MongoDB (local hoặc Atlas)
- Tài khoản Cloudinary (avatar, logo, ảnh job, file CV)
- Frontend (nếu test full flow) chạy tại `http://localhost:3000`

### Các bước

```bash
# 1. Clone repository
git clone https://github.com/thaivanthi2005/ITJobs_BE.git
cd ITJobs_BE

# 2. Cài dependencies
npm install
# hoặc: yarn

# 3. Tạo file .env (xem mẫu bên dưới)

# 4. Chạy server (nodemon + tsx)
npm start
```

API: `http://localhost:4000`

---

## Biến môi trường (`.env`)

Tạo file `.env` ở thư mục gốc (đã có trong `.gitignore` — **không commit**):

```env
DATABASE=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=<your_jwt_secret>
NODE_ENV=development

cloud_name=<cloudinary_cloud_name>
api_key_image=<cloudinary_api_key>
api_secret_image=<cloudinary_api_secret>
```

| Biến                                         | Dùng cho                                      |
| -------------------------------------------- | --------------------------------------------- |
| `DATABASE`                                   | Chuỗi kết nối MongoDB (Mongoose)              |
| `JWT_SECRET`                                 | Ký & verify JWT (bắt buộc login user/company) |
| `NODE_ENV`                                   | `production` → cookie `secure: true` (HTTPS)  |
| `cloud_name` / `api_key_image` / `api_secret_image` | Cloudinary upload ảnh & file CV        |

> Port server đang hard-code **4000** trong `index.ts` (không đọc từ `.env`).

---

## Định tuyến API

Base URL local: `http://localhost:4000`

### Auth

| Method | Route          | Mô tả                                      | Auth |
| ------ | -------------- | ------------------------------------------ | ---- |
| `GET`  | `/auth/check`  | Kiểm tra token → trả `infoUser` / `infoCompany` | Cookie `token` |
| `GET`  | `/auth/logout` | Đăng xuất, xóa cookie `token`              | —    |

### User (ứng viên)

| Method  | Route            | Mô tả                         | Auth |
| ------- | ---------------- | ----------------------------- | ---- |
| `POST`  | `/user/register` | Đăng ký ứng viên              | —    |
| `POST`  | `/user/login`    | Đăng nhập → set cookie JWT    | —    |
| `PATCH` | `/user/profile`  | Cập nhật hồ sơ + avatar       | JWT User |
| `GET`   | `/user/cv/list`  | Danh sách CV đã nộp           | JWT User |

**Body register:** `fullName`, `email`, `password`  
**Body login:** `email`, `password`  
**Profile:** `multipart/form-data`, field ảnh `avatar`

### Company (nhà tuyển dụng)

| Method   | Route                      | Mô tả                              | Auth |
| -------- | -------------------------- | ---------------------------------- | ---- |
| `POST`   | `/company/register`        | Đăng ký công ty                    | —    |
| `POST`   | `/company/login`           | Đăng nhập → set cookie JWT         | —    |
| `PATCH`  | `/company/profile`         | Cập nhật hồ sơ + logo              | JWT Company |
| `POST`   | `/company/job/create`      | Tạo tin tuyển dụng (tối đa 8 ảnh)  | JWT Company |
| `GET`    | `/company/job/list`        | Danh sách job của công ty (`?page`) | JWT Company |
| `GET`    | `/company/job/edit/:id`    | Lấy chi tiết job để sửa            | JWT Company |
| `PATCH`  | `/company/job/edit/:id`    | Cập nhật job                       | JWT Company |
| `DELETE` | `/company/job/delete/:id`  | Xóa job                            | JWT Company |
| `GET`    | `/company/list`            | Danh sách công ty công khai (`?page`, `?limitItems`) | — |
| `GET`    | `/company/detail/:id`      | Chi tiết công ty + danh sách job   | —    |
| `GET`    | `/company/cv/list`         | CV ứng tuyển vào job của công ty   | JWT Company |
| `GET`    | `/company/cv/detail/:id`   | Chi tiết CV (đánh dấu `viewed`)    | JWT Company |
| `PATCH`  | `/company/cv/change-status`| Đổi trạng thái CV (`id`, `action`) | JWT Company |
| `DELETE` | `/company/cv/delete/:id`   | Xóa CV                             | JWT Company |

**Body register:** `companyName`, `email`, `password`  
**Profile / job create-edit:** `multipart/form-data` — logo field `logo`, ảnh job field `images`

### Job

| Method | Route           | Mô tả                                      | Auth |
| ------ | --------------- | ------------------------------------------ | ---- |
| `GET`  | `/job/detail/:id` | Chi tiết tin tuyển dụng + thông tin công ty | —  |
| `POST` | `/job/apply`    | Nộp CV (`fileCV` + thông tin ứng viên)     | —    |

**Body apply (Joi):** `jobId`, `fullName`, `email`, `phone` (VN), file `fileCV`  
Trạng thái CV mặc định: `status: "initial"`, `viewed: false`

### Search

| Method | Route     | Mô tả |
| ------ | --------- | ----- |
| `GET`  | `/search` | Tìm job theo query |

**Query params (tuỳ chọn):**

| Param         | Ý nghĩa                                      |
| ------------- | -------------------------------------------- |
| `keyword`     | Regex title / technologies (không phân biệt hoa thường) |
| `language`    | Lọc theo công nghệ (`technologies`)          |
| `city`        | Tên thành phố → lọc company thuộc city       |
| `company`     | Tên công ty                                  |
| `position`    | Vị trí                                       |
| `workingForm` | Hình thức làm việc                           |
| `page`        | Phân trang (mặc định 2 job / trang)          |

### City

| Method | Route        | Mô tả                | Auth |
| ------ | ------------ | -------------------- | ---- |
| `GET`  | `/city/list` | Danh sách thành phố  | —    |

---

## Response format

Hầu hết endpoint trả JSON dạng:

```json
{
  "code": "success",
  "message": "..."
}
```

Lỗi validate / nghiệp vụ thường dùng `"code": "error"` kèm `message` tiếng Việt.

---

## Gọi API từ Frontend

- Gửi request kèm **credentials** (cookie) vì JWT nằm trong cookie `token`, không dùng Bearer header.
- CORS đã cấu hình `credentials: true` và origin `http://localhost:3000`.
- Upload dùng `multipart/form-data` (Multer + Cloudinary).

Ví dụ (fetch):

```js
fetch("http://localhost:4000/user/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ email, password }),
});
```

---

## Tài liệu tham khảo

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/docs/guide.html)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Joi](https://joi.dev/api/)
- [Cloudinary](https://cloudinary.com/documentation)
- [Multer](https://github.com/expressjs/multer)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

## Liên hệ

|              |                                                 |
| ------------ | ----------------------------------------------- |
| **Họ tên**   | Thái Văn Thi                                    |
| **Email**    | thaivanthi2005@gmail.com                        |
| **GitHub**   | https://github.com/thaivanthi2005               |
| **LinkedIn** | https://www.linkedin.com/in/thaivanthi-dev2005/ |
