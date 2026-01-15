import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import classes from "./LoginPage.module.scss";
import { yupResolver } from "mantine-form-yup-resolver";
import { INITIAL_VALUES } from "../../form/initial-values";
import { VALIDATIONS } from "../../form/validations";
import { useMutation } from "@apollo/client/react";
import {
  Admin_Roles,
  AdminLoginDocument,
  GetAdminDataDocument,
} from "../../generated/graphql";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../enum/routes";

const LoginPage = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: INITIAL_VALUES.loginForm,
    validate: yupResolver(VALIDATIONS.loginForm),
  });

  const [adminLogin] = useMutation(AdminLoginDocument, {
    onCompleted: (data) => {
      if (data) {
        notifications.show({
          message: "Login Successful",
          color: "green",
        });
        if (data.adminLogin.role === Admin_Roles.Admin) {
          navigate(ROUTES.ADMIN);
        } else if (data.adminLogin.role === Admin_Roles.Instructor) {
          navigate(ROUTES.INSTRUCTOR_DASHBOARD);
        }
      }
    },
    onError: (error) => {
      notifications.show({
        message: error.message,
        color: "red",
      });
    },
    update(cache, { data }) {
      if (data?.adminLogin) {
        cache.writeQuery({
          query: GetAdminDataDocument,
          data: {
            getAdminData: data.adminLogin,
          },
        });
      }
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    adminLogin({
      variables: {
        input: {
          email: values.email,
          password: values.password,
        },
      },
    });
  };
  return (
    <Box>
      <div className={classes.wrapper}>
        <Container my={40} w={"90%"}>
          <Title className={classes.title}>Welcome back!</Title>

          <Paper
            withBorder
            shadow="md"
            p={30}
            mt={30}
            radius="md"
            className={classes.form}
          >
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label="Email"
                placeholder="you@mantine.dev"
                {...form.getInputProps("email")}
                style={{ textAlign: "left" }}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                mt="md"
                style={{ textAlign: "left" }}
                {...form.getInputProps("password")}
              />
              <Button fullWidth mt="xl" type="submit">
                Sign in
              </Button>
            </form>
          </Paper>
        </Container>
      </div>
    </Box>
  );
};

export default LoginPage;
