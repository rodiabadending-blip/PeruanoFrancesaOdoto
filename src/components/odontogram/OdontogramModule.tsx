import React, { useState } from 'react';
import { OdontogramState, ToothCondition, ToothSurface, MinsaFindingType } from '../../types/dental';
import { ToothComponent } from './ToothComponent';
import { OdontogramToolbar } from './OdontogramToolbar';
import { OdontogramSummary } from './OdontogramSummary';
import { calculateCpoIndex } from '../../data/defaultPatients';
import { TOOTH_NAMES, MINSA_FINDING_LABELS } from './toothDefinitions';
import { Info, Layers, RotateCcw } from 'lucide-react';

interface OdontogramModuleProps {
  odontogram: OdontogramState;
  onChange: (newOdontogram: OdontogramState) => void;
  onSyncDiagnoses?: () => void;
}

export const OdontogramModule: React.FC<OdontogramModuleProps> = ({
  odontogram,
  onChange,
  onSyncDiagnoses,
}) => {
  const [dentitionView, setDentitionView] = useState<'mixed' | 'permanent' | 'deciduous'>('mixed');
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedSurface, setSelectedSurface] = useState<ToothSurface | null>(null);
  const [activeFinding, setActiveFinding] = useState<MinsaFindingType | null>('caries');
  const [toothNotes, setToothNotes] = useState<string>('');

  // Cuadrantes de Dentición Permanente (32 piezas)
  const q1 = [18, 17, 16, 15, 14, 13, 12, 11]; // Superior Derecho
  const q2 = [21, 22, 23, 24, 25, 26, 27, 28]; // Superior Izquierdo
  const q4 = [48, 47, 46, 45, 44, 43, 42, 41]; // Inferior Derecho
  const q3 = [31, 32, 33, 34, 35, 36, 37, 38]; // Inferior Izquierdo

  // Cuadrantes de Dentición Decidua / Temporal (20 piezas)
  const q5 = [55, 54, 53, 52, 51]; // Superior Derecho Temporal
  const q6 = [61, 62, 63, 64, 65]; // Superior Izquierdo Temporal
  const q8 = [85, 84, 83, 82, 81]; // Inferior Derecho Temporal
  const q7 = [71, 72, 73, 74, 75]; // Inferior Izquierdo Temporal

  const handleToothClick = (toothNumber: number) => {
    setSelectedTooth(toothNumber);
    setSelectedSurface(null);
    const existing = odontogram.teeth[toothNumber];
    setToothNotes(existing?.notes || '');

    // Si hay una herramienta activa de diente completo, aplicarla
    if (activeFinding) {
      const isWholeToothOnly = [
        'resto_radicular',
        'diente_ausente_extraer',
        'diente_ausente_definitivo',
        'implante_osteointegrado',
        'corona_buen_estado',
        'corona_defectuosa',
        'protesis_defectuosa',
        'protesis_buen_estado',
        'protesis_fija_removible',
        'protesis_fija_defectuosa',
        'protesis_fija_buen_estado',
        'protesis_removible_defectuosa',
        'protesis_removible_buen_estado',
        'pilar_protesis_requerido',
        'pilar_protesis_buen_estado',
        'aparato_ortodontico',
        'aparato_ortodontico_defectuoso',
        'pieza_erupcionando',
        'diente_impactado',
        'giroversion',
        'migracion_extrusion_intrusion',
        'movilidad_dental',
        'movilidad_dental_1',
        'movilidad_dental_2',
        'movilidad_dental_3',
        'diastema',
        'diente_supernumerario',
        'fractura',
      ].includes(activeFinding);

      if (isWholeToothOnly) {
        applyFindingToTooth(toothNumber, activeFinding);
      }
    }
  };

  const handleMobilityChange = (grade: 0 | 1 | 2 | 3) => {
    if (!selectedTooth) return;
    const currentTeeth = { ...odontogram.teeth };
    const currentTooth = currentTeeth[selectedTooth] || {
      toothNumber: selectedTooth,
      isDeciduous: selectedTooth >= 50,
      surfaces: {},
    };

    let mobilityFinding: MinsaFindingType | undefined = currentTooth.wholeToothFinding;
    if (grade === 1) mobilityFinding = 'movilidad_dental_1';
    else if (grade === 2) mobilityFinding = 'movilidad_dental_2';
    else if (grade === 3) mobilityFinding = 'movilidad_dental_3';
    else if (
      mobilityFinding === 'movilidad_dental_1' ||
      mobilityFinding === 'movilidad_dental_2' ||
      mobilityFinding === 'movilidad_dental_3' ||
      mobilityFinding === 'movilidad_dental'
    ) {
      mobilityFinding = undefined;
    }

    currentTeeth[selectedTooth] = {
      ...currentTooth,
      mobilityGrade: grade,
      wholeToothFinding: mobilityFinding,
      updatedAt: new Date().toISOString(),
    };

    const newCpo = calculateCpoIndex(currentTeeth);
    onChange({
      ...odontogram,
      teeth: currentTeeth,
      lastUpdated: new Date().toISOString(),
      cpoIndex: newCpo,
    });
  };

  const handleSurfaceClick = (toothNumber: number, surface: ToothSurface) => {
    setSelectedTooth(toothNumber);
    setSelectedSurface(surface);
    const existing = odontogram.teeth[toothNumber];
    setToothNotes(existing?.notes || '');

    // Aplicar la herramienta activa a esa superficie o raíz
    if (activeFinding) {
      applyFindingToSurface(toothNumber, surface, activeFinding);
    } else {
      // Modo borrador: limpiar esa superficie o raíz
      clearSurface(toothNumber, surface);
    }
  };

  const applyFindingToSurface = (toothNumber: number, surface: ToothSurface, finding: MinsaFindingType) => {
    const isDeciduous = toothNumber >= 50;
    const currentTeeth = { ...odontogram.teeth };
    const currentTooth = currentTeeth[toothNumber] || {
      toothNumber,
      isDeciduous,
      surfaces: {},
    };

    const newSurfaces = { ...currentTooth.surfaces, [surface]: finding };

    currentTeeth[toothNumber] = {
      ...currentTooth,
      surfaces: newSurfaces,
      updatedAt: new Date().toISOString(),
    };

    const newCpo = calculateCpoIndex(currentTeeth);

    onChange({
      ...odontogram,
      teeth: currentTeeth,
      lastUpdated: new Date().toISOString(),
      cpoIndex: newCpo,
    });
  };

  const clearSurface = (toothNumber: number, surface: ToothSurface) => {
    const currentTeeth = { ...odontogram.teeth };
    const currentTooth = currentTeeth[toothNumber];
    if (!currentTooth) return;

    const newSurfaces = { ...currentTooth.surfaces };
    delete newSurfaces[surface];

    currentTeeth[toothNumber] = {
      ...currentTooth,
      surfaces: newSurfaces,
      updatedAt: new Date().toISOString(),
    };

    const newCpo = calculateCpoIndex(currentTeeth);

    onChange({
      ...odontogram,
      teeth: currentTeeth,
      lastUpdated: new Date().toISOString(),
      cpoIndex: newCpo,
    });
  };

  const applyFindingToTooth = (toothNumber: number, finding: MinsaFindingType | null) => {
    const isDeciduous = toothNumber >= 50;
    const currentTeeth = { ...odontogram.teeth };
    const currentTooth = currentTeeth[toothNumber] || {
      toothNumber,
      isDeciduous,
      surfaces: {},
    };

    if (finding === null) {
      delete currentTeeth[toothNumber];
    } else {
      currentTeeth[toothNumber] = {
        ...currentTooth,
        wholeToothFinding: finding,
        notes: toothNotes,
        updatedAt: new Date().toISOString(),
      };
    }

    const newCpo = calculateCpoIndex(currentTeeth);

    onChange({
      ...odontogram,
      teeth: currentTeeth,
      lastUpdated: new Date().toISOString(),
      cpoIndex: newCpo,
    });
  };

  const handleClearTooth = (toothNumber: number) => {
    const currentTeeth = { ...odontogram.teeth };
    delete currentTeeth[toothNumber];
    const newCpo = calculateCpoIndex(currentTeeth);

    onChange({
      ...odontogram,
      teeth: currentTeeth,
      lastUpdated: new Date().toISOString(),
      cpoIndex: newCpo,
    });

    setToothNotes('');
    setSelectedTooth(null);
    setSelectedSurface(null);
  };

  const handleNotesChange = (newNotes: string) => {
    setToothNotes(newNotes);
    if (!selectedTooth) return;

    const currentTeeth = { ...odontogram.teeth };
    const currentTooth = currentTeeth[selectedTooth];
    if (currentTooth) {
      currentTeeth[selectedTooth] = {
        ...currentTooth,
        notes: newNotes,
      };
      onChange({
        ...odontogram,
        teeth: currentTeeth,
      });
    }
  };

  const handleUpdateToothNotes = (toothNumber: number, notes: string) => {
    const currentTeeth = { ...odontogram.teeth };
    const currentTooth = currentTeeth[toothNumber] || {
      toothNumber,
      isDeciduous: toothNumber >= 50,
      surfaces: {},
    };
    currentTeeth[toothNumber] = {
      ...currentTooth,
      notes,
      updatedAt: new Date().toISOString(),
    };
    onChange({
      ...odontogram,
      teeth: currentTeeth,
      lastUpdated: new Date().toISOString(),
    });
    if (selectedTooth === toothNumber) {
      setToothNotes(notes);
    }
  };

  const handleUpdateGeneralNotes = (notes: string) => {
    onChange({
      ...odontogram,
      generalNotes: notes,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleResetEntireOdontogram = () => {
    if (window.confirm('¿Está seguro de restablecer el odontograma completo a blanco? Esta acción no se puede deshacer.')) {
      onChange({
        teeth: {},
        lastUpdated: new Date().toISOString(),
        cpoIndex: { cariados: 0, perdidos: 0, obturados: 0, totalCpo: 0, ceoIndex: 0 },
        generalNotes: '',
      });
      setSelectedTooth(null);
      setSelectedSurface(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de cabecera del Odontograma con controles de vista */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            Odontograma Clínico Interactivo • Peruano Francesa
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Numeración FDI. Rojo: Patología / Requerido. Azul: Tratamiento realizado / Buen estado.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Selector de Dentición */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setDentitionView('mixed')}
              className={`px-3 py-1 rounded-lg transition ${
                dentitionView === 'mixed' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Mixta (Completa)
            </button>
            <button
              type="button"
              onClick={() => setDentitionView('permanent')}
              className={`px-3 py-1 rounded-lg transition ${
                dentitionView === 'permanent' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Permanente (Adulto)
            </button>
            <button
              type="button"
              onClick={() => setDentitionView('deciduous')}
              className={`px-3 py-1 rounded-lg transition ${
                dentitionView === 'deciduous' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Decidua (Infantil)
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetEntireOdontogram}
            className="p-1.5 text-xs text-slate-400 hover:text-rose-600 rounded-lg border border-slate-200 hover:bg-rose-50 transition"
            title="Restablecer odontograma a blanco"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Barra de herramientas Odontológicas */}
      <OdontogramToolbar
        selectedToothNumber={selectedTooth}
        selectedSurface={selectedSurface}
        activeFindingType={activeFinding}
        onSelectFindingType={setActiveFinding}
        onApplyToSelected={(type) => selectedTooth && applyFindingToTooth(selectedTooth, type)}
        onClearTooth={handleClearTooth}
        toothNotes={toothNotes}
        onChangeToothNotes={handleNotesChange}
        selectedMobility={selectedTooth ? (odontogram.teeth[selectedTooth]?.mobilityGrade || 0) : 0}
        onChangeMobility={handleMobilityChange}
      />

      {/* CONTENEDOR DEL ODONTOGRAMA GRAFICO SVG */}
      <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-4 overflow-x-auto shadow-inner">
        {/* Leyenda de orientación clínica */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
          <span>← Lado Derecho del Paciente (Cuadrante 1 y 4)</span>
          <span className="text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
            Línea Media Dental
          </span>
          <span>Lado Izquierdo del Paciente (Cuadrante 2 y 3) →</span>
        </div>

        <div className="min-w-[840px] space-y-4 py-2">
          {/* 1. MAXILAR SUPERIOR - DENTICIÓN PERMANENTE */}
          {(dentitionView === 'mixed' || dentitionView === 'permanent') && (
            <div className="bg-white/80 p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center justify-between px-2">
                <span>MAXILAR SUPERIOR - DENTICIÓN PERMANENTE</span>
                <span className="text-slate-400">Cuadrante 1 (18-11) | Cuadrante 2 (21-28)</span>
              </div>
              <div className="grid grid-cols-2 gap-4 divide-x divide-slate-200">
                {/* Cuadrante 1: 18 a 11 */}
                <div className="flex justify-end gap-1.5 pr-2">
                  {q1.map((num) => (
                    <ToothComponent
                      key={num}
                      toothNumber={num}
                      condition={odontogram.teeth[num]}
                      isSelected={selectedTooth === num}
                      onToothClick={handleToothClick}
                      onSurfaceClick={handleSurfaceClick}
                    />
                  ))}
                </div>
                {/* Cuadrante 2: 21 a 28 */}
                <div className="flex justify-start gap-1.5 pl-2">
                  {q2.map((num) => (
                    <ToothComponent
                      key={num}
                      toothNumber={num}
                      condition={odontogram.teeth[num]}
                      isSelected={selectedTooth === num}
                      onToothClick={handleToothClick}
                      onSurfaceClick={handleSurfaceClick}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. DENTICIÓN DECIDUA (TEMPORAL / INFANTIL) */}
          {(dentitionView === 'mixed' || dentitionView === 'deciduous') && (
            <div className="bg-amber-50/40 p-3 rounded-2xl border border-amber-200/80 shadow-xs">
              <div className="text-[11px] font-bold text-amber-800 mb-1.5 flex items-center justify-between px-2">
                <span>DENTICIÓN TEMPORAL / DECIDUA</span>
                <span className="text-amber-700">Cuadrantes 5, 6, 8, 7 (55-51, 61-65 / 85-81, 71-75)</span>
              </div>

              {/* Superior Temporal */}
              <div className="grid grid-cols-2 gap-4 divide-x divide-amber-200 mb-3 pb-3 border-b border-amber-100">
                <div className="flex justify-end gap-2 pr-2">
                  {q5.map((num) => (
                    <ToothComponent
                      key={num}
                      toothNumber={num}
                      condition={odontogram.teeth[num]}
                      isSelected={selectedTooth === num}
                      onToothClick={handleToothClick}
                      onSurfaceClick={handleSurfaceClick}
                    />
                  ))}
                </div>
                <div className="flex justify-start gap-2 pl-2">
                  {q6.map((num) => (
                    <ToothComponent
                      key={num}
                      toothNumber={num}
                      condition={odontogram.teeth[num]}
                      isSelected={selectedTooth === num}
                      onToothClick={handleToothClick}
                      onSurfaceClick={handleSurfaceClick}
                    />
                  ))}
                </div>
              </div>

              {/* Inferior Temporal */}
              <div className="grid grid-cols-2 gap-4 divide-x divide-amber-200">
                <div className="flex justify-end gap-2 pr-2">
                  {q8.map((num) => (
                    <ToothComponent
                      key={num}
                      toothNumber={num}
                      condition={odontogram.teeth[num]}
                      isSelected={selectedTooth === num}
                      onToothClick={handleToothClick}
                      onSurfaceClick={handleSurfaceClick}
                    />
                  ))}
                </div>
                <div className="flex justify-start gap-2 pl-2">
                  {q7.map((num) => (
                    <ToothComponent
                      key={num}
                      toothNumber={num}
                      condition={odontogram.teeth[num]}
                      isSelected={selectedTooth === num}
                      onToothClick={handleToothClick}
                      onSurfaceClick={handleSurfaceClick}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. MANDÍBULA INFERIOR - DENTICIÓN PERMANENTE */}
          {(dentitionView === 'mixed' || dentitionView === 'permanent') && (
            <div className="bg-white/80 p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center justify-between px-2">
                <span>MANDÍBULA INFERIOR - DENTICIÓN PERMANENTE</span>
                <span className="text-slate-400">Cuadrante 4 (48-41) | Cuadrante 3 (31-38)</span>
              </div>
              <div className="grid grid-cols-2 gap-4 divide-x divide-slate-200">
                {/* Cuadrante 4: 48 a 41 */}
                <div className="flex justify-end gap-1.5 pr-2">
                  {q4.map((num) => (
                    <ToothComponent
                      key={num}
                      toothNumber={num}
                      condition={odontogram.teeth[num]}
                      isSelected={selectedTooth === num}
                      onToothClick={handleToothClick}
                      onSurfaceClick={handleSurfaceClick}
                    />
                  ))}
                </div>
                {/* Cuadrante 3: 31 a 38 */}
                <div className="flex justify-start gap-1.5 pl-2">
                  {q3.map((num) => (
                    <ToothComponent
                      key={num}
                      toothNumber={num}
                      condition={odontogram.teeth[num]}
                      isSelected={selectedTooth === num}
                      onToothClick={handleToothClick}
                      onSurfaceClick={handleSurfaceClick}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resumen de Hallazgos y CPO-D */}
      <OdontogramSummary
        odontogram={odontogram}
        onRemoveToothFinding={handleClearTooth}
        onGenerateDiagnosesFromOdontogram={onSyncDiagnoses}
        onUpdateToothNotes={handleUpdateToothNotes}
        onUpdateGeneralNotes={handleUpdateGeneralNotes}
      />
    </div>
  );
};
