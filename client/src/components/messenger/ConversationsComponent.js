import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const ConversationsComponent = (props) => {
  const { conversation, friendId } = props;
  const [friend, setFriend] = React.useState(null);
  const user = useSelector((state) => state.user.user);
  React.useEffect(() => {
    setFriend(conversation?.members?.find((m) => m._id !== user?._id));
  }, [conversation, friend, user]);
  const messageNotifications = useSelector(
    (state) => state.user.messagesNotification
  );

  return (
    <Link to={"/direct/" + friend?._id}>
      <div
        className={
          friendId === friend?._id
            ? "flex justify-start items-center p-4 gap-3 cursor-pointer bg-gray-200"
            : "flex justify-start items-center p-4 gap-3 cursor-pointer hover:bg-gray-200"
        }
      >
        <img
          className="w-14 h-14 rounded-full"
          src={friend?.avatar}
          alt="user"
        />
        <div className="flex flex-col justify-start ">
          <p className="text-xl font-none leading-5  whitespace-nowrap">
            {friend?.name}
          </p>
          <span className="text-gray-400  text-sm  rounded">
            {friend?.isOnline ? "OnLine" : "OffLine"}
          </span>
          {messageNotifications?.some(
            (e) => e?.sender?._id === friend?._id
          ) && (
            <p className="bg-red-500 p-1 text-xs text-white rounded-md text-center">
              new message
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ConversationsComponent;
