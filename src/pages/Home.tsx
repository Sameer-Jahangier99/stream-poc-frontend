import { useNavigate } from "react-router-dom"
import {
  LoadingIndicator,
  Chat,
  ChannelList,
  Channel,
  Window,
  MessageInput,
  MessageList,
  ChannelHeader,
  Streami18n,
} from "stream-chat-react"
import { ChannelListMessengerProps } from "stream-chat-react/dist/components"
import { useChatContext } from "stream-chat-react/dist/context"
import { Button } from "../components/Button"
import { useLoggedInAuth } from "../context/AuthContext"
import { useEffect, useState } from "react"
import arTranslation from "../arTranslation.json"
import "dayjs/locale/ar"

export function Home() {
  const { user, streamChat } = useLoggedInAuth()

  if (streamChat == null) return <LoadingIndicator />
  const i18nInstance = new Streami18n({
    timezone: "Asia/Baghdad",
    language: "ar",
    translationsForLanguage: arTranslation,
    dayjsLocaleConfigForLanguage: {
      months: [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ],
      monthsShort: [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ],
      calendar: {
        sameDay: "DD MMMM YYYY",
        lastDay: "اليوم الأخير",
        lastWeek: "الأسبوع الماضي",
        nextDay: "اليوم القادم",
        nextWeek: "الأسبوع القادم",
        sameElse: "L",
      },
    },
  })

  return (
    <Chat client={streamChat} i18nInstance={i18nInstance}>
      <ChannelList
        List={Channels}
        sendChannelsToList
        filters={{ members: { $in: [user.id] } }}
      />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  )
}

function Channels({ loadedChannels }: ChannelListMessengerProps) {
  const navigate = useNavigate()
  const { logout } = useLoggedInAuth()
  const { setActiveChannel, channel: activeChannel } = useChatContext()

  return (
    <div className="w-60 flex flex-col gap-4 m-3 h-full">
      <Button onClick={() => navigate("/channel/new")}>New Conversation</Button>
      <hr className="border-gray-500" />
      {loadedChannels != null && loadedChannels.length > 0
        ? loadedChannels.map((channel) => {
            const isActive = channel === activeChannel
            const extraClasses = isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 bg-gray-100"
            return (
              <button
                onClick={() => setActiveChannel(channel)}
                disabled={isActive}
                className={`p-4 rounded-lg flex gap-3 items-center ${extraClasses}`}
                key={channel.id}
              >
                {channel.data?.image && (
                  <img
                    src={channel.data.image}
                    className="w-10 h-10 rounded-full object-center object-cover"
                  />
                )}
                <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                  {channel.data?.name || channel.id}
                </div>
              </button>
            )
          })
        : "No Conversations"}
      <hr className="border-gray-500 mt-auto" />
      <Button onClick={() => logout.mutate()} disabled={logout.isLoading}>
        Logout
      </Button>
    </div>
  )
}
