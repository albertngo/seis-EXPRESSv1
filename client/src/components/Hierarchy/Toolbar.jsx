import React from "react";
import Button from "@material-ui/core/Button";
import "./Toolbar.css";
import ConfirmAlert from "../Buttons/ConfirmAlert";

export default function Toolbar(props) {
  const [open, confirmOpen] = React.useState(false);

  const handleClose = () => {
    confirmOpen(false);
  };

  //--------------------------------DUPLICATE-----------------//
  let deleteHandler = () => {
    //check if there are any children, capture the node ID and store to remove them

    let deleteNodes = [];
    //loop through all nodes, store and delete
    handleClose();
    for (let outerNode of props.selectedNodes) {
      for (let innerNode of outerNode.allLeafChildren) {
        console.log(innerNode);
        deleteNodes.push(innerNode.data);
        console.log(deleteNodes);
        props.gridApi.applyTransaction({
          remove: deleteNodes,
        });
      }
    }
  };

  //-------------------------------------------------//
  return (
    <div className="toolbar">
      <ConfirmAlert
        openState={open}
        deleteHandler={deleteHandler}
        handleClose={handleClose}
        nodesToDelete={props.selectedNodes}
      />
      {/* <Button className="buttonClass" variant="contained" color="Default">
        Recovery module
      </Button> */}
      <Button
        onClick={() => {
          confirmOpen(true);
        }}
        className="buttonClass"
        variant="contained"
        color="Secondary"
        disabled={!props.selectedNodes}
      >
        Delete Selected
      </Button>
    </div>
  );
}
