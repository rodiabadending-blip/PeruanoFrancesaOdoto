import React, { useState } from 'react';
import { ClinicalRecord } from '../../types/dental';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { PeruanoFrancesaLogo } from '../common/PeruanoFrancesaLogo';
import {
  User,
  UserPlus,
  Save,
  Printer,
  Download,
  Upload,
  ChevronDown,
  CheckCircle,
  Clock,
  Trash2,
  FolderKanban,
  MapPin,
  Laptop,
  Maximize2
} from 'lucide-react';

interface NavbarProps {
  currentRecord: ClinicalRecord;
  allRecords: ClinicalRecord[];
  onSelectRecord: (id: string) => void;
  onCreateNewRecord: () => void;
  onSaveManual: () => void;
  onPrintPreview: () => void;
  onDeleteActiveRecord?: () => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  onOpenManagerModal: () => void;
  lastSavedSecondsAgo: number;
  isSaving: boolean;
  isMockupMode?: boolean;
  onToggleMockupMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRecord,
  allRecords,
  onSelectRecord,
  onCreateNewRecord,
  onSaveManual,
  onPrintPreview,
  onDeleteActiveRecord,
  onExportBackup,
  onImportBackup,
  onOpenManagerModal,
  lastSavedSecondsAgo,
  isSaving,
  isMockupMode = false,
  onToggleMockupMode,
}) => {
  const [showPatientMenu, setShowPatientMenu] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      e.target.value = '';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* 1. IZQUIERDA: Logotipo PERUANO FRANCESA CENTRO ODONTOLÓGICO + VALMED */}
          <div className="flex items-center gap-3 shrink-0">
            <PeruanoFrancesaLogo size="md" showText={true} />
          </div>

          {/* 2. CENTRO: Bloques flotantes con iconos lineales y bordes finos */}
          <div className="hidden xl:flex items-center gap-2.5">
            {/* Tarjeta Dirección */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-[#F8FAFC]/90 text-slate-700 shadow-2xs text-xs"
              title="Dirección física del consultorio"
            >
              <MapPin className="w-3.5 h-3.5 text-[#1D4ED8] stroke-[1.8] shrink-0" />
              <div className="flex items-center gap-1">
                <span className="font-semibold text-slate-800">Dirección:</span>
                <span className="text-slate-600 font-normal truncate max-w-[210px]">
                  Mz II lote N° 3 5ta etapa San Andres
                </span>
              </div>
            </div>

            {/* Tarjeta Paciente Activo (Dropdown interactivo) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPatientMenu(!showPatientMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-[#F8FAFC] text-slate-800 shadow-2xs text-xs font-semibold transition"
                title="Cambiar paciente o crear nueva historia"
              >
                <User className="w-3.5 h-3.5 text-[#1D4ED8] stroke-[1.8] shrink-0" />
                <div className="max-w-[170px] truncate text-left">
                  <span>
                    {currentRecord.filiation.firstName
                      ? `${currentRecord.filiation.firstName} ${currentRecord.filiation.lastName}`
                      : 'Nuevo Paciente'}
                  </span>
                  <span className="ml-1.5 text-[10px] font-mono font-medium text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                    {currentRecord.filiation.hcNumber}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 stroke-[1.8]" />
              </button>

              {/* Menú Desplegable de Pacientes */}
              {showPatientMenu && (
                <div
                  className="absolute left-0 mt-2 w-84 rounded-2xl bg-white shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setShowPatientMenu(false)}
                >
                  <div className="px-3.5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                    <span>Historias Registradas ({allRecords.length})</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPatientMenu(false);
                        onOpenManagerModal();
                      }}
                      className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 text-[10px]"
                    >
                      <Trash2 className="w-3 h-3" /> Depurar
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100/80">
                    {allRecords.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => onSelectRecord(r.id)}
                        className={`w-full text-left px-3.5 py-2 text-xs transition flex items-center justify-between group ${
                          r.id === currentRecord.id
                            ? 'bg-blue-50/70 font-bold text-blue-900'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="truncate">
                            {r.filiation.firstName} {r.filiation.lastName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {r.filiation.hcNumber} • {r.filiation.docType} {r.filiation.docNumber || 'S/D'}
                          </div>
                        </div>
                        {r.id === currentRecord.id && (
                          <CheckCircle className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 px-2.5 border-t border-slate-100 space-y-1">
                    <button
                      type="button"
                      onClick={onCreateNewRecord}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1D4ED8] text-xs font-semibold transition"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Nueva Historia (HC)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tarjeta Gestor de Historias */}
            <button
              type="button"
              onClick={onOpenManagerModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs text-xs font-semibold transition"
              title="Abrir gestor para revisar o depurar historias clínicas"
            >
              <FolderKanban className="w-3.5 h-3.5 text-[#1D4ED8] stroke-[1.8]" />
              <span>Gestor de Historias</span>
            </button>

            {/* Tarjeta Estado de Guardado */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-[#F8FAFC] text-slate-600 shadow-2xs text-xs">
              {isSaving ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="text-amber-700 font-medium">Guardando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 stroke-[2]" />
                  <span className="text-slate-600 font-medium">Guardado</span>
                  <span className="text-[10px] text-slate-400 font-mono">({lastSavedSecondsAgo}s)</span>
                </>
              )}
            </div>
          </div>

          {/* Versión responsiva de selector de paciente para pantallas menores a XL */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPatientMenu(!showPatientMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 shadow-2xs"
            >
              <User className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span className="max-w-[120px] truncate">
                {currentRecord.filiation.firstName || 'Nuevo Paciente'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* 3. DERECHA: Botones de acción estilizados con iconos sutiles */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Botón Guardar */}
            <button
              type="button"
              onClick={onSaveManual}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 transition shadow-2xs"
              title="Guardar cambios manualmente ahora"
            >
              <Save className="w-3.5 h-3.5 text-[#1D4ED8] stroke-[1.8]" />
              <span>Guardar</span>
            </button>

            {/* Botón Imprimir HC (Azul marino / oscuro) */}
            <button
              type="button"
              onClick={onPrintPreview}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#0B192C] hover:bg-[#15253B] text-white transition shadow-xs"
              title="Generar vista imprimible oficial o PDF"
            >
              <Printer className="w-3.5 h-3.5 text-blue-300 stroke-[1.8]" />
              <span className="hidden sm:inline">Imprimir HC</span>
            </button>

            {/* Discreto botón Borrar HC (Tono coral / rojo suave) */}
            {onDeleteActiveRecord && (
              <button
                type="button"
                onClick={onDeleteActiveRecord}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#E11D48] border border-[#FECDD3] transition shadow-2xs"
                title="Descartar o borrar esta historia clínica"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[1.8]" />
                <span className="hidden sm:inline">Borrar HC</span>
              </button>
            )}

            {/* Alternar Modo Laptop Consultorio (Visualización) */}
            {onToggleMockupMode && (
              <button
                type="button"
                onClick={onToggleMockupMode}
                className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition ${
                  isMockupMode
                    ? 'bg-blue-50 border-blue-200 text-[#1D4ED8]'
                    : 'bg-white border-slate-200/90 text-slate-600 hover:bg-slate-50'
                }`}
                title={isMockupMode ? 'Volver a Pantalla Completa' : 'Ver en Pantalla Laptop de Consultorio'}
              >
                {isMockupMode ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 stroke-[1.8]" />
                    <span className="hidden lg:inline">Pantalla Completa</span>
                  </>
                ) : (
                  <>
                    <Laptop className="w-3.5 h-3.5 stroke-[1.8]" />
                    <span className="hidden lg:inline">Mockup Consultorio</span>
                  </>
                )}
              </button>
            )}

            {/* Acciones Respaldo JSON */}
            <div className="hidden lg:flex items-center gap-0.5 border-l border-slate-200 pl-1.5">
              <button
                type="button"
                onClick={onExportBackup}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                title="Descargar respaldo JSON"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <label
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="Restaurar respaldo JSON"
              >
                <Upload className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* PWA Install Button */}
            <PWAInstallButton />
          </div>

        </div>
      </div>
    </header>
  );
};
