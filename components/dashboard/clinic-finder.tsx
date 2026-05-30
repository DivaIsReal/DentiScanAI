"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Phone,
  Clock,
  Navigation,
  Loader2,
  LocateFixed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Clinic } from "@/types";

const DEFAULT_CENTER = { lat: -7.7956, lng: 110.3695 };

function buildOsmEmbedUrl(center: { lat: number; lng: number }) {
  const latDelta = 0.03;
  const lngDelta = 0.03;
  const west = center.lng - lngDelta;
  const south = center.lat - latDelta;
  const east = center.lng + lngDelta;
  const north = center.lat + latDelta;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${center.lat}%2C${center.lng}`;
}

export function ClinicFinder() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  async function loadClinics(lat?: number, lng?: number) {
    const params = new URLSearchParams();
    if (typeof lat === "number" && typeof lng === "number") {
      params.set("lat", String(lat));
      params.set("lng", String(lng));
    }

    const response = await fetch(`/api/clinics${params.toString() ? `?${params}` : ""}`);
    const data = await response.json();
    if (data.success) {
      setClinics(data.data);
    }
  }

  useEffect(() => {
    loadClinics()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Browser ini tidak mendukung izin lokasi.");
      return;
    }

    setLocationLoading(true);
    setLocationMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });

        try {
          await loadClinics(lat, lng);
          setLocationMessage("Lokasi Anda aktif. Klinik diurutkan berdasarkan jarak.");
        } catch {
          setLocationMessage("Gagal memuat klinik berdasarkan lokasi Anda.");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLoading(false);
        setLocationMessage("Izin lokasi ditolak. Menampilkan area default Yogyakarta.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  const mapCenter = userLocation ?? DEFAULT_CENTER;
  const mapEmbedUrl = buildOsmEmbedUrl(mapCenter);

  return (
    <div className="glass rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-500" />
            Clinic Finder
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Nearby dental clinics ordered by distance
          </p>
        </div>
        <Badge variant="secondary">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
          Yogyakarta
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={useMyLocation}
          disabled={locationLoading}
          className="self-start"
        >
          {locationLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LocateFixed className="w-4 h-4" />
          )}
          Gunakan lokasi saya
        </Button>
      </div>

      {locationMessage && (
        <div className="mb-4 rounded-xl border border-cyan-500/15 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-700 dark:text-cyan-300">
          {locationMessage}
        </div>
      )}

      <div className="space-y-5">
        <div className="relative h-[320px] sm:h-[360px] rounded-2xl overflow-hidden border border-cyan-500/10 bg-slate-100">
          <iframe
            title="Clinic map"
            src={mapEmbedUrl}
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />

          <div className="absolute bottom-3 left-3 glass-strong rounded-lg px-3 py-2 text-xs">
            <span className="font-medium">OpenStreetMap</span>
            <div className="text-muted-foreground">
              {userLocation ? "Lokasi Anda aktif" : "Area default Yogyakarta"}
            </div>
          </div>

          {userLocation && (
            <div className="absolute top-3 right-3 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 backdrop-blur">
              Lokasi pengguna
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
          </div>
        ) : (
          <div>
            <div className="space-y-3 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
              {clinics.map((clinic, i) => (
                <motion.button
                  key={clinic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(clinic.id)}
                  className={`w-full text-left rounded-xl p-4 border transition-all shadow-sm min-w-0 bg-background/70 ${
                    selected === clinic.id
                      ? "border-cyan-500/50 bg-cyan-500/5"
                      : "border-border/50 hover:border-cyan-500/30 hover:bg-accent/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm sm:text-base leading-tight truncate">
                        {clinic.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {clinic.address}
                      </div>
                    </div>
                    <Badge variant={clinic.isOpen ? "success" : "secondary"}>
                      {clinic.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-2">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span className="font-medium text-foreground">{clinic.rating}</span>
                      <span>rating</span>
                    </span>
                    <span className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-2">
                      <Navigation className="w-3 h-3" />
                      <span className="font-medium text-foreground">{clinic.distance} km</span>
                    </span>
                    <span className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-2">
                      <Clock className="w-3 h-3" />
                      <span className="truncate">{clinic.hours}</span>
                    </span>
                  </div>
                  {selected === clinic.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex flex-col sm:flex-row gap-2 mt-3 pt-3 border-t border-border/50"
                    >
                      <Button size="sm" className="flex-1">
                        <Navigation className="w-3 h-3" />
                        Directions
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Phone className="w-3 h-3" />
                        Call
                      </Button>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
 
