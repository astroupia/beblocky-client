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

interface AddChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: string;
}

export function AddChildDialog({
  open,
  onOpenChange,
  parentId,
}: AddChildDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IAddChildDto>({
    email: "",
    grade: 1,
    section: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!parentId) {
      toast.error("Parent ID is required");
      return;
    }

    // Validate required fields
    if (
      !formData.email ||
      !formData.section ||
      !formData.emergencyContact.name ||
      !formData.emergencyContact.relationship ||
      !formData.emergencyContact.phone
    ) {
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
      await parentApi.addChildToParent(parentId, formData);
      toast.success("Child added successfully!");
      onOpenChange(false);

      // Reset form
      setFormData({
        email: "",
        grade: 1,
        section: "",
        emergencyContact: {
          name: "",
          relationship: "",
          phone: "",
        },
      });
    } catch (error) {
      console.error("Failed to add child:", error);
      toast.error("Failed to add child. Please try again.");
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
              Step 1: Child Information
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

            <div className="grid grid-cols-2 gap-4">
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
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (grade) => (
                        <SelectItem key={grade} value={grade.toString()}>
                          Grade {grade}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">
                  Section <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="section"
                  placeholder="A, B, C..."
                  value={formData.section}
                  onChange={(e) => handleInputChange("section", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Step 2: Emergency Contact */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">
              Step 2: Emergency Contact
            </h3>

            <div className="space-y-2">
              <Label htmlFor="contactName">
                Contact Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactName"
                placeholder="Full name"
                value={formData.emergencyContact.name}
                onChange={(e) =>
                  handleInputChange("emergencyContact.name", e.target.value)
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="relationship">
                  Relationship <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.emergencyContact.relationship}
                  onValueChange={(value) =>
                    handleInputChange("emergencyContact.relationship", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="grandparent">Grandparent</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.emergencyContact.phone}
                  onChange={(e) =>
                    handleInputChange("emergencyContact.phone", e.target.value)
                  }
                  required
                />
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
