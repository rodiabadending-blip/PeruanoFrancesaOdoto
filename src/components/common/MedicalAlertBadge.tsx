import React from 'react';
import { MedicalBackground } from '../../types/dental';
import { AlertTriangle, Heart, Baby, ShieldAlert } from 'lucide-react';

interface MedicalAlertBadgeProps {
  medicalBackground: MedicalBackground;
}

export const MedicalAlertBadge: React.FC<MedicalAlertBadgeProps> = ({ medicalBackground }) => {
  const bg = medicalBackground;
  const alerts: { label: string; details?: string; icon: any; color: string }[] = [];

  if (bg.hasAllergies) {
    alerts.push({
      label: 'ALERGIA A MEDICAMENTOS',
      details: bg.allergiesDetails || 'Precaución farmacológica',
      icon: ShieldAlert,
      color: 'bg-rose-600 text-white',
    });
  }

  if (bg.hasBleedingDisorders) {
    alerts.push({
      label: 'RIESGO DE HEMORRAGIA / COAGULACIÓN',
      details: bg.bleedingDisordersDetails,
      icon: AlertTriangle,
      color: 'bg-rose-700 text-white',
    });
  }

  if (bg.hasHypertension) {
    alerts.push({
      label: 'HIPERTENSIÓN ARTERIAL',
      details: bg.hypertensionDetails,
      icon: Heart,
      color: 'bg-amber-600 text-white',
    });
  }

  if (bg.isPregnant) {
    alerts.push({
      label: `GESTACIÓN (${bg.gestationWeeks ? `${bg.gestationWeeks} sem` : 'Embarazo'})`,
      details: 'Precaución con anestésicos y radiografías',
      icon: Baby,
      color: 'bg-purple-600 text-white',
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="bg-rose-50 border-y border-rose-200 py-1.5 px-4 text-xs font-semibold flex items-center gap-3 overflow-x-auto shadow-2xs">
      <span className="text-[11px] font-black uppercase text-rose-800 flex items-center gap-1 shrink-0">
        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
        Alertas Médicas:
      </span>
      <div className="flex items-center gap-2 flex-wrap">
        {alerts.map((alert, idx) => {
          const Icon = alert.icon;
          return (
            <span
              key={idx}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs ${alert.color}`}
            >
              <Icon className="w-3 h-3" />
              <span>{alert.label}</span>
              {alert.details && (
                <span className="opacity-90 font-normal border-l border-white/30 pl-1.5 ml-0.5">
                  {alert.details}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};
