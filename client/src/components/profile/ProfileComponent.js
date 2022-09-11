import React from "react";
import Modal from "react-modal";
import PostByID from "../posts/PostByID";
import LikeIcon from "../../icons/postIcons/LikeIcon";
import CommentIcon from "../../icons/postIcons/CommentIcon";
import { followUser, unFollowUser } from "../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
const customStyles = {
  content: {
    top: "52%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "500px",
    // minHeight: "50vh",
    zIndex: "99999",
    maxHeight: "90vh",
    padding: 0,
  },
};
Modal.defaultStyles.overlay.backgroundColor = "rgba(0,0,0,0.75)";
const ProfileComponent = (props) => {
  const { user, posts, setRefetch, refetchPosts } = props;
  const dispatch = useDispatch();
  const following = useSelector((state) => state.user.following);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [postId, setPost] = React.useState({});
  function closeModal() {
    setIsOpen(false);
    setRefetch(!refetchPosts);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 FOLLOW_USER                                */
  /* -------------------------------------------------------------------------- */
  const handleFollow = () => {
    dispatch(followUser(user?._id));
  };
  /* -------------------------------------------------------------------------- */
  /*                                UNFOLLOW_USER                               */
  /* -------------------------------------------------------------------------- */
  const handleUnFollow = () => {
    dispatch(unFollowUser(user?._id));
  };

  return ( 
    <>
      <div className="w-full h-full">
        <div className="max-w-[1000px] flex-col m-auto  divide-y">
          <div className="p-16 flex justify-center items-center  gap-x-20  ">
            <img
              src={user?.avatar}
              alt="me"
              className="w-36 h-36 rounded-full object-cover"
            />
            <div className="flex-col gap-8">
              <div className=" flex items-center gap-8 mb-3 	">
                <p className="text-2xl	">{user?.name}</p>
                <Link
                  to={"/direct/" + user?._id}
                  className=" cursor-pointer py-2 hover:opacity-70 px-4
                   border border-solid border-gray-300 
                    rounded-md font-semibold text-md leading-4 text-black"
                >
                  Contacter
                </Link>
                {following?.includes(user?._id) ? (
                  <button
                    onClick={() => handleUnFollow()}
                    className=" cursor-pointer py-2 hover:opacity-70 px-4 bg-[#0195f7] rounded-md font-semibold text-md leading-4 text-white"
                  >
                    unFollow
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollow()}
                    className=" cursor-pointer py-2 hover:opacity-70 px-4 bg-[#0195f7] rounded-md font-semibold text-md leading-4 text-white"
                  >
                    follow
                  </button>
                )}
              </div>
              <div className="flex  items-center justify-between gap-x-6 mb-2">
                <p>
                  {posts?.length}
                  <span className="font-semibold text-sm"> publications</span>
                </p>
                <p>
                  {user?.followers?.length}
                  <span className="font-semibold text-sm"> followers</span>
                </p>
                <p>
                  {user?.following?.length}
                  <span className="font-semibold text-sm"> following</span>
                </p>
              </div>

              <h2 className="font-bold">{user?.name}</h2>
            </div>
          </div>
          <div className=" flex justify-center max-w-[900px] m-auto">
            <div className="p-8   flex md:flex-col md:w-full m-auto justify-between items-center flex-auto gap-y-8 gap-x-6 flex-wrap">
              {posts?.map((post) => (
                <div
                  onClick={() => {
                    setPost(post);
                    setIsOpen(true);
                  }}
                  key={post?._id}
                  className="group  cursor-pointer w-[250px] h-[250px] md:w-full md:h-full  relative"
                >
                  <img
                    src={post?.photo}
                    alt="ey"
                    className="w-full h-full object-cover group-hover:opacity-50"
                  />
                  <div className="absolute inset-1/2 opacity-0 gap-3 group-hover:opacity-100 flex justify-center items-center	">
                    <div className="flex justify-center items-center gap-1">
                      <CommentIcon />
                      <p className="text-black font-semibold text-sm">
                        {post.comments.length}
                      </p>
                    </div>
                    <div className="flex justify-center items-center gap-1">
                      <LikeIcon />
                      <p className="text-black  font-semibold text-sm">
                        {post.likes.length}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
        <PostByID setIsOpen={setIsOpen} post={postId} />
      </Modal>
    </>
  );
};

export default ProfileComponent;
