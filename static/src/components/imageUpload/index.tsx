import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  useTheme,
} from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import ImagePreview from "../imagePreview";
import ImageWrapper from "./imageWrapper";
import { useSnackbar } from "notistack";
import { useApi } from "../../hook/api";
import UploadButton from "./uploadButton";
import { fileRoute } from "../../services/axios";
import { ImgSrcType } from "../../model/type";


export type ImageUploadProps = {
  onChange?: (value: ImgSrcType[]) => void,
  value?: ImgSrcType[]
  onBlur?: () => void
  disabled?: boolean
  error?: boolean,
  helperText?: string
}

const MAX_IMAGE_NUM = 9

function isFileRepeated(files: ImgSrcType[], i: number): boolean {
  if (i <= 0) {
    return false
  }

  for (let j = i - 1; j >= 0; j--) {
    if (files[j].src == files[i].src) {
      return true
    }
  }

  return false
}

const ImageUpload = forwardRef(({
  onChange, value, onBlur, disabled, error, helperText,
}: ImageUploadProps, ref) => {
  const api = useApi()
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme()

  const [files, setFiles] = useState<ImgSrcType[]>([])

  useEffect(() => {
    setFiles(value || [])
  }, [value])

  async function onUpload(fileList: FileList) {
    if (files.length >= MAX_IMAGE_NUM) {
      enqueueSnackbar(`Max number of upload image: ${MAX_IMAGE_NUM}`, { variant: 'error' })
      return
    }

    const fileArray = Array.from(fileList)
    if (MAX_IMAGE_NUM < files.length + fileArray.length) {
      enqueueSnackbar(`Max number of upload image: ${MAX_IMAGE_NUM}`, { variant: 'error' })
      fileArray.splice(Math.min(fileArray.length, MAX_IMAGE_NUM - files.length))
    }

    const tempFiles = new Array(fileArray.length)
    for (let i = 0; i < tempFiles.length; i++) {
      tempFiles[i] = { key: crypto.randomUUID() }
    }

    const newFiles: ImgSrcType[] = [...files, ...tempFiles]
    setFiles(newFiles)

    await Promise.all([
      ...fileArray.map(async (value: File, i: number) => {
        if (value.type.startsWith('image/')) {
          const formData = new FormData();
          formData.append("image", value)

          const res = await api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } })
          if (res.status) {
            enqueueSnackbar(`Successfully upload: ${value.name}`, { variant: 'success' })
            newFiles[i + files.length].src = res.data?.filename
            setFiles([...newFiles])
          } else {
            enqueueSnackbar(`Failed to upload: ${value.name}`, { variant: 'error' })
            newFiles[i + files.length].src = null
            setFiles([...newFiles])
          }
        }
      }),
    ])

    const uploadedFiles = newFiles.filter((value) => value.src !== null)

    const toRemove: number[] = []
    for (let i = uploadedFiles.length - 1; i >= 0; i--) {
      if (isFileRepeated(uploadedFiles, i)) {
        toRemove.push(i)
      }
    }

    const filteredFilse = uploadedFiles.filter((_, i) => !toRemove.includes(i))
    if (uploadedFiles.length !== filteredFilse.length) {
      enqueueSnackbar(`can't upload same image: ${uploadedFiles.length - filteredFilse.length}`, { variant: 'error' })
    }

    setFiles(filteredFilse)

    onChange?.(filteredFilse)

    //TODO: preview image while upload

    // for (let i = 0; i < fileList.length; i++) {
    // const reader = new FileReader();
    // reader.onload = (e) => {
    //   if (e.target != null) {
    //     newImgSrc[i + imgSrc.length] = {
    //       key: crypto.randomUUID(),
    //       src: e.target.result as string
    //     }
    //
    //     setImgSrc([...newImgSrc])
    //   }
    // };
    //
    // reader.readAsDataURL(fileList[i]);
    // }
  }

  function onDelete(i: number) {
    if (i < 0) {
      return
    }

    const newFilse = [...files]
    newFilse.splice(i, 1)
    setFiles(newFilse)
  }


  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewSrc, setPreviewSrc] = useState<string | undefined>()

  function openPreview(src: string) {
    setPreviewSrc(src)
    setIsPreviewOpen(true)
  }

  function onPreviewClose() {
    setIsPreviewOpen(false)
  }

  return (
    <>
      <Box
        ref={ref}
      >

        <FormControl
          fullWidth
          size="small"
          error={error}
          onBlur={onBlur}
          className="flex flex-col gap-1"
        >
          <Box
            className="flex flex-row gap-2 flex-wrap"
          >
            {
              ...files.map((item, i) => (
                <Box
                  key={item?.key ?? crypto.randomUUID()}
                >
                  {
                    item.src == null ? (
                      <Box
                        className="w-16 h-16 border border-solid rounded-md overflow-hidden 
                          flex justify-center items-center"
                        sx={{ borderColor: theme.palette.divider }}
                      >
                        <CircularProgress />
                      </Box>
                    ) : (

                      <ImageWrapper
                        src={item!.src.includes("https://") ? item!.src : fileRoute + item!.src}
                        onPreview={() => openPreview(fileRoute + item.src!)}
                        onDelete={() => onDelete(i)}
                      />
                    )
                  }
                </Box>
              ))
            }
            <UploadButton onUpload={onUpload} disabled={disabled} />
          </Box>

          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>

        <ImagePreview isOpen={isPreviewOpen} src={previewSrc} onClose={onPreviewClose} />
      </Box>
    </>
  )
})

export default ImageUpload

