import { HydrateClient } from "~/trpc/server";
import MathSolver from "./_components/MathSolver";
import Header from "./_components/Header";
import "katex/dist/katex.min.css";

export default async function Home() {
  return (
    <HydrateClient>
      <Header />
      <MathSolver />
    </HydrateClient>
  );
}
