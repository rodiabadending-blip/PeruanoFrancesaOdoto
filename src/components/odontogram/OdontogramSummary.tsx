import React, { useState } from 'react';
import { OdontogramState, MinsaFindingType } from '../../types/dental';
import { TOOTH_NAMES, MINSA_FINDING_LABELS } from './toothDefinitions';
import {
  Trash2,
  Sparkles,
  Activity,
  FileEdit,
  Save,
  Check,
  X,
  Plus,
  HelpCircle,
  Tag,
  Stethoscope,
} from 'lucide-react';

interface OdontogramSummaryProps {
  odontogram: OdontogramState;
  onRemoveToothFinding: (toothNumber: number) => void;
  onGenerateDiagnosesFromOdontogram?: () => void;
  onUpdateToothNotes?: (toothNumber: number, notes: string) => void;
  onUpdateGeneralNotes?: (notes: string) => void;
}

export const OdontogramSummary: React.FC<OdontogramSummaryProps> = ({
  odontogram,
  onRemoveToothFinding,
  onGenerateDiagnosesFromOdontogram,
  onUpdateToothNotes,
  onUpdateGeneralNotes,
}) => {
  const teethWithFindings = Object.values(odontogram.teeth).filter(
    (t) => t.wholeToothFinding || Object.keys(t.surfaces).length > 0 || (t.notes && t.notes.trim().length > 0)
  );

  // Estado para edición inline de nota de pieza específica
  const [editingToothNumber, setEditingToothNumber] = useState<number | null>(null);
  const [tempToothNote, setTempToothNote] = useState<string>('');

  // Estado para el aparato de notas generales del odontograma
  const [generalNotesText, setGeneralNotesText] = useState<string>(odontogram.generalNotes || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Estado para agregar nota rápida a cualquier pieza desde el aparato
  const [selectedQuickTooth, setSelectedQuickTooth] = useState<number>(11);
  const [quickToothNote, setQuickToothNote] = useState<string>('');

  // Sincronizar generalNotes si cambia externamente
  React.useEffect(() => {
    setGeneralNotesText(odontogram.generalNotes || '');
  }, [odontogram.generalNotes]);

  const handleStartEditTooth = (toothNumber: number, currentNote?: string) => {
    setEditingToothNumber(toothNumber);
    setTempToothNote(currentNote || '');
  };

  const handleSaveToothNote = (toothNumber: number) => {
    if (onUpdateToothNotes) {
      onUpdateToothNotes(toothNumber, tempToothNote.trim());
    }
    setEditingToothNumber(null);
    setTempToothNote('');
  };

  const handleCancelEditTooth = () => {
    setEditingToothNumber(null);
    setTempToothNote('');
  };

  const handleSaveGeneralNotes = () => {
    if (onUpdateGeneralNotes) {
      onUpdateGeneralNotes(generalNotesText);
      setSaveSuccessMsg('¡Notas clínicas guardadas con éxito!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  const handleAddTemplateToGeneral = (snippet: string) => {
    const updated = generalNotesText.trim()
      ? `${generalNotesText.trim()} • ${snippet}`
      : snippet;
    setGeneralNotesText(updated);
    if (onUpdateGeneralNotes) {
      onUpdateGeneralNotes(updated);
      setSaveSuccessMsg('Nota clínica agregada');
      setTimeout(() => setSaveSuccessMsg(null), 2500);
    }
  };

  const handleAddQuickToothNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickToothNote.trim()) return;
    if (onUpdateToothNotes) {
      const existing = odontogram.teeth[selectedQuickTooth]?.notes || '';
      const finalNote = existing ? `${existing} | ${quickToothNote.trim()}` : quickToothNote.trim();
      onUpdateToothNotes(selectedQuickTooth, finalNote);
      setQuickToothNote('');
      setSaveSuccessMsg(`Nota agregada a pieza ${selectedQuickTooth}`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  // Plantillas frecuentes de notas clínicas olvidadas
  const CLINICAL_NOTE_TEMPLATES = [
    'Higiene bucal regular, placa blanda visible',
    'Gingivitis marginal generalizada / Sangrado al sondaje',
    'Sensibilidad dental térmica en sector posterior',
    'Facetas de desgaste por probable bruxismo céntrico',
    'Requiere radiografía periapical de control',
    'Presencia de cálculo dental supragingival anteroinferior',
    'Profilaxis y destartraje indicado antes de obturar',
    'Dolor moderado a la masticación en zona molar',
    'Mordida profunda / Relación esqueletal Clase II',
    'Retenedor de placa bacteriana por empaquetamiento alimentario',
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-4 space-y-5">
      {/* Encabezado e Índices Epidemiológicos */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-600" />
            Resumen Epidemiológico de Hallazgos Dentales
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cálculo automático de índices CPO-D (Adultos) y CEO-D (Dentición Temporal)
          </p>
        </div>

        {/* Cajas de Índices CPO-D */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500">Índice CPO-D:</span>
            <span className="text-xs font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded shadow-xs">
              {odontogram.cpoIndex?.totalCpo ?? 0}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              (C:{odontogram.cpoIndex?.cariados ?? 0} P:{odontogram.cpoIndex?.perdidos ?? 0} O:{odontogram.cpoIndex?.obturados ?? 0})
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-800">Índice CEO-D (Niños):</span>
            <span className="text-xs font-extrabold text-amber-900 bg-white px-2 py-0.5 rounded shadow-xs">
              {odontogram.cpoIndex?.ceoIndex ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Tabla detallada de hallazgos registrados */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <span>Piezas con Hallazgos Registrados</span>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
              {teethWithFindings.length}
            </span>
          </span>
          <span className="text-[11px] text-slate-400">
            Haz clic en <span className="font-semibold text-sky-700">Editar</span> para modificar o agregar notas de cada pieza
          </span>
        </div>

        {teethWithFindings.length === 0 ? (
          <div className="text-center py-6 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
            No se han registrado hallazgos patológicos ni tratamientos en el odontograma.
            <div className="mt-1 text-slate-500">
              Selecciona una herramienta (Rojo o Azul) y haz clic sobre las piezas dentarias.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase font-bold text-[10px]">
                  <th className="py-2 px-2.5">Pieza FDI</th>
                  <th className="py-2 px-2.5">Nombre Anatómico</th>
                  <th className="py-2 px-2.5">Hallazgo / Condición</th>
                  <th className="py-2 px-2.5">Superficies / Raíz</th>
                  <th className="py-2 px-2.5 min-w-[220px]">Notas Clínicas</th>
                  <th className="py-2 px-2.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teethWithFindings.map((tooth) => {
                  const info = TOOTH_NAMES[tooth.toothNumber];
                  const surfacesList = Object.entries(tooth.surfaces).map(
                    ([surf, finding]) => ({
                      surf,
                      finding: finding as MinsaFindingType,
                    })
                  );
                  const isEditingThis = editingToothNumber === tooth.toothNumber;

                  return (
                    <tr key={tooth.toothNumber} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-2.5 font-mono font-bold text-sky-700">
                        {tooth.toothNumber}
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-700 font-medium">
                        {info?.name || `Pieza ${tooth.toothNumber}`}
                        {tooth.isDeciduous && (
                          <span className="ml-1 text-[10px] text-amber-600 bg-amber-50 px-1 py-0.5 rounded">
                            Temporal
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-2.5">
                        {tooth.wholeToothFinding ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold text-[11px] ${
                              MINSA_FINDING_LABELS[tooth.wholeToothFinding]?.color === 'red'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            <span>{MINSA_FINDING_LABELS[tooth.wholeToothFinding]?.symbol}</span>
                            {MINSA_FINDING_LABELS[tooth.wholeToothFinding]?.label}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Por caras / superficie</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2.5">
                        <div className="flex flex-wrap gap-1">
                          {tooth.mobilityGrade ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white">
                              MOVILIDAD GRADO {tooth.mobilityGrade === 1 ? 'I' : tooth.mobilityGrade === 2 ? 'II' : 'III'}
                            </span>
                          ) : null}
                          {surfacesList.length > 0 ? (
                            surfacesList.map(({ surf, finding }) => {
                              const surfLabel =
                                surf === 'raiz'
                                  ? 'RAÍZ'
                                  : surf === 'vestibular'
                                  ? 'VEST'
                                  : surf === 'lingual'
                                  ? 'LING/PAL'
                                  : surf === 'mesial'
                                  ? 'MES'
                                  : surf === 'distal'
                                  ? 'DIST'
                                  : 'OCL/INC';

                              return (
                                <span
                                  key={surf}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    MINSA_FINDING_LABELS[finding]?.color === 'red'
                                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                                  }`}
                                >
                                  {surfLabel}: {MINSA_FINDING_LABELS[finding]?.label || finding}
                                </span>
                              );
                            })
                          ) : !tooth.mobilityGrade ? (
                            <span className="text-slate-400 text-[11px]">-</span>
                          ) : null}
                        </div>
                      </td>

                      {/* Celda interactiva de Notas Clínicas */}
                      <td className="py-2.5 px-2.5 text-slate-600 text-[11px]">
                        {isEditingThis ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={tempToothNote}
                              onChange={(e) => setTempToothNote(e.target.value)}
                              placeholder="Ej: Caries profunda, dolor a percusión..."
                              autoFocus
                              className="w-full text-xs px-2 py-1 bg-white border border-sky-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveToothNote(tooth.toothNumber);
                                if (e.key === 'Escape') handleCancelEditTooth();
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveToothNote(tooth.toothNumber)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition"
                              title="Guardar nota"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEditTooth}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded transition"
                              title="Cancelar"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between group">
                            <span className={tooth.notes ? 'text-slate-700 font-medium' : 'text-slate-400 italic'}>
                              {tooth.notes || 'Sin nota'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStartEditTooth(tooth.toothNumber, tooth.notes)}
                              className="opacity-70 group-hover:opacity-100 text-[10px] font-semibold text-sky-600 hover:text-sky-800 px-1.5 py-0.5 rounded hover:bg-sky-50 transition ml-2 inline-flex items-center gap-1"
                              title="Editar o agregar nota a esta pieza"
                            >
                              <FileEdit className="w-3 h-3" />
                              <span>{tooth.notes ? 'Editar' : '+ Nota'}</span>
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-2.5 px-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => onRemoveToothFinding(tooth.toothNumber)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                          title="Eliminar registro de esta pieza"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* APARATO PARA EDITAR NOTAS CLÍNICAS Y OBSERVACIONES QUE QUIZÁS OLVIDAMOS PONER */}
      <div className="bg-gradient-to-r from-sky-50/70 via-indigo-50/40 to-slate-50 border border-sky-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b border-sky-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-600 text-white rounded-lg shadow-xs">
              <FileEdit className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                Aparato de Notas Clínicas y Observaciones Odontológicas
                {saveSuccessMsg && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 animate-fadeIn">
                    <Check className="w-3 h-3" />
                    {saveSuccessMsg}
                  </span>
                )}
              </h4>
              <p className="text-[11px] text-slate-500">
                Registra o edita notas clínicas, sintomatología o detalles del examen bucal que se hayan olvidado consignar.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveGeneralNotes}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
          >
            <Save className="w-3.5 h-3.5" />
            Guardar Notas
          </button>
        </div>

        {/* Textarea de Notas Generales del Odontograma */}
        <div className="mt-3 space-y-2">
          <textarea
            value={generalNotesText}
            onChange={(e) => setGeneralNotesText(e.target.value)}
            rows={3}
            placeholder="Escribe aquí las observaciones clínicas globales del paciente: Ej. Higiene deficiente, sangrado papilar, piezas con sensibilidad térmica, requerimiento de estudios complementarios, anomalías de forma o posición no cartografiadas..."
            className="w-full text-xs p-2.5 bg-white border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 placeholder-slate-400"
          />

          {/* Plantillas clínicas rápidas para insertar con un clic */}
          <div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mb-1.5">
              <Tag className="w-3 h-3 text-sky-600" />
              <span>Plantillas de Notas Frecuentes (Haz clic para insertar):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CLINICAL_NOTE_TEMPLATES.map((tpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddTemplateToGeneral(tpl)}
                  className="text-[10px] font-medium px-2 py-1 bg-white hover:bg-sky-100 text-slate-700 hover:text-sky-800 border border-slate-200 rounded-lg transition shadow-2xs text-left"
                >
                  + {tpl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sub-herramienta: Asignar nota rápida a pieza dental individual */}
        <div className="mt-4 pt-3 border-t border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/70 p-2.5 rounded-xl border border-sky-100">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-3.5 h-3.5 text-sky-700" />
            <span className="text-[11px] font-bold text-slate-700">
              Vincular nota rápida a pieza dental específica:
            </span>
          </div>

          <form onSubmit={handleAddQuickToothNote} className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedQuickTooth}
              onChange={(e) => setSelectedQuickTooth(Number(e.target.value))}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono font-bold text-sky-700 focus:outline-none"
            >
              {/* Cuadrantes permanentes */}
              <optgroup label="Maxilar Sup. (18-11, 21-28)">
                {[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28].map((n) => (
                  <option key={n} value={n}>
                    Pieza {n} {TOOTH_NAMES[n]?.name ? `(${TOOTH_NAMES[n].name.slice(0, 16)})` : ''}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Mandíbula Inf. (48-41, 31-38)">
                {[48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38].map((n) => (
                  <option key={n} value={n}>
                    Pieza {n} {TOOTH_NAMES[n]?.name ? `(${TOOTH_NAMES[n].name.slice(0, 16)})` : ''}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Dentición Temporal (55-85)">
                {[55, 54, 53, 52, 51, 61, 62, 63, 64, 65, 85, 84, 83, 82, 81, 71, 72, 73, 74, 75].map((n) => (
                  <option key={n} value={n}>
                    Pieza {n} (Temporal)
                  </option>
                ))}
              </optgroup>
            </select>

            <input
              type="text"
              value={quickToothNote}
              onChange={(e) => setQuickToothNote(e.target.value)}
              placeholder="Nota clínica específica..."
              className="text-xs px-2.5 py-1 bg-white border border-slate-200 rounded-lg flex-1 sm:w-48 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />

            <button
              type="submit"
              disabled={!quickToothNote.trim()}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-sky-700 hover:bg-sky-800 disabled:opacity-50 text-white rounded-lg transition shrink-0"
            >
              <Plus className="w-3 h-3" />
              <span>Asignar</span>
            </button>
          </form>
        </div>
      </div>

      {/* Botón para sincronizar con diagnósticos */}
      {onGenerateDiagnosesFromOdontogram && teethWithFindings.length > 0 && (
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onGenerateDiagnosesFromOdontogram}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Sincronizar Hallazgos con Módulo de Diagnósticos CIE-10
          </button>
        </div>
      )}
    </div>
  );
};
