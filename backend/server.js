import express from "express";
import cors from "cors";
import fs from "fs";
import nodemailer from "nodemailer";
import { google } from "googleapis";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
// envoyer un mail a chaque reservation
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "elazarcohen01@gmail.com",
    pass: "syja hpir lopf pgbr"
  }
});

const spreadsheetId = "1SgcUEJcgRmkyRgWcg9BSW5xs_EIpENVr4DiN4FY-MkY";

async function sendEmail(to,subject,text="",html="") {
  try{
    await transporter.sendMail({
      from: "elazarcohen01@gmail.com",
      to: to,
      subject: subject,
      text: text,
      html: html
    });
    return true;
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'email :", err);
    return false;
  }
}

async function googlesheet() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "secrets.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  const client = await auth.getClient();
  const googleSheet = google.sheets({ version: "v4", auth: client });
  return googleSheet;
}


async function get_disable_date(){
  const sheet = await getSheet("Feuil1!A:C");
  // enlever l'en tete 
  const data = sheet.slice(1);
  const disables_lines = data.filter((row) => row[2].toLowerCase() === "non");
  const disables_dates = disables_lines.map((row) =>  row[0]);
  return disables_dates;

}

async function getSheet(range) {
  
  const googleSheet = await googlesheet();
  const res = await googleSheet.spreadsheets.values.get({
    spreadsheetId,
    range
  });

  return res.data.values; 
}

app.get("/price_and_date",async (req,res)=>{
  try{
      const getFeuil1 = await getSheet("Feuil1!A:B");
      const dict = Object.fromEntries(getFeuil1.slice(1));
      res.json(dict);

  }catch(err){
    res.status(500).send("erreur lors de la récuperation des prix")
  }
})
 
async function updateSheet(range, values) {

  const googleSheet = await googlesheet();

  try{
    const res = await googleSheet.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      resource: { values }
    });
    return res;
  }catch(err){
    console.error("Erreur lors de l'écriture dans la feuille :", err);
  }
}


app.post("/reserve", async (req, res) => {
  try {
    const { startDate, endDate, nom, email,nb_personne } = req.body;
    // récupération de la feuille
    const rows = await getSheet("Feuil1!A:F"); // A=Date, B=Prix, C=Dispo, D=Nom, E=Email F=nb_personne

    
    // formater en Date pour comparer
    const start = new Date(startDate);
    const end = new Date(endDate);

    // on prépare les updates
    const updates = [];
    rows.forEach((row, i) => {
      if (i === 0) return; 
      const [date, prix, dispo] = row;
      const [day, month, year] = date.split("/");
      const rowDate = new Date(`${year}-${month}-${day}`);
      // console.log(`Comparaison des dates : ${rowDate} avec ${start} - ${end}`);
      if (rowDate >= start && rowDate <= end) {
        updates.push({
          range: `Feuil1!C${i + 1}:F${i + 1}`, // colonnes C à F de la ligne
          values: [["Non", nom, email,nb_personne]]
        });
      }
    });
    // on verifie que c'est pas deja reservé 
    // on update 
    for (let u of updates) {
      try {
        await updateSheet(u.range, u.values);
      } catch (err) {
        console.error("Erreur updateSheet:", err);
      }
    }
    // envoyer un mail de confirmation au proprietaire et au client
    try{
        await sendEmail(
        email,
        "confirmation de réservation",
        `Bonjour ${nom},\n\nVotre réservation du ${startDate} au ${endDate} pour ${nb_personne} personnes a été confirmée.
        Si vous voulez annulez appuyer sur ce lien : http://localhost:8080/cancel_reservation 
        \n\nMerci!`,
        `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <p>Bonjour <b>${nom}</b>,</p>
          <p>Votre réservation du <b>${startDate}</b> au <b>${endDate}</b> pour <b>${nb_personne} personnes</b> a été confirmée.</p>
          <p>Si vous souhaitez annuler votre réservation, cliquez sur le bouton ci-dessous :</p>
          <a href="http://localhost:5173/cancel?start=${startDate}&end=${endDate}&email=${email}" 
            style="display:inline-block;padding:10px 20px;margin:10px 0;background:#d9534f;color:#fff;
                    text-decoration:none;border-radius:5px;font-weight:bold;">
            Annuler ma réservation
          </a>
          <p>Merci et à bientôt !</p>
        </div>
        `
        );
    }catch(err){
      console.error("Erreur lors de l'envoi de l'email au client :", err);
    }
    res.json({ success: true, message: "Réservation enregistrée !" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de l'enregistrement de la réservation");
  }
});

app.get("/disable_dates",async (req,res) => {
  // on recupere les dates ou la dispo est a non
  try{
      const disables_dates = await get_disable_date();
      res.json({success: true, message: "disable_dates", data: disables_dates});
    
    }catch(err){
    	console.log(err);
	    res.status(500).send("erreur lors de la recuperation des disables dates");
    }

});

app.post("/cancel_reservation", async (req, res) => {
  try {
    const { startDate, endDate, email } = req.body;
    const rows = await getSheet("Feuil1!A:F"); // A=Date, B=Prix, C=Dispo, D=Nom, E=Email, F=nb_personne

    const start = new Date(startDate);
    const end = new Date(endDate);

    const updates = [];
    rows.forEach((row, i) => {
      if (i === 0) return; // skip header
      const [date, prix, dispo, nom, mail] = row;
      const [day, month, year] = date.split("/");
      const rowDate = new Date(`${year}-${month}-${day}`);

      if (rowDate >= start && rowDate <= end && mail === email) {
        // remettre dispo à "Oui" et vider les infos
        updates.push({
          range: `Feuil1!C${i + 1}:F${i + 1}`,
          values: [["Oui", "", "", ""]]
        });
      }
    });

    if (updates.length === 0) {
      return res.status(404).json({ success: false, message: "Aucune réservation trouvée pour ces dates." });
    }

    for (let u of updates) {
      await updateSheet(u.range, u.values);
    }

    // envoyer email de confirmation au client
    await sendEmail(
      email,
      "Annulation de votre réservation",
      `Bonjour,\n\nVotre réservation du ${startDate} au ${endDate} a bien été annulée.\n\nMerci.`
    );

    // envoyer email au propriétaire
    await sendEmail(
      "elazarcohen01@gmail.com",
      "Réservation annulée",
      `Le client ${email} a annulé sa réservation du ${startDate} au ${endDate}.`
    );

    res.json({ success: true, message: "Réservation annulée avec succès." });
  } catch (err) {
    console.error("Erreur lors de l'annulation :", err);
    res.status(500).send("Erreur lors de l'annulation de la réservation");
  }
});


app.listen(8080, () => {
  console.log("server running on http://localhost:8080");
});	
