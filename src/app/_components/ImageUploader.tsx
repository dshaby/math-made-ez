import Image from "next/image";
import { useState } from "react";

interface Props {
  onImageUpload: (imageSrc: string) => void;
  isMobile: boolean;
}

const ImageUploader = ({ onImageUpload, isMobile }: Props) => {
  const [dragActive, setDragActive] = useState(false);

  const readAndUploadFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageUpload(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      readAndUploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      readAndUploadFile(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.files;
    if (items.length && items[0]) {
      const file = items[0];
      readAndUploadFile(file);
    }
  };

  return (
    <div
      className={`flex min-h-64 w-full max-w-xl flex-col items-center justify-center border-2 border-dashed ${
        dragActive ? "border-blue-500" : "border-gray-300"
      } rounded-md bg-white p-6`}
      onDragOver={!isMobile ? handleDragOver : undefined}
      onDragLeave={!isMobile ? handleDragLeave : undefined}
      onDrop={!isMobile ? handleDrop : undefined}
      onPaste={!isMobile ? handlePaste : undefined}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        id="file-upload"
        className="hidden"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Image
          src="/assets/upload-photo.svg"
          alt="Upload Icon"
          width={112}
          height={112}
        />
      </label>
      <p className="text-center text-gray-700">
        {isMobile ? (
          <>
            Tap to{" "}
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-blue-500 underline"
            >
              upload an image
            </label>
          </>
        ) : (
          <>
            Drag & drop an image here, or{" "}
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-blue-500 underline"
            >
              browse
            </label>
          </>
        )}
      </p>
      {!isMobile && (
        <p className="mt-2 text-sm text-gray-500">Or press Ctrl + V to paste</p>
      )}
    </div>
  );
};

export default ImageUploader;
