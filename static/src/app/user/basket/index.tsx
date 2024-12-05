import { useEffect, useState } from "react"
import { useApi } from "../../../hook/api";
import { IOrder } from "../../../model/type";
import PageWrapper from "../../../components/pageWrapper";
import ProductCard from "./productCard";
import { Box, Typography } from "@mui/material";
import React from "react";


const BasketPage = () => {
  const api = useApi()

  const [data, setData] = useState<IOrder[]>([])

  useEffect(() => {
    api.get<{ order: IOrder[] }>("/api/user/basket").then((res) => {
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
  }, [])

  function onBuy(i: number) {
    const newData = [...data]
    newData.splice(i, 1)
    setData(newData)
  }

  return (
    <>
      <Box className="flex justify-center">
        <PageWrapper
          inlineWidth
          sx={{
            width: "100%",
            maxWidth: "1200px",
          }}
          className="flex flex-col items-center gap-4"
        >
          <Typography aria-label="Basket Page" variant="h1" className="text-2xl">Basket page</Typography>

          {
            data.length == 0 ? "Your basket is empty" : data.map((order, i) => {
              return (
                <React.Fragment key={order.id}>
                  <ProductCard order={order} onSuccessBuy={() => onBuy(i)} />
                </React.Fragment>
              )
            })
          }
        </PageWrapper>
      </Box>
    </>
  )
}

export default BasketPage

