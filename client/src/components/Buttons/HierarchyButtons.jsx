import React from "react";
import { ReactComponent as AddSiblingBtn } from "./images/addSibling.svg";
import { ReactComponent as AddChildrenBtn } from "./images/addChildren.svg";
import { ReactComponent as DeleteBtn } from "./images/delete.svg";
import ConfirmAlert from "./ConfirmAlert";
import "./HierarchyButtons.css";
let i = 0;

function createNewRowData({ orgHierarchy }, type, numEntries = 1) {
  //loop through entries
  console.log(orgHierarchy);
  let newNodes = [];
  let newOrg;
  while (numEntries >= 1) {
    if (type === "children") newOrg = orgHierarchy.concat("New Child " + ++i);
    else {
      if (orgHierarchy.length > 1) {
        let parentArr = [...orgHierarchy];
        parentArr.pop();
        newOrg = parentArr.concat("New Sibling " + ++i);
      } else {
        newOrg = ["New Sibling  " + ++i];
      }
    }
    let newData = {
      jobTitle: "",
      employmentType: "",
      orgHierarchy: newOrg,
    };
    //place into array
    newNodes.push(newData);
    numEntries--;
  }
  console.log(newNodes);
  return newNodes;
}

export function HierarchyButtons(props) {
  const [open, confirmOpen] = React.useState(false);

  const handleClose = () => {
    confirmOpen(false);
  };

  let insertHandler = (type) => {
    let { data } = props;
    //get the data of the node
    let newNodeArr = createNewRowData(data, type);
    //create new row
    props.api.applyTransaction({ add: newNodeArr });
  };

  //--------------------------------DUPLICATE-----------------//
  let deleteHandler = () => {
    //check if there are any children, capture the node ID and store to remove them
    handleClose();
    let deleteNodes = [];
    for (let node of props.node.allLeafChildren) {
      deleteNodes.push(node.data);
    }
    console.log(props.node.allLeafChildren);
    props.api.applyTransaction({
      remove: deleteNodes,
    });
  };

  //-------------------------------------------------//
  return (
    <div className="buttonContainer">
      <DeleteBtn
        onClick={() => {
          confirmOpen(true);
        }}
        className={"delete"}
        fill="black"
      />
      <AddSiblingBtn
        onClick={() => {
          insertHandler("sibling");
        }}
        className={"addSibling"}
        fill="black"
      />
      <AddChildrenBtn
        onClick={() => {
          insertHandler("children");
        }}
        className={"addChildren"}
        fill="black"
      />
      <ConfirmAlert
        openState={open}
        deleteHandler={deleteHandler}
        handleClose={handleClose}
        nodesToDelete={1}
      />
    </div>
  );
}

export default HierarchyButtons;
