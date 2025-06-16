<!-- App.svelte -->
<script>
  import { Route, router } from "tinro";
  import Login from "./pages/Login/Login.svelte";
  import Register from "./pages/Register/Register.svelte";
  import Welcome from "./pages/Welcome/Welcome.svelte";
  import Profile from "./pages/Profile/Profile.svelte";
  import MyProfile from "./pages/Profile/MyProfile.svelte";
  import Search from "./pages/Search/Search.svelte";
  import Favorite from "./pages/Favorite/Favorite.svelte";
  import Product from "./pages/Product/Product.svelte";
  import ProductDetail from "./pages/Product/ProductDetail.svelte";
  import Category from "./pages/Product/Category.svelte";
  import NewPassword from "./pages/NewPass/NewPassword.svelte";
  import Verificate from "./pages/Verificate/Verificate.svelte";
  import Order from "./pages/Order/Order.svelte";
  import TrackingOrder from "./pages/Order/TrackingOrder.svelte";
  import Map from "./pages/Map/Map.svelte";
  import Home from "./pages/Home/Home.svelte";
  import Restaurant from "./pages/Restaurant/Restaurant.svelte";
  import AdminPage from "./Admin/AdminPage/MainAdmin.svelte";
  import Customers from "./Admin/UserManager/Customers.svelte";
  import Orders from "./Admin/OrderManager/OrderManager.svelte";
  import Drivers from "./Admin/Driver/Drivers.svelte";
  import Analytics from "./Admin/Analytics/Analytics.svelte";
  import ProductOrderDetail from "./pages/Pay/ProductOrderDetail.svelte";
  import Checkout from "./pages/Pay/Checkout.svelte";
  import Pay from "./pages/Pay/Pay.svelte";

  function onLoginSuccess() {
    router.goto("/home");
  }

  function onGoHome() {
    router.goto("/home");
  }

  function onLogout() {
    router.goto("/login");
  }

  function onLoginAdmin() {
    router.goto("/admin");
  }

  function onSignUp() {
    router.goto("/login");
  }

  function onProductDetail(product) {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    router.goto(`/product/${product.id}`); // Điều hướng đến trang chi tiết sản phẩm với id cụ thể
  }

  function onSend() {
    router.goto("/validate");
  }

  function onOrder() {
    router.goto("/order");
  }

  function onTrackingOrder() {
    router.goto("/tracking-order");
  }

  function onPayment() {
    router.goto("/checkout");
  }
</script>

<main></main>

<Route path="/"><Welcome /></Route>
<Route path="/login"><Login {onLoginSuccess} {onLoginAdmin} {onLogout} /></Route
>
<Route path="/register"><Register {onSignUp} {onSend} /></Route>
<Route path="/newPass"><NewPassword {onSend} /></Route>
<Route path="/validate"><Verificate {onSignUp} {onSend}/></Route>
<Route path="/home"
  ><Home {onLogout} {onProductDetail} {onPayment} /></Route
>
<Route path="/order"><Order {onTrackingOrder}/></Route>
<Route path="/tracking-order/:id">
  <TrackingOrder />
</Route>
<Route path="/restaurant"><Restaurant /></Route>
<Route path="/search"><Search /></Route>
<Route path="/favorite"><Favorite /></Route>
<Route path="/profile"><Profile {onOrder} /></Route>
<Route path="/my-profile"><MyProfile /></Route>
<Route path="/product"><Product /></Route>
<Route path="/product/:id">
  <ProductDetail {onGoHome} />
</Route>
<Route path="/product/category">
  <Category />
</Route>
<Route path="map"><Map /></Route>
<Route path="/admin" let:params>
  <AdminPage />
  <Route path="customers"><Customers /></Route>
  <Route path="orders"><Orders /></Route>
  <Route path="drivers"><Drivers /></Route>
  <Route path="analytics"><Analytics /></Route>
</Route>

<Route path="/pay">
  <Pay />
</Route>
<Route path="/checkout">
  <Checkout />
</Route>
<Route path="/productOrderDetail">
  <ProductOrderDetail />
</Route>
