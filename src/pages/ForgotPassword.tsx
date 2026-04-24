import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ SUCCESS SCREEN
  if (success) {
    return (
      <div className="container max-w-md py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Check your email 📩</h2>
        <p className="text-muted-foreground">
          We sent a password reset link to your email.
        </p>
      </div>
    );
  }

  // ✅ MAIN FORM
  return (
    <div className="container max-w-md py-20">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

      <p className="text-muted-foreground mb-6">
        Enter your email and we’ll send you a reset link.
      </p>

      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Email"}
        </Button>
      </div>
    </div>
  );
}