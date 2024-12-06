import {
  Box,
  Card,
  CardContent,
  Collapse,
  Divider,
  IconButton,
} from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useMemo, useState } from "react";
import { IOrder } from "../../../model/type";
import { Link } from "react-router-dom";

type ProductCardProps = {
  order: IOrder,
}

export type ItemChangeType = {
  id: number,
  quantity: number
}

const orderStatus = ["created", 'paid', 'to pack', 'to deliver', 'delivered', 'cancel']

const ProductCard: React.FC<ProductCardProps> = ({ order }) => {
  const [expanded, setExpanded] = useState(true);

  const totalPrice = useMemo(() => {
    let total = 0
    for (const item of order.items) {
      total += item.quantity * item.product.price
    }

    return total
  }, [order])

  return (
    <>
      <Card className="w-full">
        <CardContent>
          <Box className="flex flex-row justify-between items-center overflow-x-scroll">
            <Link to={`/seller/${order.seller_id}`} aria-label="customer name">
              {order.seller_name == null ? order.seller_email : order.seller_name}
            </Link>

            <Box className="flex gap-4 p-1 items-center">
              <Box className="whitespace-nowrap" aria-label="order status">status: {orderStatus[order.status]}</Box>

              <Box className="whitespace-nowrap" aria-label="order price">Order price: £{totalPrice}</Box>

              <IconButton onClick={() => setExpanded((bExpand) => !bExpand)} aria-label="expand order button">
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
                  return (
                    <Box className="flex flex-row justify-between items-center w-full p-2" key={item.key}>
                      <Box
                        sx={{
                          minWidth: '300px',
                        }}
                      >
                        <Box className="text-md line-clamp-2 break-words overflow-hidden" aria-label="product name">
                          {item.product.name}
                        </Box>
                      </Box>

                      <Box
                        className="flex flex-row justify-center items-center gap-4"
                        sx={{
                          minWidth: "200px",
                        }}
                      >
                        <Box className="whitespace-nowrap text-center" aria-label="product quantity">
                          quantity: {item.quantity}
                        </Box>

                        <Box className="flex flex-col justify-center">
                          <Box className="whitespace-nowrap text-center" aria-label="product unit price">
                            Unit price: £{item.product.price}
                          </Box>

                          <Box className="whitespace-nowrap text-center" aria-label="product total price">
                            Total price: £{Math.round(item.product.price * item.quantity)}
                          </Box>
                        </Box>
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

