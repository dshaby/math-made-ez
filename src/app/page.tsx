import { HydrateClient } from "~/trpc/server";
import MathSolver from "./_components/MathSolver";
import Header from "./_components/Header";
import "katex/dist/katex.min.css";
import Image from "next/image";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="relative min-h-screen w-full">
        <Image
          src="/images/background-img.jpg"
          alt="background image"
          fill
          className="absolute inset-0 z-[-1] object-cover"
          priority
        />
        <Header />
        <MathSolver />
      </div>
    </HydrateClient>
  );
}
