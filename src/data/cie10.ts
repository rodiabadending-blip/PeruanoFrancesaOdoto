/**
 * Catálogo Oficial CIE-10 Odontología (MINSA Perú)
 * Códigos diagnósticos estandarizados para afecciones bucales y maxilofaciales.
 */

export interface Cie10CatalogItem {
  code: string;
  name: string;
  category: string;
  commonInTeeth?: boolean;
}

export const CIE10_ODONTOLOGY: Cie10CatalogItem[] = [
  // Caries Dental (K02)
  { code: 'K02.0', name: 'Caries limitada al esmalte (manchas blancas)', category: 'Caries Dental', commonInTeeth: true },
  { code: 'K02.1', name: 'Caries de la dentina', category: 'Caries Dental', commonInTeeth: true },
  { code: 'K02.2', name: 'Caries del cemento radicular', category: 'Caries Dental', commonInTeeth: true },
  { code: 'K02.3', name: 'Caries dentaria detenida', category: 'Caries Dental', commonInTeeth: true },
  { code: 'K02.4', name: 'Odontoclasia (melanodoncia infantil)', category: 'Caries Dental', commonInTeeth: true },
  { code: 'K02.8', name: 'Otras caries dentales especificadas', category: 'Caries Dental', commonInTeeth: true },
  { code: 'K02.9', name: 'Caries dental, no especificada', category: 'Caries Dental', commonInTeeth: true },

  // Enfermedades de la Pulpa y Tejidos Periapicales (K04)
  { code: 'K04.0', name: 'Pulpitis reversible / hiperemia pulpar', category: 'Patología Pulpar', commonInTeeth: true },
  { code: 'K04.01', name: 'Pulpitis irreversible sintomática', category: 'Patología Pulpar', commonInTeeth: true },
  { code: 'K04.02', name: 'Pulpitis irreversible asintomática', category: 'Patología Pulpar', commonInTeeth: true },
  { code: 'K04.1', name: 'Necrosis de la pulpa', category: 'Patología Pulpar', commonInTeeth: true },
  { code: 'K04.2', name: 'Degeneración de la pulpa (calcificaciones/dentículos)', category: 'Patología Pulpar', commonInTeeth: true },
  { code: 'K04.4', name: 'Periodontitis apical aguda de origen pulpar', category: 'Patología Periapical', commonInTeeth: true },
  { code: 'K04.5', name: 'Periodontitis apical crónica (granuloma apical)', category: 'Patología Periapical', commonInTeeth: true },
  { code: 'K04.6', name: 'Absceso periapical con fístula', category: 'Patología Periapical', commonInTeeth: true },
  { code: 'K04.7', name: 'Absceso periapical sin fístula', category: 'Patología Periapical', commonInTeeth: true },
  { code: 'K04.8', name: 'Quiste radicular / periapical', category: 'Patología Periapical', commonInTeeth: true },

  // Gingivitis y Enfermedades Periodontales (K05)
  { code: 'K05.0', name: 'Gingivitis aguda inducida por placa', category: 'Periodoncia', commonInTeeth: false },
  { code: 'K05.1', name: 'Gingivitis crónica', category: 'Periodoncia', commonInTeeth: false },
  { code: 'K05.2', name: 'Periodontitis agresiva localizada / generalizada', category: 'Periodoncia', commonInTeeth: false },
  { code: 'K05.3', name: 'Periodontitis crónica localizada / generalizada', category: 'Periodoncia', commonInTeeth: false },
  { code: 'K05.4', name: 'Periodontosis', category: 'Periodoncia', commonInTeeth: false },
  { code: 'K05.5', name: 'Otras enfermedades periodontales', category: 'Periodoncia', commonInTeeth: false },
  { code: 'K06.0', name: 'Retracción gingival / recesión gingival', category: 'Periodoncia', commonInTeeth: true },

  // Anomalías Dentofaciales y Oclusión (K07)
  { code: 'K07.0', name: 'Anomalías evidentes del tamaño de los maxilares (micrognatismo/macrognatismo)', category: 'Ortodoncia', commonInTeeth: false },
  { code: 'K07.2', name: 'Anomalías de la relación entre arcos dentarios (Clase II / Clase III / Mordida cruzada)', category: 'Ortodoncia', commonInTeeth: false },
  { code: 'K07.3', name: 'Anomalías de la posición del diente (apiñamiento, espaciamiento, diastema)', category: 'Ortodoncia', commonInTeeth: true },
  { code: 'K07.6', name: 'Trastornos de la articulación temporomandibular (ATM)', category: 'ATM y Oclusión', commonInTeeth: false },

  // Otros Trastornos de los Dientes y sus Estructuras de Sostén (K08)
  { code: 'K08.0', name: 'Exfoliación de los dientes debida a causas sistémicas', category: 'Otras Patologías', commonInTeeth: true },
  { code: 'K08.1', name: 'Pérdida de dientes debida a accidente, extracción o afección periodontal', category: 'Edentulismo', commonInTeeth: true },
  { code: 'K08.2', name: 'Atrofia del reborde alveolar desdentado', category: 'Edentulismo', commonInTeeth: false },
  { code: 'K08.3', name: 'Raíz dental retenida / resto radicular', category: 'Cirugía / Restos', commonInTeeth: true },
  { code: 'K08.8', name: 'Otros trastornos especificados de los dientes y de sus estructuras de sostén', category: 'Otras Patologías', commonInTeeth: true },

  // Dientes Incluidos e Impactados (K01)
  { code: 'K01.0', name: 'Diente incluido', category: 'Cirugía Bucal', commonInTeeth: true },
  { code: 'K01.1', name: 'Diente impactado (Terceros molares retenidos)', category: 'Cirugía Bucal', commonInTeeth: true },

  // Alteraciones del Desarrollo y Erupción (K00)
  { code: 'K00.0', name: 'Anodoncia / Agenesia dental', category: 'Desarrollo Dentario', commonInTeeth: true },
  { code: 'K00.1', name: 'Dientes supernumerarios (mesiodens)', category: 'Desarrollo Dentario', commonInTeeth: true },
  { code: 'K00.2', name: 'Anomalías del tamaño y de la forma del diente (microdoncia/macrodoncia)', category: 'Desarrollo Dentario', commonInTeeth: true },
  { code: 'K00.4', name: 'Alteraciones en la formación dentaria (amelogénesis/fluorosis/hipoplasia)', category: 'Desarrollo Dentario', commonInTeeth: true },

  // Traumatismos y Fracturas (S02, S03)
  { code: 'S02.5', name: 'Fractura de los dientes (infracción, corona o raíz)', category: 'Traumatismos', commonInTeeth: true },
  { code: 'S03.2', name: 'Luxación de diente (intrusión, extrusión, avulsión)', category: 'Traumatismos', commonInTeeth: true },

  // Lesiones de Tejidos Blandos (K12, K13)
  { code: 'K12.0', name: 'Estomatitis aftosa recurrente', category: 'Mucosa Oral', commonInTeeth: false },
  { code: 'K13.0', name: 'Enfermedades de los labios (queilitis angular)', category: 'Mucosa Oral', commonInTeeth: false },
  { code: 'K13.2', name: 'Leucoplasia y otras alteraciones del epitelio bucal', category: 'Mucosa Oral', commonInTeeth: false },
];
