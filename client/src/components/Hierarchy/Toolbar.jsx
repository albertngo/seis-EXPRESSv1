import React from "react";
import Button from "@material-ui/core/Button";
import "./Toolbar.css";
import ConfirmAlert from "../Buttons/ConfirmAlert";

export default function Toolbar(props) {
  const [open, confirmOpen] = React.useState(false);

  const handleClose = () => {
    confirmOpen(false);
  };

  let checkDuplicateArr = (deleteNodes = [], node) => {
    for (let deleteNode of deleteNodes) {
      console.log(deleteNode.orgHierarchy);
      console.log(node.orgHierarchy);
      if (
        JSON.stringify(deleteNode.orgHierarchy) ==
        JSON.stringify(node.orgHierarchy)
      )
        return true;
    }
    return false;
  };

  //--------------------------------DUPLICATE-----------------//
  let deleteHandler = () => {
    //check if there are any children, capture the node ID and store to remove them

    let deleteNodes = [];
    //loop through all nodes, store and delete
    handleClose();
    props.clearSaved();
    for (let outerNode of props.selectedNodes) {
      console.log(`OUTERNODE`);
      console.log(outerNode);
      for (let innerNode of outerNode.allLeafChildren) {
        console.log(`INNNNNERRRRRRRRRRRRR`);
        console.log(innerNode);
        //check if node is already inside array
        console.log(checkDuplicateArr(deleteNodes, innerNode.data));
        if (!checkDuplicateArr(deleteNodes, innerNode.data))
          deleteNodes.push(innerNode.data);
        console.log(deleteNodes);
      }
      props.gridApi.applyTransaction({
        remove: deleteNodes,
      });
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
        color="secondary"
        // disabled={props.selectedNodes.length > 0 ? false : true}
      >
        Delete Selected
      </Button>
    </div>
  );
}
