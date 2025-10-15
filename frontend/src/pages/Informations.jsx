import React, { useState, useEffect, use } from "react";


export default function Informations() {
  const [taxe, setTaxe] = useState(0);

  const  taxeSejour = async ()  =>{
    try {
      const response = await fetch('https://solange-gite-website.vercel.app/taxeSejour', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setTaxe(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }
  useEffect(() => {
    taxeSejour();
  }, []); 
  return (
    <div className="w-full px-4 md:px-8 pt-24 pb-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Informations importantes
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Merci de prendre connaissance des informations suivantes avant votre séjour à la Villa l’Alerces.
        </p>
      </div>

      {/* Informations principales */}
      <div className="max-w-3xl mx-auto bg-slate-50 rounded-2xl shadow-sm border p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-sky-700 mb-2">Taxe de séjour</h2>
          <p className="text-gray-700">
            La taxe de séjour est appliquée <span className="font-medium">par personne</span>. 
            Le montant est de <span className="font-bold">{taxe}</span> .
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-sky-700 mb-2">Frais de ménage</h2>
          <p className="text-gray-700">
            Les frais de ménage sont <span className="font-medium">inclus</span>. 
            Cependant, si la maison est rendue sale, une somme pourra être retirée de la caution 
            <span className="font-medium"> (photo à l’appui)</span>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-sky-700 mb-2">Caution</h2>
          <p className="text-gray-700">
            Une <span className="font-medium">caution de 40 %</span> du montant total est demandée 
            et doit être envoyée au moment de la réservation.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-sky-700 mb-2">Horaires d’arrivée et de départ</h2>
          <p className="text-gray-700">
            Les <span className="font-medium">arrivées</span> se font à partir de <span className="font-medium">17 h</span>.<br />
            Les <span className="font-medium">départs</span> doivent être effectués avant <span className="font-medium">10 h</span>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-sky-700 mb-2">Accès et boîte à clefs</h2>
          <p className="text-gray-700">
            Le <span className="font-medium">code de la boîte à clefs</span> vous sera communiqué 
            par SMS le jour de votre arrivée.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-sky-700 mb-2">Piscine</h2>
          <p className="text-gray-700">
            La <span className="font-medium">piscine est sous votre responsabilité</span>. 
            Merci de veiller à la sécurité de tous les occupants, en particulier des enfants.
          </p>
        </div>
        
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-600">
        <p>
          Pour toute question supplémentaire, n’hésitez pas à contacter le propriétaire.
        </p>
      </div>
    </div>
  );
}
