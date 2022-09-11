import React from "react";
import InboxIcon from "../../icons/InboxIcon";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessages } from "../../features/messenger/messengerSlice";
import { updateMessageNotifications } from "../../features/user/userSlice";
const MessagesComponent = (props) => {
  const scrollRef = React.useRef();
  const ref = React.useRef();
  const { friendId } = props;
  const dispatch = useDispatch();
  const [text, setText] = React.useState("");
  const [chosenEmoji, setChosenEmoji] = React.useState(null);
  const [openChosenEmoji, setOpenChosenEmoji] = React.useState(false);
  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setText(text + emojiObject.emoji);
  };
  const user = useSelector((state) => state.user.user);
  const messages = useSelector((state) => state.messenger.messages);
  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    dispatch(sendMessages(friendId, text, setText));
  };
  const handleNotificationsMessage = () => {
    dispatch(updateMessageNotifications(friendId));  
  };
  return (
    <div className="flex flex-col  w-[585px]">
      <div className="divide-y divide-gray-300">
        <div className="p-6 text-center font-bold leading-4">{user?.name}</div>
        <div className="flex flex-col p-2 gap-3 scroll h-[63vh] overflow-auto">
          {messages?.map((message) => (
            <p
              ref={scrollRef}
              key={message?._id}
              className={
                message?.sender === user?._id
                  ? "my-messages"
                  : "friend-messages"
              }
            >
              {message?.text}
            </p>
          ))}
        </div>
      </div>
      <div className="mt-auto p-2 flex justify-center relative ">
        <button
          className="absolute left-[30px] top-[24px] text-[22px]"
          onClick={() => setOpenChosenEmoji(!openChosenEmoji)}
        >
          😅
        </button>
        {openChosenEmoji && (
          <div ref={ref} className="emoji">
            <Picker
              onEmojiClick={onEmojiClick}
              disableAutoFocus={true}
              native
              skinTone={SKIN_TONE_MEDIUM_DARK}
              style={{
                position: "absolute",
                zIndex: 1000,
                bottom: "10px",
              }}
            />
          </div>
        )}
        <input
          onChange={(e) => {
            setText(e.target.value);
          }}
          onFocus={()=>handleNotificationsMessage()}
          value={text}
          placeholder="send message"
          className="m-3 pl-12 w-full  rounded-full border border-solid border-gray-400 p-2 bg-white"
        />
        <div className="absolute right-[15px] top-[32px]" onClick={sendMessage}>
          <InboxIcon />
        </div>
      </div>

      {/* <div className="mt-auto">send messages</div> */}
    </div>
  );
};

export default MessagesComponent;
