import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ConversationsComponent from "../components/messenger/ConversationsComponent";
import MessagesComponent from "../components/messenger/MessagesComponent";
import OpenConversation from "../components/messenger/OpenConversation";
import { Socket } from "../App";
import {
  getConversations,
  getMessages,
} from "../features/messenger/messengerSlice";
import { newMessage } from "../features/messenger/messengerSlice";
import { useParams, useLocation } from "react-router-dom";
const Conversations = () => {
  const conversations = useSelector((state) => state.messenger.conversations);
  const { friendId } = useParams();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const location = useLocation();
  React.useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);
  
  React.useEffect(() => {
    if (friendId) {
      dispatch(getMessages(friendId));
    }
  }, [friendId]);
  React.useEffect(() => {
    let isApiSubscribed = true;
     const locationId = location.pathname.split("/direct/")[1];
    Socket.on("message", (msg) => {
      if (isApiSubscribed) {
        dispatch(getConversations()).then(() => {
          if (locationId) {
            if (locationId === msg.sender) {
              dispatch(newMessage(msg));
            }
          }
        });
      }
    });
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  }, []);

  return (
    <div className="w-full h-full p-5">
      <div
        className="max-w-[935px] m-auto bg-white border border-solid
       border-gray-300 rounded-sm  flex divide-x divide-gray-300 min-h-[75vh]"
      >
        <div className="flex flex-col justify-start  w-[350px] divide-y divide-gray-300">
          <div className="p-6 text-center font-bold leading-4">
            {user?.name}
          </div>
          <div className="flex flex-col justify-start divide-y divide-gray-300">
            {conversations?.map((conversation) => (
              <ConversationsComponent
                key={conversation?._id}
                conversation={conversation}
                friendId={friendId}
              />
            ))}
          </div>
        </div>

        {/* -------------------------------------------------------------------------- */
        /*                                  MESSAGES                                  */
        /* -------------------------------------------------------------------------- */}
        {friendId ? (
          <MessagesComponent friendId={friendId} />
        ) : (
          <OpenConversation />
        )}
      </div>
    </div>
  );
};

export default Conversations;
