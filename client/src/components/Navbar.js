import React from "react";
import HomeIcon from "../icons/HomeIcon";
import InboxIcon from "../icons/InboxIcon";
import CreatePostIcon from "../icons/CreatePostIcon";
import NotificationIcon from "../icons/NotificationIcon";
import InstaIcon from "../icons/InstaIcon";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import CreatePost from "./posts/CreatePost";
import Search from "./Search";
import axios from "axios";
import { Socket } from "../App";
import useOutsideClick from "../helpers/useOutsideClick";
import Notifications from "./Notifications";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";
import { updateNotifications } from "../features/user/userSlice";
import { useLocation } from "react-router-dom";
import {
  setOnlineNotifications,
  getmessageNotifications,
} from "../features/user/userSlice";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "500px",
    minHeight: "50vh",
    zIndex: "99999",
    maxHeight: "90vh",
    padding: 0,
  },
};
Modal.defaultStyles.overlay.backgroundColor = "rgba(0,0,0,0.75)";
//Modal.defaultStyles.overlay.opacity = "0.6";

const Navbar = () => {
  const dispatch = useDispatch();
  const wrapperRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const notificationRef = React.useRef(null);

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const notifications = useSelector((state) => state.user.notifications);
  const messageNotifications = useSelector(
    (state) => state.user.messagesNotification
  );
  /********DropDowns******/
  const [profileMenu, setProfileMenu] = React.useState(false);
  const [SearchMenu, setSearchMenu] = React.useState(false);
  const [notificationMenu, setNotificationMenu] = React.useState(false);
  const [readedNotification, setReadedNotification] = React.useState();
  /*********************/
  const [users, setUsers] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const location = useLocation();
  const user = useSelector((state) => state.user.user);

  useOutsideClick(searchRef, SearchMenu, setSearchMenu);
  useOutsideClick(wrapperRef, profileMenu, setProfileMenu);
  useOutsideClick(notificationRef, notificationMenu, setNotificationMenu);
  /* ----------------------- GET_NOTIFICATIONS_MESSAGES ----------------------- */
  React.useEffect(() => {
    dispatch(getmessageNotifications());
  }, []);

  React.useEffect(() => {
    let isApiSubscribed = true;
    Socket.on("messageNotification", (msg) => {
      console.log("messageNotification", msg);
      if (isApiSubscribed) {
        dispatch(getmessageNotifications());
      }
    });
    return () => {
      // cancel the subscription
      isApiSubscribed = false; 
    };
  }, []);
  /* ----------------------- GET_NOTIFICATIONS ----------------------- */
  React.useEffect(() => {
    if (notifications) {
      const not = notifications.filter(
        (notification) => notification?.readed === false
      );
      setReadedNotification(not.length);
    }
  }, [notifications]);
  React.useEffect(() => {
    let isApiSubscribed = true;
    Socket.on("notifications", (msg) => {
      if (isApiSubscribed) {
        dispatch(setOnlineNotifications(msg));
      }
    });
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  }, []);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  const logoutUser = () => {
    setProfileMenu(false);
    dispatch(logout());
  };

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

  const handleNotification = () => {
    setNotificationMenu(!notificationMenu);
    dispatch(updateNotifications(user?._id));
  };

  return (
    <>
      <div className="h-16  border-b border-solid border-gray-100 fixed w-full z-50 top-0 bg-white ">
        <div className="nav-wrapper max-w-6xl h-full m-auto flex justify-between items-center ">
          <Link to="/">
            <InstaIcon />
          </Link>
          <div ref={searchRef}>
            <input
              value={search}
              onFocus={() => setSearchMenu(true)}
              placeholder="Rechercher"
              className="bg-gray-200 px-2 py-1 rounded md:hidden relative"
              style={{ minWidth: "125px", height: " 36px", width: "268px" }}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <div className="absolute w-[300px] ">
              {SearchMenu && (
                <Search
                  setSearchMenu={setSearchMenu}
                  SearchMenu={SearchMenu}
                  users={users}
                />
              )}
            </div>
          </div>

          <div className="flex items-center content-center justify-end">
            <Link to="/">
              <button>
                <HomeIcon />
              </button>
            </Link>

            <Link to="/direct" className="relative cursor-pointer">
              <button>
                <InboxIcon />
              </button>
              {!location?.pathname.startsWith("/direct") &&
                messageNotifications?.length > 0 && (
                  <span
                    className="absolute bg-red-500 rounded-full right-[8px]
                 bottom-[20px] py-[2px] px-[6px] text-white text-xs  "
                  >
                    {messageNotifications?.length}
                  </span>
                )}
            </Link>

            <div>
              <button onClick={openModal}>
                <CreatePostIcon />
              </button>
            </div>

            {
              <div className="relative cursor-pointer" ref={notificationRef}>
                <button onClick={handleNotification} className="relative">
                  <NotificationIcon />
                </button>
                {readedNotification > 0 && (
                  <span
                    className="absolute bg-red-500 rounded-full right-[8px]
                 bottom-[20px] py-[2px] px-[6px] text-white text-xs  "
                  >
                    {readedNotification}
                  </span>
                )}
                <div className="absolute w-[300px]  right-0">
                  {notificationMenu && (
                    <Notifications notifications={notifications} />
                  )}
                </div>
              </div>
            }

            <div ref={wrapperRef} className="relative">
              <button onClick={() => setProfileMenu(!profileMenu)}>
                <img
                  className="w-8 h-8 rounded-full cursor-pointer  relative "
                  //  id="menu-button"
                  src={user?.avatar}
                  alt="pic"
                />
              </button>

              {/*********************DROPDOWN MENU********************/}

              <div
                className={
                  profileMenu
                    ? "transition-all duration-1000 absolute right-0  mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    : "hidden"
                }
              >
                <div className="py-1">
                  {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
                  <Link
                    onClick={() => setProfileMenu(false)}
                    to="/my-profile"
                    className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100  "
                  >
                    Profil
                  </Link>
                  <Link
                    to="#"
                    onClick={() => setProfileMenu(false)}
                    className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Paramètres
                  </Link>
                </div>
                <div className="py-1">
                  <Link
                    to="#"
                    onClick={logoutUser}
                    className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Déconnexion
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <CreatePost setIsOpen={setIsOpen} />
      </Modal>
    </>
  );
};

export default Navbar;
