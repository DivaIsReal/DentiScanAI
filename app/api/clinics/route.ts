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

export async function GET(_req: NextRequest) {
  const auth = getAuthFromCookie();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // TODO: integrate with Google Maps Places API using user lat/lng query params
  // const lat = parseFloat(req.nextUrl.searchParams.get("lat") || "0");
  // const lng = parseFloat(req.nextUrl.searchParams.get("lng") || "0");
  return NextResponse.json({ success: true, data: DUMMY_CLINICS });
}
