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

// 📥 Endpoint para guardar datos
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

// 🚀 Iniciar servidor
app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
