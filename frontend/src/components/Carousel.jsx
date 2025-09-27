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



const images = [maison, piscine, chateau, salleManger, balcon_barriere, chambre_2, chambre, cuisine_long_vue, cuisine_table, cuisine, escalier, garage, jardin, pont, salle_bains_2, salle_bains_3, salle_manger_2, toilette];

// Flèche gauche
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-1 top-1/2 -translate-y-1/2 z-20 p-2 focus:outline-none active:scale-90 transition-transform"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

// Flèche droite
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-1 top-1/2 -translate-y-1/2 z-20 p-2 focus:outline-none active:scale-90 transition-transform"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
    <div className="relative w-[95%] h-[90vh] mx-auto rounded-2xl overflow-hidden shadow-lg">

      <div className="absolute inset-0 flex items-center justify-start z-20 px-12">
        <div className="text-[#F5F5DC] p-6 rounded-xl max-w-md">
          
          <h1 className="!text-[100px] font-bold mb-4 columns-2">
            Villa D'alerces
          </h1>

          <p className="text-xl">
            Profitez d’un cadre unique au cœur de la Vallée de la Loire, entre confort moderne et charme authentique, à deux pas des plus beaux châteaux
          </p>
        </div>
      </div>


      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index} >
            <img
              src={src}
              alt={`Slide ${index}`}
              className="w-full h-screen object-cover "
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
