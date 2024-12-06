import { Link, Outlet } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const SideMenu = (
  <Box
    sx={{
      width: drawerWidth,
    }}
    className='h-full'
    aria-label="side menu"
  >
    <List>
      {[
        // {
        //   key: "Home",
        //   link: "/seller",
        //   icon: <AssessmentIcon />,
        // },
        {
          key: "Product",
          link: "/seller/products",
          icon: <AssessmentIcon />,
        },
        {
          key: "Order",
          link: "/seller/orders",
          icon: <AssessmentIcon />,
        },
      ].map((link) => (
        <ListItem
          key={link.key}
          disablePadding
          aria-label={`menu ${link.key} button`}
        >
          <ListItemButton href={link.link}>
            <ListItemIcon>
              {link.icon}
            </ListItemIcon>

            <ListItemText primary={link.key} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Box>
)

const AppLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="h-screen w-screen">
      <Drawer
        anchor='left'
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        {SideMenu}
      </Drawer>

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
              {
                isMobile ? (
                  <Box className="flex items-center">
                    <a
                      className="flex items-centerLogiLoginn"
                      style={{ color: 'inherit' }}
                      onClick={() => setIsMobileMenuOpen(true)}
                      aria-label="open menu button"
                    >
                      <MenuIcon />
                    </a>
                  </Box>
                ) : undefined
              }

              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
              >
                Seller
              </Typography>
            </Box>

            <Box>
              <Link
                to="/user/profile"
                className="flex items-center"
                aira-label="user profile button"
              >
                <SettingsIcon
                  sx={{
                    color: theme.palette.common.white,
                  }}
                />
              </Link>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          className='w-full h-full'
          sx={{
            display: "flex",
            flexDirection: 'row',
          }}
        >
          {
            isMobile ? undefined : (
              SideMenu
            )}

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
  );
}

export default AppLayout

