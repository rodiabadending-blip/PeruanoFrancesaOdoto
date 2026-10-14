import React from 'react';
import { ClinicalRecord } from '../../types/dental';
import { TOOTH_NAMES, MINSA_FINDING_LABELS } from '../odontogram/toothDefinitions';
import { PeruanoFrancesaLogo } from '../common/PeruanoFrancesaLogo';
import { Printer, ArrowLeft, Shield, AlertTriangle } from 'lucide-react';

interface PrintableViewProps {
  record: ClinicalRecord;
  onBack: () => void;
}

export const PrintableView: React.FC<PrintableViewProps> = ({ record, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const fil = record.filiation;
  const ana = record.anamnesis;
  const bg = ana.medicalBackground;
  const phy = record.physicalExam;
  const stom = record.stomatologicalExam;
  const odonto = record.odontogram;
  const teethWithFindings = Object.values(odonto.teeth).filter(
    (t) => t.wholeToothFinding || Object.keys(t.surfaces).length > 0 || t.notes
  );

  return (
    <div className="bg-white min-h-screen text-slate-900 text-xs font-sans pb-16">
      {/* Barra de control superior (Oculta al imprimir) */}
      <div className="no-print sticky top-0 z-40 bg-slate-900 text-white p-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al Dashboard
          </button>
          <span className="text-xs text-slate-300 font-mono">
            Vista de Impresión Oficial: <strong>{fil.hcNumber}</strong> ({fil.firstName} {fil.lastName})
          </span>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-bold shadow-lg transition"
        >
          <Printer className="w-4 h-4" /> Imprimir / Exportar a PDF
        </button>
      </div>

      {/* CONTENIDO IMPRIMIBLE DE LA HISTORIA CLÍNICA */}
      <div className="max-w-4xl mx-auto p-8 print:p-0 print:max-w-none space-y-6">
        {/* Encabezado Oficial con Membrete PERUANO FRANCESA */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <PeruanoFrancesaLogo size="lg" showText={false} />
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-[#0f2b48]" style={{ fontFamily: 'Georgia, serif' }}>
                PERUANO FRANCESA
              </h1>
              <div className="text-[11px] font-bold tracking-widest uppercase text-slate-600">
                CENTRO ODONTOLÓGICO • TRUJILLO - PERÚ
              </div>
              <p className="text-[10px] text-slate-700 font-semibold mt-0.5">
                HISTORIA CLÍNICA ODONTOLÓGICA • EXPEDIENTE PRIVADO
              </p>
              <p className="text-[10px] text-slate-600 font-medium">
                Dirección: Mz II lote N° 3 5ta etapa San Andres
              </p>
            </div>
          </div>

          <div className="text-right border-2 border-slate-900 p-2.5 rounded-lg bg-slate-50/50">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">N° Historia Clínica</span>
            <span className="text-sm font-mono font-black text-slate-900 block">{fil.hcNumber}</span>
            <span className="text-[10px] text-slate-500 font-mono">
              Fecha: {fil.admissionDate} {fil.admissionTime}
            </span>
          </div>
        </div>

        {/* ALERTA MÉDICA DESTACADA (SI EXISTE) */}
        {(bg.hasAllergies || bg.hasHypertension || bg.hasDiabetes || bg.hasBleedingDisorders) && (
          <div className="p-3 bg-rose-50 border-2 border-rose-500 rounded-lg text-rose-950 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="uppercase font-extrabold text-rose-800">
                ALERTAS MÉDICAS CRÍTICAS PARA LA ATENCIÓN ODONTOLÓGICA:
              </strong>
              <div className="mt-1 font-semibold flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                {bg.hasAllergies && (
                  <span className="text-rose-900">
                    • ALERGIA: {bg.allergiesDetails || 'Medicamentos'}
                  </span>
                )}
                {bg.hasHypertension && (
                  <span className="text-rose-900">• HIPERTENSIÓN ARTERIAL: {bg.hypertensionDetails}</span>
                )}
                {bg.hasDiabetes && (
                  <span className="text-rose-900">• DIABETES MELLITUS: {bg.diabetesDetails}</span>
                )}
                {bg.hasBleedingDisorders && (
                  <span className="text-rose-900">
                    • TRASTORNO HEMORRÁGICO: {bg.bleedingDisordersDetails}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* I. DATOS DE FILIACIÓN */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider bg-slate-100 p-1.5 border-l-4 border-sky-600 text-slate-800 mb-2">
            I. Datos Generales y Filiación
          </h2>
          <div className="grid grid-cols-4 gap-x-3 gap-y-1.5 text-[11px] border border-slate-200 p-2.5 rounded">
            <div>
              <span className="text-slate-500">Paciente:</span>{' '}
              <strong className="font-bold">{fil.firstName} {fil.lastName}</strong>
            </div>
            <div>
              <span className="text-slate-500">Documento:</span>{' '}
              <strong className="font-mono">{fil.docType} {fil.docNumber}</strong>
            </div>
            <div>
              <span className="text-slate-500">Edad:</span> <strong>{fil.age} años</strong> ({fil.birthDate})
            </div>
            <div>
              <span className="text-slate-500">Sexo / Grupo Rh:</span>{' '}
              <strong>{fil.sex} / {fil.bloodType}</strong>
            </div>

            <div>
              <span className="text-slate-500">Teléfono:</span>{' '}
              <strong className="font-mono">{fil.phone || 'No registra'}</strong>
            </div>
            <div>
              <span className="text-slate-500">Email:</span> {fil.email || 'No registra'}
            </div>
            <div>
              <span className="text-slate-500">Ocupación:</span> {fil.occupation || 'No registra'}
            </div>
            <div>
              <span className="text-slate-500">Estado Civil:</span> {fil.maritalStatus}
            </div>

            <div className="col-span-2">
              <span className="text-slate-500">Dirección:</span> {fil.address || 'No registra'}
            </div>
            <div className="col-span-2">
              <span className="text-slate-500">Distrito / Procedencia:</span> {fil.district || 'Lima'}
            </div>

            {fil.tutorRequired && (
              <div className="col-span-4 bg-slate-50 p-1.5 rounded mt-1 border border-slate-200">
                <span className="text-slate-500 font-bold">Apoderado Legal:</span>{' '}
                {fil.tutorName} ({fil.tutorRelationship}) • Doc: {fil.tutorDocNumber} • Tel: {fil.tutorPhone}
              </div>
            )}
          </div>
        </div>

        {/* II. ANAMNESIS */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider bg-slate-100 p-1.5 border-l-4 border-sky-600 text-slate-800 mb-2">
            II. Anamnesis
          </h2>
          <div className="border border-slate-200 p-2.5 rounded text-[11px] space-y-2">
            <div>
              <span className="font-bold text-slate-700">1. Motivo de Consulta:</span>{' '}
              <span className="italic text-slate-800">
                {ana.consultationReason || 'Paciente acude para chequeo y evaluación general.'}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-700">2. Enfermedad Actual:</span>{' '}
              <span>
                Tiempo: {ana.currentIllness.duration || 'No especifica'} • Inicio: {ana.currentIllness.symptomOnset} •
                Curso: {ana.currentIllness.course} • Síntomas: {ana.currentIllness.mainSymptoms || 'Sin dolor agudo'}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-700">3. Medicación Actual:</span>{' '}
              <span>{bg.currentMedications || 'Ninguna medicación habitual'}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700">4. Reacciones Previas:</span>{' '}
              <span>{bg.previousDentalReactions || 'Sin antecedentes adversos en atenciones previas'}</span>
            </div>
          </div>
        </div>

        {/* III. EXAMEN CLÍNICO */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider bg-slate-100 p-1.5 border-l-4 border-sky-600 text-slate-800 mb-2">
            III. Examen Clínico y Estomatológico
          </h2>
          <div className="grid grid-cols-6 gap-2 border border-slate-200 p-2 rounded text-[11px] mb-2 bg-slate-50/50">
            <div>
              <span className="text-slate-500 block text-[10px]">PA:</span>
              <strong className="font-mono">{phy.vitalSigns.bloodPressure} mmHg</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Pulso:</span>
              <strong className="font-mono">{phy.vitalSigns.pulseRate} lpm</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Temperatura:</span>
              <strong className="font-mono">{phy.vitalSigns.temperature} °C</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">FR:</span>
              <strong className="font-mono">{phy.vitalSigns.respiratoryRate} rpm</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Peso / Talla:</span>
              <strong className="font-mono">{phy.vitalSigns.weightKg}kg / {phy.vitalSigns.heightCm}cm</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">IMC:</span>
              <strong className="font-mono">{phy.vitalSigns.bmi} kg/m²</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] border border-slate-200 p-2 rounded">
            <div>
              <strong>Estado General:</strong> {phy.generalStatus} • <strong>Facies:</strong> {phy.facies}
            </div>
            <div>
              <strong>ATM:</strong> Apertura {phy.atm.maxOpeningMm}mm • Dolor:{' '}
              {phy.atm.hasPain ? 'Sí' : 'No'} • Ruidos: {phy.atm.hasClicking ? 'Sí' : 'No'}
            </div>
            <div className="col-span-2">
              <strong>Tejidos Blandos:</strong> Encías: {stom.gums} • Lengua: {stom.tongue} • Labios:{' '}
              {stom.lips} • Higiene Oral: <strong>{stom.hygieneIndex}</strong>
            </div>
          </div>
        </div>

        {/* IV. ODONTOGRAMA Y RESUMEN CPO-D */}
        <div>
          <div className="flex items-center justify-between bg-slate-100 p-1.5 border-l-4 border-sky-600 mb-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
              IV. Registro de Odontograma e Índices Epidemiológicos
            </h2>
            <div className="text-[11px] font-mono font-bold text-slate-800">
              Índice CPO-D: {odonto.cpoIndex?.totalCpo ?? 0} (C:{odonto.cpoIndex?.cariados ?? 0}, P:
              {odonto.cpoIndex?.perdidos ?? 0}, O:{odonto.cpoIndex?.obturados ?? 0}) • CEO-D:{' '}
              {odonto.cpoIndex?.ceoIndex ?? 0}
            </div>
          </div>

          {teethWithFindings.length === 0 ? (
            <p className="p-2 border border-slate-200 rounded text-center text-slate-400 italic">
              Odontograma sin hallazgos patológicos ni tratamientos previos registrados.
            </p>
          ) : (
            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] uppercase">
                  <tr>
                    <th className="p-1.5">Pieza FDI</th>
                    <th className="p-1.5">Nombre</th>
                    <th className="p-1.5">Hallazgo Clínico</th>
                    <th className="p-1.5">Superficies</th>
                    <th className="p-1.5">Notas Clínicas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teethWithFindings.map((t) => {
                    const info = TOOTH_NAMES[t.toothNumber];
                    const surfsList = Object.entries(t.surfaces)
                      .map(([s, find]) => `${s === 'raiz' ? 'RAÍZ' : s.toUpperCase().slice(0, 3)}: ${MINSA_FINDING_LABELS[find]?.label || find}`);
                    if (t.mobilityGrade) {
                      surfsList.unshift(`MOVILIDAD GRADO ${t.mobilityGrade === 1 ? 'I' : t.mobilityGrade === 2 ? 'II' : 'III'}`);
                    }
                    const surfs = surfsList.join(', ');

                    return (
                      <tr key={t.toothNumber}>
                        <td className="p-1.5 font-mono font-bold">{t.toothNumber}</td>
                        <td className="p-1.5">{info?.name || '-'}</td>
                        <td className="p-1.5 font-semibold">
                          {t.wholeToothFinding ? (
                            <span
                              className={
                                MINSA_FINDING_LABELS[t.wholeToothFinding]?.color === 'red'
                                  ? 'text-rose-700 font-bold'
                                  : 'text-sky-700 font-bold'
                              }
                            >
                              {MINSA_FINDING_LABELS[t.wholeToothFinding]?.label}
                            </span>
                          ) : (
                            'Por superficies / raíz'
                          )}
                        </td>
                        <td className="p-1.5 text-slate-700">{surfs || '-'}</td>
                        <td className="p-1.5 text-slate-600">{t.notes || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {record.odontogram.generalNotes && (
            <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded text-[11px]">
              <span className="font-bold text-slate-800">Observaciones y Notas Clínicas del Odontograma: </span>
              <span className="text-slate-700">{record.odontogram.generalNotes}</span>
            </div>
          )}
        </div>

        {/* V. PLACAS RADIOGRÁFICAS E IMÁGENES CLÍNICAS */}
        {record.dentalImages && record.dentalImages.length > 0 && (
          <div>
            <div className="flex items-center justify-between bg-slate-100 p-1.5 border-l-4 border-cyan-700 mb-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                V. Placas Radiográficas e Imágenes Clínicas ({record.dentalImages.length})
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {record.dentalImages.map((img) => (
                <div
                  key={img.id}
                  className="border border-slate-200 rounded p-2 text-[10px] bg-slate-50/50 flex gap-2.5 items-start"
                >
                  <div className="w-24 h-24 bg-slate-950 rounded shrink-0 flex items-center justify-center overflow-hidden border border-slate-300">
                    <img
                      src={img.dataUrl}
                      alt={img.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-bold text-slate-900 leading-tight">
                      {img.title}
                    </div>
                    <div className="text-slate-500 font-mono text-[9px]">
                      {img.type.toUpperCase()} • {img.date}
                      {img.toothNumber && ` • Pieza ${img.toothNumber}`}
                    </div>
                    {img.notes && (
                      <p className="text-slate-700 italic text-[9px] bg-white p-1 rounded border border-slate-100 line-clamp-3">
                        {img.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VI. DIAGNÓSTICOS CIE-10 */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider bg-slate-100 p-1.5 border-l-4 border-sky-600 text-slate-800 mb-2">
            VI. Diagnósticos (CIE-10 Odontología)
          </h2>
          <div className="border border-slate-200 rounded p-2 text-[11px] space-y-1">
            {record.diagnoses.length === 0 ? (
              <p className="text-slate-400 italic">Sin diagnósticos consignados.</p>
            ) : (
              record.diagnoses.map((d) => (
                <div key={d.id} className="flex items-center justify-between">
                  <span>
                    <strong className="font-mono text-sky-800">{d.code}</strong> - {d.description}
                  </span>
                  <span className="font-bold text-[10px] text-slate-600">[{d.type.toUpperCase()}]</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* VII. PLAN DE TRATAMIENTO */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider bg-slate-100 p-1.5 border-l-4 border-sky-600 text-slate-800 mb-2">
            VII. Plan de Tratamiento y Presupuesto
          </h2>
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] uppercase">
                <tr>
                  <th className="p-1.5">Fase</th>
                  <th className="p-1.5">Pieza</th>
                  <th className="p-1.5">Procedimiento Terapéutico</th>
                  <th className="p-1.5">Estado</th>
                  <th className="p-1.5 text-right">Costo (S/.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {record.treatmentPlan.map((tp) => (
                  <tr key={tp.id}>
                    <td className="p-1.5 font-bold text-slate-600 uppercase text-[10px]">
                      {tp.phase.replace('fase_', 'Fase ').replace('_', ' ')}
                    </td>
                    <td className="p-1.5 font-mono">{tp.toothNumber || '-'}</td>
                    <td className="p-1.5">{tp.procedure}</td>
                    <td className="p-1.5 font-semibold">{tp.status}</td>
                    <td className="p-1.5 font-mono font-bold text-right">
                      {tp.cost ? tp.cost.toFixed(2) : '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* VII. FIRMAS MÉDICO-LEGALES */}
        <div className="pt-8 grid grid-cols-2 gap-12 text-center text-[11px]">
          <div>
            {record.consent.signatureDataUrl ? (
              <img
                src={record.consent.signatureDataUrl}
                alt="Firma del Paciente"
                className="h-16 mx-auto object-contain border-b border-slate-400 mb-1"
              />
            ) : (
              <div className="h-16 border-b border-slate-400 mb-1 flex items-end justify-center text-slate-300">
                [Espacio para Firma]
              </div>
            )}
            <strong className="block text-slate-900">
              {fil.firstName} {fil.lastName}
            </strong>
            <span className="text-slate-500">
              Firma del Paciente o Apoderado ({fil.docType}: {fil.docNumber})
            </span>
          </div>

          <div>
            <div className="h-16 border-b border-slate-400 mb-1 flex items-end justify-center text-slate-400 font-mono text-[10px]">
              Sello y Firma Profesional
            </div>
            <strong className="block text-slate-900">{record.consent.doctorName || 'Dr. Gersson Anthony Valdivia Medina'}</strong>
            <span className="text-slate-500">Cirujano Dentista • {record.consent.doctorCop || 'CCDP 62958'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
