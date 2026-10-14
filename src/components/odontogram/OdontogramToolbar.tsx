import React, { useState } from 'react';
import { MinsaFindingType, ToothSurface } from '../../types/dental';
import { MINSA_FINDING_LABELS } from './toothDefinitions';
import {
  Eraser,
  Check,
  AlertTriangle,
  ShieldCheck,
  Search,
  Sparkles,
  Info,
  Layers,
  Activity
} from 'lucide-react';

interface OdontogramToolbarProps {
  selectedToothNumber: number | null;
  selectedSurface: ToothSurface | null;
  activeFindingType: MinsaFindingType | null;
  onSelectFindingType: (type: MinsaFindingType | null) => void;
  onApplyToSelected: (finding: MinsaFindingType | null) => void;
  onClearTooth: (toothNumber: number) => void;
  toothNotes: string;
  onChangeToothNotes: (notes: string) => void;
  selectedMobility?: 0 | 1 | 2 | 3;
  onChangeMobility?: (grade: 0 | 1 | 2 | 3) => void;
}

export const OdontogramToolbar: React.FC<OdontogramToolbarProps> = ({
  selectedToothNumber,
  selectedSurface,
  activeFindingType,
  onSelectFindingType,
  onApplyToSelected,
  onClearTooth,
  toothNotes,
  onChangeToothNotes,
  selectedMobility = 0,
  onChangeMobility,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'red' | 'blue'>('all');

  // 1. HALLAZGOS PATOLÓGICOS / DEFECTUOSOS (COLOR ROJO) - 19 elementos
  const redFindings: { key: MinsaFindingType; category?: string }[] = [
    { key: 'caries' },
    { key: 'obturacion_defectuosa' },
    { key: 'resto_radicular' },
    { key: 'sellante_defectuoso' },
    { key: 'diente_ausente_extraer' },
    { key: 'endodoncia_requerida' },
    { key: 'fractura' },
    { key: 'protesis_defectuosa' },
    { key: 'corona_defectuosa' },
    { key: 'protesis_fija_defectuosa' },
    { key: 'protesis_removible_defectuosa' },
    { key: 'pilar_protesis_requerido' },
    { key: 'aparato_ortodontico_defectuoso' },
    { key: 'pieza_erupcionando' },
    { key: 'diente_impactado' },
    { key: 'giroversion' },
    { key: 'migracion_extrusion_intrusion' },
    { key: 'movilidad_dental' },
    { key: 'diastema' },
  ];

  // 2. TRATAMIENTOS REALIZADOS / EN BUEN ESTADO (COLOR AZUL) - 13 elementos
  const blueFindings: { key: MinsaFindingType; category?: string }[] = [
    { key: 'obturacion_buen_estado' },
    { key: 'sellante_buen_estado' },
    { key: 'corona_buen_estado' },
    { key: 'endodoncia_realizada' },
    { key: 'implante_osteointegrado' },
    { key: 'protesis_buen_estado' },
    { key: 'aparato_ortodontico' },
    { key: 'diente_ausente_definitivo' },
    { key: 'protesis_fija_buen_estado' },
    { key: 'protesis_removible_buen_estado' },
    { key: 'pilar_protesis_buen_estado' },
    { key: 'espigo_munon_colado' },
    { key: 'diente_supernumerario' },
  ];

  const filterList = (items: { key: MinsaFindingType }[]) => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase().trim();
    return items.filter(({ key }) => {
      const meta = MINSA_FINDING_LABELS[key];
      return (
        meta?.label.toLowerCase().includes(term) ||
        meta?.description.toLowerCase().includes(term) ||
        meta?.symbol.toLowerCase().includes(term)
      );
    });
  };

  const filteredRed = filterList(redFindings);
  const filteredBlue = filterList(blueFindings);

  const surfaceNameDisplay = (s: ToothSurface | null) => {
    if (!s) return null;
    switch (s) {
      case 'vestibular':
        return 'Vestibular';
      case 'lingual':
        return 'Lingual / Palatina';
      case 'mesial':
        return 'Mesial';
      case 'distal':
        return 'Distal';
      case 'oclusal':
        return 'Oclusal / Incisal';
      case 'raiz':
        return 'Raíz Anatómica';
      default:
        return s;
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-4 transition-all">
      {/* 1. BARRA SUPERIOR DIDÁCTICA Y DE ESTADO CONTEXTUAL */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Herramienta activa:
          </span>
          {activeFindingType ? (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black shadow-xs ${
                MINSA_FINDING_LABELS[activeFindingType]?.color === 'red'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300 ring-2 ring-rose-200'
                  : 'bg-sky-100 text-sky-800 border border-sky-300 ring-2 ring-sky-200'
              }`}
            >
              <span className="font-mono text-sm">{MINSA_FINDING_LABELS[activeFindingType]?.symbol}</span>
              <span>{MINSA_FINDING_LABELS[activeFindingType]?.label}</span>
              <span className="text-[10px] font-semibold opacity-80">
                ({MINSA_FINDING_LABELS[activeFindingType]?.color === 'red' ? 'Rojo Reglamentario' : 'Azul Reglamentario'})
              </span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              <Eraser className="w-3.5 h-3.5 text-slate-500" /> Borrador / Selección libre de inspección
            </span>
          )}
        </div>

        {/* Notificación de Pieza / Cara Seleccionada */}
        {selectedToothNumber && (
          <div className="flex items-center gap-2 bg-sky-50 text-sky-900 px-3 py-1.5 rounded-xl text-xs font-medium border border-sky-200">
            <span>
              Pieza: <strong className="font-black text-sky-700 text-sm">{selectedToothNumber}</strong>
              {selectedSurface && (
                <span className="ml-1 text-sky-800 font-bold bg-white px-2 py-0.5 rounded-md border border-sky-200 shadow-2xs">
                  Cara: {surfaceNameDisplay(selectedSurface)}
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() => onClearTooth(selectedToothNumber)}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold ml-2 underline"
              title="Borrar todos los hallazgos de esta pieza"
            >
              Limpiar Pieza
            </button>
          </div>
        )}
      </div>

      {/* 2. FILTROS RÁPIDOS Y BUSCADOR DIDÁCTICO */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos los Tratamientos ({redFindings.length + blueFindings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('red')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeCategory === 'red'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Patologías / Defectuosos ({redFindings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('blue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeCategory === 'blue'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Tratados / Buen Estado ({blueFindings.length})
          </button>
        </div>

        {/* Buscador Rápido de Tratamientos */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar tratamiento o símbolo..."
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* 3. GUÍA DE INTERACCIÓN POR CARAS Y RAÍCES */}
      <div className="mb-3 px-3 py-2 bg-slate-50/80 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span>
            <strong>Interacción didáctica:</strong> Haz clic en cualquiera de las <strong>5 caras de la corona</strong> (Vestibular, Lingual/Palatina, Mesial, Distal, Oclusal) o en la <strong>Raíz</strong> para pintar de forma individual.
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSelectFindingType(null)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs shrink-0"
        >
          <Eraser className="w-3 h-3 text-slate-500" /> Modo Borrador
        </button>
      </div>

      {/* 4. GRILLAS DE HERRAMIENTAS (ROJO Y AZUL) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* GRUPO ROJO: Patologías / Defectuosos / Requeridos (COLOR ROJO) */}
        {(activeCategory === 'all' || activeCategory === 'red') && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-rose-100">
              <div className="flex items-center gap-1.5 text-rose-900 font-extrabold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>1. HALLAZGOS PATOLÓGICOS / DEFECTUOSOS (COLOR ROJO)</span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.2 rounded-full">
                {filteredRed.length} opciones
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-[300px] overflow-y-auto pr-1">
              {filteredRed.map(({ key }) => {
                const meta = MINSA_FINDING_LABELS[key];
                const isActive = activeFindingType === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSelectFindingType(key)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl text-xs font-semibold text-left transition-all ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400 font-bold scale-102'
                        : 'bg-white text-rose-950 border border-rose-200/90 hover:bg-rose-100/80 hover:border-rose-300'
                    }`}
                    title={meta?.description}
                  >
                    <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center font-black text-xs shrink-0">
                      {meta?.symbol}
                    </span>
                    <span className="truncate text-[11px] leading-tight">{meta?.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* GRUPO AZUL: Tratamientos Realizados / Buen Estado (COLOR AZUL) */}
        {(activeCategory === 'all' || activeCategory === 'blue') && (
          <div className="rounded-2xl border border-sky-200 bg-sky-50/30 p-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-sky-100">
              <div className="flex items-center gap-1.5 text-sky-900 font-extrabold text-xs">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>2. TRATAMIENTOS REALIZADOS / EN BUEN ESTADO (COLOR AZUL)</span>
              </div>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.2 rounded-full">
                {filteredBlue.length} opciones
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-[300px] overflow-y-auto pr-1">
              {filteredBlue.map(({ key }) => {
                const meta = MINSA_FINDING_LABELS[key];
                const isActive = activeFindingType === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSelectFindingType(key)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl text-xs font-semibold text-left transition-all ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-400 font-bold scale-102'
                        : 'bg-white text-sky-950 border border-sky-200/90 hover:bg-sky-100/80 hover:border-sky-300'
                    }`}
                    title={meta?.description}
                  >
                    <span className="w-5 h-5 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center font-black text-xs shrink-0">
                      {meta?.symbol}
                    </span>
                    <span className="truncate text-[11px] leading-tight">{meta?.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. PANEL DE CONTROL PARA LA PIEZA SELECCIONADA: MOVILIDAD Y NOTAS */}
      {selectedToothNumber && (
        <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/60 p-3 rounded-xl border border-slate-200 space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Selector Didáctico de Movilidad Dental (Grado I, II o III) */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1 shrink-0">
                <Activity className="w-3.5 h-3.5 text-rose-600" />
                Movilidad Dental:
              </span>
              <div className="flex items-center gap-1">
                {([0, 1, 2, 3] as const).map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => {
                      if (onChangeMobility) onChangeMobility(grade);
                      if (grade === 1) onSelectFindingType('movilidad_dental_1');
                      else if (grade === 2) onSelectFindingType('movilidad_dental_2');
                      else if (grade === 3) onSelectFindingType('movilidad_dental_3');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      selectedMobility === grade
                        ? grade === 0
                          ? 'bg-slate-700 text-white shadow-xs'
                          : 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {grade === 0 ? 'Sin Movilidad' : `Grado ${grade === 1 ? 'I' : grade === 2 ? 'II' : 'III'}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Acciones Rápidas para la Pieza */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => onApplyToSelected(activeFindingType)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Aplicar {activeFindingType ? `(${MINSA_FINDING_LABELS[activeFindingType]?.label})` : ''} a Pieza {selectedToothNumber}
              </button>
            </div>
          </div>

          {/* Campo de notas clínicas del diente */}
          <div>
            <input
              type="text"
              value={toothNotes}
              onChange={(e) => onChangeToothNotes(e.target.value)}
              placeholder={`Notas clínicas específicas para pieza ${selectedToothNumber} (ej. Caries profunda oclusal, dolor a percusión, recesión gingival 2mm)...`}
              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
            />
          </div>
        </div>
      )}
    </div>
  );
};
