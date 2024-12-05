import { useSearchParams } from "react-router-dom";
import PageWrapper from "../components/pageWrapper";
import ProductInfiniteScroll from "../components/productInfiniteScroll";
import { Box, Typography } from "@mui/material";


const Search = () => {
  const [searchParams] = useSearchParams();

  return (
    <>
      <PageWrapper
        inlineWidth
        inlineHeight
        sx={{
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <Box className="flex flex-col gap-2">
          <Typography aria-label="Register" variant="h1" className="text-2xl whitespace-nowrap">
            Search: "{searchParams.get("key")}"
          </Typography>

          <ProductInfiniteScroll url="/api/search" query={{ name: searchParams.get("key") }} />
        </Box>

      </PageWrapper>
    </>
  )
}


export default Search
