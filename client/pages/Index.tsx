import { useMemo, useState, createContext, useContext } from "react";
// Local simple Tabs implementation (lightweight replacement for Radix Tabs to avoid invalid hook issues)
const TabsContext = createContext<{ value: string; setValue: (v: string) => void } | null>(null);
function Tabs({ defaultValue = "records", children, className }: any) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className={className}>
      <TabsContext.Provider value={{ value, setValue }}>{children}</TabsContext.Provider>
    </div>
  );
}
function TabsList({ children, className }: any) {
  return <div className={className}>{children}</div>;
}
function TabsTrigger({ value, children, className, ...props }: any) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  const active = ctx.value === value;
  return (
    <button
      type="button"
      data-state={active ? "active" : "inactive"}
      onClick={() => ctx.setValue(value)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
function TabsContent({ value, children, className }: any) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  return ctx.value === value ? <div className={className}>{children}</div> : null;
}
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  EllipsisVertical,
  LayoutGrid,
  Plus,
  Table as TableIcon,
  User,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  email: string;
  status: "Active" | "On Leave" | "Inactive";
  joiningDate: string; // MM-DD-YYYY
}

const EMPLOYEES: Employee[] = [
  {
    id: "EMP001",
    firstName: "Sarah",
    lastName: "Mitchell",
    role: "Senior Software Engineer",
    department: "Engineering",
    email: "sarah.mitchell@company.com",
    status: "Active",
    joiningDate: "01-15-2023",
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
  },
];

export default function Index() {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [view, setView] = useState<"table" | "card">("table");

  const totalActive = EMPLOYEES.filter((e) => e.status === "Active").length;
  const onLeave = EMPLOYEES.filter((e) => e.status === "On Leave").length;
  const newHiresThisMonth = 0;
  const pendingOffboarding = 0;

  const filtered = useMemo(() => {
    return EMPLOYEES.filter((e) => {
      const matchesSearch =
        !search.trim() ||
        [
          e.firstName,
          e.lastName,
          e.email,
          e.role,
          e.status,
          e.department,
          e.id,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesPos = position === "all" || e.role.toLowerCase().includes(position);
      const matchesStatus = status === "all" || e.status.toLowerCase() === status;
      return matchesSearch && matchesPos && matchesStatus;
    });
  }, [search, position, status]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-4">
          <h2 className="text-2xl font-bold text-foreground">Employee Records</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Centralized employee records management and organizational tools
          </p>
        </header>

        <Tabs defaultValue="records" className="w-full">
          <TabsList className="bg-transparent p-0">
            <div className="flex flex-wrap gap-2">
              <TabsTrigger
                value="records"
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium",
                  "data-[state=active]:bg-brand data-[state=active]:text-brand-foreground",
                  "data-[state=inactive]:bg-background data-[state=inactive]:text-foreground",
                )}
              >
                Employee Records
              </TabsTrigger>
              <TabsTrigger
                value="org"
                className="rounded-full border px-4 py-2 text-sm font-medium data-[state=active]:bg-muted"
              >
                Organization Chart
              </TabsTrigger>
              <TabsTrigger
                value="docs"
                className="rounded-full border px-4 py-2 text-sm font-medium data-[state=active]:bg-muted"
              >
                Document Center
              </TabsTrigger>
              <TabsTrigger
                value="dept"
                className="rounded-full border px-4 py-2 text-sm font-medium data-[state=active]:bg-muted"
              >
                Department Management
              </TabsTrigger>
              <TabsTrigger
                value="sys"
                className="rounded-full border px-4 py-2 text-sm font-medium data-[state=active]:bg-muted"
              >
                System Configuration
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="records" className="mt-5">
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Total Active Employee" value={totalActive} icon={<User className="h-5 w-5" />} />
              <MetricCard label="New Hires This Month" value={newHiresThisMonth} icon={<Plus className="h-5 w-5" />} />
              <MetricCard label="Pending Offboarding / Exits" value={pendingOffboarding} icon={<ArrowLeftRight className="h-5 w-5" />} />
              <MetricCard label="On Leave" value={onLeave} icon={<CalendarDays className="h-5 w-5" />} />
            </section>

            <section className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full flex-1 items-center gap-2">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, position, status"
                  className="h-10 max-w-md"
                />
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Positions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on leave">On Leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 self-end">
                <Button
                  variant="outline"
                  className={cn(
                    "h-10 w-10 rounded-full p-0",
                    view === "table"
                      ? "bg-brand text-brand-foreground border-transparent"
                      : "",
                  )}
                  onClick={() => setView("table")}
                >
                  <TableIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "h-10 w-10 rounded-full p-0",
                    view === "card"
                      ? "bg-brand text-brand-foreground border-transparent"
                      : "",
                  )}
                  onClick={() => setView("card")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </section>

            {view === "table" ? (
              <section className="mt-4">
                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="py-3">Employee ID</TableHead>
                        <TableHead className="py-3">Name</TableHead>
                        <TableHead className="py-3">Department</TableHead>
                        <TableHead className="py-3">Company Email</TableHead>
                        <TableHead className="py-3">Status</TableHead>
                        <TableHead className="py-3">Joining Date</TableHead>
                        <TableHead className="py-3 text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((e, idx) => (
                        <TableRow
                          key={e.id}
                          className={cn(
                            idx % 2 === 0 ? "bg-background" : "bg-muted/20",
                            "hover:bg-muted/50",
                          )}
                        >
                          <TableCell className="py-3 font-medium text-foreground/90">
                            {e.id}
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground">
                                {e.firstName} {e.lastName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {e.role}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">{e.department}</TableCell>
                          <TableCell className="py-3">{e.email}</TableCell>
                          <TableCell className="py-3">
                            <StatusBadge status={e.status} />
                          </TableCell>
                          <TableCell className="py-3">{e.joiningDate}</TableCell>
                          <TableCell className="py-3 text-right">
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <EllipsisVertical className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>
            ) : (
              <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((e) => (
                  <Card key={e.id} className="rounded-xl border p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-semibold uppercase text-muted-foreground">
                          {e.id}
                        </div>
                        <div className="mt-1 text-base font-semibold">
                          {e.firstName} {e.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">{e.role}</div>
                      </div>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="truncate text-muted-foreground">{e.department}</div>
                      <div className="truncate text-muted-foreground">{e.email}</div>
                      <div>
                        <StatusBadge status={e.status} />
                      </div>
                      <div className="text-muted-foreground">{e.joiningDate}</div>
                    </div>
                  </Card>
                ))}
              </section>
            )}
          </TabsContent>

          <TabsContent value="org" className="mt-6 text-sm text-muted-foreground">
            Organization Chart will be set up here. Ask to expand this section if you'd like detailed org mappings, teams, and reporting lines.
          </TabsContent>
          <TabsContent value="docs" className="mt-6 text-sm text-muted-foreground">
            Document Center will appear here. Connect storage or specify categories to populate.
          </TabsContent>
          <TabsContent value="dept" className="mt-6 text-sm text-muted-foreground">
            Department Management placeholder. Define departments, heads, and policies to proceed.
          </TabsContent>
          <TabsContent value="sys" className="mt-6 text-sm text-muted-foreground">
            System Configuration placeholder. Configure permissions, roles, and system settings here.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="flex items-center justify-between rounded-xl border p-4 shadow-sm">
      <div>
        <div className="text-xs font-bold text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-semibold text-foreground">
          <span className="text-brand">{value}</span>
        </div>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
        {icon}
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: Employee["status"] }) {
  const cls =
    status === "Active"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
      : status === "On Leave"
        ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
        : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200";
  return <Badge className={cn("border-0 px-2.5 py-0.5", cls)}>{status}</Badge>;
}
