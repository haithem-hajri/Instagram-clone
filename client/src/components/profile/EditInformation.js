import React from "react";
import Modal from "react-modal";
import EditAvatar from "./EditAvatar";
import { useForm } from "react-hook-form";
import { SpinnerCircularSplit } from "spinners-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../features/user/userSlice";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "500px",
    minHeight: "50vh",
    zIndex: "99999",
    maxHeight: "90vh",
    padding: 0,
  },
};
Modal.defaultStyles.overlay.backgroundColor = "rgba(0,0,0,0.75)";
Modal.defaultStyles.overlay.zIndex="9999"
const EditInformation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const loading = useSelector((state) => state.user.isLoading);
  const errors_server = useSelector((state) => state.user.errors);
  const user = useSelector((state) => state.user.user);
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  React.useEffect(() => {
    if (errors_server) {
      if (errors_server.email) {
        setError("email", {
          type: "server",
          message: "email invalid",
        });
      }
    }
  }, [errors_server]);
  const onSubmit = (data) => {
    dispatch(updateUser(data, navigate));
  };
  return (
    <>
      <div className="p-6 flex flex-col justify-center items-center  gap-4 max-w-[600px] ">
        <div className="px-6 flex justify-start items-center  gap-4 w-full ">
          <img
            className=" w-10 h-10 rounded-full"
            src={user?.avatar}
            alt="me"
          />
          <button
            onClick={openModal}
            className=" font-semibold cursor-pointer"
          >
            Modifier la photo de profil
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex justify-start items-center  gap-4 w-full p-1 ">
            <label className="min-w-[4rem]   leading-4 text-right font-semibold text-sm">
              Name
            </label>
            <input
              placeholder={user?.name}
              {...register("name")}
              className="rounded-sm bg-gray-50  border border-solid border-1 border-gray-200 w-full p-2"
            />
          </div>
          <div className="flex justify-start items-center gap-4    w-full p-1 ">
            <label className=" min-w-[4rem]  leading-4 text-right font-semibold text-sm">
              E-mail
            </label>

            <input
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address !",
                },
              })}
              placeholder={user?.email}
              className="rounded-sm bg-gray-50 border border-solid border-1 border-gray-200 w-full p-2"
            />
          </div>
          {errors.email && (
            <div className="flex justify-start items-center gap-4  w-full p-1">
              <div className="min-w-[4rem]" />
              <p className="text-red-500  text-sm  mb-1">
                {errors?.email?.message}
              </p>
            </div>
          )}
          <div className="flex justify-start items-center gap-4  w-full p-1">
            <div className="min-w-[4rem]" />
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <EditAvatar setIsOpen={setIsOpen} />
      </Modal>
    </>
  );
};

export default EditInformation;
