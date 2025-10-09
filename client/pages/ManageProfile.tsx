import { useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EMPLOYEES, type Employee } from "@/lib/data/employees";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/local/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Download,
  Eye,
  Pencil,
  Shield,
  ShieldCheck,
  Trash2,
  User,
  EllipsisVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ManageProfile() {
  const { id } = useParams();
  const { toast } = useToast();

  // Role and permissions (example: admin | hr | employee)
  const currentRole: "admin" | "hr" | "employee" = "admin";
  const canDeleteLeave = currentRole === "admin" || currentRole === "hr";

  type EmployeeDoc = {
    id: string;
    title: string;
    fileType: string;
    fileSize: string;
    uploadDate: string;
    url?: string;
  };
  const [docs, setDocs] = useState<EmployeeDoc[]>([
    {
      id: "doc-1",
      title: "Employment Contract",
      fileType: "PDF",
      fileSize: "2.4 MB",
      uploadDate: "01/15/2023",
    },
    {
      id: "doc-2",
      title: "Tax Forms (W-2)",
      fileType: "PDF",
      fileSize: "1.8 MB",
      uploadDate: "12/31/2023",
    },
    {
      id: "doc-3",
      title: "Performance Review 2023",
      fileType: "DOCX",
      fileSize: "856 KB",
      uploadDate: "11/20/2023",
    },
    {
      id: "doc-4",
      title: "Benefits Enrollment",
      fileType: "PDF",
      fileSize: "3.1 MB",
      uploadDate: "03/10/2023",
    },
    {
      id: "doc-5",
      title: "Training Certificate",
      fileType: "PDF",
      fileSize: "1.2 MB",
      uploadDate: "08/15/2023",
    },
  ]);
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const [docPreview, setDocPreview] = useState<EmployeeDoc | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  function today(): string {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = String(d.getFullYear());
    return `${mm}/${dd}/${yyyy}`;
  }
  function onUploadClick() {
    uploadRef.current?.click();
  }
  function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newDocs: EmployeeDoc[] = files.map((f, i) => {
      const parts = f.name.split(".");
      const ext = parts.length > 1 ? parts.pop()!.toUpperCase() : "FILE";
      const title = parts.join(".");
      const url = URL.createObjectURL(f);
      return {
        id: `u-${Date.now()}-${i}`,
        title: title || f.name,
        fileType: ext,
        fileSize: formatSize(f.size),
        uploadDate: today(),
        url,
      };
    });
    setDocs((arr) => [...newDocs, ...arr]);
    e.target.value = "";
    toast({
      title: "Upload complete",
      description: `${files.length} document(s) added.`,
    });
  }
  function viewDoc(d: EmployeeDoc) {
    if (!d.url)
      return toast({
        title: "Preview unavailable",
        description: "This document has no preview.",
      });
    setDocPreview(d);
  }
  function downloadDoc(d: EmployeeDoc) {
    if (d.url) {
      const a = document.createElement("a");
      a.href = d.url;
      a.download = `${d.title}.${d.fileType.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
    toast({ title: "Download unavailable", description: "No file attached." });
  }
  function deleteDoc(d: EmployeeDoc) {
    if (d.url) URL.revokeObjectURL(d.url);
    setDocs((arr) => arr.filter((x) => x.id !== d.id));
    toast({ title: "Document removed", description: d.title });
  }

  type AppEntry = {
    id: string;
    position: string;
    department: string;
    dateApplied: string;
    status: "Submitted" | "Under Review" | "Interview" | "Offer" | "Rejected";
  };
  const [appHistory] = useState<AppEntry[]>([
    {
      id: "app-1",
      position: "Senior Software Engineer",
      department: "Engineering",
      dateApplied: "12/05/2023",
      status: "Offer",
    },
    {
      id: "app-2",
      position: "Frontend Developer",
      department: "Engineering",
      dateApplied: "09/18/2023",
      status: "Interview",
    },
    {
      id: "app-3",
      position: "UX Designer",
      department: "Design",
      dateApplied: "06/21/2023",
      status: "Rejected",
    },
  ]);

  type LeaveRec = {
    type: string;
    duration: string;
    days: number;
    status: string;
  };
  const [leaveView, setLeaveView] = useState<LeaveRec | null>(null);
  const [leaveConfirm, setLeaveConfirm] = useState<LeaveRec | null>(null);

  function deleteLeave(rec: LeaveRec) {
    // in a real app this would call an API; here we just show a toast
    toast({
      title: "Leave record deleted",
      description: `${rec.type} • ${rec.duration}`,
    });
    setLeaveConfirm(null);
  }

  type LeaveRequest = {
    id: string;
    employeeId: string;
    employeeName: string;
    type: string;
    dateFiled: string; // DD/MM/YYYY
    duration: string;
    reason: string;
    status: "Pending" | "Approved" | "Declined";
  };
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: "lr-1",
      employeeId: EMPLOYEES[0]?.id || "EMP001",
      employeeName: `${EMPLOYEES[0]?.firstName || "Sarah"} ${EMPLOYEES[0]?.lastName || "Mitchell"}`,
      type: "Sick Leave",
      dateFiled: "03/14/2024",
      duration: "03-15-2024 – 03-17-2024",
      reason: "Flu and rest",
      status: "Pending",
    },
    {
      id: "lr-2",
      employeeId: EMPLOYEES[1]?.id || "EMP002",
      employeeName: `${EMPLOYEES[1]?.firstName || "Daniel"} ${EMPLOYEES[1]?.lastName || "Nguyen"}`,
      type: "Annual Leave",
      dateFiled: "01/05/2024",
      duration: "01-08-2024 – 01-12-2024",
      reason: "Family vacation",
      status: "Approved",
    },
    {
      id: "lr-3",
      employeeId: EMPLOYEES[2]?.id || "EMP003",
      employeeName: `${EMPLOYEES[2]?.firstName || "Priya"} ${EMPLOYEES[2]?.lastName || "Kumar"}`,
      type: "Personal Leave",
      dateFiled: "04/20/2024",
      duration: "04-22-2024 – 04-22-2024",
      reason: "Personal errand",
      status: "Pending",
    },
  ]);
  const [confirmApprove, setConfirmApprove] = useState<LeaveRequest | null>(
    null,
  );
  const [confirmDecline, setConfirmDecline] = useState<LeaveRequest | null>(
    null,
  );

  function applyRequestStatus(
    rec: LeaveRequest,
    status: "Approved" | "Declined",
  ) {
    setLeaveRequests((arr) =>
      arr.map((r) => (r.id === rec.id ? { ...r, status } : r)),
    );
    toast({
      title: `Request ${status.toLowerCase()}`,
      description: `${rec.employeeName} • ${rec.type}`,
    });
    setConfirmApprove(null);
    setConfirmDecline(null);
  }

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
    const issued = c.issued
      ? `<div style="margin-top:8px;color:#374151">Issued: ${c.issued}</div>`
      : "";
    const expires = c.expires
      ? `<div style="color:#374151">Expiry: ${c.expires}</div>`
      : "";
    const id = c.id
      ? `<div style="margin-top:8px;color:#374151">Certificate ID: ${c.id}</div>`
      : "";
    const provider = c.provider
      ? `<div style="margin-top:8px;color:#374151">Issuer: ${c.provider}</div>`
      : "";
    const owner = c.owner
      ? `<div style="margin-top:8px;color:#374151">Awarded to: ${c.owner}</div>`
      : "";
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
    const safeTitle = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    downloadFile(`${safeTitle}.html`, html);
    toast({ title: "Download started", description: `${data.title}` });
  }

  type PerfReview = {
    period: string;
    reviewer: string;
    date: string;
    rating: string;
    comments: string;
  };
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
    setPerfReviews((arr) =>
      arr.map((r) =>
        r.period === editOpen.period
          ? {
              ...r,
              reviewer: editReviewer,
              rating: editRating,
              comments: editComments,
            }
          : r,
      ),
    );
    toast({
      title: "Review updated",
      description: `${editOpen.period} has been updated.`,
    });
    setEditOpen(null);
  }

  function doDelete(r: PerfReview) {
    setPerfReviews((arr) => arr.filter((x) => x.period !== r.period));
    toast({
      title: "Review deleted",
      description: `${r.period} has been removed.`,
    });
    setConfirmDel(null);
  }
  const navigate = useNavigate();
  const employee = useMemo(
    () => EMPLOYEES.find((e) => e.id === id) as Employee | undefined,
    [id],
  );

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

  const initialTab =
    typeof window !== "undefined" && window.location.hash === "#documents"
      ? "docs"
      : "personal";

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
  const cdPhone = isSarah ? "+1 234 567 890" : (employee.contactNumber ?? "—");
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
        <div className="py-2">
          <Button variant="ghost" onClick={() => navigate(-1)} className="h-8 px-2 text-xs">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        <div className="py-4">
          <div className="flex items-start justify-between gap-4 rounded-2xl border bg-white p-3 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-lg font-semibold text-brand">
                {employee.firstName.charAt(0)}
                {employee.lastName.charAt(0)}
              </div>
              <div className="grid gap-1">
                <div className="text-lg font-bold text-foreground">
                  {employee.firstName} {employee.lastName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {employee.email}
                </div>
                <div className="text-sm text-muted-foreground">
                  {employee.contactNumber ?? "—"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {employee.department} • {employee.location ?? "—"}
                </div>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="font-semibold text-foreground">
                Employee ID:{" "}
                <span className="text-muted-foreground">{employee.id}</span>
              </div>
              <div className="mt-1 flex items-center justify-end gap-1 text-muted-foreground">
                <CalendarDays className="h-4 w-4" /> Joined Date:{" "}
                {employee.joiningDate}
              </div>
            </div>
          </div>
        </div>

        <div className="py-4">
          <Tabs defaultValue={initialTab}>
            <div className="border-b bg-background py-2">
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
                  ["apps", "Application History"],
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
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-foreground">Personal Information</h3>
                    <Button variant="ghost" className="h-7 w-7 p-0" aria-label="Edit Personal Information"><Pencil className="h-4 w-4" /></Button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-foreground">
                        First Name
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {piFirstName}
                      </div>
                      <div className="text-xs font-semibold text-foreground">
                        Middle Name
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {piMiddleName}
                      </div>
                      <div className="text-xs font-semibold text-foreground">
                        Last Name
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {piLastName}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-foreground">
                        Date of Birth
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {piDOB}
                      </div>
                      <div className="text-xs font-semibold text-foreground">
                        Gender
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {piGender}
                      </div>
                      <div className="text-xs font-semibold text-foreground">
                        Marital Status
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {piMarital}
                      </div>
                      <div className="text-xs font-semibold text-foreground">
                        Nationality
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {piNationality}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-foreground">Contact Details</h3>
                    <Button variant="ghost" className="h-7 w-7 p-0" aria-label="Edit Contact Details"><Pencil className="h-4 w-4" /></Button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-foreground">
                        Phone Number
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {cdPhone}
                      </div>
                      <div className="text-xs font-semibold text-foreground">
                        Alternate Number
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {cdAltPhone}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-foreground">
                        Email Address
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {cdEmail}
                      </div>
                      <div className="text-xs font-semibold text-foreground">
                        Work Email
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {cdWorkEmail}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-foreground">Address Information</h3>
                    <Button variant="ghost" className="h-7 w-7 p-0" aria-label="Edit Address Information"><Pencil className="h-4 w-4" /></Button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Street Address
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {addrStreet}
                      </div>
                      <div className="text-xs text-muted-foreground">City</div>
                      <div className="text-sm font-semibold text-foreground">
                        {addrCity}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">State</div>
                      <div className="text-sm font-semibold text-foreground">
                        {addrState}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Zip Code
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {addrZip}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-foreground">Emergency Contact</h3>
                    <Button variant="ghost" className="h-7 w-7 p-0" aria-label="Edit Emergency Contact"><Pencil className="h-4 w-4" /></Button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Contact Name
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {ecName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Relationship
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {ecRelation}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Contact Number
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {ecPhone}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Alternate Number
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {ecAltPhone}
                      </div>
                    </div>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="work" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold">Work Details</h3>
                      <Button variant="ghost" className="h-7 w-7 p-0" aria-label="Edit Work Details"><Pencil className="h-4 w-4" /></Button>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      <LabeledField
                        label="Position"
                        value="Senior Software Engineer"
                      />
                      <LabeledField label="Department" value="Engineering" />
                      <LabeledField
                        label="Reporting Manager"
                        value="Michael Rodriguez"
                      />
                      <LabeledField label="Employment Status" value="Active" />
                      <LabeledField label="Employment Type" value="Full-Time" />
                      <LabeledField label="Date Hired" value="01/15/2023" />
                      <LabeledField
                        label="Probation End Date"
                        value="07-15-2023"
                      />
                      <LabeledField
                        label="Work Location / Site"
                        value="Head Office"
                      />
                      <LabeledField label="Shift Schedule" value="Day" />
                      <LabeledField
                        label="Work Email"
                        value="sarah.mitchell@company.com"
                      />
                      <LabeledField
                        label="Work Phone / Extension"
                        value="+1 (555) 123-4567 ext. 1234"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold">Position History</h3>
                      <Button variant="ghost" className="h-7 w-7 p-0" aria-label="Edit Position History"><Pencil className="h-4 w-4" /></Button>
                    </div>
                    <ul className="mt-3 space-y-4">
                      {[
                        {
                          title: "Senior Analyst",
                          range: "Jan 2022 – Aug 2023",
                          reason: "Promoted",
                        },
                        {
                          title: "HR Assistant",
                          range: "Jun 2020 – Dec 2021",
                          reason: "Transfer",
                        },
                      ].map((item, i) => (
                        <li key={i} className="relative pl-6">
                          <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-brand" />
                          <div className="text-sm font-semibold">
                            {item.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.range} • {item.reason}
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5">
                      <h3 className="text-base font-bold">
                        Organization Chart
                      </h3>
                      <a
                        href="#"
                        className="mt-2 inline-block text-brand hover:underline"
                      >
                        View Organization Chart
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold">Previous Work History</h3>
                  <div className="mt-3">
                    <Table className="text-[13px]">
                      <TableHeader>
                        <TableRow className="">
                          <TableHead className="py-2 font-bold uppercase">
                            Company Name
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Position
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Duration
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Location
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Employment Type
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Reason for Leaving
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          {
                            company: "Nimbus Labs",
                            position: "Software Engineer",
                            duration: "2 years",
                            location: "Vancouver, Canada",
                            type: "Full-time",
                            reason: "Career growth",
                          },
                          {
                            company: "Aster Corp",
                            position: "Junior Developer",
                            duration: "1.5 years",
                            location: "Seattle, USA",
                            type: "Full-time",
                            reason: "Relocation",
                          },
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
                      <TableFooter>
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={6} className="py-2 text-right">
                            <Button className="h-7 rounded-md bg-blue-600 px-2 text-xs text-white hover:bg-blue-700">Add Work History</Button>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold">Skills Summary</h3>
                </div>
                <div className="overflow-hidden rounded-lg border border-[#e5e7eb] shadow-sm">
                  <Table className="text-[13px]">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="py-2 font-bold uppercase">
                          Skill Name
                        </TableHead>
                        <TableHead className="py-2 text-center font-bold uppercase">
                          Experience (Years)
                        </TableHead>
                        <TableHead className="py-2 font-bold uppercase">
                          Skill Level
                        </TableHead>
                        <TableHead className="py-2 text-right font-bold uppercase">
                          Action
                        </TableHead>
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
                          <TableCell className="py-2"><span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-muted-foreground" /> {s.name}</span></TableCell>
                          <TableCell className="py-2 text-center">{s.years}</TableCell>
                          <TableCell className="py-2">{s.level}</TableCell>
                          <TableCell className="py-2 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  aria-label={`Actions for ${s.name}`}
                                >
                                  <EllipsisVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={4} className="py-2 text-right">
                          <Button className="h-7 rounded-md bg-blue-600 px-2 text-xs text-white hover:bg-blue-700">Add Skill</Button>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="comp" className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold">Compensation Information</h3>
                    <Button variant="outline" className="h-7 rounded-md px-2 text-xs">+ Add Compensation</Button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border p-4">
                      <div className="text-xs font-semibold text-foreground">
                        Current Salary
                      </div>
                      <div className="mt-1 text-lg font-semibold text-foreground">
                        $95,000 per month
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-xs font-semibold text-foreground">
                        Last Review
                      </div>
                      <div className="mt-1 text-lg font-semibold text-foreground">
                        01-15-2023
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-xs font-semibold text-foreground">
                        Next Review
                      </div>
                      <div className="mt-1 text-lg font-semibold text-foreground">
                        01-15-2024
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold">Compensation History</h3>
                  <div className="mt-3">
                    <Table className="text-[13px]">
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="py-2 font-bold uppercase">
                            Date of Change
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">Change %</TableHead>
                          <TableHead className="py-2 font-bold uppercase">Type</TableHead>
                          <TableHead className="py-2 font-bold uppercase">Currency</TableHead>
                          <TableHead className="py-2 font-bold uppercase">Position</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          {
                            date: "01-15-2024",
                            pct: "+3.16%",
                            pct: "+3.16%",
                            type: "Merit Increase",
                            source: "Annual Review",
                            currency: "USD",
                            title: "Senior Software Engineer",
                          },
                          {
                            date: "01-15-2023",
                            pct: "+5.56%",
                            pct: "+5.56%",
                            type: "Promotion",
                            source: "HR",
                            currency: "USD",
                            title: "Senior Software Engineer",
                          },
                          {
                            date: "01-15-2022",
                            pct: "+12.50%",
                            pct: "+12.50%",
                            type: "Adjustment",
                            source: "Manager",
                            currency: "USD",
                            title: "Software Engineer",
                          },
                        ].map((r, idx) => (
                          <TableRow
                            key={r.date + r.title}
                            className="hover:bg-transparent"
                          >
                            <TableCell className="py-2">{r.date}</TableCell>
                            <TableCell className="py-2">{r.pct}</TableCell>
                            <TableCell className="py-2">{r.type}</TableCell>
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
                  <div className="mb-2 text-sm font-bold text-foreground">
                    Performance Reviews
                  </div>
                  <div className="overflow-x-auto">
                    <Table className="text-[13px] border-collapse table-fixed">
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="py-3 border-y border-border font-bold uppercase">
                            Review Period
                          </TableHead>
                          <TableHead className="py-3 border-y border-border font-bold uppercase">
                            Reviewer Name
                          </TableHead>
                          <TableHead className="py-3 border-y border-border font-bold uppercase">
                            Rating
                          </TableHead>
                          <TableHead className="py-3 border-y border-border font-bold uppercase">
                            Comments / Notes
                          </TableHead>
                          <TableHead className="py-3 border-y border-border text-center font-bold uppercase">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {perfReviews.map((r) => (
                          <TableRow
                            key={r.period}
                            className="hover:bg-transparent"
                          >
                            <TableCell className="py-3 border-y border-border">
                              {r.period}
                            </TableCell>
                            <TableCell className="py-3 border-y border-border">
                              {r.reviewer}
                            </TableCell>
                            <TableCell className="py-3 border-y border-border">
                              {r.rating}
                            </TableCell>
                            <TableCell className="py-3 border-y border-border">
                              <div className="max-w-[520px] truncate">
                                {r.comments}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 border-y border-border text-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-muted-foreground hover:bg-transparent"
                                    aria-label={`Actions for ${r.period}`}
                                  >
                                    <EllipsisVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-44"
                                >
                                  <DropdownMenuItem
                                    onClick={() => setViewOpen(r)}
                                  >
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openEdit(r)}>
                                    Edit Review
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setConfirmDel(r)}
                                  >
                                    Delete Review
                                  </DropdownMenuItem>
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
                <Dialog
                  open={!!viewOpen}
                  onOpenChange={(o) => !o && setViewOpen(null)}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Performance Review – {viewOpen?.period}
                      </DialogTitle>
                    </DialogHeader>
                    {viewOpen && (
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold">Reviewer:</span>{" "}
                          {viewOpen.reviewer}
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span>{" "}
                          {viewOpen.date}
                        </div>
                        <div>
                          <span className="font-semibold">Rating:</span>{" "}
                          {viewOpen.rating}
                        </div>
                        <div>
                          <div className="font-semibold">Comments</div>
                          <div className="mt-1 whitespace-pre-line text-foreground/80">
                            {viewOpen.comments}
                          </div>
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
                <Dialog
                  open={!!editOpen}
                  onOpenChange={(o) => !o && setEditOpen(null)}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Edit Review – {editOpen?.period}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-3 text-sm">
                      <div className="grid gap-1.5">
                        <label className="text-xs font-semibold">
                          Reviewer Name
                        </label>
                        <Input
                          value={editReviewer}
                          onChange={(e) => setEditReviewer(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-xs font-semibold">Rating</label>
                        <Input
                          value={editRating}
                          onChange={(e) => setEditRating(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-xs font-semibold">
                          Comments / Notes
                        </label>
                        <textarea
                          value={editComments}
                          onChange={(e) => setEditComments(e.target.value)}
                          className="min-h-[100px] resize-y rounded-md border bg-background p-2 outline-none focus:ring-2 focus:ring-ring"
                        />
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
                <AlertDialog
                  open={!!confirmDel}
                  onOpenChange={(o) => !o && setConfirmDel(null)}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete review – {confirmDel?.period}?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="text-sm text-muted-foreground">
                      This action cannot be undone. This will permanently remove
                      the selected performance review.
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => confirmDel && doDelete(confirmDel)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TabsContent>
              <TabsContent value="training" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold">
                    Training & Industry Certifications
                  </h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="h-8 rounded-md bg-blue-600 px-3 text-xs text-white hover:bg-blue-700">
                        + Add Training/Certification
                      </Button>
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
                              <SelectItem value="certification">
                                Certification
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs font-semibold">
                            Training Title
                          </Label>
                          <Input
                            placeholder="The name or title of the training session"
                            required
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs font-semibold">
                            Training Provider
                          </Label>
                          <Input placeholder="The organization or individual offering it" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs font-semibold">
                            Status
                          </Label>
                          <Select>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ongoing">Ongoing</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold">
                              Score
                            </Label>
                            <Input
                              type="number"
                              placeholder="Numeric value representing performance"
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold">
                              Completion Date
                            </Label>
                            <Input type="date" placeholder="dd/mm/yyyy" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            className="rounded-md border px-4"
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button className="rounded-md bg-[#0066FF] px-4 text-white hover:bg-[#0052CC]">
                            Save
                          </Button>
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
                          <TableHead className="py-2 font-bold uppercase">
                            Training Title
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Provider / Instructor
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Date Completed
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Status
                          </TableHead>
                          <TableHead className="py-2 text-right font-bold uppercase">
                            Certificate
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="hover:bg-transparent">
                          <TableCell className="py-2">
                            React Advanced Patterns
                          </TableCell>
                          <TableCell className="py-2">Tech Academy</TableCell>
                          <TableCell className="py-2">08/15/2023</TableCell>
                          <TableCell className="py-2">
                            <Badge className="border-0 bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                              Completed
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2 text-right">
                            <div className="inline-flex items-center gap-1">
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-2"
                                aria-label="View certificate"
                                onClick={() =>
                                  viewCertificate({
                                    title:
                                      "React Advanced Patterns – Certificate of Completion",
                                    provider: "Tech Academy",
                                    issued: "08/15/2023",
                                    owner: `${employee.firstName} ${employee.lastName}`,
                                  })
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-2"
                                aria-label="Download certificate"
                                onClick={() =>
                                  downloadCertificate({
                                    title:
                                      "React Advanced Patterns – Certificate of Completion",
                                    provider: "Tech Academy",
                                    issued: "08/15/2023",
                                    owner: `${employee.firstName} ${employee.lastName}`,
                                  })
                                }
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-transparent">
                          <TableCell className="py-2">
                            AWS Cloud Architecture
                          </TableCell>
                          <TableCell className="py-2">
                            Amazon Web Services
                          </TableCell>
                          <TableCell className="py-2">N/A</TableCell>
                          <TableCell className="py-2">
                            <Badge className="border-0 bg-amber-100 px-2.5 py-0.5 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                              In Progress
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2 text-right">—</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-transparent">
                          <TableCell className="py-2">
                            Leadership Development Program
                          </TableCell>
                          <TableCell className="py-2">
                            Corporate University
                          </TableCell>
                          <TableCell className="py-2">N/A</TableCell>
                          <TableCell className="py-2">
                            <Badge className="border-0 bg-zinc-200 px-2.5 py-0.5 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
                              Not Started
                            </Badge>
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
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="h-7 rounded-md px-2 text-xs"
                        onClick={() =>
                          viewCertificate({
                            title: "AWS Certified Solutions Architect",
                            provider: "Amazon Web Services",
                            id: "AWS-CSA-2023-001234",
                            issued: "06/15/2023",
                            expires: "06/15/2026",
                            owner: `${employee.firstName} ${employee.lastName}`,
                          })
                        }
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        className="h-7 rounded-md px-2 text-xs"
                        onClick={() =>
                          downloadCertificate({
                            title: "AWS Certified Solutions Architect",
                            provider: "Amazon Web Services",
                            id: "AWS-CSA-2023-001234",
                            issued: "06/15/2023",
                            expires: "06/15/2026",
                            owner: `${employee.firstName} ${employee.lastName}`,
                          })
                        }
                      >
                        Export
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Certification Name
                      </div>
                      <div className="font-semibold text-foreground">
                        AWS Certified Solutions Architect
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Certificate ID
                      </div>
                      <div className="font-semibold text-foreground">
                        AWS-CSA-2023-001234
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Issued Organization
                      </div>
                      <div className="font-semibold text-foreground">
                        Amazon Web Services
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Certificate Status
                        </div>
                        <div>
                          <Badge className="inline-flex items-center gap-1 border-0 bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                            <Check className="h-3 w-3" /> Valid
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Issued Date
                      </div>
                      <div className="font-semibold text-foreground">
                        06/15/2023
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Expiry Date
                      </div>
                      <div className="font-semibold text-foreground">
                        06/15/2026
                      </div>
                    </div>
                  </div>
                </div>
                {/* Certificate Viewer */}
                <Dialog
                  open={!!certModal}
                  onOpenChange={(o) => !o && setCertModal(null)}
                >
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{certModal?.title}</DialogTitle>
                    </DialogHeader>
                    {certModal && (
                      <div className="h-[60vh] w-full overflow-hidden rounded-md border">
                        <iframe
                          title="Certificate Preview"
                          className="h-full w-full"
                          srcDoc={buildCertificateHTML(certModal)}
                        />
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
                <Dialog>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold">
                      Performance Metrics & Leave History
                    </h3>
                    <DialogTrigger asChild>
                      <Button className="h-8 rounded-md bg-blue-600 px-3 text-xs text-white hover:bg-blue-700">
                        Manage Leave
                      </Button>
                    </DialogTrigger>
                  </div>
                  <DialogContent className="max-w-5xl rounded-2xl p-6 shadow-xl">
                    <DialogHeader>
                      <DialogTitle>Manage Leave Requests</DialogTitle>
                    </DialogHeader>
                    <div className="overflow-hidden rounded-lg border">
                      <Table className="text-[13px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="py-2 font-bold uppercase">
                              Employee Name
                            </TableHead>
                            <TableHead className="py-2 font-bold uppercase">
                              Leave Type
                            </TableHead>
                            <TableHead className="py-2 font-bold uppercase">
                              Date Filed
                            </TableHead>
                            <TableHead className="py-2 font-bold uppercase">
                              Duration
                            </TableHead>
                            <TableHead className="py-2 font-bold uppercase">
                              Reason
                            </TableHead>
                            <TableHead className="py-2 font-bold uppercase">
                              Status
                            </TableHead>
                            <TableHead className="py-2 text-right font-bold uppercase">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {leaveRequests
                            .filter((r) => r.employeeId === id)
                            .map((r) => (
                              <TableRow
                                key={r.id}
                                className="hover:bg-transparent"
                              >
                                <TableCell className="py-2">
                                  {r.employeeName}
                                </TableCell>
                                <TableCell className="py-2">{r.type}</TableCell>
                                <TableCell className="py-2">
                                  {r.dateFiled}
                                </TableCell>
                                <TableCell className="py-2">
                                  {r.duration}
                                </TableCell>
                                <TableCell className="py-2">
                                  {r.reason}
                                </TableCell>
                                <TableCell className="py-2">
                                  {r.status === "Approved" ? (
                                    <Badge className="border-0 bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                      Approved
                                    </Badge>
                                  ) : r.status === "Declined" ? (
                                    <Badge className="border-0 bg-rose-100 px-2.5 py-0.5 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                                      Declined
                                    </Badge>
                                  ) : (
                                    <Badge className="border-0 bg-amber-100 px-2.5 py-0.5 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                                      Pending
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="py-2 text-right">
                                  <div className="inline-flex items-center gap-2">
                                    <Button
                                      className="h-7 rounded-md bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-700"
                                      onClick={() => setConfirmApprove(r)}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      className="h-7 rounded-md bg-rose-600 px-3 text-xs text-white hover:bg-rose-700"
                                      onClick={() => setConfirmDecline(r)}
                                    >
                                      Decline
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Metrics */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-card p-4 shadow-sm">
                    <div className="text-xs font-semibold text-foreground">
                      Attendance Rate
                    </div>
                    <div className="mt-2 text-sm font-bold">90.9%</div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: "90.9%" }}
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-card p-4 shadow-sm">
                    <div className="text-xs font-semibold text-foreground">
                      Punctuality Rate
                    </div>
                    <div className="mt-2 text-sm font-bold">95.5%</div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-emerald-600"
                        style={{ width: "95.5%" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Leave Balance */}
                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                    <CalendarDays className="h-4 w-4" /> Leave Balance
                  </div>
                  <div className="overflow-hidden rounded-lg border">
                    <Table className="text-[13px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="py-2 font-bold uppercase">Leave Type</TableHead>
                          <TableHead className="py-2 font-bold uppercase">Leave Taken</TableHead>
                          <TableHead className="py-2 font-bold uppercase">Leave Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { type: "Annual Leave", taken: 7, balance: 13 },
                          { type: "Sick Leave", taken: 3, balance: 7 },
                          { type: "Personal Leave", taken: 2, balance: 4 },
                        ].map((x) => (
                          <TableRow key={x.type}>
                            <TableCell className="py-2">{x.type}</TableCell>
                            <TableCell className="py-2">{x.taken}</TableCell>
                            <TableCell className="py-2">{x.balance}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
                          <TableHead className="py-2 font-bold uppercase">
                            Leave Type
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Duration
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Total Days
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Status
                          </TableHead>
                          <TableHead className="py-2 text-right font-bold uppercase">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="hover:bg-transparent">
                          <TableCell className="py-2">Sick Leave</TableCell>
                          <TableCell className="py-2">
                            03-15-2024 – 03-17-2024
                          </TableCell>
                          <TableCell className="py-2">3</TableCell>
                          <TableCell className="py-2">
                            <Badge className="border-0 bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                              Approved
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-2"
                                  aria-label="Actions for sick leave"
                                >
                                  <EllipsisVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                  className="hover:bg-gray-100"
                                  onClick={() =>
                                    setLeaveView({
                                      type: "Sick Leave",
                                      duration: "03-15-2024 – 03-17-2024",
                                      days: 3,
                                      status: "Approved",
                                    })
                                  }
                                >
                                  View Details
                                </DropdownMenuItem>
                                {canDeleteLeave && (
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100"
                                    onClick={() =>
                                      setLeaveConfirm({
                                        type: "Sick Leave",
                                        duration: "03-15-2024 – 03-17-2024",
                                        days: 3,
                                        status: "Approved",
                                      })
                                    }
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-transparent">
                          <TableCell className="py-2">Annual Leave</TableCell>
                          <TableCell className="py-2">
                            01-08-2024 – 01-12-2024
                          </TableCell>
                          <TableCell className="py-2">5</TableCell>
                          <TableCell className="py-2">
                            <Badge className="border-0 bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                              Approved
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-2"
                                  aria-label="Actions for annual leave"
                                >
                                  <EllipsisVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                  className="hover:bg-gray-100"
                                  onClick={() =>
                                    setLeaveView({
                                      type: "Annual Leave",
                                      duration: "01-08-2024 – 01-12-2024",
                                      days: 5,
                                      status: "Approved",
                                    })
                                  }
                                >
                                  View Details
                                </DropdownMenuItem>
                                {canDeleteLeave && (
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100"
                                    onClick={() =>
                                      setLeaveConfirm({
                                        type: "Annual Leave",
                                        duration: "01-08-2024 – 01-12-2024",
                                        days: 5,
                                        status: "Approved",
                                      })
                                    }
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-transparent">
                          <TableCell className="py-2">Personal Leave</TableCell>
                          <TableCell className="py-2">
                            04-22-2024 – 04-22-2024
                          </TableCell>
                          <TableCell className="py-2">1</TableCell>
                          <TableCell className="py-2">
                            <Badge className="border-0 bg-amber-100 px-2.5 py-0.5 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                              Under Review
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-2"
                                  aria-label="Actions for personal leave"
                                >
                                  <EllipsisVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                  className="hover:bg-gray-100"
                                  onClick={() =>
                                    setLeaveView({
                                      type: "Personal Leave",
                                      duration: "04-22-2024 – 04-22-2024",
                                      days: 1,
                                      status: "Under Review",
                                    })
                                  }
                                >
                                  View Details
                                </DropdownMenuItem>
                                {canDeleteLeave && (
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100"
                                    onClick={() =>
                                      setLeaveConfirm({
                                        type: "Personal Leave",
                                        duration: "04-22-2024 – 04-22-2024",
                                        days: 1,
                                        status: "Under Review",
                                      })
                                    }
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-transparent">
                          <TableCell className="py-2">Annual Leave</TableCell>
                          <TableCell className="py-2">
                            05-10-2024 – 05-14-2024
                          </TableCell>
                          <TableCell className="py-2">5</TableCell>
                          <TableCell className="py-2">
                            <Badge className="border-0 bg-rose-100 px-2.5 py-0.5 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                              Rejected
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-2"
                                  aria-label="Actions for annual leave"
                                >
                                  <EllipsisVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                  className="hover:bg-gray-100"
                                  onClick={() =>
                                    setLeaveView({
                                      type: "Annual Leave",
                                      duration: "01-08-2024 – 01-12-2024",
                                      days: 5,
                                      status: "Approved",
                                    })
                                  }
                                >
                                  View Details
                                </DropdownMenuItem>
                                {canDeleteLeave && (
                                  <DropdownMenuItem
                                    className="hover:bg-gray-100"
                                    onClick={() =>
                                      setLeaveConfirm({
                                        type: "Annual Leave",
                                        duration: "01-08-2024 – 01-12-2024",
                                        days: 5,
                                        status: "Approved",
                                      })
                                    }
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Leave Details Modal */}
                <Dialog
                  open={!!leaveView}
                  onOpenChange={(o) => !o && setLeaveView(null)}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Leave Details</DialogTitle>
                    </DialogHeader>
                    {leaveView && (
                      <div className="grid gap-2 text-sm">
                        <div>
                          <span className="font-semibold">Type:</span>{" "}
                          {leaveView.type}
                        </div>
                        <div>
                          <span className="font-semibold">Duration:</span>{" "}
                          {leaveView.duration}
                        </div>
                        <div>
                          <span className="font-semibold">Total Days:</span>{" "}
                          {leaveView.days}
                        </div>
                        <div>
                          <span className="font-semibold">Status:</span>{" "}
                          {leaveView.status}
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

                {/* Delete Confirmation */}
                <AlertDialog
                  open={!!leaveConfirm}
                  onOpenChange={(o) => !o && setLeaveConfirm(null)}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete leave record?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="text-sm text-muted-foreground">
                      Are you sure you want to delete this leave record?
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          leaveConfirm && deleteLeave(leaveConfirm)
                        }
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Approve Confirmation */}
                <AlertDialog
                  open={!!confirmApprove}
                  onOpenChange={(o) => !o && setConfirmApprove(null)}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Approve leave request?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="text-sm text-muted-foreground">
                      Are you sure you want to approve this leave request?
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          confirmApprove &&
                          applyRequestStatus(confirmApprove, "Approved")
                        }
                      >
                        Approve
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Decline Confirmation */}
                <AlertDialog
                  open={!!confirmDecline}
                  onOpenChange={(o) => !o && setConfirmDecline(null)}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Decline leave request?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="text-sm text-muted-foreground">
                      Are you sure you want to decline this leave request?
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          confirmDecline &&
                          applyRequestStatus(confirmDecline, "Declined")
                        }
                      >
                        Decline
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TabsContent>
              <TabsContent value="docs" className="space-y-4">
                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-bold text-foreground">
                      Employee Documents
                    </div>
                    <div className="flex items-center gap-2">
                      <input ref={uploadRef} type="file" className="hidden" multiple onChange={onFilesSelected} accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/*" />
                      <Button onClick={onUploadClick} className="h-8 rounded-md bg-blue-600 px-3 text-xs text-white hover:bg-blue-700">+ Bulk Upload</Button>
                      <Button variant="outline" className="h-8 rounded-md px-3 text-xs" onClick={() => { const selected = docs.filter(d => selectedDocs.has(d.id) && d.url); if (!selected.length) return toast({ title: "No documents selected" }); selected.forEach(downloadDoc); }}>Download Selected</Button>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-[#e5e7eb] shadow-sm">
                    <Table className="text-[13px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="py-2 font-bold uppercase">
                            <input type="checkbox" aria-label="Select all" onChange={(e) => { const all = new Set<string>(); if (e.target.checked) docs.forEach((x) => all.add(x.id)); setSelectedDocs(all); }} />
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Document Title
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            File Type
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            File Size
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Upload Date
                          </TableHead>
                          <TableHead className="py-2 text-right font-bold uppercase">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {docs.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell className="py-2"><input type="checkbox" checked={selectedDocs.has(d.id)} onChange={(e) => { setSelectedDocs((prev) => { const next = new Set(prev); if (e.target.checked) next.add(d.id); else next.delete(d.id); return next; }); }} aria-label={`Select ${d.title}`} /></TableCell>
                            <TableCell className="py-2">{d.title}</TableCell>
                            <TableCell className="py-2">{d.fileType}</TableCell>
                            <TableCell className="py-2">{d.fileSize}</TableCell>
                            <TableCell className="py-2">
                              {d.uploadDate}
                            </TableCell>
                            <TableCell className="py-2 text-right">
                              <div className="inline-flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-2"
                                  aria-label={`View ${d.title}`}
                                  onClick={() => viewDoc(d)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-2"
                                  aria-label={`Download ${d.title}`}
                                  onClick={() => downloadDoc(d)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                  aria-label={`Delete ${d.title}`}
                                  onClick={() => deleteDoc(d)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                {/* Document Preview */}
                <Dialog
                  open={!!docPreview}
                  onOpenChange={(o) => !o && setDocPreview(null)}
                >
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{docPreview?.title}</DialogTitle>
                    </DialogHeader>
                    {docPreview?.url ? (
                      <div className="h-[60vh] w-full overflow-hidden rounded-md border">
                        <iframe
                          title="Document Preview"
                          className="h-full w-full"
                          src={docPreview.url}
                        />
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No preview available.
                      </div>
                    )}
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>
              <TabsContent value="apps" className="space-y-4">
                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                    <CalendarDays className="h-4 w-4" /> Application History
                  </div>
                  <div className="overflow-hidden rounded-lg border border-[#e5e7eb] shadow-sm">
                    <Table className="text-[13px]">
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="py-2 font-bold uppercase">
                            Position
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Department
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Date Applied
                          </TableHead>
                          <TableHead className="py-2 font-bold uppercase">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appHistory.map((a) => (
                          <TableRow key={a.id} className="hover:bg-transparent">
                            <TableCell className="py-2">{a.position}</TableCell>
                            <TableCell className="py-2">
                              {a.department}
                            </TableCell>
                            <TableCell className="py-2">
                              {a.dateApplied}
                            </TableCell>
                            <TableCell className="py-2">
                              {a.status === "Offer" ? (
                                <Badge className="border-0 bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                  Offer
                                </Badge>
                              ) : a.status === "Interview" ? (
                                <Badge className="border-0 bg-sky-100 px-2.5 py-0.5 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
                                  Interview
                                </Badge>
                              ) : a.status === "Under Review" ? (
                                <Badge className="border-0 bg-amber-100 px-2.5 py-0.5 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                                  Under Review
                                </Badge>
                              ) : a.status === "Submitted" ? (
                                <Badge className="border-0 bg-blue-100 px-2.5 py-0.5 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                                  Submitted
                                </Badge>
                              ) : (
                                <Badge className="border-0 bg-rose-100 px-2.5 py-0.5 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                                  Rejected
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
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
                      <div className="text-muted-foreground">
                        Account Active
                      </div>
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
                    <Button
                      variant="outline"
                      className="h-8 rounded-md border-amber-500 px-3 text-xs text-amber-600"
                    >
                      Reset Password
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 rounded-md border-blue-600 px-3 text-xs text-blue-600"
                    >
                      Generate New User ID
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                    <ShieldCheck className="h-4 w-4" /> Current Security Status
                  </div>
                  <div className="grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Account Status
                      </div>
                      <div>
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                          Active
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        HR Access
                      </div>
                      <div className="text-foreground/70">Disabled</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Admin Rights
                      </div>
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

function LabeledInput({
  label,
  defaultValue,
  placeholder,
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <Input defaultValue={defaultValue} placeholder={placeholder ?? label} />
    </div>
  );
}

function LabeledField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="grid gap-0.5">
      <div className="text-xs font-semibold text-foreground">{label}</div>
      <div className="text-sm text-muted-foreground">
        {value && String(value).trim().length ? value : "—"}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm font-semibold text-foreground">{children}</div>
  );
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
            <div className="rounded-md p-2 hover:bg-gray-100">
              <div className="font-medium">Hierarchical View</div>
              <div className="text-xs text-muted-foreground">
                See reporting structure in a top-down hierarchy.
              </div>
            </div>
            <div className="rounded-md p-2 hover:bg-gray-100">
              <div className="font-medium">Chart View</div>
              <div className="text-xs text-muted-foreground">
                Visual chart layout of teams and roles.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SkillLevel({
  level,
}: {
  level: "Expert" | "Advanced" | "Intermediate";
}) {
  const cls =
    level === "Expert"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
      : level === "Advanced"
        ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300";
  return <Badge className={cn("border-0 px-2.5 py-0.5", cls)}>{level}</Badge>;
}
