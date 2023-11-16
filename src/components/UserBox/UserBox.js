import React, { useEffect, useMemo, useState } from "react";
import { BiSolidUser } from "react-icons/bi";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function generateRoomName(username1, username2) {
  // Sort usernames to ensure consistency in room naming
  const sortedUsernames = [username1, username2].sort();
  return `room_${sortedUsernames.join("_")}`;
}

const UserBox = ({ user, setChatWith, activeChat, messages, activeRoom }) => {
  const [chatClients, setChatClients] = useState([]);

  const leaveChatRoom = () => {
    socket.emit("leaveChatRoom", { username: user.user });
  };

  useEffect(() => {
    socket.on("chatClients", (data) => {
      setChatClients(data);
    });

    return () => {
      socket.off("disconnect");
    };
  }, [socket]);

  return (
    <div className="w-[40%] h-full bg-white rounded-[10px]">
      <div className="p-2 h-full flex flex-col">
        <div className="flex items-center  gap-2 ">
          <div className="h-[30px] w-[30px] text-[#1d528f] flex items-center justify-center border-solid border border-[#1d528f] rounded-full">
            <BiSolidUser />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="w-full truncate">
              Hi, <span className="capitalize ">{user.username}</span>
            </p>
          </div>
        </div>
        <hr className="my-4 drop-shadow-2xl" />
        <div className="user-box flex-1">
          {chatClients
            .filter((usr) => usr.socketId !== user.socketId)
            .map((client, index) => {
              const isChat = client.socketId === activeChat.socketId;

              const unreadMessages = messages
                .filter(
                  (data) =>
                    data.room ===
                    generateRoomName(client.username, user.username)
                )
                .filter((data) => data.sender.socketId === client.socketId)
                .filter((data) => !data.read);

              const unreadCount = unreadMessages.length;

              return (
                <div
                  key={index}
                  onClick={() => setChatWith(client)}
                  className={`flex items-center  gap-2 ${
                    isChat ? "bg-gray-300 shadow-2xl" : ""
                  }
                   my-[5px] hover:bg-blue-300 py-[5px] px-[4px] rounded-md cursor-pointer`}
                >
                  <div className="relative h-[25px] w-[25px] text-[#1d528f] flex items-center justify-center border-solid border border-[#1d528f] rounded-full">
                    <BiSolidUser />
                    {unreadCount > 0 && (
                      <span className="absolute top-[-6px] right-[-7px] h-[14px] w-[14px] rounded-full bg-red-600 text-[10px] text-white flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div>
                    <p>{client.username}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default UserBox;
