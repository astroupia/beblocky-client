# Course Detail Dialog - Modular Components

This directory contains the modularized components for the course detail dialog, which was refactored from a single large file (700+ lines) into smaller, focused components.

## Components

### `course-hero.tsx`

- **Purpose**: Displays the course hero section with background and status badge
- **Props**: `course: ICourse`
- **Features**: Gradient background, course status badge

### `course-stats.tsx`

- **Purpose**: Shows course statistics in a grid layout
- **Props**: `rating`, `totalHours`, `studentsCount`, `difficulty`
- **Features**: Rating, duration, student count, and difficulty level

### `course-details.tsx`

- **Purpose**: Displays course features and information
- **Props**: `course: ICourse`
- **Features**: What you'll learn section, course information (language, subscription, difficulty, last updated)

### `course-progress.tsx`

- **Purpose**: Shows user progress if enrolled
- **Props**: `progress?: number`
- **Features**: Progress bar with percentage

### `course-reviews.tsx`

- **Purpose**: Handles all review-related functionality
- **Props**: `course: ICourse`, `userId?: string`, `isValidUserId: boolean`
- **Features**:
  - Review submission and management
  - Star rating system
  - Review list display
  - Rating statistics
  - User authentication checks

### `course-actions.tsx`

- **Purpose**: Handles action buttons (enroll, add to plan, etc.)
- **Props**: `course`, `userType`, `isLoading`, `isEnrolled`, `subscription`, callbacks
- **Features**:
  - Enrollment logic
  - Subscription hierarchy checks
  - Different actions for students vs parents

### `course-detail-dialog-refactored.tsx`

- **Purpose**: Main dialog component that orchestrates all sub-components
- **Props**: Standard dialog props + course data
- **Features**:
  - Session management
  - User ID validation
  - Data fetching coordination
  - Component composition

## Benefits of Modularization

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be used independently
3. **Testing**: Easier to unit test individual components
4. **Performance**: Better code splitting and lazy loading potential
5. **Developer Experience**: Easier to understand and modify specific features

## Usage

```typescript
import { CourseDetailsDialog } from "@/components/dialogs/course-detail";

// Use the refactored dialog
<CourseDetailsDialog
  course={course}
  isOpen={isOpen}
  onClose={onClose}
  userType="student"
  onEnroll={handleEnroll}
  onAddToPlan={handleAddToPlan}
/>
```

## Migration

The original `course-detail-dialog.tsx` can be replaced with the refactored version. All functionality has been preserved while improving code organization.

## File Structure

```
components/dialogs/course-detail/
├── course-hero.tsx
├── course-stats.tsx
├── course-details.tsx
├── course-progress.tsx
├── course-reviews.tsx
├── course-actions.tsx
├── course-detail-dialog-refactored.tsx
├── index.ts
└── README.md
```
