import express from "express";
import cors from "cors";
import fs from "fs";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
// envoyer un mail a chaque reservation
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const spreadsheetId = process.env.SHEET_ID;

async function sendEmail(to,subject,text="",html="") {
  try{
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
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
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
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

app.get("/taxeSejour", async (req, res) => {
  try {
    const data = await getSheet("Feuil1!I2:I2");
    console.log(data);
    res.json({success: true, message: "taxeSejour", data: data[0][0]});
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
});
 
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

const formatDateForEmail = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
};

app.post("/reserve", async (req, res) => {
  
  try {
    

    const { startDate, endDate, nom, email,nb_personne } = req.body;
    // récupération de la feuille
    const rows = await getSheet("Feuil1!A:F"); // A=Date, B=Prix, C=Dispo, D=Nom, E=Email F=nb_personne
    // formater en Date pour comparer
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startFormatted = formatDateForEmail(startDate);
    const endFormatted = formatDateForEmail(endDate);
    // on prépare les updates
    const updates = [];
    rows.forEach((row, i) => {
      if (i === 0) return; 
      const [date, prix, dispo] = row;
      const [day, month, year] = date.split("/");
      const rowDate = new Date(`${year}-${month}-${day}`);
      // console.log(`Comparaison des dates : ${rowDate} avec ${start} - ${end}`);
      const endPlusOne = new Date(end.getTime() + 24 * 60 * 60 * 1000);
      if (rowDate >= start && rowDate <= endPlusOne) {
        console.log(`Traitement de la date : ${date} (dispo: ${dispo})`);
        updates.push({
          range: `Feuil1!C${i + 1}:F${i + 1}`, // colonnes C à F de la ligne
          values: [["Non", nom, email,nb_personne]]
        });
      }
    });
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
        const endPlusOne = new Date(end.getTime() + 24 * 60 * 60 * 1000);
        await sendEmail(
        email,
        "confirmation de réservation",
        `Bonjour ${nom},\n\nVotre réservation du ${startFormatted} au ${endFormatted} pour ${nb_personne} personnes a été confirmée.
        Si vous voulez annulez appuyer sur ce lien : http://localhost:5173/cancel?start=${startDate}&end=${endPlusOne}&email=${email}
        \n\nMerci!`,
        `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <p>Bonjour <b>${nom}</b>,</p>
          <p>Votre réservation du <b>${startFormatted}</b> au <b>${endFormatted}</b> pour <b>${nb_personne} personnes</b> a été confirmée.</p>
          <p> <b>Rappel : <b/> la taxe de sejour par personne sera a payer au propriétaire (Voir les informations sur le site)<p/>

          <p>Si vous souhaitez annuler votre réservation, cliquez sur le bouton ci-dessous :</p>
          <a href="http://localhost:5173/cancel?start=${startDate}&end=${endPlusOne}&email=${email}" 
            style="display:inline-block;padding:10px 20px;margin:10px 0;background:#d9534f;color:#fff;
                    text-decoration:none;border-radius:5px;font-weight:bold;">
            Annuler ma réservation
          </a>
          <p>Merci et à bientôt !</p>
        </div>
        `
        );
        await sendEmail(
          process.env.GMAIL_USER,
          "Nouvelle réservation",
          ``,
          `
          <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.5; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #2c3e50; text-align: center;">Nouvelle réservation !</h2>
            <p>Bonjour,</p>
            <p>Vous avez reçu une nouvelle réservation. Voici les détails :</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px; font-weight: bold;">Nom :</td>
                <td style="padding: 8px;">${nom}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Email :</td>
                <td style="padding: 8px;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Dates :</td>
                <td style="padding: 8px;">Du <b>${startFormatted}</b> au <b>${endFormatted}</b></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Nombre de personnes :</td>
                <td style="padding: 8px;">${nb_personne}</td>
              </tr>
            </table>
            <p style="text-align: center; margin-top: 30px; color: #888; font-size: 14px;">
              Ceci est un email automatique, merci de ne pas y répondre.
            </p>
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
      const endPlusOne = new Date(end.getTime() + 24 * 60 * 60 * 1000);


      if (rowDate >= start && rowDate <= endPlusOne && mail === email) {
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
      `Bonjour,\n\nVotre réservation du ${formatDateForEmail(startDate)} au ${formatDateForEmail(endDate)} a bien été annulée.\n\nMerci.`
    );

    // envoyer email au propriétaire
    await sendEmail(
      process.env.GMAIL_USER,
      "Réservation annulée",
      `Le client ${email} a annulé sa réservation du ${formatDateForEmail(startDate)} au ${formatDateForEmail(endDate)}.`
    );

    res.json({ success: true, message: "Réservation annulée avec succès." });
  } catch (err) {
    console.error("Erreur lors de l'annulation :", err);
    res.status(500).send("Erreur lors de l'annulation de la réservation");
  }
});

app.post("/send_contact_email", async (req, res) => {
  const { nom, email, message } = req.body;
  try{
    await sendEmail(
    email,
    "Confirmation de réception de votre message",
    `Bonjour ${nom},\n\nNous avons bien reçu votre message :\n"${message}"\n\nNous vous répondrons dans les plus brefs délais.\n\nMerci!`
    ,
    `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Bonjour <b>${nom}</b>,</p>
      <p>Nous avons bien reçu votre message :</p>
      <blockquote style="border-left: 4px solid #ccc; margin: 10px 0; padding-left: 10px; color: #555;">
        "${message}"
      </blockquote> 
      <p>Nous vous répondrons dans les plus brefs délais.</p>
      <p>Merci !</p>
    </div>
    `
   );
  }catch(err){
    console.error("Erreur lors de l'envoi de l'email au client :", err);
  }

  try{
    await sendEmail(
    process.env.GMAIL_USER,
    "Nouveau message de contact",
    `Vous avez reçu un nouveau message de ${nom} (${email}) :\n\n"${message}"`
    ,
    `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Vous avez reçu un nouveau message de <b>${nom}</b> (<a href="mailto:${email}">${email}</a>) :</p>
      <blockquote style="border-left: 4px solid #ccc; margin: 10px 0; padding-left: 10px; color: #555;">
        "${message}"
      </blockquote>
    </div>
    `
    );
  }catch(err){
    console.error("Erreur lors de l'envoi de l'email au proprietaire :", err);
    return res.status(500).send("Erreur lors de l'envoi du message");
  }

  res.json({ success: true, message: "Email de contact envoyé !" });
    
});


app.listen(8080, () => {
  console.log("server running on http://localhost:8080");
});	
