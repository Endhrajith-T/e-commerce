"use client";

export default function LoadingButton({ loading, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        width: "100%",
        background: loading ? "#9A7230" : "#2E1E0F",
        color: "white",
        border: "none",
        padding: "14px 24px",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: "0.05em",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "background 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      {loading && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
          </path>
        </svg>
      )}
      {loading ? "Please wait..." : children}
    </button>
  );
}
