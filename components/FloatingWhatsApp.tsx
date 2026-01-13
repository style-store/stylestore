
import React from 'react';

interface FloatingWhatsAppProps {
  phoneNumber: string;
}

const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ phoneNumber }) => {
  const message = encodeURIComponent("Hola, me gustaría más información sobre sus productos.");
  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Contactar por WhatsApp"
    >
      <div className="absolute right-full mr-3 bottom-1 bg-white border border-slate-100 px-4 py-2 rounded-xl shadow-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
        ¿Tienes dudas? ¡Escríbenos!
      </div>
      <div className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center">
        <svg 
          className="w-8 h-8 fill-current" 
          viewBox="0 0 24 24"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.436 1.096 3.39l-.721 2.632 2.705-.71c.907.545 1.97.863 3.102.863 3.181 0 5.767-2.586 5.767-5.767 0-3.181-2.586-5.767-5.767-5.767zm3.344 8.205c-.145.405-.742.742-1.026.786-.277.045-.635.076-1.056-.058-.277-.089-.636-.217-1.124-.419-2.046-.842-3.376-2.924-3.479-3.058-.102-.135-.831-1.104-.831-2.106 0-1.002.524-1.493.712-1.693.187-.2.405-.251.542-.251.135 0 .271.001.39.006.121.005.283-.046.444.339.163.39.56 1.364.608 1.46.048.096.08.208.016.335-.064.128-.12.208-.24.347-.12.139-.253.311-.36.417-.12.12-.246.251-.106.49.141.24.623 1.026 1.341 1.664.923.821 1.701 1.074 1.94 1.194.24.12.38.1.52-.064.14-.163.608-.71.77-.95.163-.24.323-.203.542-.121.22.083 1.402.661 1.643.781.241.121.401.18.459.277.059.097.059.564-.086.969z"/>
        </svg>
      </div>
    </a>
  );
};

export default FloatingWhatsApp;
