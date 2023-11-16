import React, { useContext } from "react";

import { SocketContext } from "../../SocketContext";

const VideoPlayer = () => {
  const {
    myVideo,
    name,
    callAccepted,
    userVideo,
    callEnded,
    stream,
    call,
    tata,
  } = useContext(SocketContext);

  //   console.log(myVideo, "///", tata, "??", stream);
  //   console.log("render");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {stream && (
        <div style={{ background: "#fff", padding: "15px" }}>
          <div style={{ width: "400px" }}>
            <h3 style={{ marginBottom: "5px" }}>{name || "Name"}</h3>
            <video playsInline muted ref={myVideo} autoPlay width={"100%"} />
          </div>
        </div>
      )}

      {callAccepted && !callEnded && (
        <div style={{ background: "#fff", padding: "15px" }}>
          <div style={{ width: "400px" }}>
            <h3 style={{ marginBottom: "5px" }}>{call?.name || "Name"}</h3>
            <video playsInline ref={userVideo} autoPlay width={"100%"} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
