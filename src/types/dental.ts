/**
 * ValMed - Definiciones de Tipos para Historia Clínica Odontológica
 * Cumplimiento con la Norma Técnica de Salud para la Gestión de la Historia Clínica
 * y Guías de Práctica Clínica Odontológica - MINSA (Perú)
 */

export type DocumentType = 'DNI' | 'Carnet de Extranjería' | 'Pasaporte' | 'Sin Documento';
export type Sex = 'Masculino' | 'Femenino' | 'Otro';
export type BloodType = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'Desconocido';

export interface PatientFiliation {
  hcNumber: string; // Autogenerado ej: HC-2026-0842
  admissionDate: string; // YYYY-MM-DD
  admissionTime: string; // HH:mm
  firstName: string;
  lastName: string;
  docType: DocumentType;
  docNumber: string;
  birthDate: string;
  age: number;
  sex: Sex;
  bloodType: BloodType;
  phone: string;
  email: string;
  address: string;
  district: string;
  occupation: string;
  birthPlace: string;
  maritalStatus: 'Soltero(a)' | 'Casado(a)' | 'Conviviente' | 'Divorciado(a)' | 'Viudo(a)' | 'Menor de edad';
  // Apoderado (en caso de menores o dependientes)
  tutorRequired: boolean;
  tutorName: string;
  tutorDocNumber: string;
  tutorRelationship: string;
  tutorPhone: string;
}

export interface MedicalBackground {
  hasHypertension: boolean;
  hypertensionDetails: string;
  hasDiabetes: boolean;
  diabetesDetails: string;
  hasHeartDisease: boolean;
  heartDiseaseDetails: string;
  hasHepatitis: boolean;
  hepatitisDetails: string;
  hasBleedingDisorders: boolean;
  bleedingDisordersDetails: string;
  hasRespiratoryDisease: boolean; // Asma, EPOC
  respiratoryDiseaseDetails: string;
  hasKidneyDisease: boolean;
  kidneyDiseaseDetails: string;
  hasAllergies: boolean;
  allergiesDetails: string; // Alergia a Penicilina, AINEs, anestesia, etc.
  isPregnant: boolean;
  gestationWeeks?: number;
  isBreastfeeding: boolean;
  currentMedications: string; // Medicación actual
  previousDentalReactions: string; // Reacciones previas a anestésicos o tratamientos
  familyHistory: string; // Antecedentes familiares relevantes
}

export interface Anamnesis {
  consultationReason: string; // Relato del paciente ("Me duele la muela derecha...")
  currentIllness: {
    symptomOnset: string; // Inicio: Brusco, insidioso
    duration: string; // Tiempo de enfermedad (ej. 3 días)
    course: 'Progresivo' | 'Intermitente' | 'Estacionario';
    mainSymptoms: string; // Dolor pulsátil, sensibilidad térmica, etc.
  };
  medicalBackground: MedicalBackground;
}

export interface VitalSigns {
  bloodPressure: string; // ej: "120/80"
  pulseRate: number; // lpm
  temperature: number; // °C ej: 36.7
  respiratoryRate: number; // rpm ej: 18
  weightKg: number;
  heightCm: number;
  bmi: number; // Calculado
}

export interface PhysicalExam {
  vitalSigns: VitalSigns;
  generalStatus: 'Aparente Buen Estado General (ABEG)' | 'Aparente Regular Estado General (AREG)' | 'Aparente Mal Estado General (AMEG)';
  facies: 'Simétrica' | 'Asimétrica' | 'Pálida' | 'Rubicunda' | 'Dolorosa';
  neck: string;
  atm: {
    maxOpeningMm: number;
    hasPain: boolean;
    hasClicking: boolean;
    hasDeviation: boolean;
    notes: string;
  };
  lymphNodes: {
    hasAdenopathy: boolean;
    location: string;
    characteristics: string;
  };
}

export interface StomatologicalExam {
  lips: string;
  cheeks: string; // Carrillos
  gums: string; // Encías
  tongue: string;
  floorOfMouth: string; // Piso de boca
  hardPalate: string; // Paladar duro
  softPalate: string; // Paladar blando
  oropharynx: string;
  salivaryGlands: string;
  hygieneIndex: 'Buena' | 'Regular' | 'Mala';
}

export type ToothSurface = 'vestibular' | 'lingual' | 'mesial' | 'distal' | 'oclusal' | 'raiz';

export type MinsaFindingType =
  // 1. HALLAZGOS PATOLÓGICOS / DEFECTUOSOS (COLOR ROJO)
  | 'caries'
  | 'obturacion_defectuosa'
  | 'resto_radicular'
  | 'sellante_defectuoso'
  | 'diente_ausente_extraer'
  | 'endodoncia_requerida'
  | 'fractura'
  | 'protesis_defectuosa'
  | 'corona_defectuosa'
  | 'protesis_fija_defectuosa'
  | 'protesis_removible_defectuosa'
  | 'pilar_protesis_requerido'
  | 'aparato_ortodontico_defectuoso'
  | 'pieza_erupcionando'
  | 'diente_impactado'
  | 'giroversion'
  | 'migracion_extrusion_intrusion'
  | 'movilidad_dental'
  | 'movilidad_dental_1'
  | 'movilidad_dental_2'
  | 'movilidad_dental_3'
  | 'diastema'
  // 2. TRATAMIENTOS REALIZADOS / EN BUEN ESTADO (COLOR AZUL)
  | 'obturacion_buen_estado'
  | 'sellante_buen_estado'
  | 'corona_buen_estado'
  | 'endodoncia_realizada'
  | 'implante_osteointegrado'
  | 'protesis_buen_estado'
  | 'protesis_fija_removible'
  | 'aparato_ortodontico'
  | 'diente_ausente_definitivo'
  | 'protesis_fija_buen_estado'
  | 'protesis_removible_buen_estado'
  | 'pilar_protesis_buen_estado'
  | 'espigo_munon_colado'
  | 'diente_supernumerario';

export interface ToothSurfaceFinding {
  surface: ToothSurface;
  type: MinsaFindingType;
  material?: 'Resina' | 'Amalgama' | 'Ionómero' | 'Otro';
  notes?: string;
}

export interface ToothCondition {
  toothNumber: number; // 18..11, 21..28, 48..41, 31..38, 55..51, etc.
  isDeciduous: boolean;
  wholeToothFinding?: MinsaFindingType;
  surfaces: Partial<Record<ToothSurface, MinsaFindingType>>;
  materials?: Partial<Record<ToothSurface, string>>;
  mobilityGrade?: 0 | 1 | 2 | 3;
  notes?: string;
  updatedAt?: string;
}

export interface OdontogramState {
  teeth: Record<number, ToothCondition>;
  lastUpdated: string;
  cpoIndex: {
    cariados: number; // C
    perdidos: number; // P
    obturados: number; // O
    totalCpo: number;
    ceoIndex: number; // Para niños
  };
  generalNotes?: string;
}

export interface Cie10Diagnosis {
  id: string;
  code: string; // ej: K02.1
  description: string;
  toothNumber?: number;
  type: 'Presuntivo' | 'Definitivo';
  date: string;
}

export type TreatmentPhase = 'fase_1_sistematica' | 'fase_2_higienica' | 'fase_3_correctiva' | 'fase_4_mantenimiento';

export interface TreatmentPlanItem {
  id: string;
  phase: TreatmentPhase;
  toothNumber?: number;
  procedure: string;
  cost: number;
  status: 'Pendiente' | 'En Proceso' | 'Completado';
  notes?: string;
}

export interface ClinicalEvolution {
  id: string;
  date: string;
  toothNumber?: number;
  diagnosis: string;
  procedurePerformed: string;
  prescriptions: string;
  doctorName: string;
  doctorCop: string; // Colegio Odontológico del Perú N°
  signed: boolean;
}

export interface InformedConsent {
  procedureTitle: string;
  patientFullName: string;
  patientDoc: string;
  isRepresentative: boolean;
  representativeName?: string;
  representativeDoc?: string;
  riskDetails: string;
  doctorName: string;
  doctorCop: string;
  signatureDataUrl?: string;
  signatureDate?: string;
  agreed: boolean;
}

export interface ModificationLog {
  timestamp: string;
  userName: string;
  action: string;
  module: string;
}

export type DentalImageType =
  | 'periapical'
  | 'panoramica'
  | 'bitewing'
  | 'oclusal'
  | 'foto_intraoral'
  | 'foto_extraoral'
  | 'tomografia'
  | 'cefalometrica'
  | 'otro';

export interface DentalImageRecord {
  id: string;
  title: string;
  type: DentalImageType;
  date: string;
  toothNumber?: number;
  dataUrl: string;
  fileName: string;
  fileSize?: number;
  notes?: string;
  tags?: string[];
  createdAt: string;
}

export interface ClinicalRecord {
  id: string;
  filiation: PatientFiliation;
  anamnesis: Anamnesis;
  physicalExam: PhysicalExam;
  stomatologicalExam: StomatologicalExam;
  odontogram: OdontogramState;
  dentalImages: DentalImageRecord[];
  diagnoses: Cie10Diagnosis[];
  treatmentPlan: TreatmentPlanItem[];
  evolutions: ClinicalEvolution[];
  consent: InformedConsent;
  auditTrail: ModificationLog[];
  createdAt: string;
  updatedAt: string;
  lastSavedAt: string;
  syncStatus: 'synced' | 'pending' | 'offline';
}

