export interface ToothInfo {
  number: number;
  name: string;
  isUpper: boolean;
  isRight: boolean; // Patient's right (Quadrant 1, 4, 5, 8)
  isMolarOrPremolar: boolean;
  isDeciduous: boolean;
  rootCount: number;
}

export const TOOTH_NAMES: Record<number, ToothInfo> = {
  // Cuadrante 1: Superior Derecho Permanente (18..11)
  18: { number: 18, name: 'Tercer Molar Sup. Der.', isUpper: true, isRight: true, isMolarOrPremolar: true, isDeciduous: false, rootCount: 3 },
  17: { number: 17, name: 'Segundo Molar Sup. Der.', isUpper: true, isRight: true, isMolarOrPremolar: true, isDeciduous: false, rootCount: 3 },
  16: { number: 16, name: 'Primer Molar Sup. Der.', isUpper: true, isRight: true, isMolarOrPremolar: true, isDeciduous: false, rootCount: 3 },
  15: { number: 15, name: 'Segundo Premolar Sup. Der.', isUpper: true, isRight: true, isMolarOrPremolar: true, isDeciduous: false, rootCount: 1 },
  14: { number: 14, name: 'Primer Premolar Sup. Der.', isUpper: true, isRight: true, isMolarOrPremolar: true, isDeciduous: false, rootCount: 2 },
  13: { number: 13, name: 'Canino Sup. Der.', isUpper: true, isRight: true, isMolarOrPremolar: false, isDeciduous: false, rootCount: 1 },
  12: { number: 12, name: 'Incisivo Lateral Sup. Der.', isUpper: true, isRight: true, isMolarOrPremolar: false, isDeciduous: false, rootCount: 1 },
  11: { number: 11, name: 'Incisivo Central Sup. Der.', isUpper: true, isRight: true, isMolarOrPremolar: false, isDeciduous: false, rootCount: 1 },

  // Cuadrante 2: Superior Izquierdo Permanente (21..28)
  21: { number: 21, name: 'Incisivo Central Sup. Izq.', isUpper: true, isRight: false, isMolarOrPremolar: false, isDeciduous: false, rootCount: 1 },
  22: { number: 22, name: 'Incisivo Lateral Sup. Izq.', isUpper: true, isRight: false, isMolarOrPremolar: false, isDeciduous: false, rootCount: 1 },
  23: { number: 23, name: 'Canino Sup. Izq.', isUpper: true, isRight: false, isMolarOrPremolar: false, isDeciduous: false, rootCount: 1 },
  24: { number: 24, name: 'Primer Premolar Sup. Izq.', isUpper: true, isRight: false, isMolarOrPremolar: true, isDeciduous: false, rootCount: 2 },
  25: { number: 25, name: 'Segundo Premolar Sup. Izq.', isUpper: true, isRight: false, isMolarOrPremolar: true, isDeciduous: false, rootCount: 1 },
  26: { number: 26, name: 'Primer Molar Sup. Izq.', isUpper: true, isRight: false, isMolarOrPremolar: true, isDeciduous: false, rootCount: 3 },
  27: { number: 27, name: 'Segundo Molar Sup. Izq.', isUpper: true, isRight: false, isMolarOrPremolar: true, isDeciduous: false, rootCount: 3 },
  28: { number: 28, name: 'Tercer Molar Sup. Izq.', isUpper: true, isRight: false, isMolarOrPremolar: true, isDeciduous: false, rootCount: 3 },

  // Cuadrante 5: Superior Derecho Deciduo (55..51)
  55: { number: 55, name: 'Segundo Molar Temporal Sup. Der.', isUpper: true, isRight: true, isMolarOrPremolar: true, isDeciduous: true, rootCount: 3 },
  54: { number: 54, name: 'Primer Molar Temporal Sup. Der.', isUpper: true, isRight: true, isMolarOrPremolar: true, isDeciduous: true, rootCount: 3 },
  53: { number: 53, name: 'Canino Temporal Sup. Der.', isUpper: true, isRight: true, isMolarOrPremolar: false, isDeciduous: true, rootCount: 1 },
  52: { number: 52, name: 'Incisivo Lateral Temporal Sup. Der.', isUpper: true, isRight: true, isMolarOrPremolar: false, isDeciduous: true, rootCount: 1 },
  51: { number: 51, name: 'Incisivo Central Temporal Sup. Der.', isUpper: true, isRight: true, isMolarOrPremolar: false, isDeciduous: true, rootCount: 1 },

  // Cuadrante 6: Superior Izquierdo Deciduo (61..65)
  61: { number: 61, name: 'Incisivo Central Temporal Sup. Izq.', isUpper: true, isRight: false, isMolarOrPremolar: false, isDeciduous: true, rootCount: 1 },
  62: { number: 62, name: 'Incisivo Lateral Temporal Sup. Izq.', isUpper: true, isRight: false, isMolarOrPremolar: false, isDeciduous: true, rootCount: 1 },
  63: { number: 63, name: 'Canino Temporal Sup. Izq.', isUpper: true, isRight: false, isMolarOrPremolar: false, isDeciduous: true, rootCount: 1 },
  64: { number: 64, name: 'Primer Molar Temporal Sup. Izq.', isUpper: true, isRight: false, isMolarOrPremolar: true, isDeciduous: true, rootCount: 3 },
  65: { number: 65, name: 'Segundo Molar Temporal Sup. Izq.', isUpper: true, isRight: false, isMolarOrPremolar: true, isDeciduous: true, rootCount: 3 },

  // Cuadrante 8: Inferior Derecho Deciduo (85..81)
  85: { number: 85, name: 'Segundo Molar Temporal Inf. Der.', isUpper: false, isRight: true, isMolarOrPremolar: true, isDeciduous: true, rootCount: 2 },
  84: { number: 84, name: 'Primer Molar Temporal Inf. Der.', isUpper: false, isRight: true, isMolarOrPremolar: true, isDeciduous: true, rootCount: 2 },
  83: { number: 83, name: 'Canino Temporal Inf. Der.', isUpper: false, isRight: true, isMolarOrPremolar: false, isDeciduous: true, rootCount: 1 },
  82: { number: 82, name: 'Incisivo Lateral Temporal Inf. Der.', isUpper: false, isRight: true, isMolarOrPremolar: false, isDeciduous: true, rootCount: 1 },
  81: { number: 81, name: 'Incisivo Central Temporal Inf. Der.', isUpper: false, isRight: true, isMolarOrPremolar: false, isDeciduous: true, rootCount: 1 },

  // Cuadrante 7: Inferior Izquierdo Deciduo (71..75)
  71: { number: 71, name: 'Incisivo Central Temporal Inf. Izq.', isUpper: false, isRight: false, isMolarOrPremolar: false, isDeciduous: true, rootCount: 1 },
  72: { number: 72, name: 'Incisivo Lateral Temporal Inf. Izq.', isUpper: false, isRight: false, isMolarOrPremolar: false, isDeciduous: true, rootCount: 1 },
  73: { number: 73, name: 'Canino Temporal Inf. Izq.', isUpper: false, isRight: false, isMolarOrPremolar: false, isDeciduous: true, rootCount: 1 },
  74: { number: 74, name: 'Primer Molar Temporal Inf. Izq.', isUpper: false, isRight: false, isMolarOrPremolar: true, isDeciduous: true, rootCount: 2 },
  75: { number: 75, name: 'Segundo Molar Temporal Inf. Izq.', isUpper: false, isRight: false, isMolarOrPremolar: true, isDeciduous: true, rootCount: 2 },

  // Cuadrante 4: Inferior Derecho Permanente (48..41)
  48: { number: 48, name: 'Tercer Molar Inf. Der.', isUpper: false, isRight: true, isMolarOrPremolar: true, isDeciduous: false, rootCount: 2 },
  47: { number: 47, name: 'Segundo Molar Inf. Der.', isUpper: false, isRight: true, isMolarOrPremolar: true, isDeciduous: false, rootCount: 2 },
  46: { number: 46, name: 'Primer Molar Inf. Der.', isUpper: false, isRight: true, isMolarOrPremolar: true, isDeciduous: false, rootCount: 2 },
  45: { number: 45, name: 'Segundo Premolar Inf. Der.', isUpper: false, isRight: true, isMolarOrPremolar: true, isDeciduous: false, rootCount: 1 },
  44: { number: 44, name: 'Primer Premolar Inf. Der.', isUpper: false, isRight: true, isMolarOrPremolar: true, isDeciduous: false, rootCount: 1 },
  43: { number: 43, name: 'Canino Inf. Der.', isUpper: false, isRight: true, isMolarOrPremolar: false, isDeciduous: false, rootCount: 1 },
  42: { number: 42, name: 'Incisivo Lateral Inf. Der.', isUpper: false, isRight: true, isMolarOrPremolar: false, isDeciduous: false, rootCount: 1 },
  41: { number: 41, name: 'Incisivo Central Inf. Der.', isUpper: false, isRight: true, isMolarOrPremolar: false, isDeciduous: false, rootCount: 1 },

  // Cuadrante 3: Inferior Izquierdo Permanente (31..38)
  31: { number: 31, name: 'Incisivo Central Inf. Izq.', isUpper: false, isRight: false, isMolarOrPremolar: false, isDeciduous: false, rootCount: 1 },
  32: { number: 32, name: 'Incisivo Lateral Inf. Izq.', isUpper: false, isRight: false, isMolarOrPremolar: false, isDeciduous: false, rootCount: 1 },
  33: { number: 33, name: 'Canino Inf. Izq.', isUpper: false, isRight: false, isMolarOrPremolar: false, isDeciduous: false, rootCount: 1 },
  34: { number: 34, name: 'Primer Premolar Inf. Izq.', isUpper: false, isRight: false, isMolarOrPremolar: true, isDeciduous: false, rootCount: 1 },
  35: { number: 35, name: 'Segundo Premolar Inf. Izq.', isUpper: false, isRight: false, isMolarOrPremolar: true, isDeciduous: false, rootCount: 1 },
  36: { number: 36, name: 'Primer Molar Inf. Izq.', isUpper: false, isRight: false, isMolarOrPremolar: true, isDeciduous: false, rootCount: 2 },
  37: { number: 37, name: 'Segundo Molar Inf. Izq.', isUpper: false, isRight: false, isMolarOrPremolar: true, isDeciduous: false, rootCount: 2 },
  38: { number: 38, name: 'Tercer Molar Inf. Izq.', isUpper: false, isRight: false, isMolarOrPremolar: true, isDeciduous: false, rootCount: 2 },
};

export const MINSA_FINDING_LABELS: Record<string, { label: string; color: 'red' | 'blue'; symbol: string; description: string }> = {
  // 1. HALLAZGOS PATOLÓGICOS / DEFECTUOSOS (COLOR ROJO)
  caries: { label: 'Caries Dental', color: 'red', symbol: '●', description: 'Caries activa en superficie o corona (Rojo)' },
  obturacion_defectuosa: { label: 'Obturación Defectuosa', color: 'red', symbol: '■', description: 'Restauración desadaptada o con recidiva (Rojo)' },
  resto_radicular: { label: 'Resto Radicular (RR)', color: 'red', symbol: 'RR', description: 'Destrucción coronaria total con raíz remanente (Rojo)' },
  sellante_defectuoso: { label: 'Sellante Defectuoso (S)', color: 'red', symbol: 'S', description: 'Sellante filtrado o desprendido (Rojo)' },
  diente_ausente_extraer: { label: 'Extracción Indicada (X)', color: 'red', symbol: '✕', description: 'Pieza indicada para exodoncia (Aspa Roja)' },
  endodoncia_requerida: { label: 'Endodoncia Requerida ( | )', color: 'red', symbol: '│', description: 'Tratamiento de conducto necesario (Rojo)' },
  fractura: { label: 'Fractura Dental', color: 'red', symbol: '⚡', description: 'Traumatismo o fractura coronaria/radicular (Rojo)' },
  protesis_defectuosa: { label: 'Prótesis Defectuosa (P)', color: 'red', symbol: 'P', description: 'Prótesis defectuosa o en mal estado (Rojo)' },
  corona_defectuosa: { label: 'Corona Defectuosa', color: 'red', symbol: '◯', description: 'Corona o funda unitaria en mal estado (Rojo)' },
  protesis_fija_defectuosa: { label: 'Prótesis Fija Defectuosa', color: 'red', symbol: 'PF', description: 'Puentes o prótesis fijas múltiples en mal estado (Rojo)' },
  protesis_removible_defectuosa: { label: 'Prótesis Removible Defectuosa', color: 'red', symbol: 'PR', description: 'Prótesis parcial o total removible en mal estado (Rojo)' },
  pilar_protesis_requerido: { label: 'Pilar de Prótesis Requerido', color: 'red', symbol: 'PP', description: 'Diente que servirá de soporte para una prótesis (Rojo)' },
  aparato_ortodontico_defectuoso: { label: 'Aparato Ortodóntico Defectuoso', color: 'red', symbol: '□', description: 'Brackets o retenedores en mal estado (Rojo)' },
  pieza_erupcionando: { label: 'Pieza Dental Erupcionando', color: 'red', symbol: '↑', description: 'Diente en proceso de brote o erupción activa (Rojo)' },
  diente_impactado: { label: 'Diente Impactado / Retenido', color: 'red', symbol: '⬭', description: 'Pieza atrapada en el hueso o encía (Rojo)' },
  giroversion: { label: 'Giroversión', color: 'red', symbol: '⟳', description: 'Diente rotado sobre su propio eje (Rojo)' },
  migracion_extrusion_intrusion: { label: 'Migración / Extrusión / Intrusión', color: 'red', symbol: '⇄', description: 'Desplazamiento anormal de la pieza dental (Rojo)' },
  movilidad_dental: { label: 'Movilidad Dental', color: 'red', symbol: 'M', description: 'Movilidad dental anormal (Rojo)' },
  movilidad_dental_1: { label: 'Movilidad Dental Grado I', color: 'red', symbol: 'M-I', description: 'Movilidad horizontal leve hasta 1 mm (Rojo)' },
  movilidad_dental_2: { label: 'Movilidad Dental Grado II', color: 'red', symbol: 'M-II', description: 'Movilidad horizontal evidente mayor a 1 mm (Rojo)' },
  movilidad_dental_3: { label: 'Movilidad Dental Grado III', color: 'red', symbol: 'M-III', description: 'Movilidad horizontal y axial vertical intrusiva (Rojo)' },
  diastema: { label: 'Diastema', color: 'red', symbol: ')(', description: 'Espacio anormal entre dos dientes contiguos (Rojo)' },

  // 2. TRATAMIENTOS REALIZADOS / EN BUEN ESTADO (COLOR AZUL)
  obturacion_buen_estado: { label: 'Obturación en Buen Estado', color: 'blue', symbol: '■', description: 'Resina o amalgama en óptimo estado (Azul)' },
  sellante_buen_estado: { label: 'Sellante en Buen Estado (S)', color: 'blue', symbol: 'S', description: 'Sellante íntegro fotocurado (Azul)' },
  corona_buen_estado: { label: 'Corona en Buen Estado', color: 'blue', symbol: '◯', description: 'Corona protésica adaptada en buen estado (Azul)' },
  endodoncia_realizada: { label: 'Endodoncia Realizada ( | )', color: 'blue', symbol: '│', description: 'Tratamiento pulpar concluido satisfactorio (Azul)' },
  implante_osteointegrado: { label: 'Implante Integrado (IMP)', color: 'blue', symbol: 'IMP', description: 'Implante dental rehabilitado (Azul)' },
  protesis_buen_estado: { label: 'Prótesis en Buen Estado (P)', color: 'blue', symbol: 'P', description: 'Prótesis adaptada en buen estado (Azul)' },
  protesis_fija_removible: { label: 'Prótesis en Buen Estado (P)', color: 'blue', symbol: 'P', description: 'Prótesis adaptada en buen estado (Azul)' },
  aparato_ortodontico: { label: 'Aparato Ortodóntico en Buen Estado', color: 'blue', symbol: '□', description: 'Brackets o aparatología fija en boca (Azul)' },
  diente_ausente_definitivo: { label: 'Pieza Ausente (X)', color: 'blue', symbol: '✕', description: 'Diente extraído o ausente por causa quirúrgica/congénita (Aspa Azul)' },
  protesis_fija_buen_estado: { label: 'Prótesis Fija en Buen Estado', color: 'blue', symbol: 'PF', description: 'Puentes o estructuras fijas consolidadas (Azul)' },
  protesis_removible_buen_estado: { label: 'Prótesis Removible en Buen Estado', color: 'blue', symbol: 'PR', description: 'Prótesis parcial/total en buen estado (Azul)' },
  pilar_protesis_buen_estado: { label: 'Pilar de Prótesis en Buen Estado', color: 'blue', symbol: 'PP', description: 'Diente pilar funcionando adecuadamente (Azul)' },
  espigo_munon_colado: { label: 'Espigo / Muñón Colado (Perno)', color: 'blue', symbol: 'EP', description: 'Espigo intrarradicular presente y en buen estado (Azul)' },
  diente_supernumerario: { label: 'Diente Supernumerario (S)', color: 'blue', symbol: 'Ⓢ', description: 'Pieza dental extra supernumeraria (S en círculo Azul)' },
};
