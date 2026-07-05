// Scaffold shell. Real routing (auth, rooms, lenses) is added in later build steps.
export function App() {
  return (
    <main style={{ padding: "4rem var(--pad-page)", maxWidth: "var(--measure)", margin: "0 auto" }}>
      <p className="label">TACET</p>
      <p className="voice" style={{ fontSize: "1.1rem", marginTop: "1.5rem" }}>
        A quiet room. Nothing here asks to be opened.
      </p>
    </main>
  );
}
