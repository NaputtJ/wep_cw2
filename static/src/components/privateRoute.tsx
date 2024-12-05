import { useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useApi } from "../hook/api";

type PrivateRoutePros = {
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRoutePros> = ({ children }) => {
  const location = useLocation()
  const api = useApi()
  const navigate = useNavigate()

  useCallback(() => {
    api.post("/token/refresh").then((res) => {
      if (!res.status) {
        navigate("/login?cb=" + location.pathname)
      }
    })
  }, [])

  return children
}

export default PrivateRoute
