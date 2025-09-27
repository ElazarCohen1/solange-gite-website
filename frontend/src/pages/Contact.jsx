import React from "react";
import emailjs from "emailjs-com";
import { Mail, User, MessageSquare } from "lucide-react";

function Contact() {
  function sendEmail(e) {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_b18m2kl", // ⚠️ ton service ID
        "template_v7qcr4g", // ⚠️ ton template ID
        e.target,
        "WmlYF4YJCU6yWSCGT" // ⚠️ ton public key
      )
      .then(
        () => {
          alert("✅ Message envoyé avec succès ! Merci de nous avoir contactés.");
        },
        (error) => {
          alert("❌ Erreur lors de l’envoi : " + error.text);
        }
      );

    e.target.reset();
  }

  return (
    <section id="contact_page" className="w-full px-6 py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Contactez-nous
        </h1>
        <p className="text-gray-600">
          Une question sur la villa, la réservation ou les activités autour ?  
          Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
        </p>
      </div>

      {/* Formulaire */}
      <form
        id="formulaire_contact"
        onSubmit={sendEmail}
        className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-6 border"
      >
        {/* Nom */}
        <div className="flex flex-col text-left">
          <label htmlFor="name" className="mb-2 font-medium text-gray-700">
            Nom
          </label>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
            <User className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Votre nom"
              required
              className="w-full outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col text-left">
          <label htmlFor="email" className="mb-2 font-medium text-gray-700">
            Email
          </label>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
            <Mail className="w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Votre email"
              required
              className="w-full outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col text-left">
          <label htmlFor="message" className="mb-2 font-medium text-gray-700">
            Message
          </label>
          <div className="flex items-start gap-2 border rounded-lg px-3 py-2">
            <MessageSquare className="w-5 h-5 text-gray-400 mt-1" />
            <textarea
              id="message"
              name="message"
              placeholder="Votre message..."
              rows="5"
              required
              className="w-full outline-none bg-transparent resize-none"
            ></textarea>
          </div>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          id="submit_btn"
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Envoyer le message
        </button>
      </form>
    </section>
  );
}

export default Contact;
