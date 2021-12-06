import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, FormHelperText, Grid, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import makeStyles from "@mui/styles/makeStyles";
import LockIcon from "@mui/icons-material/Lock";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import userImage from "../../../assets/images/user.png";

import { DATETIMEFORMAT, RESPONSE_CODE } from "../../../util/constants";

import JobsHornEncryptAndDecrypt from "../../../util/jhSecurityBuilder.js";

import { login } from "../../../service/auth";
import { useDispatch } from "react-redux";
import { loginAction, showSnackbar } from "../../../redux/actions";
import { JsLogin as jsLogin, validateField } from "../../../util/helper";

import colors from "../../../vars.module.scss";
import {
  jsLoginContainer,
  imageTextGrid,
  imageText,
  containedBtn,
  divider,
  dividerDiv,
  dontHaveAccountRegisterDiv,
  form,
  formGrid,
  helperText,
  formBtnsDiv,
  btnsDiv,
  forgotPasswordDiv,
  link,
  loginBgImageTextDiv,
  loginFormDiv,
  loginFormGrid,
  loginLinkText,
  loginTitleDiv,
  registerLinkText,
  required,
  textFieldDiv,
  title,
  userImageAvatar,
} from "./JsLogin.module.scss";

const useStyles = makeStyles((theme) => ({
  textFieldDiv: {
    "& > *": {
      margin: theme.spacing(1),
      width: "320px",
    },
    [theme.breakpoints.only("xs")]: {
      "& > *": {
        width: "85vw",
      },
    },
  },
  iconColor: {
    color: colors.disableColor,
  },
}));

function JsLogin() {
  const classes = useStyles();
  const [showJsLoginPassword, setShowJsLoginPassword] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const initialState = {
    password: "",
    emailId: "",
  };
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleClickShowPassword = () => {
    setShowJsLoginPassword(!showJsLoginPassword);
  };

  const handleChange = (prop) => (event) => {
    const type = prop === "password" ? prop : event.target.type;
    setErrors({
      ...errors,
      [prop]: validateField(
        event.target.name,
        event.target.value,
        type,
        event.target.required,
        false
      ),
    });
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const isValid = () => {
    let isValidChk = true;
    Object.keys(errors).forEach((element) => {
      isValidChk = isValidChk && !Boolean(errors[element]);
    });

    Object.keys(values).forEach((element) => {
      isValidChk = isValidChk && Boolean(values[element]);
    });

    return isValidChk;
  };

  const onLoginBtnClick = async (event) => {
    let aesJobsHorn = new JobsHornEncryptAndDecrypt();
    const output = aesJobsHorn.getFinalOutput(values, DATETIMEFORMAT, "CAND");
    const { timeStamp, saltRandom20Char, cipherText } = output;
    const result = login({
      timeStamp: timeStamp.toString(),
      systemId: saltRandom20Char,
      dataSet: cipherText,
    });
    result
      .then((response) => {
        if (response.status === 200) {
          if (
            (!response?.data?.token || response?.data?.token == null) &&
            [
              RESPONSE_CODE.INVALID_CREDENTIALS,
              RESPONSE_CODE.INVALID_USER,
              RESPONSE_CODE.INVALID_ACCOUNT_STATUS,
              RESPONSE_CODE.EMAIL_NOT_REGISTERED,
              RESPONSE_CODE.INVALID_TIMESTAMP_IN_REQUEST,
              RESPONSE_CODE.UNEXPECTED_ERROR,
            ].indexOf(response?.data?.code) !== -1
          ) {
            dispatch(showSnackbar(response?.data.message, "warning"));
          } else {
            if (response?.data?.code === RESPONSE_CODE.SUCCESSFUL_LOGIN) {
              history.push("/jobseeker/homepage");
            } else if (
              response?.data?.code === RESPONSE_CODE.INCOMPLETE_PROFILE
            ) {
              history.push("/jobseeker/create-profile");
            } else {
              history.push("/logged-in");
            }
            dispatch(loginAction({ ...response.data, email: values.emailId }));
          }
        } else {
          dispatch(showSnackbar("Something went wrong", "warning"));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className={jsLoginContainer}>
        <Grid container className={loginFormGrid}>
          <Grid item lg={4} md={5} sm={7} xs={11} className={formGrid}>
            <div className={loginFormDiv}>
              <div className={userImageAvatar}>
                <img alt="" src={userImage} />
              </div>
              <div className={loginTitleDiv}>
                <Typography className={title}>Job Seeker Login</Typography>
              </div>
              <form autoComplete="off" className={form}>
                <div className={`${classes.textFieldDiv} ${textFieldDiv}`}>
                  <label className={required}>Email</label>
                  <FormControl variant="outlined">
                    <OutlinedInput
                      id="jobseeker-login-email"
                      placeholder="Eg: maria@gmail.com"
                      type="email"
                      onChange={handleChange("emailId")}
                      value={values.emailId}
                      name={jsLogin.email}
                      required
                      error={Boolean(errors.emailId)}
                      startAdornment={
                        <InputAdornment position="start">
                          <MailOutlineIcon className={classes.iconColor} />
                        </InputAdornment>
                      }
                    />
                    {errors.emailId && (
                      <FormHelperText error className={helperText}>
                        {errors.emailId}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className={`${classes.textFieldDiv} ${textFieldDiv}`}>
                  <label className={required}>Password</label>
                  <FormControl variant="outlined">
                    <OutlinedInput
                      id="jobseeker-login-password"
                      value={values.password}
                      type={showJsLoginPassword ? "text" : "password"}
                      onChange={handleChange("password")}
                      placeholder="password"
                      name={jsLogin.password}
                      required
                      inputProps={{
                        maxLength: 128,
                        minLength: 8,
                      }}
                      error={Boolean(errors.password)}
                      startAdornment={
                        <InputAdornment position="start">
                          <LockIcon className={classes.iconColor} />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            edge="end"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            size="large"
                          >
                            {showJsLoginPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {errors.password && (
                      <FormHelperText error className={helperText}>
                        {errors.password}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className={formBtnsDiv}>
                  <div className={btnsDiv}>
                    <Button
                      className={
                        values.emailId === "" && values.password === ""
                          ? ""
                          : containedBtn
                      }
                      size="small"
                      variant={
                        values.emailId === "" && values.password === ""
                          ? "outlined"
                          : "contained"
                      }
                      onClick={() => {
                        setValues(initialState);
                        setErrors({});
                      }}
                      disabled={values.emailId === "" && values.password === ""}
                    >
                      Cancel
                    </Button>
                    <Button
                      className={isValid() ? containedBtn : ""}
                      size="small"
                      variant={isValid() ? "contained" : "outlined"}
                      disabled={!isValid()}
                      onClick={onLoginBtnClick}
                    >
                      Login
                    </Button>
                  </div>
                  <div className={forgotPasswordDiv}>
                    <Link to="/jobseeker/forgot-password" className={link}>
                      Forgot password ?
                    </Link>
                  </div>
                </div>
                <div className={dontHaveAccountRegisterDiv}>
                  <Typography className={registerLinkText}>
                    Don't have an account?{" "}
                    <Link to="/jobseeker/register" className={link}>
                      Register
                    </Link>
                  </Typography>
                </div>
                <div className={dividerDiv}>
                  <Divider className={divider} />
                </div>
                <div className="employerLoginLinkDiv">
                  <Typography className={loginLinkText}>
                    <Link
                      to="/employer/login"
                      style={{ fontWeight: "bold" }}
                      className={link}
                    >
                      Employer Login, click here
                    </Link>
                  </Typography>
                </div>
              </form>
            </div>
          </Grid>
          <Grid item lg={5} md={5} sm={7} xs={12} className={imageTextGrid}>
            <div className={loginBgImageTextDiv}>
              <Typography className={imageText} variant="h4">
                Welcome to Jobshorn
              </Typography>
              <Typography className={imageText} variant="body1">
                Sign in to continue to your account
              </Typography>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default JsLogin;