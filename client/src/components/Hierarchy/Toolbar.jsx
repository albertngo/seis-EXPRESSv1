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
        JSON.stringify(deleteNode.orgHierarchy) ===
        JSON.stringify(node.orgHierarchy)
      )
        return true;
    }
    return false;
  };

  let toOpenHandler = () => {
    if (props.selectedNodes.length) {
      confirmOpen(true);
    }
  };
  //--------------------------------DUPLICATE-----------------//
  let deleteHandler = () => {
    //check if there are any children, capture the node ID and store to remove them

    //loop through all nodes, store and delete
    handleClose();

    let newStore = [];
    props.gridApi.forEachNode((node) => {
      newStore.push(node);
    });

    console.log(newStore);
    //remove the nodes to delete
    props.selectedNodes.forEach((node) => {
      newStore.splice(newStore.indexOf(node), 1);
    });
    newStore = newStore.map((node) => {
      return node.data;
    });
    props.gridApi.setRowData(newStore);
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
          toOpenHandler();
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
