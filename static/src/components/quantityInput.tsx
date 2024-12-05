import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  useTheme,
} from "@mui/material";
import { useState } from "react"
import { IProduct } from "../model/type";

type QuantityInputProps = {
  product?: IProduct
  defaultValue?: number
  onChange: (stock: number) => void
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  product, onChange, defaultValue,
}) => {
  const theme = useTheme()

  const [error, setError] = useState(false)
  const [value, setValue] = useState(defaultValue ?? 1)

  function onValueChang(val: string) {
    try {
      const temp = Math.min(parseInt(val, 10), product!.stock)
      if (isNaN(temp)) {
        throw new Error("quantity is NaN")
      }

      if (temp <= 0) {
        setError(true)
        return
      }

      if (error) {
        setError(false)
      }

      console.log('on change ind')
      onChange(temp)
      setValue(temp)
    } catch (_) {
      const clearVal = val.replace(/\D/g, '')
      if (clearVal === '') {
        const temp = Math.min(1, product!.stock)
        setValue(temp)
        onChange(temp)

        if (error) {
          setError(false)
        }
        return
      }

      setError(true)
    }
  }

  function arrowClick(val: number) {
    setValue(val)
    onChange(val)
    setError(false)
  }

  return (
    <>
      <FormControl
        fullWidth
        size="small"
        error={error}
        className="inline-flex flex-col gap-1"
      >
        <Box className="flex flex-row gap-8 text-center items-center">
          {
            product == null || product.stock === 0 ? undefined : (
              <Box className="flex flex-row gap-2">
                <Box className="flex items-center">
                  Quantity
                </Box>

                <Box className="flex flex-row items-center">
                  <IconButton
                    color={error ? "error" : "primary"}
                    // size="small"
                    disabled={value <= 1}
                    onClick={() => {
                      arrowClick(value - 1)
                    }}
                  >{"<"}</IconButton>

                  <Input
                    size="small"
                    className="w-8"
                    slotProps={{
                      input: {
                        className: "text-center",
                      },
                    }}
                    value={value}
                    onChange={(event) => onValueChang(event.target.value)}
                    aria-label="quantity field"
                  />

                  <IconButton
                    color={error ? "error" : "primary"}
                    disabled={value >= product.stock}
                    onClick={() => {
                      arrowClick(value + 1)
                    }}
                  >{">"}</IconButton>
                </Box>

              </Box>
            )}

          <Box
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            Stock {product?.stock}
          </Box>
        </Box>

        <FormHelperText aria-label="quantity field helper text">
          {error ? "Quantity need to be postive interger and can't exceed stock" : undefined}
        </FormHelperText>
      </FormControl>

    </>
  )
}

export default QuantityInput
