import React, { Component } from "react";
import { ReactComponent as AddSiblingBtn } from "./images/addSibling.svg";
import { ReactComponent as AddChildrenBtn } from "./images/addChildren.svg";
import { ReactComponent as DeleteBtn } from "./images/delete.svg";
import "./hierarchyButtons.css";
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

class FirstColButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInsertModal: false,
    };
  }

  insertHandler(type) {
    let { data } = this.props;
    //get the data of the node
    let newNodeArr = createNewRowData(data, type);
    //create new row
    this.props.api.applyTransaction({ add: newNodeArr });
  }

  deleteHander() {
    //check if there are any children, capture the node ID and store to remove them (recursion?)
    console.log(this.props);
    let deleteNodes = [];
    for (let node of this.props.node.allLeafChildren) {
      deleteNodes.push(node.data);
    }
    console.log(this.props.node.allLeafChildren);
    this.props.api.applyTransaction({
      remove: deleteNodes,
    });
  }

  render() {
    return (
      <div className="buttonContainer">
        <DeleteBtn
          onClick={() => {
            this.deleteHander();
          }}
          className={"delete"}
          fill="black"
        />
        <AddSiblingBtn
          onClick={() => {
            this.insertHandler("sibling");
          }}
          className={"addSibling"}
          fill="black"
        />
        <AddChildrenBtn
          onClick={() => {
            this.insertHandler("children");
          }}
          className={"addChildren"}
          fill="black"
        />
      </div>
    );
  }
}

export default FirstColButtons;
