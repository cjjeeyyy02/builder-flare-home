import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EMPLOYEES, type Employee } from "@/lib/data/employees";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/local/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, Check, Download, Eye, Pencil, Trash2, User } from "lucide-react";
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

  const isSarah = employee.id === "EMP001";
  // Section 1: Personal Information
  const piFirstName = isSarah ? "Sarah" : employee.firstName || "—";
  const piMiddleName = isSarah ? "—" : "—";
  const piLastName = isSarah ? "Mitchell" : employee.lastName || "—";
  const piDOB = isSarah ? "03-15-1990" : "��";
  const piGender = isSarah ? "Female" : "—";
  const piMarital = isSarah ? "Single" : "—";
  const piNationality = isSarah ? "United States" : "—";
  // Section 2: Contact Details
  const cdPhone = isSarah ? "+1 234 567 890" : employee.contactNumber ?? "—";
  const cdAltPhone = isSarah ? "+1 987 654 321" : "—";
  const cdEmail = isSarah ? "sarah.mitchell@email.com" : employee.email;
  const cdWorkEmail = isSarah ? "sarah.m@company.com" : employee.email;
  // Section 3: Address Information
  const addrStreet = isSarah ? "123 Main Street" : "—";
  const addrCity = isSarah ? "Los Angeles" : "—";
  const addrState = isSarah ? "California" : "—";
  const addrZip = isSarah ? "90001" : "—";
  // Section 4: Emergency Contact
  const ecName = isSarah ? "John Mitchell" : "—";
  const ecRelation = isSarah ? "Brother" : "—";
  const ecPhone = isSarah ? "+1 456 789 123" : "—";
  const ecAltPhone = isSarah ? "+1 321 654 987" : "—";

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
          <Tabs defaultValue={initialTab}>
            <div className="sticky top-16 z-10 border-b bg-background/90 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/70">
              <TabsList className="flex items-center gap-4 overflow-x-auto">
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
              ].map(([val, label]) => (
                <TabsTrigger
                  key={val}
                  value={val as string}
                  className={cn(
                    "px-2 py-1 text-xs font-medium border-b-2 border-transparent",
                    "data-[state=active]:text-foreground data-[state=active]:border-foreground",
                    "data-[state=inactive]:text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            </div>

            <div className="mt-3 rounded-lg border bg-card p-4 md:p-6">

            <TabsContent value="personal" className="space-y-6">
              <section>
                <h3 className="text-base font-bold text-foreground">Personal Information</h3>
                <div className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">First Name</div>
                    <div className="text-sm font-semibold text-foreground">{piFirstName}</div>
                    <div className="text-xs text-muted-foreground">Middle Name</div>
                    <div className="text-sm font-semibold text-foreground">{piMiddleName}</div>
                    <div className="text-xs text-muted-foreground">Last Name</div>
                    <div className="text-sm font-semibold text-foreground">{piLastName}</div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">Date of Birth</div>
                    <div className="text-sm font-semibold text-foreground">{piDOB}</div>
                    <div className="text-xs text-muted-foreground">Gender</div>
                    <div className="text-sm font-semibold text-foreground">{piGender}</div>
                    <div className="text-xs text-muted-foreground">Marital Status</div>
                    <div className="text-sm font-semibold text-foreground">{piMarital}</div>
                    <div className="text-xs text-muted-foreground">Nationality</div>
                    <div className="text-sm font-semibold text-foreground">{piNationality}</div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-base font-bold text-foreground">Contact Details</h3>
                <div className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">Phone Number</div>
                    <div className="text-sm font-semibold text-foreground">{cdPhone}</div>
                    <div className="text-xs text-muted-foreground">Alternate Number</div>
                    <div className="text-sm font-semibold text-foreground">{cdAltPhone}</div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">Email Address</div>
                    <div className="text-sm font-semibold text-foreground">{cdEmail}</div>
                    <div className="text-xs text-muted-foreground">Work Email</div>
                    <div className="text-sm font-semibold text-foreground">{cdWorkEmail}</div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-base font-bold text-foreground">Address Information</h3>
                <div className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">Street Address</div>
                    <div className="text-sm font-semibold text-foreground">{addrStreet}</div>
                    <div className="text-xs text-muted-foreground">City</div>
                    <div className="text-sm font-semibold text-foreground">{addrCity}</div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">State</div>
                    <div className="text-sm font-semibold text-foreground">{addrState}</div>
                    <div className="text-xs text-muted-foreground">Zip Code</div>
                    <div className="text-sm font-semibold text-foreground">{addrZip}</div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-base font-bold text-foreground">Emergency Contact</h3>
                <div className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">Contact Name</div>
                    <div className="text-sm font-semibold text-foreground">{ecName}</div>
                    <div className="text-xs text-muted-foreground">Relationship</div>
                    <div className="text-sm font-semibold text-foreground">{ecRelation}</div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">Contact Number</div>
                    <div className="text-sm font-semibold text-foreground">{ecPhone}</div>
                    <div className="text-xs text-muted-foreground">Alternate Number</div>
                    <div className="text-sm font-semibold text-foreground">{ecAltPhone}</div>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="work" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="text-base font-bold">Work Details</h3>
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    <LabeledField label="Position" value="Senior Software Engineer" />
                    <LabeledField label="Department" value="Engineering" />
                    <LabeledField label="Reporting Manager" value="Michael Rodriguez" />
                    <LabeledField label="Employment Status" value="Active" />
                    <LabeledField label="Employment Type" value="Full-Time" />
                    <LabeledField label="Date Hired" value="01/15/2023" />
                    <LabeledField label="Probation End Date" value="07-15-2023" />
                    <LabeledField label="Work Location / Site" value="Head Office" />
                    <LabeledField label="Shift Schedule" value="Day" />
                    <LabeledField label="Work Email" value="sarah.mitchell@company.com" />
                    <LabeledField label="Work Phone / Extension" value="+1 (555) 123-4567 ext. 1234" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold">Position History</h3>
                  <ul className="mt-3 space-y-4">
                    {[
                      { title: "Senior Analyst", range: "Jan 2022 – Aug 2023", reason: "Promoted" },
                      { title: "HR Assistant", range: "Jun 2020 – Dec 2021", reason: "Transfer" },
                    ].map((item, i) => (
                      <li key={i} className="relative pl-6">
                        <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-brand" />
                        <div className="text-sm font-semibold">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.range} • {item.reason}</div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5">
                    <h3 className="text-base font-bold">Organization Chart</h3>
                    <a href="#" className="mt-2 inline-block text-brand hover:underline">View Organization Chart</a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold">Previous Work History</h3>
                <div className="mt-3">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="py-2">Company Name</TableHead>
                        <TableHead className="py-2">Position</TableHead>
                        <TableHead className="py-2">Duration</TableHead>
                        <TableHead className="py-2">Location</TableHead>
                        <TableHead className="py-2">Employment Type</TableHead>
                        <TableHead className="py-2">Reason for Leaving</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { company: "Nimbus Labs", position: "Software Engineer", duration: "2 years", location: "Vancouver, Canada", type: "Full-time", reason: "Career growth" },
                        { company: "Aster Corp", position: "Junior Developer", duration: "1.5 years", location: "Seattle, USA", type: "Full-time", reason: "Relocation" },
                      ].map((r, idx) => (
                        <TableRow key={r.company + idx} className={idx % 2 ? "bg-muted/20" : ""}>
                          <TableCell className="py-2">{r.company}</TableCell>
                          <TableCell className="py-2">{r.position}</TableCell>
                          <TableCell className="py-2">{r.duration}</TableCell>
                          <TableCell className="py-2">{r.location}</TableCell>
                          <TableCell className="py-2">{r.type}</TableCell>
                          <TableCell className="py-2">{r.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold">Skills Summary</h3>
                <Button>Add New Skill</Button>
              </div>
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="py-2">Skill Name</TableHead>
                      <TableHead className="py-2">Experience (Years)</TableHead>
                      <TableHead className="py-2">Skill Level</TableHead>
                      <TableHead className="py-2 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "React", years: 4, level: "Expert" },
                      { name: "TypeScript", years: 3, level: "Advanced" },
                      { name: "Node.js", years: 3, level: "Advanced" },
                      { name: "Python", years: 2, level: "Intermediate" },
                      { name: "AWS", years: 2, level: "Intermediate" },
                      { name: "Docker", years: 1, level: "Beginner" },
                    ].map((s, idx) => (
                      <TableRow key={s.name} className={idx % 2 ? "bg-muted/20" : ""}>
                        <TableCell className="py-2">{s.name}</TableCell>
                        <TableCell className="py-2">{s.years}</TableCell>
                        <TableCell className="py-2">{s.level}</TableCell>
                        <TableCell className="py-2 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Button variant="ghost" className="h-8 px-2" aria-label={`Edit ${s.name}`}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" className="h-8 px-2" aria-label={`Delete ${s.name}`}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="comp" className="space-y-6">
              <div>
                <h3 className="text-base font-bold">Compensation Information</h3>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <div className="text-xs font-semibold text-foreground">Base Salary</div>
                    <div className="mt-1 text-lg font-semibold text-foreground">$95,000 per month</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs font-semibold text-foreground">Last Review</div>
                    <div className="mt-1 text-lg font-semibold text-foreground">01-15-2023</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs font-semibold text-foreground">Next Review</div>
                    <div className="mt-1 text-lg font-semibold text-foreground">01-15-2024</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold">Compensation History</h3>
                <div className="mt-3">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="py-2">Date of Change</TableHead>
                        <TableHead className="py-2">Amount</TableHead>
                        <TableHead className="py-2">Salary Amount</TableHead>
                        <TableHead className="py-2">Change Amount</TableHead>
                        <TableHead className="py-2">Change %</TableHead>
                        <TableHead className="py-2">Type</TableHead>
                        <TableHead className="py-2">Source</TableHead>
                        <TableHead className="py-2">Currency</TableHead>
                        <TableHead className="py-2">Job Title</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { date: "01-15-2024", amount: "$98,000", salary: "$98,000", change: "+$3,000", pct: "+3.16%", type: "Merit Increase", source: "Annual Review", currency: "USD", title: "Senior Software Engineer" },
                        { date: "01-15-2023", amount: "$95,000", salary: "$95,000", change: "+$5,000", pct: "+5.56%", type: "Promotion", source: "HR", currency: "USD", title: "Senior Software Engineer" },
                        { date: "01-15-2022", amount: "$90,000", salary: "$90,000", change: "+$10,000", pct: "+12.50%", type: "Adjustment", source: "Manager", currency: "USD", title: "Software Engineer" },
                      ].map((r, idx) => (
                        <TableRow key={r.date + r.title} className="hover:bg-transparent">
                          <TableCell className="py-2">{r.date}</TableCell>
                          <TableCell className="py-2">{r.amount}</TableCell>
                          <TableCell className="py-2">{r.salary}</TableCell>
                          <TableCell className="py-2">{r.change}</TableCell>
                          <TableCell className="py-2">{r.pct}</TableCell>
                          <TableCell className="py-2">{r.type}</TableCell>
                          <TableCell className="py-2">{r.source}</TableCell>
                          <TableCell className="py-2">{r.currency}</TableCell>
                          <TableCell className="py-2">{r.title}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="perf" className="space-y-2">
              <div className="rounded-none p-0 shadow-none">
                <div className="mb-2 text-sm font-bold text-foreground">Performance Reviews</div>
                <div className="overflow-x-auto">
                  <Table className="text-sm border-collapse table-fixed">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="py-3 border-y border-border font-semibold">Review Period</TableHead>
                        <TableHead className="py-3 border-y border-border font-semibold">Reviewer Name</TableHead>
                        <TableHead className="py-3 border-y border-border font-semibold">Rating</TableHead>
                        <TableHead className="py-3 border-y border-border font-semibold">Comments / Notes</TableHead>
                        <TableHead className="py-3 border-y border-border text-right font-semibold">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-transparent">
                        <TableCell className="py-3 border-y border-border">Q3 2023</TableCell>
                        <TableCell className="py-3 border-y border-border">—</TableCell>
                        <TableCell className="py-3 border-y border-border">4.5/5</TableCell>
                        <TableCell className="py-3 border-y border-border">
                          <div className="max-w-[520px] truncate">Sarah has consistently delivered exceptional work this quarter. Her technical le...</div>
                        </TableCell>
                        <TableCell className="py-3 border-y border-border text-right">
                          <Button className="h-8 w-8 p-0 hover:bg-transparent" aria-label="View review Q3 2023">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-transparent">
                        <TableCell className="py-3 border-y border-border">Q2 2023</TableCell>
                        <TableCell className="py-3 border-y border-border">—</TableCell>
                        <TableCell className="py-3 border-y border-border">4.4/5</TableCell>
                        <TableCell className="py-3 border-y border-border">
                          <div className="max-w-[520px] truncate">Excellent performance in Q2. Sarah successfully optimized our application perfor...</div>
                        </TableCell>
                        <TableCell className="py-3 border-y border-border text-right">
                          <Button className="h-8 w-8 p-0 hover:bg-transparent" aria-label="View review Q2 2023">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="training" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold">Training & Industry Certifications</h3>
                <Button className="h-8 rounded-md bg-blue-600 px-3 text-xs text-white hover:bg-blue-700">+ Add Training/Certification</Button>
              </div>

              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="mb-2 text-sm font-semibold">Training</div>
                <div className="overflow-hidden rounded-lg border">
                  <Table className="text-sm">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="py-2">Training Title</TableHead>
                        <TableHead className="py-2">Provider / Instructor</TableHead>
                        <TableHead className="py-2">Date Completed</TableHead>
                        <TableHead className="py-2">Status</TableHead>
                        <TableHead className="py-2 text-right">Certificate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-transparent">
                        <TableCell className="py-2">React Advanced Patterns</TableCell>
                        <TableCell className="py-2">Tech Academy</TableCell>
                        <TableCell className="py-2">08/15/2023</TableCell>
                        <TableCell className="py-2">
                          <Badge className="border-0 bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">Completed</Badge>
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Download certificate">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-transparent">
                        <TableCell className="py-2">AWS Cloud Architecture</TableCell>
                        <TableCell className="py-2">Amazon Web Services</TableCell>
                        <TableCell className="py-2">N/A</TableCell>
                        <TableCell className="py-2">
                          <Badge className="border-0 bg-amber-100 px-2.5 py-0.5 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">In Progress</Badge>
                        </TableCell>
                        <TableCell className="py-2 text-right">—</TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-transparent">
                        <TableCell className="py-2">Leadership Development Program</TableCell>
                        <TableCell className="py-2">Corporate University</TableCell>
                        <TableCell className="py-2">N/A</TableCell>
                        <TableCell className="py-2">
                          <Badge className="border-0 bg-zinc-200 px-2.5 py-0.5 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">Not Started</Badge>
                        </TableCell>
                        <TableCell className="py-2 text-right">—</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-semibold">Industry Certifications</div>
                </div>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Certification Name</div>
                    <div className="font-semibold text-foreground">AWS Certified Solutions Architect</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Certificate ID</div>
                    <div className="font-semibold text-foreground">AWS-CSA-2023-001234</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Issued Organization</div>
                    <div className="font-semibold text-foreground">Amazon Web Services</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Certificate Status</div>
                      <div>
                        <Badge className="inline-flex items-center gap-1 border-0 bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                          <Check className="h-3 w-3" /> Valid
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Issued Date</div>
                    <div className="font-semibold text-foreground">06/15/2023</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Expiry Date</div>
                    <div className="font-semibold text-foreground">06/15/2026</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button variant="outline" className="h-8 rounded-md px-3 text-xs">View Certificate</Button>
                  <Button variant="outline" className="h-8 rounded-md px-3 text-xs">Download Certificate</Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="leave" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold">Performance Metrics & Leave History</h3>
                <Button className="h-8 rounded-md bg-blue-600 px-3 text-xs text-white hover:bg-blue-700">Request Leave</Button>
              </div>

              {/* Metrics */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                  <div className="text-xs font-semibold text-foreground">Attendance Rate</div>
                  <div className="mt-2 text-sm font-bold">90.9%</div>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: "90.9%" }} />
                  </div>
                </div>
                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                  <div className="text-xs font-semibold text-foreground">Punctuality Rate</div>
                  <div className="mt-2 text-sm font-bold">95.5%</div>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-emerald-600" style={{ width: "95.5%" }} />
                  </div>
                </div>
              </div>

              {/* Leave Summary */}
              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                  <CalendarDays className="h-4 w-4" /> Leave Summary (2024)
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Approved Leaves</div>
                    <div className="text-sm font-bold text-emerald-600">2</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Under Review</div>
                    <div className="text-sm font-bold text-amber-600">1</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Rejected</div>
                    <div className="text-sm font-bold text-rose-600">1</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Total Days Taken</div>
                    <div className="text-sm font-bold text-foreground">8</div>
                  </div>
                </div>
              </div>

              {/* Leave History */}
              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                  <CalendarDays className="h-4 w-4" /> Leave History
                </div>
                <div className="overflow-hidden rounded-lg border">
                  <Table className="text-sm">
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="py-2">Leave Type</TableHead>
                        <TableHead className="py-2">Duration</TableHead>
                        <TableHead className="py-2">Total Days</TableHead>
                        <TableHead className="py-2">Status</TableHead>
                        <TableHead className="py-2 text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="py-2">Sick Leave</TableCell>
                        <TableCell className="py-2">03-15-2024 – 03-17-2024</TableCell>
                        <TableCell className="py-2">3</TableCell>
                        <TableCell className="py-2">
                          <Badge className="border-0 bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">Approved</Badge>
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="View sick leave">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-muted/20">
                        <TableCell className="py-2">Annual Leave</TableCell>
                        <TableCell className="py-2">01-08-2024 – 01-12-2024</TableCell>
                        <TableCell className="py-2">5</TableCell>
                        <TableCell className="py-2">
                          <Badge className="border-0 bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">Approved</Badge>
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="View annual leave">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-2">Personal Leave</TableCell>
                        <TableCell className="py-2">04-22-2024 – 04-22-2024</TableCell>
                        <TableCell className="py-2">1</TableCell>
                        <TableCell className="py-2">
                          <Badge className="border-0 bg-amber-100 px-2.5 py-0.5 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">Under Review</Badge>
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="View personal leave">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-2">Annual Leave</TableCell>
                        <TableCell className="py-2">05-10-2024 – 05-14-2024</TableCell>
                        <TableCell className="py-2">5</TableCell>
                        <TableCell className="py-2">
                          <Badge className="border-0 bg-rose-100 px-2.5 py-0.5 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">Rejected</Badge>
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="View annual leave">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="docs" className="space-y-2">
              <h3 className="text-base font-bold">Documents</h3>
            </TabsContent>
            <TabsContent value="access" className="space-y-2">
              <h3 className="text-base font-bold">Access & Security</h3>
            </TabsContent>
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
