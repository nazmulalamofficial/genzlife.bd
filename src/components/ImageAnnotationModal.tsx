import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Circle, 
  ArrowUpRight, 
  Square, 
  Pencil, 
  Type, 
  Undo2, 
  Redo2, 
  Trash2, 
  RotateCcw, 
  Check, 
  X, 
  Sparkles, 
  AlertCircle, 
  Info,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export type AnnotationTool = 'circle' | 'arrow' | 'rect' | 'pen' | 'text';

export interface AnnotationItem {
  id: string;
  type: AnnotationTool;
  color: string;
  strokeWidth: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  points?: { x: number; y: number }[];
  text?: string;
  x?: number;
  y?: number;
}

interface ImageAnnotationModalProps {
  isOpen: boolean;
  imageUrl: string;
  originalImageUrl?: string;
  imageIndex?: number;
  totalImages?: number;
  onSave: (annotatedBase64: string, index?: number) => void;
  onClose: () => void;
  onSwitchImage?: (newIndex: number) => void;
  lang: 'bn' | 'en';
}

const COLOR_PALETTE = [
  { label: "Crimson Red (ক্ষতি/দাগ)", color: "#EF4444" },
  { label: "Amber Orange (সতর্কতা)", color: "#F59E0B" },
  { label: "Electric Yellow", color: "#FACC15" },
  { label: "Emerald Green (শনাক্ত)", color: "#10B981" },
  { label: "Cyan Blue", color: "#06B6D4" },
  { label: "Pure White", color: "#FFFFFF" }
];

const STROKE_WIDTHS = [
  { labelBn: "চিকন", labelEn: "Thin", value: 3 },
  { labelBn: "মাঝারি", labelEn: "Medium", value: 5 },
  { labelBn: "মোটা", labelEn: "Bold", value: 8 },
];

const DAMAGE_PRESETS = [
  { bn: "স্ক্র্যাচ / আঁচড়", en: "Scratch", tool: "circle" as AnnotationTool, color: "#EF4444" },
  { bn: "ডিসপ্লে ক্র্যাক", en: "Screen Crack", tool: "arrow" as AnnotationTool, color: "#EF4444" },
  { bn: "বডি ডেন্ট", en: "Body Dent", tool: "circle" as AnnotationTool, color: "#F59E0B" },
  { bn: "ক্যামেরা স্ক্র্যাচ", en: "Camera Scratch", tool: "circle" as AnnotationTool, color: "#EF4444" },
  { bn: "অনন্য স্টিকার বা চিহ্ন", en: "Unique Mark", tool: "arrow" as AnnotationTool, color: "#10B981" },
];

export const ImageAnnotationModal: React.FC<ImageAnnotationModalProps> = ({
  isOpen,
  imageUrl,
  originalImageUrl,
  imageIndex = 0,
  totalImages = 1,
  onSave,
  onClose,
  onSwitchImage,
  lang
}) => {
  const [activeTool, setActiveTool] = useState<AnnotationTool>('circle');
  const [activeColor, setActiveColor] = useState<string>('#EF4444');
  const [strokeWidth, setStrokeWidth] = useState<number>(5);
  const [labelText, setLabelText] = useState<string>("");
  
  // Annotation history stack for Undo/Redo
  const [annotations, setAnnotations] = useState<AnnotationItem[]>([]);
  const [redoStack, setRedoStack] = useState<AnnotationItem[][]>([]);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<AnnotationItem | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load image
  useEffect(() => {
    if (!isOpen || !imageUrl) return;

    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      imageObjRef.current = img;
      setImageLoaded(true);
      setAnnotations([]);
      setRedoStack([]);
      setCurrentAnnotation(null);
    };
  }, [isOpen, imageUrl]);

  // Convert client coordinates to canvas image coordinates
  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }, []);

  // Helper to draw single annotation item
  const drawAnnotation = useCallback((ctx: CanvasRenderingContext2D, item: AnnotationItem) => {
    ctx.save();
    ctx.strokeStyle = item.color;
    ctx.fillStyle = item.color;
    ctx.lineWidth = item.strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Subtle drop shadow for high contrast on light or dark background
    ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    switch (item.type) {
      case 'circle': {
        if (item.startX !== undefined && item.startY !== undefined && 
            item.endX !== undefined && item.endY !== undefined) {
          const cx = (item.startX + item.endX) / 2;
          const cy = (item.startY + item.endY) / 2;
          const rx = Math.max(Math.abs(item.endX - item.startX) / 2, 4);
          const ry = Math.max(Math.abs(item.endY - item.startY) / 2, 4);

          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Optional subtle inner center dot or crosshair highlight
          ctx.beginPath();
          ctx.arc(cx, cy, item.strokeWidth * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'arrow': {
        if (item.startX !== undefined && item.startY !== undefined && 
            item.endX !== undefined && item.endY !== undefined) {
          const sx = item.startX;
          const sy = item.startY;
          const ex = item.endX;
          const ey = item.endY;

          // Main line
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.stroke();

          // Arrowhead at destination pointing at damage
          const angle = Math.atan2(ey - sy, ex - sx);
          const headLen = Math.max(16, item.strokeWidth * 3.6);

          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(
            ex - headLen * Math.cos(angle - Math.PI / 6),
            ey - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            ex - headLen * Math.cos(angle + Math.PI / 6),
            ey - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();

          // Starting anchor ring
          ctx.beginPath();
          ctx.arc(sx, sy, item.strokeWidth * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'rect': {
        if (item.startX !== undefined && item.startY !== undefined && 
            item.endX !== undefined && item.endY !== undefined) {
          const x = Math.min(item.startX, item.endX);
          const y = Math.min(item.startY, item.endY);
          const w = Math.abs(item.endX - item.startX);
          const h = Math.abs(item.endY - item.startY);

          ctx.beginPath();
          ctx.rect(x, y, w, h);
          ctx.stroke();
        }
        break;
      }

      case 'pen': {
        if (item.points && item.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(item.points[0].x, item.points[0].y);
          for (let i = 1; i < item.points.length; i++) {
            ctx.lineTo(item.points[i].x, item.points[i].y);
          }
          ctx.stroke();
        }
        break;
      }

      case 'text': {
        if (item.x !== undefined && item.y !== undefined && item.text) {
          const fontSize = Math.max(16, Math.min(32, item.strokeWidth * 4));
          ctx.font = `bold ${fontSize}px sans-serif`;
          const textMetrics = ctx.measureText(item.text);
          const padX = 10;
          const padY = 6;
          const bgW = textMetrics.width + padX * 2;
          const bgH = fontSize + padY * 2;

          // Draw pill badge
          ctx.save();
          ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
          ctx.strokeStyle = item.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(item.x, item.y - bgH / 2, bgW, bgH, 6);
          ctx.fill();
          ctx.stroke();

          // Text content
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowBlur = 0;
          ctx.textBaseline = "middle";
          ctx.fillText(item.text, item.x + padX, item.y);
          ctx.restore();

          // Anchor pin
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.strokeWidth * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = item.color;
          ctx.fill();
        }
        break;
      }
    }

    ctx.restore();
  }, []);

  // Main canvas render loop
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions strictly to original natural image dimensions
    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }

    // Clear and draw base photo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw all completed annotations
    annotations.forEach(item => {
      drawAnnotation(ctx, item);
    });

    // Draw active in-progress annotation
    if (currentAnnotation) {
      drawAnnotation(ctx, currentAnnotation);
    }
  }, [annotations, currentAnnotation, drawAnnotation, imageLoaded]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Pointer / Touch start
  const handlePointerDown = (clientX: number, clientY: number) => {
    if (!imageLoaded) return;
    const { x, y } = getCanvasCoords(clientX, clientY);

    if (activeTool === 'text') {
      const textToUse = labelText.trim() || (lang === 'bn' ? "ক্ষতি / স্ক্র্যাচ" : "Damage / Mark");
      const newItem: AnnotationItem = {
        id: `ann-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: 'text',
        color: activeColor,
        strokeWidth,
        text: textToUse,
        x,
        y
      };
      setAnnotations(prev => [...prev, newItem]);
      setRedoStack([]);
      return;
    }

    setIsDrawing(true);
    const newId = `ann-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    if (activeTool === 'pen') {
      setCurrentAnnotation({
        id: newId,
        type: 'pen',
        color: activeColor,
        strokeWidth,
        points: [{ x, y }]
      });
    } else {
      setCurrentAnnotation({
        id: newId,
        type: activeTool,
        color: activeColor,
        strokeWidth,
        startX: x,
        startY: y,
        endX: x,
        endY: y
      });
    }
  };

  // Pointer / Touch move
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDrawing || !currentAnnotation) return;
    const { x, y } = getCanvasCoords(clientX, clientY);

    if (activeTool === 'pen') {
      setCurrentAnnotation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          points: [...(prev.points || []), { x, y }]
        };
      });
    } else {
      setCurrentAnnotation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          endX: x,
          endY: y
        };
      });
    }
  };

  // Pointer / Touch end
  const handlePointerUp = () => {
    if (!isDrawing || !currentAnnotation) return;
    setIsDrawing(false);

    // Filter out accidental micro clicks
    let isValid = true;
    if (currentAnnotation.type === 'pen') {
      if (!currentAnnotation.points || currentAnnotation.points.length < 2) {
        isValid = false;
      }
    } else {
      const dx = Math.abs((currentAnnotation.endX || 0) - (currentAnnotation.startX || 0));
      const dy = Math.abs((currentAnnotation.endY || 0) - (currentAnnotation.startY || 0));
      if (dx < 6 && dy < 6) {
        isValid = false;
      }
    }

    if (isValid) {
      setAnnotations(prev => [...prev, currentAnnotation]);
      setRedoStack([]);
    }

    setCurrentAnnotation(null);
  };

  // Mouse event wrappers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    handlePointerDown(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    handlePointerMove(e.clientX, e.clientY);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    handlePointerUp();
  };

  // Touch event wrappers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      handlePointerDown(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    handlePointerUp();
  };

  // History controls
  const handleUndo = () => {
    if (annotations.length === 0) return;
    const lastItem = annotations[annotations.length - 1];
    setAnnotations(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, [lastItem]]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const toRestore = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setAnnotations(prev => [...prev, ...toRestore]);
  };

  const handleClearAll = () => {
    if (annotations.length === 0) return;
    setRedoStack(prev => [...prev, [...annotations]]);
    setAnnotations([]);
  };

  // Reset to original clean photo
  const handleResetToOriginal = () => {
    if (originalImageUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = originalImageUrl;
      img.onload = () => {
        imageObjRef.current = img;
        setAnnotations([]);
        setRedoStack([]);
        setCurrentAnnotation(null);
      };
    } else {
      handleClearAll();
    }
  };

  // Export & Save
  const handleSaveAnnotation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Export image as high quality JPEG
    const base64Data = canvas.toDataURL("image/jpeg", 0.90);
    onSave(base64Data, imageIndex);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col w-full max-w-4xl max-h-[96vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="bg-[#0F4D0F] text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-[#0b3b0b] flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-200 animate-pulse" />
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {lang === 'bn' ? "ছবিতে দাগ/ক্ষয়ক্ষতি ও শনাক্তকারী চিহ্ন আঁকুন" : "Annotate Damages & Identifying Marks"}
              </h3>
              <p className="text-[11px] text-emerald-100">
                {lang === 'bn' 
                  ? "বৃত্ত (Circle) বা তীর (Arrow) দিয়ে নির্দিষ্ট স্ক্র্যাচ বা লক্ষণ চিহ্নিত করুন" 
                  : "Draw a circle or arrow to pinpoint specific damages or unique marks"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Multi-image pagination if multiple photos */}
            {totalImages > 1 && onSwitchImage && (
              <div className="flex items-center bg-emerald-800/60 rounded-lg px-2 py-1 space-x-1 text-xs text-white">
                <button
                  type="button"
                  onClick={() => onSwitchImage((imageIndex - 1 + totalImages) % totalImages)}
                  disabled={imageIndex === 0}
                  className="p-0.5 hover:bg-emerald-700 rounded disabled:opacity-40 cursor-pointer"
                  title={lang === 'bn' ? "পূর্ববর্তী ছবি" : "Previous Photo"}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-[11px]">
                  {imageIndex + 1} / {totalImages}
                </span>
                <button
                  type="button"
                  onClick={() => onSwitchImage((imageIndex + 1) % totalImages)}
                  disabled={imageIndex === totalImages - 1}
                  className="p-0.5 hover:bg-emerald-700 rounded disabled:opacity-40 cursor-pointer"
                  title={lang === 'bn' ? "পরবর্তী ছবি" : "Next Photo"}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button 
              type="button"
              onClick={onClose}
              className="text-emerald-100 hover:text-white p-1 rounded-full hover:bg-emerald-800 transition-colors cursor-pointer"
              title={lang === 'bn' ? "বন্ধ করুন" : "Close"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Bar: Primary Tools & Quick Presets */}
        <div className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Main Shape Tools Segment */}
          <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTool('circle')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTool === 'circle'
                  ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
              title={lang === 'bn' ? "বৃত্তাকার দাগ (Circle/Oval)" : "Circle / Oval"}
            >
              <Circle className="w-4 h-4" />
              <span>{lang === 'bn' ? "বৃত্ত (Circle)" : "Circle"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('arrow')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTool === 'arrow'
                  ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
              title={lang === 'bn' ? "তীরচিহ্ন (Arrow)" : "Arrow Pointer"}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{lang === 'bn' ? "তীর (Arrow)" : "Arrow"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('rect')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTool === 'rect'
                  ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
              title={lang === 'bn' ? "চারকোনা বক্স (Rectangle)" : "Rectangle Box"}
            >
              <Square className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'bn' ? "বক্স" : "Box"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('pen')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTool === 'pen'
                  ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
              title={lang === 'bn' ? "মুক্তহস্ত আঁকা (Freehand Pen)" : "Freehand Pen"}
            >
              <Pencil className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'bn' ? "পেন" : "Pen"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('text')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTool === 'text'
                  ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
              title={lang === 'bn' ? "টেক্সট লেবেল (Text Tag)" : "Text Tag"}
            >
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'bn' ? "লেবেল" : "Label"}</span>
            </button>
          </div>

          {/* Stroke Width Selector */}
          <div className="flex items-center gap-1.5 bg-slate-200/50 dark:bg-slate-800/80 px-2 py-1 rounded-xl">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mr-1">
              {lang === 'bn' ? "পুরুত্ব:" : "Width:"}
            </span>
            {STROKE_WIDTHS.map(sw => (
              <button
                key={sw.value}
                type="button"
                onClick={() => setStrokeWidth(sw.value)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  strokeWidth === sw.value
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {lang === 'bn' ? sw.labelBn : sw.labelEn}
              </button>
            ))}
          </div>

          {/* Color Palette Selector */}
          <div className="flex items-center gap-1.5 bg-slate-200/50 dark:bg-slate-800/80 px-2 py-1 rounded-xl">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mr-1">
              {lang === 'bn' ? "রং:" : "Color:"}
            </span>
            <div className="flex items-center gap-1">
              {COLOR_PALETTE.map(cp => (
                <button
                  key={cp.color}
                  type="button"
                  onClick={() => setActiveColor(cp.color)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                    activeColor === cp.color 
                      ? "scale-110 border-slate-900 dark:border-white shadow-sm ring-2 ring-emerald-500/50" 
                      : "border-white/50 dark:border-slate-700 hover:scale-105"
                  }`}
                  style={{ backgroundColor: cp.color }}
                  title={cp.label}
                >
                  {activeColor === cp.color && (
                    <Check className={`w-3 h-3 ${cp.color === '#FFFFFF' || cp.color === '#FACC15' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* History Controls: Undo, Redo, Clear */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleUndo}
              disabled={annotations.length === 0}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30 cursor-pointer transition-colors"
              title={lang === 'bn' ? "পূর্বাবস্থায় ফেরত (Undo)" : "Undo"}
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30 cursor-pointer transition-colors"
              title={lang === 'bn' ? "পুনরায় করুন (Redo)" : "Redo"}
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={annotations.length === 0}
              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg disabled:opacity-30 cursor-pointer transition-colors"
              title={lang === 'bn' ? "সব মুছুন (Clear All)" : "Clear All"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {originalImageUrl && (
              <button
                type="button"
                onClick={handleResetToOriginal}
                className="flex items-center space-x-1 px-2 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-[10px] cursor-pointer"
                title={lang === 'bn' ? "মূল ছবিতে ফিরে যান" : "Revert to Original"}
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">{lang === 'bn' ? "মূল ছবি" : "Original"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Damage Presets Bar */}
        <div className="bg-slate-100/70 dark:bg-slate-900/60 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{lang === 'bn' ? "দ্রুত প্রিসেট:" : "Presets:"}</span>
          </span>
          {DAMAGE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveTool(p.tool);
                setActiveColor(p.color);
                setLabelText(lang === 'bn' ? p.bn : p.en);
              }}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
            >
              {p.tool === 'circle' ? (
                <Circle className="w-3 h-3 text-emerald-600" />
              ) : (
                <ArrowUpRight className="w-3 h-3 text-emerald-600" />
              )}
              <span>{lang === 'bn' ? p.bn : p.en}</span>
            </button>
          ))}
          {activeTool === 'text' && (
            <div className="flex items-center gap-1 ml-auto">
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                placeholder={lang === 'bn' ? "কাস্টম লেবেল লিখুন..." : "Custom label..."}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Central Canvas Viewport Area */}
        <div className="flex-1 bg-slate-950/95 overflow-hidden flex flex-col items-center justify-center p-3 relative select-none">
          {!imageLoaded ? (
            <div className="flex flex-col items-center justify-center text-slate-400 py-16 space-y-2">
              <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">{lang === 'bn' ? "ছবি লোড হচ্ছে..." : "Loading image..."}</p>
            </div>
          ) : (
            <div className="relative max-w-full max-h-[58vh] md:max-h-[64vh] flex items-center justify-center overflow-hidden rounded-xl border border-slate-800 shadow-inner">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`max-w-full max-h-[58vh] md:max-h-[64vh] object-contain touch-none block ${
                  activeTool === 'text' ? 'cursor-crosshair' : 'cursor-crosshair'
                }`}
                style={{ imageRendering: "auto" }}
              />

              {/* Real-time visual count overlay */}
              {annotations.length > 0 && (
                <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-mono border border-white/10 pointer-events-none">
                  {annotations.length} {lang === 'bn' ? "টি চিহ্ন আঁকা হয়েছে" : "marks drawn"}
                </div>
              )}
            </div>
          )}

          {/* Quick Helper caption at bottom of canvas */}
          <div className="mt-2 text-center text-[11px] text-slate-400 flex items-center justify-center space-x-1">
            <Info className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>
              {activeTool === 'circle' && (lang === 'bn' ? "দাগ বা ক্ষতি ঘিরে বৃত্ত আঁকতে ছবিতে ক্লিক করে ড্র্যাগ করুন।" : "Click and drag on the photo to draw a circle around the damage.")}
              {activeTool === 'arrow' && (lang === 'bn' ? "ক্ষতির দিকে নির্দেশ করতে ক্লিক করে তীরচিহ্ন ড্র্যাগ করুন।" : "Click and drag to draw an arrow pointing directly to the feature.")}
              {activeTool === 'rect' && (lang === 'bn' ? "নির্দিষ্ট অংশ ফ্রেম করতে ক্লিক করে বক্স ড্র্যাগ করুন।" : "Click and drag to draw a box framing the area.")}
              {activeTool === 'pen' && (lang === 'bn' ? "মুক্তহস্তে আঁকতে দাগ বরাবর লাইন টানুন।" : "Draw freely across irregular scratches or cracks.")}
              {activeTool === 'text' && (lang === 'bn' ? "যেখানে লেবেল বসাতে চান সেখানে ক্লিক করুন।" : "Click anywhere on the photo to place the damage label.")}
            </span>
          </div>
        </div>

        {/* Bottom Actions Footer */}
        <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <AlertCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="text-[11px]">
              {lang === 'bn' 
                ? "চিহ্নিত ছবি আইটেম শনাক্তকরণ ও মালিকানা প্রমাণের সময় প্রদর্শিত হবে।" 
                : "Annotated photos will help identify the item and verify ownership."}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              {lang === 'bn' ? "বাতিল" : "Cancel"}
            </button>

            <button
              type="button"
              onClick={handleSaveAnnotation}
              className="bg-[#0F4D0F] hover:bg-[#0b3b0b] text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{lang === 'bn' ? "চিহ্ন সংরক্ষণ ও প্রয়োগ করুন" : "Save & Apply Marks"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ImageAnnotationModal;
