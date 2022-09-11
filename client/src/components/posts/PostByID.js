import React from "react";
import axios from "axios";
import { addComment } from "../../features/post/postSlice";
import { useDispatch } from "react-redux";
const PostByID = (props) => {
  const { post } = props;
  const dispatch = useDispatch()
  const [comment, setComment] = React.useState("");
  const [comments, setComments] = React.useState([]);
  React.useEffect(() => {
    setComments(post?.comments);
  }, [post]);
  const makeComment = (postId) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        process.env.REACT_APP_API_URL + "/comment",
        { postId: postId, comment: comment },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setComment("");
        setComments(res.data.comments);
        dispatch(addComment(res.data))
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="w-full  max-w-[1000px]  min-h-[50vh] ">
      <div className=" flex  justify-center   divide-x min-h-[50vh] max-h-[80vh]">
        <div className="bg-black flex justify-center items-center py-4 w-1/2  ">
          <img src={post?.photo} alt="ok" className="object-cover" />
        </div>

        <div className="w-1/2 flex flex-col divide-y  ">
          <div className="flex justify-start p-3 items-center gap-2 ">
            <img
              className="w-8 h-8 rounded-full"
              src={post?.postedby?.avatar}
              alt="user"
            />
            <p className="text-sm font-semibold leading-4">
              {post?.postedby?.name}
            </p>
          </div>
          <div className="p-4 overflow-auto scroll">
            {comments?.map((cmt) => (
              <p key={cmt._id}>
                <span className="font-semibold text-sm">
                  {cmt.postedby.name} :
                </span>{" "}
                {cmt.text}
              </p>
            ))}
          </div>
          <div className="relative mt-auto ">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={1}
              name="message"
              className="w-full p-6 text-sm border-b-2 border-gray-400 rounded-lg outline-none opacity-50 focus:border-blue-400"
              placeholder="Enter your message"
            ></textarea>
            <span
              onClick={(e) => {
                e.preventDefault();
                makeComment(post?._id);
              }}
              className="text-sm leading-4 font-bold text-blue-400 absolute right-1.5 top-6 cursor-pointer"
            >
              publier
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostByID;
