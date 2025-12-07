const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/Jean_Piaget")
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error(err));

//Modelo Directora
const directoras = mongoose.model("directoras", new mongoose.Schema({
  dni: String,
  contrasena: String,
  nombre: String
}));

//Modelo Alumno
const Alumno = mongoose.model(
  "Alumno",
  new mongoose.Schema({
    dni: String,
    nombre_completo: String,
    fecha_nacimiento: String,
    lugar_nacimiento: String,
    tutor: {
      dni: String,
      nombre_completo: String,
      telefono_padre: String,
      telefono_madre: String,
      email: String
    },
    cursos: Array,
    talleres: Array,
    edad: String
  }),
  "alumnos"
);

// 📥 Endpoint para login
app.post("/login", async (req, res) => {
  const { dni, contrasena } = req.body;

  const usuaria = await directoras.findOne({ dni, contrasena });

  if (!usuaria) {
    return res.json({ ok: false, mensaje: "DNI o contraseña incorrectos" });
  }

  return res.json({
    ok: true,
    mensaje: "Login exitoso",
    nombre: usuaria.nombre
  });
});

// 🔹 Endpoint para obtener la lista de alumnos
app.get("/alumnos", async (req, res) => {
  try {
    const alumnos = await Alumno.find({});

    const lista = alumnos.map(a => ({
      dni: a.dni,
      nombre: a.nombre_completo,
      fecha_nacimiento: a.fecha_nacimiento,
      dni_tutor: a.tutor?.dni,
      nombre_tutor: a.tutor?.nombre_completo,
      edad: a.edad
    }));

    console.log(lista); // puedes dejarlo para verificación
    res.json(lista);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener alumnos" });
  }
});

// 🚀 Iniciar servidor
app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
