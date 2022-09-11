import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentIcon from "../icons/postIcons/CommentIcon";
import LikeIcon from "../icons/postIcons/LikeIcon";
import Modal from "react-modal";
import PostByID from "../components/posts/PostByID";
import { useDispatch, useSelector } from "react-redux";
import { getMyPosts } from "../features/post/postSlice";
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
const MyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const followers = useSelector((state) => state.user.followers);
  const following = useSelector((state) => state.user.following);
  const Myposts = useSelector((state) => state.post.myPosts);
  const posts = useSelector((state) => state.post.posts);
  const [postId, setPost] = React.useState({});
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    dispatch(getMyPosts());
  }, []);
  function closeModal() {
    setIsOpen(false);
  }
  const NavigateTo = () => {
    navigate("edit");
  };
  return (
    <>
      <div className="w-full h-full ">
        <div className="max-w-[1000px] flex-col m-auto  divide-y">
          <div className="p-16 flex justify-center items-center  gap-x-20  ">
            <img
              src={user?.avatar}
              alt="me"
              className="w-36 h-36 rounded-full object-cover"
            />
            <div className="flex-col gap-y-20">
              <div className=" flex items-center gap-x-8 mb-2	">
                <p className="text-2xl	">{user?.name}</p>

                <button
                  onClick={NavigateTo}
                  className="cursor-pointer   px-1 border border-1 border-solid border-gray-200 rounded-md"
                >
                  Modifier Profil
                </button>
              </div>
              <div className="flex  items-center justify-between gap-x-6 mb-2">
                <p>
                  {Myposts?.length}
                  <span className="font-semibold text-sm"> publications</span>
                </p>
                <p>
                  {followers?.length}
                  <span className="font-semibold text-sm"> followers</span>
                </p>
                <p>
                  {following?.length}
                  <span className="font-semibold text-sm"> following</span>
                </p>
              </div>

              <h2 className="font-bold">{user?.name}</h2>
            </div>
          </div>
          <div className=" flex justify-center max-w-[900px] m-auto">
            <div className="p-8   flex md:flex-col md:w-full m-auto justify-[inherit] items-center flex-auto gap-y-8 gap-x-6 flex-wrap">
              {Myposts?.map((post) => (
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
        <PostByID
          setIsOpen={setIsOpen}
          post={postId}
        />
      </Modal>
    </>
  );
};

export default MyProfile;
