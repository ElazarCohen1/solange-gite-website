import '../css/App.css'
import NavbarMenu from '../components/navBar.jsx'
import Presentation from './Presentation.jsx'
import About from '../pages/About'
import Decouverte from '../pages/Decouverte.jsx'
import Contact from '../pages/Contact.jsx'
import MentionsLegales from './MentionsLegales.jsx'
import ReservationSearchBar from "../components/reservation";
import CancelReservation from "../pages/CancelReservation.jsx"; // 🔹 importer la nouvelle page

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// ta page actuelle (home) emballée dans un composant
function Home() {
  return (
    <>
      <header>
        <NavbarMenu />
      </header>
      <main>
        <div className='space-y-6'>
          <section id='presentation' className='section scroll-mt-10 mt-2'>
            <Presentation />
            <ReservationSearchBar />
          </section>
          <section id='about' className='section scroll-mt-10'>
            <About />
          </section>
          <section id='decouverte' className='section scroll-mt-4'>
            <Decouverte />
          </section>
          <section id='contact' className='section'>
            <Contact />
          </section>
        </div>
        <footer>
          <MentionsLegales />
        </footer>
      </main>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* route principale */}
        <Route path="/" element={<Home />} />

        {/* route d’annulation */}
        <Route path="/cancel" element={<CancelReservation />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
