import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { setFollow } from "../../features/user/userSlice";
import { useDispatch } from "react-redux";
const Suggestion = () => {
  const [suggestions, setSuggestions] = React.useState([]);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchSuggetion = async () => {
      const res = await axios.get(
        process.env.REACT_APP_API_URL + "/suggestions",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setSuggestions(res.data);
    };
    fetchSuggetion().catch((err) => {
      console.log(err);
    });
  }, []);
  /* -------------------------------------------------------------------------- */
  /*                                 FOLLOW_USER                                */
  /* -------------------------------------------------------------------------- */
  const followUser = (followId) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        process.env.REACT_APP_API_URL + "/follow",

        { followId: followId },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        dispatch(setFollow(res.data));
        setSuggestions(suggestions.filter((item) => item._id !== followId));
      })
      .catch((err) => {
        console.log("err:", err);
      });
  };
  return (
    <div className="suggestion-container mt-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-gray-400 text-sm leading-4 font-bold">
          Suggestions pour vous
        </h2>
        <Link to="#" className="font-semibold cursor-pointer text-black">
          Voir tout
        </Link>
      </div>
      <div>
        {suggestions?.map((user) => (
          <div
            key={user._id}
            className="flex justify-between items-center mb-2"
          >
            <div className="flex justify-start items-center">
              <img
                className="w-9 h-9 rounded-full"
                src={user?.avatar}
                alt="me"
              />
              <Link to={"/user/" + user?._id}>
                <span className="ml-2 text-sm leading-4 font-bold text-black">
                  {user?.name}
                </span>
              </Link>
            </div>
            <button
              onClick={() => {
                followUser(user?._id);
              }}
              className=" text-sm leading-3 font-semibold text-blue-400 cursor-pointer"
            >
              Suivre
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestion;
