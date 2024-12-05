import { useContext } from "react";
import UserContext from "../context/user";

export const useUser = () => {
  return useContext(UserContext);
};

