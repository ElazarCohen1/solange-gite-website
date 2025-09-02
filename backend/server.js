import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const FILE_PATH = "bookings.json";

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json()); // ← important pour parser le JSON du POST

// Lire les réservations
app.get("/bookings", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  res.json(data);
});

// Ajouter une réservation
app.post("/bookings", (req, res) => {
  const newBooking = req.body;
  console.log("Nouvelle réservation reçue:", newBooking);

  const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  data.bookings.push(newBooking);
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));

  res.json({ success: true, bookings: data });
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
