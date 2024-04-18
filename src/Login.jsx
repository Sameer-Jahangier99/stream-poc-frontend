import React, { useRef } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const usernameRef = useRef()
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const username = usernameRef.current?.value
      if (username == null || username === "") {
        return
      }

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user/login`,
        { id: username }
      )
      localStorage.setItem("User", JSON.stringify(response?.data?.user))
      localStorage.setItem("Token", response?.data?.token)
      navigate("/home")
      alert(response?.data?.message)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Login</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "25px",
        }}
      >
        <label htmlFor="userName">Username</label>
        <input id="userName" required ref={usernameRef} />
        <button type="submit" className="col-span-full">
          Login
        </button>
      </form>
    </>
  )
}

export default Login
