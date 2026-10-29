import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { OrderProvider } from "./context/OrderContext";
import { CategoryProvider } from "./context/CategoryContext";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/categories/Categories";
import AllProducts from "./pages/product/AllProducts";
import AddProduct from "./pages/product/AddProduct";
import ProductDetails from "./pages/product/ProductDetails";
import EditProduct from "./pages/product/EditProduct";
import Users from "./pages/users/Users";
import AddUser from "./pages/users/AddUser";
import UserDetails from "./pages/users/UserDetails";
import EditUser from "./pages/users/EditUser";
import Orders from "./pages/orders/Orders";
import AddOrder from "./pages/orders/AddOrder";
import OrderDetails from "./pages/orders/OrderDetails";
import OrderTracking from "./pages/orders/OrderTracking";
import EditOrder from "./pages/orders/EditOrder";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Profile from "./components/admin/Profile";
import Settings from "./components/admin/Settings";
import Notifications from "./components/admin/Notifications";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <OrderProvider>
          <ProductProvider>
            <CategoryProvider>
              <BrowserRouter>
                <Routes>
                  {/* ================================================= */}
                  {/* PUBLIC ROUTES */}
                  {/* ================================================= */}

                  <Route path="/" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  {/* ================================================= */}
                  {/* PROTECTED ROUTES */}
                  {/* ================================================= */}

                  <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<DashboardLayout />}>
                      {/* Dashboard */}
                      <Route index element={<Dashboard />} />

                      {/* Profile & Settings */}
                      <Route path="profile" element={<Profile />} />
                      <Route path="settings" element={<Settings />} />

                      {/* Notifications */}
                      <Route path="notifications" element={<Notifications />} />
                      <Route path="categories" element={<Categories />} />

                      {/* Products */}
                      <Route path="all/products" element={<AllProducts />} />
                      <Route path="add/product" element={<AddProduct />} />
                      <Route
                        path="all/products/:id"
                        element={<ProductDetails />}
                      />
                      <Route
                        path="product/:id/edit"
                        element={<EditProduct />}
                      />
                      {/* Management */}
                      <Route path="users" element={<Users />} />
                      <Route path="add/user" element={<AddUser />} />
                      <Route path="user/:id" element={<UserDetails />} />
                      <Route path="user/:id/edit" element={<EditUser />} />

                      <Route path="orders" element={<Orders />} />
                      <Route path="add/order" element={<AddOrder />} />
                      <Route path="orders/:id" element={<OrderDetails />} />
                      <Route
                        path="orders/:id/track"
                        element={<OrderTracking />}
                      />
                      <Route path="orders/:id/edit" element={<EditOrder />} />

                      {/* Analytics */}
                      <Route path="sales" element={<Sales />} />
                      <Route path="reports" element={<Reports />} />
                    </Route>
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </CategoryProvider>
          </ProductProvider>
        </OrderProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
