import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, useTheme } from '@mui/material';
import HiddenButton from '../hiddenButton';

export type ImageWrapperProps = {
  src: string,
  onPreview?: () => void
  onDelete?: () => void
}

const ImageWrapper = ({
  src, onPreview, onDelete,
}: ImageWrapperProps) => {
  const theme = useTheme()

  return (
    <>
      <Box
        className="w-16 h-16 border border-solid rounded-md overflow-hidden"
        sx={{ borderColor: theme.palette.divider }}
      >
        <Box
          className="w-full h-full flex justify-center items-center"
          sx={{ '&:hover .btn-wrapper': { display: "flex !important" } }}
        >
          <img
            src={src}
            alt="Preview"
            className="max-w-16 max-h-16 z-0"
            onClick={onPreview}
          />

          <Box
            className='absolute hidden justify-center items-center rounded-md overflow-hidden btn-wrapper w-16 h-16'
            sx={{ backgroundColor: theme.palette.action.active }}
          >
            <HiddenButton
              className='w-8 h-8 flex justify-center items-center border-none'
              onClick={onPreview}
            >
              <VisibilityIcon
                sx={{ color: theme.palette.primary.main }}
              />
            </HiddenButton>

            {
              onDelete != null ? (
                <HiddenButton
                  className='w-8 h-8 flex justify-center items-center border-none'
                  onClick={onDelete}
                >
                  <DeleteIcon
                    sx={{ color: theme.palette.primary.main }}
                  />
                </HiddenButton>
              )
                : undefined
            }
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default ImageWrapper

