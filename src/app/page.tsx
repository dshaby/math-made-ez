import { HydrateClient } from "~/trpc/server";
import MathSolver from "./_components/MathSolver";
import Header from "./_components/Header";

export default async function Home() {
  return (
    <HydrateClient>
      <Header />
      <MathSolver />
    </HydrateClient>
  );
}
