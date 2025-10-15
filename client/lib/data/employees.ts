export type EmployeeStatus = "Active" | "On Leave" | "Inactive";
export type DepartureType =
  | "Resignation"
  | "Termination"
  | "Retirement"
  | "Layoff"
  | "End of Contract"
  | "Other";

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
  departureType?: DepartureType;
  departureDate?: string; // MM-DD-YYYY
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
    departureType: "Resignation",
    departureDate: "10-01-2024",
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
    departureType: "Termination",
    departureDate: "09-15-2024",
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
    departureType: "Retirement",
    departureDate: "12-31-2024",
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
    departureType: "Layoff",
    departureDate: "08-20-2024",
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
    departureType: "End of Contract",
    departureDate: "11-10-2024",
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
    departureType: "Resignation",
    departureDate: "10-25-2024",
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
    departureType: "Other",
    departureDate: "10-05-2024",
  },
];
