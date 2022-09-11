import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const FindUsers = (props) => {
  const {  setIsOpen } = props;
  const [users, setUsers] = React.useState(null);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (search.length > 1) {
      const token = localStorage.getItem("token");
      axios
        .get(
          process.env.REACT_APP_API_URL + "/search-users",
          { params: { search } },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          setUsers(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setUsers(null);
    }
  }, [search]);
  const handleNewConversation = (userId) => {
    // setConversationId(userId);
    // dispatch(newConversation({ members: {} }));
    setIsOpen(false);
  };
  return (
    <div className="w-full flex flex-col justify-center divide-y divide-gray-400">
      <div className="p-3">
        <p className="text-lg text-center font-semibold">Nouveau Message</p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="find user"
        className=" px-2 outline-none py-3 w-full h-full border-y border-solid border-gray-400"
      />

      <div className=" flex flex-col justify-center divide-y divide-gray-200">
        {users?.map((user) => (
          <Link
            to={"/direct/" + user?._id}
            onClick={() => handleNewConversation(user?._id)}
            key={user?._id}
            className="flex p-3 cursor-pointer items-center gap-4 bg-white hover:bg-gray-300"
          >
            <img
              className="w-8 h-8 rounded-full"
              src={user?.avatar}
              alt={user?.name}
            />
            <p className="text-sm font-semibold">{user?.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FindUsers;
