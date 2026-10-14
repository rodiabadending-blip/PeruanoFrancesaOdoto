import React, { useRef, useState, useEffect } from 'react';
import { ClinicalEvolution, InformedConsent, PatientFiliation } from '../../types/dental';
import { FileSignature, Plus, Trash2, CheckCircle, RefreshCw, PenLine, Shield, Printer } from 'lucide-react';

interface EvolucionConsentimientoModuleProps {
  evolutions: ClinicalEvolution[];
  consent: InformedConsent;
  patientFiliation: PatientFiliation;
  onEvolutionsChange: (evolutions: ClinicalEvolution[]) => void;
  onConsentChange: (consent: InformedConsent) => void;
  onPrintPreview: () => void;
}

export const EvolucionConsentimientoModule: React.FC<EvolucionConsentimientoModuleProps> = ({
  evolutions,
  consent,
  patientFiliation,
  onEvolutionsChange,
  onConsentChange,
  onPrintPreview,
}) => {
  // Formulario para nueva evolución
  const [newTooth, setNewTooth] = useState('');
  const [newDiag, setNewDiag] = useState('');
  const [newProc, setNewProc] = useState('');
  const [newRx, setNewRx] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. Gersson Anthony Valdivia Medina');
  const [doctorCop, setDoctorCop] = useState('CCDP 62958');

  // Canvas para firma digital
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(Boolean(consent.signatureDataUrl));

  useEffect(() => {
    // Si ya existe firma guardada, dibujarla en el canvas
    if (consent.signatureDataUrl && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = consent.signatureDataUrl;
      }
    }
  }, [consent.signatureDataUrl]);

  // Manejo de dibujo en canvas de firma digital
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onConsentChange({
        ...consent,
        signatureDataUrl: dataUrl,
        signatureDate: new Date().toISOString().split('T')[0],
      });
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
      onConsentChange({
        ...consent,
        signatureDataUrl: undefined,
        signatureDate: undefined,
      });
    }
  };

  const handleAddEvolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProc.trim()) return;

    const now = new Date();
    const dateFormatted = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const newEvolution: ClinicalEvolution = {
      id: `evo_${Date.now()}`,
      date: dateFormatted,
      toothNumber: newTooth ? parseInt(newTooth) : undefined,
      diagnosis: newDiag.trim() || 'Evaluación de control',
      procedurePerformed: newProc.trim(),
      prescriptions: newRx.trim(),
      doctorName: doctorName.trim(),
      doctorCop: doctorCop.trim(),
      signed: true,
    };

    onEvolutionsChange([newEvolution, ...evolutions]);
    setNewTooth('');
    setNewDiag('');
    setNewProc('');
    setNewRx('');
  };

  const handleRemoveEvolution = (id: string) => {
    onEvolutionsChange(evolutions.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* 1. TABLA DE EVOLUCIÓN CLÍNICA CRONOLÓGICA */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-sky-600" />
              Evolución del Tratamiento y Hoja de Procedimientos
            </h2>
            <p className="text-xs text-slate-500">
              Registro clínico por cada cita de atención odontológica
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {evolutions.length} {evolutions.length === 1 ? 'Evolución registrada' : 'Evoluciones registradas'}
          </span>
        </div>

        {/* Formulario para registrar evolución */}
        <form onSubmit={handleAddEvolution} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-5">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-sky-600" />
            Registrar Nueva Sesión Clínica / Procedimiento
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Pieza FDI</label>
              <input
                type="number"
                value={newTooth}
                onChange={(e) => setNewTooth(e.target.value)}
                placeholder="ej: 46"
                className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Diagnóstico de la sesión</label>
              <input
                type="text"
                value={newDiag}
                onChange={(e) => setNewDiag(e.target.value)}
                placeholder="ej: K02.1 Caries dentinaria profunda"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Procedimiento Realizado Detallado *
              </label>
              <input
                type="text"
                value={newProc}
                onChange={(e) => setNewProc(e.target.value)}
                placeholder="ej: Anestesia local infiltrativa, remoción de caries, colocación de base cavitaria..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Prescripción Farmacológica / Indicaciones
              </label>
              <input
                type="text"
                value={newRx}
                onChange={(e) => setNewRx(e.target.value)}
                placeholder="ej: Ibuprofeno 400mg c/8h por 3 días condicional al dolor. Dieta blanda."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-600">Profesional Odontólogo</label>
                <button
                  type="button"
                  onClick={() => {
                    setDoctorName('Dr. Gersson Anthony Valdivia Medina');
                    setDoctorCop('CCDP 62958');
                  }}
                  className="text-[10px] text-sky-600 hover:text-sky-800 font-bold"
                  title="Cargar Odontólogo Tratante"
                >
                  Predeterminado
                </button>
              </div>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-3 flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">N° CCDP / COP</label>
                <input
                  type="text"
                  value={doctorCop}
                  onChange={(e) => setDoctorCop(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 h-8 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Registrar
              </button>
            </div>
          </div>
        </form>

        {/* Lista de Evoluciones */}
        <div className="space-y-3">
          {evolutions.length === 0 ? (
            <p className="p-4 text-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              No hay evoluciones clínicas registradas aún.
            </p>
          ) : (
            evolutions.map((evo) => (
              <div
                key={evo.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {evo.date}
                    </span>
                    {evo.toothNumber && (
                      <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                        Pieza {evo.toothNumber}
                      </span>
                    )}
                    <span className="text-slate-500 font-medium">{evo.diagnosis}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Firmado: {evo.doctorName} ({evo.doctorCop})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEvolution(evo.id)}
                      className="text-slate-300 hover:text-rose-600 transition p-1"
                      title="Eliminar evolución"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 text-xs text-slate-800 leading-relaxed font-sans">
                  <strong>Procedimiento:</strong> {evo.procedurePerformed}
                </div>

                {evo.prescriptions && (
                  <div className="mt-2 text-xs bg-amber-50/70 p-2.5 rounded-lg border border-amber-100 text-amber-950">
                    <strong className="text-amber-800">Receta / Indicaciones:</strong> {evo.prescriptions}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. CONSENTIMIENTO INFORMADO CON FIRMA DIGITAL */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Consentimiento Informado Odontológico y Firma Digital
              </h2>
              <p className="text-xs text-slate-500">
                Centro Odontológico Peruano Francesa • Dirección: Mz II lote N° 3 5ta etapa San Andres
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrintPreview}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              Imprimir Consentimiento
            </button>
          </div>
        </div>

        {/* Texto Legal del Consentimiento */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2.5 leading-relaxed">
          <div className="font-bold text-slate-900 text-sm">
            DECLARACIÓN DE CONSENTIMIENTO INFORMADO PARA TRATAMIENTO ODONTOLÓGICO
          </div>
          <p>
            Yo, <strong>{patientFiliation.firstName} {patientFiliation.lastName}</strong>, identificado(a) con{' '}
            <strong>{patientFiliation.docType} N° {patientFiliation.docNumber || 'S/D'}</strong>
            {patientFiliation.tutorRequired && patientFiliation.tutorName && (
              <span>
                {' '}o a través de mi apoderado legal <strong>{patientFiliation.tutorName}</strong> (DNI{' '}
                {patientFiliation.tutorDocNumber}) en calidad de {patientFiliation.tutorRelationship}
              </span>
            )}
            , declaro que el cirujano dentista tratante me ha explicado en lenguaje claro y comprensible el
            diagnóstico de mi estado bucal, los procedimientos previstos, los beneficios esperados, las
            alternativas de tratamiento y los riesgos inherentes.
          </p>
          <p>
            Asimismo, confirmo haber brindado información completa y fidedigna sobre mis antecedentes médicos,
            enfermedades sistémicas, alergias a medicamentos y tratamientos farmacológicos actuales.
          </p>
        </div>

        {/* Panel de Firma Digital */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <PenLine className="w-3.5 h-3.5 text-sky-600" />
                Lienzo de Firma Digital (Mouse o Pantalla Táctil)
              </span>
              <button
                type="button"
                onClick={clearSignature}
                className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Limpiar Firma
              </button>
            </label>

            <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-white overflow-hidden shadow-inner cursor-crosshair">
              <canvas
                ref={canvasRef}
                width={400}
                height={160}
                className="w-full h-40 touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-400 font-medium">
                  Firme aquí con el dedo o puntero del mouse
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-1">
              Firma digital válida para el registro clínico del consultorio odontológico.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estado de Conformidad del Paciente
              </label>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent.agreed}
                    onChange={(e) => onConsentChange({ ...consent, agreed: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Acepto voluntariamente el plan de tratamiento y las condiciones explicadas.
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Fecha de suscripción: {consent.signatureDate || new Date().toISOString().split('T')[0]}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-600">Cirujano Dentista</label>
                  <button
                    type="button"
                    onClick={() => onConsentChange({
                      ...consent,
                      doctorName: 'Dr. Gersson Anthony Valdivia Medina',
                      doctorCop: 'CCDP 62958',
                    })}
                    className="text-[10px] text-sky-600 hover:text-sky-800 font-bold"
                    title="Cargar Odontólogo Tratante"
                  >
                    Predeterminado
                  </button>
                </div>
                <input
                  type="text"
                  value={consent.doctorName || 'Dr. Gersson Anthony Valdivia Medina'}
                  onChange={(e) => onConsentChange({ ...consent, doctorName: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">N° de Colegiatura (CCDP / COP)</label>
                <input
                  type="text"
                  value={consent.doctorCop || 'CCDP 62958'}
                  onChange={(e) => onConsentChange({ ...consent, doctorCop: e.target.value })}
                  className="w-full text-xs font-mono px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {hasSignature && consent.agreed && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Consentimiento debidamente firmado y validado para la historia clínica actual.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
