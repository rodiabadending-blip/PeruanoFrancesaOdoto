import React, { useState, useRef } from 'react';
import {
  DentalImageRecord,
  DentalImageType,
} from '../../types/dental';
import { TOOTH_NAMES } from '../odontogram/toothDefinitions';
import {
  Image,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sun,
  Contrast,
  Sliders,
  Trash2,
  Edit3,
  Download,
  Eye,
  Columns,
  X,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
  Tag,
  Search,
  Filter,
} from 'lucide-react';

interface DentalImagesModuleProps {
  images: DentalImageRecord[];
  onChange: (images: DentalImageRecord[]) => void;
  patientName: string;
}

const IMAGE_TYPE_LABELS: Record<DentalImageType, { label: string; badgeColor: string; category: 'rx' | 'photo' | 'other' }> = {
  periapical: { label: 'Rx Periapical', badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300', category: 'rx' },
  panoramica: { label: 'Rx Panorámica', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300', category: 'rx' },
  bitewing: { label: 'Rx Aleta Mordida (Bite-Wing)', badgeColor: 'bg-blue-100 text-blue-800 border-blue-300', category: 'rx' },
  oclusal: { label: 'Rx Oclusal', badgeColor: 'bg-teal-100 text-teal-800 border-teal-300', category: 'rx' },
  foto_intraoral: { label: 'Foto Intraoral', badgeColor: 'bg-rose-100 text-rose-800 border-rose-300', category: 'photo' },
  foto_extraoral: { label: 'Foto Extraoral', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300', category: 'photo' },
  tomografia: { label: 'Tomografía / CBCT', badgeColor: 'bg-purple-100 text-purple-800 border-purple-300', category: 'rx' },
  cefalometrica: { label: 'Rx Cefalométrica / Lateral', badgeColor: 'bg-sky-100 text-sky-800 border-sky-300', category: 'rx' },
  otro: { label: 'Otro Estudio / Imagen', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300', category: 'other' },
};

const DEFAULT_TAGS = [
  'Inicial / Diagnóstico',
  'Pre-operatorio',
  'Intra-operatorio',
  'Post-operatorio',
  'Control',
  'Endodoncia',
  'Periodoncia',
  'Cirugía / Extracción',
  'Ortodoncia',
  'Rehabilitación / Prótesis',
];

export const DentalImagesModule: React.FC<DentalImagesModuleProps> = ({
  images,
  onChange,
  patientName,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTooth, setFilterTooth] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modales y Visores
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingImage, setViewingImage] = useState<DentalImageRecord | null>(null);
  const [editingImage, setEditingImage] = useState<DentalImageRecord | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareLeftId, setCompareLeftId] = useState<string>(images[0]?.id || '');
  const [compareRightId, setCompareRightId] = useState<string>(images[1]?.id || images[0]?.id || '');

  // Controles de negatoscopio digital para el visor principal
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isInverted, setIsInverted] = useState(false);

  // Estados del formulario de subida
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<DentalImageType>('periapical');
  const [newToothNumber, setNewToothNumber] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState('');
  const [newTags, setNewTags] = useState<string[]>([]);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileSize, setSelectedFileSize] = useState<number>(0);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reiniciar controles del visor
  const resetViewerControls = () => {
    setZoom(1);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setIsInverted(false);
  };

  const openViewer = (image: DentalImageRecord) => {
    setViewingImage(image);
    resetViewerControls();
  };

  // Compresión y escalado en canvas para no exceder almacenamiento de localStorage
  const processImageFile = (file: File) => {
    setIsProcessingFile(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Limitar dimensión máxima a 1400px (excelente calidad diagnóstica sin saturar memoria)
        const maxDimension = 1400;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setSelectedFilePreview(compressedDataUrl);
          setSelectedFileName(file.name);
          setSelectedFileSize(Math.round((compressedDataUrl.length * 3) / 4));

          // Asignar título sugerido si está vacío
          if (!newTitle) {
            const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            setNewTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
          }
        }
        setIsProcessingFile(false);
      };
      img.onerror = () => {
        setUploadError('No se pudo procesar la imagen seleccionada. Intente con otro archivo JPG, PNG o WEBP.');
        setIsProcessingFile(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError('Error al leer el archivo.');
      setIsProcessingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSaveUpload = () => {
    if (!selectedFilePreview) {
      setUploadError('Por favor seleccione o arrastre una imagen o placa radiográfica.');
      return;
    }

    const newRecord: DentalImageRecord = {
      id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: newTitle.trim() || 'Estudio Radiográfico / Fotográfico',
      type: newType,
      date: newDate || new Date().toISOString().split('T')[0],
      toothNumber: newToothNumber ? parseInt(newToothNumber, 10) : undefined,
      dataUrl: selectedFilePreview,
      fileName: selectedFileName || 'imagen_dental.jpg',
      fileSize: selectedFileSize,
      notes: newNotes.trim(),
      tags: newTags,
      createdAt: new Date().toISOString(),
    };

    onChange([newRecord, ...images]);

    // Limpiar y cerrar
    setIsUploadModalOpen(false);
    setSelectedFilePreview(null);
    setSelectedFileName('');
    setNewTitle('');
    setNewNotes('');
    setNewToothNumber('');
    setNewTags([]);
    setUploadError(null);
  };

  const handleDeleteImage = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta placa o imagen de la historia clínica?')) {
      onChange(images.filter((img) => img.id !== id));
      if (viewingImage?.id === id) setViewingImage(null);
      if (editingImage?.id === id) setEditingImage(null);
    }
  };

  const handleSaveEdit = () => {
    if (!editingImage) return;
    onChange(
      images.map((img) => (img.id === editingImage.id ? editingImage : img))
    );
    setEditingImage(null);
  };

  // Filtrado de imágenes
  const filteredImages = images.filter((img) => {
    if (filterType !== 'all') {
      if (filterType === 'rx') {
        if (!['periapical', 'panoramica', 'bitewing', 'oclusal', 'tomografia', 'cefalometrica'].includes(img.type)) return false;
      } else if (filterType === 'photo') {
        if (!['foto_intraoral', 'foto_extraoral'].includes(img.type)) return false;
      } else if (img.type !== filterType) {
        return false;
      }
    }

    if (filterTooth !== 'all') {
      if (img.toothNumber?.toString() !== filterTooth) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = img.title.toLowerCase().includes(q);
      const matchNotes = img.notes?.toLowerCase().includes(q) || false;
      const matchTooth = img.toothNumber?.toString().includes(q) || false;
      const matchTags = img.tags?.some((t) => t.toLowerCase().includes(q)) || false;
      if (!matchTitle && !matchNotes && !matchTooth && !matchTags) return false;
    }

    return true;
  });

  const countRx = images.filter((img) =>
    ['periapical', 'panoramica', 'bitewing', 'oclusal', 'tomografia', 'cefalometrica'].includes(img.type)
  ).length;
  const countPhotos = images.filter((img) =>
    ['foto_intraoral', 'foto_extraoral'].includes(img.type)
  ).length;

  return (
    <div className="space-y-6">
      {/* 1. Header del Módulo con Contadores y Acciones Principales */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center shadow-inner">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                  Placas Radiográficas & Registro Fotográfico
                </h2>
                <span className="bg-slate-100 text-slate-700 text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-slate-200">
                  {images.length} {images.length === 1 ? 'estudio' : 'estudios'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Negatoscopio digital, visor interactivo con inversión de contraste y archivo de imágenes para <span className="font-semibold text-slate-700">{patientName}</span>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsCompareMode(!isCompareMode)}
              disabled={images.length < 2}
              className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
                isCompareMode
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none'
              }`}
              title="Comparar dos placas o fotografías lado a lado"
            >
              <Columns className="w-4 h-4" />
              {isCompareMode ? 'Cerrar Comparativa' : 'Modo Comparativa (2 Placas)'}
            </button>

            <button
              onClick={() => {
                setIsUploadModalOpen(true);
                setSelectedFilePreview(null);
                setUploadError(null);
              }}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Subir Nueva Placa o Imagen
            </button>
          </div>
        </div>

        {/* Resumen Estadístico Rápido */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-slate-600 font-medium">Total de Registros:</span>
            <span className="font-mono font-black text-slate-900 text-sm">{images.length}</span>
          </div>
          <div className="bg-cyan-50/70 border border-cyan-200 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-cyan-800 font-medium">Radiografías / Placas:</span>
            <span className="font-mono font-black text-cyan-900 text-sm">{countRx}</span>
          </div>
          <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-rose-800 font-medium">Fotografías Clínicas:</span>
            <span className="font-mono font-black text-rose-900 text-sm">{countPhotos}</span>
          </div>
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-amber-800 font-medium">Piezas con Estudio:</span>
            <span className="font-mono font-black text-amber-900 text-sm">
              {new Set(images.filter((i) => i.toothNumber).map((i) => i.toothNumber)).size}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Panel Comparativo de 2 Placas (Si está activo) */}
      {isCompareMode && images.length >= 2 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Columns className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-slate-100">
                Comparador Clínico Doble (Evolución Pre / Post Tratamiento)
              </h3>
            </div>
            <button
              onClick={() => setIsCompareMode(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Panel Izquierdo */}
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">Placa / Imagen A:</span>
                <select
                  value={compareLeftId}
                  onChange={(e) => setCompareLeftId(e.target.value)}
                  className="bg-slate-800 text-xs text-white border border-slate-700 rounded px-2 py-1 outline-none"
                >
                  {images.map((img) => (
                    <option key={img.id} value={img.id}>
                      {img.title} ({img.date})
                    </option>
                  ))}
                </select>
              </div>
              {(() => {
                const imgA = images.find((i) => i.id === compareLeftId) || images[0];
                return (
                  <div className="flex-1 flex flex-col">
                    <div className="relative flex-1 bg-black/60 rounded border border-slate-800 min-h-[280px] max-h-[350px] flex items-center justify-center overflow-hidden">
                      <img
                        src={imgA.dataUrl}
                        alt={imgA.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-slate-400">
                      <div className="font-bold text-slate-200">{imgA.title}</div>
                      <div>Fecha: {imgA.date} • Tipo: {IMAGE_TYPE_LABELS[imgA.type]?.label}</div>
                      {imgA.notes && <div className="mt-1 text-slate-300 italic line-clamp-2">{imgA.notes}</div>}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Panel Derecho */}
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">Placa / Imagen B:</span>
                <select
                  value={compareRightId}
                  onChange={(e) => setCompareRightId(e.target.value)}
                  className="bg-slate-800 text-xs text-white border border-slate-700 rounded px-2 py-1 outline-none"
                >
                  {images.map((img) => (
                    <option key={img.id} value={img.id}>
                      {img.title} ({img.date})
                    </option>
                  ))}
                </select>
              </div>
              {(() => {
                const imgB = images.find((i) => i.id === compareRightId) || images[1] || images[0];
                return (
                  <div className="flex-1 flex flex-col">
                    <div className="relative flex-1 bg-black/60 rounded border border-slate-800 min-h-[280px] max-h-[350px] flex items-center justify-center overflow-hidden">
                      <img
                        src={imgB.dataUrl}
                        alt={imgB.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-slate-400">
                      <div className="font-bold text-slate-200">{imgB.title}</div>
                      <div>Fecha: {imgB.date} • Tipo: {IMAGE_TYPE_LABELS[imgB.type]?.label}</div>
                      {imgB.notes && <div className="mt-1 text-slate-300 italic line-clamp-2">{imgB.notes}</div>}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 3. Barra de Búsqueda y Filtros */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, pieza o hallazgo..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Filtro por Categoría / Tipo */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Tipo:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">Todos los Tipos</option>
              <option value="rx">Todas las Radiografías (Placas)</option>
              <option value="photo">Fotografías Clínicas</option>
              <option value="periapical">Rx Periapical</option>
              <option value="panoramica">Rx Panorámica</option>
              <option value="bitewing">Rx Aleta de Mordida</option>
              <option value="oclusal">Rx Oclusal</option>
              <option value="tomografia">Tomografía / CBCT</option>
              <option value="foto_intraoral">Foto Intraoral</option>
              <option value="foto_extraoral">Foto Extraoral</option>
            </select>
          </div>

          {/* Filtro por Pieza Dental */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Pieza:</span>
            <select
              value={filterTooth}
              onChange={(e) => setFilterTooth(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">Todas</option>
              {Array.from(new Set(images.filter((i) => i.toothNumber).map((i) => i.toothNumber!)))
                .sort((a, b) => a - b)
                .map((tooth) => (
                  <option key={tooth} value={tooth.toString()}>
                    Pieza {tooth}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Galería de Placas e Imágenes */}
      {filteredImages.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Image className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {images.length === 0 ? 'Sin placas o imágenes registradas' : 'No se encontraron resultados'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            {images.length === 0
              ? 'Cargue radiografías periapicales, panorámicas, aletas de mordida o fotografías intraorales y extraorales del paciente.'
              : 'Pruebe ajustando los filtros de tipo o el término de búsqueda.'}
          </p>
          {images.length === 0 && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm"
            >
              <Upload className="w-4 h-4" />
              Subir Primera Placa o Fotografía
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredImages.map((img) => {
            const typeInfo = IMAGE_TYPE_LABELS[img.type] || IMAGE_TYPE_LABELS.otro;
            return (
              <div
                key={img.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Contenedor de Imagen Estilo Negatoscopio */}
                <div
                  onClick={() => openViewer(img)}
                  className="relative aspect-4/3 bg-slate-950 flex items-center justify-center cursor-pointer overflow-hidden group/thumb"
                >
                  <img
                    src={img.dataUrl}
                    alt={img.title}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover/thumb:scale-105"
                  />

                  {/* Overlay al hacer hover */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-teal-600/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-xs">
                      <Eye className="w-3.5 h-3.5" />
                      Ver en Negatoscopio
                    </span>
                  </div>

                  {/* Badge de Tipo en la esquina */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-xs ${typeInfo.badgeColor}`}>
                      {typeInfo.label}
                    </span>
                  </div>

                  {/* Badge de Pieza Dental si aplica */}
                  {img.toothNumber && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="bg-slate-900/85 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-amber-400/40 shadow-xs">
                        Pz {img.toothNumber}
                      </span>
                    </div>
                  )}
                </div>

                {/* Información y Hallazgos */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-800 line-clamp-1 group-hover:text-teal-700 transition-colors">
                        {img.title}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {img.date}
                      </span>
                    </div>

                    {img.toothNumber && TOOTH_NAMES[img.toothNumber] && (
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {TOOTH_NAMES[img.toothNumber]?.name}
                      </p>
                    )}

                    {/* Notas Clínicas / Hallazgos Radiográficos */}
                    {img.notes ? (
                      <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2">
                        <span className="font-semibold text-slate-700">Hallazgos: </span>
                        {img.notes}
                      </div>
                    ) : (
                      <p className="mt-2 text-[11px] text-slate-400 italic">
                        Sin informe radiográfico redactado.
                      </p>
                    )}

                    {/* Etiquetas */}
                    {img.tags && img.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {img.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Acciones de la Card */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => openViewer(img)}
                      className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Abrir Visor
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingImage({ ...img })}
                        title="Editar informe y datos"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={img.dataUrl}
                        download={img.fileName || `estudio_${img.id}.jpg`}
                        title="Descargar imagen"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        title="Eliminar placa"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL DE SUBIDA DE NUEVA PLACA / IMAGEN              */}
      {/* ======================================================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header del Modal */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Upload className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-base text-slate-100">
                  Cargar Nueva Placa Radiográfica o Fotografía
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del Formulario */}
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                  {uploadError}
                </div>
              )}

              {/* Zona de Arrastrar y Soltar / Selección */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                />

                {!selectedFilePreview ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-teal-50/30 transition-all flex flex-col items-center justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mb-2">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      Haga clic o arrastre aquí su placa radiográfica o fotografía
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      Admite archivos JPG, PNG, WEBP (se optimizan automáticamente para diagnóstico)
                    </span>
                    {isProcessingFile && (
                      <span className="mt-2 text-xs font-bold text-teal-600 animate-pulse">
                        Procesando y optimizando imagen...
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-center min-h-[220px] max-h-[300px]">
                    <img
                      src={selectedFilePreview}
                      alt="Previsualización"
                      className="max-h-[280px] max-w-full object-contain rounded"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 bg-slate-800/90 hover:bg-slate-750 text-white text-xs font-semibold rounded shadow-md"
                      >
                        Cambiar Archivo
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFilePreview(null);
                          setSelectedFileName('');
                        }}
                        className="p-1 bg-rose-600/90 text-white rounded shadow-md hover:bg-rose-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/75 text-slate-200 text-[10px] px-2 py-0.5 rounded font-mono">
                      {selectedFileName} (aprox. {Math.round(selectedFileSize / 1024)} KB)
                    </div>
                  </div>
                )}
              </div>

              {/* Campos de Información Clínica */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Título o Descripción Corta *
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ej: Rx Periapical Pz 46 - Control"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipo de Estudio Odontológico *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as DentalImageType)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white font-medium"
                  >
                    <option value="periapical">Radiografía Periapical</option>
                    <option value="panoramica">Radiografía Panorámica (Ortopantomografía)</option>
                    <option value="bitewing">Radiografía Aleta de Mordida (Bite-Wing)</option>
                    <option value="oclusal">Radiografía Oclusal</option>
                    <option value="tomografia">Tomografía Cone-Beam (CBCT)</option>
                    <option value="cefalometrica">Radiografía Cefalométrica / Lateral</option>
                    <option value="foto_intraoral">Fotografía Clínica Intraoral</option>
                    <option value="foto_extraoral">Fotografía Clínica Extraoral</option>
                    <option value="otro">Otro Estudio / Documento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pieza Dental (Opcional)
                  </label>
                  <select
                    value={newToothNumber}
                    onChange={(e) => setNewToothNumber(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white font-mono"
                  >
                    <option value="">No aplica (Estudio general / Panorámica)</option>
                    <optgroup label="Cuadrante 1 (Superior Derecho)">
                      {[18, 17, 16, 15, 14, 13, 12, 11].map((n) => (
                        <option key={n} value={n}>
                          Pieza {n} - {TOOTH_NAMES[n]?.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Cuadrante 2 (Superior Izquierdo)">
                      {[21, 22, 23, 24, 25, 26, 27, 28].map((n) => (
                        <option key={n} value={n}>
                          Pieza {n} - {TOOTH_NAMES[n]?.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Cuadrante 3 (Inferior Izquierdo)">
                      {[38, 37, 36, 35, 34, 33, 32, 31].map((n) => (
                        <option key={n} value={n}>
                          Pieza {n} - {TOOTH_NAMES[n]?.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Cuadrante 4 (Inferior Derecho)">
                      {[41, 42, 43, 44, 45, 46, 47, 48].map((n) => (
                        <option key={n} value={n}>
                          Pieza {n} - {TOOTH_NAMES[n]?.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fecha de Toma / Estudio
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Informe Radiográfico / Hallazgos Clínicos */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Informe Radiográfico / Interpretación y Hallazgos Clínicos
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Detalle los hallazgos: nivel de cresta ósea, conductos, zona radiolúcida/radiopaca, ensanchamiento de ligamento, lesiones apicales, obturaciones..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white resize-none"
                />
              </div>

              {/* Etiquetas Rápidas */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Etiquetas Clínicas Rápidas
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_TAGS.map((tag) => {
                    const isSelected = newTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => {
                          if (isSelected) {
                            setNewTags(newTags.filter((t) => t !== tag));
                          } else {
                            setNewTags([...newTags, tag]);
                          }
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-md border font-medium transition-all ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveUpload}
                disabled={!selectedFilePreview}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-sm disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                Guardar en Historia Clínica
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. MODAL VISOR NEGATOSCOPIO DIGITAL AVANZADO             */}
      {/* ======================================================== */}
      {viewingImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col animate-in fade-in duration-150">
          {/* Barra Superior del Negatoscopio */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${IMAGE_TYPE_LABELS[viewingImage.type]?.badgeColor || 'bg-slate-800 text-white'}`}>
                {IMAGE_TYPE_LABELS[viewingImage.type]?.label}
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  {viewingImage.title}
                  {viewingImage.toothNumber && (
                    <span className="text-amber-400 font-mono text-xs">
                      [Pieza {viewingImage.toothNumber}]
                    </span>
                  )}
                </h3>
                <span className="text-[10px] text-slate-400">
                  {patientName} • Fecha: {viewingImage.date}
                </span>
              </div>
            </div>

            {/* Herramientas Rápidas del Negatoscopio */}
            <div className="flex items-center gap-1.5">
              {/* Botón Negativo / Invertir (Filtro Radiográfico Clave) */}
              <button
                onClick={() => setIsInverted(!isInverted)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
                  isInverted
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
                title="Invertir colores (Efecto Negativo para examinar trabéculas óseas)"
              >
                <Contrast className="w-3.5 h-3.5" />
                {isInverted ? 'Negativo: Activo' : 'Invertir / Negativo'}
              </button>

              {/* Botón Rotar */}
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg"
                title="Rotar 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Botones de Zoom */}
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.25, 4))}
                className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg"
                title="Aumentar zoom"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg"
                title="Reducir zoom"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <button
                onClick={resetViewerControls}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg"
              >
                Reset ({Math.round(zoom * 100)}%)
              </button>

              <a
                href={viewingImage.dataUrl}
                download={viewingImage.fileName || 'placa_radiografica.jpg'}
                className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg ml-2"
                title="Descargar archivo original"
              >
                <Download className="w-4 h-4" />
              </a>

              <button
                onClick={() => setViewingImage(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-rose-900/60 border border-slate-700 rounded-lg ml-1"
                title="Cerrar visor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Área Central: Imagen + Barra Lateral de Ajustes e Informe */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Canvas / Viewport de la Imagen */}
            <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden select-none p-4">
              <div
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  filter: `${isInverted ? 'invert(1) ' : ''}brightness(${brightness}%) contrast(${contrast}%)`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="max-h-[82vh] max-w-[85vw] flex items-center justify-center cursor-move"
              >
                <img
                  src={viewingImage.dataUrl}
                  alt={viewingImage.title}
                  className="max-h-[82vh] max-w-[85vw] object-contain shadow-2xl pointer-events-none"
                />
              </div>

              {/* Indicador de Filtros Activos Flotante */}
              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-xs border border-slate-700 text-slate-300 text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-3">
                <span>Zoom: {Math.round(zoom * 100)}%</span>
                <span>•</span>
                <span>Brillo: {brightness}%</span>
                <span>•</span>
                <span>Contraste: {contrast}%</span>
                {isInverted && (
                  <>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">Filtro Negativo ON</span>
                  </>
                )}
              </div>
            </div>

            {/* Barra Lateral de Controles e Informe Radiográfico */}
            <div className="w-full md:w-80 bg-slate-900 border-l border-slate-800 p-4 text-slate-200 overflow-y-auto space-y-5 shrink-0">
              {/* Sliders de Ajuste Visual */}
              <div className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sliders className="w-3.5 h-3.5 text-teal-400" />
                  Calibración de Imagen (X-Ray)
                </h4>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-400" /> Brillo
                    </span>
                    <span className="font-mono">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="220"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                    className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Contrast className="w-3 h-3 text-cyan-400" /> Contraste
                    </span>
                    <span className="font-mono">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="250"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                    className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Ficha Clínica del Estudio */}
              <div className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Informe Radiográfico
                </h4>

                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">TIPO DE ESTUDIO:</span>
                  <span className="font-medium text-slate-200">
                    {IMAGE_TYPE_LABELS[viewingImage.type]?.label}
                  </span>
                </div>

                {viewingImage.toothNumber && (
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">PIEZA DENTAL:</span>
                    <span className="font-mono text-amber-400 font-bold">
                      Pieza {viewingImage.toothNumber}
                    </span>
                    {TOOTH_NAMES[viewingImage.toothNumber] && (
                      <span className="block text-[11px] text-slate-400">
                        {TOOTH_NAMES[viewingImage.toothNumber]?.name}
                      </span>
                    )}
                  </div>
                )}

                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">HALLAZGOS REGISTRADOS:</span>
                  {viewingImage.notes ? (
                    <p className="mt-1 text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px]">
                      {viewingImage.notes}
                    </p>
                  ) : (
                    <p className="mt-1 text-slate-500 italic text-[11px]">
                      Sin observaciones redactadas aún.
                    </p>
                  )}
                </div>

                {viewingImage.tags && viewingImage.tags.length > 0 && (
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold mb-1">ETIQUETAS:</span>
                    <div className="flex flex-wrap gap-1">
                      {viewingImage.tags.map((t, idx) => (
                        <span key={idx} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setEditingImage({ ...viewingImage });
                    setViewingImage(null);
                  }}
                  className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Editar Informe y Datos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. MODAL DE EDICIÓN DE INFORME Y DATOS                  */}
      {/* ======================================================== */}
      {editingImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-teal-600" />
                Editar Datos e Informe de Estudio
              </h3>
              <button
                onClick={() => setEditingImage(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título</label>
                <input
                  type="text"
                  value={editingImage.title}
                  onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo</label>
                  <select
                    value={editingImage.type}
                    onChange={(e) => setEditingImage({ ...editingImage, type: e.target.value as DentalImageType })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  >
                    <option value="periapical">Rx Periapical</option>
                    <option value="panoramica">Rx Panorámica</option>
                    <option value="bitewing">Rx Aleta de Mordida</option>
                    <option value="oclusal">Rx Oclusal</option>
                    <option value="tomografia">Tomografía / CBCT</option>
                    <option value="cefalometrica">Rx Cefalométrica</option>
                    <option value="foto_intraoral">Foto Intraoral</option>
                    <option value="foto_extraoral">Foto Extraoral</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pieza Dental</label>
                  <input
                    type="number"
                    min="11"
                    max="48"
                    value={editingImage.toothNumber || ''}
                    onChange={(e) =>
                      setEditingImage({
                        ...editingImage,
                        toothNumber: e.target.value ? parseInt(e.target.value, 10) : undefined,
                      })
                    }
                    placeholder="Ej: 46"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={editingImage.date}
                  onChange={(e) => setEditingImage({ ...editingImage, date: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Informe Radiográfico / Hallazgos Clínicos
                </label>
                <textarea
                  rows={4}
                  value={editingImage.notes || ''}
                  onChange={(e) => setEditingImage({ ...editingImage, notes: e.target.value })}
                  placeholder="Describa la interpretación clínica y radiográfica..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingImage(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
