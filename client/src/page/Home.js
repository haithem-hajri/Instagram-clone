import React from "react";
import Suggestion from "../components/home-components/Suggestion";
import PostCard from "../components/cards/PostCard";
import { SpinnerInfinity } from "spinners-react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../features/post/postSlice";
const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);
  const loading = useSelector((state) => state.post.isLoading);
  React.useEffect(() => {
    dispatch(getPosts());
  }, []);

  return (
    <div className="w-full h-full">  
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
        <div className="home-container flex m-auto justify-center">
          <div className="p-8">
            {posts?.map((post) => (
              <PostCard
                key={post._id}
                comments={post.comments}
                post={post}
                likes={post.likes}
              />
            ))}
          </div>
          <div className="p-8 md:hidden">
            <Suggestion />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
