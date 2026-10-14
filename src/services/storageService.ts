import { ClinicalRecord } from '../types/dental';
import { INITIAL_RECORD, SECONDARY_RECORD } from '../data/defaultPatients';

const STORAGE_KEY = 'valmed_clinical_records_v1';
const LEGACY_STORAGE_KEY = 'densora_clinical_records_v1';
const ACTIVE_RECORD_KEY = 'valmed_active_record_id';
const LEGACY_ACTIVE_RECORD_KEY = 'densora_active_record_id';

export class StorageService {
  public static getAllRecords(): ClinicalRecord[] {
    try {
      let data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Fallback check legacy key
        data = localStorage.getItem(LEGACY_STORAGE_KEY);
      }
      if (!data) {
        // Initialize with default demo patients
        const defaults = [INITIAL_RECORD, SECONDARY_RECORD];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
        return defaults;
      }
      const parsed: ClinicalRecord[] = JSON.parse(data);
      return parsed.map((r) => ({
        ...r,
        dentalImages: Array.isArray(r.dentalImages) ? r.dentalImages : [],
      }));
    } catch (e) {
      console.error('Error loading clinical records from localStorage', e);
      return [INITIAL_RECORD, SECONDARY_RECORD];
    }
  }

  public static getActiveRecordId(): string {
    const id = localStorage.getItem(ACTIVE_RECORD_KEY) || localStorage.getItem(LEGACY_ACTIVE_RECORD_KEY);
    return id || INITIAL_RECORD.id;
  }

  public static setActiveRecordId(id: string): void {
    localStorage.setItem(ACTIVE_RECORD_KEY, id);
  }

  public static getRecordById(id: string): ClinicalRecord | undefined {
    const records = this.getAllRecords();
    return records.find(r => r.id === id);
  }

  public static saveRecord(record: ClinicalRecord, userName: string = 'Dr. Gersson Anthony Valdivia Medina (CCDP 62958)'): ClinicalRecord {
    const records = this.getAllRecords();
    const now = new Date().toISOString();

    const updatedRecord: ClinicalRecord = {
      ...record,
      updatedAt: now,
      lastSavedAt: now,
      syncStatus: 'synced',
      auditTrail: [
        {
          timestamp: now,
          userName,
          action: 'Guardado de historia clínica',
          module: 'General',
        },
        ...(record.auditTrail || []).slice(0, 49), // Guardar últimos 50 registros
      ],
    };

    const index = records.findIndex(r => r.id === record.id);
    if (index >= 0) {
      records[index] = updatedRecord;
    } else {
      records.unshift(updatedRecord);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return updatedRecord;
  }

  public static createNewRecord(patientName?: string): ClinicalRecord {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const year = now.getFullYear();
    const newId = `rec_valmed_${Date.now()}`;

    const newRecord: ClinicalRecord = {
      id: newId,
      filiation: {
        hcNumber: `HC-${year}-${randomNum}`,
        admissionDate: dateStr,
        admissionTime: timeStr,
        firstName: patientName || 'Nuevo',
        lastName: 'Paciente',
        docType: 'DNI',
        docNumber: '',
        birthDate: '1995-01-01',
        age: 31,
        sex: 'Femenino',
        bloodType: 'O+',
        phone: '',
        email: '',
        address: '',
        district: '',
        occupation: '',
        birthPlace: 'Perú',
        maritalStatus: 'Soltero(a)',
        tutorRequired: false,
        tutorName: '',
        tutorDocNumber: '',
        tutorRelationship: '',
        tutorPhone: '',
      },
      anamnesis: {
        consultationReason: '',
        currentIllness: {
          symptomOnset: 'Insidioso',
          duration: '',
          course: 'Progresivo',
          mainSymptoms: '',
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
          hasRespiratoryDisease: false,
          respiratoryDiseaseDetails: '',
          hasKidneyDisease: false,
          kidneyDiseaseDetails: '',
          hasAllergies: false,
          allergiesDetails: '',
          isPregnant: false,
          isBreastfeeding: false,
          currentMedications: '',
          previousDentalReactions: '',
          familyHistory: '',
        },
      },
      physicalExam: {
        vitalSigns: {
          bloodPressure: '120/80',
          pulseRate: 72,
          temperature: 36.5,
          respiratoryRate: 18,
          weightKg: 65,
          heightCm: 165,
          bmi: 23.88,
        },
        generalStatus: 'Aparente Buen Estado General (ABEG)',
        facies: 'Simétrica',
        neck: 'Cilíndrico, móvil, sin adenopatías.',
        atm: {
          maxOpeningMm: 45,
          hasPain: false,
          hasClicking: false,
          hasDeviation: false,
          notes: 'Apertura normal sin ruidos ni dolor.',
        },
        lymphNodes: {
          hasAdenopathy: false,
          location: 'Cervicales y submandibulares',
          characteristics: 'Normales',
        },
      },
      stomatologicalExam: {
        lips: 'Normales',
        cheeks: 'Mucosa rosada húmeda normal',
        gums: 'Normales',
        tongue: 'Normal',
        floorOfMouth: 'Normal',
        hardPalate: 'Normal',
        softPalate: 'Normal',
        oropharynx: 'Normal',
        salivaryGlands: 'Normales',
        hygieneIndex: 'Buena',
      },
      odontogram: {
        lastUpdated: now.toISOString(),
        teeth: {},
        cpoIndex: {
          cariados: 0,
          perdidos: 0,
          obturados: 0,
          totalCpo: 0,
          ceoIndex: 0,
        },
        generalNotes: '',
      },
      dentalImages: [],
      diagnoses: [],
      treatmentPlan: [],
      evolutions: [],
      consent: {
        procedureTitle: 'Tratamiento Odontológico Integral',
        patientFullName: 'Nuevo Paciente',
        patientDoc: '',
        isRepresentative: false,
        riskDetails: 'Se han explicado las alternativas, riesgos y beneficios del tratamiento odontológico propuesto.',
        doctorName: 'Dr. Gersson Anthony Valdivia Medina',
        doctorCop: 'CCDP 62958',
        agreed: false,
      },
      auditTrail: [
        {
          timestamp: now.toISOString(),
          userName: 'Dr. Gersson Anthony Valdivia Medina (CCDP 62958)',
          action: 'Creación de nueva historia clínica',
          module: 'Filiación',
        },
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      lastSavedAt: now.toISOString(),
      syncStatus: 'synced',
    };

    const records = this.getAllRecords();
    records.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    this.setActiveRecordId(newId);

    return newRecord;
  }

  public static deleteRecord(id: string): void {
    const records = this.getAllRecords();
    const filtered = records.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  public static exportBackup(): void {
    const records = this.getAllRecords();
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(records, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `peruano_francesa_respaldo_historias_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  public static importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].filiation) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import backup', e);
      return false;
    }
  }
}
