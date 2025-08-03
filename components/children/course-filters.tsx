"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import type { ICourse } from "@/types/dashboard";
import { CourseSubscriptionType } from "@/types/dashboard";

interface CourseFiltersProps {
  courses: ICourse[];
  onFilteredCoursesChange: (filteredCourses: ICourse[]) => void;
}

interface FilterState {
  search: string;
  language: string;
  subscriptionType: string;
  rating: string;
}

export function CourseFilters({
  courses,
  onFilteredCoursesChange,
}: CourseFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    language: "all",
    subscriptionType: "all",
    rating: "any",
  });
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = (newFilters: FilterState) => {
    let filtered = courses;

    // Search filter
    if (newFilters.search) {
      filtered = filtered.filter(
        (course) =>
          course.courseTitle
            .toLowerCase()
            .includes(newFilters.search.toLowerCase()) ||
          course.courseDescription
            .toLowerCase()
            .includes(newFilters.search.toLowerCase())
      );
    }

    // Language filter
    if (newFilters.language !== "all") {
      filtered = filtered.filter(
        (course) => course.courseLanguage === newFilters.language
      );
    }

    // Subscription type filter
    if (newFilters.subscriptionType !== "all") {
      filtered = filtered.filter(
        (course) => course.subType === newFilters.subscriptionType
      );
    }

    // Rating filter
    if (newFilters.rating !== "any") {
      const minRating = Number.parseFloat(newFilters.rating);
      filtered = filtered.filter((course) => course.rating >= minRating);
    }

    onFilteredCoursesChange(filtered);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      language: "all",
      subscriptionType: "all",
      rating: "any",
    };
    setFilters(clearedFilters);
    applyFilters(clearedFilters);
  };

  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== ""
  ).length;

  // Get unique values for filter options
  const languages = [
    ...new Set(courses.map((course) => course.courseLanguage)),
  ];
  const subscriptionTypes = Object.values(CourseSubscriptionType);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            size="sm"
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Programming Language
                </label>
                <Select
                  value={filters.language}
                  onValueChange={(value) =>
                    handleFilterChange("language", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All languages</SelectItem>
                    {languages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subscription Type</label>
                <Select
                  value={filters.subscriptionType}
                  onValueChange={(value) =>
                    handleFilterChange("subscriptionType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {subscriptionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() +
                          type.slice(1).replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Rating</label>
                <Select
                  value={filters.rating}
                  onValueChange={(value) => handleFilterChange("rating", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any rating</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                    <SelectItem value="4.0">4.0+ stars</SelectItem>
                    <SelectItem value="3.5">3.5+ stars</SelectItem>
                    <SelectItem value="3.0">3.0+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.search}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("search", "")}
              />
            </Badge>
          )}
          {filters.language !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Language: {filters.language}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("language", "all")}
              />
            </Badge>
          )}
          {filters.subscriptionType !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Type: {filters.subscriptionType}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("subscriptionType", "all")}
              />
            </Badge>
          )}
          {filters.rating !== "any" && (
            <Badge variant="secondary" className="gap-1">
              Rating: {filters.rating}+ stars
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("rating", "any")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
