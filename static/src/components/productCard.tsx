import { Box, useTheme } from "@mui/material"
import { Link } from "react-router-dom"
import { IProduct } from "../model/type"
import { fileRoute } from "../services/axios"

type ProductCardProps = {
  product: IProduct
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const theme = useTheme()

  return (
    <>
      <Link to={`/product/${product.id}`}>
        <Box
          className="flex flex-col w-44 h-full border border-solid"
          sx={{
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary,
            '&:hover': {
              boxShadow: theme.shadows[1],
            },
          }}
        >
          <Box className="flex flex-col gap-2">
            <Box className="w-full h-44 flex justify-center items-center">
              <img
                src={product.imgs[0].includes("https://") ? product.imgs[0] : fileRoute + product.imgs[0]}
                alt="Preview"
                aria-label="product image"
                className="max-w-full"
              />
            </Box>
          </Box>

          <Box
            className="flex flex-col justify-between gap-2 p-1 w-full text-sm"
            sx={{
              flex: "1 1",
            }}
          >
            <div
              className="text-base leading-4 line-clamp-2 break-words overflow-hidden "
              aria-label="product name"
            >
              {product.name}
            </div>

            <Box className="flex flex-col gap-2 whitespace-nowrap">
              <Box
                className="flex items-center"
                sx={{ color: theme.palette.primary.main }}
                aria-label="product price"
              >
                £<Box className="text-base">{product.price}</Box>
              </Box>

              <Box
                sx={{ color: theme.palette.text.secondary }}
                aria-label="product sold amount"
              >
                Sold: {product.sold_amount}
              </Box>
            </Box>
          </Box>

        </Box>
      </Link>
    </>
  )
}

export default ProductCard
