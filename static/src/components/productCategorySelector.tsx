import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SxProps,
  Theme,
} from "@mui/material";
import { IProductCategory } from "../model/type"
import { forwardRef, useEffect, useState } from "react"
import { ArrowDropDownIcon, ClearIcon } from "@mui/x-date-pickers"
import { useApi } from "../hook/api";

export type ProductCategorySelectorProps = {
  onChange?: (value: number | undefined) => void,
  value?: number | undefined
  onBlur?: () => void
  disabled?: boolean
  label?: string
  sx?: SxProps<Theme>
  error?: boolean,
  helperText?: string
}

const ProductCategorySelector: React.FC<ProductCategorySelectorProps> = forwardRef(({
  onChange, value, onBlur, disabled, label, sx, error, helperText,
}, ref) => {
  const api = useApi()
  const [productCategory, setProductCategory] = useState<IProductCategory[] | undefined>()
  const [category, setCategory] = useState<number | undefined>()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    api.get<IProductCategory[]>("/api/product_category", { cache: true }).then((res) => {
      if (res.status) {
        setProductCategory(res.data)
      }
    })
  }, [])


  useEffect(() => {
    setCategory(value)
  }, [value])

  return (
    <FormControl
      fullWidth
      size="small"
      onBlur={onBlur}
      error={error}
      sx={sx}
    >
      <InputLabel id="category-label">{label}</InputLabel>

      <Select
        ref={ref}
        size="small"
        open={productCategory == null ? false : isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        label={label}
        value={category ?? ''}
        placeholder={"Select category"}
        // displayEmpty
        labelId="category-label"
        // className="w-full h-full"
        onChange={(event) => {
          const value: number | undefined = event.target.value === '' ? undefined : (event.target.value as number)
          setCategory(value)
          onChange?.(value)
        }}
        aria-label="filter product category"
        disabled={disabled}
        endAdornment={category == null ?
          undefined : (
            <IconButton
              size="small"
              sx={{
                marginRight: "12px",
              }}
              onClick={() => {
                setCategory(undefined)
                onChange?.(undefined)
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        IconComponent={productCategory == null ?
          () => (
            <Box
              sx={{ padding: "0px 10px" }}
              className="flex justify-center items-center select-none absolute right-0 z-0"
            >
              <CircularProgress size={20} />
            </Box>
          )
          : ArrowDropDownIcon}
      >
        {
          productCategory == null ? [] :
            productCategory.length === 0 ?
              <MenuItem disabled>No Category</MenuItem>
              : productCategory.map((category) => {
                return <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
              })
        }
      </Select>

      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  )
})


export default ProductCategorySelector
