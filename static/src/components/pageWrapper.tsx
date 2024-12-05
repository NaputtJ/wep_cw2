
import { Box, SxProps, useTheme } from "@mui/material";

interface PageWrapperProps {
  inlineHeight?: boolean,
  inlineWidth?: boolean,
  children?: React.ReactNode
  className?: string
  sx?: SxProps
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  inlineHeight,
  inlineWidth,
  children,
  className,
  sx,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: inlineHeight ? undefined : "100%",
        borderRadius: "10px",
        backgroundColor: theme.palette.background.paper,
        width: inlineWidth ? undefined : "100%",
        display: inlineWidth && inlineHeight ? 'inline-flex' : undefined,
        padding: '20px',
        ...sx,
      }}
      className={className}
    >
      {children}
    </Box>
  )
}

export default PageWrapper
