import React, { Component } from "react";
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
      selectedNodes: "",
      rowData: [
        {
          orgHierarchy: ["JJ Rogers"],
          jobTitle: "CEO",
          employmentType: "Permanent",
        },

        {
          orgHierarchy: ["JJ Rogers", "Malcolm Barrett"],
          jobTitle: "Exec. Vice President",
          employmentType: "Permanent",
        },
        {
          orgHierarchy: ["JJ Rogers", "Malcolm Barrett", "Esther Baker"],
          jobTitle: "Director of Operations",
          employmentType: "Permanent",
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
        },
        {
          orgHierarchy: ["Erica Rogers"],
          jobTitle: "CEO",
          employmentType: "Permanent",
        },

        {
          orgHierarchy: ["Erica Rogers", "Malcolm Barrett"],
          jobTitle: "Exec. Vice President",
          employmentType: "Permanent",
        },
        {
          orgHierarchy: ["Erica Rogers", "Malcolm Barrett", "Esther Baker"],
          jobTitle: "Director of Operations",
          employmentType: "Permanent",
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
        },
        {
          orgHierarchy: [
            "Erica Rogers",
            "Malcolm Barrett",
            "Francis Strickland",
          ],
          jobTitle: "VP Sales",
          employmentType: "Permanent",
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
        },
      ],
      columnDefs: [
        {
          lockPosition: true,
          cellRenderer: "hierarchyButtons",
          editable: false,
          maxWidth: 100,
          suppressCellSelection: true,
          cellClass: "no-border",
          suppressNavigable: true,
        },
        { field: "jobTitle" },
        { field: "employmentType" },
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
        valueSetter: function (params) {
          console.log(params.data);
          return true;
        },
        headerName: "Organisation Hierarchy",
        rowDrag: true,
        // groupSelectsChildren: true,
        // checkboxSelection: true,
        minWidth: 300,
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
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
  };
  componentWillMount() {
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  onKeyDown = (event) => {
    if (event.key === "Shift" || event.key === "Control") {
      this.setState({ multiKey: true });
      console.log(this.state.multiKey);
    }
  };
  onKeyUp = (event) => {
    if (event.key === "Shift" || event.key === "Control") {
      this.setState({ multiKey: false });
      console.log(this.state.multiKey);
    }
  };

  gridOptions = {
    onRowClicked: (event) => {
      let rowNode = event.node;
      // rowNode.setSelected(true);
      this.setState({ selectedNodes: this.gridApi.getSelectedNodes() });
      console.log(this.state.selectedNodes);
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
          />
          <AgGridReact
            //gridOptions THIS SET TAKES PRECEDENT COMPARED TO ABOVE
            getRowHeight={this.getRowHeight}
            rowData={this.state.rowData}
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            autoGroupColumnDef={this.state.autoGroupColumnDef}
            treeData={true}
            filterable={true}
            // animateRows={true} SLOWS DOWN CLOSING OF MODULE IF ANIMATION HAS TO RUN FIRST
            editable={true}
            rowDragManaged={true}
            enableMultiRowDragging={true}
            suppressMoveWhenRowDragging={true}
            groupDefaultExpanded={-1}
            getDataPath={this.state.getDataPath}
            onGridReady={this.onGridReady}
            gridOptions={this.gridOptions}
            rowSelection={"multiple"}
            frameworkComponents={this.state.frameworkComponents}
          />
        </div>
      </div>
    );
  }
}
function setPotentialParentForNode({ api, node, overNode }) {
  var newPotentialParent;
  if (node === overNode) return;
  else {
    //set it as the new parent node
    console.log("New Parent Selected");
    newPotentialParent = overNode;
    potentialParent = newPotentialParent;
    console.log(potentialParent);
  }
}
var potentialParent = null;

function refreshRows(api, rowsToRefresh) {
  var params = {
    rowNodes: rowsToRefresh,
    force: true,
  };
  api.refreshCells(params);
  // api.redrawRows();
}

export default AgGrid;
