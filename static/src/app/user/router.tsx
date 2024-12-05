import { RouteObject } from "react-router-dom";
import PrivateRoute from "../../components/privateRoute";
import AppLayout from "../layout";
import BasketPage from "./basket";
import ProfilePage from "./profile";

const userRouter: RouteObject = {
  path: "user",
  element: <PrivateRoute children={<AppLayout />} />,
  children: [
    {
      path: "profile",
      element: <ProfilePage />,
    },
    {
      path: "basket",
      element: <BasketPage />,
    },
  ],
};

export default userRouter

