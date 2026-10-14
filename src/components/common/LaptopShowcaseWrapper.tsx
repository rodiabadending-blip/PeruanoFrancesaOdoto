import React, { useState } from 'react';
import {
  Laptop,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Eye,
  Info,
} from 'lucide-react';

interface LaptopShowcaseWrapperProps {
  children: React.ReactNode;
  isMockupActive: boolean;
  onToggleMockup: () => void;
}

export const LaptopShowcaseWrapper: React.FC<LaptopShowcaseWrapperProps> = ({
  children,
  isMockupActive,
  onToggleMockup,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(0.92);

  if (!isMockupActive) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-[#0B192C] text-slate-100 flex flex-col items-center justify-start overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Fondo ambiental difuminado de consultorio dental moderno con iluminación cálida y limpia */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        {/* Luces cálidas difuminadas y siluetas estéticas de consultorio médico */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl" />
        
        {/* Rejilla de perspectiva arquitectónica muy sutil que simula la mesa del consultorio */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 60%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* Barra de Controles Flotante Superior para el Usuario */}
      <div className="sticky top-3 z-50 flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-2xl text-xs mt-3">
        <div className="flex items-center gap-2 pr-3 border-r border-slate-700/80">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white tracking-wide">ValMed</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">• Consultorio Dental Odontológico</span>
        </div>

        {/* Controles de Escala / Zoom de la pantalla */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 px-2 py-1 rounded-xl border border-slate-700/60">
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.max(0.75, Number((prev - 0.05).toFixed(2))))}
            className="p-1 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition"
            title="Reducir tamaño"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono font-bold text-slate-200 px-1">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.min(1.05, Number((prev + 0.05).toFixed(2))))}
            className="p-1 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition"
            title="Aumentar tamaño"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Botón para volver a pantalla completa normal */}
        <button
          type="button"
          onClick={onToggleMockup}
          className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-xs transition"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Pantalla Completa</span>
        </button>
      </div>

      {/* Contenedor Mockup de la Laptop Moderna fotografiada de frente con ligero ángulo natural */}
      <div className="w-full max-w-[1440px] px-4 sm:px-8 py-8 flex flex-col items-center relative z-10">
        
        {/* Cuerpo Superior / Pantalla de la Laptop */}
        <div
          className="relative transition-transform duration-300 origin-top shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
          style={{
            transform: `scale(${zoomLevel})`,
            width: '100%',
            maxWidth: '1280px',
          }}
        >
          {/* Tapa de Aluminio de Laptop de Gama Alta (Borde exterior plateado y bisel fino) */}
          <div className="relative rounded-[24px] bg-[#1a1e24] p-[14px] pb-[16px] border border-slate-600/70 shadow-2xl ring-1 ring-white/10">
            
            {/* Bisel superior con Cámara Web y Micrófono */}
            <div className="flex items-center justify-center pb-2.5 pt-0.5">
              <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/40">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700 ring-1 ring-slate-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-900/60" />
                </div>
                <div className="w-1 h-1 rounded-full bg-emerald-500/80" />
              </div>
            </div>

            {/* Pantalla Retina / Contenido de la Aplicación ValMed */}
            <div className="relative rounded-[14px] overflow-hidden bg-[#F8FAFC] shadow-inner border border-slate-800 h-[760px] overflow-y-auto no-scrollbar">
              {/* Reflejo de cristal sutil en la esquina superior izquierda */}
              <div
                className="pointer-events-none absolute inset-0 z-40 opacity-15"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 30%, transparent 60%)',
                }}
              />
              {/* Aplicación Real e Interactiva */}
              {children}
            </div>

            {/* Borde inferior del bisel con logotipo sutil grabado */}
            <div className="pt-2 flex justify-center items-center">
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-semibold opacity-70">
                ValMed Medical Display
              </span>
            </div>
          </div>

          {/* Base / Teclado de la Laptop en ligero ángulo natural */}
          <div className="relative -mt-1 mx-auto w-[104%] h-7 bg-gradient-to-b from-[#2a2e36] via-[#1e222a] to-[#12151c] rounded-b-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.8)] border-t border-slate-600/50 flex items-center justify-center">
            {/* Ranura para abrir la laptop */}
            <div className="w-24 h-1.5 rounded-full bg-slate-700/80 border-t border-slate-800" />
          </div>

          {/* Sombra de contacto suave sobre el escritorio médico */}
          <div className="w-[102%] mx-auto h-8 bg-black/60 blur-xl -mt-3 rounded-full pointer-events-none" />
        </div>

        {/* Nota al pie sutil */}
        <div className="text-center text-xs text-slate-400 mt-6 max-w-lg">
          <p>
            Vista previa en pantalla de laptop de consultorio odontológico. Puedes alternar en cualquier momento a
            <button
              onClick={onToggleMockup}
              className="text-blue-400 font-semibold underline underline-offset-2 ml-1 hover:text-blue-300"
            >
              Pantalla Completa
            </button>.
          </p>
        </div>

      </div>
    </div>
  );
};
