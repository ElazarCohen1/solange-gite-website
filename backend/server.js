// recuperer les dates et le prix correspondant 

import express from "express";
import cors from "cors";
import { google } from "googleapis";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());


const spreadsheetId = "1SgcUEJcgRmkyRgWcg9BSW5xs_EIpENVr4DiN4FY-MkY";

async function googlesheet() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "secrets.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  const client = await auth.getClient();
  const googleSheet = google.sheets({ version: "v4", auth: client });
  return googleSheet;
}

async function getSheet(range) {
  
  const googleSheet = await googlesheet();
  const res = await googleSheet.spreadsheets.values.get({
    spreadsheetId,
    range
  });

  return res.data.values; 
}

app.get("/", async (req, res) => {
  try {
    const getFeuil1 = await getSheet("Feuil1!A:B");
    const getPrixSaisons = await getSheet("PrixSaisons");

    // res.json(getFeuil1); 

  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).send("Erreur lors de l'accès au Google Sheet");
  }
});

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

    for (let u of updates) {
      try {
        await updateSheet(u.range, u.values);
      } catch (err) {
        console.error("Erreur updateSheet:", err);
      }
    }
    res.json({ success: true, message: "Réservation enregistrée !" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de l'enregistrement de la réservation");
  }
});

app.get("/disable_dates",async (req,res) => {
  try{
      
      const sheet = await getSheet("Feuil1!A:C");
      // enlever l'en tete 
      const data = sheet.slice(1);
      const disables_lines = data.filter((row) => row[2].toLowerCase() === "non");
      const disables_dates = disables_lines.map((row) =>  row[0]);
      console.log(disables_dates);
      res.json({success: true, message: "disable_dates", data: disables_dates});
    
    }catch(err){
    	console.log(err);
	    res.status(500).send("erreur lors de la recuperation des disables dates");
    }

});

app.listen(8080, () => {
  console.log("server running on http://localhost:8080");
});
