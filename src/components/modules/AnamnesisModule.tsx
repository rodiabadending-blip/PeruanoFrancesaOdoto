import React from 'react';
import { Anamnesis, MedicalBackground } from '../../types/dental';
import { ClipboardList, AlertCircle, Heart, ShieldAlert, Pill, Baby } from 'lucide-react';

interface AnamnesisModuleProps {
  anamnesis: Anamnesis;
  onChange: (updated: Anamnesis) => void;
}

export const AnamnesisModule: React.FC<AnamnesisModuleProps> = ({ anamnesis, onChange }) => {
  const handleCurrentIllnessChange = (field: keyof Anamnesis['currentIllness'], value: any) => {
    onChange({
      ...anamnesis,
      currentIllness: {
        ...anamnesis.currentIllness,
        [field]: value,
      },
    });
  };

  const handleMedicalBgChange = <K extends keyof MedicalBackground>(
    field: K,
    value: MedicalBackground[K]
  ) => {
    onChange({
      ...anamnesis,
      medicalBackground: {
        ...anamnesis.medicalBackground,
        [field]: value,
      },
    });
  };

  const bg = anamnesis.medicalBackground;

  return (
    <div className="space-y-6">
      {/* 1. Motivo de Consulta y Enfermedad Actual */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <ClipboardList className="w-5 h-5 text-sky-600" />
          Anamnesis - Relato de la Enfermedad
        </h2>

        <div className="grid grid-cols-1 gap-4 mt-4">
          {/* Motivo de Consulta (Copia literal de las palabras del paciente según MINSA) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                1. Motivo de Consulta (Relato Textual del Paciente) *
              </label>
              <span className="text-[11px] text-slate-400">
                Consignar entre comillas las palabras del paciente o apoderado
              </span>
            </div>
            <textarea
              rows={2}
              value={anamnesis.consultationReason}
              onChange={(e) => onChange({ ...anamnesis, consultationReason: e.target.value })}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans"
              placeholder='Ej: "Me duele mucho la muela de abajo al tomar agua fría y siento una punzada al masticar desde hace 3 días."'
            />
          </div>

          {/* Enfermedad Actual */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              2. Caracterización de la Enfermedad Actual
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Tiempo de Enfermedad
                </label>
                <input
                  type="text"
                  value={anamnesis.currentIllness.duration}
                  onChange={(e) => handleCurrentIllnessChange('duration', e.target.value)}
                  placeholder="ej: 4 días, 2 semanas..."
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Forma de Inicio
                </label>
                <select
                  value={anamnesis.currentIllness.symptomOnset}
                  onChange={(e) => handleCurrentIllnessChange('symptomOnset', e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="Insidioso">Insidioso (progresivo gradual)</option>
                  <option value="Brusco">Brusco (repentino / agudo)</option>
                  <option value="Asintomático">Asintomático (hallazgo casual)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Curso de la Enfermedad
                </label>
                <select
                  value={anamnesis.currentIllness.course}
                  onChange={(e) => handleCurrentIllnessChange('course', e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="Progresivo">Progresivo (aumenta intensidad)</option>
                  <option value="Intermitente">Intermitente (va y viene)</option>
                  <option value="Estacionario">Estacionario (constante)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Síntomas y Signos Principales
                </label>
                <input
                  type="text"
                  value={anamnesis.currentIllness.mainSymptoms}
                  onChange={(e) => handleCurrentIllnessChange('mainSymptoms', e.target.value)}
                  placeholder="ej: Dolor pulsátil, sensibilidad térmica al frío, tumefacción hemifacial, sangrado gingival..."
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Antecedentes Personales y Médicos (Checklist MINSA) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Antecedentes Médicos Sistémicos y Alergias
              </h2>
              <p className="text-xs text-slate-500">
                Identificación de comorbilidades y riesgo quirúrgico/farmacológico estomatológico
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            Seguridad del Paciente
          </span>
        </div>

        {/* Checklist interactivo con campos de detalle cuando está activo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Alergias a Medicamentos (MÁXIMA PRIORIDAD) */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              bg.hasAllergies
                ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bg.hasAllergies}
                  onChange={(e) => handleMedicalBgChange('hasAllergies', e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                />
                <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Alergias a Medicamentos / Sustancias
                </span>
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900 uppercase">
                {bg.hasAllergies ? 'ALERTA ACTIVA' : 'No refiere'}
              </span>
            </div>
            {bg.hasAllergies && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={bg.allergiesDetails}
                  onChange={(e) => handleMedicalBgChange('allergiesDetails', e.target.value)}
                  placeholder="Detallar fármaco: Penicilina, AINEs, Anestésicos locales, Látex..."
                  className="w-full text-xs px-3 py-1.5 bg-white border border-rose-300 rounded-lg text-rose-950 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            )}
          </div>

          {/* Hipertensión Arterial */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              bg.hasHypertension ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bg.hasHypertension}
                  onChange={(e) => handleMedicalBgChange('hasHypertension', e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-amber-600" />
                  Hipertensión Arterial (HTA)
                </span>
              </label>
              <span className="text-[10px] font-semibold text-slate-500">
                {bg.hasHypertension ? 'Positivo' : 'Negativo'}
              </span>
            </div>
            {bg.hasHypertension && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={bg.hypertensionDetails}
                  onChange={(e) => handleMedicalBgChange('hypertensionDetails', e.target.value)}
                  placeholder="Tratamiento antihipertensivo actual, última cifra de PA..."
                  className="w-full text-xs px-3 py-1.5 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}
          </div>

          {/* Diabetes Mellitus */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              bg.hasDiabetes ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bg.hasDiabetes}
                  onChange={(e) => handleMedicalBgChange('hasDiabetes', e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-slate-800">Diabetes Mellitus</span>
              </label>
              <span className="text-[10px] font-semibold text-slate-500">
                {bg.hasDiabetes ? 'Positivo' : 'Negativo'}
              </span>
            </div>
            {bg.hasDiabetes && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={bg.diabetesDetails}
                  onChange={(e) => handleMedicalBgChange('diabetesDetails', e.target.value)}
                  placeholder="Tipo 1 o 2, Insulina / Metformina, última glicemia o HbA1c..."
                  className="w-full text-xs px-3 py-1.5 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}
          </div>

          {/* Trastornos de Hemorragia / Coagulación */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              bg.hasBleedingDisorders ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bg.hasBleedingDisorders}
                  onChange={(e) => handleMedicalBgChange('hasBleedingDisorders', e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                />
                <span className="text-xs font-bold text-slate-800">
                  Hemorragias / Trastornos de Coagulación / Anticoagulantes
                </span>
              </label>
              <span className="text-[10px] font-semibold text-slate-500">
                {bg.hasBleedingDisorders ? 'Positivo' : 'Negativo'}
              </span>
            </div>
            {bg.hasBleedingDisorders && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={bg.bleedingDisordersDetails}
                  onChange={(e) => handleMedicalBgChange('bleedingDisordersDetails', e.target.value)}
                  placeholder="Warfarina, Aspirina, tiempo de sangría prolongado..."
                  className="w-full text-xs px-3 py-1.5 bg-white border border-rose-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            )}
          </div>

          {/* Cardiopatías */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              bg.hasHeartDisease ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bg.hasHeartDisease}
                  onChange={(e) => handleMedicalBgChange('hasHeartDisease', e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-slate-800">
                  Cardiopatías / Válvulas / Endocarditis Previa
                </span>
              </label>
              <span className="text-[10px] font-semibold text-slate-500">
                {bg.hasHeartDisease ? 'Positivo' : 'Negativo'}
              </span>
            </div>
            {bg.hasHeartDisease && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={bg.heartDiseaseDetails}
                  onChange={(e) => handleMedicalBgChange('heartDiseaseDetails', e.target.value)}
                  placeholder="Requiere profilaxis antibiótica, marcapasos..."
                  className="w-full text-xs px-3 py-1.5 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}
          </div>

          {/* Asma / Respiratorias */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              bg.hasRespiratoryDisease ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bg.hasRespiratoryDisease}
                  onChange={(e) => handleMedicalBgChange('hasRespiratoryDisease', e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-slate-800">
                  Asma Bronquial / Enfermedad Respiratoria
                </span>
              </label>
              <span className="text-[10px] font-semibold text-slate-500">
                {bg.hasRespiratoryDisease ? 'Positivo' : 'Negativo'}
              </span>
            </div>
            {bg.hasRespiratoryDisease && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={bg.respiratoryDiseaseDetails}
                  onChange={(e) => handleMedicalBgChange('respiratoryDiseaseDetails', e.target.value)}
                  placeholder="Inhaladores de rescate (Salbutamol), desencadenantes..."
                  className="w-full text-xs px-3 py-1.5 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}
          </div>

          {/* Embarazo / Gestación */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              bg.isPregnant ? 'bg-purple-50/70 border-purple-300' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bg.isPregnant}
                  onChange={(e) => handleMedicalBgChange('isPregnant', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                />
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Baby className="w-4 h-4 text-purple-600" />
                  Paciente en Estado de Gestación / Embarazo
                </span>
              </label>
              <span className="text-[10px] font-semibold text-slate-500">
                {bg.isPregnant ? 'Gestando' : 'No'}
              </span>
            </div>
            {bg.isPregnant && (
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-xs text-slate-600">Semanas de gestación:</span>
                <input
                  type="number"
                  value={bg.gestationWeeks || ''}
                  onChange={(e) => handleMedicalBgChange('gestationWeeks', parseInt(e.target.value) || 0)}
                  placeholder="ej: 16"
                  className="w-24 text-xs px-2.5 py-1.5 bg-white border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <span className="text-[11px] text-purple-800 italic">
                  (2° trimestre es el óptimo para tratamientos electivos)
                </span>
              </div>
            )}
          </div>

          {/* Hepatitis / Renal */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              bg.hasHepatitis || bg.hasKidneyDisease ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bg.hasHepatitis}
                  onChange={(e) => handleMedicalBgChange('hasHepatitis', e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-slate-800">
                  Hepatitis / Afección Hepática o Renal
                </span>
              </label>
              <span className="text-[10px] font-semibold text-slate-500">
                {bg.hasHepatitis ? 'Positivo' : 'Negativo'}
              </span>
            </div>
            {bg.hasHepatitis && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={bg.hepatitisDetails}
                  onChange={(e) => handleMedicalBgChange('hepatitisDetails', e.target.value)}
                  placeholder="Tipo de hepatitis, insuficiencia renal, diálisis..."
                  className="w-full text-xs px-3 py-1.5 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Campos Generales de Medicación y Reacciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-sky-600" />
              Medicación Habitual que Toma Actualmente
            </label>
            <textarea
              rows={2}
              value={bg.currentMedications}
              onChange={(e) => handleMedicalBgChange('currentMedications', e.target.value)}
              placeholder="Fármaco, dosis y frecuencia..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Reacciones Previas en Consultorio Dental
            </label>
            <textarea
              rows={2}
              value={bg.previousDentalReactions}
              onChange={(e) => handleMedicalBgChange('previousDentalReactions', e.target.value)}
              placeholder="Síncope, taquicardia con anestesia, vómitos, hematomas..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Antecedentes Médicos Familiares
            </label>
            <textarea
              rows={2}
              value={bg.familyHistory}
              onChange={(e) => handleMedicalBgChange('familyHistory', e.target.value)}
              placeholder="Diabetes, hipertensión o neoplasias en padres o hermanos..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
