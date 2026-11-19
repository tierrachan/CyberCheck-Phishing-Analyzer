import { FormEvent, ReactNode, useState } from "react";

const exampleUrl = "http://banco-seguro.ejemplo-verificacion.example/ingreso";

type RiskLevel = "BAJO" | "MEDIO" | "ALTO";

type Signal = {
  text: string;
  score: number | null;
  safe: boolean;
};

type AnalysisResult = {
  url: string;
  score: number;
  level: RiskLevel;
  recommendation: string;
  signals: Signal[];
  breakdown: {
    scheme: string;
    subdomain: string;
    domain: string;
    path: string;
    parameters: string;
  };
};

const warningSignalPool = [
  { text: "Marca en el subdominio, no en el dominio registrable", score: 20 },
  { text: "Cantidad inusual de subdominios", score: 18 },
  { text: "Extensión de dominio asociada a campañas sospechosas", score: 16 },
  { text: "Caracteres codificados en la dirección", score: 15 },
  { text: "Palabras sensibles encontradas en la URL", score: 12 },
  { text: "Servicio de acortamiento de enlaces detectado", score: 10 },
  { text: "Puerto de red no habitual", score: 8 },
  { text: "Longitud de URL superior a la recomendada", score: 7 },
  { text: "Uso de múltiples guiones en el host", score: 5 },
  { text: "Esquema HTTP sin cifrado", score: 5 },
  { text: "Exceso de parámetros en la consulta", score: 4 },
  { text: "Caracteres visualmente similares detectados", score: 3 },
];

const safeSignalPool = [
  "No se detectaron direcciones IP ocultas",
  "El dominio no contiene caracteres Unicode sospechosos",
  "No se detectaron redirecciones en la URL",
  "La ruta no contiene archivos ejecutables",
  "No se encontraron credenciales incrustadas",
];

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function getBreakdown(value: string) {
  const parsed = new URL(value);
  const hostParts = parsed.hostname.split(".");
  const domain = hostParts.length > 1 ? hostParts.slice(-2).join(".") : parsed.hostname;
  const subdomain = hostParts.length > 2 ? hostParts.slice(0, -2).join(".") : "(ninguno)";

  return {
    scheme: parsed.protocol.replace(":", ""),
    subdomain,
    domain,
    path: parsed.pathname || "/",
    parameters: parsed.search ? parsed.search.slice(1) : "(ninguno)",
  };
}

function generateAnalysis(url: string): AnalysisResult {
  const warningCount = Math.floor(Math.random() * 8) + 1;
  const warnings = shuffle(warningSignalPool)
    .slice(0, warningCount)
    .map((signal) => ({ ...signal, safe: false }));

  while (warnings.length > 1 && warnings.reduce((total, signal) => total + signal.score, 0) > 96) {
    warnings.pop();
  }

  const score = warnings.reduce((total, signal) => total + signal.score, 0);
  const safeCount = Math.floor(Math.random() * 2) + 1;
  const safeSignals = shuffle(safeSignalPool)
    .slice(0, safeCount)
    .map((text) => ({ text, score: null, safe: true }));

  let level: RiskLevel;
  let recommendation: string;

  if (score < 35) {
    level = "BAJO";
    recommendation =
      "La URL no presenta indicadores críticos, aunque siempre conviene confirmar el remitente.";
  } else if (score < 70) {
    level = "MEDIO";
    recommendation = "Proceda con precaución y verifique la dirección oficial por otro canal.";
  } else {
    level = "ALTO";
    recommendation =
      "No abra este enlace ni introduzca información personal. Elimine el mensaje que lo contiene.";
  }

  return {
    url,
    score,
    level,
    recommendation,
    signals: shuffle([...warnings, ...safeSignals]),
    breakdown: getBreakdown(url),
  };
}

function ShieldLogo() {
  return (
    <svg aria-hidden="true" className="h-8 w-8" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 2.75 27 7v7.4c0 6.84-4.41 12.93-11 14.85C9.41 27.33 5 21.24 5 14.4V7l11-4.25Z"
        fill="#2563EB"
      />
      <path
        d="m11.6 15.9 2.82 2.8 6.18-6.14"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="2" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <rect x="3.5" y="8.3" width="13" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6.5 8.2V6.4a3.5 3.5 0 0 1 7 0v1.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <span className="signal-icon signal-icon--warning">
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 6v4.2M10 13.5v.1"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M8.45 3.28 2.2 14.06A1.78 1.78 0 0 0 3.75 16.7h12.5a1.78 1.78 0 0 0 1.54-2.65L11.55 3.28a1.78 1.78 0 0 0-3.1 0Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function CheckIcon() {
  return (
    <span className="signal-icon signal-icon--safe">
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
        <path
          d="m5.5 10.2 3 3 6-6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Header({ onHome }: { onHome: () => void }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <button className="brand" onClick={onHome} aria-label="Ir al inicio de CyberCheck">
          <ShieldLogo />
          <span>CyberCheck</span>
        </button>
        <a className="docs-link" href="#documentacion">
          Documentación
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h9M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </header>
  );
}

function AppShell({ children, onHome }: { children: ReactNode; onHome: () => void }) {
  return (
    <div className="app-shell">
      <Header onHome={onHome} />
      {children}
      <footer id="documentacion" className="app-footer">
        <span>© 2025 CyberCheck</span>
        <span>Privacidad por diseño · Análisis local y seguro</span>
      </footer>
    </div>
  );
}

function Home({ onAnalyze }: { onAnalyze: (result: AnalysisResult) => void }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = url.trim();

    try {
      const parsed = new URL(value);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      setError("Introduce una URL válida que comience por http:// o https://");
      return;
    }

    setError("");
    setIsLoading(true);
    window.setTimeout(() => onAnalyze(generateAnalysis(value)), 650);
  }

  return (
    <AppShell onHome={() => setUrl("")}>
      <main className="home-main">
        <div className="ambient ambient--one" />
        <div className="ambient ambient--two" />
        <section className="hero" aria-labelledby="home-title">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Protección inteligente contra phishing
          </div>
          <h1 id="home-title">Analizador Heurístico de URLs</h1>
          <p className="hero-subtitle">
            Detecta enlaces fraudulentos y phishing en segundos.
            <span> Análisis 100% seguro.</span>
          </p>

          <form className="url-form" onSubmit={handleSubmit} noValidate>
            <div className={`input-wrap ${error ? "input-wrap--error" : ""}`}>
              <span className="input-icon">
                <SearchIcon />
              </span>
              <input
                aria-label="URL para analizar"
                aria-describedby={error ? "url-error" : "security-note"}
                aria-invalid={Boolean(error)}
                autoComplete="url"
                onChange={(event) => {
                  setUrl(event.target.value);
                  if (error) setError("");
                }}
                placeholder={exampleUrl}
                spellCheck="false"
                type="url"
                value={url}
              />
              <button className="analyze-button" disabled={isLoading} type="submit">
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    Analizando…
                  </>
                ) : (
                  <>
                    Analizar enlace
                    <svg aria-hidden="true" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M4 9h10M10 5l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="form-error" id="url-error" role="alert">
                {error}
              </p>
            )}
          </form>

          <div className="security-note" id="security-note">
            <LockIcon />
            <p>
              <strong>Su seguridad es primero:</strong> El sitio no se visita ni se descarga
              contenido durante el análisis.
            </p>
          </div>

          <div className="trust-row" aria-label="Características del análisis">
            <span>Sin navegación</span>
            <i />
            <span>Sin descargas</span>
            <i />
            <span>Privacidad total</span>
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function Results({ result, onHome }: { result: AnalysisResult; onHome: () => void }) {
  const riskClass = `risk-${result.level.toLowerCase()}`;
  const circumference = 421;
  const gaugeOffset = circumference - (circumference * result.score) / 100;

  return (
    <AppShell onHome={onHome}>
      <main className="results-main">
        <div className="results-heading">
          <div>
            <button className="back-button" onClick={onHome}>
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13 8H3M7 4 3 8l4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Nuevo análisis
            </button>
            <h1>Resultado del análisis</h1>
            <p>Evaluación heurística completada para la dirección proporcionada.</p>
          </div>
          <span className="analysis-status">
            <i /> Análisis completado
          </span>
        </div>

        <section className={`risk-card ${riskClass}`} aria-labelledby="risk-heading">
          <div className="gauge" aria-label={`Puntuación de riesgo: ${result.score} de 100`}>
            <svg viewBox="0 0 160 160" role="img">
              <circle className="gauge-track" cx="80" cy="80" r="67" />
              <circle
                className="gauge-value"
                cx="80"
                cy="80"
                r="67"
                style={{ strokeDashoffset: gaugeOffset }}
              />
            </svg>
            <div className="gauge-score">
              <strong>{result.score}</strong>
              <span>/100</span>
            </div>
          </div>
          <div className="risk-copy">
            <span className="risk-label">Puntuación de riesgo</span>
            <h2 id="risk-heading">
              Riesgo <strong>{result.level}</strong>
            </h2>
            <p>Recomendación: {result.recommendation}</p>
            <div className="analyzed-url" title={result.url}>
              <LockIcon />
              <span>{result.url}</span>
            </div>
          </div>
          <div className="risk-scale" aria-hidden="true">
            <div className={result.level === "BAJO" ? "scale-active" : ""}>
              <span>Bajo</span>
              <i className="scale-low" />
            </div>
            <div className={result.level === "MEDIO" ? "scale-active" : ""}>
              <span>Medio</span>
              <i className="scale-medium" />
            </div>
            <div className={result.level === "ALTO" ? "scale-active" : ""}>
              <span>Alto</span>
              <i className="scale-high" />
            </div>
          </div>
        </section>

        <div className="result-grid">
          <section className="content-card signals-card" aria-labelledby="signals-heading">
            <div className="card-heading">
              <div>
                <span className="section-kicker">Análisis heurístico</span>
                <h2 id="signals-heading">Señales detectadas</h2>
              </div>
              <span className="signal-count">
                {result.signals.length} {result.signals.length === 1 ? "señal" : "señales"}
              </span>
            </div>
            <ul className="signals-list">
              {result.signals.map((signal) => (
                <li key={signal.text}>
                  {signal.safe ? <CheckIcon /> : <WarningIcon />}
                  <span className={signal.safe ? "safe-text" : ""}>{signal.text}</span>
                  {signal.score && <strong>+{signal.score}</strong>}
                </li>
              ))}
            </ul>
          </section>

          <section className="content-card breakdown-card" aria-labelledby="breakdown-heading">
            <div className="card-heading">
              <div>
                <span className="section-kicker">Estructura técnica</span>
                <h2 id="breakdown-heading">Descomposición de la URL</h2>
              </div>
            </div>
            <dl className="breakdown-list">
              <div>
                <dt>Esquema</dt>
                <dd>
                  <span
                    className={
                      result.breakdown.scheme === "https"
                        ? "scheme-badge scheme-badge--safe"
                        : "scheme-badge"
                    }
                  >
                    {result.breakdown.scheme}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Subdominio</dt>
                <dd>{result.breakdown.subdomain}</dd>
              </div>
              <div>
                <dt>Dominio registrable</dt>
                <dd>{result.breakdown.domain}</dd>
              </div>
              <div>
                <dt>Ruta</dt>
                <dd>{result.breakdown.path}</dd>
              </div>
              <div>
                <dt>Parámetros</dt>
                <dd className={result.breakdown.parameters === "(ninguno)" ? "muted-value" : ""}>
                  {result.breakdown.parameters}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </main>
    </AppShell>
  );
}

export default function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  return analysis ? (
    <Results result={analysis} onHome={() => setAnalysis(null)} />
  ) : (
    <Home onAnalyze={setAnalysis} />
  );
}
