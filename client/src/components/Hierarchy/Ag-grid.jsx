import React, { Component } from "react";
import _ from "lodash";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import HierarchyButtons from "../Buttons/HierarchyButtons";
import Toolbar from "./Toolbar";
class AgGrid extends Component {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.state = {
      makeChild: false,
      multiKey: false,
      selectedNodes: [],
      highestParents: [],
      columnDefs: [
        {
          lockPosition: true,
          cellRenderer: "hierarchyButtons",
          editable: false,
          maxWidth: 100,
          cellClass: "no-border",
        },
        { field: "jobTitle" },
        { field: "employmentType" },
        { field: "property" },
        { field: "property" },
        { field: "property" },
      ],
      frameworkComponents: {
        hierarchyButtons: HierarchyButtons,
      },
      defaultColDef: {
        enableCellChangeFlash: true,
        flex: 1,
        editable: true,
        resizable: true,
      },
      autoGroupColumnDef: {
        headerName: "Organisation Hierarchy",
        rowDragText: this.gridOptions.rowDragText,
        rowDrag: true,
        minWidth: 300,
        cellRendererParams: {
          suppressDoubleClickExpand: true,
          checkbox: true,
        },
      },
      getDataPath: function (data) {
        return data.orgHierarchy;
      },
    };
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    immutableStore.forEach(function (data, index) {
      data.id = index;
    });
    this.gridApi.setRowData(immutableStore);
  };

  componentWillMount() {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }

  onKeyDown = (event) => {
    if (event.key === "Control") {
      this.setState({ makeChild: true });
      document.removeEventListener("keydown", this.onKeyDown);
      console.log("Make Into Child:", this.state.makeChild);
    }
  };
  onKeyUp = (event) => {
    if (event.key === "Control") {
      this.setState({ makeChild: false });
      document.addEventListener("keydown", this.onKeyDown);
      console.log("Make Into Child:", this.state.makeChild);
    }
  };

  gridOptions = {
    rowDragText: (params) => {
      if (this.state.makeChild) {
        return `Make Child of....`;
      }
      if (this.state.selectedNodes.length > 1) {
        return `Multiple Rows`;
      }
      return `${params.rowNode.key}`;
    },

    onRowDragEnter: (event) => {
      console.log("Selecting Nodes");
      event.node.setSelected(true);
    },
    onRowSelected: (event) => {
      let rowSelected = event.node.selected;

      //loop through all leaf nodes and select/de-select them
      for (let leafnode of event.node.allLeafChildren) {
        if (!rowSelected && leafnode.parent.selected) {
          alert("Cannot de-select a row with it's parent selected");
          leafnode.setSelected(true);
          console.log("break");
          break;
        } else {
          leafnode.setSelected(rowSelected);
        }
      }
      this.setState({ selectedNodes: this.gridApi.getSelectedNodes() });

      //filter the selectedNodes to ONLY highest level parent
      let highestParents = [...this.state.selectedNodes];
      //loop through highestParents, if parent within selectedNodes, remove from arr
      this.state.selectedNodes.forEach((node) => {
        let foundIndex = this.state.selectedNodes.indexOf(node.parent);
        if (foundIndex > -1) {
          highestParents.splice(highestParents.indexOf(node), 1);
        }
      });
      this.setState({ highestParents: highestParents });
      console.log(`highestParents`, this.state.highestParents);
    },
    onRowDragMove: (event) => {},

    onRowClicked: (event) => {
      console.log(event.node);
    },

    onRowDragEnd: (event) => {
      let newStore = [];
      //grab current state of immutable store
      event.api.forEachNode((node) => {
        newStore.push(node);
      });

      //=======================================MAKE CHILD==================================================================//
      if (
        this.state.makeChild &&
        this.state.selectedNodes.indexOf(event.overNode) === -1
      ) {
        //loop through selectedNodes
        let newStoreClone = [];
        let highestParentHierarchy = event.overNode.data.orgHierarchy;
        this.state.selectedNodes.forEach((node) => {
          //find node of interest

          let levelofSelected = findLevel(node);
          console.log(levelofSelected);
          //is the parent also selected?
          let newData = highestParentHierarchy.concat(
            concatenateData(node, levelofSelected)
          );

          let foundIndex = newStore.indexOf(node);
          newStoreClone =
            newStoreClone.length > 0 ? newStoreClone : _.cloneDeep(newStore);

          console.log(newStore[foundIndex]);
          newStoreClone[foundIndex].data.orgHierarchy = newData;
          // newStore.splice(newStore.length - 1, 0, newData);
        });
        newStoreClone = newStoreClone.map((node) => node.data);
        immutableStore = newStoreClone;
        console.log(newStoreClone);
        event.api.setRowData(newStoreClone);
        event.api.refreshCells({
          // rowNodes: [],
          force: true,
          suppressFlash: true,
        });
      } else {
        //===========================================MOVEMENT================================================================//

        if (this.state.selectedNodes.length === 1) {
          //single or multiple
          if (event.overNode) {
            //check if the node is dropped within the same parent
            if (
              compareParents(event.node.parent, event.overNode.parent) ||
              event.node.parent === event.overNode
            ) {
              console.log(
                "This single node has been dropped within the same parent!"
              );
              let movingNode = event.node;
              let overNode = event.overNode;

              let rowNeedsToMove = movingNode !== overNode;

              if (rowNeedsToMove) {
                // the list of rows we have is data, not row nodes, so extract the data
                let movingData = movingNode.data;
                let overData = overNode.data;

                let fromIndex = immutableStore.indexOf(movingData);
                let toIndex = immutableStore.indexOf(overData);

                let newStore = immutableStore.slice();
                moveInArray(newStore, fromIndex, toIndex);

                immutableStore = newStore;
                event.api.setRowData(newStore);

                function moveInArray(arr, fromIndex, toIndex) {
                  let element = arr[fromIndex];
                  arr.splice(fromIndex, 1);
                  arr.splice(toIndex, 0, element);
                }
              }
            } else {
              alert("INVALID MOVE: The row is not within the original parent");
            }
          }
          //=============Multiple==================//
        } else {
          function singleParent(nodesArr) {
            let firstnodeParent = nodesArr[0].parent;
            let originalLength = nodesArr.length;
            nodesArr = nodesArr.filter(
              (node) => node.parent === firstnodeParent
            );
            console.log(nodesArr);
            return nodesArr.length === originalLength ? true : false;
          }
          //see if highestParents has more than one parent AND not within one single parent
          if (
            this.state.highestParents.length === 1 ||
            singleParent([...this.state.highestParents])
          ) {
            console.log(newStore);
            //delete from newStore
            this.state.highestParents.forEach((node) => {
              newStore.splice(newStore.indexOf(node), 1);
            });
            //insert into desired location
            this.state.highestParents.forEach((node) => {
              if (event.overIndex === 0) {
                newStore.splice(0, 0, node);
              } else newStore.splice(event.overIndex + 1, 0, node);
            });

            newStore = newStore.map((node) => {
              return node.data;
            });

            immutableStore = newStore;
            console.log(newStore);
            event.api.setRowData(newStore);
          } else {
            alert(
              "Trying to move multiple different level parents. Invalid move."
            );
          }
        }
      }

      //============================================================================//
    },

    // onRowDragEnd: (event) => {
    //   let nodeHierarchy = event.node.data.orgHierarchy;
    //   let newParentPath = potentialParent.data.orgHierarchy;
    //   if (potentialParent) {
    //     //get the last entry of the moved node
    //     let lastEntry = [nodeHierarchy[nodeHierarchy.length - 1]];
    //     //combine the arrays
    //     let newPath = newParentPath.concat(lastEntry);
    //     event.node.data.orgHierarchy = newPath;
    //     console.log(event.node);
    //     this.gridApi.applyTransaction({ update: [event.node.data] });
    //     refreshRows(event.api, [event.node]);
    //   }
    // },
  };

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div
          style={{
            height: "100%",
            width: "100%",
          }}
          className="ag-theme-alpine"
        >
          <Toolbar
            selectedNodes={this.state.selectedNodes}
            gridApi={this.gridApi}
          />
          <AgGridReact
            //gridOptions THIS SET TAKES PRECEDENT COMPARED TO ABOVE
            getRowHeight={this.getRowHeight}
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            autoGroupColumnDef={this.state.autoGroupColumnDef}
            treeData={true}
            filterable={true}
            animateRows={true} //SLOWS DOWN CLOSING OF MODULE IF ANIMATION HAS TO RUN FIRST
            editable={true}
            // sideBar={"columns"}
            enableMultiRowDragging={true}
            suppressRowClickSelection={true}
            groupDefaultExpanded={-1}
            getDataPath={this.state.getDataPath}
            onGridReady={this.onGridReady}
            gridOptions={this.gridOptions}
            rowSelection={"multiple"}
            immutableData={true}
            getRowNodeId={getRowNodeId}
            frameworkComponents={this.state.frameworkComponents}
          />
        </div>
      </div>
    );
  }
}

function concatenateData(node, levelofSelected) {
  //loop through the data levelofSelected number of times
  let newData = [node.data.orgHierarchy[node.data.orgHierarchy.length - 1]];
  while (levelofSelected > 1) {
    newData = [
      node.parent.data.orgHierarchy[node.parent.data.orgHierarchy.length - 1],
    ].concat(newData);
    node = node.parent;
    levelofSelected--;
  }

  return newData;
}

function findLevel(node) {
  let level = 1;
  while (node.parent.selected) {
    level++;
    node = node.parent;
  }
  return level;
}
// function setPotentialParentForNode({ api, node, overNode }) {
//   let newPotentialParent;
//   if (node === overNode) return;
//   else {
//     //set it as the new parent node
//     console.log("New Parent Selected");
//     newPotentialParent = overNode;
//     potentialParent = newPotentialParent;
//     console.log(potentialParent);
//   }
// }

function compareParents(dragParent, hoverParent) {
  return dragParent === hoverParent ? true : false;
}
function getRowNodeId(data) {
  return data.id;
}

let immutableStore = [
  {
    orgHierarchy: ["Erica Rogers"],
    jobTitle: "CEO",
    employmentType: "Permanent",
    property: "Random",
  },
  {
    orgHierarchy: ["JJ Rogers"],
    jobTitle: "CEO",
    employmentType: "Permanent",
    property: "Random",
  },

  {
    orgHierarchy: ["JJ Rogers", "Malcolm Barrett"],
    jobTitle: "Exec. Vice President",
    employmentType: "Permanent",
    property: "Random",
  },

  {
    orgHierarchy: [
      "JJ Rogers",
      "Malcolm Barrett",
      "Esther Baker",
      "Brittany Hanson",
    ],
    jobTitle: "Fleet Coordinator",
    employmentType: "Permanent",
    property: "Random",
  },

  {
    orgHierarchy: ["JJ Rogers", "Malcolm Barrett", "Esther Baker"],
    jobTitle: "Director of Operations",
    employmentType: "Permanent",
    property: "Random",
  },
  {
    orgHierarchy: ["Erica Rogers", "Malcolm Barrett"],
    jobTitle: "Exec. Vice President",
    employmentType: "Permanent",
    property: "Random",
  },
  {
    orgHierarchy: ["Erica Rogers", "Malcolm Barrett", "Esther Baker"],
    jobTitle: "Director of Operations",
    employmentType: "Permanent",
    property: "Random",
  },
  {
    orgHierarchy: [
      "Erica Rogers",
      "Malcolm Barrett",
      "Esther Baker",
      "Brittany Hanson",
    ],
    jobTitle: "Fleet Coordinator",
    employmentType: "Permanent",
    property: "Random",
  },
  {
    orgHierarchy: [
      "Erica Rogers",
      "Malcolm Barrett",
      "Esther Baker",
      "Brittany Hanson",
      "Leah Flowers",
    ],
    jobTitle: "Parts Technician",
    employmentType: "Contract",
    property: "Random",
  },
  {
    orgHierarchy: [
      "Erica Rogers",
      "Malcolm Barrett",
      "Esther Baker",
      "Brittany Hanson",
      "Tammy Sutton",
    ],
    jobTitle: "Service Technician",
    employmentType: "Contract",
    property: "Random",
  },
  {
    orgHierarchy: [
      "Erica Rogers",
      "Malcolm Barrett",
      "Esther Baker",
      "Derek Paul",
    ],
    jobTitle: "Inventory Control",
    employmentType: "Permanent",
    property: "Random",
  },
  {
    orgHierarchy: ["Erica Rogers", "Malcolm Barrett", "Francis Strickland"],
    jobTitle: "VP Sales",
    employmentType: "Permanent",
    property: "Random",
  },
  {
    orgHierarchy: [
      "Erica Rogers",
      "Malcolm Barrett",
      "Francis Strickland",
      "Morris Hanson",
    ],
    jobTitle: "Sales Manager",
    employmentType: "Permanent",
    property: "Random",
  },
  {
    orgHierarchy: [
      "Erica Rogers",

      "Malcolm Barrett",
      "Francis Strickland",
      "Todd Tyler",
    ],
    jobTitle: "Sales Executive",
    employmentType: "Contract",
    property: "Random",
  },
  {
    orgHierarchy: [
      "Erica Rogers",
      "Malcolm Barrett",
      "Francis Strickland",
      "Bennie Wise",
    ],
    jobTitle: "Sales Executive",
    employmentType: "Contract",
    property: "Random",
  },
  {
    orgHierarchy: [
      "Erica Rogers",
      "Malcolm Barrett",
      "Francis Strickland",
      "Joel Cooper",
    ],
    jobTitle: "Sales Executive",
    employmentType: "Permanent",
    property: "Random",
  },
];

let potentialParent = null;

export default AgGrid;
