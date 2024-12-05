import { Controller, useForm } from "react-hook-form";
import ImageUpload from "../../components/imageUpload";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import PageWrapper from "../../components/pageWrapper";
import { useApi } from "../../hook/api";
import ProductCategorySelector from "../../components/productCategorySelector";
import HoverInformation from "../../components/hoverInformation";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { ImgSrcType, IProductBase } from "../../model/type";


const UpdateProductPage = () => {
  const api = useApi()
  const { id } = useParams();
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar();

  const {
    control, handleSubmit, formState: { errors }, setValue,
  } = useForm<IProductBase>({ mode: "onChange" });

  const [isSubmitting, setIsSubmittin] = useState(false)

  useEffect(() => {
    api.get<IProductBase>(`/api/product/${id}`).then((res) => {
      console.log(res)
      if (res.status) {
        setValue("name", res.data!.name)
        setValue("product_category_id", res.data!.product_category_id)
        setValue("price", res.data!.price)
        setValue("stock", res.data!.stock)
        setValue("desc", res.data!.desc)
        setValue("imgs", res.data!.imgs.map((value) => ({
          id: crypto.randomUUID(),
          src: value,
        } as unknown as ImgSrcType)))
      } else {
        navigate('/seller/products')
      }
    })
  }, [])

  async function onSubmit(data: IProductBase) {
    console.log(data)
    setIsSubmittin(true)
    const res = await api.post(`/api/seller/product/${id}`, {
      name: data.name,
      product_category_id: data.product_category_id,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      desc: data.desc,
      imgs: JSON.stringify(data.imgs.map((img) => img.src)),
    })

    if (res.status) {
      enqueueSnackbar("Successfully update product", { variant: 'success' })
      navigate("/seller/products")
    } else {
      setIsSubmittin(false)
      enqueueSnackbar(res.err.msg, { variant: 'error' })
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          className="flex flex-col gap-4 overflow-y-scroll"
        >
          <PageWrapper inlineHeight>
            <Box className="flex flex-col gap-2">
              <Typography
                variant="h1"
                component="div"
                className="text-3xl pb-4"
              >
                Update product
              </Typography>

              <Typography
                variant="h2"
                className="text-lg"
              >
                Product name
              </Typography>

              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: 'name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Product name"
                    size="small"
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    aria-label="product name field"
                  />
                )}
              />

              <Typography
                variant="h2"
                className="text-lg"
              >
                Category
              </Typography>

              <Controller
                name="product_category_id"
                control={control}
                rules={{ required: 'category is required' }}
                render={({ field }) => (
                  <ProductCategorySelector
                    {...field}
                    error={!!errors.product_category_id}
                    helperText={errors.product_category_id?.message}
                  />
                )}
              />

              <Typography
                variant="h2"
                className="text-lg"
              >
                Product Image <HoverInformation
                  desc={`Can upload up to 9 different images
The first image is use as thumbnail`}
                />
              </Typography>

              <Controller
                name="imgs"
                control={control}
                defaultValue={[] as ImgSrcType[]}
                rules={{ required: 'Product images are required' }}
                render={({ field }) => (
                  <ImageUpload
                    {...field}
                    error={!!errors.imgs}
                    helperText={errors.imgs?.message}
                    aria-label="image field"
                  />
                )}
              />
            </Box>
          </PageWrapper>

          <PageWrapper inlineHeight>
            <Box className="flex flex-col gap-2">
              <Typography
                variant="h2"
                className="text-lg"
              >
                Description
              </Typography>

              <Controller
                name="desc"
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    aria-label="description field"
                    error={!!errors.desc}
                    helperText={errors.desc?.message}
                    multiline
                    rows={5}
                  />
                )}
              />

              <Typography
                variant="h2"
                className="text-lg"
              >
                Price
              </Typography>

              <Controller
                name="price"
                control={control}
                defaultValue={"0"}
                rules={{
                  required: 'Price are required',
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Price can only be number up to 2 decimal place",
                  },
                  validate: (value) => {
                    const price = parseFloat(value)
                    if (isNaN(price) || price <= 0) {
                      return "Price can only be postive integer up to 2 decimal place and not 0"
                    }
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    variant="outlined"
                    error={!!errors.price}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">£</InputAdornment>,
                      },
                    }}
                    helperText={errors.price?.message}
                    aria-label="price field"
                  />
                )}
              />

              <Typography
                variant="h2"
                className="text-lg"
              >
                Stock
              </Typography>

              <Controller
                name="stock"
                control={control}
                defaultValue={"0"}
                rules={{
                  required: 'Price are required',
                  pattern: {
                    value: /^\d+$/,
                    message: "Stock can only be positive integer",
                  },
                  validate: (value) => {
                    const price = parseInt(value)
                    if (isNaN(price)) {
                      return "Stock can only be positive integer"
                    }
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    variant="outlined"
                    error={!!errors.stock}
                    helperText={errors.stock?.message}
                    aria-label="stock field"
                  />
                )}
              />

              <Box className="flex justify-end mt-4">
                <Button disabled={isSubmitting} type="submit" variant="contained">Submit</Button>
              </Box>
            </Box>
          </PageWrapper>
        </Box>

      </form>
    </>
  )
}

export default UpdateProductPage

