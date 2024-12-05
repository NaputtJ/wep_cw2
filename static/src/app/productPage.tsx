import {
  Box,
  Button,
  Divider,
  Grid2,
  Skeleton,
  useTheme,
} from "@mui/material";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import PageWrapper from "../components/pageWrapper";
import { useEffect, useState } from "react";
import { IProduct } from "../model/type";
import { useApi } from "../hook/api";
import { fileRoute } from "../services/axios";
import QuantityInput from "../components/quantityInput";
import { useUser } from "../hook/user";
import { useSnackbar } from "notistack";


const ProductPage = () => {
  const api = useApi()
  const user = useUser()
  const navigate = useNavigate()
  const { id } = useParams();
  const theme = useTheme()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar();

  const [product, setProduct] = useState<IProduct>()
  const [quantity, setQuantity] = useState(1)
  useEffect(() => {
    api.get<IProduct>(`/api/product/${id}`).then((res) => {
      if (res.status) {
        setProduct(res.data)
      }
    })
  }, [])

  async function addToBasket(bBuy?: boolean) {
    if (user == null) {
      navigate(`/login?cb=${location}`)
      return
    }

    let iId
    try {
      iId = parseInt(id as string)
    } catch (_) {
      navigate("/")
      return
    }

    const res = await api.post('/api/user/basket', {
      id: iId,
      quantity,
    })
    console.log(res)
    if (res.status) {
      if (bBuy) {
        navigate(`/user/basket`)
      } else {
        enqueueSnackbar("Successfully add to cart", { variant: 'success' })
      }
    } else {
      enqueueSnackbar(res.err.msg, { variant: 'error' })
    }
  }

  return (
    <>
      <Box className="flex justify-center w-full">
        <PageWrapper
          inlineWidth
          inlineHeight
          sx={{
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          <Grid2
            container
            sx={{
              justifyContent: 'start',
              width: "100%",
            }}
            columns={{
              xs: 1,
              sm: 1,
              md: 5,
              lg: 5,
            }}
          >

            <Grid2
              display="flex"
              justifyContent="center"
              className="p-4"
              size={2}
            >

              <Box className="w-96 h-96">
                {product == null ? (
                  <Skeleton
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                    animation="wave"
                    variant="rectangular"
                  />
                ) : (
                  <img
                    src={product.imgs[0].includes("https://") ? product.imgs[0] : fileRoute + product.imgs[0]}
                    alt="Preview"
                    className="max-w-96 w-full"
                  />
                )}
              </Box>
            </Grid2>

            <Grid2
              display="flex"
              justifyContent="start"
              className="p-4 max-w-2/3 overflow-hidden"
              size={3}
            >
              <Box className="w-full flex flex-col gap-2">
                {
                  product == null ? (
                    <Box className="w-full flex flex-col gap-1">
                      <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />

                      <Skeleton animation="wave" height={20} width="80%" />
                    </Box>
                  ) : (
                    <Box className="text-3xl line-clamp-2 break-words overflow-hidden">
                      {product.name}
                    </Box>
                  )}

                {
                  product == null ? (
                    <Box>
                      <Skeleton animation="wave" height={20} width="50%" />
                    </Box>
                  )
                    : (
                      <Box className="flex flex-row">
                        {product?.sold_amount} sold | seller:&nbsp;

                        <Link to={`/seller/${product?.user_id}`}>
                          {product?.seller_name == null ? product?.seller_name : product.seller_email}
                        </Link>
                      </Box>
                    )}

                <Divider />

                <Box
                  className="flex items-center text-3xl"
                  sx={{ color: theme.palette.primary.main }}
                >
                  £<Box className="text-2xl">{product?.price}</Box>
                </Box>

                <Divider />

                <QuantityInput product={product} onChange={setQuantity} />

                <Box className="flex flex-row gap-2">
                  <Button variant="outlined" size="large" onClick={() => addToBasket()}>Add to Cart</Button>

                  <Button variant="contained" size="large" onClick={() => addToBasket(true)}>Buy</Button>
                </Box>

              </Box>
            </Grid2>
          </Grid2>
        </PageWrapper>
      </Box>
    </>
  )
}


export default ProductPage
