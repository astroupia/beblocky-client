"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { CourseSubscriptionType } from "@/types/course";

interface CourseFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedLanguage: string;
  onLanguageChange: (value: string) => void;
  selectedPlan: string;
  onPlanChange: (value: string) => void;
}

export function CourseFilters({
  searchTerm,
  onSearchChange,
  selectedLanguage,
  onLanguageChange,
  selectedPlan,
  onPlanChange,
}: CourseFiltersProps) {
  return (
    <motion.div
      className="flex flex-col gap-3 sm:gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            <SelectItem value="Python">Python</SelectItem>
            <SelectItem value="HTML">HTML</SelectItem>
            <SelectItem value="JavaScript">JavaScript</SelectItem>
            <SelectItem value="Scratch">Scratch</SelectItem>
            <SelectItem value="React Native">React Native</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedPlan} onValueChange={onPlanChange}>
          <SelectTrigger className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value={CourseSubscriptionType.FREE}>Free</SelectItem>
            <SelectItem value={CourseSubscriptionType.STARTER}>
              Starter
            </SelectItem>
            <SelectItem value={CourseSubscriptionType.BUILDER}>
              Builder
            </SelectItem>
            <SelectItem value={CourseSubscriptionType.PRO}>
              Pro Bundle
            </SelectItem>
            <SelectItem value={CourseSubscriptionType.ORGANIZATION}>
              Organization
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}
