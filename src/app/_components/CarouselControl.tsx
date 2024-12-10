interface Props {
  direction: "prev" | "next";
  onClick: () => void;
}

const CarouselControl = ({ direction, onClick }: Props) => {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      className={`group absolute top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none ${
        isPrev ? "left-0" : "right-0"
      }`}
      onClick={onClick}
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-700/50 group-hover:bg-gray-700/70 group-focus:ring-4 group-focus:ring-gray-700">
        <svg
          className={`h-4 w-4 text-white ${isPrev ? "" : "rotate-180"}`}
          aria-hidden="true"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            d="M5 1L1 5l4 4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
        <span className="sr-only">{isPrev ? "Previous" : "Next"}</span>
      </span>
    </button>
  );
};

export default CarouselControl;
