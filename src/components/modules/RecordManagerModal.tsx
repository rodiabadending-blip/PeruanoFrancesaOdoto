import React, { useState } from 'react';
import { ClinicalRecord } from '../../types/dental';
import {
  X,
  Search,
  Trash2,
  FolderOpen,
  AlertTriangle,
  UserCheck,
  Calendar,
  FileText,
  Activity,
  Plus
} from 'lucide-react';

interface RecordManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: ClinicalRecord[];
  currentRecordId: string;
  onSelectRecord: (id: string) => void;
  onDeleteRecord: (id: string) => void;
  onCreateNewRecord: () => void;
}

export const RecordManagerModal: React.FC<RecordManagerModalProps> = ({
  isOpen,
  onClose,
  records,
  currentRecordId,
  onSelectRecord,
  onDeleteRecord,
  onCreateNewRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordToDelete, setRecordToDelete] = useState<ClinicalRecord | null>(null);

  if (!isOpen) return null;

  const filteredRecords = records.filter((r) => {
    const query = searchTerm.toLowerCase().trim();
    const fullName = `${r.filiation.firstName} ${r.filiation.lastName}`.toLowerCase();
    const hc = r.filiation.hcNumber.toLowerCase();
    const doc = (r.filiation.docNumber || '').toLowerCase();
    return fullName.includes(query) || hc.includes(query) || doc.includes(query);
  });

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      onDeleteRecord(recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Cabecera del Gestor */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Gestor y Depuración de Historias Clínicas
              </h2>
              <p className="text-xs text-slate-500">
                Seleccione, revise o elimine definitivamente historias clínicas que no use o desee desechar
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Filtro y Acciones Rápidas */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por paciente, DNI o N° de HC..."
              className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-slate-500">
              Total: <strong className="text-slate-800">{records.length}</strong> {records.length === 1 ? 'historia' : 'historias'}
            </span>
            <button
              type="button"
              onClick={() => {
                onCreateNewRecord();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" /> Nueva Historia
            </button>
          </div>
        </div>

        {/* Tabla de Historias Clínicas */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
              No se encontraron historias clínicas que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Historia / Documento</th>
                    <th className="py-2.5 px-3">Paciente</th>
                    <th className="py-2.5 px-3 hidden sm:table-cell">Fecha Admisión</th>
                    <th className="py-2.5 px-3 hidden md:table-cell">Odontograma</th>
                    <th className="py-2.5 px-3 hidden sm:table-cell">Presupuesto</th>
                    <th className="py-2.5 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredRecords.map((r) => {
                    const isCurrent = r.id === currentRecordId;
                    const findingsCount = Object.keys(r.odontogram?.teeth || {}).length;
                    const totalCost = r.treatmentPlan.reduce((acc, c) => acc + (c.cost || 0), 0);

                    return (
                      <tr
                        key={r.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isCurrent ? 'bg-sky-50/40' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="font-mono font-bold text-sky-800 flex items-center gap-1.5">
                            {r.filiation.hcNumber}
                            {isCurrent && (
                              <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded-md">
                                Abierta
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {r.filiation.docType}: {r.filiation.docNumber || 'Sin número'}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">
                            {r.filiation.firstName} {r.filiation.lastName}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {r.filiation.age} años • {r.filiation.sex}
                          </div>
                        </td>

                        <td className="py-3 px-3 text-slate-600 hidden sm:table-cell font-mono text-[11px]">
                          {r.filiation.admissionDate}
                        </td>

                        <td className="py-3 px-3 hidden md:table-cell">
                          <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            {findingsCount} {findingsCount === 1 ? 'pieza' : 'piezas'}
                          </span>
                        </td>

                        <td className="py-3 px-3 hidden sm:table-cell font-mono font-bold text-slate-800">
                          S/. {totalCost.toFixed(2)}
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Botón Abrir */}
                            <button
                              type="button"
                              onClick={() => {
                                onSelectRecord(r.id);
                                onClose();
                              }}
                              className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                                isCurrent
                                  ? 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                              title="Abrir esta historia clínica"
                            >
                              <FolderOpen className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">
                                {isCurrent ? 'Abierta' : 'Abrir'}
                              </span>
                            </button>

                            {/* Botón Eliminar / Descartar */}
                            <button
                              type="button"
                              onClick={() => setRecordToDelete(r)}
                              className="p-1.5 rounded-lg text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 transition flex items-center gap-1"
                              title="Eliminar o desechar esta historia clínica"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline text-xs font-semibold">
                                Eliminar
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Confirmación de Eliminación */}
        {recordToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
            <div className="bg-white rounded-2xl shadow-2xl border border-rose-100 max-w-md w-full p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    ¿Eliminar Historia Clínica?
                  </h3>
                  <p className="text-xs text-rose-600 font-semibold mt-0.5">
                    Esta acción es definitiva y no se puede deshacer.
                  </p>
                </div>
              </div>

              <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-100 text-xs text-slate-700 space-y-1">
                <div>
                  <strong>Paciente:</strong> {recordToDelete.filiation.firstName} {recordToDelete.filiation.lastName}
                </div>
                <div>
                  <strong>N° de Historia:</strong> <span className="font-mono font-bold text-rose-900">{recordToDelete.filiation.hcNumber}</span>
                </div>
                <div>
                  <strong>Documento:</strong> {recordToDelete.filiation.docType} {recordToDelete.filiation.docNumber || 'S/D'}
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Se eliminarán permanentemente todos los datos de filiación, anamnesis, examen clínico, odontograma interactivo, diagnósticos CIE-10, plan de tratamiento y consentimientos firmados asociados a este paciente.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRecordToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Sí, Eliminar Definitivamente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
