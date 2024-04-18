import React from "react"
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
} from "stream-chat-react"

const Home = () => {
  const { VITE_STREAM_API_KEY } = import.meta.env

  const apiKey = VITE_STREAM_API_KEY
  const userId = JSON.parse(localStorage.getItem("User"))?.id
  const token = localStorage.getItem("Token")

  console.log("user and token", userId, token)
  const filters = { members: { $in: [userId] }, type: "messaging" }
  const options = { presence: true, state: true }
  const sort = { last_message_at: -1 }
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData: { id: userId },
  })
  if (!client) return <div>Loading..</div>
  return (
    <>
      <p>Stream POC</p>
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
      </Chat>
    </>
  )
}

export default Home
