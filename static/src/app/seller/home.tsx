import { useNavigate } from "react-router-dom"


const HomePage = () => {
  const navigate = useNavigate()
  navigate("/seller/product")
  return <></>
}

export default HomePage
