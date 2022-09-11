import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const initialState = {
  conversations: null,
  messages: null,
  isLoading: false,
  errors: null,
};
const messengerSlice = createSlice({
  name: "messenger",
  initialState,
  reducers: {
    SetIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
      state.errors = null;
    },
    setMessage: (state, action) => {
      state.messages = action.payload;
    },
    newMessage: (state, action) => {
      state.messages =  [...state.messages , action.payload];
    },
    newConversation: (state, action) => {
      state.conversations = [action.payload, ...state.conversations];
      state.messages = [];
    },
    errors: (state, action) => {
      state.isLoggedIn = false;
      state.error = true;
      state.errors = action.payload;
    },
  },
});
export const {
  setConversations,
  errors,
  SetIsLoading,
  newConversation,
  setMessage,
  newMessage
} = messengerSlice.actions;
export default messengerSlice.reducer;

//================================Action=======================================

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export function getConversations() {
  const token = localStorage.getItem("token"); 
  return async (dispatch) => {
    dispatch(SetIsLoading(true));
    api
      .get("/conversation", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        dispatch(SetIsLoading(false));
        dispatch(setConversations(response.data));
      })
      .catch((err) => {
        dispatch(SetIsLoading(false));
        dispatch(errors(err.response.data));
      });
  };
}
/* -------------------------------------------------------------------------- */
/*                                GET MESSAGES                                */
/* -------------------------------------------------------------------------- */

export function getMessages(receiverId) {
  const token = localStorage.getItem("token");
  return async (dispatch) => {
    //  dispatch(SetIsLoading(true));
    api
      .get("/message/" + receiverId, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        dispatch(SetIsLoading(false));
       if (response.data.messages) {
          dispatch(setMessage(response.data.messages));
       } else {
         dispatch(newConversation(response.data.conversation));
       }
      })
      .catch((err) => {
        // dispatch(SetIsLoading(false));
        dispatch(errors(err.response.data));
      });
  };
}

/* -------------------------------------------------------------------------- */
/*                                SEND_MESSAGE                                */
/* -------------------------------------------------------------------------- */

export function sendMessages(receiverId, text,setText) {
  const token = localStorage.getItem("token");
  return async (dispatch) => {
    // dispatch(SetIsLoading(true));
    api
      .post(
        "/message/" + receiverId,
        { text },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
           dispatch(newMessage(response.data.message));
           dispatch(getConversations())
           setText("")
      })
      .catch((err) => {
        //   dispatch(SetIsLoading(false));
        //  dispatch(errors(err.response.data));
      });
  };
}
