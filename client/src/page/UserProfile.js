import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProfileComponent from "../components/profile/ProfileComponent";
import { SpinnerInfinity } from "spinners-react";
const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = React.useState(null);
  const [posts, setPosts] = React.useState(null);
  const [refetchPosts,setRefetch] = React.useState(false)
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    const fetchData = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/${userId}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      setUser(res.data.user);
      setPosts(res.data.post);
      setLoading(false);
    };
    fetchData().catch((err) => {
      setLoading(false);
    });
  }, [userId , refetchPosts ]);

  return (
    <div>
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
        <ProfileComponent
          user={user}
          posts={posts}
          setUser={setUser}
          setRefetch={setRefetch}
          refetchPosts={refetchPosts}
        />
      )}
    </div>
  );
};

export default UserProfile;
