import Carousel, { type CarouselImage } from "./Carousel";
import Button from "./Button";
import { useCallback } from "react";

interface Props {
  onSelectImage: (imageSrc: string) => void;
  onCancel: () => void;
}

const sampleImages: CarouselImage[] = [
  {
    src: "/images/basic_integral.png",
    alt: "Basic Integral Question",
  },
  {
    src: "/images/derivative_trig_functions.png",
    alt: "Derivatives of trig functions",
  },
  {
    src: "/images/calculus.png",
    alt: "Area of the region -- Calculus",
  },
  {
    src: "/images/simple_algebra_1.png",
    alt: "Simple Algebra problem",
  },
  {
    src: "/images/algebra_1_text.png",
    alt: "Simple Algebra problem",
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
      <p className="mb-2 mt-5 text-lg font-semibold text-gray-700">
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
