import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EMPLOYEES, type Employee } from "@/lib/data/employees";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/local/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, Check, Download, Eye, Pencil, Shield, ShieldCheck, Trash2, User, EllipsisVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function ManageProfile() {
  const { id } = useParams();
  const { toast } = useToast();

  type CertData = {
    title: string;
    provider?: string;
    id?: string;
    issued?: string;
    expires?: string;
    owner?: string;
  };
  const [certModal, setCertModal] = useState<CertData | null>(null);

  function buildCertificateHTML(c: CertData): string {
    const issued = c.issued ? `<div style="margin-top:8px;color:#374151">Issued: ${c.issued}</div>` : "";
    const expires = c.expires ? `<div style="color:#374151">Expiry: ${c.expires}</div>` : "";
    const id = c.id ? `<div style="margin-top:8px;color:#374151">Certificate ID: ${c.id}</div>` : "";
    const provider = c.provider ? `<div style="margin-top:8px;color:#374151">Issuer: ${c.provider}</div>` : "";
    const owner = c.owner ? `<div style="margin-top:8px;color:#374151">Awarded to: ${c.owner}</div>` : "";
    return `<!doctype html><html><head><meta charset='utf-8'><title>${c.title}</title></head><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu; background:#f9fafb; padding:24px;">
      <div style="max-width:720px;margin:0 auto;background:white;border:1px solid #e5e7eb;border-radius:12px;padding:24px;">
        <h1 style="margin:0;font-size:20px;color:#111827">${c.title}</h1>
        ${owner}
        ${provider}
        ${issued}
        ${expires}
        ${id}
      </div>
    </body></html>`;
  }

  function downloadFile(filename: string, content: string, mime = "text/html") {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function viewCertificate(data: CertData) {
    setCertModal(data);
  }

  function downloadCertificate(data: CertData) {
    const html = buildCertificateHTML(data);
    const safeTitle = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    downloadFile(`${safeTitle}.html`, html);
    toast({ title: "Download started", description: `${data.title}` });
  }

  type PerfReview = { period: string; reviewer: string; date: string; rating: string; comments: string };
  const [viewOpen, setViewOpen] = useState<PerfReview | null>(null);
  const [editOpen, setEditOpen] = useState<PerfReview | null>(null);
  const [confirmDel, setConfirmDel] = useState<PerfReview | null>(null);

  const [editReviewer, setEditReviewer] = useState("");
  const [editRating, setEditRating] = useState("");
  const [editComments, setEditComments] = useState("");

  const [perfReviews, setPerfReviews] = useState<PerfReview[]>([
    {
      period: "Q3 2023",
      reviewer: "Michael Rodriguez",
      date: "10/05/2023",
      rating: "4.5/5",
      comments:
        "Sarah has consistently delivered exceptional work this quarter. Her technical leadership elevated the team’s output, and she proactively mentored junior engineers. She demonstrated strong problem-solving skills and improved system reliability through well-planned refactoring and testing.",
    },
    {
      period: "Q2 2023",
      reviewer: "Michael Rodriguez",
      date: "07/05/2023",
      rating: "4.4/5",
      comments:
        "Excellent performance in Q2. Sarah successfully optimized our application performance, reducing average response times by 35%. She collaborated effectively across teams and raised code quality through reviews and documentation.",
    },
  ]);

  function openEdit(r: PerfReview) {
    setEditOpen(r);
    setEditReviewer(r.reviewer);
    setEditRating(r.rating);
    setEditComments(r.comments);
  }

  function saveEdit() {
    if (!editOpen) return;
    setPerfReviews((arr) => arr.map((r) => (r.period === editOpen.period ? { ...r, reviewer: editReviewer, rating: editRating, comments: editComments } : r)));
    toast({ title: "Review updated", description: `${editOpen.period} has been updated.` });
    setEditOpen(null);
  }

  function doDelete(r: PerfReview) {
    setPerfReviews((arr) => arr.filter((x) => x.period !== r.period));
    toast({ title: "Review deleted", description: `${r.period} has been removed.` });
    setConfirmDel(null);
  }
  const navigate = useNavigate();
  const employee = useMemo(() => EMPLOYEES.find((e) => e.id === id) as Employee | undefined, [id]);

  if (!employee) {
    return (
      <div className="min-h-screen bg-background font-poppins text-[13px] leading-[1.4]">
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
    <div className="min-h-screen bg-background font-poppins text-[13px] leading-[1.4]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sticky top-0 z-10 bg-background/90 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <div className="flex items-start justify-between gap-4 rounded-2xl border bg-white p-3 shadow-sm">
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
              <TabsList className="flex items-center gap-2 overflow-x-auto">
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
                    "relative rounded-t-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                    "after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#2563eb] after:transition-transform hover:after:scale-x-100",
                    "data-[state=active]:text-[#2563eb] data-[state=active]:after:scale-x-100",
                    "data-[state=inactive]:text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            </div>

            <div className="mt-3 rounded-lg border bg-card p-3 md:p-4">

            <TabsContent value="personal" className="space-y-6">
              <section>
                <h3 className="text-base font-bold text-foreground">Personal Information</h3>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-foreground">First Name</div>
                    <div className="text-sm text-muted-foreground">{piFirstName}</div>
                    <div className="text-xs font-semibold text-foreground">Middle Name</div>
                    <div className="text-sm text-muted-foreground">{piMiddleName}</div>
                    <div className="text-xs font-semibold text-foreground">Last Name</div>
                    <div className="text-sm text-muted-foreground">{piLastName}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-foreground">Date of Birth</div>
                    <div className="text-sm text-muted-foreground">{piDOB}</div>
                    <div className="text-xs font-semibold text-foreground">Gender</div>
                    <div className="text-sm text-muted-foreground">{piGender}</div>
                    <div className="text-xs font-semibold text-foreground">Marital Status</div>
                    <div className="text-sm text-muted-foreground">{piMarital}</div>
                    <div className="text-xs font-semibold text-foreground">Nationality</div>
                    <div className="text-sm text-muted-foreground">{piNationality}</div>
                  </div>
                </div>
              </section>

              <section className="border-t pt-6">
                <h3 className="text-base font-bold text-foreground">Contact Details</h3>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-foreground">Phone Number</div>
                    <div className="text-sm text-muted-foreground">{cdPhone}</div>
                    <div className="text-xs font-semibold text-foreground">Alternate Number</div>
                    <div className="text-sm text-muted-foreground">{cdAltPhone}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-foreground">Email Address</div>
                    <div className="text-sm text-muted-foreground">{cdEmail}</div>
                    <div className="text-xs font-semibold text-foreground">Work Email</div>
                    <div className="text-sm text-muted-foreground">{cdWorkEmail}</div>
                  </div>
                </div>
              </section>

              <section className="border-t pt-6">
                <h3 className="text-base font-bold text-foreground">Address Information</h3>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Street Address</div>
                    <div className="text-sm font-semibold text-foreground">{addrStreet}</div>
                    <div className="text-xs text-muted-foreground">City</div>
                    <div className="text-sm font-semibold text-foreground">{addrCity}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">State</div>
                    <div className="text-sm font-semibold text-foreground">{addrState}</div>
                    <div className="text-xs text-muted-foreground">Zip Code</div>
                    <div className="text-sm font-semibold text-foreground">{addrZip}</div>
                  </div>
                </div>
              </section>

              <section className="border-t pt-6">
                <h3 className="text-base font-bold text-foreground">Emergency Contact</h3>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Contact Name</div>
                    <div className="text-sm font-semibold text-foreground">{ecName}</div>
                    <div className="text-xs text-muted-foreground">Relationship</div>
                    <div className="text-sm font-semibold text-foreground">{ecRelation}</div>
                  </div>
                  <div className="space-y-2">
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
                  <Table className="text-[13px]">
                    <TableHeader>
                      <TableRow className="">
                        <TableHead className="py-2 font-bold uppercase">Company Name</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Position</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Duration</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Location</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Employment Type</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Reason for Leaving</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { company: "Nimbus Labs", position: "Software Engineer", duration: "2 years", location: "Vancouver, Canada", type: "Full-time", reason: "Career growth" },
                        { company: "Aster Corp", position: "Junior Developer", duration: "1.5 years", location: "Seattle, USA", type: "Full-time", reason: "Relocation" },
                      ].map((r, idx) => (
                        <TableRow key={r.company + idx} className="">
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
              <div className="overflow-hidden rounded-lg border border-[#e5e7eb] shadow-sm">
                <Table className="text-[13px]">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="py-2 font-bold uppercase">Skill Name</TableHead>
                      <TableHead className="py-2 font-bold uppercase">Experience (Years)</TableHead>
                      <TableHead className="py-2 font-bold uppercase">Skill Level</TableHead>
                      <TableHead className="py-2 text-right font-bold uppercase">Action</TableHead>
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
                      <TableRow key={s.name} className="hover:bg-transparent">
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
                  <Table className="text-[13px]">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="py-2 font-bold uppercase">Date of Change</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Amount</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Salary Amount</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Change Amount</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Change %</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Type</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Source</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Currency</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Job Title</TableHead>
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
                  <Table className="text-[13px] border-collapse table-fixed">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="py-3 border-y border-border font-bold uppercase">Review Period</TableHead>
                        <TableHead className="py-3 border-y border-border font-bold uppercase">Reviewer Name</TableHead>
                        <TableHead className="py-3 border-y border-border font-bold uppercase">Rating</TableHead>
                        <TableHead className="py-3 border-y border-border font-bold uppercase">Comments / Notes</TableHead>
                        <TableHead className="py-3 border-y border-border text-center font-bold uppercase">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {perfReviews.map((r) => (
                        <TableRow key={r.period} className="hover:bg-transparent">
                          <TableCell className="py-3 border-y border-border">{r.period}</TableCell>
                          <TableCell className="py-3 border-y border-border">{r.reviewer}</TableCell>
                          <TableCell className="py-3 border-y border-border">{r.rating}</TableCell>
                          <TableCell className="py-3 border-y border-border">
                            <div className="max-w-[520px] truncate">{r.comments}</div>
                          </TableCell>
                          <TableCell className="py-3 border-y border-border text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:bg-transparent" aria-label={`Actions for ${r.period}`}>
                                  <EllipsisVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem onClick={() => setViewOpen(r)}>View Details</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEdit(r)}>Edit Review</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setConfirmDel(r)}>Delete Review</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              {/* View Details Dialog */}
              <Dialog open={!!viewOpen} onOpenChange={(o) => !o && setViewOpen(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Performance Review – {viewOpen?.period}</DialogTitle>
                  </DialogHeader>
                  {viewOpen && (
                    <div className="space-y-2 text-sm">
                      <div><span className="font-semibold">Reviewer:</span> {viewOpen.reviewer}</div>
                      <div><span className="font-semibold">Date:</span> {viewOpen.date}</div>
                      <div><span className="font-semibold">Rating:</span> {viewOpen.rating}</div>
                      <div>
                        <div className="font-semibold">Comments</div>
                        <div className="mt-1 whitespace-pre-line text-foreground/80">{viewOpen.comments}</div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Edit Review Dialog */}
              <Dialog open={!!editOpen} onOpenChange={(o) => !o && setEditOpen(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Review – {editOpen?.period}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-3 text-sm">
                    <div className="grid gap-1.5">
                      <label className="text-xs font-semibold">Reviewer Name</label>
                      <Input value={editReviewer} onChange={(e) => setEditReviewer(e.target.value)} />
                    </div>
                    <div className="grid gap-1.5">
                      <label className="text-xs font-semibold">Rating</label>
                      <Input value={editRating} onChange={(e) => setEditRating(e.target.value)} />
                    </div>
                    <div className="grid gap-1.5">
                      <label className="text-xs font-semibold">Comments / Notes</label>
                      <textarea value={editComments} onChange={(e) => setEditComments(e.target.value)} className="min-h-[100px] resize-y rounded-md border bg-background p-2 outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={saveEdit}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete Confirmation */}
              <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete review – {confirmDel?.period}?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <div className="text-sm text-muted-foreground">This action cannot be undone. This will permanently remove the selected performance review.</div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => confirmDel && doDelete(confirmDel)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>
            <TabsContent value="training" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold">Training & Industry Certifications</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="h-8 rounded-md bg-blue-600 px-3 text-xs text-white hover:bg-blue-700">+ Add Training/Certification</Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl p-6 shadow-xl">
                    <DialogHeader>
                      <DialogTitle>Add Training/Certification</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 text-sm">
                      <div className="grid gap-1.5">
                        <Label className="text-xs font-semibold">Type</Label>
                        <Select defaultValue="training">
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Training" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="certification">Certification</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-xs font-semibold">Training Title</Label>
                        <Input placeholder="The name or title of the training session" required />
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-xs font-semibold">Training Provider</Label>
                        <Input placeholder="The organization or individual offering it" />
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-xs font-semibold">Status</Label>
                        <Select>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="grid gap-1.5">
                          <Label className="text-xs font-semibold">Score</Label>
                          <Input type="number" placeholder="Numeric value representing performance" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs font-semibold">Completion Date</Label>
                          <Input type="date" placeholder="dd/mm/yyyy" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" className="rounded-md border px-4">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button className="rounded-md bg-[#0066FF] px-4 text-white hover:bg-[#0052CC]">Save</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="mb-2 text-sm font-semibold">Training</div>
                <div className="overflow-hidden rounded-lg border border-[#e5e7eb] shadow-sm">
                  <Table className="text-[13px]">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="py-2 font-bold uppercase">Training Title</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Provider / Instructor</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Date Completed</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Status</TableHead>
                        <TableHead className="py-2 text-right font-bold uppercase">Certificate</TableHead>
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
                          <div className="inline-flex items-center gap-1">
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              aria-label="View certificate"
                              onClick={() => viewCertificate({
                                title: "React Advanced Patterns – Certificate of Completion",
                                provider: "Tech Academy",
                                issued: "08/15/2023",
                                owner: `${employee.firstName} ${employee.lastName}`,
                              })}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              aria-label="Download certificate"
                              onClick={() => downloadCertificate({
                                title: "React Advanced Patterns – Certificate of Completion",
                                provider: "Tech Academy",
                                issued: "08/15/2023",
                                owner: `${employee.firstName} ${employee.lastName}`,
                              })}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
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
                  <Button
                    variant="outline"
                    className="h-8 rounded-md px-3 text-xs"
                    onClick={() => viewCertificate({
                      title: "AWS Certified Solutions Architect",
                      provider: "Amazon Web Services",
                      id: "AWS-CSA-2023-001234",
                      issued: "06/15/2023",
                      expires: "06/15/2026",
                      owner: `${employee.firstName} ${employee.lastName}`,
                    })}
                  >
                    View Certificate
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 rounded-md px-3 text-xs"
                    onClick={() => downloadCertificate({
                      title: "AWS Certified Solutions Architect",
                      provider: "Amazon Web Services",
                      id: "AWS-CSA-2023-001234",
                      issued: "06/15/2023",
                      expires: "06/15/2026",
                      owner: `${employee.firstName} ${employee.lastName}`,
                    })}
                  >
                    Download Certificate
                  </Button>
                </div>
              </div>
              {/* Certificate Viewer */}
              <Dialog open={!!certModal} onOpenChange={(o) => !o && setCertModal(null)}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>{certModal?.title}</DialogTitle>
                  </DialogHeader>
                  {certModal && (
                    <div className="h-[60vh] w-full overflow-hidden rounded-md border">
                      <iframe title="Certificate Preview" className="h-full w-full" srcDoc={buildCertificateHTML(certModal)} />
                    </div>
                  )}
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                    {certModal && (
                      <Button onClick={() => downloadCertificate(certModal)}>
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                <div className="overflow-hidden rounded-lg border border-[#e5e7eb] shadow-sm">
                  <Table className="text-[13px]">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="py-2 font-bold uppercase">Leave Type</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Duration</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Total Days</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Status</TableHead>
                        <TableHead className="py-2 text-right font-bold uppercase">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-transparent">
                        <TableCell className="py-2">Sick Leave</TableCell>
                        <TableCell className="py-2">03-15-2024 – 03-17-2024</TableCell>
                        <TableCell className="py-2">3</TableCell>
                        <TableCell className="py-2">
                          <Badge className="border-0 bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">Approved</Badge>
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Actions for sick leave">
                                <EllipsisVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem className="hover:bg-accent" onClick={() => setLeaveView({ type: "Sick Leave", duration: "03-15-2024 – 03-17-2024", days: 3, status: "Approved" })}>View Details</DropdownMenuItem>
                              {canDeleteLeave && (
                                <DropdownMenuItem className="hover:bg-accent" onClick={() => setLeaveConfirm({ type: "Sick Leave", duration: "03-15-2024 – 03-17-2024", days: 3, status: "Approved" })}>Delete</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-transparent">
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
                      <TableRow className="hover:bg-transparent">
                        <TableCell className="py-2">Personal Leave</TableCell>
                        <TableCell className="py-2">04-22-2024 – 04-22-2024</TableCell>
                        <TableCell className="py-2">1</TableCell>
                        <TableCell className="py-2">
                          <Badge className="border-0 bg-amber-100 px-2.5 py-0.5 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">Under Review</Badge>
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Actions for personal leave">
                                <EllipsisVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem className="hover:bg-accent" onClick={() => setLeaveView({ type: "Personal Leave", duration: "04-22-2024 – 04-22-2024", days: 1, status: "Under Review" })}>View Details</DropdownMenuItem>
                              {canDeleteLeave && (
                                <DropdownMenuItem className="hover:bg-accent" onClick={() => setLeaveConfirm({ type: "Personal Leave", duration: "04-22-2024 – 04-22-2024", days: 1, status: "Under Review" })}>Delete</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-transparent">
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
            <TabsContent value="docs" className="space-y-4">
              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-bold text-foreground">Employee Documents</div>
                  <Button className="h-8 rounded-md bg-blue-600 px-3 text-xs text-white hover:bg-blue-700">+ Upload Document</Button>
                </div>
                <div className="overflow-hidden rounded-lg border border-[#e5e7eb] shadow-sm">
                  <Table className="text-[13px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="py-2 font-bold uppercase">Document Title</TableHead>
                        <TableHead className="py-2 font-bold uppercase">File Type</TableHead>
                        <TableHead className="py-2 font-bold uppercase">File Size</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Upload Date</TableHead>
                        <TableHead className="py-2 text-right font-bold uppercase">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="py-2">Employment Contract</TableCell>
                        <TableCell className="py-2">PDF</TableCell>
                        <TableCell className="py-2">2.4 MB</TableCell>
                        <TableCell className="py-2">01/15/2023</TableCell>
                        <TableCell className="py-2 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="View Employment Contract"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Download Employment Contract"><Download className="h-4 w-4" /></Button>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10" aria-label="Delete Employment Contract"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-2">Tax Forms (W-2)</TableCell>
                        <TableCell className="py-2">PDF</TableCell>
                        <TableCell className="py-2">1.8 MB</TableCell>
                        <TableCell className="py-2">12/31/2023</TableCell>
                        <TableCell className="py-2 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="View Tax Forms (W-2)"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Download Tax Forms (W-2)"><Download className="h-4 w-4" /></Button>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10" aria-label="Delete Tax Forms (W-2)"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-2">Performance Review 2023</TableCell>
                        <TableCell className="py-2">DOCX</TableCell>
                        <TableCell className="py-2">856 KB</TableCell>
                        <TableCell className="py-2">11/20/2023</TableCell>
                        <TableCell className="py-2 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="View Performance Review 2023"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Download Performance Review 2023"><Download className="h-4 w-4" /></Button>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10" aria-label="Delete Performance Review 2023"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-2">Benefits Enrollment</TableCell>
                        <TableCell className="py-2">PDF</TableCell>
                        <TableCell className="py-2">3.1 MB</TableCell>
                        <TableCell className="py-2">03/10/2023</TableCell>
                        <TableCell className="py-2 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="View Benefits Enrollment"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Download Benefits Enrollment"><Download className="h-4 w-4" /></Button>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10" aria-label="Delete Benefits Enrollment"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-2">Training Certificate</TableCell>
                        <TableCell className="py-2">PDF</TableCell>
                        <TableCell className="py-2">1.2 MB</TableCell>
                        <TableCell className="py-2">08/15/2023</TableCell>
                        <TableCell className="py-2 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="View Training Certificate"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Download Training Certificate"><Download className="h-4 w-4" /></Button>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10" aria-label="Delete Training Certificate"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="access" className="space-y-4">
              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                  <Shield className="h-4 w-4" /> Account Settings
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Account Active</div>
                    <Switch defaultChecked aria-label="Account Active" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">HR Access</div>
                    <Switch aria-label="HR Access" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Admin Rights</div>
                    <Switch aria-label="Admin Rights" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                  <Shield className="h-4 w-4" /> Security Actions
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" className="h-8 rounded-md border-amber-500 px-3 text-xs text-amber-600">Reset Password</Button>
                  <Button variant="outline" className="h-8 rounded-md border-blue-600 px-3 text-xs text-blue-600">Generate New User ID</Button>
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                  <ShieldCheck className="h-4 w-4" /> Current Security Status
                </div>
                <div className="grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Account Status</div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">Active</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">HR Access</div>
                    <div className="text-foreground/70">Disabled</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Admin Rights</div>
                    <div className="text-foreground/70">Not Granted</div>
                  </div>
                </div>
              </div>
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
