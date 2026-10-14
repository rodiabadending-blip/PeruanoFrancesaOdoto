import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'full' | 'icon-only';
  textColor?: string;
}

export const PeruanoFrancesaLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'full',
  textColor = 'text-slate-900',
}) => {
  // Dimensiones del isotipo según tamaño
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Isotipo Escudo Emblema Peruano Francesa */}
      <svg
        viewBox="0 0 160 160"
        className={`${iconDimensions} shrink-0 drop-shadow-xs`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sombras suaves para los elementos */}
          <filter id="pf-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0f2b48" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* 1. LAURELES SUPERIORES (Verde Oliva / Salud y Excelencia) */}
        <g stroke="#6b7c3d" strokeWidth="1.6" fill="#7a8c48" strokeLinecap="round" strokeLinejoin="round">
          {/* Ramo Izquierdo */}
          <path d="M 72 24 C 62 26 50 36 46 50" fill="none" />
          <ellipse cx="71" cy="22" rx="4.5" ry="2.2" transform="rotate(-30 71 22)" />
          <ellipse cx="61" cy="27" rx="4.5" ry="2.2" transform="rotate(-45 61 27)" />
          <ellipse cx="53" cy="35" rx="4.5" ry="2.2" transform="rotate(-65 53 35)" />
          <ellipse cx="47" cy="46" rx="4.5" ry="2.2" transform="rotate(-80 47 46)" />

          {/* Ramo Derecho */}
          <path d="M 88 24 C 98 26 110 36 114 50" fill="none" />
          <ellipse cx="89" cy="22" rx="4.5" ry="2.2" transform="rotate(30 89 22)" />
          <ellipse cx="99" cy="27" rx="4.5" ry="2.2" transform="rotate(45 99 27)" />
          <ellipse cx="107" cy="35" rx="4.5" ry="2.2" transform="rotate(65 107 35)" />
          <ellipse cx="113" cy="46" rx="4.5" ry="2.2" transform="rotate(80 113 46)" />
        </g>

        {/* 2. CINTAS / BANDERAS LATERALES EN ARCO CIRCULAR */}
        {/* Bandera del Perú (Izquierda: Rojo - Blanco con Escudo - Rojo) */}
        <g transform="translate(0, 0)">
          {/* Franja exterior Roja */}
          <path
            d="M 44 48 C 30 62 28 88 38 106 C 41 98 44 92 48 86 C 42 74 41 60 44 48 Z"
            fill="#c8102e"
          />
          {/* Franja central Blanca */}
          <path
            d="M 47 52 C 37 66 37 84 46 96 C 48 90 51 84 54 78 C 50 70 48 60 47 52 Z"
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="0.5"
          />
          {/* Franja interior Roja */}
          <path
            d="M 50 56 C 43 68 45 80 52 88 C 54 84 57 80 60 76 C 56 70 53 62 50 56 Z"
            fill="#c8102e"
          />
          {/* Escudo Peruano estilizado en franja blanca */}
          <circle cx="41" cy="76" r="3.2" fill="#eab308" stroke="#c8102e" strokeWidth="0.8" />
        </g>

        {/* Bandera de Francia (Derecha: Azul Marino - Blanco - Rojo) */}
        <g transform="translate(0, 0)">
          {/* Franja exterior Azul Francesa */}
          <path
            d="M 116 48 C 130 62 132 88 122 106 C 119 98 116 92 112 86 C 118 74 119 60 116 48 Z"
            fill="#002654"
          />
          {/* Franja central Blanca */}
          <path
            d="M 113 52 C 123 66 123 84 114 96 C 112 90 109 84 106 78 C 110 70 112 60 113 52 Z"
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="0.5"
          />
          {/* Franja interior Roja Francesa */}
          <path
            d="M 110 56 C 117 68 115 80 108 88 C 106 84 103 80 100 76 C 104 70 107 62 110 56 Z"
            fill="#ed2939"
          />
        </g>

        {/* 3. SILUETA CENTRAL DE DIENTE MOLAR (Trazos fluidos Azul Marino y Oro) */}
        <g filter="url(#pf-shadow)">
          {/* Corona y silueta superior (Azul Marino Profundo) */}
          <path
            d="M 58 48 C 66 38 74 44 80 47 C 86 44 94 38 102 48 C 108 55 106 70 106 82 C 106 94 98 108 92 118 C 90 108 86 98 84 94 C 82 98 78 108 76 118 C 70 106 62 94 62 82 C 62 70 54 56 58 48 Z"
            fill="#ffffff"
            stroke="#112948"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />

          {/* Línea decorativa curva de corona dental */}
          <path
            d="M 64 52 C 72 44 76 48 80 50 C 84 48 88 44 96 52"
            fill="none"
            stroke="#1d3f6a"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Cúspide / Raíz izquierda en Dorado */}
          <path
            d="M 62 76 C 62 90 68 108 74 122 C 77 121 78 114 77 106 C 73 96 68 86 67 76 Z"
            fill="#b8832a"
          />

          {/* Cúspide / Raíz derecha en Azul */}
          <path
            d="M 98 76 C 98 90 92 108 86 122 C 83 121 82 114 83 106 C 87 96 92 86 93 76 Z"
            fill="#112948"
          />
        </g>

        {/* 4. ELEMENTOS INTERNOS DEL DIENTE: VICUÑA + FRISO DE CHAN CHAN (PERÚ / TRUJILLO) */}
        <g transform="translate(62, 56)">
          {/* Silueta de la Vicuña Andina en Dorado */}
          <path
            d="M 12 6 C 13 4 14 2 15 2 C 16 2 17 4 17 7 C 17 10 16 13 16 16 C 18 17 21 17 22 20 C 23 23 22 26 21 28 L 21 34 L 19 34 L 19 28 L 15 28 L 14 34 L 12 34 L 13 25 C 11 23 11 20 12 17 L 14 14 C 14 11 13 8 12 6 Z"
            fill="#b8832a"
          />
          {/* Orejitas de vicuña */}
          <path d="M 15 2 L 14 0 M 16 2 L 17 0" stroke="#b8832a" strokeWidth="1.2" strokeLinecap="round" />

          {/* Friso precolombino escalonado (Muro de Chan Chan - Trujillo) */}
          <g stroke="#b8832a" strokeWidth="1.5" fill="none" strokeLinecap="square">
            <path d="M 10 32 L 14 32 L 14 28 L 18 28 L 18 24 L 22 24" />
            <path d="M 11 36 L 23 36" />
          </g>
        </g>

        {/* 5. ELEMENTO INTERNO DERECHO: TORRE EIFFEL (FRANCIA) */}
        <g transform="translate(85, 52)">
          {/* Espiga y cúpula superior */}
          <line x1="12" y1="2" x2="12" y2="8" stroke="#112948" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="12" cy="8" r="1.2" fill="#112948" />

          {/* Torre y plataformas */}
          <path
            d="M 11 8 L 10 24 L 14 24 L 13 8 Z"
            fill="#112948"
          />
          {/* Primera plataforma */}
          <rect x="8.5" y="24" width="7" height="1.8" fill="#112948" rx="0.5" />

          {/* Tramo intermedio con celosía */}
          <path
            d="M 9.5 26 L 7 42 L 17 42 L 14.5 26 Z"
            fill="none"
            stroke="#112948"
            strokeWidth="1.6"
          />
          {/* Segunda plataforma */}
          <rect x="6" y="42" width="12" height="2" fill="#112948" rx="0.5" />

          {/* Patas de la base y gran arco inferior */}
          <path
            d="M 6.5 44 L 4 60 L 7.5 60 L 9 52 C 9 49 15 49 15 52 L 16.5 60 L 20 60 L 17.5 44 Z"
            fill="#112948"
          />
          {/* Arco inferior */}
          <path
            d="M 7.5 56 C 9 52 15 52 16.5 56"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
        </g>
      </svg>

      {/* TEXTO DE MARCA OFICIAL: PERUANO FRANCESA - CENTRO ODONTOLÓGICO & VALMED */}
      {showText && variant === 'full' && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-2">
            <span
              className={`font-serif tracking-wider font-black uppercase leading-none ${
                size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-[15px]'
              } text-[#0f2b48]`}
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '0.03em' }}
            >
              Peruano Francesa
            </span>
            <span className="text-[9px] font-black tracking-widest uppercase bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-1.5 py-0.5 rounded-md shadow-2xs">
              ValMed
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="text-[10px] font-bold tracking-wider uppercase text-slate-600 leading-tight"
              style={{ letterSpacing: '0.09em' }}
            >
              Centro Odontológico
            </span>
            <span className="text-[9px] text-slate-400 font-medium hidden sm:inline">• Trujillo, Perú</span>
          </div>
        </div>
      )}
    </div>
  );
};
