import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import PageWrapper from "../../../components/pageWrapper"
import React, { useEffect, useState } from "react"
import { useApi } from "../../../hook/api"
import { IOrder, IUser } from "../../../model/type"
import ProductCard from "./productCard"
import { Controller, useForm } from "react-hook-form"
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";


interface IUserForm {
  name?: string,
  email: string,
  phone_number?: string,
  address?: string,
  city?: string,
  zip_code?: string
}

const ProfilePage = () => {
  const api = useApi()
  const {
    control, handleSubmit, setValue, formState: { errors },
  } = useForm<IUserForm>({ mode: "onChange" });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate()

  const [data, setData] = useState<IOrder[]>([])

  useEffect(() => {
    api.get<{ order: IOrder[] }>("/api/user/orders").then((res) => {
      if (res.status) {
        for (const order of res.data!.order) {
          order.key = crypto.randomUUID()
          for (const item of order.items) {
            item.key = crypto.randomUUID()
          }
        }
        setData(res.data!.order)
      }
    })
    api.get<IUser>("/api/user/profile").then((res) => {
      if (res.status) {
        setValue("name", res.data?.name)
        setValue("email", res.data!.email)
        setValue("phone_number", res.data?.phone_number)
        setValue("address", res.data?.address)
        setValue("city", res.data?.city)
        setValue("zip_code", res.data?.zip_code)
      }
    })
  }, [])

  async function onLogout() {
    const res = await api.post("/api/logout")
    if (res.status) {
      navigate('/login')
    } else {
      enqueueSnackbar("failed to logout", { variant: 'error' })
    }
  }

  async function onSubmitUserForm(data: IUserForm) {
    const res = await api.post("/api/user/profile", data)
    if (!res.status) {
      enqueueSnackbar("fail to update info", { variant: 'error' })
    }
    console.log(res)
  }

  return (
    <>
      <Box className="flex items-center flex-col gap-4">
        <PageWrapper
          inlineWidth
          sx={{
            width: "100%",
            maxWidth: "1200px",
          }}
          className="flex flex-col gap-4"
        >
          <Typography aria-label="Basket Page" variant="h1" className="text-2xl">User Info</Typography>

          <form onSubmit={handleSubmit(onSubmitUserForm)}>
            <Box
              className="flex flex-col gap-2 w-full"
              sx={{
                maxWidth: "300px",
              }}
            >
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{
                  required: 'name is required',
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="name"
                    size="small"
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    aria-label="naem field"
                  />
                )}
              />

              <Controller
                name="email"
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
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    aria-label="email field"
                  />
                )}
              />

              <Controller
                name="phone_number"
                control={control}
                defaultValue=""
                rules={{
                  required: 'phone number is required',
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone number"
                    size="small"
                    variant="outlined"
                    error={!!errors.phone_number}
                    helperText={errors.phone_number?.message}
                    aria-label="phone number field"
                  />
                )}
              />

              <Controller
                name="address"
                control={control}
                defaultValue=""
                rules={{
                  required: 'address is required',
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    size="small"
                    variant="outlined"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    aria-label="Address field"
                  />
                )}
              />

              <Controller
                name="city"
                control={control}
                defaultValue=""
                rules={{
                  required: 'city is required',
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="City"
                    size="small"
                    variant="outlined"
                    error={!!errors.city}
                    helperText={errors.city?.message}
                    aria-label="city field"
                  />
                )}
              />

              <Controller
                name="zip_code"
                control={control}
                defaultValue=""
                rules={{
                  required: 'zip code is required',
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="zip code"
                    size="small"
                    variant="outlined"
                    error={!!errors.zip_code}
                    helperText={errors.zip_code?.message}
                    aria-label="zip code field"
                  />
                )}
              />

              <Box className="flex justify-end">
                <Button type="submit" variant="contained">Submit</Button>
              </Box>
            </Box>

          </form>
        </PageWrapper>

        <PageWrapper
          inlineWidth
          sx={{
            width: "100%",
            maxWidth: "1200px",
          }}
          className="flex flex-col gap-4"
        >
          <Typography aria-label="Basket Page" variant="h1" className="text-2xl">Action</Typography>

          <Button variant="contained" onClick={() => onLogout()}>Logout</Button>
        </PageWrapper>

        <PageWrapper
          inlineWidth
          sx={{
            width: "100%",
            maxWidth: "1200px",
          }}
          className="flex flex-col justify-center items-center gap-4"
        >
          <Typography aria-label="Basket Page" variant="h1" className="text-2xl">All order list</Typography>

          {
            data.length === 0 ? "You don't have any order" : data.map((order) => {
              return (
                <React.Fragment key={order.id}>
                  <ProductCard order={order} />
                </React.Fragment>
              )
            })
          }
        </PageWrapper>
      </Box>

    </>
  )
}


export default ProfilePage
