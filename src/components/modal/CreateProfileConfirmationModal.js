import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import { Button } from "@mui/material";
import PropTypes from "prop-types";
import colors from "../../vars.module.scss";
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  btnsDiv: {
    display: "flex",
    justifyContent: "space-between",
  },
  btn: {
    fontWeight: 500,
    backgroundColor: colors.primaryColor,
    color: "white",
    "&:hover": {
      backgroundColor: colors.primaryColor,
      color: "white",
    },
  },
  modalTitle: {
    marginTop: 0,
    marginBottom: "0.75rem",
  },
  modalSubtitle: {
    marginTop: 0,
    marginBottom: "1.25rem",
  },
}));
function CreateProfileConfirmationModal(props) {
  const classes = useStyles();
  return (
    <div>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className={classes.modal}
        open={props.open}
        onClose={props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className={classes.paper}>
          <h2 className={classes.modalTitle} id="modal-title">
            {props.title}
          </h2>
          <p className={classes.modalSubtitle} id="modal-subtitle">
            {props.message}
          </p>
          <div className={classes.btnsDiv}>
            <Button
              variant="contained"
              onClick={props.yesBtnClick}
              className={classes.btn}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              className={classes.btn}
              onClick={props.noBtnClick}
            >
              No
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
CreateProfileConfirmationModal.propsType = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  yesBtnClick: PropTypes.func.isRequired,
  noBtnClick: PropTypes.func.isRequired,
};
export default CreateProfileConfirmationModal;
