import { CheckCircle, Wifi, Car, Tv, Coffee, Bath } from "lucide-react";
import EquipmentSection from "../components/EquipementSection.jsx";
import cuisine from "../assets/alerces/cuisine.jpg";
import salle_bains from "../assets/alerces/salle_bains_3.jpg";
import salle_manger from "../assets/alerces/salle_manger_2.jpg";
import piscine from "../assets/alerces/piscine.jpg";
import famille from "../assets/alerces/famille.jpg";
import security from "../assets/alerces/security.jpg";

export default function About() {
  const highlights = [
    { icon: <CheckCircle className="w-6 h-6 text-green-600" />, label: "Piscine privée" },
    { icon: <Car className="w-6 h-6 text-green-600" />, label: "Parking gratuit" },
    { icon: <Wifi className="w-6 h-6 text-green-600" />, label: "Wi-Fi rapide et gratuit" },
    { icon: <Tv className="w-6 h-6 text-green-600" />, label: "Télévision écran plat" },
    { icon: <Bath className="w-6 h-6 text-green-600" />, label: "Salle de bain moderne" },
    { icon: <Coffee className="w-6 h-6 text-green-600" />, label: "Cuisine équipée" },
  ];

  // ✅ Sections avec images
  const equipmentSections = [
    {
      title: "Cuisine",
      image: cuisine,
      items: [
        "Machine à café", "Grille-pain", "Plaque de cuisson", "Four",
        "Bouilloire électrique", "Lave-vaisselle", "Micro-ondes", "Réfrigérateur",
        "Table à manger", "Chaise haute enfants"
      ],
    },
    {
      title: "Salle de bains",
      image: salle_bains,
      items: [
        "Baignoire", "Douche", "Sèche-cheveux", "Serviettes", "Articles de toilette gratuits"
      ],
    },
    {
      title: "Chambre & Salon",
      image: salle_manger,
      items: [
        "Linge de maison", "Coin repas", "Télévision écran plat",
        "Matériel de repassage", "Chauffage"
      ],
    },
    {
      title: "Extérieur",
      image: piscine,
      items: [
        "Terrasse", "Balcon", "Piscine privée", "Barbecue",
        "Vue sur la piscine", "Vue sur le jardin", "Mobilier d’extérieur","table de ping pong"
      ],
    },
    {
      title: "Famille & divertissement",
      image: famille,
      items: [
        "Jeux de société", "DVD / Musique pour enfants", "Barrières de sécurité bébé"
      ],
    },
    {
      title: "Sécurité",
      image: security,
      items: ["Détecteur de monoxyde de carbone"],
    },
  ];

  return (
    <div className="w-full px-2 ">
      {/* Header */}
      <div className="w-[70%] mx-auto pt-24 pb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Villa l’Alerces
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Profitez d’un séjour inoubliable dans un cadre idyllique. 
        La villa dispose d’équipements modernes et confortables, 
        notés <span className="font-semibold text-sky-600">9.1</span> par nos clients.
      </p>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {highlights.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 shadow-sm border">
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </div> 
        ))}
        </div>
      </div>

      {/* Equipment sections avec images */}
      <div className="space-y-12">
        {equipmentSections.map((section, idx) => (
          <EquipmentSection
            key={idx}
            title={section.title}
            items={section.items}
            image={section.image}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <p className="text-gray-600 mt-2">
           une <span className="font-medium">taxe</span> de sejour est à payer au propriétaire 
        </p>
        <p className="text-gray-600">
          Langues parlées : <span className="font-medium">Français, Anglais</span>
        </p>
        <p>
          la villa est equipe d'une boite a clé 
        </p>
      </div>
    </div>
  );
}
