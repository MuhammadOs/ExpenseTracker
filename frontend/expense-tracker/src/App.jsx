import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import Settings from "./pages/Dashboard/Settings";
import Budget from "./pages/Dashboard/Budget";
import Goals from "./pages/Dashboard/Goals";
import UserProvider from "./context/UserContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signUp" element={<SignUp />}></Route>
            <Route path="/dashboard" element={<Home />}></Route>
            <Route path="/income" element={<Income />}></Route>
            <Route path="/expense" element={<Expense />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
            <Route path="/budget" element={<Budget />}></Route>
            <Route path="/goals" element={<Goals />}></Route>
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  //check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
