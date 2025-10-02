import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EMPLOYEES, type Employee } from "@/lib/data/employees";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/local/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, MapPin, Pencil, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ManageProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const employee = useMemo(() => EMPLOYEES.find((e) => e.id === id) as Employee | undefined, [id]);

  if (!employee) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="rounded-lg border p-6">Employee not found.</div>
        </div>
      </div>
    );
  }

  const initialTab = typeof window !== "undefined" && window.location.hash === "#documents" ? "docs" : "personal";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sticky top-0 z-10 bg-background/90 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-lg font-semibold text-brand">
                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
              </div>
              <div className="grid gap-1">
                <div className="text-lg font-bold text-foreground">{employee.firstName} {employee.lastName}</div>
                <div className="text-sm text-muted-foreground">{employee.email}</div>
                <div className="text-sm text-muted-foreground">{employee.contactNumber ?? "—"}</div>
                <div className="text-sm text-muted-foreground">{employee.department} • {employee.location ?? "���"}</div>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="font-semibold text-foreground">Employee ID: <span className="text-muted-foreground">{employee.id}</span></div>
              <div className="mt-1 flex items-center justify-end gap-1 text-muted-foreground">
                <CalendarDays className="h-4 w-4" /> Joining Date: {employee.joiningDate}
              </div>
            </div>
          </div>
        </div>

        <div className="py-4">
          <Tabs defaultValue={initialTab}>
            <div className="sticky top-16 z-10 border-b bg-background/90 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/70">
              <TabsList className="flex flex-wrap gap-1">
              {[
                ["personal", "Personal Info"],
                ["work", "Work Details"],
                ["skills", "Skills"],
                ["comp", "Compensation"],
                ["perf", "Performance"],
                ["training", "Training"],
                ["leave", "Leave & Attendance"],
                ["docs", "Documents"],
                ["access", "Access & Security"],
                ["log", "Change Log"],
              ].map(([val, label]) => (
                <TabsTrigger
                  key={val}
                  value={val as string}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium",
                    "data-[state=active]:bg-brand data-[state=active]:text-brand-foreground",
                  )}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            </div>

            <div className="mt-3 rounded-lg border bg-card p-4 md:p-6">

            <TabsContent value="personal" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="text-base font-bold">Personal Information</h3>
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    <LabeledField label="First Name" value={employee.firstName} />
                    <LabeledField label="Middle Name" value={""} />
                    <LabeledField label="Last Name" value={employee.lastName} />
                    <LabeledField label="Phone" value={employee.contactNumber} />
                    <LabeledField label="Address Information" value={employee.location} />
                    <LabeledField label="Email Address" value={employee.email} />
                    <LabeledField label="Date of Birth" value={""} />
                    <LabeledField label="Gender" value={""} />
                    <LabeledField label="Marital Status" value={""} />
                    <LabeledField label="Nationality" value={""} />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold">Emergency Contact</h3>
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    <LabeledField label="Contact Person" value={""} />
                    <LabeledField label="Contact Number" value={""} />
                    <LabeledField label="Relationship" value={""} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="work" className="space-y-2">
              <h3 className="text-base font-bold">Work Details</h3>
            </TabsContent>

            <TabsContent value="skills" className="space-y-2">
              <h3 className="text-base font-bold">Skills</h3>
            </TabsContent>

            <TabsContent value="comp" className="mt-4 text-sm text-muted-foreground">Compensation details to be configured.</TabsContent>
            <TabsContent value="perf" className="mt-4 text-sm text-muted-foreground">Performance module integration pending.</TabsContent>
            <TabsContent value="training" className="mt-4 text-sm text-muted-foreground">Training plans and records here.</TabsContent>
            <TabsContent value="leave" className="mt-4 text-sm text-muted-foreground">Leave & Attendance configuration.</TabsContent>
            <TabsContent value="docs" className="mt-4 text-sm text-muted-foreground">Documents linked to this profile.</TabsContent>
            <TabsContent value="access" className="mt-4 text-sm text-muted-foreground">Access & Security roles and policies.</TabsContent>
            <TabsContent value="log" className="mt-4 text-sm text-muted-foreground">Change Log audit trail.</TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function LabeledInput({ label, defaultValue, placeholder }: { label: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <Input defaultValue={defaultValue} placeholder={placeholder ?? label} />
    </div>
  );
}

function LabeledField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid gap-0.5">
      <div className="text-xs font-semibold text-foreground">{label}</div>
      <div className="text-sm text-muted-foreground">{value && String(value).trim().length ? value : "—"}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-semibold text-foreground">{children}</div>;
}

function OrgChartMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <Button variant="outline" onClick={() => setOpen((v) => !v)}>
        <User className="mr-2 h-4 w-4" /> View Organization Chart
      </Button>
      {open && (
        <div className="absolute z-20 mt-2 w-64 rounded-md border bg-popover p-2 text-sm shadow-md">
          <div className="space-y-2">
            <div className="rounded-md p-2 hover:bg-accent">
              <div className="font-medium">Hierarchical View</div>
              <div className="text-xs text-muted-foreground">See reporting structure in a top-down hierarchy.</div>
            </div>
            <div className="rounded-md p-2 hover:bg-accent">
              <div className="font-medium">Chart View</div>
              <div className="text-xs text-muted-foreground">Visual chart layout of teams and roles.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SkillLevel({ level }: { level: "Expert" | "Advanced" | "Intermediate" }) {
  const cls =
    level === "Expert"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
      : level === "Advanced"
        ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300";
  return <Badge className={cn("border-0 px-2.5 py-0.5", cls)}>{level}</Badge>;
}
