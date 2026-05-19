import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthForm } from "@/components/auth-form";
import { ToastProvider } from "@/components/ui/toast";

export default function RegisterPage() {
  return (
    <ToastProvider>
      <AuthLayout>
        <AuthForm mode="register" />
      </AuthLayout>
    </ToastProvider>
  );
}
