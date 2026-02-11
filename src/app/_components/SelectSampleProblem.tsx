import Carousel, { type CarouselImage } from "./Carousel";

interface Props {
  onSelectImage: (imageSrc: string) => void;
  isLoading?: boolean;
}

export const sampleImages: CarouselImage[] = [
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

const SelectSampleProblem = ({
  onSelectImage,
  isLoading = false,
}: Props) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          Gallery Mode
        </p>
        <h3 className="mt-2 font-serif text-3xl font-semibold text-stone-900">
          Pick a sample problem
        </h3>
        <p className="mt-2 text-sm text-stone-600">
          Great for demos. One click selects and loads a ready-to-solve example.
        </p>
      </div>
      <Carousel images={sampleImages} onImageSelect={onSelectImage} />
      <p className="mb-2 mt-5 text-base font-medium text-stone-600">
        Click any slide to switch the current demo problem
      </p>
      {isLoading && (
        <p className="mt-2 text-sm font-semibold text-teal-800">
          Loading sample...
        </p>
      )}
    </div>
  );
};

export default SelectSampleProblem;
