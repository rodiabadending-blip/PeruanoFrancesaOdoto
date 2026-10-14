import React, { useState, useEffect, useRef } from 'react';
import { ClinicalRecord, OdontogramState, Cie10Diagnosis } from './types/dental';
import { StorageService } from './services/storageService';
import { Navbar } from './components/layout/Navbar';
import { MedicalAlertBadge } from './components/common/MedicalAlertBadge';
import { FiliacionModule } from './components/modules/FiliacionModule';
import { AnamnesisModule } from './components/modules/AnamnesisModule';
import { ExamenClinicoModule } from './components/modules/ExamenClinicoModule';
import { OdontogramModule } from './components/odontogram/OdontogramModule';
import { DentalImagesModule } from './components/modules/DentalImagesModule';
import { DiagnosticoPlanModule } from './components/modules/DiagnosticoPlanModule';
import { EvolucionConsentimientoModule } from './components/modules/EvolucionConsentimientoModule';
import { PrintableView } from './components/modules/PrintableView';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { RecordManagerModal } from './components/modules/RecordManagerModal';
import { LaptopShowcaseWrapper } from './components/common/LaptopShowcaseWrapper';
import {
  User,
  ClipboardList,
  Stethoscope,
  Smile,
  FileCheck,
  FileSignature,
  CheckCircle,
  Activity,
  Layers,
  Sparkles,
  AlertTriangle,
  Trash2,
} from 'lucide-react';

type TabKey = 'filiacion' | 'anamnesis' | 'examen' | 'odontograma' | 'imagenes' | 'diagnostico' | 'evolucion';

export default function App() {
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<ClinicalRecord | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('filiacion');
  const [isPrintView, setIsPrintView] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedSecondsAgo, setLastSavedSecondsAgo] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isConfirmingDeleteActive, setIsConfirmingDeleteActive] = useState(false);
  const [isMockupMode, setIsMockupMode] = useState(false);

  // Cargar registros al inicio
  useEffect(() => {
    const loadedRecords = StorageService.getAllRecords();
    const activeId = StorageService.getActiveRecordId();
    setRecords(loadedRecords);

    const found = loadedRecords.find((r) => r.id === activeId) || loadedRecords[0];
    if (found) {
      setCurrentRecord(found);
    }
  }, []);

  // Timer para contador de guardado
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSavedSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-Save cada 30 segundos
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (currentRecord) {
        setIsSaving(true);
        const saved = StorageService.saveRecord(currentRecord, 'Autoguardado Peruano Francesa');
        setRecords(StorageService.getAllRecords());
        setIsSaving(false);
        setLastSavedSecondsAgo(0);
      }
    }, 30000); // 30 segundos

    return () => clearInterval(autoSaveTimer);
  }, [currentRecord]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleManualSave = () => {
    if (!currentRecord) return;
    setIsSaving(true);
    const saved = StorageService.saveRecord(currentRecord, 'Dr. Gersson Anthony Valdivia Medina (CCDP 62958)');
    setCurrentRecord(saved);
    setRecords(StorageService.getAllRecords());
    setIsSaving(false);
    setLastSavedSecondsAgo(0);
    showToast('Historia Clínica guardada exitosamente.');
  };

  const handleSelectRecord = (id: string) => {
    StorageService.setActiveRecordId(id);
    const record = records.find((r) => r.id === id);
    if (record) {
      setCurrentRecord(record);
      setLastSavedSecondsAgo(0);
    }
  };

  const handleCreateNewRecord = () => {
    const newRec = StorageService.createNewRecord();
    setRecords(StorageService.getAllRecords());
    setCurrentRecord(newRec);
    setActiveTab('filiacion');
    setLastSavedSecondsAgo(0);
    showToast(`Nueva Historia Clínica ${newRec.filiation.hcNumber} iniciada.`);
  };

  const handleDeleteRecord = (id: string) => {
    StorageService.deleteRecord(id);
    const remaining = StorageService.getAllRecords();
    setRecords(remaining);

    if (currentRecord?.id === id) {
      if (remaining.length > 0) {
        setCurrentRecord(remaining[0]);
        StorageService.setActiveRecordId(remaining[0].id);
      } else {
        const brandNew = StorageService.createNewRecord();
        setRecords([brandNew]);
        setCurrentRecord(brandNew);
      }
    }
    showToast('Historia clínica eliminada y descartada del sistema.');
  };

  const handleExportBackup = () => {
    StorageService.exportBackup();
    showToast('Copia de respaldo exportada correctamente.');
  };

  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const success = StorageService.importBackup(content);
        if (success) {
          const loaded = StorageService.getAllRecords();
          setRecords(loaded);
          setCurrentRecord(loaded[0]);
          showToast('Historias clínicas restauradas exitosamente.');
        } else {
          showToast('Error al importar el archivo JSON. Formato no compatible.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Sincronización automática de hallazgos del odontograma a diagnósticos CIE-10
  const handleSyncOdontogramToDiagnoses = () => {
    if (!currentRecord) return;
    const teeth = currentRecord.odontogram.teeth;
    const newDiagnoses: Cie10Diagnosis[] = [...currentRecord.diagnoses];
    const today = new Date().toISOString().split('T')[0];

    Object.values(teeth).forEach((t) => {
      const hasCaries =
        t.wholeToothFinding === 'caries' || Object.values(t.surfaces).includes('caries');
      const hasFracture =
        t.wholeToothFinding === 'fractura' || Object.values(t.surfaces).includes('fractura');
      const hasResto = t.wholeToothFinding === 'resto_radicular';

      if (hasCaries && !newDiagnoses.some((d) => d.toothNumber === t.toothNumber && d.code === 'K02.1')) {
        newDiagnoses.push({
          id: `diag_sync_${Date.now()}_${t.toothNumber}`,
          code: 'K02.1',
          description: `Caries de la dentina en pieza ${t.toothNumber}`,
          toothNumber: t.toothNumber,
          type: 'Definitivo',
          date: today,
        });
      }

      if (hasFracture && !newDiagnoses.some((d) => d.toothNumber === t.toothNumber && d.code === 'S02.5')) {
        newDiagnoses.push({
          id: `diag_sync_frac_${Date.now()}_${t.toothNumber}`,
          code: 'S02.5',
          description: `Fractura dental en esmalte/dentina en pieza ${t.toothNumber}`,
          toothNumber: t.toothNumber,
          type: 'Definitivo',
          date: today,
        });
      }

      if (hasResto && !newDiagnoses.some((d) => d.toothNumber === t.toothNumber && d.code === 'K08.3')) {
        newDiagnoses.push({
          id: `diag_sync_rr_${Date.now()}_${t.toothNumber}`,
          code: 'K08.3',
          description: `Raíz dental retenida / resto radicular en pieza ${t.toothNumber}`,
          toothNumber: t.toothNumber,
          type: 'Definitivo',
          date: today,
        });
      }
    });

    setCurrentRecord({
      ...currentRecord,
      diagnoses: newDiagnoses,
    });
    setActiveTab('diagnostico');
    showToast('Diagnósticos CIE-10 generados y sincronizados desde el Odontograma.');
  };

  if (!currentRecord) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center mx-auto animate-spin">
            <Activity className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Cargando Peruano Francesa...</p>
        </div>
      </div>
    );
  }

  // Vista de Impresión Oficial Peruano Francesa
  if (isPrintView) {
    return (
      <PrintableView
        record={currentRecord}
        onBack={() => setIsPrintView(false)}
      />
    );
  }

  const tabs: { key: TabKey; label: string; icon: any; count?: number }[] = [
    { key: 'filiacion', label: '1. Filiación', icon: User },
    { key: 'anamnesis', label: '2. Anamnesis', icon: ClipboardList },
    { key: 'examen', label: '3. Examen Clínico', icon: Stethoscope },
    {
      key: 'odontograma',
      label: '4. Odontograma Interactivo',
      icon: Smile,
      count: Object.keys(currentRecord.odontogram.teeth).length,
    },
    {
      key: 'imagenes',
      label: '5. Placas & Imágenes',
      icon: Layers,
      count: currentRecord.dentalImages?.length || 0,
    },
    {
      key: 'diagnostico',
      label: '6. Diagnóstico & Plan',
      icon: FileCheck,
      count: currentRecord.diagnoses.length,
    },
    {
      key: 'evolucion',
      label: '7. Evolución & Consentimiento',
      icon: FileSignature,
      count: currentRecord.evolutions.length,
    },
  ];

  return (
    <LaptopShowcaseWrapper
      isMockupActive={isMockupMode}
      onToggleMockup={() => setIsMockupMode(!isMockupMode)}
    >
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
        {/* 1. Barra de Navegación Superior con bloques flotantes y botones estilizados */}
        <Navbar
          currentRecord={currentRecord}
          allRecords={records}
          onSelectRecord={handleSelectRecord}
          onCreateNewRecord={handleCreateNewRecord}
          onSaveManual={handleManualSave}
          onPrintPreview={() => setIsPrintView(true)}
          onDeleteActiveRecord={() => setIsConfirmingDeleteActive(true)}
          onExportBackup={handleExportBackup}
          onImportBackup={handleImportBackup}
          onOpenManagerModal={() => setIsManagerModalOpen(true)}
          lastSavedSecondsAgo={lastSavedSecondsAgo}
          isSaving={isSaving}
          isMockupMode={isMockupMode}
          onToggleMockupMode={() => setIsMockupMode(!isMockupMode)}
        />

        {/* 2. Banner de Alertas Médicas (Alergias, Hipertensión, etc.) */}
        <MedicalAlertBadge medicalBackground={currentRecord.anamnesis.medicalBackground} />

        {/* 3. Faja de Datos del Paciente (Gris azulado tenue con tarjetas de indicadores) */}
        <div className="bg-[#F0F4F8] border-b border-slate-200/80 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Información del Paciente ordenada */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white text-[#1D4ED8] flex items-center justify-center font-bold text-base border border-slate-200/90 shadow-2xs shrink-0">
                  {currentRecord.filiation.firstName?.[0] || 'N'}
                  {currentRecord.filiation.lastName?.[0] || 'P'}
                </div>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-base font-bold text-slate-900 tracking-tight">
                      {currentRecord.filiation.firstName
                        ? `${currentRecord.filiation.firstName} ${currentRecord.filiation.lastName}`
                        : 'Nuevo Paciente'}
                    </h1>
                    <span className="text-[11px] font-mono font-bold text-[#1D4ED8] bg-white px-2 py-0.5 rounded-md border border-slate-200/90 shadow-2xs">
                      {currentRecord.filiation.hcNumber}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200/90 shadow-2xs">
                      {currentRecord.filiation.docType}: {currentRecord.filiation.docNumber || 'Sin Documento'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-2.5 mt-1 flex-wrap">
                    <span className="font-semibold text-slate-700">
                      {currentRecord.filiation.age} años ({currentRecord.filiation.sex})
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>
                      Grupo Rh: <strong className="text-slate-800">{currentRecord.filiation.bloodType}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>Ingreso: {currentRecord.filiation.admissionDate}</span>
                    {currentRecord.filiation.tutorRequired && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 text-[11px]">
                          Tutor: {currentRecord.filiation.tutorName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Pequeños indicadores tipo tarjeta con bordes finos */}
              <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                {/* Tarjeta ÍNDICE CPO-D */}
                <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs text-center min-w-[95px]">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                    Índice CPO-D
                  </span>
                  <span className="text-sm font-extrabold font-mono text-slate-900">
                    {currentRecord.odontogram.cpoIndex?.totalCpo ?? 0}
                  </span>
                </div>

                {/* Tarjeta PRESUPUESTO S/. */}
                <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs text-center min-w-[110px]">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                    Presupuesto S/.
                  </span>
                  <span className="text-sm font-extrabold font-mono text-emerald-700">
                    S/. {currentRecord.treatmentPlan.reduce((acc, c) => acc + (c.cost || 0), 0).toFixed(2)}
                  </span>
                </div>

                {/* Tarjeta CONSENTIMIENTO con etiqueta coral/naranja o verde */}
                <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs text-center min-w-[125px] flex flex-col items-center justify-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-0.5">
                    Consentimiento
                  </span>
                  {currentRecord.consent.agreed ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-2xs">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Firmado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3] shadow-2xs">
                      <AlertTriangle className="w-3 h-3 text-[#E11D48]" /> Pendiente
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 4. Fila de Pestañas Horizontales (Tabs) - Pestaña activa en Azul Cobalto */}
        <div className="bg-white border-b border-slate-200/80 shadow-2xs sticky top-16 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1.5 py-2 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? 'bg-[#1D4ED8] text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-[#F8FAFC] font-medium'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 stroke-[1.8] ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    {typeof tab.count === 'number' && tab.count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-blue-900/50 text-white' : 'bg-slate-200/90 text-slate-700'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

      {/* 4. Contenedor del Módulo Activo */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'filiacion' && (
          <FiliacionModule
            filiation={currentRecord.filiation}
            onChange={(filiation) => setCurrentRecord({ ...currentRecord, filiation })}
          />
        )}

        {activeTab === 'anamnesis' && (
          <AnamnesisModule
            anamnesis={currentRecord.anamnesis}
            onChange={(anamnesis) => setCurrentRecord({ ...currentRecord, anamnesis })}
          />
        )}

        {activeTab === 'examen' && (
          <ExamenClinicoModule
            physicalExam={currentRecord.physicalExam}
            stomatologicalExam={currentRecord.stomatologicalExam}
            onPhysicalChange={(physicalExam) => setCurrentRecord({ ...currentRecord, physicalExam })}
            onStomatologicalChange={(stomatologicalExam) =>
              setCurrentRecord({ ...currentRecord, stomatologicalExam })
            }
          />
        )}

        {activeTab === 'odontograma' && (
          <OdontogramModule
            odontogram={currentRecord.odontogram}
            onChange={(odontogram) => setCurrentRecord({ ...currentRecord, odontogram })}
            onSyncDiagnoses={handleSyncOdontogramToDiagnoses}
          />
        )}

        {activeTab === 'imagenes' && (
          <DentalImagesModule
            images={currentRecord.dentalImages || []}
            onChange={(dentalImages) =>
              setCurrentRecord({ ...currentRecord, dentalImages })
            }
            patientName={`${currentRecord.filiation.firstName} ${currentRecord.filiation.lastName}`}
          />
        )}

        {activeTab === 'diagnostico' && (
          <DiagnosticoPlanModule
            diagnoses={currentRecord.diagnoses}
            treatmentPlan={currentRecord.treatmentPlan}
            onDiagnosesChange={(diagnoses) => setCurrentRecord({ ...currentRecord, diagnoses })}
            onTreatmentPlanChange={(treatmentPlan) => setCurrentRecord({ ...currentRecord, treatmentPlan })}
          />
        )}

        {activeTab === 'evolucion' && (
          <EvolucionConsentimientoModule
            evolutions={currentRecord.evolutions}
            consent={currentRecord.consent}
            patientFiliation={currentRecord.filiation}
            onEvolutionsChange={(evolutions) => setCurrentRecord({ ...currentRecord, evolutions })}
            onConsentChange={(consent) => setCurrentRecord({ ...currentRecord, consent })}
            onPrintPreview={() => setIsPrintView(true)}
          />
        )}
      </main>

      {/* 5. Indicador Flotante Offline */}
      <OfflineIndicator />

      {/* 6. Modal Gestor y Depuración de Historias Clínicas */}
      <RecordManagerModal
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
        records={records}
        currentRecordId={currentRecord.id}
        onSelectRecord={handleSelectRecord}
        onDeleteRecord={handleDeleteRecord}
        onCreateNewRecord={handleCreateNewRecord}
      />

      {/* 7. Modal de Confirmación Rápida para Eliminar Historia Actual */}
      {isConfirmingDeleteActive && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl border border-rose-100 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ¿Desea borrar esta Historia Clínica?
                </h3>
                <p className="text-xs text-rose-600 font-semibold mt-0.5">
                  Se eliminará definitivamente del sistema
                </p>
              </div>
            </div>

            <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-100 text-xs text-slate-700 space-y-1">
              <div>
                <strong>Paciente:</strong> {currentRecord.filiation.firstName} {currentRecord.filiation.lastName}
              </div>
              <div>
                <strong>N° de Historia:</strong>{' '}
                <span className="font-mono font-bold text-rose-900">{currentRecord.filiation.hcNumber}</span>
              </div>
              <div>
                <strong>Documento:</strong> {currentRecord.filiation.docType} {currentRecord.filiation.docNumber || 'S/D'}
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Todos los datos registrados para este paciente (anamnesis, odontograma, evoluciones y consentimientos) serán eliminados permanentemente del almacenamiento.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDeleteActive(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsConfirmingDeleteActive(false);
                  handleDeleteRecord(currentRecord.id);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Sí, Borrar Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Notificación Toast Flotante */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer Sutil */}
      <footer className="no-print bg-white border-t border-slate-200/80 py-4 text-center text-xs text-slate-500">
        <p>
          <strong>Centro Odontológico Peruano Francesa</strong> (Trujillo - Perú) • Expediente Clínico Odontológico Privado • Dirección: <strong>Mz II lote N° 3 5ta etapa San Andres</strong>
        </p>
      </footer>
    </div>
  </LaptopShowcaseWrapper>
  );
}
