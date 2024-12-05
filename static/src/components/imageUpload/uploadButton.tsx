import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export type UploadButtonProps = {
  onUpload?: (fileList: FileList) => void
  disabled?: boolean
}

const UploadButton = ({ onUpload, disabled }: UploadButtonProps) => {
  return (
    <>
      <Button
        className="w-16 h-16 border border-dashed rounded-md flex justify-center items-center"
        component="label"
        role={undefined}
        variant="outlined"
        tabIndex={-1}
        disabled={disabled}
      >
        <AddIcon className="text-4xl" />

        <input
          type="file"
          accept="image/png, image/gif, image/jpeg"
          onChange={(event) => onUpload?.(event.target.files!)}
          hidden
          multiple
        />
      </Button>
    </>
  )
}

export default UploadButton

