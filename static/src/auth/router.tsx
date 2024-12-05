
import { RouteObject } from "react-router-dom";
import AuthLayout from "./layout";
import LoginPage from "./login";
import RegisterPage from "./register";

const authRouter: RouteObject = {
  path: "/",
  element: <AuthLayout />,
  children: [
    {
      path: "register",
      element: <RegisterPage />,
    },
    {
      path: "login",
      element: <LoginPage />,
    },
  ],
};

export default authRouter
