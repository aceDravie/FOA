import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import RootLayout from "./layouts/RootLayout";
import { AuthContext } from "./context/AuthContext";
import Theme from "./helpers/Theme";
import { ThemeProvider } from "@mui/material/styles";
import AllFoods from "./components/AllFoods";
import FoodCategory from "./components/FoodCategory";
import Orders from "./components/Orders";
function App() {
  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <ThemeProvider theme={Theme}>
        <BrowserRouter>
          <Routes>
            <Route>
              <Route path="/" element={<Welcome />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route
                path="dashboard"
                element={
                  <RequireAuth>
                    <RootLayout />
                  </RequireAuth>
                }
              >
                <Route path="" element={<Dashboard />} />
                <Route path="allFoods" element={<AllFoods />} />
                <Route path="foodCategory" element={<FoodCategory />} />
                <Route path="orders" element={<Orders />} />
                <Route />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
