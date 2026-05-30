"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, Camera, X, Loader2, ScanLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadAreaProps {
  onScan: (file: File | null, debug?: boolean) => Promise<void>;
  loading?: boolean;
}

export function UploadArea({ onScan, loading }: UploadAreaProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [debug, setDebug] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: loading,
  });

  const clear = () => {
    setPreview(null);
    setFile(null);
  };

  const handleScan = async () => {
    await onScan(file, debug);
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <ScanLine className="w-4 h-4 text-cyan-500" />
            Scan Teeth
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload or capture a photo of your teeth for AI analysis
          </p>
        </div>
        <div className="text-xs text-muted-foreground hidden sm:block">
          JPG, PNG, WebP · Max 10MB
        </div>
      </div>

      {!preview ? (
        <div
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all",
            "border-border hover:border-cyan-500/50 hover:bg-cyan-500/5",
            isDragActive && "border-cyan-500 bg-cyan-500/10",
            loading && "pointer-events-none opacity-60"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ y: isDragActive ? -5 : 0 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-sky-500/10 border border-cyan-500/20 flex items-center justify-center"
            >
              <Upload className="w-7 h-7 text-cyan-500" />
            </motion.div>
            <div>
              <div className="font-medium">
                {isDragActive ? "Drop here" : "Drag & drop atau klik untuk pilih"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                atau gunakan tombol di bawah
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              >
                <Upload className="w-3.5 h-3.5" />
                Browse
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  // Webcam API placeholder
                  alert("Webcam capture will be enabled with getUserMedia integration.");
                }}
              >
                <Camera className="w-3.5 h-3.5" />
                Use Camera
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            {!loading && (
              <button
                onClick={clear}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur text-white flex items-center justify-center hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                {/* Scanning animation */}
                <motion.div
                  animate={{ y: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-px bg-cyan-400 shadow-[0_0_20px_4px_rgba(34,211,238,0.6)]"
                />
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <div className="font-medium">Analyzing...</div>
                <div className="text-xs opacity-80 mt-1">
                  AI is processing your image
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleScan}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing your scan...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze with AI
              </>
            )}
          </Button>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <input
              id="debug-toggle"
              type="checkbox"
              checked={debug}
              onChange={(e) => setDebug(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="debug-toggle" className="text-muted-foreground">Enable debug payload</label>
          </div>
        </div>
      )}
    </div>
  );
}
