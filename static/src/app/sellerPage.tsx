import { useParams } from "react-router-dom";
import PageWrapper from "../components/pageWrapper";
import {
  Box,
  Grid2,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useApi } from "../hook/api";
import { ISeller } from "../model/type";
import ProductInfiniteScroll from "../components/productInfiniteScroll";


const SellerPage = () => {
  const { id } = useParams();
  const api = useApi()

  const [seller, setSeller] = useState<ISeller | undefined>()

  useEffect(() => {
    api.get<{ seller: ISeller }>(`/api/seller/${id}`).then((res) => {
      if (res.status) {
        setSeller(res.data?.seller)
      }
    })
  }, [])

  return (
    <>
      <Box className="flex flex-col items-center gap-4 w-full">
        <PageWrapper
          inlineHeight
          inlineWidth
          sx={{
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          <Box className="flex flex-col gap-2 w-full">
            <Typography aria-label="Register" variant="h1" className="text-2xl">Seller Info</Typography>

            {
              seller == null ?
                <Skeleton animation="wave" height={20} width="25%" /> : (
                  <Typography aria-label="Register" variant="h3" className="text-xl whitespace-nowrap">
                    Seller name: {
                      seller.name == null
                        ? seller.email : `${seller.name} (${seller.email})`
                    }
                  </Typography>
                )}


            <Box className="flex flex-col">

              <Grid2
                container
                sx={{
                  justifyContent: 'start',
                  width: "100%",
                }}
                columns={2}
              >
                <Grid2
                  size={1}
                  className="whitespace-nowrap"
                >
                  phone number: {seller?.phone_number}
                </Grid2>

                <Grid2
                  size={1}
                  className="whitespace-nowrap"
                >
                  address: {seller?.address}
                </Grid2>

                <Grid2
                  size={1}
                  className="whitespace-nowrap"
                >
                  city: {seller?.city}
                </Grid2>

                <Grid2
                  size={1}
                  className="whitespace-nowrap"
                >
                  zip code: {seller?.zip_code}
                </Grid2>

                <Grid2
                  size={1}
                  className="whitespace-nowrap"
                >
                  product count: {seller?.product_count}
                </Grid2>
              </Grid2>
            </Box>
          </Box>

        </PageWrapper>

        <PageWrapper
          inlineHeight
          inlineWidth
          sx={{
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          <Box className="flex flex-col gap-2">
            <Typography aria-label="Register" variant="h2" className="text-2xl">Seller Product</Typography>

            <ProductInfiniteScroll url={`/api/${id}/products`} />
          </Box>

        </PageWrapper>
      </Box>
    </>
  )
}


export default SellerPage
