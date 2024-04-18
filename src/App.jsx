// import {
//   Chat,
//   Channel,
//   ChannelList,
//   Window,
//   ChannelHeader,
//   MessageList,
//   MessageInput,
//   Thread,
//   useCreateChatClient,
// } from "stream-chat-react"
import "stream-chat-react/dist/css/v2/index.css"
import Home from "./Home"
import PrivateRouteValidator from "./PrivateRouteValidator"
import { Route, Routes } from "react-router-dom"
import Login from "./Login"

function App() {
  // const { VITE_STREAM_API_KEY } = import.meta.env

  // const apiKey = "wupygdmtf4zq"
  // const userId = "sameer"
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoic2FtZWVyIn0.wkNd_OzJoYfjXeI9qlCj7CWCXkMCPy_aRrU1Y-Alzi4"

  // const filters = { members: { $in: [userId] }, type: "messaging" }
  // const options = { presence: true, state: true }
  // const sort = { last_message_at: -1 }

  // const client = useCreateChatClient({
  //   apiKey,
  //   tokenOrProvider: token,
  //   userData: { id: userId },
  // })

  // if (!client) return <div>Loading...</div>
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
      {/* <p>Stream POC</p>
      <Chat client={client}>
        <ChannelList sort={sort} filters={filters} options={options} />
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat> */}
    </>
  )
}

export default App
