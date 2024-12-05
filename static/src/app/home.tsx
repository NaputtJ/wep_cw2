import { Box, Typography } from "@mui/material";
import PageWrapper from "../components/pageWrapper";
import ProductInfiniteScroll from "../components/productInfiniteScroll";


const HomePage = () => {
  return (
    <>
      <PageWrapper>
        <Box className="flex flex-col items-center gap-2">
          <Typography
            variant="h2"
            className="text-lg"
          >
            New Product
          </Typography>

          <Box sx={{ flexGrow: 1 }}>
            <ProductInfiniteScroll url="/api/recent/products" />
          </Box>
        </Box>
      </PageWrapper>
    </>
  )
}


export default HomePage
