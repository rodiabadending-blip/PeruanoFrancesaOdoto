import React, { useState } from 'react';
import { Cie10Diagnosis, TreatmentPlanItem, TreatmentPhase } from '../../types/dental';
import { CIE10_ODONTOLOGY, Cie10CatalogItem } from '../../data/cie10';
import { Search, Plus, Trash2, CheckCircle2, Clock, AlertCircle, FileCheck, DollarSign } from 'lucide-react';

interface DiagnosticoPlanModuleProps {
  diagnoses: Cie10Diagnosis[];
  treatmentPlan: TreatmentPlanItem[];
  onDiagnosesChange: (diagnoses: Cie10Diagnosis[]) => void;
  onTreatmentPlanChange: (plan: TreatmentPlanItem[]) => void;
}

const PHASE_LABELS: Record<TreatmentPhase, { title: string; color: string; desc: string }> = {
  fase_1_sistematica: {
    title: 'Fase I: Sistemática',
    color: 'border-rose-300 bg-rose-50/50 text-rose-900',
    desc: 'Urgencias, interconsultas médicas, protocolo de alergias y antibioticoterapia',
  },
  fase_2_higienica: {
    title: 'Fase II: Higiénica / Estomatológica',
    color: 'border-emerald-300 bg-emerald-50/50 text-emerald-900',
    desc: 'Profilaxis, destartraje supra/subgingival, fisioterapia oral e IHO',
  },
  fase_3_correctiva: {
    title: 'Fase III: Correctiva / Rehabilitadora',
    color: 'border-sky-300 bg-sky-50/50 text-sky-900',
    desc: 'Operatoria con resina, endodoncia, periodoncia, prótesis, cirugía y coronas',
  },
  fase_4_mantenimiento: {
    title: 'Fase IV: Mantenimiento y Control',
    color: 'border-purple-300 bg-purple-50/50 text-purple-900',
    desc: 'Controles semestrales, fluorización tópica y reevaluación clínica',
  },
};

export const DiagnosticoPlanModule: React.FC<DiagnosticoPlanModuleProps> = ({
  diagnoses,
  treatmentPlan,
  onDiagnosesChange,
  onTreatmentPlanChange,
}) => {
  // Estado para el buscador CIE-10
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedToothForDiag, setSelectedToothForDiag] = useState<string>('');
  const [diagType, setDiagType] = useState<'Presuntivo' | 'Definitivo'>('Definitivo');

  // Estado para nuevo procedimiento en el plan
  const [newPhase, setNewPhase] = useState<TreatmentPhase>('fase_3_correctiva');
  const [newProcedure, setNewProcedure] = useState('');
  const [newToothNumber, setNewToothNumber] = useState('');
  const [newCost, setNewCost] = useState('');

  // Filtrado reactivo del catálogo CIE-10
  const filteredCie10 = searchTerm.trim()
    ? CIE10_ODONTOLOGY.filter(
        (item) =>
          item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleAddDiagnosis = (item: Cie10CatalogItem) => {
    const toothNum = selectedToothForDiag ? parseInt(selectedToothForDiag) : undefined;
    const newDiag: Cie10Diagnosis = {
      id: `diag_${Date.now()}`,
      code: item.code,
      description: `${item.name}${toothNum ? ` en pieza ${toothNum}` : ''}`,
      toothNumber: toothNum,
      type: diagType,
      date: new Date().toISOString().split('T')[0],
    };

    onDiagnosesChange([...diagnoses, newDiag]);
    setSearchTerm('');
    setSelectedToothForDiag('');
  };

  const handleRemoveDiagnosis = (id: string) => {
    onDiagnosesChange(diagnoses.filter((d) => d.id !== id));
  };

  const handleAddTreatmentItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProcedure.trim()) return;

    const newItem: TreatmentPlanItem = {
      id: `tp_${Date.now()}`,
      phase: newPhase,
      procedure: newProcedure.trim(),
      toothNumber: newToothNumber ? parseInt(newToothNumber) : undefined,
      cost: parseFloat(newCost) || 0,
      status: 'Pendiente',
    };

    onTreatmentPlanChange([...treatmentPlan, newItem]);
    setNewProcedure('');
    setNewToothNumber('');
    setNewCost('');
  };

  const handleToggleStatus = (id: string) => {
    onTreatmentPlanChange(
      treatmentPlan.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.status === 'Pendiente'
              ? 'En Proceso'
              : item.status === 'En Proceso'
              ? 'Completado'
              : 'Pendiente';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleRemoveTreatmentItem = (id: string) => {
    onTreatmentPlanChange(treatmentPlan.filter((t) => t.id !== id));
  };

  // Cálculo de totales
  const totalBudget = treatmentPlan.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const completedBudget = treatmentPlan
    .filter((t) => t.status === 'Completado')
    .reduce((acc, curr) => acc + (curr.cost || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. MÓDULO DE DIAGNÓSTICOS CIE-10 */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-sky-600" />
              Diagnósticos Odontológicos (Código CIE-10)
            </h2>
            <p className="text-xs text-slate-500">
              Clasificación Internacional de Enfermedades aplicada a estomatología
            </p>
          </div>
          <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
            {diagnoses.length} {diagnoses.length === 1 ? 'Diagnóstico' : 'Diagnósticos'} registrados
          </span>
        </div>

        {/* Buscador reactivo CIE-10 */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Buscar código o término clínico en CIE-10
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ej: K02.1, Caries, Pulpitis, Gingivitis, Fractura..."
                  className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pieza dental (opcional)
              </label>
              <input
                type="number"
                value={selectedToothForDiag}
                onChange={(e) => setSelectedToothForDiag(e.target.value)}
                placeholder="FDI: 46, 24, etc."
                className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tipo de Diagnóstico
              </label>
              <select
                value={diagType}
                onChange={(e) => setDiagType(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              >
                <option value="Definitivo">Definitivo (D)</option>
                <option value="Presuntivo">Presuntivo (P)</option>
              </select>
            </div>
          </div>

          {/* Resultados de búsqueda CIE-10 */}
          {searchTerm.trim().length > 0 && (
            <div className="mt-3 bg-white rounded-xl border border-slate-200 shadow-lg p-2 max-h-56 overflow-y-auto">
              <div className="text-[11px] font-bold text-slate-400 uppercase px-2 py-1">
                Resultados coincidentes ({filteredCie10.length})
              </div>
              {filteredCie10.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400">
                  No se encontraron códigos CIE-10 para "{searchTerm}".
                </div>
              ) : (
                filteredCie10.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleAddDiagnosis(item)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-sky-50 text-left transition group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                        {item.code}
                      </span>
                      <span className="text-xs text-slate-700 font-medium group-hover:text-sky-900">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Accesos rápidos a códigos frecuentes */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Frecuentes:</span>
            {[
              { code: 'K02.1', label: 'Caries dentina' },
              { code: 'K04.0', label: 'Pulpitis reversible' },
              { code: 'K05.1', label: 'Gingivitis crónica' },
              { code: 'S02.5', label: 'Fractura dental' },
              { code: 'K08.1', label: 'Pérdida de piezas' },
            ].map((fav) => (
              <button
                key={fav.code}
                type="button"
                onClick={() => {
                  const match = CIE10_ODONTOLOGY.find((c) => c.code === fav.code);
                  if (match) handleAddDiagnosis(match);
                }}
                className="text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-100 px-2 py-1 rounded-md border border-slate-200 transition"
              >
                <strong className="text-sky-700 font-mono">{fav.code}</strong> {fav.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de diagnósticos registrados */}
        {diagnoses.length === 0 ? (
          <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
            No se han registrado diagnósticos clínicos para este paciente.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px]">
                  <th className="py-2 px-2">CIE-10</th>
                  <th className="py-2 px-2">Descripción Diagnóstica</th>
                  <th className="py-2 px-2">Pieza</th>
                  <th className="py-2 px-2">Tipo</th>
                  <th className="py-2 px-2">Fecha</th>
                  <th className="py-2 px-2 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {diagnoses.map((diag) => (
                  <tr key={diag.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-2 font-mono font-bold text-sky-700">
                      {diag.code}
                    </td>
                    <td className="py-2.5 px-2 text-slate-800 font-medium">
                      {diag.description}
                    </td>
                    <td className="py-2.5 px-2 font-mono font-semibold text-slate-600">
                      {diag.toothNumber || '-'}
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          diag.type === 'Definitivo'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {diag.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-slate-400 font-mono text-[11px]">
                      {diag.date}
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveDiagnosis(diag.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                        title="Eliminar diagnóstico"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. MÓDULO DE PLAN DE TRATAMIENTO POR FASES MINSA */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Plan de Tratamiento Estomatológico por Fases
            </h2>
            <p className="text-xs text-slate-500">
              Secuencia terapéutica estandarizada: Sistemática, Higiénica, Correctiva y Mantenimiento
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Presupuesto Total:</span>
              <span className="text-base font-extrabold text-slate-900 font-mono">
                S/. {totalBudget.toFixed(2)}
              </span>
            </div>
            <div className="text-right border-l pl-3 border-slate-200">
              <span className="text-[11px] text-emerald-600 block font-medium">Ejecutado:</span>
              <span className="text-base font-extrabold text-emerald-700 font-mono">
                S/. {completedBudget.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Formulario para agregar procedimiento al plan */}
        <form onSubmit={handleAddTreatmentItem} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-5">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-sky-600" />
            Agregar Procedimiento al Plan de Tratamiento
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Fase de Tratamiento
              </label>
              <select
                value={newPhase}
                onChange={(e) => setNewPhase(e.target.value as TreatmentPhase)}
                className="w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
              >
                <option value="fase_1_sistematica">Fase I: Sistemática</option>
                <option value="fase_2_higienica">Fase II: Higiénica</option>
                <option value="fase_3_correctiva">Fase III: Correctiva</option>
                <option value="fase_4_mantenimiento">Fase IV: Mantenimiento</option>
              </select>
            </div>

            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Descripción del Procedimiento *
              </label>
              <input
                type="text"
                value={newProcedure}
                onChange={(e) => setNewProcedure(e.target.value)}
                placeholder="ej: Restauración con resina compuesta fotopolimerizable en cara O..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Pieza FDI
              </label>
              <input
                type="number"
                value={newToothNumber}
                onChange={(e) => setNewToothNumber(e.target.value)}
                placeholder="ej: 46"
                className="w-full text-xs font-mono px-2.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Costo (S/.)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="10"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  placeholder="150"
                  className="w-full text-xs font-mono font-bold px-2 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center shrink-0"
                  title="Agregar al plan"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Visualización de Fases del Tratamiento */}
        <div className="space-y-4">
          {(['fase_1_sistematica', 'fase_2_higienica', 'fase_3_correctiva', 'fase_4_mantenimiento'] as TreatmentPhase[]).map(
            (phase) => {
              const meta = PHASE_LABELS[phase];
              const items = treatmentPlan.filter((t) => t.phase === phase);
              const phaseTotal = items.reduce((acc, curr) => acc + (curr.cost || 0), 0);

              return (
                <div key={phase} className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                  <div className={`p-3 border-b flex items-center justify-between ${meta.color}`}>
                    <div>
                      <h3 className="text-xs font-bold">{meta.title}</h3>
                      <p className="text-[11px] opacity-80 mt-0.5">{meta.desc}</p>
                    </div>
                    <span className="text-xs font-mono font-extrabold bg-white/80 px-2.5 py-1 rounded-lg border border-black/10">
                      Subtotal: S/. {phaseTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-2 divide-y divide-slate-100 bg-white">
                    {items.length === 0 ? (
                      <p className="p-3 text-center text-xs text-slate-400 italic">
                        No hay procedimientos registrados en esta fase.
                      </p>
                    ) : (
                      items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 hover:bg-slate-50/80 transition rounded-lg text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(item.id)}
                              className="focus:outline-none"
                              title="Cambiar estado del procedimiento"
                            >
                              {item.status === 'Completado' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : item.status === 'En Proceso' ? (
                                <Clock className="w-4 h-4 text-sky-600 animate-spin" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-slate-300 hover:border-slate-400" />
                              )}
                            </button>

                            <div>
                              <div className="flex items-center gap-2">
                                {item.toothNumber && (
                                  <span className="font-mono font-extrabold text-[11px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                                    Pieza {item.toothNumber}
                                  </span>
                                )}
                                <span
                                  className={`font-medium ${
                                    item.status === 'Completado'
                                      ? 'line-through text-slate-400'
                                      : 'text-slate-800'
                                  }`}
                                >
                                  {item.procedure}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.status === 'Completado'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'En Proceso'
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.status}
                            </span>

                            <span className="font-mono font-bold text-slate-700 w-20 text-right">
                              S/. {item.cost?.toFixed(2) || '0.00'}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleRemoveTreatmentItem(item.id)}
                              className="p-1 text-slate-300 hover:text-rose-600 rounded transition"
                              title="Eliminar procedimiento"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};
