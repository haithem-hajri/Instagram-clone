import React from "react";
import EditInformation from "../components/profile/EditInformation";
import EditPassword from "../components/profile/EditPassword";
const EditProfile = () => {
  const [content, setContent] = React.useState("information");
  return (
    <div className="w-full h-full p-4">
      <div
        className="container  bg-white border mx-auto profile-container  divide-x-2
        border-solid border-gray-100 rounded-sm flex  justify-center items-center m-2 "
      >
        <div className="h-80 w-1/4 flex flex-col justify-start items-start p-4 gap-3">
          <h2
            className={`cursor-pointer ${
              content === "information" && "font-semibold transition"
            }`}
            onClick={() => setContent("information")}
          >
            Modifier mon profil
          </h2>
          <p
            className={`cursor-pointer ${
              content === "password" && "font-semibold transition"
            }`}
            onClick={() => setContent("password")}
          >
            Changer de mot de passe
          </p>
        </div>
        <div className="h-80 w-3/4">
          {content === "information" ? (
            <EditInformation />
          ) : (
            content === "password" && <EditPassword />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
