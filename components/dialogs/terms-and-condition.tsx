"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  Shield,
  Users,
  CreditCard,
  Lock,
  AlertTriangle,
  Mail,
  Calendar,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TermsConditionsDialogProps {
  trigger?: React.ReactNode;
  onAccept?: () => void;
  onDecline?: () => void;
  showAcceptButton?: boolean;
  isRequired?: boolean;
}

export function TermsConditionsDialog({
  trigger,
  onAccept,
  onDecline,
  showAcceptButton = false,
  isRequired = false,
}: TermsConditionsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = async () => {
    setIsAccepting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing
    onAccept?.();
    setIsAccepting(false);
    setIsOpen(false);
  };

  const handleDecline = () => {
    onDecline?.();
    setIsOpen(false);
  };

  const termsData = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <CheckCircle className="h-5 w-5" />,
      content:
        "By accessing or using BeBlocky, you confirm that you have read, understood, and agreed to these Terms and our Privacy Policy. If you do not agree, you must not use the Services.",
    },
    {
      id: "eligibility",
      title: "Eligibility",
      icon: <Users className="h-5 w-5" />,
      content:
        "BeBlocky is designed for users aged 7 and above. If you are under 18, you must have permission from a parent or legal guardian to use the Services. Parents and guardians are responsible for supervising their children's use of the Services.",
    },
    {
      id: "accounts",
      title: "User Accounts",
      icon: <Lock className="h-5 w-5" />,
      content:
        "To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities under your account. You agree to provide accurate, current, and complete information.",
    },
    {
      id: "usage",
      title: "Acceptable Use",
      icon: <Shield className="h-5 w-5" />,
      content:
        "You agree to use BeBlocky only for lawful, educational, and personal development purposes. You may not use the Services for any unauthorized or unlawful purpose, attempt to gain unauthorized access, upload inappropriate content, or interfere with the operation or security of the Services.",
    },
    {
      id: "ip",
      title: "Intellectual Property",
      icon: <FileText className="h-5 w-5" />,
      content:
        "All content, software, designs, code, graphics, characters, and educational materials within BeBlocky are the intellectual property of BeBlocky or its licensors. You may not copy, modify, distribute, sell, or create derivative works without written permission.",
    },
    {
      id: "licensing",
      title: "Licensing and Educational Use",
      icon: <Users className="h-5 w-5" />,
      content:
        "BeBlocky offers licenses for schools, NGOs, and organizations. These licenses are subject to separate agreements. Unauthorized redistribution or classroom use of individual accounts is prohibited.",
    },
    {
      id: "payments",
      title: "In-App Purchases and Subscriptions",
      icon: <CreditCard className="h-5 w-5" />,
      content:
        "Some features may be available via in-app purchases or paid subscriptions. Purchases are handled through third-party platforms (e.g., App Store, Google Play), and we do not control their payment terms or policies. All payments are final unless required by law.",
    },
    {
      id: "privacy",
      title: "Privacy and Data Protection",
      icon: <Shield className="h-5 w-5" />,
      content:
        "We take your privacy seriously. BeBlocky collects limited personal data to provide and improve the Services. Please review our Privacy Policy to understand what data we collect and how it is used, stored, and protected.",
    },
    {
      id: "termination",
      title: "Termination and Suspension",
      icon: <AlertTriangle className="h-5 w-5" />,
      content:
        "We reserve the right to suspend or terminate your access to the Services if you violate these Terms, misuse the Services, or for any operational or legal reason. We may also delete inactive or duplicate accounts.",
    },
    {
      id: "liability",
      title: "Disclaimers and Limitation of Liability",
      icon: <AlertTriangle className="h-5 w-5" />,
      content:
        'BeBlocky is provided "as is" and "as available" without warranties of any kind. To the maximum extent permitted by law, we disclaim all implied warranties. BeBlocky is not responsible for any indirect, incidental, or consequential damages.',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2 bg-transparent">
            <FileText className="h-4 w-4" />
            Terms & Conditions
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl h-[90vh] max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                BeBlocky Terms and Conditions
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  Effective: July 25, 2025
                </Badge>
                <Badge variant="secondary">Version 1.0</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                Welcome to BeBlocky! These Terms and Conditions govern your use
                of the BeBlocky mobile application, web platform, and all
                related services. BeBlocky is available as both a mobile app and
                a web app, each with distinct features. By using either version,
                you agree to be bound by these Terms.
              </p>
            </CardContent>
          </Card>
        </div>

        <ScrollArea
          className="flex-1 px-6 max-h-[60vh] overflow-hidden"
          onScrollCapture={handleScroll}
        >
          <style jsx global>{`
            .scroll-area-viewport {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .scroll-area-viewport::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="space-y-6 pb-6 pr-4">
            {termsData.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                        {section.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {section.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Additional Important Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 flex-shrink-0 mt-1">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        Changes to Terms
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We may update these Terms periodically. Material changes
                        will be notified via the app or email. Continued use of
                        the Services after updates means you agree to the new
                        Terms.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 flex-shrink-0 mt-1">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        Governing Law
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        These Terms shall be governed by and construed in
                        accordance with the laws of Ethiopia, without regard to
                        its conflict of laws principles.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        If you have any questions or concerns about these Terms,
                        please contact us at:
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                      >
                        <Mail className="h-4 w-4" />
                        info@beblocky.com
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </ScrollArea>

        {!hasScrolledToBottom && (
          <div className="px-6 py-2 border-t bg-gradient-to-r from-transparent via-primary/10 to-transparent">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <div className="flex space-x-1">
                <div
                  className="w-1 h-1 bg-primary/40 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-1 h-1 bg-primary/40 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-1 h-1 bg-primary/40 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
              <span>Scroll to continue</span>
            </div>
          </div>
        )}

        {showAcceptButton && (
          <div className="border-t bg-muted/30 p-6">
            <AnimatePresence>
              {!hasScrolledToBottom && (
                <motion.div
                  initial={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">
                          Please scroll to the bottom to read all terms
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {hasScrolledToBottom && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accept-terms"
                    checked={hasAccepted}
                    onCheckedChange={(checked) =>
                      setHasAccepted(checked === true)
                    }
                  />
                  <label
                    htmlFor="accept-terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I have read and agree to the Terms and Conditions
                  </label>
                </div>
              </motion.div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleDecline}
                className="flex-1 bg-transparent"
                disabled={isAccepting}
              >
                {isRequired ? "Cancel" : "Close"}
              </Button>

              {showAcceptButton && (
                <Button
                  onClick={handleAccept}
                  disabled={!hasAccepted || isAccepting}
                  className="flex-1"
                >
                  {isAccepting ? "Processing..." : "Accept Terms"}
                </Button>
              )}
            </div>
          </div>
        )}

        {!showAcceptButton && (
          <div className="border-t p-6">
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
