import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthForm } from "@/components/auth-form";
import { ToastProvider } from "@/components/ui/toast";

export default function LoginPage() {
  return (
    <ToastProvider>
      <AuthLayout>
        <AuthForm mode="login" />
      </AuthLayout>
    </ToastProvider>
  );
}
