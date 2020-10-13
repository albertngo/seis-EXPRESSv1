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

    this.state = {
      multiKey: false,
      selectedNodes: [],
      columnDefs: [
        {
          lockPosition: true,
          cellRenderer: "hierarchyButtons",
          editable: false,
          maxWidth: 100,
          // suppressCellSelection: true,
          cellClass: "no-border",
          // suppressNavigable: true,
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
        rowDragText: rowDragText,
        rowDrag: true,
        minWidth: 300,
        cellRendererParams: {
          suppressCount: true,
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

  // componentWillMount() {
  //   document.addEventListener("keydown", this.onKeyDown.bind(this));
  //   document.addEventListener("keyup", this.onKeyUp.bind(this));
  // }

  // onKeyDown = (event) => {
  //   if (event.key === "Shift" || event.key === "Control") {
  //     this.setState({ multiKey: true });
  //     console.log(this.state.multiKey);
  //   }
  // };
  // onKeyUp = (event) => {
  //   if (event.key === "Shift" || event.key === "Control") {
  //     this.setState({ multiKey: false });
  //     console.log(this.state.multiKey);
  //   }
  // };

  clearSaved = () => {
    // this.setState({ selectedNodes: [] });
    // console.log(this.state.selectedNodes);
    // console.log("CLEAREDDD");
  };

  gridOptions = {
    onRowDragEnter: (event) => {
      console.log("Selecting Nodes");
      event.node.setSelected(true);
      // for (let leafnode of event.node.allLeafChildren) {
      //   leafnode.setSelected(true);

      // }
    },
    onRowSelected: (event) => {
      let rowSelected = event.node.selected ? true : false;

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
    },
    onRowDragMove: (event) => {
      //===========================================MOVEMENT================================================================//
      //single or multiple
      console.log("MOVING");

      //============================================================================//
    },
    onRowClicked: (event) => {
      console.log(event.node);
    },

    onRowDragEnd: (event) => {
      //===========================================MOVEMENT================================================================//
      //single or multiple
      if (this.state.selectedNodes.length === 1) {
        if (event.overNode) {
          if (event.node !== event.overNode) {
            if (
              compareParents(event.node.parent, event.overNode.parent) ||
              event.node.parent === event.overNode
            ) {
              console.log(true);
              var movingNode = event.node;
              var overNode = event.overNode;

              var rowNeedsToMove = movingNode !== overNode;

              if (rowNeedsToMove) {
                // the list of rows we have is data, not row nodes, so extract the data
                var movingData = movingNode.data;
                var overData = overNode.data;

                var fromIndex = immutableStore.indexOf(movingData);
                var toIndex = immutableStore.indexOf(overData);

                var newStore = immutableStore.slice();
                moveInArray(newStore, fromIndex, toIndex);

                immutableStore = newStore;
                event.api.setRowData(newStore);

                // event.api.clearFocusedCell();
                function moveInArray(arr, fromIndex, toIndex) {
                  var element = arr[fromIndex];
                  arr.splice(fromIndex, 1);
                  arr.splice(toIndex, 0, element);
                }
              }
            } else {
              alert("INVALID MOVE: The row is not within the original parent");
            }
          }
        }
      } else {
        //check if EACH node is dropped into same parent
        for (let node of this.state.selectedNodes) {
          if (
            node.parent !== event.overNode.parent &&
            node.parent !== event.overNode
          ) {
            //alert invalid move
            alert("SELECTED OUTSIDE OF PARENT AND CANNOT MOVE");
            break;
          }
        }

        for (let node of this.state.selectedNodes) {
          console.log([node.rowIndex]);
        }
        let newIndex = changeIndex(
          _.cloneDeep(this.state.selectedNodes),
          event.overNode.rowIndex
        );
        console.log(newIndex);
        event.api.refreshCells({ force: true });
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

  addNewRow = () => {};
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
            clearSaved={this.clearSaved}
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
            sideBar={"columns"}
            enableMultiRowDragging={true}
            suppressRowClickSelection={true}
            // suppressMoveWhenRowDragging={true}
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

function compareParents(dragParent, hoverParent) {
  return dragParent === hoverParent ? true : false;
}
function getRowNodeId(data) {
  return data.id;
}
function changeIndex(selectedNodes, rowIndex) {
  for (let node of selectedNodes) {
    node.rowIndex = rowIndex + 1;
    rowIndex++;
  }
  return selectedNodes;
}

let rowDragText = (params) => {
  if (params.rowNode.allLeafChildren.length > 1) {
    return `Multiple Row(s)`;
  }

  return `${params.rowNode.key}`;
  console.log(params);
};

let immutableStore = [
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
    orgHierarchy: ["JJ Rogers", "Malcolm Barrett", "Esther Baker"],
    jobTitle: "Director of Operations",
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
    orgHierarchy: ["Erica Rogers"],
    jobTitle: "CEO",
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

// function setPotentialParentForNode({ api, node, overNode }) {
//   var newPotentialParent;
//   if (node === overNode) return;
//   else {
//     //set it as the new parent node
//     console.log("New Parent Selected");
//     newPotentialParent = overNode;
//     potentialParent = newPotentialParent;
//     console.log(potentialParent);
//   }
// }
let potentialParent = null;
let draggedNodes = null; //move to state?
let hoveredNode = null; //move to state?

export default AgGrid;
