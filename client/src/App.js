import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/Home";
import Bars from "./components/Bars";
import Hotels from "./components/Hotels";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Footer from "./components/Footer";
import RestaurantDetails from "./components/RestaurantDetails";
import FoodDetails from "./components/FoodDetails";
import RestaurantSearch from "./components/RestaurantSearch";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import { useSelector } from "react-redux";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ed5a6b",
    },
    secondary: {
      main: "#e91e63",
    },
  },
  typography: {
    fontFamily: "Quicksand",
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

function App() {
  const { isAuth } = useSelector((state) => state.auth);
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="bars" element={<Bars />} />
            <Route path="hotels" element={<Hotels />} />
            <Route path="restaurant-search" element={<RestaurantSearch />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgotpassword" element={<ForgotPassword />} />
            <Route path="resetpassword/:id" element={<ResetPassword />} />
            <Route path="restaurant/:id" element={isAuth ? <RestaurantDetails /> : <Navigate to="login" />} />
            <Route path="food/:id" element={<FoodDetails />} />
            <Route path="user/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
