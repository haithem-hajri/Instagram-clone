import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { SpinnerCircularSplit } from "spinners-react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../features/user/userSlice";
import { SignupErrors } from "../../features/user/userSlice";
const Signup = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitted },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);
  const errors_server = useSelector((state) => state.user.SignupErrors);
  // const [loading, setLoading] = React.useState(false);
  const onSubmit = (data) => {
    dispatch(signup(data, navigate));
  };
  React.useEffect(() => {
    if (errors_server) {
      if (errors_server.email) {
        setError("email", {
          type: "server",
          message: "email invalid",
        });
      } else if (errors_server.password) {
        setError("password", {
          type: "server",
          message: "email or password invalid",
        });
      }
    }
  }, [errors_server]);
  const NavigatoLogin = () => {
    navigate("/login");
    dispatch(SignupErrors(null));
  };
  return (
    <div className="w-full h-full p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className="container  bg-white border mx-auto container-width
      border-solid border-gray-100 rounded-sm flex flex-col justify-center items-center p-8 "
        >
          <img
            className="w-40 mt-9 mb-3"
            src="https://www.instagram.com/static/images/web/logged_out_wordmark-2x.png/d2529dbef8ed.png"
            alt="insta"
          />
          <h2 className="text-center font-semibold text-lg mb-6 text-[#8e8e8e]">
            Sign up to see photos and videos from your friends.
          </h2>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="username"
            className="bg-gray-200 px-2 py-1 rounded my-2 placeholder:text-sm"
            style={{ minWidth: "125px", height: " 36px", width: "100%" }}
          />
          {errors.name && (
            <p className="text-red-500 self-start text-sm text-left mb-1">
              Last name is required.
            </p>
          )}
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "invalid email address",
              },
            })}
            placeholder="e-mail"
            className="bg-gray-200 px-2 py-1 rounded mb-2 placeholder:text-sm"
            style={{ minWidth: "125px", height: " 36px", width: "100%" }}
          />
          {errors.email && (
            <p className="text-red-500 self-start text-sm text-left mb-1">
              {errors?.email?.message}
            </p>
          )}
          <input
            type={"password"}
            {...register("password", { required: "Password is required" })}
            placeholder="Mot de passe"
            className="bg-gray-200 px-2 py-1 rounded mb-2 placeholder:text-sm"
            style={{ minWidth: "125px", height: " 36px", width: "100%" }}
          />
          {errors.password && (
            <p className="text-red-500 self-start text-sm text-left mb-1">
              {errors?.password?.message}
            </p>
          )}
          <input
            type={"password"}
            {...register("password_confirmation", {
              required: "confirm your password !!",
            })}
            placeholder="confirmer mot de passe"
            className="bg-gray-200 px-2 py-1 rounded placeholder:text-sm"
            style={{ minWidth: "125px", height: " 36px", width: "100%" }}
          />
          {errors.password_confirmation && (
            <p className="text-red-500 self-start text-sm text-left mb-1">
              {errors?.password_confirmation?.message}
            </p>
          )}
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-400 mt-5 cursor-pointer
       w-full text-white rounded py-1 px-2.5 flex justify-center items-center gap-1 "
          >
            {isLoading && (
              <SpinnerCircularSplit
                color="white"
                size={"25px"}
                className="mx-2"
              />
            )}{" "}
            Enregistrer
          </button>
          <p className="text-sm font-normal text-gray-500 leading-4 mt-5">
            Vous avez un compte?{" "}
            <span
              onClick={NavigatoLogin}
              className="text-blue-400 font-semibold cursor-pointer"
            >
              Se connecter
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
