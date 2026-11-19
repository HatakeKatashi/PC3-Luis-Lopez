
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend de universidades funcionando"
  });
});

app.get("/api/universities", async (req, res) => {
  try {
    const params = new URLSearchParams({
      country: "Peru"
    });

    const search = (req.query.search || "").trim();

    if (search) {
      params.set("name", search);
    }

    const response = await fetch(
      `http://universities.hipolabs.com/search?${params}`
    );

    if (!response.ok) {
      throw new Error("Error consultando la API");
    }

    const universities = await response.json();

    res.json({
      success: true,
      total: universities.length,
      data: universities
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
