"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Phone, Clock, Navigation, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Clinic } from "@/types";

export function ClinicFinder() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    fetch("/api/clinics")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setClinics(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!googleMapsApiKey) {
      setMapError(
        "Google Maps API key is not configured. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local."
      );
      return;
    }

    if ((window as any).google?.maps) {
      setMapLoaded(true);
      return;
    }

    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => setMapLoaded(true));
      existingScript.addEventListener("error", () =>
        setMapError("Failed to load Google Maps API. Check your API key and network.")
      );
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () =>
      setMapError("Failed to load Google Maps API. Check your API key and network.");
    document.head.appendChild(script);
  }, [googleMapsApiKey]);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || clinics.length === 0) return;

    const google = (window as any).google;
    if (!google?.maps) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: { lat: -7.7956, lng: 110.3695 },
        zoom: 13,
        disableDefaultUI: true,
      });
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = clinics.map((clinic) => {
      return new google.maps.Marker({
        position: { lat: clinic.lat, lng: clinic.lng },
        map: mapInstanceRef.current,
        title: clinic.name,
      });
    });

    const bounds = new google.maps.LatLngBounds();
    clinics.forEach((clinic) => bounds.extend({ lat: clinic.lat, lng: clinic.lng }));
    mapInstanceRef.current.fitBounds(bounds, 80);
  }, [mapLoaded, clinics]);

  return (
    <div className="glass rounded-2xl p-6">
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

      <div className="relative aspect-[16/8] rounded-2xl overflow-hidden mb-5 border border-cyan-500/10">
        <div ref={mapRef} className="absolute inset-0" />

        {mapError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-sm text-red-300 bg-slate-950/80">
            <div className="font-semibold">Google Maps failed to load</div>
            <div className="text-center">{mapError}</div>
          </div>
        ) : !mapLoaded ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-sm text-muted-foreground bg-slate-950/50">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
            <div>Loading Google Maps…</div>
          </div>
        ) : null}

        <div className="absolute bottom-3 left-3 glass-strong rounded-lg px-3 py-2 text-xs">
          <span className="font-medium">Clinic Map</span>
          <div className="text-muted-foreground">
            {mapLoaded ? "Google Maps API is active" : "Awaiting map load"}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
          {clinics.map((clinic, i) => (
            <motion.button
              key={clinic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(clinic.id)}
              className={`w-full text-left rounded-xl p-4 border transition-all ${
                selected === clinic.id
                  ? "border-cyan-500/50 bg-cyan-500/5"
                  : "border-border/50 hover:border-cyan-500/30 hover:bg-accent/30"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{clinic.name}</div>
                  <div className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {clinic.address}
                  </div>
                </div>
                <Badge variant={clinic.isOpen ? "success" : "secondary"}>
                  {clinic.isOpen ? "Open" : "Closed"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span className="font-medium text-foreground">{clinic.rating}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  {clinic.distance} km
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {clinic.hours}
                </span>
              </div>
              {selected === clinic.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex gap-2 mt-3 pt-3 border-t border-border/50"
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
      )}
    </div>
  );
}
