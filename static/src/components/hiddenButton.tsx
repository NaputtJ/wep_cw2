import { ButtonBase } from "@mui/material"

export type HiddenButtonProps = React.ComponentProps<typeof ButtonBase>

const HiddenButton = ({ sx, children, ...props }: HiddenButtonProps) => {
  return (
    <ButtonBase
      sx={{
        '&:active': {
          outline: 'none',
          border: 'none',
        },
        '&:focus': {
          outline: 'none',
          border: 'none',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </ButtonBase>
  )
}

export default HiddenButton

