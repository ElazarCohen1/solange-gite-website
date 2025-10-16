// Carousel.jsx
import React from "react";
import Slider from "react-slick";

import maison from "../assets/alerces/maison.jpg";
import piscine from "../assets/alerces/piscine.jpg";
import chateau from "../assets/alerces/chateau.jpg";
import salleManger from "../assets/alerces/salle_manger_2.jpg";
import balcon_barriere from "../assets/alerces/balcon_barriere.jpg";
import chambre_2 from "../assets/alerces/chambre_2.jpg";
import chambre from "../assets/alerces/chambre.jpg";
import cuisine_long_vue from "../assets/alerces/cuisine_long_vue.jpg";
import cuisine_table from "../assets/alerces/cuisine_table.jpg";
import cuisine from "../assets/alerces/cuisine.jpg";
import escalier from "../assets/alerces/escalier.jpg";
import garage from "../assets/alerces/garage.jpg";
import jardin from "../assets/alerces/jardin.jpg";
import pont from "../assets/alerces/pont.jpg";
import salle_bains_2 from "../assets/alerces/salle_bains_2.jpg";
import salle_bains_3 from "../assets/alerces/salle_bains_3.jpg";
import salle_manger_2 from "../assets/alerces/salle_manger_2.jpg";
import toilette from "../assets/alerces/toilette.jpg";

const images = [
  maison, piscine, chateau, salleManger, balcon_barriere, chambre_2,
  chambre, cuisine_long_vue, cuisine_table, cuisine, escalier,
  garage, jardin, pont, salle_bains_2, salle_bains_3, salle_manger_2, toilette
];

// Flèche gauche
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1 sm:p-2 focus:outline-none active:scale-90 transition-transform"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

// Flèche droite
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1 sm:p-2 focus:outline-none active:scale-90 transition-transform"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

export default function Carousel() {
  const settings = {
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dots: false,
  };

  return (
    <div className="relative w-full mb-5 sm:w-[95%] mx-auto h-[60vh] sm:h-[80vh] md:h-screen rounded-2xl overflow-hidden shadow-lg">

      {/* Overlay texte */}
      <div className="absolute inset-0 flex items-center justify-start z-20 px-4 sm:ml-8 md:ml-14">
        <div className="text-[#F5F5DC] p-4 sm:p-6 rounded-xl max-w-sm sm:max-w-md bg-black/30 backdrop-blur-[2px]">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-3 sm:mb-4">
            Villa D’Alerces
          </h1>
          <p className="text-sm sm:text-base md:text-xl leading-snug sm:leading-normal">
            Profitez d’un cadre unique au cœur de la Vallée de la Loire, entre confort moderne et charme authentique, à deux pas des plus beaux châteaux.
          </p>
        </div>
      </div>

      {/* Slider */}
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index}>
            <img
              src={src}
              alt={`Slide ${index}`}
              className="w-full h-[60vh] sm:h-[80vh] md:h-screen object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
