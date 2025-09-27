export default function MentionsLegales() {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm py-6 mt-10 border-t">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Texte gauche */}
        <p>
          © {new Date().getFullYear()} Villa l’Alerces — Tous droits réservés
        </p>

        {/* Mentions rapides */}
        <div className="flex gap-6">
          <a href="#mentions" className="hover:text-gray-800">
            Mentions légales
          </a>
          <a href="#contact" className="hover:text-gray-800">
            Contact
          </a>
        </div>
      </div>

      {/* Section détaillée */}
      <div
        id="mentions"
        className="max-w-6xl mx-auto px-4 mt-6 text-xs text-gray-500 leading-relaxed"
      >
        <p>
          <span className="font-medium">Éditeur :</span> Villa l’Alerces – Solange DeNazelle
        </p>
        <p>
          <span className="font-medium">Hébergement :</span> O2Switch, 222 Boulevard Gustave Flaubert, 63000 Clermont-Ferrand, France.
        </p>
        <p>
          <span className="font-medium">Données personnelles :</span> Les informations collectées via ce site sont utilisées uniquement pour la gestion des réservations. 
          Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression de vos données en écrivant à{" "}
          <a
            href="mailto:elazarcohen01@gmail.com"
            className="text-blue-500 hover:underline"
          >
            elazarcohen01@gmail.com
          </a>.
        </p>
        <p>
          <span className="font-medium">Création du site :</span> Réalisé par Elazar Cohen développeur web.
          <br></br>
            <a href="https://elazarcohen1.github.io/portfolio/" target="_blank" > portfolio Elazar Cohen</a>
        </p>
        
      </div>
    </footer>
  );
}
