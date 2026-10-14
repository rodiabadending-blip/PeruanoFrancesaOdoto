import { ClinicalRecord, OdontogramState } from '../types/dental';

export function calculateCpoIndex(teeth: OdontogramState['teeth']) {
  let c = 0;
  let p = 0;
  let o = 0;
  let ceo = 0;

  Object.values(teeth).forEach(t => {
    if (t.isDeciduous) {
      if (t.wholeToothFinding === 'caries' || Object.values(t.surfaces).includes('caries')) {
        ceo++;
      } else if (t.wholeToothFinding === 'diente_ausente_extraer' || t.wholeToothFinding === 'resto_radicular') {
        ceo++;
      } else if (t.wholeToothFinding === 'obturacion_buen_estado' || Object.values(t.surfaces).includes('obturacion_buen_estado')) {
        ceo++;
      }
    } else {
      // Cariados (C)
      const hasCaries =
        t.wholeToothFinding === 'caries' ||
        t.wholeToothFinding === 'resto_radicular' ||
        t.wholeToothFinding === 'corona_defectuosa' ||
        Object.values(t.surfaces).includes('caries') ||
        Object.values(t.surfaces).includes('obturacion_defectuosa');
      if (hasCaries) c++;

      // Perdidos (P)
      const isLost =
        t.wholeToothFinding === 'diente_ausente_definitivo' ||
        t.wholeToothFinding === 'diente_ausente_extraer';
      if (isLost) p++;

      // Obturados (O)
      const isRestored =
        (t.wholeToothFinding === 'obturacion_buen_estado' ||
          t.wholeToothFinding === 'corona_buen_estado' ||
          t.wholeToothFinding === 'protesis_fija_buen_estado' ||
          Object.values(t.surfaces).includes('obturacion_buen_estado')) &&
        !hasCaries;
      if (isRestored) o++;
    }
  });

  return {
    cariados: c,
    perdidos: p,
    obturados: o,
    totalCpo: c + p + o,
    ceoIndex: ceo,
  };
}

export const INITIAL_RECORD: ClinicalRecord = {
  id: 'rec_valmed_001',
  filiation: {
    hcNumber: 'HC-2026-0842',
    admissionDate: '2026-10-04',
    admissionTime: '10:30',
    firstName: 'Valeria Sofía',
    lastName: 'Mendoza Alarcón',
    docType: 'DNI',
    docNumber: '72489102',
    birthDate: '1998-04-15',
    age: 28,
    sex: 'Femenino',
    bloodType: 'O+',
    phone: '+51 984 521 893',
    email: 'valeria.mendoza@email.pe',
    address: 'Av. Dos de Mayo 1420, Dpto 402',
    district: 'San Isidro, Lima',
    occupation: 'Arquitecta de Interiores',
    birthPlace: 'Lima, Perú',
    maritalStatus: 'Soltero(a)',
    tutorRequired: false,
    tutorName: '',
    tutorDocNumber: '',
    tutorRelationship: '',
    tutorPhone: '',
  },
  anamnesis: {
    consultationReason: 'Paciente acude refiriendo: "Siento molestia y dolor agudo al masticar alimentos duros y con bebidas frías en la muela de abajo a la derecha desde hace 4 días."',
    currentIllness: {
      symptomOnset: 'Insidioso, hace aproximadamente 2 semanas con molestia leve al comer dulces, intensificándose hace 4 días.',
      duration: '4 días de dolor agudo',
      course: 'Progresivo',
      mainSymptoms: 'Dolor punzante localizado a la masticación en molar inferior derecho, sensibilidad marcada a estímulos térmicos fríos que cede lentamente.',
    },
    medicalBackground: {
      hasHypertension: true,
      hypertensionDetails: 'HTA controlada con Losartán 50mg/día. Último control cardiológico hace 2 meses.',
      hasDiabetes: false,
      diabetesDetails: '',
      hasHeartDisease: false,
      heartDiseaseDetails: '',
      hasHepatitis: false,
      hepatitisDetails: '',
      hasBleedingDisorders: false,
      bleedingDisordersDetails: '',
      hasRespiratoryDisease: false,
      respiratoryDiseaseDetails: '',
      hasKidneyDisease: false,
      kidneyDiseaseDetails: '',
      hasAllergies: true,
      allergiesDetails: 'ALERGIA SEVERA A PENICILINA y derivados betalactámicos (urticaria generalizada y edema facial). Usar Clindamicina o Azitromicina.',
      isPregnant: false,
      gestationWeeks: undefined,
      isBreastfeeding: false,
      currentMedications: 'Losartán 50mg vo cada 24 horas por la mañana.',
      previousDentalReactions: 'Refiere anestesia infiltrativa previa con Lidocaína sin complicaciones adversas.',
      familyHistory: 'Madre hipertensa. Padre con antecedente de diabetes mellitus tipo 2.',
    },
  },
  physicalExam: {
    vitalSigns: {
      bloodPressure: '124/82',
      pulseRate: 74,
      temperature: 36.6,
      respiratoryRate: 18,
      weightKg: 58.5,
      heightCm: 164,
      bmi: 21.75, // Normal
    },
    generalStatus: 'Aparente Buen Estado General (ABEG)',
    facies: 'Simétrica',
    neck: 'Cilíndrico, móvil, sin adenopatías palpables, glándula tiroides no palpable.',
    atm: {
      maxOpeningMm: 44,
      hasPain: false,
      hasClicking: false,
      hasDeviation: false,
      notes: 'Movimientos de apertura y lateralidad dentro de los parámetros normales sin chasquido ni deflexión.',
    },
    lymphNodes: {
      hasAdenopathy: false,
      location: 'Submandibulares y cervicales',
      characteristics: 'No se palpan adenopatías dolorosas ni de consistencia patológica.',
    },
  },
  stomatologicalExam: {
    lips: 'Rosados, hidratados, consistencia elástica, sin queilitis ni lesiones aftosas.',
    cheeks: 'Mucosa yugal rosada, conducto de Stenon permeable con flujo salival seroso normal bilateral.',
    gums: 'Encía marginal eritematosa en sector anteroinferior con leve sangrado al sondaje leve (BOP+), papilas íntegras.',
    tongue: 'Saburral leve en dorso posterior, bordes laterales normotróficos sin induraciones.',
    floorOfMouth: 'Blando, depresible, conductos de Wharton permeables.',
    hardPalate: 'Rugosidades palatinas prominentes, bóveda de morfología ojival moderada.',
    softPalate: 'Móvil, mucosa de coloración uniforme, úvula centrada.',
    oropharynx: 'Amígdalas sin exudados ni signos inflamatorios agudos.',
    salivaryGlands: 'Glándulas submaxilares y parótidas normofuncionantes a la palpación bimanual.',
    hygieneIndex: 'Regular',
  },
  odontogram: {
    lastUpdated: '2026-10-04T10:45:00Z',
    teeth: {
      18: { toothNumber: 18, isDeciduous: false, wholeToothFinding: 'diente_ausente_definitivo', surfaces: {} },
      16: { toothNumber: 16, isDeciduous: false, wholeToothFinding: 'corona_buen_estado', surfaces: {} },
      24: {
        toothNumber: 24,
        isDeciduous: false,
        wholeToothFinding: 'fractura',
        surfaces: { mesial: 'fractura', oclusal: 'fractura' },
        notes: 'Fractura del ángulo cuspídeo vestibular sin compromiso pulpar evidente.',
      },
      36: {
        toothNumber: 36,
        isDeciduous: false,
        surfaces: { oclusal: 'obturacion_buen_estado' },
        materials: { oclusal: 'Resina' },
      },
      46: {
        toothNumber: 46,
        isDeciduous: false,
        surfaces: { oclusal: 'caries', distal: 'caries' },
        notes: 'Caries dentinaria profunda en caras oclusal y distal. Posible cercanía pulpar.',
      },
      47: {
        toothNumber: 47,
        isDeciduous: false,
        surfaces: { oclusal: 'sellante_buen_estado' },
      },
    },
    cpoIndex: {
      cariados: 2,
      perdidos: 1,
      obturados: 2,
      totalCpo: 5,
      ceoIndex: 0,
    },
    generalNotes: 'Presencia de placa bacteriana moderada en caras linguales de incisivos inferiores.',
  },
  dentalImages: [
    {
      id: 'img-demo-1',
      title: 'Placa Periapical - Pieza 46',
      type: 'periapical',
      date: '2026-10-04',
      toothNumber: 46,
      fileName: 'rx_periapical_pieza_46.jpg',
      fileSize: 184500,
      tags: ['Diagnóstico Inicial', 'Pre-operatorio'],
      notes: 'Zona radiolúcida coronal compatible con caries de dentina en cara oclusal y distal. Espacio de ligamento periodontal íntegro, sin rarefacción periapical visible.',
      createdAt: '2026-10-04T10:45:00Z',
      dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750"><rect width="600" height="750" fill="%230f141a"/><rect x="25" y="25" width="550" height="700" rx="16" fill="%231a202c" stroke="%23334155" stroke-width="3"/><path d="M50 480 Q 200 450 300 470 T 550 490 L 550 710 L 50 710 Z" fill="%232d3748" opacity="0.85"/><g stroke="%234a5568" stroke-width="1" opacity="0.4"><line x1="80" y1="520" x2="160" y2="560"/><line x1="200" y1="500" x2="280" y2="540"/><line x1="320" y1="520" x2="400" y2="550"/><line x1="420" y1="510" x2="510" y2="560"/><line x1="120" y1="600" x2="220" y2="650"/><line x1="300" y1="600" x2="420" y2="660"/></g><g fill="%23cbd5e1" stroke="%2394a3b8" stroke-width="2"><path d="M 180 280 C 180 200, 240 180, 300 180 C 360 180, 420 200, 420 280 C 420 340, 410 400, 390 440 C 370 480, 380 580, 360 620 C 350 640, 330 635, 325 600 C 320 540, 315 480, 300 460 C 285 480, 280 540, 275 600 C 270 635, 250 640, 240 620 C 220 580, 230 480, 210 440 C 190 400, 180 340, 180 280 Z"/><path d="M 235 250 C 235 220, 260 210, 300 210 C 340 210, 365 220, 365 250 C 365 300, 350 380, 345 420 C 340 460, 345 540, 340 590 C 335 590, 335 520, 330 470 C 320 400, 310 380, 300 380 C 290 380, 280 400, 270 470 C 265 520, 265 590, 260 590 C 255 540, 260 460, 255 420 C 250 380, 235 300, 235 250 Z" fill="%23334155"/><path d="M 330 200 C 360 200, 385 215, 385 240 C 385 260, 360 270, 340 260 C 325 250, 320 220, 330 200 Z" fill="%231e293b" stroke="%23475569" stroke-width="1.5"/></g><text x="60" y="80" fill="%2394a3b8" font-family="monospace" font-size="20" font-weight="bold">RX PERIAPICAL: PZ 46</text><text x="60" y="110" fill="%2364748b" font-family="monospace" font-size="14">FECHA: 2026-10-04 • VALMED CLINIC</text><text x="440" y="80" fill="%23f43f5e" font-family="monospace" font-size="16" font-weight="bold">D / M</text><rect x="330" y="195" width="60" height="70" rx="6" fill="none" stroke="%23ef4444" stroke-width="2" stroke-dasharray="4,4"/><text x="400" y="235" fill="%23ef4444" font-family="sans-serif" font-size="13" font-weight="bold">Caries OD</text></svg>',
    },
    {
      id: 'img-demo-2',
      title: 'Radiografía Panorámica Digital',
      type: 'panoramica',
      date: '2026-10-04',
      fileName: 'ortopantomografia_inicial.jpg',
      fileSize: 420000,
      tags: ['Estudio Panorámico', 'Plan General'],
      notes: 'Evaluación de cóndilos mandibulares simétricos. Senos maxilares neumatizados. Ausencia de pieza 18. Piezas 38 y 48 presentes en posición vertical. Crestas óseas conservadas.',
      createdAt: '2026-10-04T10:50:00Z',
      dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500" viewBox="0 0 900 500"><rect width="900" height="500" fill="%230b0f14"/><rect x="20" y="20" width="860" height="460" rx="12" fill="%23161c24" stroke="%23334155" stroke-width="2"/><ellipse cx="450" cy="180" rx="280" ry="110" fill="none" stroke="%23334155" stroke-width="28" opacity="0.6"/><ellipse cx="450" cy="300" rx="310" ry="130" fill="none" stroke="%23475569" stroke-width="36" opacity="0.7"/><g fill="%23cbd5e1" stroke="%2364748b" stroke-width="1.5"><rect x="430" y="190" width="18" height="40" rx="4"/><rect x="452" y="190" width="18" height="40" rx="4"/><rect x="405" y="195" width="18" height="38" rx="4"/><rect x="477" y="195" width="18" height="38" rx="4"/><rect x="380" y="200" width="20" height="42" rx="4"/><rect x="500" y="200" width="20" height="42" rx="4"/><rect x="350" y="205" width="24" height="44" rx="5"/><rect x="526" y="205" width="24" height="44" rx="5"/><rect x="315" y="210" width="28" height="46" rx="5"/><rect x="557" y="210" width="28" height="46" rx="5"/><rect x="275" y="215" width="34" height="48" rx="6"/><rect x="591" y="215" width="34" height="48" rx="6"/><rect x="235" y="220" width="34" height="48" rx="6"/><rect x="631" y="220" width="34" height="48" rx="6"/><rect x="435" y="250" width="14" height="38" rx="3"/><rect x="451" y="250" width="14" height="38" rx="3"/><rect x="415" y="250" width="15" height="38" rx="3"/><rect x="470" y="250" width="15" height="38" rx="3"/><rect x="390" y="250" width="20" height="42" rx="4"/><rect x="490" y="250" width="20" height="42" rx="4"/><rect x="360" y="250" width="24" height="44" rx="5"/><rect x="516" y="250" width="24" height="44" rx="5"/><rect x="325" y="250" width="28" height="46" rx="5"/><rect x="547" y="250" width="28" height="46" rx="5"/><rect x="285" y="250" width="34" height="48" rx="6"/><rect x="581" y="250" width="34" height="48" rx="6"/><rect x="245" y="250" width="34" height="48" rx="6"/><rect x="621" y="250" width="34" height="48" rx="6"/></g><text x="45" y="65" fill="%23cbd5e1" font-family="monospace" font-size="18" font-weight="bold">ORTOPANTOMOGRAFÍA DIGITAL (PANORÁMICA)</text><text x="45" y="90" fill="%2364748b" font-family="monospace" font-size="13">VALERIA SOFÍA CHÁVEZ • HC-2026-0842 • 2026-10-04</text><text x="50" y="450" fill="%2394a3b8" font-family="sans-serif" font-size="14" font-weight="bold">DERECHA (R)</text><text x="750" y="450" fill="%2394a3b8" font-family="sans-serif" font-size="14" font-weight="bold">IZQUIERDA (L)</text></svg>',
    },
    {
      id: 'img-demo-3',
      title: 'Fotografía Intraoral - Frente y Sonrisa',
      type: 'foto_intraoral',
      date: '2026-10-04',
      fileName: 'foto_clinica_frente.jpg',
      fileSize: 245000,
      tags: ['Registro Fotográfico', 'Estética'],
      notes: 'Línea de la sonrisa media. Encía marginal con leve eritema interpapilar anteroinferior. Oclusión clase I.',
      createdAt: '2026-10-04T10:55:00Z',
      dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="600" height="450" fill="%231e293b"/><rect x="20" y="20" width="560" height="410" rx="10" fill="%230f172a" stroke="%23334155" stroke-width="2"/><path d="M 120 200 Q 300 130 480 200 Q 300 240 120 200 Z" fill="%23be185d" opacity="0.6"/><path d="M 140 220 Q 300 310 460 220 Q 300 260 140 220 Z" fill="%23be185d" opacity="0.6"/><g fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="1.5"><rect x="270" y="175" width="28" height="45" rx="5"/><rect x="302" y="175" width="28" height="45" rx="5"/><rect x="238" y="180" width="26" height="40" rx="5"/><rect x="336" y="180" width="26" height="40" rx="5"/><rect x="210" y="185" width="24" height="40" rx="6"/><rect x="366" y="185" width="24" height="40" rx="6"/><rect x="180" y="190" width="26" height="38" rx="6"/><rect x="394" y="190" width="26" height="38" rx="6"/><rect x="280" y="222" width="18" height="36" rx="4"/><rect x="302" y="222" width="18" height="36" rx="4"/><rect x="258" y="222" width="18" height="36" rx="4"/><rect x="324" y="222" width="18" height="36" rx="4"/><rect x="234" y="222" width="20" height="38" rx="5"/><rect x="346" y="222" width="20" height="38" rx="5"/></g><text x="40" y="60" fill="%23f1f5f9" font-family="sans-serif" font-size="16" font-weight="bold">FOTOGRAFÍA INTRAORAL FRONTAL</text><text x="40" y="85" fill="%2394a3b8" font-family="monospace" font-size="12">REGISTRO CLÍNICO • VALERIA SOFÍA CHÁVEZ</text></svg>',
    },
  ],
  diagnoses: [
    {
      id: 'diag-1',
      code: 'K02.1',
      description: 'Caries de la dentina en pieza 46 (caras Oclusal-Distal)',
      toothNumber: 46,
      type: 'Definitivo',
      date: '2026-10-04',
    },
    {
      id: 'diag-2',
      code: 'S02.5',
      description: 'Fractura dental en esmalte y dentina sin compromiso pulpar en pieza 24',
      toothNumber: 24,
      type: 'Definitivo',
      date: '2026-10-04',
    },
    {
      id: 'diag-3',
      code: 'K05.1',
      description: 'Gingivitis crónica marginal generalizada inducida por biopelícula',
      type: 'Definitivo',
      date: '2026-10-04',
    },
    {
      id: 'diag-4',
      code: 'K08.1',
      description: 'Pérdida de piezas dentarias por extracción previa (pieza 18)',
      toothNumber: 18,
      type: 'Definitivo',
      date: '2026-10-04',
    },
  ],
  treatmentPlan: [
    {
      id: 'tp-1',
      phase: 'fase_1_sistematica',
      procedure: 'Revisión y alerta médica: Protocolo para paciente con ALERGIA A PENICILINA e Hipertensión Arterial controlada.',
      cost: 0,
      status: 'Completado',
      notes: 'Anamnesis firmada y registrada en historia clínica.',
    },
    {
      id: 'tp-2',
      phase: 'fase_2_higienica',
      procedure: 'Profilaxis dental completa, destartraje supra/subgingival ultrasónico y fisioterapia oral (técnica de Bass modificada).',
      cost: 150,
      status: 'Pendiente',
      notes: 'Control del índice de placa O’Leary en 15 días.',
    },
    {
      id: 'tp-3',
      phase: 'fase_3_correctiva',
      toothNumber: 46,
      procedure: 'Eliminación de caries, protección pulpar indirecta (ionómero vítreo) y obturación compuesta de resina estética nanohíbrida OD.',
      cost: 220,
      status: 'Pendiente',
      notes: 'Aislamiento absoluto con dique de goma.',
    },
    {
      id: 'tp-4',
      phase: 'fase_3_correctiva',
      toothNumber: 24,
      procedure: 'Reconstrucción estética de fractura coronaria con resina de alta resistencia y estratificación.',
      cost: 190,
      status: 'Pendiente',
      notes: 'Verificar oclusión en desoclusión canina.',
    },
    {
      id: 'tp-5',
      phase: 'fase_4_mantenimiento',
      procedure: 'Control radiográfico periapical de pieza 46 y mantenimiento periodontal semestral.',
      cost: 80,
      status: 'Pendiente',
      notes: 'Cita programada para abril 2027.',
    },
  ],
  evolutions: [
    {
      id: 'evo-1',
      date: '2026-10-04 11:15',
      toothNumber: 46,
      diagnosis: 'K02.1 Caries dentinaria OD con hipersensibilidad',
      procedurePerformed: 'Apertura de cavidad exploratoria bajo anestesia infiltrativa sin vasoconstrictor (Mepivacaína al 3%). Limpieza cavitaria y colocación de cura provisional con cemento de óxido de zinc-eugenol.',
      prescriptions: 'Ibuprofeno 400 mg VO cada 8 horas por 3 días condicionado al dolor. Cita programada para obturación definitiva.',
      doctorName: 'Dr. Gersson Anthony Valdivia Medina',
      doctorCop: 'CCDP 62958',
      signed: true,
    },
  ],
  consent: {
    procedureTitle: 'Tratamiento Restaurador y Terapéutica Odontológica Integral',
    patientFullName: 'Valeria Sofía Mendoza Alarcón',
    patientDoc: '72489102',
    isRepresentative: false,
    riskDetails: 'Se me ha explicado detalladamente el diagnóstico, alternativas, beneficios y posibles riesgos inherentes a los procedimientos odontológicos (hipersensibilidad postoperatoria, necesidad imprevista de endodoncia en cavidades profundas, posibles reacciones alérgicas). Declaro haber brindado información fidedigna sobre mi salud general y alergias (Alergia a Penicilina).',
    doctorName: 'Dr. Gersson Anthony Valdivia Medina',
    doctorCop: 'CCDP 62958',
    agreed: true,
    signatureDate: '2026-10-04',
  },
  auditTrail: [
    {
      timestamp: '2026-10-04T10:30:00Z',
      userName: 'Dr. Gersson Anthony Valdivia Medina (CCDP 62958)',
      action: 'Apertura de Historia Clínica y Filiación',
      module: 'Filiación',
    },
    {
      timestamp: '2026-10-04T10:45:00Z',
      userName: 'Dr. Gersson Anthony Valdivia Medina (CCDP 62958)',
      action: 'Registro de Odontograma Inicial y Diagnósticos CIE-10',
      module: 'Odontograma',
    },
  ],
  createdAt: '2026-10-04T10:30:00Z',
  updatedAt: '2026-10-04T11:20:00Z',
  lastSavedAt: '2026-10-04T11:20:00Z',
  syncStatus: 'synced',
};

export const SECONDARY_RECORD: ClinicalRecord = {
  id: 'rec_valmed_002',
  filiation: {
    hcNumber: 'HC-2026-0843',
    admissionDate: '2026-10-03',
    admissionTime: '15:00',
    firstName: 'Mateo Nicolás',
    lastName: 'García Paredes',
    docType: 'DNI',
    docNumber: '88392014',
    birthDate: '2019-07-22',
    age: 7,
    sex: 'Masculino',
    bloodType: 'A+',
    phone: '+51 977 123 456',
    email: 'contacto.padre@email.pe',
    address: 'Calle Las Begonias 320',
    district: 'Miraflores, Lima',
    occupation: 'Estudiante (Primaria)',
    birthPlace: 'Lima, Perú',
    maritalStatus: 'Menor de edad',
    tutorRequired: true,
    tutorName: 'Carmen Paredes Zegarra',
    tutorDocNumber: '40192837',
    tutorRelationship: 'Madre',
    tutorPhone: '+51 977 123 456',
  },
  anamnesis: {
    consultationReason: 'Madre refiere: "Traigo a mi hijo para su control odontológico escolar y porque noté manchitas negras en sus muelitas de leche de arriba."',
    currentIllness: {
      symptomOnset: 'Aproximadamente 1 mes de evolución asintomático.',
      duration: '1 mes',
      course: 'Estacionario',
      mainSymptoms: 'Sin sintomatología dolorosa espontánea ni a la masticación.',
    },
    medicalBackground: {
      hasHypertension: false,
      hypertensionDetails: '',
      hasDiabetes: false,
      diabetesDetails: '',
      hasHeartDisease: false,
      heartDiseaseDetails: '',
      hasHepatitis: false,
      hepatitisDetails: '',
      hasBleedingDisorders: false,
      bleedingDisordersDetails: '',
      hasRespiratoryDisease: true,
      respiratoryDiseaseDetails: 'Asma bronquial infantil en tratamiento con Salbutamol inhalador a demanda.',
      hasKidneyDisease: false,
      kidneyDiseaseDetails: '',
      hasAllergies: false,
      allergiesDetails: '',
      isPregnant: false,
      isBreastfeeding: false,
      currentMedications: 'Salbutamol inhalador ante crisis asmática.',
      previousDentalReactions: 'Primera atención odontológica formal.',
      familyHistory: 'Madre asmática.',
    },
  },
  physicalExam: {
    vitalSigns: {
      bloodPressure: '95/60',
      pulseRate: 88,
      temperature: 36.5,
      respiratoryRate: 22,
      weightKg: 24,
      heightCm: 122,
      bmi: 16.12, // Normal pediátrico
    },
    generalStatus: 'Aparente Buen Estado General (ABEG)',
    facies: 'Simétrica',
    neck: 'Normal sin adenopatías palpables.',
    atm: {
      maxOpeningMm: 38,
      hasPain: false,
      hasClicking: false,
      hasDeviation: false,
      notes: 'Sin alteraciones articulares.',
    },
    lymphNodes: {
      hasAdenopathy: false,
      location: 'Ganglios normales',
      characteristics: 'No reactivos',
    },
  },
  stomatologicalExam: {
    lips: 'Hidratados sin queilitis.',
    cheeks: 'Mucosa rosada húmeda normal.',
    gums: 'Gingivitis marginal localizada por acumulación de placa en molares.',
    tongue: 'Normoglosa.',
    floorOfMouth: 'Normal.',
    hardPalate: 'Normal.',
    softPalate: 'Normal.',
    oropharynx: 'Amígdalas eutróficas.',
    salivaryGlands: 'Normales.',
    hygieneIndex: 'Regular',
  },
  odontogram: {
    lastUpdated: '2026-10-03T15:20:00Z',
    teeth: {
      54: {
        toothNumber: 54,
        isDeciduous: true,
        surfaces: { oclusal: 'caries' },
        notes: 'Caries de esmalte en fosas y fisuras.',
      },
      64: {
        toothNumber: 64,
        isDeciduous: true,
        surfaces: { oclusal: 'caries' },
        notes: 'Caries en esmalte sin dolor.',
      },
      16: {
        toothNumber: 16,
        isDeciduous: false,
        surfaces: { oclusal: 'sellante_buen_estado' },
      },
      26: {
        toothNumber: 26,
        isDeciduous: false,
        surfaces: { oclusal: 'sellante_buen_estado' },
      },
    },
    cpoIndex: {
      cariados: 0,
      perdidos: 0,
      obturados: 2,
      totalCpo: 2,
      ceoIndex: 2,
    },
  },
  dentalImages: [],
  diagnoses: [
    {
      id: 'd-ped-1',
      code: 'K02.0',
      description: 'Caries limitada al esmalte en piezas deciduas 54 y 64',
      type: 'Definitivo',
      date: '2026-10-03',
    },
  ],
  treatmentPlan: [
    {
      id: 'tp-ped-1',
      phase: 'fase_2_higienica',
      procedure: 'Profilaxis dental y aplicación tópica de flúor barniz al 5%.',
      cost: 120,
      status: 'Completado',
    },
    {
      id: 'tp-ped-2',
      phase: 'fase_3_correctiva',
      toothNumber: 54,
      procedure: 'Remineralización y sellante terapéutico resinoso en pieza 54.',
      cost: 70,
      status: 'Pendiente',
    },
  ],
  evolutions: [],
  consent: {
    procedureTitle: 'Odontopediatría Preventiva y Restauradora',
    patientFullName: 'Mateo Nicolás García Paredes',
    patientDoc: '88392014',
    isRepresentative: true,
    representativeName: 'Carmen Paredes Zegarra',
    representativeDoc: '40192837',
    riskDetails: 'Se informa a la madre sobre el procedimiento de profilaxis y aplicación de flúor barniz.',
    doctorName: 'Dr. Gersson Anthony Valdivia Medina',
    doctorCop: 'CCDP 62958',
    agreed: true,
    signatureDate: '2026-10-03',
  },
  auditTrail: [
    {
      timestamp: '2026-10-03T15:00:00Z',
      userName: 'Dr. Gersson Anthony Valdivia Medina (CCDP 62958)',
      action: 'Creación de Historia Clínica Odontopediatría',
      module: 'Filiación',
    },
  ],
  createdAt: '2026-10-03T15:00:00Z',
  updatedAt: '2026-10-03T15:30:00Z',
  lastSavedAt: '2026-10-03T15:30:00Z',
  syncStatus: 'synced',
};
