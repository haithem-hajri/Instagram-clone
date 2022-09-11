import React, { createContext } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./page/auth/Login";
import Home from "./page/Home";
import Signup from "./page/auth/Signup";
import Navbar from "./components/Navbar";
import AuthNavbar from "./components/AuthNavbar";
import { useLocation } from "react-router-dom";
import MyProfile from "./page/MyProfile";
import ProtectedRoute from "./components/ProtectedRoute"; 
import AuthRoute from "./components/AuthRoute";
import { SpinnerInfinity } from "spinners-react";
import EditProfile from "./page/EditProfile";
import UserProfile from "./page/UserProfile";
import Messenger from "./page/Messenger";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "./features/user/userSlice";
export const Usercontext = createContext();
//http://localhost:5000
//https://instagram5.herokuapp.com
export const Socket = io("https://instagram5.herokuapp.com");
const Routing = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} exact />
        <Route path="/my-profile/edit" element={<EditProfile />} exact />
        <Route path="/my-profile" element={<MyProfile />} exact />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/direct" element={<Messenger />} />
        <Route path="/direct/:friendId" element={<Messenger />} />
      </Route>

      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        }
      />
    </Routes>
  );
};
function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  // const [state, dispatch] = useReducer(reducer, initialState);
  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.user.loadingApp);
  React.useEffect(() => {
    if (user) {
      Socket.on("connection", () => {});
      Socket.emit("connect_user", user?._id);
      // Socket.emit('disconnect', state?.user?.id);
      Socket.on("disconnect", () => {
        //  Socket.emit('update_status', state?.user?.id);
        console.log("user disconnect");
      });
    }
  }, [user]);
  React.useEffect(() => { 
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getUser());
    }
  }, []); 

  return (
    <>
      {loading ? (
        <div
          style={{ height: window.innerHeight }}
          className="flex justify-center items-center w-full  text-center "
        >
          <SpinnerInfinity
            size={80}
            thickness={100}
            speed={100}
            color="rgba(172, 57, 59, 1)"
            secondaryColor="rgba(172, 57, 165, 1)"
          />
        </div>
      ) : (
        <>
          {location.pathname.toString().startsWith("/login") ||
          location.pathname.toString().startsWith("/signup") ? (
            <AuthNavbar />
          ) : (
            <Navbar />
          )}
          <div className="bg-[#fafafa] min-h-screen mt-16 	">
            <Routing />
          </div>
        </>
      )}
    </>
  );
}

export default App;
