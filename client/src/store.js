import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import postReducer from "./features/post/postSlice";
import messegerReducer from "./features/messenger/messengerSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    messenger: messegerReducer,
  },
});
