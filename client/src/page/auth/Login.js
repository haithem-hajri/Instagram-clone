import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { SpinnerCircularSplit } from "spinners-react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/user/userSlice";
import { LoginErrors } from "../../features/user/userSlice";
const Login = () => {
  //process.env.REACT_APP_API_URL
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const isLoading = useSelector((state) => state.user.isLoading);
  const errors_server = useSelector((state) => state.user.loginErrors);

  const navigate = useNavigate();
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
  const onSubmit = (data) => {
    dispatch(login(data, navigate));
  };

  const NavigatoSignup = () => {
    navigate("/signup");
    dispatch(LoginErrors(null));
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

          <input
            {...register("email", {
              required: "Email is required !",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "invalid email address !",
              },
            })}
            placeholder="e-mail"
            className="bg-gray-200 px-2 py-1 rounded my-2 placeholder:text-sm"
            style={{ minWidth: "125px", height: " 36px", width: "100%" }}
          />
          {errors.email && (
            <p className="text-red-500 self-start text-sm text-left mb-1">
              {errors?.email?.message}
            </p>
          )}
          <input
            {...register("password", {
              required: "password is required !",
            })}
            type={"password"}
            placeholder="Mot de passe"
            className="bg-gray-200 px-2 py-1 rounded placeholder:text-sm"
            style={{ minWidth: "125px", height: " 36px", width: "100%" }}
          />
          {errors.password && (
            <p className="text-red-500 self-start text-sm text-left mb-1">
              {errors?.password?.message}
            </p>
          )}
          <span className="text-blue-400 text-sm font-normal leading-4 self-end mt-3 cursor-pointer ">
            Mot de passe oublié ?
          </span>
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
            Se connecter
          </button>
          <p className="text-sm font-normal text-gray-500 leading-4 mt-5">
            Vous n’avez pas de compte?{" "}
            <span
              className="text-blue-400 font-semibold cursor-pointer"
              onClick={NavigatoSignup}
              // onClick={dispatch(clearErrors(null))}
            >
              Inscrivez-vous
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
