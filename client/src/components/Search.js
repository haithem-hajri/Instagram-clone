import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Search = (props) => {
  const { SearchMenu, users } = props;
  const state = useSelector((state) => state.user.user);
  return (
    <div
      className={
        SearchMenu
          ? "transition-all duration-1000  mt-2 w-[300px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          : "hidden"
      }
    >
      <div className="py-2 flex flex-col divide-y">
        {users?.map((user) => (
          <Link
            to={state._id === user?._id ? "/my-profile" : "/user/" + user?._id}
            key={user?._id}
            onClick={() => {
              console.log("hello");
            }}
            // onClick={() => setSearchMenu(false)}

            className="text-gray-700 block px-4 py-3 text-sm hover:bg-gray-100  "
          >
            <div className="flex items-center gap-3">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={user?.avatar}
                alt="user"
              />
              <p className="text-semibold leading-4 text-sm">{user?.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Search;
