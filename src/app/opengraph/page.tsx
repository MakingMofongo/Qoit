export default function OpenGraphPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "2rem", background: "#faf9f7" }}>
      <div style={{ maxWidth: "100%", height: "auto", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <img
          src="/api/opengraph"
          alt="Qoit — The most beautiful way to go offline"
          style={{ width: "100%", height: "auto", display: "block", maxWidth: "3840px" }}
        />
      </div>
    </div>
  );
}

