import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const initialState = {
  user: null,
  error: false,
  isLoading: false,
  loginErrors: null,
  SignupErrors: null,
  followers: null,
  following: null,
  notifications: null,
  loadingApp: false,
  errors: null,
  messagesNotification: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SignupErrors: (state, action) => {
      state.SignupErrors = action.payload;
    },
    LoginErrors: (state, action) => {
      state.loginErrors = action.payload;
    },
    SetIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    SetLoadingApp: (state, action) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.loginErrors = null;
      state.errors = null;
      state.followers = action.payload.user.followers;
      state.following = action.payload.user.following;
      state.notifications = action.payload.notifications;
    },
    setMessageNotfication: (state, action) => {
      state.messagesNotification = action.payload;
    },
    setNewMessageNotfication: (state, action) => {
      state.messagesNotification = [action.payload, ...state.notifications];
    },
    setUpdate: (state, action) => {
      state.user = action.payload.user;
      state.errors = null;
    },
    setFollow: (state, action) => {
      state.followers = action.payload.user.followers;
      state.following = action.payload.user.following;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setOnlineNotifications: (state, action) => {
      state.notifications = [
        action.payload.notifcationResult,
        ...state.notifications,
      ];
    },
    clear_state: (state) => {
      state.user = null;
      state.token = undefined;
      state.followers = null;
      state.following = null;
      state.notifications = null;
    },
    errors: (state, action) => {
      state.error = true;
      state.errors = action.payload;
    },
    clearErrors: (state, action) => {
      state.error = false;
      state.errors = null;
    },
  },
});
export const {
  clearErrors,
  setUser,
  errors,
  clear_state,
  SetIsLoading,
  setUpdate,
  setFollow,
  setNotifications,
  setOnlineNotifications,
  SetLoadingApp,
  SignupErrors,
  LoginErrors,
  setMessageNotfication,
  setNewMessageNotfication,
} = userSlice.actions;
export default userSlice.reducer;

//================================Action=======================================

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ===== Signup User =====//
export function signup(formData, navigate) {
  return async (dispatch) => {
    dispatch(SetIsLoading(true));
    api
      .post("/signup", formData)
      .then((response) => {
        dispatch(SetIsLoading(false));
        navigate("/login");
      })
      .catch((err) => {
        dispatch(SetIsLoading(false));
        dispatch(SignupErrors(err.response.data));
      });
  };
}
//=====LOGIN======//

export function login(data, navigate) {
  return async (dispatch) => {
    dispatch(SetIsLoading(true));
    api
      .post("/signin", data)
      .then((response) => {
        dispatch(SetIsLoading(false));
        dispatch(setUser(response.data));
        localStorage.setItem("token", response.data.token);
        navigate("/");
      })
      .catch((err) => {
        dispatch(SetIsLoading(false));
        dispatch(LoginErrors(err.response.data));
      });
  };
}

//=====LOGOUT=====//
export function logout() {
  return async (dispatch) => {
    dispatch(clear_state());
    localStorage.clear();
  };
}

//=====GET_USER====//
export function getUser() {
  const token = localStorage.getItem("token");
  return async (dispatch) => {
    dispatch(SetLoadingApp(true));
    api
      .get("/user", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        dispatch(setUser(response.data));
        dispatch(SetLoadingApp(false));
      })
      .catch((err) => {
        dispatch(SetLoadingApp(false));
        dispatch(clear_state());
        localStorage.clear();
      });
  };
}
//=====Update-informations====//
export function updateUser(data, navigate) {
  const token = localStorage.getItem("token");
  return async (dispatch) => {
    dispatch(SetIsLoading(true));
    api
      .put("/update-informations", data, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        dispatch(setUpdate(response.data));
        dispatch(SetIsLoading(false));
        navigate("/my-profile");
      })
      .catch((err) => {
        dispatch(SetIsLoading(false));
        dispatch(errors(err.response.data));
      });
  };
}
//=====Update-avatar====//
export function updateAvatar(url, navigate) {
  const token = localStorage.getItem("token");
  return async (dispatch) => {
    dispatch(SetIsLoading(true));
    api
      .put(
        "/update-avatar",
        { avatar: url },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        dispatch(setUpdate(response.data));
        dispatch(SetIsLoading(false));
        navigate("/my-profile");
      })
      .catch((err) => {
        dispatch(SetIsLoading(false));
        dispatch(errors(err.response.data));
      });
  };
}
//===========Follow User ==========
export function followUser(userId) {
  const token = localStorage.getItem("token");
  return async (dispatch) => {
    api
      .put(
        "/follow",
        { followId: userId },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        dispatch(setFollow(response.data));
      })
      .catch((err) => {
        dispatch(errors(err.response.data));
      });
  };
}
//===========Follow User ==========
export function unFollowUser(userId) {
  const token = localStorage.getItem("token");
  return async (dispatch) => {
    api
      .put(
        "/unfollow",
        { unfollowId: userId },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        dispatch(setFollow(response.data));
      })
      .catch((err) => {
        dispatch(errors(err.response.data));
      });
  };
}
//===========updateNotifications ==========
export function updateNotifications(userId) {
  const token = localStorage.getItem("token");
  return async (dispatch) => {
    api
      .put(
        "/update-notifications",
        { userId: userId },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        dispatch(setNotifications(response.data));
      })
      .catch((err) => {
        //  dispatch(errors(err.response.data));
      });
  };
}
//get notifications messages

export function getmessageNotifications() {
  const token = localStorage.getItem("token");
  return async (dispatch) => {
    //  dispatch(SetLoadingApp(true));
    api
      .get("/message-notifications", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        dispatch(setMessageNotfication(response.data));
      })
      .catch((err) => {});
  };
}
export function updateMessageNotifications(senderId) {
  const token = localStorage.getItem("token");
  return async (dispatch) => {
    api
      .put(
        "/update-message-notifications",
        { sender: senderId },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        dispatch(setMessageNotfication(response.data));
      })
      .catch((err) => {
        //  dispatch(errors(err.response.data));
      });
  };
}
