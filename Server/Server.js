import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Sử dụng CORS middleware để cho phép yêu cầu từ các nguồn khác nhau
app.use(cors());

// Middleware để parse JSON
app.use(express.json());

// Đường dẫn tới file db.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "db.json");

// Đọc dữ liệu từ db.json
let dbData = JSON.parse(fs.readFileSync(dbPath, "utf-8"));


// Endpoint lấy danh sách món ăn theo ID sản phẩm
app.get("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = dbData.products.find((item) => item.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

// Endpoint thêm món ăn vào giỏ hàng theo userId
app.post("/api/cart/:userId", (req, res) => {
  const { productId, quantity, userId, addOns } = req.body; //  userId được lấy từ id của user khi login

  // Kiểm tra xem sản phẩm có tồn tại không
  const product = dbData.products.find((item) => item.id === productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Khởi tạo cart cho user nếu chưa có
  if (!dbData.carts[userId]) {
    dbData.carts[userId] = [];
  }

  // Thêm sản phẩm vào giỏ hàng của user
  const cartItem = {
    id: dbData.carts[userId].length + 1,
    productId,
    quantity,
    userId,
    addOns: addOns || [],
    addedAt: new Date().toISOString(),
  };
  dbData.carts[userId].push(cartItem);

  // Ghi lại dữ liệu vào db.json
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), "utf-8");

  res.status(201).json({ message: "Product added to cart", cartItem });
});

// Endpoint lấy giỏ hàng của user theo userId
app.get("/api/cart/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const cart = dbData.carts[userId] || [];
  res.json(cart);
});

// Endpoint cập nhật giỏ hàng
app.patch("/api/cart/:userId/:itemId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const itemId = parseInt(req.params.itemId);
  const { quantity } = req.body;
  const addOns = req.body.addOns || [];

  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: "User ID must be an integer" });
  }
  if (!Number.isInteger(itemId)) {
    return res.status(400).json({ message: "Item ID must be an integer" });
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be a positive integer" });
  }

  if (!dbData.carts || !dbData.carts[userId]) {
    return res.status(404).json({ message: "Cart not found for this user" });
  }

  const item = dbData.carts[userId].find(item => item.id === itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  item.quantity = quantity;
  item.addOns = addOns;

  try {
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), "utf-8");
    res.status(200).json({ message: "Cart item updated", item });
  } catch (error) {
    console.error("Error writing to db.json:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint tạo đơn hàng từ giỏ hàng
app.post("/api/orders", (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const cart = dbData.carts[userId] || [];
  if (cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const order = {
    id: dbData.orders.length + 1,
    userId,
    items: [...cart],
    total: cart.reduce((sum, item) => sum + (dbData.products.find(p => p.id === item.productId)?.price || 0) * item.quantity, 0),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  dbData.orders.push(order);
  dbData.carts[userId] = []; // Xóa giỏ hàng sau khi tạo đơn

  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), "utf-8");

  res.status(201).json({ message: "Order created", order });
});

// Endpoint lấy danh sách đơn hàng của user
app.get("/api/orders", (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const userOrders = dbData.orders.filter(order => order.userId === userId);
  res.json(userOrders);
});

// Endpoint lấy danh sách sản phẩm
app.get("/api/products", (req, res) => {
  res.json(dbData.products);
});

// Endpoint đăng ký người dùng mới
app.post("/api/register", (req, res) => {
  const { email, name, password } = req.body;

  const existingUser = dbData.users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = {
    id: dbData.users.length + 1,
    email,
    name,
    password,
    role: 2,
  };

  dbData.users.push(newUser);
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), "utf-8");

  res.status(201).json({ message: "Registration successful", user: newUser });
});

// Endpoint đăng nhập
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = dbData.users.find(
    (user) => user.email === email && user.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    user: { id: user.id, name: user.name, role: user.role },
  });
});

// Chạy server
app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});