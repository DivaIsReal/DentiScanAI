"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  }, []);

  const setPreviewFromFile = useCallback(async (nextFile: File) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    const previewUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Gagal membaca file gambar"));
      reader.readAsDataURL(nextFile);
    });

    setFile(nextFile);
    setPreview(previewUrl);
  }, []);

  const resolveCameraError = (error: unknown) => {
    const err = error as DOMException & { message?: string };
    if (!navigator.mediaDevices?.getUserMedia) {
      return "Browser ini tidak mendukung kamera dengan getUserMedia.";
    }
    switch (err?.name) {
      case "NotAllowedError":
        return "Akses kamera ditolak. Aktifkan izin kamera di browser lalu coba lagi.";
      case "NotFoundError":
        return "Kamera tidak ditemukan di perangkat ini.";
      case "NotReadableError":
        return "Kamera sedang dipakai aplikasi lain. Tutup aplikasi lain lalu coba lagi.";
      case "OverconstrainedError":
        return "Kamera tidak bisa dibuka dengan konfigurasi saat ini.";
      case "SecurityError":
        return "Kamera hanya bisa diakses lewat koneksi aman (HTTPS) atau localhost.";
      default:
        return "Gagal membuka kamera. Silakan cek izin browser dan coba lagi.";
    }
  };

  const openCamera = useCallback(async () => {
    setCameraError(null);
    setCameraLoading(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("getUserMedia not supported");
      }

      stopCameraStream();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      console.log("[camera] getUserMedia stream:", stream);
      streamRef.current = stream;
      setCameraOpen(true);
    } catch (error) {
      console.error("[camera] openCamera error:", error);
      setCameraOpen(false);
      setCameraError(resolveCameraError(error));
    } finally {
      setCameraLoading(false);
    }
  }, [stopCameraStream]);

  const closeCamera = useCallback(() => {
    stopCameraStream();
    setCameraOpen(false);
    setCameraLoading(false);
  }, [stopCameraStream]);

  const captureFromVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video) {
      setCameraError("Kamera belum siap.");
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) {
      setCameraError("Video belum siap untuk capture. Coba tunggu sebentar.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError("Tidak bisa memproses hasil kamera.");
      return;
    }

    context.drawImage(video, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((value) => resolve(value), "image/jpeg", 0.95);
    });

    if (!blob) {
      setCameraError("Gagal mengambil foto dari kamera.");
      return;
    }

    const capturedFile = new File([blob], `camera-${Date.now()}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    await setPreviewFromFile(capturedFile);
    closeCamera();

    try {
      await onScan(capturedFile, debug);
    } catch {
      // Parent handler is expected to surface errors; keep preview available for retry.
    }
  }, [closeCamera, debug, onScan, setPreviewFromFile]);

  const retryCamera = useCallback(async () => {
    if (loading) return;
    setPreview(null);
    setFile(null);
    setCameraError(null);
    await openCamera();
  }, [loading, openCamera]);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    void setPreviewFromFile(f);
  }, [setPreviewFromFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: loading,
  });

  const clear = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreview(null);
    setFile(null);
  };

  const handleScan = async () => {
    if (!file) return;
    await onScan(file, debug);
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [stopCameraStream]);

  useEffect(() => {
    if (!cameraOpen) return;

    const video = videoRef.current;
    const stream = streamRef.current;

    console.log("[camera] video element:", video);
    console.log("[camera] active stream:", stream);

    if (!video || !stream) {
      return;
    }

    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;

    const playVideo = async () => {
      try {
        await video.play();
        console.log("[camera] video.play() succeeded");
        setCameraReady(true);
      } catch (error) {
        console.error("[camera] video.play() failed:", error);
        setCameraReady(true);
        setCameraError("Kamera sudah aktif, tetapi browser gagal memutar video. Coba klik tombol buka kamera lagi.");
      }
    };

    void playVideo();
  }, [cameraOpen]);

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
                  void openCamera();
                }}
                disabled={loading || cameraLoading}
              >
                <Camera className="w-3.5 h-3.5" />
                Buka Kamera
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
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => void retryCamera()}
                  className="h-9 px-3 rounded-full bg-black/60 backdrop-blur text-white text-sm flex items-center justify-center hover:bg-black/80"
                >
                  Ulangi
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="w-9 h-9 rounded-full bg-black/60 backdrop-blur text-white flex items-center justify-center hover:bg-black/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
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

      {cameraError && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
          {cameraError}
        </div>
      )}

      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div>
                <h3 className="font-semibold">Buka Kamera</h3>
                <p className="text-xs text-muted-foreground">Arahkan kamera ke gigi lalu ambil foto.</p>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={closeCamera}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-border">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                {!cameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center text-white bg-black/40">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                <div className="text-xs text-muted-foreground">
                  {cameraLoading
                    ? "Menyiapkan kamera..."
                    : "Pastikan pencahayaan cukup dan izin kamera sudah diberikan."}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={closeCamera} disabled={loading}>
                    Tutup
                  </Button>
                  <Button type="button" onClick={() => void captureFromVideo()} disabled={loading || cameraLoading || !cameraReady}>
                    <Camera className="w-4 h-4" />
                    Ambil Foto
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
