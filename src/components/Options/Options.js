import React from "react";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   gridContainer: {
//     width: "100%",
//     [theme.breakpoints.down("xs")]: {
//       flexDirection: "column",
//     },
//   },
//   container: {
//     width: "600px",
//     margin: "35px 0",
//     padding: 0,
//     [theme.breakpoints.down("xs")]: {
//       width: "80%",
//     },
//   },
//   margin: {
//     marginTop: 20,
//   },
//   padding: {
//     padding: 20,
//   },
//   paper: {
//     padding: "10px 20px",
//     border: "2px solid black",
//   },
// }));

const Options = ({ children }) => {
  return <div>options {children}</div>;
};

export default Options;
