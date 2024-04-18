import "stream-chat-react/dist/css/v2/index.css"
import Home from "./Home"
import PrivateRouteValidator from "./PrivateRouteValidator"
import { Route, Routes } from "react-router-dom"
import Login from "./Login"

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/home"
          exact
          strict
          element={
            <PrivateRouteValidator>
              <Home />
            </PrivateRouteValidator>
          }
        />
        <Route path="/" exact strict element={<Login />} />
      </Routes>
    </>
  )
}

export default App
