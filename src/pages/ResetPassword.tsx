import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      navigate("/signin");

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

  return (
    <div className="container max-w-md py-20">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

      <p className="text-muted-foreground mb-6">
        Enter your new password below.
      </p>

      <div className="space-y-4">
        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          className="w-full"
          onClick={handleReset}
          disabled={loading}
        >
          {loading ? "Updating..." : "Reset Password"}
        </Button>
      </div>
    </div>
  );
}