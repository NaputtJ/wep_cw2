import { Fade, Modal } from "@mui/material"
import { useEffect, useState } from "react"

type ImagePreviewProps = {
  src?: string
  isOpen?: boolean
  onClose?: () => void
}

const ImagePreview = ({ src, isOpen, onClose }: ImagePreviewProps) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(isOpen || false)
  }, [isOpen])

  function handleClose() {
    setOpen(false)
    onClose?.()
  }

  return (
    <>
      <Modal
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": { backgroundcolor: "red" },
        }}
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open} timeout={500} style={{ outline: "none" }}>
          <img
            src={src}
            alt="preview"
            style={{
              maxHeight: "90%",
              maxWidth: "90%",
            }}
          />
        </Fade>
      </Modal>
    </>
  )
}

export default ImagePreview

