import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const initialState = {
  posts: [],
  error: false,
  isLoading: false,
  errors: null,
  myPosts: [],
  postById:null
};
const postSlice = createSlice({ 
  name: "post",
  initialState,
  reducers: {
    SetIsLoading: (state, action) => {
      state.isLoading = action.payload; 
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.errors = null;
    },
    addPost:(state,action)=>{
      // state.posts = [...state.posts,action.payload.post];
      state.myPosts =state.myPosts.concat(action.payload.post)
      state.errors = null;
    },
    setMyPosts: (state, action) => {
      state.myPosts = action.payload;
      state.errors = null;
    },
    addComment: (state, action) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload._id
          ? {
              ...post,
              comments: action.payload.comments,
            }
          : post
      );
      state.myPosts = state.myPosts.map((post) =>
      post._id === action.payload._id
        ? {
            ...post,
            comments: action.payload.comments,
          }
        : post
    );
    },
    likeOrUnlike: (state, action) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload._id
          ? {
              ...post,
              likes: action.payload.likes,
            }
          : post
      );
    },
    clear_state: (state) => {
      state.posts = null;
    },
    errors: (state, action) => {
      state.isLoggedIn = false;
      state.error = true;
      state.errors = action.payload;
    },
  },
});
export const {
  setPosts,
  errors,
  clear_state,
  SetIsLoading,
  addComment,
  likeOrUnlike,
  setMyPosts,
  addPost,
} = postSlice.actions;
export default postSlice.reducer;

//================================Action=======================================

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export function getPosts() {
  const token = localStorage.getItem("token");
  return async (dispatch) => {
    dispatch(SetIsLoading(true));
    api
      .get("/allpost", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        dispatch(SetIsLoading(false));
        dispatch(setPosts(response.data));
      })
      .catch((err) => {
        dispatch(SetIsLoading(false));
        dispatch(errors(err.response.data));
      });
  };
}
//==============

//===========
export function getMyPosts() {
  const token = localStorage.getItem("token");
  return async (dispatch) => {
 //   dispatch(SetIsLoading(true));
    api
      .get("/myposts", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
       // dispatch(SetIsLoading(false));
        dispatch(setMyPosts(response.data));
      })
      .catch((err) => {
     //   dispatch(SetIsLoading(false));
        dispatch(errors(err.response.data));
      });
  };
}
//*****************/
//=======create new post 
export function createPost(url,title,setLoading,setIsOpen) {
  const token = localStorage.getItem("token");
  return async (dispatch) => {
    api
      .post(
        "/create-post",
        { photo: url, title: title },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setLoading(false)
        setIsOpen(false)
        dispatch(addPost(response.data));
       
      })
      .catch((err) => {
        dispatch(errors(err.response.data));
      });
  };
}
//======================
export function makeComment(postId, comment,setComment) {
  const token = localStorage.getItem("token");
  return async (dispatch) => {
    api
      .put(
        "/comment",
        { postId: postId, comment: comment },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        dispatch(addComment(response.data));
        setComment("")
      })
      .catch((err) => {
        dispatch(errors(err.response.data));
      });
  };
}

export function likePost(postId,likedBy) {
  const token = localStorage.getItem("token"); 
  return async (dispatch) => {
    api
      .put(
        "/like",
        { postId: postId ,likedBy:likedBy  },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        dispatch(likeOrUnlike(response.data));
      })
      .catch((err) => {
        dispatch(errors(err.response.data));
      });
  };
}
export function unLikePost(postId) {
  const token = localStorage.getItem("token");
  return async (dispatch) => {
    api
      .put(
        "/unlike",
        { postId: postId },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        dispatch(likeOrUnlike(response.data));
      })
      .catch((err) => {
        dispatch(errors(err.response.data));
      });
  };
}
