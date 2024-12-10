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
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? images.length - 1 : prevSlide - 1,
    );
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentSlide((prevSlide) =>
      prevSlide === images.length - 1 ? 0 : prevSlide + 1,
    );
  }, [images.length]);

  useEffect(() => {
    images.forEach((image) => {
      const img = new window.Image();
      img.src = image.src;
    });
  }, [images]);

  return (
    <div
      id="default-carousel"
      className="relative w-full"
      data-carousel="slide"
    >
      {/* Carousel wrapper */}
      <div className="relative h-96 overflow-hidden rounded-lg bg-gray-200 md:h-96">
        {images.map((image, index) => (
          <div
            key={index}
            className={`duration-700 ease-in-out ${
              index === currentSlide
                ? "flex h-full items-center justify-center"
                : "hidden"
            }`}
            data-carousel-item
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={500}
              height={500}
              className="cursor-pointer"
              priority={index === 0}
            />
            <div
              className="absolute inset-0 flex cursor-pointer items-end justify-center opacity-0 transition-opacity duration-300 hover:opacity-100"
              onClick={() => onImageSelect(image.src)}
            >
              <div className="h-24 w-full bg-black bg-opacity-50 pt-5 text-center">
                <span className="text-white">Tap to select this problem</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Slider indicators */}
      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`h-3 w-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-gray-600"
            }`}
            aria-current={index === currentSlide ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
            data-carousel-slide-to={index}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>
      {/* Slider controls */}
      <CarouselControl direction="prev" onClick={handlePrev} />
      <CarouselControl direction="next" onClick={handleNext} />
    </div>
  );
}

export default memo(Carousel);
