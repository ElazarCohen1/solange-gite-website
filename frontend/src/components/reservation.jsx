// bien afficher les utilitaires qui se retracte 

import React, { useState, useEffect, use } from "react";
import { DateRange } from "react-date-range";
import { addDays, format, set,startOfMonth, endOfMonth, addMonths } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function ReservationSearchBar() {
  // for the reservation button
  const [loading, setLoading] = useState(false);
  const [priceTotal, setpriceTotal] = useState(0);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 2),
      key: "selection",
    },
  ]);
  const [guests, setGuests] = useState(2);
  const [mail, setMail] = useState("");
  const [openCalendar, setOpenCalendar] = useState(false);
  const [disabledDates, setDisabledDates] = useState([]);
  const [allPrices, setAllPrices] = useState([
    {
      date: new Date(), 
      price: 120
    },
  ]); 

  useEffect( () => {
    fetch_price();
    get_disables_dates();

  }, []);
    
 
  const formatDateKey = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const get_disables_dates = async () => {
    try {
      const url = new URL("http://localhost:8080/disable_dates");
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur inconnue");
      }

      const data = await response.json();
      if (data.success) {
        const dates = data.data.map((dateStr) => {
          const [day, month, year] = dateStr.split('/').map(Number);
          const d = new Date(year, month - 1, day);
          return isNaN(d) ? null : d;
        })
        setDisabledDates(dates);
      }
    } catch (err) {
      console.log("Erreur lors de la récupération des dates désactivées :", err);
    }
  };  
  const ValideBooking = (range_of_date) => {
    // range_of_date doit avoir startDate, endDate
    for(let d of disabledDates){
      if (d >= range_of_date.startDate && d <= range_of_date.endDate){
        return false;
      }
    }
    return true;
  }

  const clearNameFromEmail = (email) => {
    const namePart = email.split("@")[0];
    return namePart.replace(/[^a-zA-Z]/g, '');
  }


  const handleReserve = async () => {
    const body = {
      startDate: range[0].startDate,
      endDate: range[0].endDate,
      nom: clearNameFromEmail(mail.split("@")[0]),
      email: mail,
      nb_personne: guests
    };
    console.log(body);
    if (!ValideBooking(range[0])){
      alert("Certaines dates dans votre sélection sont déjà réservées. Veuillez choisir d'autres dates.");
      return;
    }

    if (!mail || !mail.includes("@")){
      alert("Veuillez entrer un email valide pour la réservation.");
      return;
    }
    if (body.nb_personne < 1 || body.nb_personne > 12){
      alert("Le nombre de voyageurs doit être compris entre 1 et 12.");
      return;
    }
    if (body.startDate > body.endDate){
      alert("La date de départ doit être après la date d'arrivée.");
      return;
    }
    try{
      setLoading(true);
      const res = await fetch("http://localhost:8080/reserve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.success) {
        alert("Réservation réussie ! \nverifier votre mail pour la confirmation.Si vous ne voyez pas le mail, contactez le proprietaire.");
      } else {
        alert(`Erreur: ${data.message}`);
      }
    }catch(err){
      alert(`Erreur lors de la réservation: ${err.message}`);
    }finally{
      setLoading(false);
    }
    
  };


  const fetch_price = () => {
    fetch("http://localhost:8080/price_and_date")
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          throw new Error(data.message || "Erreur inconnue");
        });
      }
      return res.json();
    })
    .then((data) => {
        setAllPrices(data);
    }).catch((err)=> {
      console.log(err);
    })
  }

  const priceByNight = () => {
    const date = range[0].startDate;
    const key = formatDateKey(date);
    return allPrices[key] || "—";
  };
  const totalPrice = ()=>{
    const start = new Date(range[0].startDate);
    const end = new Date(range[0].endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const ecart = Math.round((end - start) / (1000*60*60*24)) + 1;

    let total = 0;
    for (let i = 1; i <= ecart; i++){
      const date = formatDateKey(addDays(range[0].startDate, i));  
      total += parseInt(allPrices[date]) || 0;
    }
    return total;
  }
   useEffect(() => {
    if (Object.keys(allPrices).length > 0 && range[0].startDate && range[0].endDate) {
      const total = totalPrice();
      setpriceTotal(total);
    }
  }, [range, allPrices]);
  
  const prettyDate = (d) => format(d, "dd/M/yyyy");

  return (
    <div className="w-full flex justify-center p-8">
      <div className="w-[90%] bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8 items-center border border-slate-100">

        {/* Left: Dates */}
        <div className="flex-1 w-full relative ">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Réservez votre séjour</h3>
              <p className="text-sm text-slate-500 mt-1">
                Sélectionnez vos dates et le nombre de voyageurs
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-6">
              <button
                onClick={() => setOpenCalendar((s) => !s)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-sm hover:bg-slate-50 active:scale-95 transition"
              >
                {openCalendar ? "Fermer le calendrier" : "Modifier les dates"}
              </button>
              {/* le mail */}
              <input
                name="mail_reservation"
                type="text"
                placeholder="Rentrez votre mail"
                onChange={(e)=> setMail(e.target.value)}
                required
                className="px-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
 
          </div>

          {/* Dates résumées */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <p className="text-xs text-slate-400">Arrivée(exlus)</p>
              <p className="text-base font-medium">{prettyDate(range[0].startDate)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Départ(inclus)</p>
              <p className="text-base font-medium">{prettyDate(range[0].endDate)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Prix par nuit </p>
              <p className="text-base font-semibold text-sky-600">{priceByNight()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Prix total</p>
                <p className="text-base font-semibold text-indigo-600">{priceTotal}€</p>
            </div>
          </div>

          {/* Calendar overlay */}
          {openCalendar && (
            <div className="absolute top-full left-0 mt-2 bg-white p-4 rounded-xl border border-slate-200 shadow-lg z-50 transition-all duration-300 ease-in-out">
              <DateRange
                onChange={(item) => setRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={range}
                months={2}
                direction="horizontal"
                minDate={new Date()}
                disabledDates={disabledDates}
                dayContentRenderer={(date)=>{
                  const day = date.getDate();
                  const month = date.getMonth() + 1; 
                  const year = date.getFullYear();
                  const key = `${day}/${month}/${year}`;
                  const prixParJour = allPrices[key] || "—";

                  return(
                    <div className="flex flex-col items-center justify-center h-full p-1">
                      <span className="text-sm font-medium block leading-tight">
                        {date.getDate()}
                      </span> 
                      <span className="text-[8px] text-gray-600 block leading-tight mt-1">
                        {prixParJour}
                      </span>
                    </div>
                  )
                }}
              />
            </div>
          )}
        </div>

        {/* Right: Guests & CTA */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div>
              <label className="text-xs text-slate-500">Voyageurs</label>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    className="h-8 w-8 rounded-full border flex items-center justify-center text-lg"
                  >
                    −
                  </button>
                  <div className="min-w-[48px] text-center font-medium text-lg">{guests}</div>
                  <button
                    onClick={() => setGuests((g) => Math.min(12, g + 1))}
                    className="h-8 w-8 rounded-full border flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>
                <div className="text-xs text-slate-400">max 12</div>
              </div>
            </div>

            <button
              onClick={handleReserve}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold shadow-md hover:scale-[1.01] transition-transform"
            >
              {!loading ? ( 
                  <span>Réserver</span>

              ): <span>⏳ Reservation en cours...</span>
              }
            </button>

            <p className="text-center text-xs text-slate-500">
              Confirmation instantanée selon disponibilité
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
