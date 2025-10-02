import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EMPLOYEES, type Employee } from "@/lib/data/employees";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/local/tabs";
import { Card } from "@/components/ui/card";
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
          <Card className="p-6">Employee not found.</Card>
        </div>
      </div>
    );
  }

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
                <div className="text-sm text-muted-foreground">{employee.department} • {employee.location ?? "—"}</div>
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
          <Tabs defaultValue="personal">
            <TabsList className="flex flex-wrap gap-2">
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
                    "rounded-full border px-4 py-2 text-sm font-medium",
                    "data-[state=active]:bg-brand data-[state=active]:text-brand-foreground",
                  )}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="personal" className="mt-4 grid gap-4">
              <Card className="p-4">
                <SectionTitle>Personal Information</SectionTitle>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <Input placeholder="First Name" defaultValue={employee.firstName} />
                  <Input placeholder="Middle Name" />
                  <Input placeholder="Last Name" defaultValue={employee.lastName} />
                  <Input placeholder="Birthdate (MM-DD-YYYY)" />
                  <Input placeholder="Email Address" defaultValue={employee.email} />
                  <Input placeholder="Phone Number" defaultValue={employee.contactNumber} />
                  <Input placeholder="Gender" />
                  <Input placeholder="Marital Status" />
                  <Input placeholder="Nationality" />
                </div>
              </Card>

              <Card className="p-4">
                <SectionTitle>Address Information</SectionTitle>
                <Input className="mt-3" placeholder="Full Address" />
              </Card>

              <Card className="p-4">
                <SectionTitle>Emergency Contact Details</SectionTitle>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <Input placeholder="Contact Person" />
                  <Input placeholder="Contact Number" />
                  <Input placeholder="Home Address" />
                  <Input placeholder="Relationship" />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="work" className="mt-4 grid gap-4 lg:grid-cols-3">
              <Card className="p-4 lg:col-span-2">
                <SectionTitle>Current Position Details</SectionTitle>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Input placeholder="Position Title" defaultValue={employee.role} />
                  <Input placeholder="Department" defaultValue={employee.department} />
                  <Input placeholder="Employment Type" />
                  <Input placeholder="Start Date" defaultValue={employee.joiningDate} />
                  <Input placeholder="Reporting To" />
                  <Input placeholder="Work Location" defaultValue={employee.location} />
                </div>

                <div className="mt-4">
                  <OrgChartMenu />
                </div>
              </Card>

              <Card className="p-4 lg:col-span-1">
                <SectionTitle>Position History</SectionTitle>
                <ul className="mt-3 space-y-4">
                  {[
                    { role: employee.role, range: `${employee.joiningDate} - Present`, reason: "Promotion" },
                    { role: "Software Engineer", range: "08-01-2021 - 01-14-2023", reason: "Promotion" },
                    { role: "Junior Software Engineer", range: "01-15-2020 - 07-31-2021", reason: "Transfer" },
                  ].map((item, i) => (
                    <li key={i} className="relative pl-6">
                      <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-brand" />
                      <div className="text-sm font-semibold">{item.role}</div>
                      <div className="text-xs text-muted-foreground">{item.range} • {item.reason}</div>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4 lg:col-span-3">
                <SectionTitle>Previous Work History</SectionTitle>
                <div className="mt-3 overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="py-2">Company Name</TableHead>
                        <TableHead className="py-2">Position</TableHead>
                        <TableHead className="py-2">Duration</TableHead>
                        <TableHead className="py-2">Location</TableHead>
                        <TableHead className="py-2">Employment Type</TableHead>
                        <TableHead className="py-2">Reason for Leaving</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {["Nimbus Labs", "Aster Corp"].map((c, idx) => (
                        <TableRow key={c} className={idx % 2 ? "bg-muted/20" : ""}>
                          <TableCell className="py-2">{c}</TableCell>
                          <TableCell className="py-2">Software Engineer</TableCell>
                          <TableCell className="py-2">2 years</TableCell>
                          <TableCell className="py-2">Vancouver, Canada</TableCell>
                          <TableCell className="py-2">Full-time</TableCell>
                          <TableCell className="py-2">Career growth</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="mt-4 grid gap-4">
              <div className="flex items-center justify-between">
                <SectionTitle>Skills Summary</SectionTitle>
                <Button>Add New Skill</Button>
              </div>
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="py-2">Skill Name</TableHead>
                      <TableHead className="py-2">Experience</TableHead>
                      <TableHead className="py-2">Skill Level</TableHead>
                      <TableHead className="py-2 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "React", exp: "6 years", level: "Expert" },
                      { name: "TypeScript", exp: "5 years", level: "Advanced" },
                      { name: "Design Systems", exp: "4 years", level: "Intermediate" },
                    ].map((s, idx) => (
                      <TableRow key={s.name} className={idx % 2 ? "bg-muted/20" : ""}>
                        <TableCell className="py-2">{s.name}</TableCell>
                        <TableCell className="py-2">{s.exp}</TableCell>
                        <TableCell className="py-2">
                          <SkillLevel level={s.level as any} />
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <Button variant="ghost" className="h-8 px-2"><Pencil className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="comp" className="mt-4 text-sm text-muted-foreground">Compensation details to be configured.</TabsContent>
            <TabsContent value="perf" className="mt-4 text-sm text-muted-foreground">Performance module integration pending.</TabsContent>
            <TabsContent value="training" className="mt-4 text-sm text-muted-foreground">Training plans and records here.</TabsContent>
            <TabsContent value="leave" className="mt-4 text-sm text-muted-foreground">Leave & Attendance configuration.</TabsContent>
            <TabsContent value="docs" className="mt-4 text-sm text-muted-foreground">Documents linked to this profile.</TabsContent>
            <TabsContent value="access" className="mt-4 text-sm text-muted-foreground">Access & Security roles and policies.</TabsContent>
            <TabsContent value="log" className="mt-4 text-sm text-muted-foreground">Change Log audit trail.</TabsContent>
          </Tabs>
        </div>
      </div>
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
