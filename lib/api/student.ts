export interface CreateStudentFromUserDto {
  userId: string;
}

export interface IStudentResponse {
  _id: string;
  userId: string;
  dateOfBirth?: string;
  grade?: number;
  gender?: "male" | "female" | "other";
  schoolId?: string;
  parentId?: string;
  enrolledCourses: string[];
  coins: number;
  codingStreak: number;
  lastCodingActivity: string;
  totalCoinsEarned: number;
  totalTimeSpent: number;
  goals?: string[];
  subscription?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

class StudentApi {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const session = await import("@/lib/auth-client").then((m) =>
        m.getSession()
      );

      if (session && typeof session === "object" && "user" in session) {
        const user = (session as { user: { id: string; email?: string } }).user;
        if (user?.id) {
          return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.id}`,
            "X-User-Id": user.id,
            "X-User-Email": user.email || "",
          };
        }
      }

      return {
        "Content-Type": "application/json",
      };
    } catch (error) {
      console.warn("Failed to get session for auth headers:", error);
      return {
        "Content-Type": "application/json",
      };
    }
  }

  async createStudentFromUser(userId: string): Promise<IStudentResponse> {
    const authHeaders = await this.getAuthHeaders();

    const url = `${process.env.NEXT_PUBLIC_API_URL}/students/from-user`;

    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} - ${response.statusText} - ${errorText}`
      );
    }

    return response.json();
  }

  async getStudent(studentId: string): Promise<IStudentResponse> {
    const authHeaders = await this.getAuthHeaders();

    const url = `${process.env.NEXT_PUBLIC_API_URL}/students/${studentId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: authHeaders,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} - ${response.statusText} - ${errorText}`
      );
    }

    return response.json();
  }

  async getStudentByUserId(userId: string): Promise<IStudentResponse> {
    const authHeaders = await this.getAuthHeaders();

    const url = `${process.env.NEXT_PUBLIC_API_URL}/students/user/${userId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: authHeaders,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} - ${response.statusText} - ${errorText}`
      );
    }

    return response.json();
  }

  async updateStudent(
    studentId: string,
    studentData: Partial<IStudentResponse>
  ): Promise<IStudentResponse> {
    const authHeaders = await this.getAuthHeaders();

    const url = `${process.env.NEXT_PUBLIC_API_URL}/students/${studentId}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} - ${response.statusText} - ${errorText}`
      );
    }

    return response.json();
  }
}

export const studentApi = new StudentApi();
