import { Box, CircularProgress, Grid2 } from "@mui/material"
import { useApi } from "../hook/api"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ProductCard from "./productCard"
import { IProduct } from "../model/type"

type ProductInfiniteScrollProps = {
  url: string,
  limit?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: { [key: string]: any }
}

const ProductInfiniteScroll: React.FC<ProductInfiniteScrollProps> = ({ url, limit, query }) => {
  const api = useApi()

  const [loading, setLoading] = useState(false)
  const [more, setMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const observer = useRef<IntersectionObserver | null>(null);

  const [newProduct, setNewProduct] = useState<IProduct[] | undefined>()
  useEffect(() => {
    setLoading(true)

    let extraquaryString = ''
    if (query != null) {
      if (Object.keys(query).length) {
        extraquaryString = '&'
      }

      const queryArray = []
      for (const key in query) {
        queryArray.push(`${key}=${query[key]}`)
      }
      extraquaryString += queryArray.join('&')
    }

    api.get<{ products: IProduct[] }>(`${url}?limit=${limit ?? 50}&offset=${offset}${extraquaryString}`).then((res) => {
      setLoading(false)

      if (res.status) {
        if (res.data!.products.length === 0) {
          setMore(false)
          return
        }

        for (const product of res.data!.products) {
          product.key = crypto.randomUUID()
        }

        setNewProduct((product) => product == null ? res.data!.products : [...product, ...res.data!.products])
      }
    })
  }, [offset])

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || !more) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setOffset((off) => off + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, more],
  );
  return (
    <Box className="flex flex-col w-full">
      <Grid2
        container
        spacing={2}
        sx={{
          justifyContent: 'center',
        }}
        columns={{
          xs: 2,
          sm: 3,
          md: 4,
          lg: 5,
          xl: 6,
        }}
      >
        {newProduct == null ?
          undefined :
          newProduct.map((product, i) => (
            <Grid2
              key={product.key}
              aria-label={`menu ${product.name} button`}
              display="flex"
              justifyContent="center"
              ref={newProduct.length === i + 1 ? lastPostElementRef : undefined}
            >
              <ProductCard product={product} />
            </Grid2>
          ))}
      </Grid2>

      {
        !more ? undefined : (
          <Box className="w-full flex justify-center p-4">
            <CircularProgress />
          </Box>
        )}
    </Box>
  )
}

export default ProductInfiniteScroll
