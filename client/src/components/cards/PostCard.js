import React from "react";
import LikeIcon from "../../icons/postIcons/LikeIcon";
import CommentIcon from "../../icons/postIcons/CommentIcon";
import SendIcon from "../../icons/postIcons/SendIcon";
import UnlikeIcon from "../../icons/postIcons/UnlikeIcon";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  makeComment,
  likePost,
  unLikePost,
} from "../../features/post/postSlice";
const PostCard = (props) => {
  const dispatch = useDispatch();
  const { post, comments, likes } = props;
  const [comment, setComment] = React.useState("");
  const [cmts, setComments] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);
  const user = useSelector((state) => state.user.user);
  /* -------------------------------------------------------------------------- */
  /*                            GET EXPANDED COMMENTS                           */
  /* -------------------------------------------------------------------------- */
  React.useEffect(() => {
    if (expanded) {
      setComments(comments);
    } else if (!expanded) {
      setComments(comments.slice(0, 3));
    }
  }, [comments, expanded]);

  /* -------------------------------------------------------------------------- */
  /*                               CREATE_COMMENTS                              */
  /* -------------------------------------------------------------------------- */
  const handleComment = (postId) => {
    dispatch(makeComment(postId, comment,setComment));
  };

  /* -------------------------------------------------------------------------- */
  /*                                  LIKE_POST                                 */
  /* -------------------------------------------------------------------------- */
  const handleLikePost = (postId) => {
    dispatch(likePost(postId,user._id));
  };
  /* -------------------------------------------------------------------------- */
  /*                                 UNLIKE_POST                                */
  /* -------------------------------------------------------------------------- */
  const handleUnLikePost = (postId) => {
    dispatch(unLikePost(postId));
  };
  return (
    <div className="card-container mb-3 p-2 rounded bg-white border-gray-100">
      <div className="flex items-center justify-start my-2">
        <img
          className="object-cover w-8 h-8 rounded-full	"
          src={post?.postedby?.avatar}
          alt="post"
        />
        <Link
          to={
            user?._id !== post?.postedby._id
              ? `/user/${post?.postedby._id}`
              : "/my-profile"
          }
        >
          <p className="text-[#1C1E21] text-sm leading-4 font-bold ml-3">
            {post?.postedby?.name}
          </p>
        </Link>
      </div>
      <p className="text-sm font-semibold">{post?.title}</p>
      <div className="w-full">
        <img className="object-cover" src={post?.photo} alt="post" />
      </div>
      <div>
        <div className="flex items-center justify-start my-2">
          {likes?.includes(user?._id) ? (
            <button onClick={() => handleUnLikePost(post._id)}>
              <UnlikeIcon />
            </button>
          ) : (
            <button onClick={() => handleLikePost(post._id)}>
              <LikeIcon />
            </button>
          )}

          <button className="ml-1">
            {" "}
            <CommentIcon />
          </button>
          <button className="ml-1">
            <SendIcon />
          </button>
        </div>
        <p>
          {likes?.length}
          <span className="text-sm leading-4 font-bold"> J'aime</span>
        </p>
        <div>
          {cmts?.map((cmt) => (
            <p key={cmt?._id}>
              <span className="font-bold text-sm">{cmt?.postedby?.name}: </span>
              {cmt?.text}
            </p>
          ))}
        </div>
        <button
          type="button"
          className="text-sm font-bold text-gray-300 leading-3"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
        <div className="relative">
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
              handleComment(post?._id);
            }}
            className="text-sm leading-4 font-bold text-blue-400 absolute right-1.5 top-6 cursor-pointer"
          >
            publier
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
