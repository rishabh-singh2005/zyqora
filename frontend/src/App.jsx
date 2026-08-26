import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "./app/store";
import { authSuccess } from "./features/auth/authSlice";
import axiosInstance from "./api/axiosInstance";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/user/Home";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import ProductList from "./pages/user/ProductList";
import ProductDetail from "./pages/user/ProductDetail";
import Cart from "./pages/user/Cart";
import OAuthSuccess from "./pages/user/OAuthSuccess";
import Checkout from "./pages/user/Checkout";
import Orders from "./pages/user/Orders";
import OrderDetail from "./pages/user/OrderDetail";
import Wishlist from "./pages/user/Wishlist";
import Profile from "./pages/user/Profile";
import Addresses from "./pages/user/Addresses";
import Notifications from "./pages/user/Notifications";
import Pricing from "./pages/user/Pricing";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import AdminCoupons from "./pages/admin/Coupons";
import AdminUsers from "./pages/admin/Users";
import About from "./pages/user/About";
import Contact from "./pages/user/Contact";
import Terms from "./pages/user/Terms";
import VerifyEmail from "./pages/user/VerifyEmail";

function AppContent() {
  const dispatch = useDispatch();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // ==================== RESTORE SESSION ON APP LOAD ====================
  useEffect(() => {
    axiosInstance
      .post("/api/auth/refresh")
      .then((res) => {
        return axiosInstance
          .get("/api/users/me", {
            headers: {
              Authorization: `Bearer ${res.data.accessToken}`,
            },
          })
          .then((userRes) => {
            dispatch(
              authSuccess({
                user: userRes.data.user,
                accessToken: res.data.accessToken,
              })
            );
          });
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false));
  }, [dispatch]);

  if (checkingAuth) {
    return (
      <p className="text-center py-20 text-muted font-body">
        Loading...
      </p>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                <AdminLayout>
                  <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                    <Route path="users" element={<AdminUsers />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;