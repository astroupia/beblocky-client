import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Clock } from "lucide-react";
import { motion } from "framer-motion";

export function GoalsPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Setting Goals will come soon</h3>
            <p className="text-muted-foreground">
              We&apos;re working on an exciting goals feature to help you track your learning progress!
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 