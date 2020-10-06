import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function ConfirmAlert(props) {
  return (
    <div>
      <Dialog
        open={props.openState}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Delete (${
          props.nodesToDelete.length ? props.nodesToDelete.length : 1
        }) rows and their children?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The selected rows and their corresponding children will be deleted.
            They will be in the recovery module for restore if desired
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={props.deleteHandler} color="disabled" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
