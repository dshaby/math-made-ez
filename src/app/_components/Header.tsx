export default function Header() {
  return (
    <header className="pt-14">
      <h1 className="text-center text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
        Math Made{" "}
        <span className="relative inline-block">
          <span className="relative z-10 italic">Easy</span>
          <span className="absolute inset-x-0 bottom-0 z-0 h-2 bg-red-500"></span>
        </span>
      </h1>
      <h2 className="mx-auto mt-6 max-w-3xl text-center text-2xl font-medium text-gray-700 sm:text-3xl md:text-4xl">
        Take a photo of your math problem and get step by step solutions
        instantly
      </h2>
    </header>
  );
}
