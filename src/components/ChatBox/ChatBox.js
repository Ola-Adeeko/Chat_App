import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatBox = ({ receiveMessage, user, chatWith, activeRoom }) => {
  const [sendMessage, setSendMessage] = useState("");

  const chatContainerRef = useRef(null);

  const getTime = () => {
    const timeStamp = new Date().getTime();

    const date = new Date(timeStamp);

    // Extract hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}`;

    return formattedTime;
  };

  const onSend = (e) => {
    e.preventDefault();

    const newSentMessage = {
      message: sendMessage,
      sender: user,
      recipient: chatWith,
      room: activeRoom,
      read: false,
      timeSent: getTime(),
    };

    socket.emit("send_message", newSentMessage);

    setSendMessage("");
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    const scrollToBottom = () => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    };

    setTimeout(scrollToBottom, 0);
  }, [receiveMessage]);

  //   console.log(receiveMessage);

  const filteredMessages = useMemo(() => {
    return receiveMessage.filter((data) => data.room === activeRoom);
  }, [receiveMessage, activeRoom]);

  if (!chatWith.username) {
    return (
      <div className="shadow-2xl drop-shadow-2xl  h-full w-full rounded-md bg-[#f4f5f9] flex justify-center items-center  rounded-[10px]">
        <div className="w-[80%] h-[30%] flex flex-col justify-center items-center shadow-2xl drop-shadow-2xl rounded-md">
          <p className="text-2xl">Welcome</p>
          <p className="text-lg">Chat With Friends...</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className=" shadow-2xl drop-shadow-2xl  h-full w-full  rounded-[10px]">
        <div className=" h-full flex flex-col gap-2  rounded-md">
          <div className="h-[90%] flex flex-col gap-2  rounded-md bg-[#f4f5f9]">
            <div className="flex items-center ">
              <div className="flex-1 overflow-hidden p-2">
                <p className="w-full truncate">
                  Chat with{" "}
                  <span className="capitalize ">{chatWith.username}</span>
                </p>
              </div>
            </div>
            <hr className="mt-1 drop-shadow-2xl" />
            <div
              className="chat-container bg-[#f4f5f9] rounded-md flex-1 p-2"
              ref={chatContainerRef}
            >
              {filteredMessages.map((data, index) => {
                const isCurrentUser = data.sender.socketId === user.socketId;

                const messageAlignment = isCurrentUser
                  ? "flex-end"
                  : "flex-start";

                return (
                  <div
                    key={index}
                    style={{
                      marginBottom: "10px",
                      textAlign: messageAlignment,
                      display: "flex",
                      justifyContent: messageAlignment,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "80%",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        textAlign: "left",
                        wordBreak: "break-word",
                      }}
                      className="bg-[#1a3c6a] text-white relative flex justify-center items-center !pr-6 !pb-3"
                    >
                      {data.message}

                      <span className="text-[10px] absolute bottom-[1px] right-2 text-[#f4f5f9] opacity-80">
                        {data.timeSent}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={onSend} className="h-[40px] flex items-center gap-2 ">
            <input
              placeholder="Enter text here..."
              value={sendMessage}
              onChange={(e) => setSendMessage(e.target.value)}
              className="flex-1 h-[35px] px-2 border-solid border border-gray-500 rounded-md bg-[#f4f5f9]"
            />
            <button
              type="submit"
              className="w-[30px] h-[30px]  bg-[#f4f5f9] text-xl text-pink-400 flex items-center justify-center rounded-full"
            >
              <IoSend className="shadow-xl" />
            </button>
          </form>
        </div>
      </div>
    );
  }
};

export default ChatBox;
