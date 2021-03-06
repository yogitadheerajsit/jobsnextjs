import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import makeStyles from "@mui/styles/makeStyles";
import {
  Attachment,
  EmailOutlined,
  LockOutlined,
  PersonOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { defaultStyles, FileIcon } from "react-file-icon";
import { useDispatch } from "react-redux";
import { Link } from "next/link";
import { loginAction } from "../../redux/actions";
import { login } from "../../service/auth";
import { RESPONSE_CODE } from "../../util/constants";
import { validateField } from "../../util/helper";
import "./apply-job-detail.module.scss";

const useStyles = makeStyles((theme) => ({
  helperText: {
    marginLeft: 0,
    color: "red",
  },
  btnsDiv: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const ApplyJobDetail = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    password: "",
    emailId: "",
  });
  const [loginDataErr, setLoginDataErr] = useState({});

  const onLoginChange = (prop) => (event) => {
    setLoginDataErr({
      ...loginDataErr,
      [prop]: validateField(
        event.target.name,
        event.target.value,
        prop === "password" ? prop : event.target.type,
        event.target.required,
        true
      ),
    });
    setLoginData({ ...loginData, [prop]: event.target.value });
  };

  const [file, setFile] = useState(null);

  const [showJsLoginPassword, setShowJsLoginPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowJsLoginPassword(!showJsLoginPassword);
  };

  const onLoginBtnClick = (event) => {
    const emailErr = validateField(
      "emailId",
      loginData.emailId,
      "text",
      true,
      true
    );

    const passwordErr = validateField(
      "password",
      loginData.password,
      "password",
      true,
      true
    );
    setLoginDataErr({
      ...loginDataErr,
      emailId: emailErr,
      password: passwordErr,
    });

    if (!emailErr && !passwordErr) {
      const result = login(loginData);
      result
        .then((response) => {
          if (response.data) {
            if (response.data.code === RESPONSE_CODE.EMAIL_NOT_REGISTERED) {
              setLoginDataErr({
                ...loginDataErr,
                emailId: "Email Id is not registered",
              });
            } else if (!response.data.token) {
              setLoginDataErr({
                ...loginDataErr,
                emailId: "Invalid credentials",
                password: " ",
              });
            } else {
              dispatch(loginAction(response.data));
            }
          }
        })
        .catch((err) => {
          setLoginDataErr({
            ...loginDataErr,
            password: "Invalid credentials",
          });
        });
    }
  };

  const getIconStyle = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    return defaultStyles[extension] || defaultStyles.txt;
  };

  return (
    <div>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className={`${classes.modal} apply-job-detail`}
        open={props.open}
        onClose={props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className="content">
          <h2
            style={{ marginTop: 0, marginBottom: "0.75rem" }}
            id="modal-title"
          >
            Use professional profile to apply
          </h2>
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            className="field-row-container"
          >
            <Grid item xs={12} md={6} className="field">
              <InputLabel className="field-label">Username or email</InputLabel>
              <TextField
                name="email"
                id="email"
                onChange={onLoginChange("emailId")}
                variant="outlined"
                required
                placeholder="Enter username or email"
                size="medium"
                value={loginData.email}
                error={Boolean(loginDataErr.emailId)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined className="icon" />
                    </InputAdornment>
                  ),
                }}
              />
              {loginDataErr.emailId && (
                <FormHelperText error className={classes.helperText}>
                  {loginDataErr.emailId}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} md={6} className="field">
              <InputLabel className="field-label">Password</InputLabel>
              <TextField
                type={showJsLoginPassword ? "text" : "password"}
                name="password"
                id="password"
                onChange={onLoginChange("password")}
                variant="outlined"
                error={Boolean(loginDataErr.password)}
                required
                placeholder="Enter password"
                size="medium"
                value={loginData.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined className="icon" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        edge="end"
                        onClick={handleClickShowPassword}
                        size="large"
                      >
                        {showJsLoginPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {loginDataErr.password && (
                <FormHelperText error className={classes.helperText}>
                  {loginDataErr.password}
                </FormHelperText>
              )}
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            className="field-row-container"
          >
            <Grid item xs={12} md={3} className="field">
              <Button className="login-btn" onClick={onLoginBtnClick}>
                Login
              </Button>
            </Grid>
            <Grid item xs={12} md={3} className="field">
              Dont have an account? &nbsp;{" "}
              <Link to="/jobseeker/register" className="link">
                Register
              </Link>
            </Grid>
            <Grid item xs={12} md={6} className="field">
              <Link to="/jobseeker/register" className="link">
                Forgot Password ?
              </Link>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            className="field-row-container"
          >
            <Grid item xs={12} md={12} className="field">
              <h2
                style={{ marginTop: "0.75rem", marginBottom: "0.75rem" }}
                id="modal-title"
              >
                Or send your application quickly without registration
              </h2>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            className="field-row-container"
          >
            <Grid item xs={12} md={6} className="field">
              <InputLabel className="field-label">Full name</InputLabel>
              <TextField
                name="email"
                id="email"
                onChange={onLoginChange}
                variant="outlined"
                required
                placeholder="Enter full name"
                size="medium"
                value={loginData.fullname}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlined className="icon" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} className="field">
              <InputLabel className="field-label">Email</InputLabel>
              <TextField
                type="password"
                name="email"
                id="email"
                onChange={onLoginChange}
                variant="outlined"
                required
                placeholder="Enter email"
                size="medium"
                value={loginData.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined className="icon" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            className="field-row-container"
          >
            <Grid item xs={12} md={12} className="field">
              <InputLabel className="field-label">Notes</InputLabel>
              <TextField
                name="notes"
                id="notes"
                onChange={onLoginChange}
                variant="outlined"
                required
                multiline
                maxRows={6}
                rows={4}
                placeholder="Enter notes"
                size="medium"
                value={loginData.notes}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            className="field-row-container"
          >
            <Grid item xs={12} md={12} className="field">
              <InputLabel className="field-label">Attach file</InputLabel>
              <input
                accept="image/*"
                className={classes.input}
                style={{ display: "none" }}
                id="raised-button-file"
                multiple={false}
                onChange={(evt) => {
                  setFile(evt.target.files.length ? evt.target.files[0] : null);
                }}
                type="file"
              />
              <label
                className="raised-button-file"
                htmlFor="raised-button-file"
              >
                <Grid
                  container
                  spacing={2}
                  justifyContent="space-between"
                  className="field-row-container"
                >
                  <Grid item xs={12} md={6} className="field">
                    {file && file != null ? (
                      <span className="attach-file-label">
                        <FileIcon
                          extension={
                            file && file?.name
                              ? file?.name?.split(".").pop().toLowerCase()
                              : ""
                          }
                          {...getIconStyle(file?.name)}
                        />
                        &nbsp;
                        <span className="file-name">{file?.name}</span>
                      </span>
                    ) : (
                      <span className="attach-file-label">
                        <Attachment /> &nbsp; Attach your file
                      </span>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className="field browse-btn-container"
                  >
                    <Button
                      variant="raised"
                      component="span"
                      className="browse-btn"
                    >
                      Browse
                    </Button>
                  </Grid>
                </Grid>
              </label>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            className="field-row-container"
          >
            <Grid item xs={12} className="field">
              <Button className="cancel-btn" onClick={props.handleClose}>
                Cancel
              </Button>
              &nbsp; &nbsp;
              <Button className="apply-btn">Apply for this job</Button>
            </Grid>
          </Grid>
        </div>
      </Modal>
    </div>
  );
};

ApplyJobDetail.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ApplyJobDetail;
