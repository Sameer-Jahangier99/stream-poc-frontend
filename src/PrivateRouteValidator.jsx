import { Navigate } from "react-router-dom"

export default function PrivateRouteValidator({ children }) {
  const user = localStorage.getItem("User")
  const token = localStorage.getItem("Token")
  if (!user && !token) {
    return <Navigate to="/" replace />
  } else {
    return children
  }
}
