import React from "react";
import OpenConversationIcon from "../../icons/OpenConversationIcon";
import Modal from "react-modal";
import FindUsers from "./FindUsers";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "400px",
    minHeight: "50vh",
    zIndex: "99999",
    maxHeight: "90vh",
    padding: 0,
  },
};
Modal.defaultStyles.overlay.backgroundColor = "rgba(0,0,0,0.75)";
const OpenConversation = (props) => {
 
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      <div className="flex flex-col justify-center items-center   w-[585px] gap-3">
        <OpenConversationIcon />
        <h2 className="text-lg">Vos Messages</h2>
        <p className="text-gray-400 text-sm ">
          Envoyez des photos et des messages privés à un(e) ami(e) ou à un
          groupe.
        </p>
        <button
          onClick={openModal}
          className="px-2 py-1 bg-blue-500 rounded hover:bg-blue-400 text-white font-semibold text-sm"
        >
          Envoyer un message
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <FindUsers setIsOpen={setIsOpen}  />
      </Modal>
    </>
  );
};

export default OpenConversation;
