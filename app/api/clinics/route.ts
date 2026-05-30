import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth/jwt";
import type { Clinic } from "@/types";

const DUMMY_CLINICS: Clinic[] = [
  {
    id: "clinic_1",
    name: "Klinik Gigi SehatPrima",
    address: "Jl. Sudirman No. 45, Yogyakarta",
    distance: 0.8,
    rating: 4.8,
    isOpen: true,
    hours: "08:00 - 21:00",
    phone: "+62 274 123456",
    lat: -7.7956,
    lng: 110.3695,
  },
  {
    id: "clinic_2",
    name: "Dental Care Clinic Yogya",
    address: "Jl. Malioboro No. 12, Yogyakarta",
    distance: 1.4,
    rating: 4.6,
    isOpen: true,
    hours: "09:00 - 20:00",
    phone: "+62 274 234567",
    lat: -7.7925,
    lng: 110.3658,
  },
  {
    id: "clinic_3",
    name: "Smile Studio Dental",
    address: "Jl. Kaliurang KM 5, Sleman",
    distance: 2.1,
    rating: 4.9,
    isOpen: true,
    hours: "10:00 - 22:00",
    phone: "+62 274 345678",
    lat: -7.7572,
    lng: 110.3805,
  },
  {
    id: "clinic_4",
    name: "Pro Dental Indonesia",
    address: "Jl. Solo No. 88, Yogyakarta",
    distance: 3.5,
    rating: 4.4,
    isOpen: false,
    hours: "Buka Senin pukul 09:00",
    phone: "+62 274 456789",
    lat: -7.7894,
    lng: 110.3893,
  },
  {
    id: "clinic_5",
    name: "Family Dental Care",
    address: "Jl. Magelang KM 7, Sleman",
    distance: 4.2,
    rating: 4.7,
    isOpen: true,
    hours: "08:00 - 19:00",
    phone: "+62 274 567890",
    lat: -7.7234,
    lng: 110.3589,
  },
];

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
) {
  const earthRadiusKm = 6371;
  const deltaLat = toRad(toLat - fromLat);
  const deltaLng = toRad(toLng - fromLng);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(deltaLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: NextRequest) {
  const auth = getAuthFromCookie();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const latParam = req.nextUrl.searchParams.get("lat");
  const lngParam = req.nextUrl.searchParams.get("lng");
  const lat = latParam ? Number(latParam) : null;
  const lng = lngParam ? Number(lngParam) : null;

  if (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  ) {
    const clinics = DUMMY_CLINICS.map((clinic) => ({
      ...clinic,
      distance: Number(getDistanceKm(lat, lng, clinic.lat, clinic.lng).toFixed(1)),
    })).sort((a, b) => a.distance - b.distance);

    return NextResponse.json({ success: true, data: clinics });
  }

  return NextResponse.json({ success: true, data: DUMMY_CLINICS });
}
