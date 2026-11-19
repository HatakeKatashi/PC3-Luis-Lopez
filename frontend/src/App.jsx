
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://shiny-space-invention-x5vvwx6wpp743p4px-3001.app.github.dev";

function App() {
  const [search, setSearch] = useState("");
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        const response = await fetch(
          `${API_URL}/api/universities?${params.toString()}`,
          {
            signal: controller.signal
          }
        );

        if (!response.ok) {
          throw new Error(
            "Error al consultar el servidor: " + response.status
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Error al obtener universidades");
        }

        setUniversities(result.data);

      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          setUniversities([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };

  }, [search]);

  return (
    <main className="container">

      <header>
        <h1>🎓 Universidades del Perú</h1>
        <p>Encuentra tu universidad</p>
      </header>

      <div className="search">
        <input
          type="text"
          placeholder="Escribe el nombre de una universidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <p className="counter">
        {loading
          ? "Buscando universidades..."
          : `${universities.length} universidades encontradas`}
      </p>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {!loading && !error && universities.length === 0 && (
        <p>No se encontraron universidades.</p>
      )}

      <section className="grid">
        {universities.map((university, index) => (
          <article
            className="card"
            key={`${university.name}-${index}`}
          >
            <h2>{university.name}</h2>

            <p>
              <strong>País:</strong> {university.country}
            </p>

            <p>
              <strong>Dominio:</strong>{" "}
              {university.domains?.join(", ") || "No disponible"}
            </p>

            {university.web_pages?.[0] && (
              <a
                href={university.web_pages[0]}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visitar sitio web ↗
              </a>
            )}
          </article>
        ))}
      </section>

      <footer>
        Datos proporcionados por Hipolabs Universities API
      </footer>

    </main>
  );
}

export default App;
