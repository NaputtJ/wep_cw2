import { Outlet } from "react-router-dom";
import PageWrapper from "../components/pageWrapper";
import { Box, useTheme } from "@mui/material";

const AuthLayout = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
      }}
      className="h-screen w-screen flex justify-center items-center"
    >
      <PageWrapper inlineHeight inlineWidth>
        <Outlet />
      </PageWrapper>
    </Box>
  );
}

export default AuthLayout
