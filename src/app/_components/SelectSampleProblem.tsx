import Carousel, { type CarouselImage } from "./Carousel";
import Button from "./Button";
import { useCallback } from "react";

interface Props {
  onSelectImage: (imageSrc: string) => void;
  onCancel: () => void;
}

const sampleImages: CarouselImage[] = [
  {
    src: "/images/calculus.png",
    alt: "Area of the region -- Calculus",
  },
  {
    src: "/images/exponents.png",
    alt: "Value of `w` -- Exponents",
  },
  {
    src: "/images/limit_at_infinity.png",
    alt: "Value of f(x) as limit approaches +- Infinity",
  },
];

const SelectSampleProblem = ({ onSelectImage, onCancel }: Props) => {
  const handleImageSelect = useCallback(
    async (imageSrc: string) => {
      try {
        const response = await fetch(imageSrc);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onSelectImage(base64data);
        };

        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("Error loading image: ", err);
      }
    },
    [onSelectImage],
  );

  return (
    <div className="flex flex-col items-center">
      <Carousel images={sampleImages} onImageSelect={handleImageSelect} />
      <p className="mb-4 text-lg font-medium">
        Click on an image to select a problem
      </p>
      <div className="mt-4 flex space-x-4">
        <Button variant="danger" onClick={onCancel}>
          Restart
        </Button>
      </div>
    </div>
  );
};

export default SelectSampleProblem;
