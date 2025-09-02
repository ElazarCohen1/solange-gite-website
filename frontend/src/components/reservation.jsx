import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { addDays, format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function ReservationSearchBar({ onSearch = () => {} }) {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 2),
      key: "selection",
    },
  ]);
  const [guests, setGuests] = useState(2);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [disabledDates, setDisabledDates] = useState([]);
  const [allBookings, setAllBookings] = useState([]);

  // Fetch toutes les réservations depuis le backend
  useEffect(() => {
    fetch("http://localhost:8080/bookings")
      .then((res) => res.json())
      .then((data) => {
        setAllBookings(data);

        // transformer en tableau de dates désactivées
        const dates = data.bookings.flatMap(({ start, end }) => {
          const arr = [];
          let d = new Date(start);
          const endDate = new Date(end);
          while (d <= endDate) {
            arr.push(new Date(d));
            d.setDate(d.getDate() + 1);
          }
          return arr;
        });

        setDisabledDates(dates);
      })
      .catch((err) => console.error("Erreur fetch bookings:", err));
  }, []);

  const handleSearch = () => {
    const booking = {
      start: range[0].startDate.toISOString().split("T")[0],
      end: range[0].endDate.toISOString().split("T")[0],
      guests,
    };
    fetch("http://localhost:8080/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Réservation ajoutée:", data);

        // mettre à jour les disabledDates automatiquement
        const newDates = [];
        let d = new Date(booking.start);
        const endDate = new Date(booking.end);
        while (d <= endDate) {
          newDates.push(new Date(d));
          d.setDate(d.getDate() + 1);
        }
        setDisabledDates((prev) => [...prev, ...newDates]);
      })
      .catch((err) => {
        console.error("❌ Erreur lors de l'ajout de la réservation:", err, booking);
      });
  };

  const prettyDate = (d) => format(d, "dd MMM yyyy");

  return (
    <div className="w-full flex justify-center p-8">
      <div className="w-[90%] bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8 items-center border border-slate-100">

        {/* Left: Dates */}
        <div className="flex-1 w-full relative">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Réservez votre séjour</h3>
              <p className="text-sm text-slate-500 mt-1">
                Sélectionnez vos dates et le nombre de voyageurs
              </p>
            </div>

            <button
              onClick={() => setOpenCalendar((s) => !s)}
              className="ml-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-sm hover:bg-slate-50 active:scale-95 transition"
            >
              {openCalendar ? "Fermer le calendrier" : "Modifier les dates"}
            </button>
          </div>

          {/* Dates résumées */}
          <div className="mt-4 flex gap-10">
            <div>
              <p className="text-xs text-slate-400">Arrivée</p>
              <p className="text-base font-medium">{prettyDate(range[0].startDate)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Départ</p>
              <p className="text-base font-medium">{prettyDate(range[0].endDate)}</p>
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
              onClick={handleSearch}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold shadow-md hover:scale-[1.01] transition-transform"
            >
              Rechercher
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
