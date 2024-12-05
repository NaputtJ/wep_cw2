/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Grid2,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useApi } from "../../hook/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import PageWrapper from "../../components/pageWrapper";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { fileRoute } from "../../services/axios";
import ImageWrapper from "../../components/imageUpload/imageWrapper";
import ImagePreview from "../../components/imagePreview";
import { useDebounce } from "@uidotdev/usehooks";
import ProductCategorySelector from "../../components/productCategorySelector";
import { ClearIcon } from "@mui/x-date-pickers/icons";


interface IProduct {
  id: number;
  name: string;
  product_category_id: number;
  price: number;
  stock: number;
  desc: string;
  sold_amount: number;
  imgs: string[];
}

type IPaginationRes = {
  count: number,
  products: IProduct[]
}

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const api = useApi()
  const navigate = useNavigate()

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [data, setData] = useState<IProduct[] | undefined>()
  const [rowCount, setRowCount] = useState<number>(-1)

  const [filterName, setFilterName] = useState<string | undefined>(searchParams.get("name") ?? undefined)
  const fileterNameDebounce = useDebounce(filterName, 300)
  const tempCategory = parseInt(searchParams.get("category") as string)
  const [filterCategory, setFilterCategory] = useState<number | undefined>(isNaN(tempCategory) ?
    undefined :
    tempCategory)

  useEffect(() => {
    const nameQuery = fileterNameDebounce == null || fileterNameDebounce === '' ? '' : `&name=${fileterNameDebounce}`
    const categoryQuery = filterCategory == null ? '' : `&category=${filterCategory}`
    api.get<IPaginationRes>(`/api/seller/products?offset=${page}&limit=${rowsPerPage}${nameQuery}${categoryQuery}`)
      .then((res) => {
        console.log(res)
        if (res.status) {
          setRowCount(res.data?.count ?? -1)
          setData(res.data?.products)
        }
      })
  }, [page, rowsPerPage, fileterNameDebounce, filterCategory])

  useEffect(() => {
    if (searchParams.get("name") as string != fileterNameDebounce as string ||
      searchParams.get("categry") as string != filterCategory as unknown as string) {
      setSearchParams({
        name: fileterNameDebounce as string,
        category: filterCategory as unknown as string,
      })
    }
  }, [fileterNameDebounce, filterCategory])

  useEffect(() => {
    if (searchParams.get("categry") as string != filterCategory as unknown as string) {
      setSearchParams({ category: filterCategory as unknown as string })
    }
  }, [filterCategory])


  const handleChangeRowsPerPage = (
    count: number,
  ) => {
    setRowsPerPage(count);
    setPage(0);
  };

  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewSrc, setPreviewSrc] = useState('')

  function onPreviewClose() {
    setIsPreviewOpen(false)
  }

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'name',
      headerName: 'Product name',
      flex: 1,
      minWidth: 230,
      resizable: false,
      sortable: false,
      hideable: false,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        console.log(params)
        const img0: string = params.row.imgs[0]
        const imgUrl = img0.includes("https://") ? img0 : fileRoute + img0
        return (
          <Box className="overflow-x-scroll flex">
            <Box className="flex gap-2 items-center">
              <ImageWrapper
                src={imgUrl}
                onPreview={() => {
                  setPreviewSrc(imgUrl)
                  setIsPreviewOpen(true)
                }}
              />

              {params.value}
            </Box>
          </Box>
        )
      },
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      minWidth: 100,
      resizable: false,
      sortable: false,
      hideable: false,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        return <Box className="overflow-x-scroll">£{params.value}</Box>
      },
    },
    {
      field: 'stock',
      headerName: 'Stock',
      flex: 1,
      minWidth: 80,
      resizable: false,
      sortable: false,
      hideable: false,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        return <Box className="overflow-x-scroll">{params.value}</Box>
      },
    },
    {
      field: 'sold_amount',
      headerName: 'Sold amount',
      sortable: false,
      flex: 1,
      minWidth: 120,
      resizable: false,
      hideable: false,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        return <Box className="overflow-x-scroll">{params.value}</Box>
      },
    },
    {
      field: 'id',
      headerName: 'Tools',
      sortable: false,
      flex: 1,
      minWidth: 90,
      resizable: false,
      renderCell: (params: GridRenderCellParams<any, number>) => (
        <Button
          size="small"
          onClick={() => {
            navigate(`/seller/product/${params.value}`)
          }}
        >update</Button>
      ),
    },
  ], [])


  return (
    <>
      <Box className="flex flex-col gap-4">
        <PageWrapper inlineHeight>
          <Box className="p-3 flex flex-col gap-8">
            <Box className="flex justify-between">
              <Typography
                variant="h1"
                component="div"
                className="text-2xl"
                aria-label="Products page"
              >
                Products
              </Typography>

              <Box className="flex justify-center items-center">
                <Button
                  variant="contained"
                  size="small"
                  aria-label="new product button"
                  onClick={() => navigate("/seller/product/new")}
                >new prouduct</Button>
              </Box>
            </Box>
          </Box>
        </PageWrapper>

        <PageWrapper className="overflow-scroll gap-2 flex flex-col">
          <Box className="flex flex-col gap-2">
            <Typography variant="h3" className="text-lg">Product filter</Typography>

            <Grid2
              container
              rowSpacing={1}
              columnSpacing={1}
              columns={{
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 4,
              }}
              sx={{
                maxWidth: '780px',
              }}
            >
              <Grid2
                size={1}
              >
                <TextField
                  aria-label="filter product name"
                  label="Proudct name"
                  size="small"
                  sx={{
                    width: '100%',
                  }}
                  value={filterName}
                  slotProps={{
                    input: {
                      endAdornment: (<IconButton size="small" onClick={() => setFilterName('')}>
                        <ClearIcon fontSize="small" />
                      </IconButton>),
                    },
                  }}
                  onChange={(event) => setFilterName(event.target.value)}
                />
              </Grid2>

              <Grid2
                size={1}
              >
                <ProductCategorySelector
                  label="Category"
                  value={filterCategory}
                  onChange={setFilterCategory}
                />
              </Grid2>
            </Grid2>
          </Box>

          <DataGrid
            loading={data == null}
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 20,
                },
              },
            }}
            rowCount={rowCount}
            onRowCountChange={handleChangeRowsPerPage}
            paginationMode="server"
            pageSizeOptions={[20, 50, 100]}
            rowHeight={70}
            sx={{
              border: 0,
              height: '100%',
              minHeight: "50vh",
            }}
            slotProps={{
              loadingOverlay: {
                variant: 'skeleton',
                noRowsVariant: 'skeleton',
              },
            }}
            localeText={{
              noRowsLabel: "No Product",
            }}
            disableColumnFilter
            disableColumnResize
            disableRowSelectionOnClick
            disableColumnMenu
          />

          <ImagePreview isOpen={isPreviewOpen} src={previewSrc} onClose={onPreviewClose} />

        </PageWrapper>
      </Box>
    </>
  )
}

export default ProductsPage
