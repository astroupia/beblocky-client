"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { parentApi } from "@/lib/api/parent";
import type { IAddChildDto } from "@/lib/api/children";
import { useSession } from "@/lib/auth-client";

interface AddChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: string;
  onSuccess?: () => void;
}

export function AddChildDialog({
  open,
  onOpenChange,
  parentId,
  onSuccess,
}: AddChildDialogProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IAddChildDto>({
    email: "",
    grade: 1,
    dateOfBirth: "",
    gender: undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the correct parent ID from the session if not provided
    let actualParentId = parentId;

    if (!actualParentId && session?.user?.id) {
      try {
        // Fetch parent data to get the MongoDB ObjectId
        const parentData = await parentApi.getParentByUserId(session.user.id);
        actualParentId = parentData._id;
      } catch (error) {
        console.error("Failed to fetch parent data:", error);
        toast.error("Failed to fetch parent information. Please try again.");
        return;
      }
    }

    if (!actualParentId) {
      toast.error("Parent information not found. Please try again.");
      return;
    }

    // Validate required fields
    if (!formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      console.log(
        "🔍 [AddChildDialog] Adding child with parentId:",
        actualParentId
      );
      console.log("🔍 [AddChildDialog] Child data:", formData);

      await parentApi.addChildToParent(actualParentId, formData);

      toast.success("Child added successfully!");
      onOpenChange(false);
      onSuccess?.();

      // Reset form
      setFormData({
        email: "",
        grade: 1,
        dateOfBirth: "",
        gender: undefined,
      });
    } catch (error) {
      console.error("Failed to add child:", error);

      // Provide more specific error messages
      let errorMessage = "Failed to add child. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("Cast to ObjectId failed")) {
          errorMessage =
            "Invalid parent ID format. Please refresh the page and try again.";
        } else if (error.message.includes("500")) {
          errorMessage = "Server error occurred. Please try again later.";
        } else if (error.message.includes("404")) {
          errorMessage = "Parent not found. Please check your account status.";
        } else if (error.message.includes("409")) {
          errorMessage = "A child with this email already exists.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof IAddChildDto] as Record<string, any>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Child
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">
              Child Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="child@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">
                Grade Level <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.grade.toString()}
                onValueChange={(value) =>
                  handleInputChange("grade", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                    <SelectItem key={grade} value={grade.toString()}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender || ""}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Child
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
