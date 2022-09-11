import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { SpinnerCircularSplit } from "spinners-react";
import { createPost } from "../../features/post/postSlice";
import { useDispatch, useSelector } from "react-redux";
const CreatePost = (props) => {
  const { setIsOpen } = props;
  const dispatch = useDispatch();
  const [file, setFile] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [url, setUrl] = React.useState("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  function handleChange(e) {
    setImage(e.target.files[0]);
    setFile(URL.createObjectURL(e.target.files[0]));
  }
  React.useEffect(() => {
    if (url) {
      dispatch(createPost(url, title, setLoading, setIsOpen));
    }
  }, [url]);
 
  const onSubmit = () => {
    setLoading(true);
    const data = new FormData();
    data.append("upload_preset", "ziulmsfk");
    data.append("file", image);
    data.append("cloud_name", "dyvdpqu07");
    axios
      .post("https://api.cloudinary.com/v1_1/dyvdpqu07/image/upload", data)
      .then((res) => {
        setUrl(res.data.url);
      })
      .catch((err) => {
        console.log("err:", err);
        setLoading(false);
      });
  };
  return (
    <div className="flex-col justify-center items-center divide-y w-full ">
      <h2 className="text-center p-1 text-base font-semibold">
        Créer une publication
      </h2>
      <div className="flex flex-col items-center justify-center p-4">
        <label htmlFor="file-upload" className="custom-file-upload ">
          select image
        </label>
        <input id="file-upload" type="file" onChange={handleChange} />
        {file && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <img
              src={file}
              alt="my-post"
              className="w-96 h-96 mt-2 object-cover"
            />
            <div className="relative">
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={1}
                name="message"
                className="w-full p-6 text-sm border-b-2 text-black border-gray-400 rounded-lg outline-none opacity-50 focus:border-blue-400"
                placeholder="Enter your message"
              ></textarea>
              <button
                disabled={loading}
                type="submit"
                className=" cursor-pointer text-sm leading-4 font-bold text-blue-400 absolute right-1.5 top-6"
              >
                {loading ? (
                  <SpinnerCircularSplit
                    thickness={100}
                    speed={100}
                    color="rgba(57, 127, 172, 1)"
                    secondaryColor="rgba(59, 57, 172, 0.9)"
                    size={"25px"}
                  />
                ) : (
                  "publier"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
