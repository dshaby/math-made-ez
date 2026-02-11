"use client";
import React, { memo, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import CarouselControl from "./CarouselControl";

export interface CarouselImage {
  src: string;
  alt: string;
}

interface Props {
  images: CarouselImage[];
  onImageSelect: (src: string) => void;
}

function Carousel({ images, onImageSelect }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrev = useCallback(() => {
    const nextSlide = currentSlide === 0 ? images.length - 1 : currentSlide - 1;
    setCurrentSlide(nextSlide);
    const nextImage = images[nextSlide];
    if (nextImage) onImageSelect(nextImage.src);
  }, [currentSlide, images, onImageSelect]);

  const handleNext = useCallback(() => {
    const nextSlide = currentSlide === images.length - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(nextSlide);
    const nextImage = images[nextSlide];
    if (nextImage) onImageSelect(nextImage.src);
  }, [currentSlide, images, onImageSelect]);

  useEffect(() => {
    images.forEach((image) => {
      const img = new window.Image();
      img.src = image.src;
    });
  }, [images]);

  return (
    <div
      id="default-carousel"
      className="relative w-full max-w-4xl"
      data-carousel="slide"
    >
      <div className="relative h-80 overflow-hidden rounded-2xl border border-stone-900/10 bg-stone-900 p-2 shadow-2xl shadow-stone-900/15 md:h-[26rem]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`duration-700 ease-in-out ${
              index === currentSlide
                ? "flex h-full items-center justify-center"
                : "hidden"
            }`}
            data-carousel-item
            role="button"
            tabIndex={0}
            onClick={() => onImageSelect(image.src)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onImageSelect(image.src);
              }
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={500}
              height={500}
              className="h-full w-full cursor-pointer rounded-xl object-contain"
              priority={index === 0}
            />
            <div
              className="pointer-events-none absolute inset-0 flex items-end justify-center opacity-0 transition-opacity duration-300 hover:opacity-100"
            >
              <div className="w-full bg-black/55 px-4 py-4 text-center backdrop-blur-sm">
                <span className="text-sm font-semibold tracking-wide text-white">
                  Click to select this problem
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`h-2.5 w-8 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/35"
            }`}
            aria-current={index === currentSlide ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
            data-carousel-slide-to={index}
            onClick={() => {
              setCurrentSlide(index);
              const selectedImage = images[index];
              if (selectedImage) onImageSelect(selectedImage.src);
            }}
          ></button>
        ))}
      </div>

      <CarouselControl direction="prev" onClick={handlePrev} />
      <CarouselControl direction="next" onClick={handleNext} />
    </div>
  );
}

export default memo(Carousel);
