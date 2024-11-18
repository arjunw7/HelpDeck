"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Check your email</h1>
        <p className="mb-6 text-muted-foreground">
          We've sent you an email with a verification link. Please check your inbox and click the link to verify your account.
        </p>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-10">
            Didn't receive an email? Check your spam folder or try signing in again to resend the verification email.
          </p>
          <Link href="/auth">
            <Button variant="outline" className="w-full">
              Return to Sign In
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}