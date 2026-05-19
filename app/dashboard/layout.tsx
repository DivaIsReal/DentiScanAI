import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth/jwt";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { ToastProvider } from "@/components/ui/toast";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("dentiscan_token")?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    redirect("/login");
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-background">
        {/* Aurora background */}
        <div className="aurora pointer-events-none fixed inset-0 -z-10 opacity-40" />
        <div className="grid-bg pointer-events-none fixed inset-0 -z-10 opacity-30" />

        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <Topbar userName={payload.fullName} />
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
