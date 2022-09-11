import React from "react";
import { useForm } from "react-hook-form";
import { SpinnerCircularSplit } from "spinners-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const EditPassword = () => {
  const {
    register,
    handleSubmit,
    setError,
    setErrors,
    formState: { errors },
  } = useForm();
  const navigate=useNavigate()
  const [loading, setLoading] = React.useState(false);
  const onSubmit = (data) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .put(
        process.env.REACT_APP_API_URL + "/update-password",

        data,

        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setLoading(false);
        navigate('/my-profile') 
        //dispatch({ type: "UPDATE_USER", payload: res.data });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setError("newPassword", {
          type: "server",
          message: err.response.data.newPassword,
        });
      });
  };
  return (
    <div className="p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col justify-center items-center gap-4"
      >
        <div className="flex justify-start items-center  gap-4 w-full max-w-[600px] p-1">
          <label className="w-[10rem]  px-1 leading-4 text-right  font-semibold text-sm">
            Ancien mot de passe
          </label>
          <input
            type={"password"}
            {...register("oldPassword", { required: "password is required" })}
            placeholder="Ancien mot de passe"
            className="rounded-sm bg-gray-50  border border-solid border-1 border-gray-200 w-full p-2"
          />
        </div>
        {errors.oldPassword && (
          <div className="flex justify-start items-center gap-4  w-full p-1">
            <div className="w-[11rem]  px-1" />
            <p className="text-red-500  text-sm  mb-1">
              {errors?.oldPassword?.message}
            </p>
          </div>
        )}
        <div className="flex justify-start items-center gap-4 max-w-[600px]   w-full p-1">
          <label className=" w-[10rem] px-1 leading-4 text-right font-semibold text-sm">
            Nouveau mot de passe
          </label>
          <input
            type={"password"}
            {...register("newPassword", {
              required: "new password is required",
            })}
            placeholder="Nouveau mot de passe"
            className="rounded-sm bg-gray-50 z-50 border border-solid border-1 border-gray-200 w-full p-2"
          />
        </div>
        {errors.newPassword && (
          <div className="flex justify-start items-center  gap-4 w-full  ">
            <div className="w-[11rem]  px-2" />
            <p className="text-red-500  text-sm  mb-1">
              {errors?.newPassword?.message}
            </p>
          </div>
        )}
        <div className="flex justify-center items-center   w-full p-1">
          <button
            disabled={loading}
            type="submit"
            className="bg-blue-300 p-2 rounded text-white text-start font-semibold leading-4 "
          >
            {loading ? (
              <SpinnerCircularSplit color="white" size={"25px"} />
            ) : (
              "Enregistrer"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPassword;
