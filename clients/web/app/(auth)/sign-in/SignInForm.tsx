"use client";

import Logo from "@/components/svg/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { login } from "./actions";

export default function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setIsSubmitting(true);
    setError(false);
    const formData = new FormData(ev.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    if (!email || !password) return;
    if (await login(email.toString(), password.toString())) {
      return;
    }
    setError(true);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="relative z-10 flex items-center justify-center size-16 bg-primary rounded-full">
        <Logo className="text-white size-8 rotate-12" />
      </div>
      <Card className="min-w-80">
        <CardHeader>
          <h1 className="font-semibold text-xl">Sign in</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <fieldset>
                <Label htmlFor="email">Email</Label>
                <Input
                  readOnly={isSubmitting}
                  id="email"
                  name="email"
                  type="email"
                  required
                />
              </fieldset>
              <fieldset>
                <Label htmlFor="password">Password</Label>
                <Input
                  readOnly={isSubmitting}
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </fieldset>
              <Button className="gap-1" disabled={isSubmitting} type="submit">
                {isSubmitting && (
                  <LoaderCircleIcon className="animate-spin" size={16} />
                )}
                Submit
              </Button>
              {error && <p className="text-destructive">Failed to log you in.</p>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
