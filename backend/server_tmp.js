import express from "express";
import cors from "cors";
import fs from "fs";
import nodemailer from "nodemailer";

const app = express();
const FILE_PATH = "bookings.json";

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json()); 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "elazarcohen01@gmail.com",
    pass: "syja hpir lopf pgbr"
  }
});


// Lire les réservations
app.get("/bookings", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  res.json(data);
});

// Ajouter une réservation

function isOverlapping(newBooking, existingBooking) {
  const newStart = new Date(newBooking.start);
  const newEnd = new Date(newBooking.end);
  const existStart = new Date(existingBooking.start);
  const existEnd = new Date(existingBooking.end);

  // Chevauchement si les dates se croisent
  return newStart <= existEnd && newEnd >= existStart;
}

app.post("/bookings", async (req, res) =>  {
  const newBooking = req.body;
  const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));

  // Vérifier si une réservation existe déjà pour ces dates
  const conflict = data.bookings.some((b) => isOverlapping(newBooking, b));
  if (conflict) {
    return res.status(400).json({
      success: false,
      message: "Ces dates sont déjà réservées.",
    });
  }else if (!newBooking.mail) {
    return res.status(400).json({
      success: false,
      message: "L'email est requis pour la réservation.",
    });
  }

  // Ajouter si pas de conflit
  data.bookings.push(newBooking);
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));


  try {
    await transporter.sendMail({
      from: "elazarcohen01@gmail.com",
      to: "elazarcohen01@gmail.com",
      subject: "Nouvelle réservation",
      text: `Nouvelle réservation : ${newBooking.start} → ${newBooking.end}, ${newBooking.guests} voyageurs. le mail : ${newBooking.mail}`
    });

    // Mail de confirmation pour le client
    await transporter.sendMail({
      from: "elazarcohen01@gmail.com",
      to: newBooking.mail,
      subject: "Confirmation de réservation",
      text: `Bonjour, votre réservation du ${newBooking.start} au ${newBooking.end} pour ${newBooking.guests} personnes est confirmée.`
    });

    console.log("Emails envoyés avec succès !");
    res.json({ success: true, bookings: data,message: "Réservation ajoutée avec succès !"});
  } catch (err) {
    console.error("Erreur lors de l'envoi des emails :", err);
    res.status(500).json({ success: false, message: "Erreur lors de l'envoi des emails." });
  }


 
});


app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
