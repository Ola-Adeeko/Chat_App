import React, { useState, useEffect, useRef, useMemo } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import ChatBox from "./components/ChatBox/ChatBox";
import UserBox from "./components/UserBox/UserBox";

const socket = io("http://localhost:5000");

function generateRoomName(username1, username2) {
  // Sort usernames to ensure consistency in room naming
  const sortedUsernames = [username1, username2].sort();
  return `room_${sortedUsernames.join("_")}`;
}

const App = () => {
  const [user, setUser] = useState("");
  const [userSet, setUserSet] = useState(false);
  const [receiveMessage, setReceiveMessage] = useState([]);
  const [chatWith, setChatWith] = useState({});
  const [me, setMe] = useState({});
  const [activeRoom, setActiveRoom] = useState("");

  const onSetUser = () => {
    if (!user) alert("Please add a username");
    else {
      socket.emit("joinChatRoom", { username: user });
      setUserSet(true);
    }
  };

  // console.log(receiveMessage);

  const setActiveChat = (client) => {
    setChatWith(client);
    const roomName = generateRoomName(me.username, client.username);
    setActiveRoom(roomName);

    // socket.emit("update_read_status", { room: roomName });

    setReceiveMessage((prevMessages) => {
      return prevMessages.map((mess) => {
        if (mess.room === roomName) {
          return {
            ...mess,
            read: true,
          };
        } else {
          return mess;
        }
      });
    });
  };

  // useEffect(() => {
  //   if (activeRoom && me) {
  //     setReceiveMessage((prevMessages) => {
  //       return prevMessages.map((mess) => {
  //         if (mess.room === activeRoom && !mess.read) {
  //           console.log(mess.room);
  //           return {
  //             ...mess,
  //             read: true,
  //           };
  //         } else {
  //           return mess;
  //         }
  //       });
  //     });
  //   }
  // }, [activeRoom, me]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setReceiveMessage((prevMessages) => {
        if (data.room === activeRoom && !data.read) {
          return [...prevMessages, { ...data, read: true }];
        } else {
          return [...prevMessages, data];
        }
      });
    });

    socket.on("me", (data) => {
      // console.log("me:", data);
      setMe(data);
    });

    socket.on("newUserConnected", (data) => {
      // console.log("new user connected:", data);
      const room = generateRoomName(me.username, data.username);
      socket.emit("joinRoom", { room, user: me });
    });

    return () => {
      socket.off("receive_message");
      socket.off("me");
      socket.off("newUserConnected");
    };
  }, [socket, me, activeRoom]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "600px",
          height: "500px",
        }}
        className=" bg-[#1d528f] shadow-2xl drop-shadow-2xl rounded-[10px]"
      >
        {!userSet && (
          <div className="h-full w-full flex items-center justify-center ">
            <div className="p-4 rounded-md w-[300px] h-[40%] flex flex-col gap-[20px] items-center justify-center bg-[#E6F1FB] drop-shadow-2xl shadow-2xl">
              <input
                placeholder="Please input your username"
                style={{ width: "100%", padding: "5px 10px" }}
                className="border-solid border-2 border-gray-500"
                onChange={(e) => setUser(e.target.value)}
              />
              <button
                className="border-solid border-2 border-gray-500 rounded-lg"
                onClick={() => onSetUser()}
                style={{ padding: "2px 4px", width: "fit-content" }}
              >
                Username
              </button>
            </div>
          </div>
        )}
        {userSet && (
          <div className="flex gap-6 h-full  h-full w-full p-[25px] ">
            <UserBox
              user={me}
              setChatWith={setActiveChat}
              activeChat={chatWith}
              messages={receiveMessage}
              activeRoom={activeRoom}
            />
            <div className="flex-1">
              <ChatBox
                receiveMessage={receiveMessage}
                user={me}
                chatWith={chatWith}
                activeRoom={activeRoom}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
