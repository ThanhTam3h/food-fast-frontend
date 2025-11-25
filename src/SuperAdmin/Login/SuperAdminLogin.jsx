import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../State/Authentication/Action"; // Sử dụng action login có sẵn
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const SuperAdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Lấy state auth để kiểm tra lỗi nếu cần
  // const { auth } = useSelector((store) => store);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Gọi API login
      dispatch(
        loginUser({
          data: values,
          navigate: () => {
            // Sau khi login thành công, điều hướng về trang Super Admin Dashboard
            navigate("/super-admin");
          },
        })
      );
    },
  });

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "col",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          Super Admin Login
        </Typography>

        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5, fontSize: "1rem" }}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default SuperAdminLogin;
