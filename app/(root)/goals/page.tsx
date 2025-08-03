"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Sparkles, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Learning Goals
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Set personalized learning goals and track your progress towards
            becoming a coding expert
          </p>
        </motion.div>

        {/* Coming Soon Card */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-primary">
                🚀 Coming Soon!
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                We&apos;re working on an exciting new feature that will
                revolutionize how you set and achieve your learning goals.
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Smart Goal Setting</h3>
                  <p className="text-sm text-muted-foreground">
                    Set personalized learning objectives with AI-powered
                    recommendations
                  </p>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Progress Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor your achievements with detailed analytics and
                    insights
                  </p>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Achievement Rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn badges, coins, and unlock special content as you reach
                    milestones
                  </p>
                </motion.div>
              </div>

              <div className="pt-6 border-t border-border">
                <Badge
                  variant="secondary"
                  className="text-sm px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white"
                >
                  🎯 Be the first to know when this feature launches!
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
