import React from "react";
import { SpinnerCircularSplit } from "spinners-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateAvatar } from "../../features/user/userSlice";
const EditAvatar = (props) => {
  const { setIsOpen } = props;
  const dispatch = useDispatch()
  const [loading, setLoading] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [image, setImage] = React.useState("");
  const [file, setFile] = React.useState();
  const navigate = useNavigate()
  function handleChange(e) {
    setImage(e.target.files[0]);
    setFile(URL.createObjectURL(e.target.files[0]));
  }
  React.useEffect(()=>{
    if(url){
      dispatch(updateAvatar(url , navigate))
    }
  },[url])
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
        setLoading(false);
      });
  };
  return (
    <div className="flex-col justify-center items-center divide-y w-full ">
      <h2 className="text-center p-1 text-base font-semibold">
        Modifier votre image
      </h2>
      <div className="flex flex-col items-center justify-center p-4">
        <label htmlFor="file-upload" className="custom-file-upload ">
          select image
        </label>
        <input id="file-upload" type="file" onChange={handleChange} />
        {image && (
          <div className="flex flex-col gap-2 justify-center items-center">
            <img src={file} alt="my-post" className="w-96 h-96 mt-2" />
            <div className="flex justify-center items-center w-full">
              <button
                disabled={loading}
                onClick={onSubmit}
                className=" cursor-pointer text-sm leading-4 font-bold bg-blue-400 text-white w-full p-2 rounded  "
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
          </div>
        )}
      </div>
    </div>
  );
};

export default EditAvatar;
