import Button from "./Button";

interface Props {
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload = ({ fileInputRef, handleUpload }: Props) => {
  return (
    <Button
      variant="secondary"
      onClick={() => fileInputRef.current?.click()}
      className="w-full sm:w-auto"
    >
      Upload Image
      <input
        accept="image/*"
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
      />
    </Button>
  );
};

export default FileUpload;
