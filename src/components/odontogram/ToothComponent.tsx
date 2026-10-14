import React from 'react';
import { ToothCondition, ToothSurface, MinsaFindingType } from '../../types/dental';
import { TOOTH_NAMES, MINSA_FINDING_LABELS } from './toothDefinitions';

interface ToothComponentProps {
  toothNumber: number;
  condition?: ToothCondition;
  isSelected?: boolean;
  onToothClick: (toothNumber: number) => void;
  onSurfaceClick: (toothNumber: number, surface: ToothSurface) => void;
}

export const ToothComponent: React.FC<ToothComponentProps> = ({
  toothNumber,
  condition,
  isSelected = false,
  onToothClick,
  onSurfaceClick,
}) => {
  const info = TOOTH_NAMES[toothNumber] || {
    number: toothNumber,
    name: `Pieza ${toothNumber}`,
    isUpper: true,
    isRight: true,
    isMolarOrPremolar: true,
    isDeciduous: false,
    rootCount: 1,
  };

  const wholeFinding = condition?.wholeToothFinding;
  const surfaces = condition?.surfaces || {};

  // Superficies anatómicas según lado (Mesial siempre hacia la línea media)
  // Cuadrantes derechos (1, 4, 5, 8): Mesial es cara izquierda (interna)
  // Cuadrantes izquierdos (2, 3, 6, 7): Mesial es cara derecha (interna)
  const leftSurface: ToothSurface = info.isRight ? 'distal' : 'mesial';
  const rightSurface: ToothSurface = info.isRight ? 'mesial' : 'distal';
  const topSurface: ToothSurface = info.isUpper ? 'vestibular' : 'lingual';
  const bottomSurface: ToothSurface = info.isUpper ? 'lingual' : 'vestibular';

  const getSurfaceColor = (surfaceName: ToothSurface) => {
    const finding = surfaces[surfaceName];
    if (!finding) return '#ffffff';
    const meta = MINSA_FINDING_LABELS[finding];
    if (meta?.color === 'red') return '#ef4444'; // Rojo Reglamentario
    if (meta?.color === 'blue') return '#2563eb'; // Azul Reglamentario
    return '#e2e8f0';
  };

  const getRootStyles = () => {
    const rootFinding = surfaces['raiz'] || wholeFinding;
    if (!rootFinding) {
      return { fill: '#f8fafc', stroke: '#64748b', strokeWidth: 1.5 };
    }
    const meta = MINSA_FINDING_LABELS[rootFinding];
    if (meta?.color === 'red') {
      return { fill: '#fee2e2', stroke: '#dc2626', strokeWidth: 2 };
    }
    if (meta?.color === 'blue') {
      return { fill: '#dbeafe', stroke: '#1d4ed8', strokeWidth: 2 };
    }
    return { fill: '#f8fafc', stroke: '#64748b', strokeWidth: 1.5 };
  };

  const rootStyle = getRootStyles();

  // Detección de movilidad
  const mobility =
    condition?.mobilityGrade ||
    (wholeFinding === 'movilidad_dental_1'
      ? 1
      : wholeFinding === 'movilidad_dental_2'
      ? 2
      : wholeFinding === 'movilidad_dental_3'
      ? 3
      : 0);

  const hasAnyFinding =
    Boolean(wholeFinding) ||
    Object.keys(surfaces).length > 0 ||
    Boolean(condition?.notes) ||
    mobility > 0;

  return (
    <div
      className={`group relative flex flex-col items-center select-none p-1 rounded-xl transition-all duration-150 ${
        isSelected
          ? 'bg-sky-100/90 ring-2 ring-sky-500 shadow-md scale-105 z-20'
          : 'hover:bg-slate-100/70 hover:scale-102'
      }`}
    >
      {/* Etiqueta superior del Diente (para piezas superiores) */}
      {info.isUpper && (
        <button
          type="button"
          onClick={() => onToothClick(toothNumber)}
          className={`mb-1 text-xs font-bold px-1.5 py-0.5 rounded transition ${
            isSelected
              ? 'bg-sky-600 text-white shadow-xs'
              : hasAnyFinding
              ? 'bg-slate-800 text-white'
              : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
          }`}
          title={info.name}
        >
          {toothNumber}
        </button>
      )}

      {/* Contenedor SVG: Raíces + Corona */}
      <div
        className="relative cursor-pointer"
        style={{ width: '58px', height: '86px' }}
      >
        <svg
          viewBox="0 0 60 92"
          className="w-full h-full overflow-visible drop-shadow-xs"
        >
          {/* DEFINICIONES */}
          <defs>
            <filter id={`glow-${toothNumber}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#0284c7" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* ==================================================== */}
          {/* 1. RAÍCES ANATÓMICAS CON SELECCIÓN INDEPENDIENTE */}
          {/* ==================================================== */}
          {info.isUpper ? (
            // Raíces hacia arriba (Piezas Superiores)
            <g
              onClick={(e) => {
                e.stopPropagation();
                onSurfaceClick(toothNumber, 'raiz');
              }}
              className="cursor-pointer transition-opacity hover:opacity-80"
            >
              <title>{`${info.name} - Raíz Anatómica (Click para pintar o aplicar hallazgo radicular)`}</title>
              {info.rootCount === 3 ? (
                // Molares superiores: 3 raíces
                <g stroke={rootStyle.stroke} strokeWidth={rootStyle.strokeWidth} fill={rootStyle.fill}>
                  <path d="M 12,30 C 8,18 10,6 18,4 C 22,6 22,18 24,30 Z" />
                  <path d="M 25,30 C 27,15 30,5 33,5 C 36,5 37,15 38,30 Z" />
                  <path d="M 39,30 C 42,18 45,6 48,4 C 54,6 52,18 48,30 Z" />
                </g>
              ) : info.rootCount === 2 ? (
                // Premolares sup: 2 raíces
                <g stroke={rootStyle.stroke} strokeWidth={rootStyle.strokeWidth} fill={rootStyle.fill}>
                  <path d="M 16,30 C 12,16 16,5 24,5 C 28,8 28,20 28,30 Z" />
                  <path d="M 32,30 C 32,20 32,8 36,5 C 44,5 48,16 44,30 Z" />
                </g>
              ) : (
                // Anteriores y premolares simples: 1 raíz
                <path
                  d="M 18,30 C 18,12 24,4 30,4 C 36,4 42,12 42,30 Z"
                  stroke={rootStyle.stroke}
                  strokeWidth={rootStyle.strokeWidth}
                  fill={rootStyle.fill}
                />
              )}

              {/* Endodoncia Requerida en Raíz Superior (Línea Roja) */}
              {(wholeFinding === 'endodoncia_requerida' || surfaces.raiz === 'endodoncia_requerida') && (
                <line x1="30" y1="6" x2="30" y2="30" stroke="#ef4444" strokeWidth="3" strokeDasharray="3,2" strokeLinecap="round" />
              )}
              {/* Endodoncia Realizada en Raíz Superior (Línea Azul Sólida) */}
              {(wholeFinding === 'endodoncia_realizada' || surfaces.raiz === 'endodoncia_realizada') && (
                <line x1="30" y1="6" x2="30" y2="30" stroke="#2563eb" strokeWidth="3.2" strokeLinecap="round" />
              )}
              {/* Espigo / Muñón Colado (Perno) en Raíz Superior (Perno Azul con cabeza) */}
              {(wholeFinding === 'espigo_munon_colado' || surfaces.raiz === 'espigo_munon_colado') && (
                <g stroke="#1d4ed8" fill="#1d4ed8">
                  <line x1="30" y1="8" x2="30" y2="30" strokeWidth="3" strokeLinecap="round" />
                  <rect x="25" y="27" width="10" height="4" rx="1" />
                </g>
              )}
            </g>
          ) : (
            // Raíces hacia abajo (Piezas Inferiores)
            <g
              onClick={(e) => {
                e.stopPropagation();
                onSurfaceClick(toothNumber, 'raiz');
              }}
              className="cursor-pointer transition-opacity hover:opacity-80"
            >
              <title>{`${info.name} - Raíz Anatómica (Click para pintar o aplicar hallazgo radicular)`}</title>
              {info.rootCount === 2 ? (
                // Molares inferiores: 2 raíces
                <g stroke={rootStyle.stroke} strokeWidth={rootStyle.strokeWidth} fill={rootStyle.fill}>
                  <path d="M 16,60 C 12,74 16,85 24,85 C 28,82 28,70 28,60 Z" />
                  <path d="M 32,60 C 32,70 32,82 36,85 C 44,85 48,74 44,60 Z" />
                </g>
              ) : (
                // Anteriores inferiores: 1 raíz
                <path
                  d="M 20,60 C 20,78 26,86 30,86 C 34,86 40,78 40,60 Z"
                  stroke={rootStyle.stroke}
                  strokeWidth={rootStyle.strokeWidth}
                  fill={rootStyle.fill}
                />
              )}

              {/* Endodoncia Requerida en Raíz Inferior (Línea Roja) */}
              {(wholeFinding === 'endodoncia_requerida' || surfaces.raiz === 'endodoncia_requerida') && (
                <line x1="30" y1="60" x2="30" y2="84" stroke="#ef4444" strokeWidth="3" strokeDasharray="3,2" strokeLinecap="round" />
              )}
              {/* Endodoncia Realizada en Raíz Inferior (Línea Azul Sólida) */}
              {(wholeFinding === 'endodoncia_realizada' || surfaces.raiz === 'endodoncia_realizada') && (
                <line x1="30" y1="60" x2="30" y2="84" stroke="#2563eb" strokeWidth="3.2" strokeLinecap="round" />
              )}
              {/* Espigo / Muñón Colado (Perno) en Raíz Inferior (Perno Azul con cabeza) */}
              {(wholeFinding === 'espigo_munon_colado' || surfaces.raiz === 'espigo_munon_colado') && (
                <g stroke="#1d4ed8" fill="#1d4ed8">
                  <line x1="30" y1="60" x2="30" y2="82" strokeWidth="3" strokeLinecap="round" />
                  <rect x="25" y="59" width="10" height="4" rx="1" />
                </g>
              )}
            </g>
          )}

          {/* ==================================================== */}
          {/* 2. CORONA DENTAL (5 SUPERFICIES CLÍNICAS INDIVIDUALES) */}
          {/* ==================================================== */}
          <g transform={`translate(0, ${info.isUpper ? 30 : 4})`}>
            {/* Contorno base de la corona */}
            <rect
              x="2"
              y="2"
              width="56"
              height="56"
              rx="6"
              fill="#ffffff"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />

            {/* SUPERFICIE SUPERIOR (Vestibular o Lingual/Palatina) */}
            <polygon
              points="4,4 56,4 42,18 18,18"
              fill={getSurfaceColor(topSurface)}
              stroke="#64748b"
              strokeWidth="1"
              className="cursor-pointer transition-colors hover:fill-sky-200"
              onClick={(e) => {
                e.stopPropagation();
                onSurfaceClick(toothNumber, topSurface);
              }}
            >
              <title>{`${info.name} - Cara ${topSurface.toUpperCase()}`}</title>
            </polygon>

            {/* SUPERFICIE INFERIOR (Lingual/Palatina o Vestibular) */}
            <polygon
              points="18,42 42,42 56,56 4,56"
              fill={getSurfaceColor(bottomSurface)}
              stroke="#64748b"
              strokeWidth="1"
              className="cursor-pointer transition-colors hover:fill-sky-200"
              onClick={(e) => {
                e.stopPropagation();
                onSurfaceClick(toothNumber, bottomSurface);
              }}
            >
              <title>{`${info.name} - Cara ${bottomSurface.toUpperCase()}`}</title>
            </polygon>

            {/* SUPERFICIE IZQUIERDA (Distal o Mesial según cuadrante) */}
            <polygon
              points="4,4 18,18 18,42 4,56"
              fill={getSurfaceColor(leftSurface)}
              stroke="#64748b"
              strokeWidth="1"
              className="cursor-pointer transition-colors hover:fill-sky-200"
              onClick={(e) => {
                e.stopPropagation();
                onSurfaceClick(toothNumber, leftSurface);
              }}
            >
              <title>{`${info.name} - Cara ${leftSurface.toUpperCase()}`}</title>
            </polygon>

            {/* SUPERFICIE DERECHA (Mesial o Distal según cuadrante) */}
            <polygon
              points="42,18 56,4 56,56 42,42"
              fill={getSurfaceColor(rightSurface)}
              stroke="#64748b"
              strokeWidth="1"
              className="cursor-pointer transition-colors hover:fill-sky-200"
              onClick={(e) => {
                e.stopPropagation();
                onSurfaceClick(toothNumber, rightSurface);
              }}
            >
              <title>{`${info.name} - Cara ${rightSurface.toUpperCase()}`}</title>
            </polygon>

            {/* SUPERFICIE CENTRAL: OCLUSAL / INCISAL */}
            <polygon
              points="18,18 42,18 42,42 18,42"
              fill={getSurfaceColor('oclusal')}
              stroke="#64748b"
              strokeWidth="1"
              className="cursor-pointer transition-colors hover:fill-sky-200"
              onClick={(e) => {
                e.stopPropagation();
                onSurfaceClick(toothNumber, 'oclusal');
              }}
            >
              <title>{`${info.name} - Cara OCLUSAL / INCISAL`}</title>
            </polygon>
          </g>

          {/* ==================================================== */}
          {/* 3. SIMBOLOGÍA COMPLETA (PATOLÓGICA / BUEN ESTADO)    */}
          {/* ==================================================== */}

          {/* A. CORONAS */}
          {/* Corona en Buen Estado (Círculo Azul Sólido) */}
          {wholeFinding === 'corona_buen_estado' && (
            <circle
              cx="30"
              cy={info.isUpper ? 58 : 32}
              r="26"
              fill="none"
              stroke="#2563eb"
              strokeWidth="3.5"
            />
          )}

          {/* Corona Defectuosa (Círculo Rojo Punteado) */}
          {wholeFinding === 'corona_defectuosa' && (
            <circle
              cx="30"
              cy={info.isUpper ? 58 : 32}
              r="26"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3.5"
              strokeDasharray="4,3"
            />
          )}

          {/* B. PIEZAS AUSENTES / EXTRACCIONES */}
          {/* Pieza Ausente Definitiva (Aspa Azul Completa) */}
          {wholeFinding === 'diente_ausente_definitivo' && (
            <g stroke="#2563eb" strokeWidth="3.8" strokeLinecap="round">
              <line x1="6" y1="8" x2="54" y2="84" />
              <line x1="54" y1="8" x2="6" y2="84" />
            </g>
          )}

          {/* Extracción Indicada (Aspa Roja Completa) */}
          {wholeFinding === 'diente_ausente_extraer' && (
            <g stroke="#ef4444" strokeWidth="3.8" strokeLinecap="round">
              <line x1="6" y1="8" x2="54" y2="84" />
              <line x1="54" y1="8" x2="6" y2="84" />
            </g>
          )}

          {/* C. RESTO RADICULAR (RR Rojo) */}
          {wholeFinding === 'resto_radicular' && (
            <g>
              <rect
                x="8"
                y={info.isUpper ? 44 : 18}
                width="44"
                height="26"
                rx="6"
                fill="#fee2e2"
                stroke="#ef4444"
                strokeWidth="1.8"
              />
              <text
                x="30"
                y={info.isUpper ? 62 : 36}
                textAnchor="middle"
                fill="#dc2626"
                fontWeight="900"
                fontSize="15"
                fontFamily="sans-serif"
              >
                RR
              </text>
            </g>
          )}

          {/* D. FRACTURA DENTAL (Rayo Rojo) */}
          {wholeFinding === 'fractura' && (
            <path
              d={info.isUpper ? 'M 8,38 L 26,56 L 22,64 L 50,80' : 'M 8,12 L 26,30 L 22,38 L 50,54'}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          )}

          {/* E. IMPLANTE DENTAL (IMP Azul) */}
          {wholeFinding === 'implante_osteointegrado' && (
            <g>
              <rect
                x="8"
                y={info.isUpper ? 8 : 56}
                width="44"
                height="22"
                rx="4"
                fill="#dbeafe"
                stroke="#2563eb"
                strokeWidth="1.8"
              />
              <text
                x="30"
                y={info.isUpper ? 24 : 72}
                textAnchor="middle"
                fill="#1d4ed8"
                fontWeight="800"
                fontSize="12"
              >
                IMP
              </text>
            </g>
          )}

          {/* F. PRÓTESIS DEFECTUOSA / EN BUEN ESTADO */}
          {/* Prótesis Defectuosa (Caja Roja Punteada con P) */}
          {(wholeFinding === 'protesis_defectuosa' || wholeFinding === 'protesis_removible_defectuosa') && (
            <g>
              <rect
                x="4"
                y={info.isUpper ? 32 : 6}
                width="52"
                height="52"
                rx="8"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="4,3"
              />
              <rect x="20" y={info.isUpper ? 48 : 22} width="20" height="18" rx="3" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
              <text x="30" y={info.isUpper ? 61 : 35} textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="11">
                {wholeFinding === 'protesis_removible_defectuosa' ? 'PR' : 'P'}
              </text>
            </g>
          )}

          {/* Prótesis Fija Defectuosa (Puente Rojo Punteado PF) */}
          {wholeFinding === 'protesis_fija_defectuosa' && (
            <g stroke="#ef4444" fill="none">
              <rect x="4" y={info.isUpper ? 32 : 6} width="52" height="52" rx="8" strokeWidth="2.5" strokeDasharray="4,3" />
              <line x1="2" y1={info.isUpper ? 58 : 32} x2="58" y2={info.isUpper ? 58 : 32} strokeWidth="3" strokeDasharray="3,2" />
              <rect x="18" y={info.isUpper ? 48 : 22} width="24" height="18" rx="3" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
              <text x="30" y={info.isUpper ? 61 : 35} textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="11" stroke="none">
                PF
              </text>
            </g>
          )}

          {/* Prótesis en Buen Estado (Caja Azul Sólida con P) */}
          {(wholeFinding === 'protesis_buen_estado' || wholeFinding === 'protesis_fija_removible' || wholeFinding === 'protesis_removible_buen_estado') && (
            <g>
              <rect
                x="4"
                y={info.isUpper ? 32 : 6}
                width="52"
                height="52"
                rx="8"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.8"
              />
              <rect x="20" y={info.isUpper ? 48 : 22} width="20" height="18" rx="3" fill="#dbeafe" stroke="#2563eb" strokeWidth="1" />
              <text x="30" y={info.isUpper ? 61 : 35} textAnchor="middle" fill="#1d4ed8" fontWeight="900" fontSize="11">
                {wholeFinding === 'protesis_removible_buen_estado' ? 'PR' : 'P'}
              </text>
            </g>
          )}

          {/* Prótesis Fija en Buen Estado (Puente Azul Sólido PF) */}
          {wholeFinding === 'protesis_fija_buen_estado' && (
            <g stroke="#2563eb" fill="none">
              <rect x="4" y={info.isUpper ? 32 : 6} width="52" height="52" rx="8" strokeWidth="2.8" />
              <line x1="2" y1={info.isUpper ? 58 : 32} x2="58" y2={info.isUpper ? 58 : 32} strokeWidth="3" />
              <rect x="18" y={info.isUpper ? 48 : 22} width="24" height="18" rx="3" fill="#dbeafe" stroke="#2563eb" strokeWidth="1" />
              <text x="30" y={info.isUpper ? 61 : 35} textAnchor="middle" fill="#1d4ed8" fontWeight="900" fontSize="11" stroke="none">
                PF
              </text>
            </g>
          )}

          {/* G. PILARES DE PRÓTESIS */}
          {wholeFinding === 'pilar_protesis_requerido' && (
            <g>
              <rect x="6" y={info.isUpper ? 34 : 8} width="48" height="48" rx="6" fill="none" stroke="#ef4444" strokeWidth="2.5" />
              <circle cx="30" cy={info.isUpper ? 58 : 32} r="10" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
              <text x="30" y={info.isUpper ? 62 : 36} textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="10">
                PP
              </text>
            </g>
          )}

          {wholeFinding === 'pilar_protesis_buen_estado' && (
            <g>
              <rect x="6" y={info.isUpper ? 34 : 8} width="48" height="48" rx="6" fill="none" stroke="#2563eb" strokeWidth="2.5" />
              <circle cx="30" cy={info.isUpper ? 58 : 32} r="10" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
              <text x="30" y={info.isUpper ? 62 : 36} textAnchor="middle" fill="#1d4ed8" fontWeight="900" fontSize="10">
                PP
              </text>
            </g>
          )}

          {/* H. APARATOS ORTODÓNTICOS */}
          {/* Aparato Ortodóntico en Buen Estado (Bracket Azul + Arco) */}
          {wholeFinding === 'aparato_ortodontico' && (
            <g stroke="#2563eb" strokeWidth="2" fill="none">
              <rect x="22" y={info.isUpper ? 50 : 24} width="16" height="16" rx="2" fill="#dbeafe" />
              <line x1="8" y1={info.isUpper ? 58 : 32} x2="52" y2={info.isUpper ? 58 : 32} strokeWidth="2.5" />
            </g>
          )}

          {/* Aparato Ortodóntico Defectuoso (Bracket Rojo Cruzado) */}
          {wholeFinding === 'aparato_ortodontico_defectuoso' && (
            <g stroke="#ef4444" strokeWidth="2" fill="none">
              <rect x="22" y={info.isUpper ? 50 : 24} width="16" height="16" rx="2" fill="#fee2e2" />
              <line x1="8" y1={info.isUpper ? 58 : 32} x2="52" y2={info.isUpper ? 58 : 32} strokeWidth="2.5" strokeDasharray="3,2" />
              <line x1="24" y1={info.isUpper ? 52 : 26} x2="36" y2={info.isUpper ? 64 : 38} strokeWidth="2" />
            </g>
          )}

          {/* I. ERUPCIÓN / IMPACTACIÓN */}
          {/* Pieza Dental Erupcionando (Flecha Roja hacia Oclusal) */}
          {wholeFinding === 'pieza_erupcionando' && (
            <g stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
              {info.isUpper ? (
                // Hacia abajo (oclusal superior)
                <>
                  <line x1="30" y1="42" x2="30" y2="72" />
                  <path d="M 23,65 L 30,73 L 37,65" fill="#ef4444" />
                </>
              ) : (
                // Hacia arriba (oclusal inferior)
                <>
                  <line x1="30" y1="50" x2="30" y2="20" />
                  <path d="M 23,27 L 30,19 L 37,27" fill="#ef4444" />
                </>
              )}
            </g>
          )}

          {/* Diente Impactado / Retenido (Óvalo Rojo Completo) */}
          {wholeFinding === 'diente_impactado' && (
            <ellipse
              cx="30"
              cy="46"
              rx="28"
              ry="42"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
            />
          )}

          {/* J. GIROVERSIÓN / MIGRACIÓN / DIASTEMA */}
          {/* Giroversión (Flecha circular curva roja) */}
          {wholeFinding === 'giroversion' && (
            <g stroke="#ef4444" strokeWidth="2.6" fill="none" strokeLinecap="round">
              <path d={info.isUpper ? 'M 18,22 C 24,14 36,14 42,22' : 'M 18,68 C 24,76 36,76 42,68'} />
              <path d={info.isUpper ? 'M 38,22 L 42,22 L 42,17' : 'M 38,68 L 42,68 L 42,73'} fill="#ef4444" />
            </g>
          )}

          {/* Migración / Extrusión / Intrusión (Flecha horizontal doble ⇄) */}
          {wholeFinding === 'migracion_extrusion_intrusion' && (
            <g stroke="#ef4444" strokeWidth="2.8" fill="#ef4444" strokeLinecap="round">
              <line x1="12" y1={info.isUpper ? 58 : 32} x2="48" y2={info.isUpper ? 58 : 32} />
              <path d={info.isUpper ? 'M 18,54 L 10,58 L 18,62 Z' : 'M 18,28 L 10,32 L 18,36 Z'} />
              <path d={info.isUpper ? 'M 42,54 L 50,58 L 42,62 Z' : 'M 42,28 L 50,32 L 42,36 Z'} />
            </g>
          )}

          {/* Diastema (Paréntesis invertidos )( en rojo) */}
          {wholeFinding === 'diastema' && (
            <g stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round">
              <path d={info.isUpper ? 'M 4,46 C 10,58 10,58 4,70' : 'M 4,20 C 10,32 10,32 4,44'} />
              <path d={info.isUpper ? 'M 56,46 C 50,58 50,58 56,70' : 'M 56,20 C 50,32 50,32 56,44'} />
            </g>
          )}

          {/* K. DIENTE SUPERNUMERARIO (S dentro de círculo Azul) */}
          {wholeFinding === 'diente_supernumerario' && (
            <g>
              <circle cx="30" cy={info.isUpper ? 58 : 32} r="16" fill="#dbeafe" stroke="#2563eb" strokeWidth="2.5" />
              <text
                x="30"
                y={info.isUpper ? 64 : 38}
                textAnchor="middle"
                fill="#1d4ed8"
                fontWeight="900"
                fontSize="15"
              >
                S
              </text>
            </g>
          )}

          {/* L. SELLANTES */}
          {/* Sellante en Buen Estado (S Azul en centro) */}
          {(wholeFinding === 'sellante_buen_estado' || surfaces.oclusal === 'sellante_buen_estado') && (
            <text
              x="30"
              y={info.isUpper ? 63 : 37}
              textAnchor="middle"
              fill="#2563eb"
              fontWeight="900"
              fontSize="14"
            >
              S
            </text>
          )}

          {/* Sellante Defectuoso (S Rojo en centro) */}
          {(wholeFinding === 'sellante_defectuoso' || surfaces.oclusal === 'sellante_defectuoso') && (
            <text
              x="30"
              y={info.isUpper ? 63 : 37}
              textAnchor="middle"
              fill="#ef4444"
              fontWeight="900"
              fontSize="14"
            >
              S
            </text>
          )}
        </svg>

        {/* Badge Flotante de Movilidad Dental (M-I, M-II, M-III) */}
        {mobility > 0 && (
          <span
            className="absolute -top-2 -left-1 px-1 py-0.2 rounded-md bg-rose-600 text-white font-black text-[9px] font-mono shadow-xs border border-white"
            title={`Movilidad Dental Grado ${mobility === 1 ? 'I' : mobility === 2 ? 'II' : 'III'}`}
          >
            M-{mobility === 1 ? 'I' : mobility === 2 ? 'II' : 'III'}
          </span>
        )}

        {/* Indicador de Nota Clínica */}
        {condition?.notes && (
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white"
            title={`Nota: ${condition.notes}`}
          />
        )}
      </div>

      {/* Etiqueta inferior del Diente (para piezas inferiores) */}
      {!info.isUpper && (
        <button
          type="button"
          onClick={() => onToothClick(toothNumber)}
          className={`mt-1 text-xs font-bold px-1.5 py-0.5 rounded transition ${
            isSelected
              ? 'bg-sky-600 text-white shadow-xs'
              : hasAnyFinding
              ? 'bg-slate-800 text-white'
              : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
          }`}
          title={info.name}
        >
          {toothNumber}
        </button>
      )}
    </div>
  );
};
