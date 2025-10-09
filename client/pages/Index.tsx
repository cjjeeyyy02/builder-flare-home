import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/local/tabs";
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
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import {
  CalendarDays,
  EllipsisVertical,
  LayoutGrid,
  Plus,
  Minus,
  Table as TableIcon,
  User,
  ArrowLeftRight,
  FileText,
  Eye,
  Download,
  Share,
  Pencil,
  Trash2,
  Upload,
  ArrowUpDown,
  Building2,
  ChevronLeft,
  ChevronRight,
  Bot,
  Send,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { EMPLOYEES, type Employee } from "@/lib/data/employees";
import AddReportModalTemplate from "@/components/local/AddReportModalTemplate";

type OrgNode = {
  name: string;
  title: string;
  department: string;
  directReports?: number;
  children?: OrgNode[];
};

const ORG_TREE: OrgNode[] = [
  {
    name: "Michael Rodriguez",
    title: "Chief Executive Officer",
    department: "Executive",
    directReports: 4,
    children: [
      {
        name: "Sarah Mitchell",
        title: "Chief Technology Officer",
        department: "Engineering",
        directReports: 3,
        children: [
          { name: "James Rodriguez", title: "Senior Software Engineer", department: "Engineering" },
          { name: "Emily Chen", title: "Lead UX Designer", department: "Engineering" },
          { name: "Marcus Thompson", title: "DevOps Manager", department: "Engineering" },
        ],
      },
    ],
  },
];

const DEPT_SUMMARY = [
  { department: "Design", head: "Ava Thompson", costCenter: "CC-1001", members: 8 },
  { department: "Engineering", head: "Liam Carter", costCenter: "CC-2001", members: 42 },
  { department: "Finance", head: "Olivia Chen", costCenter: "CC-3001", members: 12 },
  { department: "Marketing", head: "Noah Patel", costCenter: "CC-4001", members: 16 },
  { department: "Product", head: "Emma Davis", costCenter: "CC-5001", members: 18 },
];

function OrgListView() {
  const total = 13;
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set(ORG_TREE.map((n) => n.name)));
  const [mode, setMode] = useState<"list" | "chart" | "manage">("list");
  const [orgName, setOrgName] = useState("");
  const [orgDept, setOrgDept] = useState<string>("all");
  const [orgPage, setOrgPage] = useState(0);
  const [zoom, setZoom] = useState<number>(0.8);
  const toggle = (name: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const [addReportOpen, setAddReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ name: string; role: string } | null>(null);

  type DeptRow = { department: string; manager: string; members: number; location: string };
  const [departmentsData, setDepartmentsData] = useState<DeptRow[]>(DEPT_SUMMARY);
  const { toast } = useToast();
  const [deptDialogOpen, setDeptDialogOpen] = useState(false);
  const [editingDeptIndex, setEditingDeptIndex] = useState<number | null>(null);
  const [deptName, setDeptName] = useState("");
  const [deptManager, setDeptManager] = useState("");
  const [deptMembers, setDeptMembers] = useState<number>(0);
  const [deptLocation, setDeptLocation] = useState("");
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);

  function openAddDept() {
    setEditingDeptIndex(null);
    setDeptName("");
    setDeptManager("");
    setDeptMembers(0);
    setDeptLocation("");
    setDeptDialogOpen(true);
  }
  function openEditDept(index: number) {
    const d = departmentsData[index];
    setEditingDeptIndex(index);
    setDeptName(d.department);
    setDeptManager(d.manager);
    setDeptMembers(d.members);
    setDeptLocation(d.location);
    setDeptDialogOpen(true);
  }
  function saveDept() {
    const name = deptName.trim();
    const manager = deptManager.trim();
    const members = Math.max(0, Number.isFinite(deptMembers) ? deptMembers : 0);
    const location = deptLocation.trim();
    if (!name) {
      toast({ title: "Department name required" });
      return;
    }
    const row: DeptRow = { department: name, manager, members, location };
    setDepartmentsData((arr) => {
      if (editingDeptIndex === null) return [...arr, row];
      const next = [...arr];
      next[editingDeptIndex] = row;
      return next;
    });
    setDeptDialogOpen(false);
  }
  function deleteDept() {
    if (confirmDeleteIndex === null) return;
    setDepartmentsData((arr) => arr.filter((_, i) => i !== confirmDeleteIndex));
    setConfirmDeleteIndex(null);
    toast({ title: "Department deleted" });
  }

  const renderRows = (node: OrgNode, depth: number): React.ReactNode[] => {
    const hasChildren = !!node.children?.length;
    const isCollapsed = collapsed.has(node.name);
    const rows: React.ReactNode[] = [];
    const q = orgName.toLowerCase().trim();
    const matchesQuery = !q || node.name.toLowerCase().includes(q) || node.title.toLowerCase().includes(q);
    const matchesDept = orgDept === "all" || node.department.toLowerCase() === orgDept;
    if (matchesQuery && matchesDept) {
      rows.push(
        <TableRow key={node.name}>
          <TableCell className="py-2 text-sm">
            <div className="flex items-center gap-2" style={{ marginLeft: depth * 16 }}>
              {hasChildren && (
                <button
                  type="button"
                  aria-label={isCollapsed ? "Expand direct reports" : "Collapse direct reports"}
                  onClick={() => toggle(node.name)}
                  className="flex h-5 w-5 items-center justify-center rounded border text-[10px] text-muted-foreground hover:bg-accent"
                >
                  {isCollapsed ? ">" : "˅"}
                </button>
              )}
              <span className="font-medium text-foreground">{node.name}</span>
            </div>
          </TableCell>
          <TableCell className="py-2 text-xs text-muted-foreground">{node.title}</TableCell>
          <TableCell className="py-2 text-xs">{node.department}</TableCell>
          <TableCell className="py-2 text-xs">{typeof node.directReports === "number" ? node.directReports : node.children?.length ?? 0}</TableCell>
          <TableCell className="py-2 text-right">
            <div className="flex items-center justify-end gap-2">
              <Button type="button" onClick={() => setMode("chart")} className="h-7 rounded-md px-2 text-xs bg-brand text-brand-foreground hover:bg-brand/90">View Chart</Button>
              <Button type="button" onClick={() => { setReportTarget({ name: node.name, role: node.title }); setAddReportOpen(true); }} className="h-7 rounded-md px-2 text-xs bg-emerald-600 text-white hover:bg-emerald-700">Add Report</Button>
            </div>
          </TableCell>
        </TableRow>,
      );
    }
    if (hasChildren && !isCollapsed) {
      node.children?.forEach((child) => {
        rows.push(...renderRows(child, depth + 1));
      });
    }
    return rows;
  };

  const deptColor = (d: string) =>
    d === "Executive"
      ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
      : d === "Engineering"
        ? "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300"
        : d === "Finance"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
          : d === "Marketing"
            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
            : d === "Human Resources"
              ? "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-300"
              : "bg-muted text-foreground";

  useEffect(() => { setOrgPage(0); }, [orgName, orgDept]);


  const ChartNode = ({ node }: { node: OrgNode }) => {
    const hasChildren = !!node.children?.length;
    const isCollapsed = collapsed.has(node.name);
    const initials = node.name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("");
    return (
      <div className="flex flex-col items-center">
        <div className="rounded-xl border bg-card px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            {hasChildren && (
              <button
                type="button"
                aria-label={isCollapsed ? "Expand direct reports" : "Collapse direct reports"}
                onClick={() => toggle(node.name)}
                className="flex h-5 w-5 items-center justify-center rounded border text-[10px] text-muted-foreground hover:bg-accent"
              >
                {isCollapsed ? ">" : "˅"}
              </button>
            )}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
              {initials}
            </div>
            <div className="leading-tight">
              <div className="text-xs font-semibold text-foreground">{node.name}</div>
              <div className="text-[11px] text-muted-foreground">{node.title}</div>
            </div>
          </div>
          <div className={cn("mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium", deptColor(node.department))}>{node.department}</div>
        </div>
        {hasChildren && !isCollapsed && (
          <>
            <div className="my-3 h-px w-24 bg-border" />
            <div className="flex flex-wrap items-start justify-center gap-6">
              {node.children!.map((child) => (
                <div key={child.name} className="flex flex-col items-center">
                  <div className="h-4 w-px bg-border" />
                  <ChartNode node={child} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center gap-3", mode === "manage" && "font-poppins")}>
          {mode === "manage" && (
            <Button type="button" variant="outline" onClick={() => setMode("list")} className="h-8 rounded-lg px-4 text-xs font-medium bg-white text-[#111827] border border-[#d1d5db] hover:bg-gray-50">
              ← Back
            </Button>
          )}
          <h3 className={cn("text-sm font-bold", mode === "manage" && "font-poppins")}>{mode === "list" ? "List View" : mode === "chart" ? "Chart View" : "Manage Department"}</h3>
        </div>
        {mode === "manage" ? null : (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Button type="button" onClick={() => setMode("manage")} className="h-8 rounded-lg px-4 text-xs font-medium bg-[#2563eb] text-white hover:bg-[#1e40af]">
              <Building2 className="mr-1.5 h-4 w-4" /> Manage Department
            </Button>
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                aria-label="List view"
                onClick={() => setMode("list")}
                className={cn("flex h-7 w-7 items-center justify-center rounded-md border", mode === "list" ? "bg-foreground text-background" : "text-foreground hover:bg-accent")}
              >
                <TableIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Chart view"
                onClick={() => setMode("chart")}
                className={cn("flex h-7 w-7 items-center justify-center rounded-md border", mode === "chart" ? "bg-foreground text-background" : "text-foreground hover:bg-accent")}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
            <span className="ml-2">{total} employees</span>
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
                className="flex h-7 w-7 items-center justify-center rounded-md border text-foreground hover:bg-accent"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.1).toFixed(2)))}
                className="flex h-7 w-7 items-center justify-center rounded-md border text-foreground hover:bg-accent"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      {mode === "manage" ? (
        <div className="mt-2 font-poppins">
          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <div className="font-poppins text-[16px] font-semibold">Departments List</div>
              <Button type="button" onClick={openAddDept} className="h-8 rounded-lg px-4 text-xs font-medium bg-[#2563eb] text-white hover:bg-[#1e40af]">
                <Plus className="mr-1.5 h-4 w-4" /> Add Department
              </Button>
              <Dialog open={deptDialogOpen} onOpenChange={setDeptDialogOpen}>
                <DialogContent className="font-poppins">
                  <DialogHeader>
                    <DialogTitle className="font-poppins text-base font-semibold">{editingDeptIndex === null ? "Add Department" : "Edit Department"}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-3 py-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="dept-name" className="font-poppins text-sm">Department Name</Label>
                      <Input id="dept-name" placeholder="Enter department name" value={deptName} onChange={(e) => setDeptName(e.target.value)} />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="dept-manager" className="font-poppins text-sm">Manager</Label>
                      <Input id="dept-manager" placeholder="Enter manager name" value={deptManager} onChange={(e) => setDeptManager(e.target.value)} />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="dept-members" className="font-poppins text-sm">Team Members</Label>
                      <Input id="dept-members" type="number" min={0} placeholder="Number of team members" value={String(deptMembers)} onChange={(e) => setDeptMembers(parseInt(e.target.value || "0", 10))} />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="dept-location" className="font-poppins text-sm">Location</Label>
                      <Input id="dept-location" placeholder="Enter location" value={deptLocation} onChange={(e) => setDeptLocation(e.target.value)} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" className="rounded-md bg-white text-[#111827] border border-[#d1d5db]" onClick={() => setDeptDialogOpen(false)}>Cancel</Button>
                    <Button type="button" className="rounded-md bg-[#2563eb] text-white hover:bg-[#1e40af]" onClick={saveDept}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="px-3 py-2 text-xs font-medium">Department</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-medium">Manager</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-medium">Team Members</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-medium">Location</TableHead>
                  <TableHead className="px-3 py-2 text-right text-xs font-medium">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentsData.map((d, i) => (
                  <TableRow key={d.department + i} className="border-b last:border-0 hover:bg-transparent">
                    <TableCell className="px-3 py-2">{d.department}</TableCell>
                    <TableCell className="px-3 py-2">{d.manager}</TableCell>
                    <TableCell className="px-3 py-2">{d.members}</TableCell>
                    <TableCell className="px-3 py-2">{d.location}</TableCell>
                    <TableCell className="px-3 py-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button type="button" aria-label="Edit department" onClick={() => openEditDept(i)} className="h-7 rounded-md px-3 text-xs bg-white text-[#111827] border border-[#d1d5db] hover:bg-gray-50">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button type="button" aria-label="Delete department" onClick={() => setConfirmDeleteIndex(i)} className="h-7 rounded-md px-3 text-xs bg-white text-[#111827] border border-[#d1d5db] hover:bg-gray-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <AlertDialog open={confirmDeleteIndex !== null} onOpenChange={(o) => !o && setConfirmDeleteIndex(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete department?</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="text-sm text-muted-foreground">This action cannot be undone. This will permanently remove the department.</div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteDept}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : mode === "list" ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Search by name or position" className="h-8 w-56 text-xs" />
            <Select value={orgDept} onValueChange={setOrgDept}>
              <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="All Departments" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {(() => { const set = new Set<string>(); const walk = (n: OrgNode) => { set.add(n.department.toLowerCase()); n.children?.forEach(walk); }; ORG_TREE.forEach(walk); return Array.from(set).map((d) => (<SelectItem key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</SelectItem>)); })()}
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-hidden rounded-lg border">
            {(() => { const rows = ORG_TREE.flatMap((node)=> renderRows(node, 0)); const pageSize = 10; const totalPages = Math.max(1, Math.ceil(rows.length / pageSize)); const start = Math.min(orgPage*pageSize, Math.max(0, rows.length - (rows.length % pageSize || pageSize))); const end = Math.min(start + pageSize, rows.length); return (
            <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-9 px-3 text-xs">Name</TableHead>
                  <TableHead className="h-9 px-3 text-xs">Position</TableHead>
                  <TableHead className="h-9 px-3 text-xs">Department</TableHead>
                  <TableHead className="h-9 px-3 text-xs">Reporting Staff</TableHead>
                  <TableHead className="h-9 px-3 text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(start, end)}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end gap-2 border-t px-2 py-2 text-xs">
              <span className="text-muted-foreground">{start + 1}-{end} of {rows.length}</span>
              <Button
                variant="outline"
                className="h-7 w-7 rounded-md p-0"
                onClick={() => setOrgPage((p) => Math.max(0, p - 1))}
                disabled={orgPage === 0}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-7 w-7 rounded-md p-0"
                onClick={() => setOrgPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={orgPage >= totalPages - 1}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            </>
            ); })()}
          </div>
        </div>
      ) : (
        <div className="mt-2 origin-top" style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
          {ORG_TREE.map((node) => (
            <div key={node.name} className="mb-6 flex justify-center">
              <ChartNode node={node} />
            </div>
          ))}
        </div>
      )}

      {reportTarget && (
        <AddReportModalTemplate
          open={addReportOpen}
          onOpenChange={setAddReportOpen}
          managerName={reportTarget.name}
          managerRole={reportTarget.role}
          onAdd={() => {}}
        />
      )}
    </div>
  );
}


export default function Index() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [view, setView] = useState<"table" | "card">("table");
  const [tab, setTab] = useState<string>("records");

  // Role-based permissions (admin | hr | employee)
  const currentRole: "admin" | "hr" | "employee" = "admin";

  // Document Center state
  const [dcSearch, setDcSearch] = useState("");
  const [dcDept, setDcDept] = useState<string>("all");
  const [dcDocType, setDcDocType] = useState<string>("all");
  const [dcDateFilter, setDcDateFilter] = useState<string>("any");
  const [dcCategory2, setDcCategory2] = useState<string>("employee");
  const [sortKey, setSortKey] = useState<keyof Doc>("uploadDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

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

  // Pagination for Employee Records table
  const pageSize = 10;
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = Math.min(page * pageSize, Math.max(0, filtered.length - (filtered.length % pageSize || pageSize)));
  const end = Math.min(start + pageSize, filtered.length);
  const pageItems = filtered.slice(start, end);
  useEffect(() => {
    setPage(0);
  }, [search, position, status]);

  // Document Center data and helpers
  type Doc = {
    id: string;
    title: string;
    employeeName: string;
    department: string;
    type: string;
    category: string;
    uploadDate: string; // DD/MM/YYYY
    expirationDate?: string; // DD/MM/YYYY
    uploadedBy: string;
  };

  const docColumns: { key: keyof Doc; label: string }[] = [
    { key: "title", label: "Document Title" },
    { key: "employeeName", label: "Employee Name" },
    { key: "department", label: "Department" },
    { key: "type", label: "Document Type" },
    { key: "uploadDate", label: "Upload Date" },
    { key: "expirationDate", label: "Expiration Date" },
    { key: "uploadedBy", label: "Uploaded By" },
  ];

  const docCategories = [
    { value: "employee", label: "Employee Records" },
    { value: "policies", label: "Policies" },
    { value: "compliance", label: "Compliance" },
    { value: "training", label: "Training" },
    { value: "forms", label: "Forms & Templates" },
  ];

  const docTypes = ["PDF", "Word", "Excel", "Image"];
  const departments = Array.from(new Set(EMPLOYEES.map((e) => e.department)));

  // Derive simple skills from role keywords (for table tag display)
  function getSkills(e: Employee): string[] {
    const s = new Set<string>();
    const r = e.role.toLowerCase();
    if (r.includes("engineer")) s.add("Engineering");
    if (r.includes("software")) s.add("Software");
    if (r.includes("devops")) s.add("DevOps");
    if (r.includes("qa")) s.add("QA");
    if (r.includes("product")) s.add("Product");
    if (r.includes("design")) s.add("Design");
    if (r.includes("analyst")) s.add("Analysis");
    if (r.includes("hr")) s.add("HR");
    return Array.from(s);
  }

  // Skill profile used by AI search and recommendations
  const SKILL_ALIASES: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    reactjs: "react",
    nodejs: "node",
    k8s: "kubernetes",
    kubernetes: "kubernetes",
    docker: "docker",
    terraform: "terraform",
    cicd: "ci/cd",
    ci: "ci/cd",
    aws: "aws",
    "amazon web services": "aws",
    sql: "sql",
    python: "python",
    tableau: "tableau",
    excel: "excel",
    analytics: "analytics",
    qa: "qa",
    testing: "testing",
    automation: "automation",
    cypress: "cypress",
    selenium: "selenium",
    ux: "ux",
    ui: "ui",
    figma: "figma",
    design: "design",
    product: "product",
    agile: "agile",
    scrum: "scrum",
    roadmap: "roadmap",
    jira: "jira",
    hr: "hr",
    recruiting: "recruiting",
    onboarding: "onboarding",
    payroll: "payroll",
    devops: "devops",
    "power bi": "power bi",
  };

  function normalizeSkill(token: string): string | null {
    const t = token.trim().toLowerCase();
    if (!t) return null;
    if (SKILL_ALIASES[t]) return SKILL_ALIASES[t];
    return t;
  }

  function getSkillProfile(e: Employee): string[] {
    const r = e.role.toLowerCase();
    const skills = new Set<string>();
    // Base by department
    if (e.department.toLowerCase() === "engineering") {
      ["javascript","typescript","react","node","aws","docker","kubernetes","ci/cd"].forEach((k) => skills.add(k));
    }
    // Role specific
    if (r.includes("devops")) {
      ["aws","docker","kubernetes","terraform","ci/cd","linux","cloud"].forEach((k) => skills.add(k));
    }
    if (r.includes("qa")) {
      ["qa","testing","automation","cypress","selenium","javascript","typescript"].forEach((k) => skills.add(k));
    }
    if (r.includes("software") || r.includes("engineer")) {
      ["javascript","typescript","react","node","testing","git"].forEach((k) => skills.add(k));
    }
    if (r.includes("designer")) {
      ["design","figma","ux","ui","prototyping","research"].forEach((k) => skills.add(k));
    }
    if (r.includes("analyst")) {
      ["sql","python","tableau","excel","analytics"].forEach((k) => skills.add(k));
    }
    if (r.includes("product")) {
      ["product","agile","scrum","roadmap","jira"].forEach((k) => skills.add(k));
    }
    if (r.includes("hr")) {
      ["hr","recruiting","onboarding","payroll"].forEach((k) => skills.add(k));
    }
    return Array.from(skills);
  }

  function scoreCandidate(e: Employee, querySkills: string[]): { score: number; matches: string[] } {
    const prof = new Set(getSkillProfile(e).map((s) => s.toLowerCase()));
    const matches = querySkills.filter((q) => prof.has(q));
    if (!matches.length) return { score: 0, matches: [] };
    const years = getYearsExperience(e);
    const seniority = /senior|lead|manager/i.test(e.role) ? 1 : 0;
    const score = matches.length * 3 + years * 0.2 + seniority * 1.5;
    return { score, matches };
  }
  function getYearsExperience(e: Employee): number {
    const parts = e.joiningDate.split("-"); // MM-DD-YYYY
    if (parts.length !== 3) return 0;
    const [mm, dd, yyyy] = parts.map((p) => parseInt(p, 10));
    const start = new Date(yyyy, (mm || 1) - 1, dd || 1).getTime();
    const now = Date.now();
    const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, Math.floor(years));
  }

  // AI Assistant state and simple HR-aware responder
  type ChatMessage = { role: "user" | "assistant"; content: string };
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMsgs, setAiMsgs] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! Try: who knows AWS, React, or TypeScript? I'll list matches with years and recommend top candidates." },
  ]);

  function getAssistantReply(q: string): string {
    const raw = q.trim();
    const text = raw.toLowerCase();
    if (!text) return "Please type a question.";

    // Skills-based search and recommendations
    const tokens = text.split(/[^a-zA-Z0-9+/]+/).map(normalizeSkill).filter(Boolean) as string[];
    const skills = Array.from(new Set(tokens)).filter((t) => Object.values(SKILL_ALIASES).includes(t) || t.length > 2);
    if (skills.length) {
      const scored = EMPLOYEES.map((e) => ({ e, ...scoreCandidate(e, skills) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score || getYearsExperience(b.e) - getYearsExperience(a.e));
      if (!scored.length) return `No employees found for skills: ${skills.join(", ")}.`;
      const top = scored.slice(0, 3);
      const topLines = top.map((x, i) => `${i + 1}. ${x.e.firstName} ${x.e.lastName} – ${x.e.role}, ${x.e.department} • ${getYearsExperience(x.e)} yrs • Matches: ${x.matches.join(", ")}`);
      const allLines = scored.map((x) => `• ${x.e.firstName} ${x.e.lastName} – ${x.e.role}, ${x.e.department} • ${getYearsExperience(x.e)} yrs • Matches: ${x.matches.join(", ")}`);
      return `Top candidates:\n${topLines.join("\n")}\n\nAll matches:\n${allLines.join("\n")}`;
    }

    // Legacy quick answers retained
    if (text.includes("active")) return `Active employees: ${totalActive}`;
    if (text.includes("on leave") || text.includes("leave")) return `On leave: ${onLeave}`;
    if (text.includes("new hire") || text.includes("new hires")) return `New hires this month: ${newHiresThisMonth}`;
    if (text.includes("offboard") || text.includes("exit")) return `Pending offboarding: ${pendingOffboarding}`;
    const deptMatch = departments.find((d) => text.includes(d.toLowerCase()));
    if (deptMatch) {
      const count = EMPLOYEES.filter((e) => e.department.toLowerCase() === deptMatch.toLowerCase()).length;
      return `${deptMatch} headcount: ${count}`;
    }
    const byName = EMPLOYEES.find((e) => `${e.firstName} ${e.lastName}`.toLowerCase().includes(text));
    if (byName) return `${byName.firstName} ${byName.lastName} – ${byName.role}, ${byName.department}. Status: ${byName.status}.`;
    return "Try asking: 'show engineers with React and TypeScript' or 'who knows AWS?'";
  }

  function sendAi() {
    const query = aiInput;
    if (!query.trim()) return;
    const reply = getAssistantReply(query);
    setAiMsgs((m) => [...m, { role: "user", content: query }, { role: "assistant", content: reply }]);
    setAiInput("");
  }

  const DOCS: Doc[] = [
    {
      id: "d1",
      title: "Employment Contract - Sarah Mitchell",
      employeeName: "Sarah Mitchell",
      department: "Engineering",
      type: "PDF",
      category: "employee",
      uploadDate: "10/01/2023",
      expirationDate: "10/01/2026",
      uploadedBy: "HR Admin",
    },
    {
      id: "d2",
      title: "Data Privacy Policy",
      employeeName: "—",
      department: "Legal",
      type: "PDF",
      category: "policies",
      uploadDate: "22/08/2023",
      expirationDate: undefined,
      uploadedBy: "Compliance",
    },
    {
      id: "d3",
      title: "Compliance Report Q4 2023",
      employeeName: "—",
      department: "Finance",
      type: "Excel",
      category: "compliance",
      uploadDate: "28/12/2023",
      expirationDate: "28/12/2024",
      uploadedBy: "Finance Ops",
    },
    {
      id: "d4",
      title: "Safety Training Certificate - Marcus Thompson",
      employeeName: "Marcus Thompson",
      department: "Engineering",
      type: "PDF",
      category: "training",
      uploadDate: "20/11/2023",
      expirationDate: "20/11/2025",
      uploadedBy: "Training Team",
    },
    {
      id: "d5",
      title: "Performance Review Template 2024",
      employeeName: "—",
      department: "Human Resources",
      type: "Word",
      category: "forms",
      uploadDate: "08/01/2024",
      expirationDate: undefined,
      uploadedBy: "HR Admin",
    },
    {
      id: "d6",
      title: "Benefits Enrollment Form",
      employeeName: "Elena Garcia",
      department: "Human Resources",
      type: "PDF",
      category: "employee",
      uploadDate: "05/01/2024",
      expirationDate: "05/01/2025",
      uploadedBy: "HR Admin",
    },
  ];

  function parseDMY(input?: string): Date | null {
    if (!input) return null;
    const parts = input.split("/");
    if (parts.length !== 3) return null;
    const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
    if (!dd || !mm || !yyyy) return null;
    return new Date(yyyy, mm - 1, dd);
  }

  function daysUntil(dateStr?: string): number | null {
    const d = parseDMY(dateStr);
    if (!d) return null;
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  const filteredDocs = useMemo(() => {
    return DOCS.filter((d) => {
      const matchesSearch = !dcSearch.trim() || d.title.toLowerCase().includes(dcSearch.toLowerCase());
      const matchesDept = dcDept === "all" || d.department.toLowerCase() === dcDept;
      const matchesType = dcDocType === "all" || d.type.toLowerCase() === dcDocType;
      const matchesCat = dcCategory2 === d.category;
      const days = dcDateFilter === "any" ? null : daysUntil(d.uploadDate);
      const matchesDate =
        dcDateFilter === "any" || (typeof days === "number" && days >= 0 && days <= parseInt(dcDateFilter, 10));
      return matchesSearch && matchesDept && matchesType && matchesCat && matchesDate;
    });
  }, [DOCS, dcSearch, dcDept, dcDocType, dcCategory2, dcDateFilter]);

  const sortedDocs = useMemo(() => {
    const arr = [...filteredDocs];
    arr.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "uploadDate" || sortKey === "expirationDate") {
        const da = parseDMY(a[sortKey] as string | undefined)?.getTime() ?? 0;
        const db = parseDMY(b[sortKey] as string | undefined)?.getTime() ?? 0;
        return (da - db) * dir;
      }
      const va = String(a[sortKey] ?? "").toLowerCase();
      const vb = String(b[sortKey] ?? "").toLowerCase();
      return va < vb ? -1 * dir : va > vb ? 1 * dir : 0;
    });
    return arr;
  }, [filteredDocs, sortKey, sortDir]);

  function handleSort(key: keyof Doc) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  useEffect(() => {
    if (tab !== "docs") return;
    const soon = DOCS.filter((d) => {
      const n = daysUntil(d.expirationDate);
      return typeof n === "number" && n <= 30 && n >= 0;
    });
    if (soon.length) {
      toast({
        title: "Expiring documents",
        description: `${soon.length} document(s) will expire within 30 days.`,
      });
    }
  }, [tab]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-4">
          <h2 className="text-2xl font-bold text-foreground">Employee Records</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Centralized employee records management and organizational tools
          </p>
        </header>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          {/* Mobile dropdown */}
          <div className="sm:hidden">
            <Select value={tab} onValueChange={setTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="records">Employee Records</SelectItem>
                <SelectItem value="org">Organization Chart</SelectItem>
                <SelectItem value="docs">Document Center</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Desktop single-row tabs */}
          <TabsList className="hidden sm:block w-full">
            <div className="flex flex-nowrap items-center gap-2">
              <TabsTrigger
                value="records"
                className={cn(
                  "flex-1 rounded-[12px] px-4 py-2 text-sm transition-colors",
                  "data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white data-[state=active]:font-bold",
                  "data-[state=inactive]:bg-transparent data-[state=inactive]:text-black data-[state=inactive]:font-medium data-[state=inactive]:hover:bg-[#E0F2FE]",
                )}
              >
                Employee Records
              </TabsTrigger>
              <TabsTrigger
                value="org"
                className={cn(
                  "flex-1 rounded-[12px] px-4 py-2 text-sm transition-colors",
                  "data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white data-[state=active]:font-bold",
                  "data-[state=inactive]:bg-transparent data-[state=inactive]:text-black data-[state=inactive]:font-medium data-[state=inactive]:hover:bg-[#E0F2FE]",
                )}
              >
                Organization Chart
              </TabsTrigger>
              <TabsTrigger
                value="docs"
                className={cn(
                  "flex-1 rounded-[12px] px-4 py-2 text-sm transition-colors",
                  "data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white data-[state=active]:font-bold",
                  "data-[state=inactive]:bg-transparent data-[state=inactive]:text-black data-[state=inactive]:font-medium data-[state=inactive]:hover:bg-[#E0F2FE]",
                )}
              >
                Document Center
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="records" className="mt-5">
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Total Active Employee" value={totalActive} icon={<User className="h-5 w-5" />} />
              <MetricCard label="New Hires This Month" value={newHiresThisMonth} icon={<Plus className="h-5 w-5" />} />
              <MetricCard label="Pending Offboarding" value={pendingOffboarding} icon={<ArrowLeftRight className="h-5 w-5" />} />
              <MetricCard label="On Leave" value={onLeave} icon={<CalendarDays className="h-5 w-5" />} />
            </section>

            <section className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full flex-1 items-center gap-2">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, position, status"
                  className="h-8 text-xs max-w-md"
                />
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger className="h-8 w-32 text-xs">
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
                  <SelectTrigger className="h-8 w-28 text-xs">
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

              <div className="flex items-center gap-3 self-end">
                <div className="flex items-center gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button type="button" className="h-8 rounded-md px-3 text-xs bg-[#2563eb] text-white hover:bg-[#1d4ed8]">
                        <Plus className="mr-1.5 h-4 w-4" /> Add Employee
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl p-6 shadow-xl">
                      <DialogHeader>
                        <DialogTitle>Add Employee</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-3 text-sm">
                        <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
                          <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold" htmlFor="emp-first">First Name</Label>
                            <Input id="emp-first" placeholder="First name" required />
                          </div>
                          <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold" htmlFor="emp-last">Last Name</Label>
                            <Input id="emp-last" placeholder="Last name" required />
                          </div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs font-semibold" htmlFor="emp-email">Email</Label>
                          <Input id="emp-email" type="email" placeholder="email@company.com" required />
                        </div>
                        <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
                          <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold" htmlFor="emp-role">Role / Position</Label>
                            <Input id="emp-role" placeholder="e.g., Software Engineer" />
                          </div>
                          <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold">Department</Label>
                            <Select>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((d) => (
                                  <SelectItem key={d} value={d.toLowerCase()}>{d}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
                          <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold">Status</Label>
                            <Select>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="on leave">On Leave</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold" htmlFor="emp-join">Joining Date</Label>
                            <Input id="emp-join" type="date" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" className="rounded-md border px-4">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button className="rounded-md bg-[#2563eb] px-4 text-white hover:bg-[#1d4ed8]" onClick={() => toast({ title: "Employee added", description: "New employee has been added." })}>Save</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button type="button" variant="outline" className="h-8 rounded-md px-3 text-xs bg-white text-[#374151] border border-[#d1d5db] hover:bg-gray-50">
                    <Download className="mr-1.5 h-4 w-4" /> Export
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className={cn(
                    "h-8 w-8 rounded-md p-0",
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
                    "h-8 w-8 rounded-md p-0",
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
                  <Table className="text-xs leading-tight">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">Employee ID</TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">Name</TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">Position</TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">Department</TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">Skills</TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">Status</TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">Joining Date</TableHead>
                        <TableHead className="px-2 py-1 text-center text-xs font-semibold uppercase leading-tight">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageItems.map((e, idx) => (
                        <TableRow
                          key={e.id}
                          className={cn("hover:bg-transparent")}
                        >
                          <TableCell className="px-2 py-1 text-xs leading-tight font-medium text-foreground/90">
                            {e.id}
                          </TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1E4DD8] text-white font-semibold text-[10px]">
                                {(e.firstName?.[0] || "").toUpperCase()}{(e.lastName?.[0] || "").toUpperCase()}
                              </div>
                              <span className="text-xs font-semibold text-foreground">
                                {e.firstName} {e.lastName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">{e.role}</TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">{e.department}</TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">
                            {(() => {
                              const skills = getSkills(e);
                              if (!skills.length) return <span className="text-muted-foreground">—</span>;
                              const shown = skills.slice(0, 2);
                              const display = `${shown.join(", ")}${skills.length > 2 ? ", ..." : ""}`;
                              const full = `${skills.join(", ")}`;
                              const years = getYearsExperience(e);
                              return (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="cursor-help">{display}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="max-w-xs text-xs">
                                        <div className="font-semibold">Skills</div>
                                        <div className="text-foreground/80">{full}</div>
                                        <div className="mt-1 text-foreground/80">Experience: {years} {years === 1 ? "year" : "years"}</div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })()}
                          </TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">{e.status}</TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">{e.joiningDate}</TableCell>
                          <TableCell className="px-2 py-1 text-center text-xs leading-tight">
                            <RowActions employee={e} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-end gap-2 border-t px-2 py-2 text-xs">
                    <span className="text-muted-foreground">{start + 1}-{end} of {filtered.length}</span>
                    <Button
                      variant="outline"
                      className="h-7 w-7 rounded-md p-0"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-7 w-7 rounded-md p-0"
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </section>
            ) : (
              <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((e) => (
                  <div key={e.id} className="bg-white rounded-[12px] py-4 px-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E4DD8] text-white font-semibold text-[14px]">
                          {(e.firstName?.[0] || "").toUpperCase()}{(e.lastName?.[0] || "").toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-[16px] font-bold text-[#1A1A1A]">{e.firstName} {e.lastName}</div>
                            <span className="rounded-[8px] bg-[#F0F4FF] px-2 py-[2px] text-[#3B5BDB] text-[12px] font-medium">{e.status}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">ID: {e.id}</div>
                        </div>
                      </div>
                      <RowActions employee={e} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="truncate text-muted-foreground">{e.role}</div>
                      <div className="truncate text-muted-foreground">{e.department}</div>
                      <div className="text-muted-foreground">{e.joiningDate}</div>
                      <div className="col-span-2">
                        {(() => {
                          const skills = getSkills(e);
                          if (!skills.length) return <span className="text-xs text-muted-foreground">Skills: —</span>;
                          const shown = skills.slice(0, 3);
                          return (
                            <div className="flex flex-wrap items-center gap-1 text-[11px]">
                              <span className="text-muted-foreground">Skills:</span>
                              {shown.map((s) => (
                                <Badge key={s} variant="secondary" className="px-1.5 py-0 text-[10px]">{s}</Badge>
                              ))}
                              {skills.length > 3 && (
                                <span className="text-muted-foreground">+{skills.length - 3} more</span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </TabsContent>

          <TabsContent value="org" className="mt-6">
            <OrgListView />
          </TabsContent>
          <TabsContent value="docs" className="mt-6">
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold">Document Center</h3>
                <div className="flex items-center gap-2">
                  <Input
                    value={dcSearch}
                    onChange={(e) => setDcSearch(e.target.value)}
                    placeholder="Search documents..."
                    className="h-8 w-56 text-xs"
                  />
                  {(currentRole === "admin" || currentRole === "hr") ? (
                    <label className="inline-flex items-center">
                      <input
                        type="file"
                        className="hidden"
                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/*"
                        onChange={() => toast({ title: "Upload started", description: "Your document is uploading." })}
                      />
                      <Button type="button" className="h-8 gap-1 px-2 text-xs">
                        <Upload className="h-4 w-4" /> Upload Document
                      </Button>
                    </label>
                  ) : (
                    <label className="inline-flex items-center">
                      <input
                        type="file"
                        className="hidden"
                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/*"
                        onChange={() => toast({ title: "Upload started", description: "Uploading your document." })}
                      />
                      <Button type="button" className="h-8 gap-1 px-2 text-xs">
                        <Upload className="h-4 w-4" /> Upload My Document
                      </Button>
                    </label>
                  )}
                </div>
              </div>

              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  {docCategories.map((c) => (
                    <Button
                      key={c.value}
                      variant={dcCategory2 === c.value ? "default" : "outline"}
                      className={cn("h-7 px-2 text-xs", dcCategory2 === c.value ? "bg-brand text-brand-foreground border-transparent" : "")}
                      onClick={() => setDcCategory2(c.value)}
                    >
                      {c.label}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={dcDept} onValueChange={setDcDept}>
                    <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="All Departments" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((d) => (
                        <SelectItem key={d} value={d.toLowerCase()}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={dcDocType} onValueChange={setDcDocType}>
                    <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="All Types" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {docTypes.map((t) => (
                        <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={dcDateFilter} onValueChange={setDcDateFilter}>
                    <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Date" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Date</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                      <SelectItem value="365">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border">
                <Table className="text-xs leading-tight">
                  <TableHeader>
                    <TableRow>
                      {docColumns.map((col) => (
                        <TableHead key={col.key as string} className="px-2 py-1 text-xs font-semibold uppercase leading-tight">
                          <button className="inline-flex items-center gap-1" onClick={() => handleSort(col.key)}>
                            <span>{col.label}</span>
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
                          </button>
                        </TableHead>
                      ))}
                      <TableHead className="px-2 py-1 text-right text-xs font-semibold uppercase leading-tight">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedDocs.map((d) => (
                      <TableRow key={d.id} className="hover:bg-transparent">
                        <TableCell className="px-2 py-1 text-xs leading-tight">{d.title}</TableCell>
                        <TableCell className="px-2 py-1 text-xs leading-tight">{d.employeeName}</TableCell>
                        <TableCell className="px-2 py-1 text-xs leading-tight">{d.department}</TableCell>
                        <TableCell className="px-2 py-1 text-xs leading-tight">{d.type}</TableCell>
                        <TableCell className="px-2 py-1 text-xs leading-tight">{d.uploadDate}</TableCell>
                        <TableCell className="px-2 py-1 text-xs leading-tight">{d.expirationDate ?? "—"}</TableCell>
                        <TableCell className="px-2 py-1 text-xs leading-tight">{d.uploadedBy}</TableCell>
                        <TableCell className="px-2 py-1 text-right text-xs leading-tight">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" className="h-7 w-7 p-0" aria-label="View"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" className="h-7 w-7 p-0" aria-label="Download"><Download className="h-4 w-4" /></Button>
                            {(currentRole === "admin" || currentRole === "hr") && (
                              <Button variant="ghost" className="h-7 w-7 p-0" aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Floating AI Assistant */}
        <button
          type="button"
          aria-label="Open AI Assistant"
          onClick={() => setAiOpen((v) => !v)}
          className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-lg hover:bg-[#1d4ed8]"
        >
          <Bot className="h-6 w-6" />
        </button>
        {aiOpen && (
          <div className="fixed bottom-20 right-4 z-50 w-80 overflow-hidden rounded-xl border bg-white shadow-xl font-poppins">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <div className="text-sm font-semibold">AI Assistant</div>
              <button onClick={() => setAiOpen(false)} aria-label="Close" className="rounded p-1 hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-72 space-y-2 overflow-auto px-3 py-2 text-sm">
              {aiMsgs.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn("rounded-md px-2 py-1.5", m.role === "user" ? "bg-[#2563eb] text-white" : "bg-muted")}>{m.content}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t p-2">
              <Input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendAi()}
                placeholder="Ask about HR data..."
                className="h-8 text-xs"
              />
              <Button type="button" onClick={sendAi} className="h-8 px-2 text-xs">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
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


function RowActions({ employee }: { employee: Employee }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="relative inline-block text-left">
      <Button
        variant="ghost"
        className="h-7 w-7 rounded-md p-0"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <EllipsisVertical className="h-4 w-4" />
      </Button>
      {open && (
        <div
          className="absolute right-0 z-20 mt-2 w-44 origin-top-right overflow-hidden rounded-md border bg-popover p-1 text-sm shadow-md"
          role="menu"
        >
          <button
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left hover:bg-accent"
            onClick={() => {
              setOpen(false);
              navigate(`/manage-profile/${employee.id}`);
            }}
          >
            <User className="h-4 w-4" /> Manage Profile
          </button>
          <button
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left hover:bg-accent"
            onClick={() => {
              setOpen(false);
              navigate(`/manage-profile/${employee.id}#documents`);
            }}
          >
            <FileText className="h-4 w-4" /> Documents
          </button>
        </div>
      )}
    </div>
  );
}
