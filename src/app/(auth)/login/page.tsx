import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";

export default async function LoginPage() {
  if (await getSession()) redirect("/dashboard");
  return (
    <main className="blueprint-grid flex min-h-screen items-center justify-center px-4">
      <Suspense fallback={null}>
        <AuthForm mode="login" />
      </Suspense>
    </main>
  );
}
