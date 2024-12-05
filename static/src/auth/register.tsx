import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useApi } from "../hook/api";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { encodePassword } from "../utils/passwordEncode";

interface IRegister {
  username: string,
  password: string
}

const RegisterPage = () => {
  const api = useApi()
  const {
    control, handleSubmit, formState: { errors },
  } = useForm<IRegister>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate()

  const onSubmit = async (data: IRegister) => {
    const res = await api.post("/api/register", {
      username: data.username,
      password: await encodePassword(data.password),
    })
    if (res.status) {
      navigate("/")
    } else {
      console.log(res)
      enqueueSnackbar(res.err.msg, { variant: 'error' })
    }
  }

  return (
    <>
      <Box className="flex flex-col gap-2">
        <Typography aria-label="Register" variant="h1" className="text-2xl">Register</Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="flex flex-col gap-4">
            <Box className="flex flex-col gap-2">
              <Controller
                name="username"
                control={control}
                defaultValue=""
                rules={{
                  required: 'email is required',
                  pattern: {
                    value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
                    message: "need to be valid email format",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="email"
                    size="small"
                    variant="outlined"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    aria-label="email field"
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Password is required',
                  pattern: {
                    value: /^.{8,}$/,
                    message: "passwoed need to be at least 8 character",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    size="small"
                    variant="outlined"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    aria-label="password field"
                  />
                )}
              />
            </Box>

            <Button type="submit" variant="contained">Submit</Button>
          </Box>
        </form>

        <Divider />

        <Link to={"/login"} className="flex justify-center">
          Login
        </Link>

      </Box>
    </>
  )
}

export default RegisterPage

