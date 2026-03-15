import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: "candidate" | "corporate";
  phone?: string;
  disabilityType?: string;
  preferredAccommodations?: string;
  cvPath?: string;
  companyName?: string;
  contactFirstName?: string;
  contactLastName?: string;
  industry?: string;
  companySize?: string;
  profileImage?: string;
};

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    fetch(`${API_BASE_URL}/auth/profile/${parsedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser({
          id: data._id || data.id,
          name: data.name || "",
          email: data.email || "",
          role: data.role || "",
          phone: data.phone || "",
          disabilityType: data.disabilityType || "",
          preferredAccommodations: data.preferredAccommodations || "",
          cvPath: data.cvPath || "",
          companyName: data.companyName || "",
          contactFirstName: data.contactFirstName || "",
          contactLastName: data.contactLastName || "",
          industry: data.industry || "",
          companySize: data.companySize || "",
          profileImage: data.profileImage || "",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Could not load profile data",
          variant: "destructive",
        });
      });
  }, [toast]);

  const handleUpload = async () => {
    if (!user || !selectedFile) {
      return;
    }

    try {
      setLoadingImage(true);

      const formData = new FormData();
      formData.append("profileImage", selectedFile);

      const response = await fetch(`${API_BASE_URL}/auth/profile-image/${user.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Upload failed",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
        setLoadingImage(false);
        return;
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch {
      toast({
        title: "Server error",
        description: "Could not upload image",
        variant: "destructive",
      });
    }

    setLoadingImage(false);
  };

  const handleSave = async () => {
    if (!user) {
      return;
    }

    try {
      setLoadingSave(true);

      const response = await fetch(`${API_BASE_URL}/auth/profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Update failed",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
        setLoadingSave(false);
        return;
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch {
      toast({
        title: "Server error",
        description: "Could not update profile",
        variant: "destructive",
      });
    }

    setLoadingSave(false);
  };

  if (!user) {
    return (
      <div className="container py-10">
        <p>Loading profile...</p>
      </div>
    );
  }

  const profileImageUrl =
    user.profileImage && user.profileImage.trim() !== ""
      ? `${API_BASE_URL}/${user.profileImage.replace(/\\/g, "/")}`
      : "";

  const cvUrl =
    user.cvPath && user.cvPath.trim() !== ""
      ? `${API_BASE_URL}/${user.cvPath.replace(/\\/g, "/")}`
      : "";

  return (
    <div className="container max-w-4xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>View and edit your personal information</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover border"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold border">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
            )}

            <div className="space-y-3 w-full max-w-sm">
              <Input
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={(e) =>
                  setSelectedFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)
                }
              />
              <Button onClick={handleUpload} disabled={loadingImage || !selectedFile}>
                {loadingImage ? "Uploading..." : "Upload Profile Picture"}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium">Name</p>
              <Input
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <p className="font-medium">Email</p>
              <Input value={user.email} disabled />
            </div>

            <div className="space-y-2">
              <p className="font-medium">Role</p>
              <Input value={user.role} disabled />
            </div>

            <div className="space-y-2">
              <p className="font-medium">Phone Number</p>
              <Input
                value={user.phone || ""}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />
            </div>
          </div>

          {user.role === "candidate" && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">Candidate Information</h3>

              <div className="space-y-2">
                <p className="font-medium">Disability Type</p>
                <Input
                  value={user.disabilityType || ""}
                  onChange={(e) => setUser({ ...user, disabilityType: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <p className="font-medium">Preferred Accommodations</p>
                <Textarea
                  rows={4}
                  value={user.preferredAccommodations || ""}
                  onChange={(e) =>
                    setUser({ ...user, preferredAccommodations: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <p className="font-medium">Uploaded CV</p>
                {cvUrl ? (
                  <a
                    href={cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    Open my uploaded CV
                  </a>
                ) : (
                  <p className="text-muted-foreground">No CV uploaded</p>
                )}
              </div>
            </div>
          )}

          {user.role === "corporate" && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">Company Information</h3>

              <div className="space-y-2">
                <p className="font-medium">Company Name</p>
                <Input
                  value={user.companyName || ""}
                  onChange={(e) => setUser({ ...user, companyName: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="font-medium">Contact First Name</p>
                  <Input
                    value={user.contactFirstName || ""}
                    onChange={(e) => setUser({ ...user, contactFirstName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Contact Last Name</p>
                  <Input
                    value={user.contactLastName || ""}
                    onChange={(e) => setUser({ ...user, contactLastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Industry</p>
                <Input
                  value={user.industry || ""}
                  onChange={(e) => setUser({ ...user, industry: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <p className="font-medium">Company Size</p>
                <Input
                  value={user.companySize || ""}
                  onChange={(e) => setUser({ ...user, companySize: e.target.value })}
                />
              </div>
            </div>
          )}

          <Button onClick={handleSave} disabled={loadingSave}>
            {loadingSave ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}