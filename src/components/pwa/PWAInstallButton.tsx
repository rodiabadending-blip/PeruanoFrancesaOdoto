import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        PWA Instalada
      </span>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 active:scale-95 shadow-sm transition-all"
        title="Instalar Peruano Francesa en tu dispositivo"
      >
        <Download className="w-3.5 h-3.5" />
        Instalar App
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-all"
        >
          <Smartphone className="w-3.5 h-3.5 text-sky-600" />
          Instalar en iPhone
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-sky-600" />
                  Instalar Peruano Francesa en iOS
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                Para usar Peruano Francesa a pantalla completa y sin conexión en iPhone/iPad:
              </p>
              <div className="mt-3 space-y-2.5 bg-sky-50/70 p-3.5 rounded-xl border border-sky-100 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px]">1</span>
                  <span>Toca el botón <strong>Compartir</strong> <span className="text-sky-700 font-bold">⎋</span> en la barra inferior de Safari.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px]">2</span>
                  <span>Baja y selecciona <strong>"Agregar a pantalla de inicio"</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px]">3</span>
                  <span>Toca <strong>Agregar</strong> arriba a la derecha.</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-sky-600 py-2.5 text-xs font-bold text-white hover:bg-sky-700 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
