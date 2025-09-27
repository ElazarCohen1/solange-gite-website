import { MapPin } from "lucide-react";

import zoo from "../assets/decouverte/zoo.png";
import chenonceau from "../assets/decouverte/chenonceau.png";
import Amboise from "../assets/decouverte/Amboise.png";
import chaumont from "../assets/decouverte/chaumont.png";
import montpoupon from "../assets/decouverte/montpoupon.png";
import montrichard from "../assets/decouverte/montrichard.png";
import montresor from "../assets/decouverte/montresor.png"; 
import plageMontrichard from "../assets/decouverte/plageMontrichard.png"; 

const lieux = [
  {
    titre: "ZooParc de Beauval",
    image: zoo,
    distance: "15 min en voiture",
    description: "Classé parmi les plus beaux zoos du monde, idéal pour une sortie familiale inoubliable.",
    url: "https://www.zoobeauval.com",
  },
  {
    titre: "Château de Chenonceau",
    image: chenonceau,
    distance: "10 min en voiture",
    description: "Un des châteaux les plus élégants de la Loire, construit au-dessus du Cher.",
    url: "https://www.chenonceau.com",
  },
  {
    titre: "Château Royal d’Amboise",
    image: Amboise,
    distance: "20 min en voiture",
    description: "Résidence royale avec vue imprenable sur la Loire et la sépulture de Léonard de Vinci.",
    url: "https://www.chateau-amboise.com",
  },
  {
    titre: "Château de Chaumont-sur-Loire",
    image: chaumont,
    distance: "20 min en voiture",
    description: "Connu pour son Festival International des Jardins, un lieu de visite incontournable.",
    url: "https://domaine-chaumont.fr/fr",
  },
  {
    titre: "Château de Montpoupon",
    image: montpoupon,
    distance: "15 min en voiture",
    description: "Un château plus intime, entouré de forêts et chargé d’histoire.",
    url: "https://www.montpoupon.com",
  },
  {
    titre: "Donjon de Montrichard",
    image: montrichard,
    distance: "À 2 min à pied",
    description: "Vestige médiéval dominant Montrichard, parfait pour une balade au centre-ville.",
    url: "https://www.montrichardvaldecher.com/tourisme/la-forteresse-et-ses-musees/",
  },
  {
    titre: "Château de Montrésor",
    image: montresor,
    distance: "35 min en voiture",
    description: "Petit bijou médiéval avec un charme authentique, niché dans le village de Montrésor.",
    url: "https://chateaudemontresor.com",
  },
  {
    titre: "Plage de Montrichard",
    image: plageMontrichard,
    distance: "5 min à pied",
    description: "Une petite plage au bord du Cher idéale pour se détendre et profiter du soleil.",
    url: "https://www.montrichardvaldecher.com/activites/parc-plage/",
  },
];



function LieuCarte(props){
  const { lieu } = props;
  return (
    <a href={lieu.url} target="_blank" rel="noopener noreferrer" className="block group" style={{ textDecoration: 'none' }}>
      {/* Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={lieu.image}
          alt={lieu.titre}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
      </div>

      {/* Contenu */}
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2">{lieu.titre}</h3>
        <p className="text-gray-600 text-sm mb-3">{lieu.description}</p>
        <div className="flex items-center text-sm text-sky-600 font-medium">
          <MapPin className="w-4 h-4 mr-2" /> {lieu.distance}
        </div>
      </div>

    </a>
      
  )
}


export default function Decouverte() {
  return (
    <div className="w-full px-6 py-16 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center pb-12">
        Découvertes autour de la Villa
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {lieux.map((lieu, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group"
          >
            <LieuCarte lieu = {lieu} />
          </div>
        ))}
      </div>
    </div>
  );
}
