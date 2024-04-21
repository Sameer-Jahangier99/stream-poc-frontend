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
import { Attachment, AttachmentProps, ChannelListMessengerProps } from "stream-chat-react/dist/components"
import { MessageToSend, StreamMessage, useChannelActionContext, useChatContext } from "stream-chat-react/dist/context"
import { Button } from "../components/Button"
import { useLoggedInAuth } from "../context/AuthContext"
import arTranslation from "../arTranslation.json"
import "dayjs/locale/ar"
import GoogleMapReact from 'google-map-react';
import { useEffect, useState } from "react"

const { VITE_GOOGLE_MAP_API_KEY   }  = import.meta.env 
const apiKey = VITE_GOOGLE_MAP_API_KEY as string;

type ShareLocationModalProps = {
  setShareLocation: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShareLocationModal: React.FC<ShareLocationModalProps> = (props) => {
  const { setShareLocation } = props;
  const { sendMessage } = useChannelActionContext();

  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, []);

  const handleYes = async () => {
    const messageToSend: MessageToSend = {
      attachments: [{ type: 'map', latitude, longitude }],
    };

    try {
      await sendMessage(messageToSend);
    } catch (err) {
      console.log(err);
    }

    setShareLocation(false);
  };

  const handleNo = () => setShareLocation(false);

  return (
    <div className='share-location'>
      <div>Do you want to share your location in this conversation?</div>
      <div className='share-location-buttons'>
        <button disabled={!latitude || !longitude} onClick={handleYes}>
          Yes
        </button>
        <button onClick={handleNo}>No</button>
      </div>
    </div>
  );
};

type MapCenterProps = {
  lat: number;
  lng: number;
};

const MapCenter: React.FC<MapCenterProps> = () => <div className='map-center' />;

type ExtendedAttachment = {
  latitude?: number;
  longitude?: number;
};

type MapAttachmentProps<ExtendedAttachment> = {
  mapAttachment: StreamAttachment<ExtendedAttachment>;
};

const MapAttachment: React.FC<MapAttachmentProps<ExtendedAttachment>> = (props) => {
  const { mapAttachment } = props;
  const { latitude, longitude } = mapAttachment;

  if (!latitude || !longitude) {
    return (
      <div className='map-loading'>
        <LoadingIndicator size={30} />
      </div>
    );
  }

  // Construct Google Maps URL
  const googleMapsURL = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  const center = {
    lat: latitude,
    lng: longitude,
  };

  const handleMapClick = () => {
    // Open Google Maps in a new tab
    window.open(googleMapsURL, '_blank');
  };

  return (
    <div className='map-container' onClick={handleMapClick}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={center}
        defaultZoom={11}
        style={{ height: '250px', width: '250px' }}
        yesIWantToUseGoogleMapApiInternals
      >
        <MapCenter lat={center.lat} lng={center.lng} />
      </GoogleMapReact>
    </div>
  );
};


const CustomAttachment: React.FC<AttachmentProps> = (props) => {
  const { attachments } = props;

  if (attachments[0]?.type === 'map') {
    return <MapAttachment mapAttachment={attachments[0]} />;
  }

  return <Attachment {...props} />;
};

export function Home() {
  const { user, streamChat } = useLoggedInAuth()
  const [shareLocation, setShareLocation] = useState<boolean>(false);


  if (streamChat == null) return <LoadingIndicator />
  

  const locationHandler = (message: StreamMessage, event: React.BaseSyntheticEvent) => {
    setShareLocation(true);
  };

  const customMessageActions = { 'Share Location': locationHandler };

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
      <Channel Attachment={CustomAttachment}>
        <Window>
           {shareLocation && <ShareLocationModal setShareLocation={setShareLocation} />}
          <ChannelHeader />
          <MessageList customMessageActions={customMessageActions} />
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
