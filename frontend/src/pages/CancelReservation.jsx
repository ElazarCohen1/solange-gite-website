import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function CancelReservation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [canceled, setCanceled] = useState(null);

  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const email = searchParams.get("email");
  const formatDateForEmail = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://solange-gite-website.vercel.app/cancel_reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: start, endDate: end, email }),
      });

      const data = await res.json();
      if (data.success) {
        console.log("Réservation annulée avec succès.");
        setCanceled(true);
      } else {
        setCanceled(false);
      }
    } catch (err) {
      setCanceled(false);
    } finally {
      setLoading(false);
    }
  };

  if (!start || !end || !email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-bold text-red-600">
          ❌ Lien invalide ou incomplet
        </h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {!canceled ? (
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Annuler ma réservation</h2>
          <p className="mb-2">📅 Du <b>{formatDateForEmail(start)}</b> au <b>{formatDateForEmail(end)}</b></p>
          <p className="mb-6">👤 Réservation faite avec : <b>{email}</b></p>

          {!loading ? (
            <>
              <p className="mb-6 text-gray-600">
                Êtes-vous sûr de vouloir annuler cette réservation ?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleCancel}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Oui, annuler
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Non, revenir
                </button>
              </div>
            </>
          ) : (
            <p className="text-blue-600">⏳ Annulation en cours...</p>
          )}
        </div>
      ) : canceled ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-md text-center">
          ✅ Votre réservation du <b>{formatDateForEmail(start)}</b> au <b>{formatDateForEmail(end)}</b> a bien été annulée.
        </div>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center">
          ❌ Une erreur est survenue lors de l'annulation.
        </div>
      )}
    </div>
  );
}
