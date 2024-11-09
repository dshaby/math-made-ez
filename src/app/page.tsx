import { HydrateClient } from "~/trpc/server";

import MathSolver from "./_components/MathSolver";
import Header from "./_components/Header";
import styles from "./index.module.css";

export default async function Home() {
  return (
    <HydrateClient>
      <div className={styles.container}>
        <Header />
        <MathSolver />
      </div>
    </HydrateClient>
  );
}
