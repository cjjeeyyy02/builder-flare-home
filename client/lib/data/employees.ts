export type EmployeeStatus = "Active" | "On Leave" | "Inactive";
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  email: string;
  status: EmployeeStatus;
  joiningDate: string; // MM-DD-YYYY
  contactNumber?: string;
  location?: string;
}

export const EMPLOYEES: Employee[] = [
  {
    id: "EMP001",
    firstName: "Sarah",
    lastName: "Mitchell",
    role: "Senior Software Engineer",
    department: "Engineering",
    email: "sarah.mitchell@company.com",
    status: "Active",
    joiningDate: "01-15-2023",
    contactNumber: "+1 (555) 010-1200",
    location: "San Francisco, CA, USA",
  },
  {
    id: "EMP002",
    firstName: "Daniel",
    lastName: "Nguyen",
    role: "Product Manager",
    department: "Product",
    email: "daniel.nguyen@company.com",
    status: "Active",
    joiningDate: "06-02-2022",
    contactNumber: "+1 (555) 010-1201",
    location: "New York, NY, USA",
  },
  {
    id: "EMP003",
    firstName: "Priya",
    lastName: "Kumar",
    role: "UX Designer",
    department: "Design",
    email: "priya.kumar@company.com",
    status: "On Leave",
    joiningDate: "11-08-2021",
    contactNumber: "+1 (555) 010-1202",
    location: "Toronto, ON, Canada",
  },
  {
    id: "EMP004",
    firstName: "Marcus",
    lastName: "Lee",
    role: "Data Analyst",
    department: "Analytics",
    email: "marcus.lee@company.com",
    status: "Active",
    joiningDate: "03-11-2020",
    contactNumber: "+1 (555) 010-1203",
    location: "Austin, TX, USA",
  },
  {
    id: "EMP005",
    firstName: "Elena",
    lastName: "Garcia",
    role: "HR Coordinator",
    department: "Human Resources",
    email: "elena.garcia@company.com",
    status: "Active",
    joiningDate: "09-23-2019",
    contactNumber: "+1 (555) 010-1204",
    location: "Madrid, Spain",
  },
  {
    id: "EMP006",
    firstName: "Omar",
    lastName: "Hassan",
    role: "DevOps Engineer",
    department: "Engineering",
    email: "omar.hassan@company.com",
    status: "Active",
    joiningDate: "05-30-2023",
    contactNumber: "+971 55 010 1205",
    location: "Dubai, UAE",
  },
  {
    id: "EMP007",
    firstName: "Julia",
    lastName: "Rossi",
    role: "QA Engineer",
    department: "Engineering",
    email: "julia.rossi@company.com",
    status: "Active",
    joiningDate: "02-17-2024",
    contactNumber: "+39 06 010 1206",
    location: "Rome, Italy",
  },
];
