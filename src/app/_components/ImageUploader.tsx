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
      className={`flex min-h-72 w-full max-w-3xl flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all ${
        dragActive
          ? "border-teal-700 bg-teal-50/70"
          : "border-stone-400/60 bg-white/60"
      }`}
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
      <label
        htmlFor="file-upload"
        className="cursor-pointer rounded-full border border-stone-300/70 bg-white p-3 shadow-lg shadow-stone-900/5"
      >
        <Image
          src="/assets/upload-photo.svg"
          alt="Upload Icon"
          width={112}
          height={112}
        />
      </label>
      <p className="mt-4 text-center text-base text-stone-700">
        {isMobile ? (
          <>
            Tap to{" "}
            <label
              htmlFor="file-upload"
              className="cursor-pointer font-semibold text-teal-800 underline decoration-2"
            >
              upload an image
            </label>
          </>
        ) : (
          <>
            Drag & drop an image here, or{" "}
            <label
              htmlFor="file-upload"
              className="cursor-pointer font-semibold text-teal-800 underline decoration-2"
            >
              browse
            </label>
          </>
        )}
      </p>
      {!isMobile && (
        <p className="mt-2 text-sm text-stone-500">Or press Ctrl + V to paste</p>
      )}
    </div>
  );
};

export default ImageUploader;
