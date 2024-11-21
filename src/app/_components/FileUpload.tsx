interface FileUploadProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload = ({ fileInputRef, handleUpload }: FileUploadProps) => {
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleUpload}
      />
    </div>
  );
};

export default FileUpload;
