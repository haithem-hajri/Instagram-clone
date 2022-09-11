import React from "react";
import { Link } from "react-router-dom";
const Notifications = (props) => {
  const { notifications } = props;
  return (
    <div
      className={
        "transition-all duration-1000 scroll  max-h-[50vh] overflow-auto  mt-2 w-[300px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      }
    >
      <div className="py-2 flex flex-col divide-y">
        {notifications?.map((notification, key) => (
          <Link
            to={"#"}
            key={key}
            onClick={() => {
              console.log("hello");
            }}
            // onClick={() => setSearchMenu(false)}

            className="text-gray-700 block px-4 py-3 text-sm hover:bg-gray-100 "
          >
            <div className="flex items-center gap-3">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={notification?.sender?.avatar}
                alt="user"
              />
              <div className="">
                <p className="text-sm text-blue-300 font-semibold leading-4">
                  {notification?.sender?.name}{" "}
                  <span className="text-black">
                    {notification?.type === "follow"
                      ? "followed you"
                      : notification?.type === "like"
                      ? "liked you post"
                      : notification?.type === "comment" &&
                        "commented on your post"}
                  </span>
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
