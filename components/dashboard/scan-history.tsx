"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  History,
  Eye,
  Loader2,
  FileSearch,
  Calendar,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatRelative } from "@/lib/utils";
import type { ScanResult } from "@/types";

interface ScanHistoryProps {
  onSelect?: (scan: ScanResult) => void;
}

export function ScanHistory({ onSelect }: ScanHistoryProps) {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/scan")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setScans(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const urgencyVariant = (u: ScanResult["urgency"]) =>
    u === "low" ? "success" : u === "medium" ? "warning" : "destructive";

  const urgencyLabel = (u: ScanResult["urgency"]) =>
    u === "low" ? "Low" : u === "medium" ? "Medium" : "High";

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-500" />
            Riwayat Scan
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pantau perkembangan kesehatan gigi Anda dari waktu ke waktu
          </p>
        </div>
        {scans.length > 0 && (
          <Badge variant="outline" className="text-xs">
            {scans.length} scan
          </Badge>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Memuat riwayat...</span>
        </div>
      ) : scans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-sky-500/10 flex items-center justify-center mb-4">
            <FileSearch className="w-8 h-8 text-cyan-500" />
          </div>
          <h3 className="font-semibold mb-1">Belum ada riwayat scan</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Mulai scan pertama Anda untuk melihat hasil analisis kesehatan gigi
            di sini.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-border/50">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left font-medium py-3 px-4">Tanggal</th>
                  <th className="text-left font-medium py-3 px-4">
                    Ringkasan Hasil
                  </th>
                  <th className="text-left font-medium py-3 px-4">Skor</th>
                  <th className="text-left font-medium py-3 px-4">Urgency</th>
                  <th className="text-right font-medium py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((scan, i) => (
                  <motion.tr
                    key={scan.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-t border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatRelative(scan.createdAt)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(scan.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="line-clamp-2 text-foreground/90">
                        {scan.summary}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-cyan-500" />
                        <span className="font-mono font-semibold">
                          {scan.overallScore}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          /100
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={urgencyVariant(scan.urgency)}>
                        {urgencyLabel(scan.urgency)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onSelect?.(scan)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        Detail
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {scans.map((scan, i) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border/50 p-4 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatRelative(scan.createdAt)}
                  </div>
                  <Badge variant={urgencyVariant(scan.urgency)}>
                    {urgencyLabel(scan.urgency)}
                  </Badge>
                </div>
                <p className="text-sm font-medium line-clamp-2 mb-3">
                  {scan.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Activity className="w-3.5 h-3.5 text-cyan-500" />
                    <span className="font-mono font-semibold">
                      {scan.overallScore}
                    </span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSelect?.(scan)}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                    Detail
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
