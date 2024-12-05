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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { encodePassword } from "../utils/passwordEncode";

interface ILogin {
  username: string,
  password: string
}

const LoginPage = () => {
  const api = useApi()
  const {
    control, handleSubmit, formState: { errors },
  } = useForm<ILogin>();
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();

  const onSubmit = async (data: ILogin) => {
    const res = await api.post("/api/login", {
      username: data.username,
      password: await encodePassword(data.password),
    })
    if (res.status) {
      const callback = searchParams.get("cb")
      if (callback == null) {
        navigate("/")
      } else {
        console.log(callback)
        navigate(callback)
      }
    } else {
      enqueueSnackbar(res.err.msg, { variant: 'error' })
    }
  }

  return (
    <>
      <Box className="flex flex-col gap-2">
        <Typography aria-label="Login" variant="h1" className="text-2xl">Login</Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="flex flex-col gap-4">
            <Box className="flex flex-col gap-2">
              <Controller
                name="username"
                control={control}
                defaultValue=""
                rules={{ required: 'Username is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Username"
                    size="small"
                    variant="outlined"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    aria-label="username"
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: 'Password is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    size="small"
                    variant="outlined"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    aria-label="password"
                  />
                )}
              />
            </Box>

            <Button type="submit" variant="contained">Submit</Button>
          </Box>
        </form>

        <Divider />

        <Link to={"/register"} className="flex justify-center">
          Register
        </Link>

      </Box>
    </>
  )
}

export default LoginPage
