import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Sử dụng CORS middleware để cho phép yêu cầu từ các nguồn khác nhau
app.use(cors()); // Thêm dòng này trước các route

// Middleware để parse JSON
app.use(express.json());

// Đường dẫn tới file db.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "db.json");

// Đọc dữ liệu từ db.json
let dbData = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

// Endpoint lấy danh sách nhà hàng
app.get("/api/restaurants", (req, res) => {
  res.json(dbData.restaurants);
});

// Endpoint lấy thông tin một nhà hàng theo ID
app.get("/api/restaurants/:id", (req, res) => {
  const restaurantId = parseInt(req.params.id);
  const restaurant = dbData.restaurants.find(
    (item) => item.id === restaurantId
  );

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  res.json(restaurant);
});

// Endpoint lấy danh sách đơn hàng
app.get("/api/orders", (req, res) => {
  res.json(dbData.orders);
});

// Endpoint lấy danh sách sản phẩm
app.get("/api/products", (req, res) => {
  res.json(dbData.products);
});

// Endpoint đăng ký người dùng mới
app.post("/api/register", (req, res) => {
  const { email, name, password } = req.body;

  // Kiểm tra xem email đã tồn tại chưa
  const existingUser = dbData.users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // if (!name || !password || !email) {
  //   return res.status(400).json({ message: "All fields are required" });
  // }

  const newUser = {
    id: dbData.users.length + 1,
    email,
    name,
    password,
    role: 2, // Mặc định role là 2 (user)
  };

  dbData.users.push(newUser);

  // Ghi lại dữ liệu vào db.json
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), "utf-8");

  res.status(201).json({ message: "Registration successful", user: newUser });
});

// Endpoint đăng nhập
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Tìm người dùng dựa trên email và password
  const user = dbData.users.find(
    (user) => user.email === email && user.password === password
  );
  if (user.role === 1) {
    // Nếu là người dùng bình thường
    console.log("User role: User");
  } else if (user.role === 2) {
    // Nếu là người dùng quản lý
    console.log("User role: Manager");
  }
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Trả về thông tin người dùng và role
  res.json({
    message: "Login successful",
    user: { id: user.id, name: user.name, role: user.role },
  });
});

// Chạy server
app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});
