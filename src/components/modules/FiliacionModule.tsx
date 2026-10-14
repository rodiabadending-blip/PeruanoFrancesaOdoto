import React from 'react';
import {
  PatientFiliation,
  DocumentType,
  Sex,
  BloodType,
} from '../../types/dental';
import {
  User,
  CreditCard,
  Hash,
  Calendar,
  Clock,
  HeartHandshake,
  Droplets,
  Phone,
  Mail,
  Briefcase,
  Heart,
  MapPin,
  Map,
  Building,
  GraduationCap,
  ShieldAlert,
  PhoneCall,
  UserCheck,
  ChevronDown,
} from 'lucide-react';

interface FiliacionModuleProps {
  filiation: PatientFiliation;
  onChange: (filiation: PatientFiliation) => void;
}

export const FiliacionModule: React.FC<FiliacionModuleProps> = ({
  filiation,
  onChange,
}) => {
  const handleChange = (field: keyof PatientFiliation, value: any) => {
    const updated = { ...filiation, [field]: value };

    // Auto-cálculo de edad si cambia fecha de nacimiento
    if (field === 'birthDate' && value) {
      const birth = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age >= 0 && age < 125) {
        updated.age = age;
      }
    }

    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Tarjeta Principal de Datos Generales y Filiación */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        {/* Encabezado con título e icono de usuario en azul cobalto */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1D4ED8] shrink-0 shadow-2xs">
              <User className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Datos Generales y Filiación del Paciente
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Centro Odontológico Peruano Francesa • Dirección: Mz II lote N° 3 5ta etapa San Andres
              </p>
            </div>
          </div>

          {/* Tarjeta flotante con N° de Historia Clínica */}
          <div className="flex items-center gap-2.5 bg-[#F8FAFC] px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-600">N° de Historia Clínica:</span>
            <input
              type="text"
              value={filiation.hcNumber}
              onChange={(e) => handleChange('hcNumber', e.target.value)}
              className="text-xs font-mono font-bold text-[#1D4ED8] bg-white px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] w-36 shadow-2xs"
            />
          </div>
        </div>

        {/* Grid de 4 columnas impecablemente alineado con iconos discretos y bordes suaves */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* 1. Nombres */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Nombres *
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
              <input
                type="text"
                value={filiation.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition shadow-2xs"
                placeholder="Nombres completos"
              />
            </div>
          </div>

          {/* 2. Apellidos */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Apellidos *
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
              <input
                type="text"
                value={filiation.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition shadow-2xs"
                placeholder="Apellidos paterno y materno"
              />
            </div>
          </div>

          {/* 3. Tipo de Documento */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Tipo de Documento
            </label>
            <div className="relative">
              <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8] pointer-events-none" />
              <select
                value={filiation.docType}
                onChange={(e) => handleChange('docType', e.target.value as DocumentType)}
                className="w-full text-xs pl-9 pr-8 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition shadow-2xs appearance-none"
              >
                <option value="DNI">DNI (Documento Nacional)</option>
                <option value="Carnet de Extranjería">Carnet de Extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Sin Documento">Sin Documento</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]" />
            </div>
          </div>

          {/* 4. N° de Documento */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              N° de Documento
            </label>
            <div className="relative">
              <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
              <input
                type="text"
                value={filiation.docNumber}
                onChange={(e) => handleChange('docNumber', e.target.value)}
                className="w-full text-xs font-mono pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition shadow-2xs"
                placeholder="ej: 72489102"
              />
            </div>
          </div>

          {/* 5. Fecha de Nacimiento */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Fecha de Nacimiento
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
              <input
                type="date"
                value={filiation.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition shadow-2xs"
              />
            </div>
          </div>

          {/* 6. Edad */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Edad
            </label>
            <div className="relative flex items-center">
              <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
              <input
                type="number"
                value={filiation.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                className="w-full text-xs pl-9 pr-14 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition shadow-2xs"
              />
              <span className="text-[11px] text-slate-400 font-medium absolute right-3 pointer-events-none">
                años
              </span>
            </div>
          </div>

          {/* 7. Sexo Biológico */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Sexo Biológico
            </label>
            <div className="relative">
              <HeartHandshake className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8] pointer-events-none" />
              <select
                value={filiation.sex}
                onChange={(e) => handleChange('sex', e.target.value as Sex)}
                className="w-full text-xs pl-9 pr-8 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition shadow-2xs appearance-none"
              >
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="Otro">Otro</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]" />
            </div>
          </div>

          {/* 8. Grupo y Factor Rh */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Grupo y Factor Rh
            </label>
            <div className="relative">
              <Droplets className="w-3.5 h-3.5 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8] pointer-events-none" />
              <select
                value={filiation.bloodType}
                onChange={(e) => handleChange('bloodType', e.target.value as BloodType)}
                className="w-full text-xs pl-9 pr-8 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl text-slate-800 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition shadow-2xs appearance-none"
              >
                <option value="O+">O Rh+ (Positivo)</option>
                <option value="O-">O Rh- (Negativo)</option>
                <option value="A+">A Rh+ (Positivo)</option>
                <option value="A-">A Rh- (Negativo)</option>
                <option value="B+">B Rh+ (Positivo)</option>
                <option value="B-">B Rh- (Negativo)</option>
                <option value="AB+">AB Rh+ (Positivo)</option>
                <option value="AB-">AB Rh- (Negativo)</option>
                <option value="Desconocido">Desconocido</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]" />
            </div>
          </div>

          {/* 9. Teléfono / Celular */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Teléfono / Celular
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
              <input
                type="tel"
                value={filiation.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition shadow-2xs"
                placeholder="+51 999 999 999"
              />
            </div>
          </div>

          {/* 10. Correo Electrónico (Sobre) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
              <input
                type="email"
                value={filiation.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition shadow-2xs"
                placeholder="paciente@ejemplo.com"
              />
            </div>
          </div>

          {/* 11. Ocupación / Profesión (Maletín) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Ocupación / Profesión
            </label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
              <input
                type="text"
                value={filiation.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition shadow-2xs"
                placeholder="ej: Docente, Ingeniero..."
              />
            </div>
          </div>

          {/* 12. Estado Civil */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Estado Civil
            </label>
            <div className="relative">
              <Heart className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8] pointer-events-none" />
              <select
                value={filiation.maritalStatus}
                onChange={(e) => handleChange('maritalStatus', e.target.value as any)}
                className="w-full text-xs pl-9 pr-8 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition shadow-2xs appearance-none"
              >
                <option value="Soltero(a)">Soltero(a)</option>
                <option value="Casado(a)">Casado(a)</option>
                <option value="Conviviente">Conviviente</option>
                <option value="Divorciado(a)">Divorciado(a)</option>
                <option value="Viudo(a)">Viudo(a)</option>
                <option value="Menor de edad">Menor de edad</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]" />
            </div>
          </div>

          {/* 13. Dirección de Domicilio Actual (Mapa - Ocupa 2 columnas en pantallas grandes) */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Dirección de Domicilio Actual
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
              <input
                type="text"
                value={filiation.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition shadow-2xs"
                placeholder="Av. / Calle, N°, Manzana, Urbanización"
              />
            </div>
          </div>

          {/* 14. Distrito / Ciudad */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Distrito / Ciudad
            </label>
            <div className="relative">
              <Map className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
              <input
                type="text"
                value={filiation.district}
                onChange={(e) => handleChange('district', e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition shadow-2xs"
                placeholder="ej: Trujillo, Víctor Larco"
              />
            </div>
          </div>

          {/* 15. Lugar de Nacimiento */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Lugar de Nacimiento
            </label>
            <div className="relative">
              <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
              <input
                type="text"
                value={filiation.birthPlace}
                onChange={(e) => handleChange('birthPlace', e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition shadow-2xs"
                placeholder="ej: Trujillo, La Libertad"
              />
            </div>
          </div>
        </div>

        {/* Sección de Tutor o Apoderado Legal */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200/90 shadow-2xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filiation.tutorRequired}
                onChange={(e) => handleChange('tutorRequired', e.target.checked)}
                className="w-4 h-4 text-[#1D4ED8] rounded border-slate-300 focus:ring-[#1D4ED8]"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  ¿El paciente requiere Tutor, Acompañante o Apoderado Legal?
                </span>
                <span className="text-[11px] text-slate-500">
                  Requerido para menores de edad, adultos mayores o pacientes que requieran asistencia legal.
                </span>
              </div>
            </label>

            {filiation.tutorRequired && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200/80">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Nombre del Apoderado
                  </label>
                  <div className="relative">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
                    <input
                      type="text"
                      value={filiation.tutorName}
                      onChange={(e) => handleChange('tutorName', e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8]"
                      placeholder="Nombre completo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    DNI / Documento del Apoderado
                  </label>
                  <div className="relative">
                    <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
                    <input
                      type="text"
                      value={filiation.tutorDocNumber}
                      onChange={(e) => handleChange('tutorDocNumber', e.target.value)}
                      className="w-full text-xs font-mono pl-9 pr-3 py-2 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8]"
                      placeholder="N° de documento"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Parentesco
                  </label>
                  <div className="relative">
                    <HeartHandshake className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
                    <input
                      type="text"
                      value={filiation.tutorRelationship}
                      onChange={(e) => handleChange('tutorRelationship', e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8]"
                      placeholder="ej: Padre, Madre, Hijo(a)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Teléfono del Apoderado
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
                    <input
                      type="tel"
                      value={filiation.tutorPhone}
                      onChange={(e) => handleChange('tutorPhone', e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8]"
                      placeholder="+51 999 999 999"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
