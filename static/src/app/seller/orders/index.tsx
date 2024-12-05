import { Box, Typography } from "@mui/material"
import PageWrapper from "../../../components/pageWrapper"
import { useEffect, useState } from "react"
import { useApi } from "../../../hook/api"
import { IOrder } from "../../../model/type"
import React from "react"
import ProductCard from "./productCard"


const OrdersPage = () => {
  const api = useApi()

  const [data, setData] = useState<IOrder[]>([])

  useEffect(() => {
    api.get<{ order: IOrder[] }>("/api/seller/orders").then((res) => {
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

  return (
    <>
      <Box className="flex flex-col gap-4">
        <PageWrapper inlineHeight>
          <Box className="flex flex-col gap-2">
            <Typography aria-label="Order" variant="h1" className="text-2xl">Order</Typography>

            {
              data.length === 0 ? "You don't have any order" : data.map((order) => {
                return (
                  <React.Fragment key={order.id}>
                    <ProductCard order={order} />
                  </React.Fragment>
                )
              })
            }
          </Box>
        </PageWrapper>
      </Box>
    </>
  )
}

export default OrdersPage

