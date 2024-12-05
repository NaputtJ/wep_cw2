import {
  Link,
  Outlet,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { InputAdornment, TextField, useTheme } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from "react";
import UserContext from "../context/user";
import { useApi } from "../hook/api";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SettingsIcon from '@mui/icons-material/Settings';
import { IUser } from "../model/type";


const AppLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate()
  const api = useApi()
  const [searchParams] = useSearchParams();

  const [searchValue, setSearchValue] = useState(searchParams.get("key") ?? "")
  const [user, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    api.get<{ login: boolean, user: IUser }>("/api/user").then((res) => {
      if (res.status && res.data?.login) {
        console.log(res.data.user)
        setUser(res.data.user)
        return
      }

      setUser(null)
    })
  }, [])

  function onSearch(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      navigate(`/search?key=${encodeURIComponent(searchValue)}`)
    }
  }

  return (
    <UserContext.Provider value={user}>
      <div className="h-screen w-screen">
        <Box
          className='w-full h-full'
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AppBar
            position="static"
            className="shadow-md relative"
          >
            <Toolbar className="h-12 min-h-12 w-full flex justify-between">
              <Box className="flex flex-row gap-2">

                <Link to={"/"}>
                  <Typography
                    variant="h6"
                    sx={{
                      flexGrow: 1,
                      color: theme.palette.common.white,
                    }}

                  >
                    Customer
                  </Typography>
                </Link>
              </Box>

              <Box
                sx={{
                  display: "inline-flex",
                  borderRadius: "4px",
                  backgroundColor: theme.palette.background.default,
                }}
              >
                <TextField
                  size="small"
                  variant="outlined"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  onKeyDown={onSearch}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>,
                    },
                  }}
                  aria-label="product name search field"
                />
              </Box>

              {
                user == null ? (
                  <Button
                    color="inherit"
                    aria-label="login button"
                    onClick={() => navigate(`/login?cb=${location.pathname}`)}
                  >
                    Login
                  </Button>
                ) : (
                  <Box className="flex flex-row gap-4">
                    <Link to="/user/basket" className="flex items-center">
                      <ShoppingBasketIcon
                        sx={{
                          color: theme.palette.common.white,
                        }}
                      />
                    </Link>

                    <Link to="/user/profile" className="flex items-center">
                      <SettingsIcon
                        sx={{
                          color: theme.palette.common.white,
                        }}
                      />
                    </Link>
                  </Box>
                )
              }

            </Toolbar>
          </AppBar>

          <Box
            className='w-full h-full'
            sx={{
              display: "flex",
              flexDirection: 'row',
            }}
          >
            <Box className="overflow-x-scroll w-full h-full max-h-full">
              <Box
                className='w-full p-5 min-h-full pb-16'
                sx={{
                  backgroundColor: theme.palette.background.default,
                  flexGrow: 1,
                }}
              >
                <Outlet />
              </Box>
            </Box>

          </Box>
        </Box>
      </div>
    </UserContext.Provider>
  );
}

export default AppLayout
