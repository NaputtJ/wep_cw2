import { createBrowserRouter } from "react-router-dom";
import appRouter from "./app/router";
import authRouter from "./auth/router";
import sellerRouter from "./app/seller/router";
import userRouter from "./app/user/router";

const router = createBrowserRouter([
  appRouter,
  sellerRouter,
  authRouter,
  userRouter,
]);

export default router
