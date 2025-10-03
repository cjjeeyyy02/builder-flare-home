import { useMemo, useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { EMPLOYEES, type Employee } from "@/lib/data/employees";

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

function OrgListView() {
  const total = 13;
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set(ORG_TREE.map((n) => n.name)));
  const [mode, setMode] = useState<"list" | "chart">("list");
  const [zoom, setZoom] = useState<number>(0.8);
  const toggle = (name: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const renderRows = (node: OrgNode, depth: number): React.ReactNode[] => {
    const hasChildren = !!node.children?.length;
    const isCollapsed = collapsed.has(node.name);
    const rows: React.ReactNode[] = [];
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
            <Button className="h-7 rounded-md px-2 text-xs bg-brand text-brand-foreground hover:bg-brand/90">View Chart</Button>
            <Button className="h-7 rounded-md px-2 text-xs bg-emerald-600 text-white hover:bg-emerald-700">Add Report</Button>
          </div>
        </TableCell>
      </TableRow>,
    );
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
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold">{mode === "list" ? "List View" : "Chart View"}</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
          <span className="ml-2">
            Zoom: <span className="text-foreground font-semibold">{Math.round(zoom * 100)}%</span> | {total} employees
          </span>
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
      </div>
      {mode === "list" ? (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="h-9 px-3 text-xs">Name</TableHead>
                <TableHead className="h-9 px-3 text-xs">Title</TableHead>
                <TableHead className="h-9 px-3 text-xs">Department</TableHead>
                <TableHead className="h-9 px-3 text-xs">Reports</TableHead>
                <TableHead className="h-9 px-3 text-right text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ORG_TREE.flatMap((node) => renderRows(node, 0))}
            </TableBody>
          </Table>
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
    </div>
  );
}


export default function Index() {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [view, setView] = useState<"table" | "card">("table");
  const [tab, setTab] = useState<string>("records");
  const [dcCategory, setDcCategory] = useState<string>("all");
  const [dcType, setDcType] = useState<string>("all");
  const [dcStatus, setDcStatus] = useState<string>("all");
  const [dcScope, setDcScope] = useState<string>("all");
  const [dcView, setDcView] = useState<"list" | "grid">("list");

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
                <SelectItem value="dept">Department Management</SelectItem>
                <SelectItem value="sys">System Configuration</SelectItem>
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
              <TabsTrigger
                value="dept"
                className={cn(
                  "flex-1 rounded-[12px] px-4 py-2 text-sm transition-colors",
                  "data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white data-[state=active]:font-bold",
                  "data-[state=inactive]:bg-transparent data-[state=inactive]:text-black data-[state=inactive]:font-medium data-[state=inactive]:hover:bg-[#E0F2FE]",
                )}
              >
                Department Management
              </TabsTrigger>
              <TabsTrigger
                value="sys"
                className={cn(
                  "flex-1 rounded-[12px] px-4 py-2 text-sm transition-colors",
                  "data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white data-[state=active]:font-bold",
                  "data-[state=inactive]:bg-transparent data-[state=inactive]:text-black data-[state=inactive]:font-medium data-[state=inactive]:hover:bg-[#E0F2FE]",
                )}
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
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="py-2 text-xs font-bold uppercase">Employee ID</TableHead>
                        <TableHead className="py-2 text-xs font-bold uppercase">Name</TableHead>
                        <TableHead className="py-2 text-xs font-bold uppercase">Department</TableHead>
                        <TableHead className="py-2 text-xs font-bold uppercase">Company Email</TableHead>
                        <TableHead className="py-2 text-xs font-bold uppercase">Status</TableHead>
                        <TableHead className="py-2 text-xs font-bold uppercase">Joining Date</TableHead>
                        <TableHead className="py-3 text-right font-bold uppercase">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((e, idx) => (
                        <TableRow
                          key={e.id}
                          className={cn("hover:bg-transparent")}
                        >
                          <TableCell className="py-3 font-medium text-foreground/90">
                            {e.id}
                          </TableCell>
                          <TableCell className="py-2 text-sm">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-foreground">
                                {e.firstName} {e.lastName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {e.role}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-2 text-sm">{e.department}</TableCell>
                          <TableCell className="py-2 text-sm">{e.email}</TableCell>
                          <TableCell className="py-2 text-sm">{e.status}</TableCell>
                          <TableCell className="py-2 text-sm">{e.joiningDate}</TableCell>
                          <TableCell className="py-3 text-right">
                            <RowActions employee={e} />
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
                      <RowActions employee={e} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="truncate text-muted-foreground">{e.department}</div>
                      <div className="truncate text-muted-foreground">{e.email}</div>
                      <div>{e.status}</div>
                      <div className="text-muted-foreground">{e.joiningDate}</div>
                    </div>
                  </Card>
                ))}
              </section>
            )}
          </TabsContent>

          <TabsContent value="org" className="mt-6">
            <OrgListView />
          </TabsContent>
          <TabsContent value="docs" className="mt-6">
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={dcCategory} onValueChange={setDcCategory}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="All Categories" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="hr">HR Policies</SelectItem>
                      <SelectItem value="training">Training Records</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dcType} onValueChange={setDcType}>
                    <SelectTrigger className="w-36"><SelectValue placeholder="All Types" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">DOCX</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="template">Template</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dcStatus} onValueChange={setDcStatus}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dcScope} onValueChange={setDcScope}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="All Documents" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Documents</SelectItem>
                      <SelectItem value="employee">Employee Docs</SelectItem>
                      <SelectItem value="policy">Policies</SelectItem>
                      <SelectItem value="reports">Reports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className={cn("h-9 w-9 rounded-full p-0", dcView === "list" && "bg-foreground text-background border-transparent")} onClick={() => setDcView("list")}>
                    <TableIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className={cn("h-9 w-9 rounded-full p-0", dcView === "grid" && "bg-foreground text-background border-transparent")} onClick={() => setDcView("grid")}>
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* List View */}
              {dcView === "list" && (
                <div className="overflow-hidden rounded-lg border">
                  <Table className="text-sm">
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="py-2 font-bold uppercase">Title</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Type</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Category</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Department</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Uploaded</TableHead>
                        <TableHead className="py-2 font-bold uppercase">File Size</TableHead>
                        <TableHead className="py-2 font-bold uppercase">Status</TableHead>
                        <TableHead className="py-2 text-right font-bold uppercase">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        ["Employee Handbook 2024","Policy Document","HR Policies","Human Resources","15/01/2024","2.4 MB","active"],
                        ["Sarah Mitchell - Employment Contract","Employment Contract","Employee Documents","Engineering","10/01/2023","856 KB","active"],
                        ["Q4 2023 Compliance Report","Compliance Report","Compliance","Finance","28/12/2023","1.8 MB","active"],
                        ["Safety Training Certificate - Marcus Thompson","Training Certificate","Training Records","Engineering","20/11/2023","1.2 MB","active"],
                        ["Emergency Contact Information","Emergency Contacts","Employee Records","Design","15/09/2023","324 KB","active"],
                        ["Performance Review Template 2024","Template","HR Templates","Human Resources","08/01/2024","445 KB","active"],
                        ["Data Privacy Policy Update","Policy Document","Compliance","Legal","22/08/2023","1.1 MB","pending"],
                        ["Financial Audit Report 2023","Audit Report","Finance","Finance","15/12/2023","3.2 MB","archived"],
                      ].map((r, idx) => (
                        <TableRow key={r[0] as string} className="hover:bg-muted/40">
                          <TableCell className="py-2">{r[0] as string}</TableCell>
                          <TableCell className="py-2">{r[1] as string}</TableCell>
                          <TableCell className="py-2">{r[2] as string}</TableCell>
                          <TableCell className="py-2">{r[3] as string}</TableCell>
                          <TableCell className="py-2">{r[4] as string}</TableCell>
                          <TableCell className="py-2">{r[5] as string}</TableCell>
                          <TableCell className="py-2">
                            {r[6] === "active" ? (
                              <Badge className="border-0 bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">Active</Badge>
                            ) : r[6] === "pending" ? (
                              <Badge className="border-0 bg-amber-100 px-2.5 py-0.5 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">Pending Review</Badge>
                            ) : (
                              <Badge className="border-0 bg-zinc-200 px-2.5 py-0.5 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">Archived</Badge>
                            )}
                          </TableCell>
                          <TableCell className="py-2 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0"><EllipsisVertical className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem className="gap-2"><Eye className="h-4 w-4" /> View</DropdownMenuItem>
                                <DropdownMenuItem className="gap-2"><Download className="h-4 w-4" /> Download</DropdownMenuItem>
                                <DropdownMenuItem className="gap-2"><Share className="h-4 w-4" /> Share</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2"><Pencil className="h-4 w-4" /> Edit Details</DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-rose-600"><Trash2 className="h-4 w-4" /> Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {dcView === "grid" && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[]}
                </div>
              )}
            </div>
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
