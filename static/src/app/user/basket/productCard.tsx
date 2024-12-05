import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  IconButton,
} from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCallback, useMemo, useState } from "react";
import { IOrder } from "../../../model/type";
import { Link } from "react-router-dom";
import QuantityInput from "../../../components/quantityInput";
import { useApi } from "../../../hook/api";
import { useSnackbar } from "notistack";

type ProductCardProps = {
  order: IOrder,
  onSuccessBuy: () => void
}

export type ItemChangeType = {
  id: number,
  quantity: number
}

const ProductCard: React.FC<ProductCardProps> = ({ order, onSuccessBuy }) => {
  const api = useApi()
  const { enqueueSnackbar } = useSnackbar();

  const [expanded, setExpanded] = useState(true);
  const [itemChange, setItemChange] = useState<ItemChangeType[]>([])

  const getQuantity = useCallback((id: number) => {
    for (const item of itemChange) {
      if (item.id === id) {
        return item.quantity
      }
    }

    return null
  }, [itemChange])

  const totalPrice = useMemo(() => {
    let total = 0
    for (const item of order.items) {
      const temp = getQuantity(item.product.id)
      if (temp == null) {
        total += item.quantity * item.product.price
      } else {
        total += temp * item.product.price
      }
    }

    return total
  }, [getQuantity, order])

  function onItemChange(id: number, quantity: number) {
    console.log('change', id, quantity)
    const newChange = [...itemChange]
    for (const item of newChange) {
      if (item.id === id) {
        item.quantity = quantity
        setItemChange(newChange)
        return
      }
    }

    newChange.push({
      id,
      quantity,
    })
    setItemChange(newChange)
  }

  async function onBuy() {
    let param = undefined
    if (itemChange.length !== 0) {
      param = {
        data: JSON.stringify(itemChange),
      }
    }
    const res = await api.post(`/api/user/buy/${order.id}`, param)
    console.log(res)
    if (res.status) {
      onSuccessBuy()
    } else {
      enqueueSnackbar("failed to buy order", { variant: 'error' })
    }
  }

  return (
    <>
      <Card className="w-full">
        <CardContent>
          <Box className="flex flex-row justify-between items-center overflow-x-scroll">
            <Link to={`/seller/${order.seller_id}`}>
              {order.seller_name == null ? order.seller_email : order.seller_name}
            </Link>

            <Box className="flex gap-4 p-1 items-center">
              <Box className="whitespace-nowrap">Order price: £{totalPrice}</Box>

              <Button variant="contained" onClick={() => onBuy()}>Buy</Button>

              <IconButton onClick={() => setExpanded((bExpand) => !bExpand)}>
                {
                  expanded ?
                    <KeyboardArrowUpIcon /> :
                    <KeyboardArrowDownIcon />
                }
              </IconButton>
            </Box>
          </Box>

          <Collapse in={expanded} timeout="auto">
            <Divider className="pt-4" />

            <Box className="flex flex-col w-full overflow-x-scroll">
              {
                order.items.map((item) => {
                  console.log(item)
                  const quantity = getQuantity(item.product.id)
                  return (
                    <Box className="flex flex-row justify-between items-center w-full p-2" key={item.key}>
                      <Box
                        sx={{
                          minWidth: '300px',
                        }}
                      >
                        <Box className="text-md line-clamp-2 break-words overflow-hidden">
                          {item.product.name}
                        </Box>
                      </Box>

                      <Box
                        className="flex flex-row justify-center items-center gap-4"
                        sx={{
                          minWidth: "400px",
                        }}
                      >
                        <QuantityInput
                          defaultValue={item.quantity}
                          product={item.product}
                          onChange={(value) => {
                            console.log('on chan');
                            onItemChange(item.product.id, value)
                          }}
                        />

                        <Box className="flex flex-col justify-center">
                          <Box className="whitespace-nowrap text-center">
                            Unit price: £{item.product.price}
                          </Box>

                          <Box className="whitespace-nowrap text-center">
                            Total price: £{Math.round(item.product.price * (quantity ?? item.quantity))}
                          </Box>
                        </Box>

                        <Button onClick={() => alert("not implemented")}>Delete</Button>
                      </Box>
                    </Box>
                  )
                })
              }
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </>
  )

}


export default ProductCard
