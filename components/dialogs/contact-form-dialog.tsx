"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Mail,
  User,
  FileText,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface ContactFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type ContactCategory =
  | "general"
  | "technical"
  | "billing"
  | "course"
  | "account"
  | "bug"
  | "feature";

interface ContactFormData {
  name: string;
  email: string;
  category: ContactCategory;
  subject: string;
  message: string;
}

const contactCategories: {
  value: ContactCategory;
  label: string;
  description: string;
}[] = [
  {
    value: "general",
    label: "General Inquiry",
    description: "General questions about BeBlocky",
  },
  {
    value: "technical",
    label: "Technical Support",
    description: "Help with technical issues",
  },
  {
    value: "billing",
    label: "Billing & Payments",
    description: "Questions about payments and subscriptions",
  },
  {
    value: "course",
    label: "Course Related",
    description: "Questions about courses and learning",
  },
  {
    value: "account",
    label: "Account Issues",
    description: "Problems with your account",
  },
  { value: "bug", label: "Bug Report", description: "Report a bug or issue" },
  {
    value: "feature",
    label: "Feature Request",
    description: "Suggest a new feature",
  },
];

export function ContactFormDialog({ isOpen, onClose }: ContactFormDialogProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    category: "general",
    subject: "",
    message: "",
  });

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Improved email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: session?.user?.id,
          // Derive role safely without relying on TS role property
          userType: (session?.user as any)?.role || "student",
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle specific API errors
        if (responseData.error) {
          if (responseData.error === "Invalid email format") {
            toast.error("Please enter a valid email address");
          } else if (responseData.error === "Missing required fields") {
            toast.error("Please fill in all required fields");
          } else {
            toast.error(responseData.error);
          }
        } else {
          toast.error("Failed to send message. Please try again later.");
        }
        return;
      }

      setIsSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you soon.");

      // Reset form
      setFormData({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        category: "general",
        subject: "",
        message: "",
      });

      // Close dialog after a delay
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error sending contact form:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsSubmitted(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact Support
          </DialogTitle>
        </DialogHeader>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
            <p className="text-muted-foreground">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* User Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  handleInputChange("category", value as ContactCategory)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {contactCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{category.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {category.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Subject *
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Brief description of your inquiry"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Message *
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Please provide detailed information about your inquiry..."
                className="min-h-[120px] resize-none"
                disabled={isSubmitting}
                required
              />
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>
                  Be as detailed as possible to help us assist you better
                </span>
                <span>{formData.message.length}/1000</span>
              </div>
            </div>

            {/* Help Text */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">What to expect:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• We typically respond within 24 hours</li>
                    <li>
                      • For urgent technical issues, please include error
                      messages
                    </li>
                    <li>
                      • For billing issues, please include your transaction ID
                      if available
                    </li>
                    <li>
                      • You'll receive a confirmation email once we receive your
                      message
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </DialogContent>
    </Dialog>
  );
}
