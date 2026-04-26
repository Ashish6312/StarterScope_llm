const tech = [
  "React",
  "Vite",
  "FastAPI",
  "Gemini AI",
  "PostgreSQL",
  "OpenAI",
  "SerpAPI",
  "Render",
];

export function TechStack() {
  return (
    <section className="py-12 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-body text-sm text-text-muted">
          Powered by world-class technology
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {tech.map((t) => (
            <span
              key={t}
              className="px-4 py-2 rounded-full border border-border bg-elevated font-mono text-xs text-text-secondary transition-colors hover:border-accent-emerald/30 hover:text-text-primary"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
