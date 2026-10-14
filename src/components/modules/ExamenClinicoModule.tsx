import React from 'react';
import { PhysicalExam, StomatologicalExam, VitalSigns } from '../../types/dental';
import { HeartPulse, Stethoscope, Smile, Activity, AlertCircle } from 'lucide-react';

interface ExamenClinicoModuleProps {
  physicalExam: PhysicalExam;
  stomatologicalExam: StomatologicalExam;
  onPhysicalChange: (updated: PhysicalExam) => void;
  onStomatologicalChange: (updated: StomatologicalExam) => void;
}

export const ExamenClinicoModule: React.FC<ExamenClinicoModuleProps> = ({
  physicalExam,
  stomatologicalExam,
  onPhysicalChange,
  onStomatologicalChange,
}) => {
  const handleVitalChange = <K extends keyof VitalSigns>(field: K, value: VitalSigns[K]) => {
    const vitals = { ...physicalExam.vitalSigns, [field]: value };

    // Si cambian peso o talla, recalcular IMC
    if (field === 'weightKg' || field === 'heightCm') {
      const w = field === 'weightKg' ? Number(value) : vitals.weightKg;
      const h = field === 'heightCm' ? Number(value) : vitals.heightCm;
      if (w > 0 && h > 0) {
        const heightMeters = h / 100;
        const bmi = parseFloat((w / (heightMeters * heightMeters)).toFixed(2));
        vitals.bmi = bmi;
      }
    }

    onPhysicalChange({
      ...physicalExam,
      vitalSigns: vitals,
    });
  };

  const vitals = physicalExam.vitalSigns;
  const atm = physicalExam.atm;
  const lymph = physicalExam.lymphNodes;

  const getBmiCategory = (bmi: number) => {
    if (!bmi || bmi <= 0) return { label: 'Sin calcular', color: 'text-slate-400' };
    if (bmi < 18.5) return { label: 'Bajo Peso (<18.5)', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (bmi <= 24.9) return { label: 'Peso Normal (18.5 - 24.9)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (bmi <= 29.9) return { label: 'Sobrepeso (25.0 - 29.9)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Obesidad (≥ 30.0)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const bmiCat = getBmiCategory(vitals.bmi);

  return (
    <div className="space-y-6">
      {/* 1. Funciones Vitales y Somatometría */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-500" />
              1. Funciones Vitales y Antropometría
            </h2>
            <p className="text-xs text-slate-500">
              Evaluación clínica pre-procedimiento estomatológico del paciente
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Índice Masa Corporal (IMC):</span>
            <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
              {vitals.bmi || '--'} kg/m²
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${bmiCat.color}`}>
              {bmiCat.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Presión Arterial */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Presión Arterial (PA)
            </label>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={vitals.bloodPressure}
                onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
                placeholder="120/80"
                className="w-full text-xs font-mono font-bold px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <span className="text-[10px] text-slate-400 font-mono">mmHg</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Normal: &lt;120/80</span>
          </div>

          {/* Pulso / Frecuencia Cardiaca */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Frecuencia Cardiaca
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={vitals.pulseRate || ''}
                onChange={(e) => handleVitalChange('pulseRate', parseInt(e.target.value) || 0)}
                placeholder="72"
                className="w-full text-xs font-mono font-bold px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <span className="text-[10px] text-slate-400 font-mono">lpm</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Normal: 60-90</span>
          </div>

          {/* Temperatura */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Temperatura Corporal
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                step="0.1"
                value={vitals.temperature || ''}
                onChange={(e) => handleVitalChange('temperature', parseFloat(e.target.value) || 0)}
                placeholder="36.5"
                className="w-full text-xs font-mono font-bold px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <span className="text-[10px] text-slate-400 font-mono">°C</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Normal: 36.5-37.2</span>
          </div>

          {/* Frecuencia Respiratoria */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Frec. Respiratoria
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={vitals.respiratoryRate || ''}
                onChange={(e) => handleVitalChange('respiratoryRate', parseInt(e.target.value) || 0)}
                placeholder="18"
                className="w-full text-xs font-mono font-bold px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <span className="text-[10px] text-slate-400 font-mono">rpm</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Normal: 12-20</span>
          </div>

          {/* Peso */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Peso Corporal
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                step="0.5"
                value={vitals.weightKg || ''}
                onChange={(e) => handleVitalChange('weightKg', parseFloat(e.target.value) || 0)}
                placeholder="65"
                className="w-full text-xs font-mono font-bold px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <span className="text-[10px] text-slate-400 font-mono">kg</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">En kilogramos</span>
          </div>

          {/* Talla */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Talla / Estatura
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={vitals.heightCm || ''}
                onChange={(e) => handleVitalChange('heightCm', parseFloat(e.target.value) || 0)}
                placeholder="165"
                className="w-full text-xs font-mono font-bold px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <span className="text-[10px] text-slate-400 font-mono">cm</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">En centímetros</span>
          </div>
        </div>
      </div>

      {/* 2. Examen Físico General y Regional (Cabeza, Cuello, ATM, Ganglios) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
          <Stethoscope className="w-5 h-5 text-indigo-600" />
          2. Examen Físico General y Regional
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Estado General */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Estado General Aparente
            </label>
            <select
              value={physicalExam.generalStatus}
              onChange={(e) => onPhysicalChange({ ...physicalExam, generalStatus: e.target.value as any })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Aparente Buen Estado General (ABEG)">Aparente Buen Estado General (ABEG)</option>
              <option value="Aparente Regular Estado General (AREG)">Aparente Regular Estado General (AREG)</option>
              <option value="Aparente Mal Estado General (AMEG)">Aparente Mal Estado General (AMEG)</option>
            </select>
          </div>

          {/* Facies */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Facies
            </label>
            <select
              value={physicalExam.facies}
              onChange={(e) => onPhysicalChange({ ...physicalExam, facies: e.target.value as any })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Simétrica">Simétrica (Normal)</option>
              <option value="Asimétrica">Asimétrica (tumefacción / celulitis)</option>
              <option value="Dolorosa">Dolorosa (álgica)</option>
              <option value="Pálida">Pálida</option>
              <option value="Rubicunda">Rubicunda</option>
            </select>
          </div>

          {/* Cuello */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cuello
            </label>
            <input
              type="text"
              value={physicalExam.neck}
              onChange={(e) => onPhysicalChange({ ...physicalExam, neck: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Cilíndrico, móvil, sin adenopatías..."
            />
          </div>
        </div>

        {/* Sección Especializada: Articulación Temporomandibular (ATM) */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/90">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-sky-600" />
              Articulación Temporomandibular (ATM) y Oclusión Dinámica
            </h3>
            <span className="text-[11px] text-slate-400">Rango normal apertura: 40-50 mm</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Apertura Máxima (mm)
              </label>
              <input
                type="number"
                value={atm.maxOpeningMm}
                onChange={(e) =>
                  onPhysicalChange({
                    ...physicalExam,
                    atm: { ...atm, maxOpeningMm: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-full text-xs font-mono font-bold px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="42"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="atm-pain"
                checked={atm.hasPain}
                onChange={(e) =>
                  onPhysicalChange({
                    ...physicalExam,
                    atm: { ...atm, hasPain: e.target.checked },
                  })
                }
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
              />
              <label htmlFor="atm-pain" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Dolor a la palpación
              </label>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="atm-clicking"
                checked={atm.hasClicking}
                onChange={(e) =>
                  onPhysicalChange({
                    ...physicalExam,
                    atm: { ...atm, hasClicking: e.target.checked },
                  })
                }
                className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
              />
              <label htmlFor="atm-clicking" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Chasquidos / Ruidos
              </label>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="atm-deviation"
                checked={atm.hasDeviation}
                onChange={(e) =>
                  onPhysicalChange({
                    ...physicalExam,
                    atm: { ...atm, hasDeviation: e.target.checked },
                  })
                }
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <label htmlFor="atm-deviation" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Desviación / Deflexión
              </label>
            </div>

            <div className="sm:col-span-4">
              <input
                type="text"
                value={atm.notes}
                onChange={(e) =>
                  onPhysicalChange({
                    ...physicalExam,
                    atm: { ...atm, notes: e.target.value },
                  })
                }
                placeholder="Observaciones de ATM (ej. Chasquido recíproco polo lateral derecho al cierre, dolor en pterigoideo lateral...)"
                className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Ganglios Linfáticos Regionales */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="lymph-ade"
              checked={lymph.hasAdenopathy}
              onChange={(e) =>
                onPhysicalChange({
                  ...physicalExam,
                  lymphNodes: { ...lymph, hasAdenopathy: e.target.checked },
                })
              }
              className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
            />
            <label htmlFor="lymph-ade" className="text-xs font-bold text-slate-800 cursor-pointer">
              Adenopatías palpables
            </label>
          </div>
          <div>
            <input
              type="text"
              value={lymph.location}
              onChange={(e) =>
                onPhysicalChange({
                  ...physicalExam,
                  lymphNodes: { ...lymph, location: e.target.value },
                })
              }
              placeholder="Localización (submandibular, cervical...)"
              className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div>
            <input
              type="text"
              value={lymph.characteristics}
              onChange={(e) =>
                onPhysicalChange({
                  ...physicalExam,
                  lymphNodes: { ...lymph, characteristics: e.target.value },
                })
              }
              placeholder="Características (móvil, doloroso, consistencia...)"
              className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Examen Estomatológico (Tejidos Blandos MINSA) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-teal-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                3. Examen Estomatológico de Tejidos Blandos
              </h2>
              <p className="text-xs text-slate-500">
                Inspección sistemática de la mucosa bucal y estructuras anexas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Índice de Higiene Oral:</span>
            <select
              value={stomatologicalExam.hygieneIndex}
              onChange={(e) => onStomatologicalChange({ ...stomatologicalExam, hygieneIndex: e.target.value as any })}
              className={`text-xs font-bold px-3 py-1 rounded-lg border focus:outline-none ${
                stomatologicalExam.hygieneIndex === 'Buena'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : stomatologicalExam.hygieneIndex === 'Regular'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-rose-50 text-rose-800 border-rose-300'
              }`}
            >
              <option value="Buena">Buena (Índice de placa bajo)</option>
              <option value="Regular">Regular (Placa moderada)</option>
              <option value="Mala">Mala (Acúmulo severo de sarro/placa)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Labios */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Labios</label>
            <input
              type="text"
              value={stomatologicalExam.lips}
              onChange={(e) => onStomatologicalChange({ ...stomatologicalExam, lips: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Rosados, hidratados, sin queilitis..."
            />
          </div>

          {/* Carrillos */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Carrillos / Mucosa Yugal</label>
            <input
              type="text"
              value={stomatologicalExam.cheeks}
              onChange={(e) => onStomatologicalChange({ ...stomatologicalExam, cheeks: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Mucosa rosada, línea alba, conductos de Stenon..."
            />
          </div>

          {/* Encías */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Encías y Periodonto Marginal</label>
            <input
              type="text"
              value={stomatologicalExam.gums}
              onChange={(e) => onStomatologicalChange({ ...stomatologicalExam, gums: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Color, sangrado al sondaje, recesión, papilas..."
            />
          </div>

          {/* Lengua */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Lengua (Dorso, Bordes, Vientre)</label>
            <input
              type="text"
              value={stomatologicalExam.tongue}
              onChange={(e) => onStomatologicalChange({ ...stomatologicalExam, tongue: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Normoglosa, papilas, movilidad, saburral..."
            />
          </div>

          {/* Piso de Boca */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Piso de Boca</label>
            <input
              type="text"
              value={stomatologicalExam.floorOfMouth}
              onChange={(e) => onStomatologicalChange({ ...stomatologicalExam, floorOfMouth: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Blando, depresible, carúnculas sublinguales..."
            />
          </div>

          {/* Paladar Duro */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Paladar Duro</label>
            <input
              type="text"
              value={stomatologicalExam.hardPalate}
              onChange={(e) => onStomatologicalChange({ ...stomatologicalExam, hardPalate: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Rugosidades, torus palatino, coloración..."
            />
          </div>

          {/* Paladar Blando */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Paladar Blando y Úvula</label>
            <input
              type="text"
              value={stomatologicalExam.softPalate}
              onChange={(e) => onStomatologicalChange({ ...stomatologicalExam, softPalate: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Movilidad al fonar, úvula centrada..."
            />
          </div>

          {/* Orofaringe */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Orofaringe y Amígdalas</label>
            <input
              type="text"
              value={stomatologicalExam.oropharynx}
              onChange={(e) => onStomatologicalChange({ ...stomatologicalExam, oropharynx: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Pilares amigdalinos, exudado, congestión..."
            />
          </div>

          {/* Glándulas Salivales */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Glándulas Salivales y Saliva</label>
            <input
              type="text"
              value={stomatologicalExam.salivaryGlands}
              onChange={(e) => onStomatologicalChange({ ...stomatologicalExam, salivaryGlands: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Flujo salival normal/xerostomía, parótidas normales..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
