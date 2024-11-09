export default function Header() {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>Math Made EZ</h1>
      <h3 style={styles.subtitle}>
        Take a photo of your math problem and get step by step solutions
        instantly
      </h3>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: "#282c34",
    padding: "20px",
    textAlign: "center" as const,
  },
  title: {
    color: "white",
    fontSize: "2em",
  },
  subtitle: {
    color: "white",
    fontSize: "1.2em",
    marginTop: "10px",
  },
};
