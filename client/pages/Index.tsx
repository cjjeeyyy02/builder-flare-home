import { useEffect, useMemo, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/local/tabs";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
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
  Clock,
  Settings,
  MoreVertical,
  ChevronDown,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
          {
            name: "James Rodriguez",
            title: "Senior Software Engineer",
            department: "Engineering",
          },
          {
            name: "Emily Chen",
            title: "Lead UX Designer",
            department: "Engineering",
          },
          {
            name: "Marcus Thompson",
            title: "DevOps Manager",
            department: "Engineering",
          },
        ],
      },
    ],
  },
];

const DEPT_SUMMARY = [
  {
    department: "Design",
    head: "Ava Thompson",
    costCenter: "CC-1001",
    members: 8,
  },
  {
    department: "Engineering",
    head: "Liam Carter",
    costCenter: "CC-2001",
    members: 42,
  },
  {
    department: "Finance",
    head: "Olivia Chen",
    costCenter: "CC-3001",
    members: 12,
  },
  {
    department: "Marketing",
    head: "Noah Patel",
    costCenter: "CC-4001",
    members: 16,
  },
  {
    department: "Product",
    head: "Emma Davis",
    costCenter: "CC-5001",
    members: 18,
  },
];

function OrgListView() {
  const total = 13;
  const [collapsed, setCollapsed] = useState<Set<string>>(
    () => new Set(ORG_TREE.map((n) => n.name)),
  );
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
  const [reportTarget, setReportTarget] = useState<{
    name: string;
    role: string;
  } | null>(null);

  type DeptRow = {
    department: string;
    head: string;
    costCenter: string;
    members: number;
  };
  const [departmentsData, setDepartmentsData] =
    useState<DeptRow[]>(DEPT_SUMMARY);
  const { toast } = useToast();
  const [deptDialogOpen, setDeptDialogOpen] = useState(false);
  const [editingDeptIndex, setEditingDeptIndex] = useState<number | null>(null);
  const [deptName, setDeptName] = useState("");
  const [deptHead, setDeptHead] = useState("");
  const [deptHeadPicker, setDeptHeadPicker] = useState(false);
  const [deptCostCenter, setDeptCostCenter] = useState("");
  const [deptMembers, setDeptMembers] = useState<number>(0);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null,
  );

  const msHeads = useMemo(
    () => EMPLOYEES.map((e) => `${e.firstName} ${e.lastName}`),
    [],
  );
  const [msQuery, setMsQuery] = useState("");
  const [msDeptFilter, setMsDeptFilter] = useState<string>("all");
  const [msPage, setMsPage] = useState(0);
  const [msPageSize, setMsPageSize] = useState<number>(10);

  function openAddDept() {
    setEditingDeptIndex(null);
    setDeptName("");
    setDeptHead("");
    setDeptCostCenter("");
    setDeptMembers(0);
    setDeptDialogOpen(true);
  }
  function openEditDept(index: number) {
    const d = departmentsData[index];
    setEditingDeptIndex(index);
    setDeptName(d.department);
    setDeptHead(d.head);
    setDeptCostCenter(d.costCenter);
    setDeptMembers(d.members);
    setDeptDialogOpen(true);
  }
  function saveDept() {
    const name = deptName.trim();
    const head = deptHead.trim();
    const costCenter = deptCostCenter.trim();
    const members = Math.max(0, Number.isFinite(deptMembers) ? deptMembers : 0);
    if (!name) return toast({ title: "Department name required" });
    if (!costCenter) return toast({ title: "Cost Center is required" });
    const row: DeptRow = { department: name, head, costCenter, members };
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

  function download(filename: string, content: string, mime: string) {
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
  function currentManagedRows(): DeptRow[] {
    const q = msQuery.toLowerCase().trim();
    return departmentsData.filter((d) => {
      const matchesHead = !q || d.head.toLowerCase().includes(q);
      const matchesDept =
        msDeptFilter === "all" || d.department === msDeptFilter;
      return matchesHead && matchesDept;
    });
  }
  function exportCSV() {
    const rows = currentManagedRows();
    const headers = [
      "Department",
      "Department Head",
      "Cost Center",
      "Team Members",
    ];
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        [r.department, r.head, r.costCenter, String(r.members)]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");
    download("manage-structure.csv", csv, "text/csv;charset=utf-8;");
    toast({ title: "Exported CSV", description: `${rows.length} record(s)` });
  }
  function exportXLS() {
    const rows = currentManagedRows();
    const xml = `<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n<Worksheet ss:Name="ManageStructure"><Table>${["Department", "Department Head", "Cost Center", "Team Members"].map((h) => `<Cell><Data ss:Type=\"String\">${h}</Data></Cell>`).join("")}${rows.map((r) => `<Row><Cell><Data ss:Type=\"String\">${r.department}</Data></Cell><Cell><Data ss:Type=\"String\">${r.head}</Data></Cell><Cell><Data ss:Type=\"String\">${r.costCenter}</Data></Cell><Cell><Data ss:Type=\"Number\">${r.members}</Data></Cell></Row>`).join("")}</Table></Worksheet></Workbook>`;
    download("manage-structure.xls", xml, "application/vnd.ms-excel");
    toast({ title: "Exported Excel", description: `${rows.length} record(s)` });
  }

  const renderRows = (node: OrgNode, depth: number): React.ReactNode[] => {
    const hasChildren = !!node.children?.length;
    const isCollapsed = collapsed.has(node.name);
    const rows: React.ReactNode[] = [];
    const q = orgName.toLowerCase().trim();
    const matchesQuery =
      !q ||
      node.name.toLowerCase().includes(q) ||
      node.title.toLowerCase().includes(q);
    const matchesDept =
      orgDept === "all" || node.department.toLowerCase() === orgDept;
    if (matchesQuery && matchesDept) {
      rows.push(
        <TableRow key={node.name}>
          <TableCell className="py-2 text-sm">
            <div
              className="flex items-center gap-2"
              style={{ marginLeft: depth * 16 }}
            >
              {hasChildren && (
                <button
                  type="button"
                  aria-label={
                    isCollapsed
                      ? "Expand direct reports"
                      : "Collapse direct reports"
                  }
                  onClick={() => toggle(node.name)}
                  className="flex h-5 w-5 items-center justify-center rounded border text-[10px] text-muted-foreground hover:bg-accent"
                >
                  {isCollapsed ? ">" : "˅"}
                </button>
              )}
              <span className="font-medium text-foreground">{node.name}</span>
            </div>
          </TableCell>
          <TableCell className="py-2 text-xs text-muted-foreground">
            {node.title}
          </TableCell>
          <TableCell className="py-2 text-xs">{node.department}</TableCell>
          <TableCell className="py-2 text-xs">
            {typeof node.directReports === "number"
              ? node.directReports
              : (node.children?.length ?? 0)}
          </TableCell>
          <TableCell className="py-2 text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  aria-label={`Actions for ${node.name}`}
                >
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => setMode("chart")}>
                  View Chart
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    toast({ title: "Edit", description: `${node.name}` })
                  }
                >
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

  useEffect(() => {
    setOrgPage(0);
  }, [orgName, orgDept]);

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
                aria-label={
                  isCollapsed
                    ? "Expand direct reports"
                    : "Collapse direct reports"
                }
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
              <div className="text-xs font-semibold text-foreground">
                {node.name}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {node.title}
              </div>
            </div>
          </div>
          <div
            className={cn(
              "mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
              deptColor(node.department),
            )}
          >
            {node.department}
          </div>
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
      {mode === "manage" && (
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setMode("list")}
            className="h-8 rounded-lg px-4 text-xs font-medium bg-white text-[#111827] border border-[#d1d5db] hover:bg-gray-50"
          >
            ← Back
          </Button>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex items-center gap-3",
            mode === "manage" && "font-poppins",
          )}
        >
          <h3
            className={cn(
              "text-sm font-bold",
              mode === "manage" && "font-poppins",
            )}
          >
            {mode === "manage" ? "Manage Department" : ""}
          </h3>
        </div>
        {mode === "manage" ? null : (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Button
              type="button"
              onClick={() => setMode("manage")}
              className="h-8 rounded-lg px-4 text-xs font-medium bg-[#2563eb] text-white hover:bg-[#1e40af]"
            >
              <Building2 className="mr-1.5 h-4 w-4" /> Manage Department
            </Button>
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                aria-label="List view"
                onClick={() => setMode("list")}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md border",
                  mode === "list"
                    ? "bg-foreground text-background"
                    : "text-foreground hover:bg-accent",
                )}
              >
                <TableIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Chart view"
                onClick={() => setMode("chart")}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md border",
                  mode === "chart"
                    ? "bg-foreground text-background"
                    : "text-foreground hover:bg-accent",
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
            <span className="ml-2">{total} employees</span>
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() =>
                  setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))
                }
                className="flex h-7 w-7 items-center justify-center rounded-md border text-foreground hover:bg-accent"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() =>
                  setZoom((z) => Math.min(1.5, +(z + 0.1).toFixed(2)))
                }
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
            <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
              <div className="font-poppins text-[16px] font-semibold">
                Manage Structure
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      className="h-8 rounded-lg px-3 text-xs font-medium"
                    >
                      <Download className="mr-1.5 h-4 w-4" /> Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => exportCSV()}>
                      Export CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportXLS()}>
                      Export Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  type="button"
                  onClick={openAddDept}
                  className="h-8 rounded-lg px-4 text-xs font-medium bg-[#2563eb] text-white hover:bg-[#1e40af]"
                >
                  <Plus className="mr-1.5 h-4 w-4" /> Add Department
                </Button>
              </div>
              <Dialog open={deptDialogOpen} onOpenChange={setDeptDialogOpen}>
                <DialogContent className="font-poppins">
                  <DialogHeader>
                    <DialogTitle className="font-poppins text-base font-semibold">
                      {editingDeptIndex === null
                        ? "Add Department"
                        : "Edit Department"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-3 py-2">
                    <div className="grid gap-1.5">
                      <Label
                        htmlFor="dept-name"
                        className="font-poppins text-sm"
                      >
                        Department Name
                      </Label>
                      <Input
                        id="dept-name"
                        placeholder="Enter department name"
                        value={deptName}
                        onChange={(e) => setDeptName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="font-poppins text-sm">
                        Department Head
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={deptHead}
                          placeholder="Select department head"
                          className="h-9"
                          onClick={() => setDeptHeadPicker(true)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9"
                          onClick={() => setDeptHeadPicker(true)}
                        >
                          Select
                        </Button>
                      </div>
                      <CommandDialog
                        open={deptHeadPicker}
                        onOpenChange={setDeptHeadPicker}
                      >
                        <CommandInput placeholder="Search employee..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          {msHeads.map((h) => (
                            <CommandItem
                              key={h}
                              value={h}
                              onSelect={() => {
                                setDeptHead(h);
                                setDeptHeadPicker(false);
                              }}
                            >
                              {h}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandDialog>
                    </div>
                    <div className="grid gap-1.5">
                      <Label
                        htmlFor="dept-cost"
                        className="font-poppins text-sm"
                      >
                        Cost Center (Co Center)
                      </Label>
                      <Input
                        id="dept-cost"
                        placeholder="e.g., CC-1001"
                        value={deptCostCenter}
                        onChange={(e) => setDeptCostCenter(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-md bg-white text-[#111827] border border-[#d1d5db]"
                      onClick={() => setDeptDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      className="rounded-md bg-[#2563eb] text-white hover:bg-[#1e40af]"
                      onClick={saveDept}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-wrap items-center gap-2 px-3 py-2">
              <Input
                value={msQuery}
                onChange={(e) => {
                  setMsQuery(e.target.value);
                  setMsPage(0);
                }}
                placeholder="Search by Department Head or filter by Department"
                className="h-8 w-72 text-xs"
              />
              <Select
                value={msDeptFilter}
                onValueChange={(v) => {
                  setMsDeptFilter(v);
                  setMsPage(0);
                }}
              >
                <SelectTrigger className="h-8 w-44 text-xs">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {Array.from(
                    new Set(departmentsData.map((d) => d.department)),
                  ).map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="px-3 py-2 text-xs font-medium">
                    Department
                  </TableHead>
                  <TableHead className="px-3 py-2 text-xs font-medium">
                    Department Head
                  </TableHead>
                  <TableHead className="px-3 py-2 text-xs font-medium">
                    Cost Center
                  </TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium">
                    Team Members
                  </TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  const q = msQuery.toLowerCase().trim();
                  const filtered = departmentsData.filter((d) => {
                    const matchesHead = !q || d.head.toLowerCase().includes(q);
                    const matchesDept =
                      msDeptFilter === "all" || d.department === msDeptFilter;
                    return matchesHead && matchesDept;
                  });
                  const total = filtered.length;
                  const totalPages = Math.max(1, Math.ceil(total / msPageSize));
                  const start = Math.min(
                    msPage * msPageSize,
                    Math.max(0, total - (total % msPageSize || msPageSize)),
                  );
                  const end = Math.min(start + msPageSize, total);
                  return (
                    <>
                      {filtered.slice(start, end).map((d, i) => (
                        <TableRow
                          key={d.department + i}
                          className="border-b last:border-0 hover:bg-transparent"
                        >
                          <TableCell className="px-3 py-2">
                            {d.department}
                          </TableCell>
                          <TableCell className="px-3 py-2">{d.head}</TableCell>
                          <TableCell className="px-3 py-2">
                            {d.costCenter}
                          </TableCell>
                          <TableCell className="px-3 py-2 text-center">
                            {d.members}
                          </TableCell>
                          <TableCell className="px-3 py-2 text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                  aria-label={`Actions for ${d.department}`}
                                >
                                  <EllipsisVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                  onClick={() =>
                                    openEditDept(
                                      departmentsData.findIndex((x) => x === d),
                                    )
                                  }
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setConfirmDeleteIndex(
                                      departmentsData.findIndex((x) => x === d),
                                    )
                                  }
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      <tr>
                        <td colSpan={5} className="border-t px-2 py-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="inline-flex items-center gap-2">
                              <span className="text-muted-foreground">
                                Rows per page
                              </span>
                              <Select
                                value={String(msPageSize)}
                                onValueChange={(v) => {
                                  setMsPageSize(parseInt(v, 10));
                                  setMsPage(0);
                                }}
                              >
                                <SelectTrigger className="h-7 w-20 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[10, 25, 50, 100].map((n) => (
                                    <SelectItem key={n} value={String(n)}>
                                      {n}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="inline-flex items-center gap-1">
                              <Button
                                variant="outline"
                                className="h-7 w-7 rounded-md p-0"
                                onClick={() =>
                                  setMsPage((p) => Math.max(0, p - 1))
                                }
                                disabled={msPage === 0}
                                aria-label="Previous page"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              {Array.from({ length: totalPages }).map(
                                (_, idx) => (
                                  <Button
                                    key={idx}
                                    variant={
                                      idx === msPage ? "default" : "outline"
                                    }
                                    className="h-7 min-w-7 rounded-md px-2 text-xs"
                                    onClick={() => setMsPage(idx)}
                                  >
                                    {idx + 1}
                                  </Button>
                                ),
                              )}
                              <Button
                                variant="outline"
                                className="h-7 w-7 rounded-md p-0"
                                onClick={() =>
                                  setMsPage((p) =>
                                    Math.min(totalPages - 1, p + 1),
                                  )
                                }
                                disabled={msPage >= totalPages - 1}
                                aria-label="Next page"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </>
                  );
                })()}
              </TableBody>
            </Table>
          </div>
          <AlertDialog
            open={confirmDeleteIndex !== null}
            onOpenChange={(o) => !o && setConfirmDeleteIndex(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete department?</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="text-sm text-muted-foreground">
                This action cannot be undone. This will permanently remove the
                department.
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteDept}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : mode === "list" ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Search by name or position"
              className="h-8 w-56 text-xs"
            />
            <Select value={orgDept} onValueChange={setOrgDept}>
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {(() => {
                  const set = new Set<string>();
                  const walk = (n: OrgNode) => {
                    set.add(n.department.toLowerCase());
                    n.children?.forEach(walk);
                  };
                  ORG_TREE.forEach(walk);
                  return Array.from(set).map((d) => (
                    <SelectItem key={d} value={d}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </SelectItem>
                  ));
                })()}
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-hidden rounded-lg border">
            {(() => {
              const rows = ORG_TREE.flatMap((node) => renderRows(node, 0));
              const pageSize = 10;
              const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
              const start = Math.min(
                orgPage * pageSize,
                Math.max(0, rows.length - (rows.length % pageSize || pageSize)),
              );
              const end = Math.min(start + pageSize, rows.length);
              return (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="h-9 px-3 text-xs">Name</TableHead>
                        <TableHead className="h-9 px-3 text-xs">
                          Position
                        </TableHead>
                        <TableHead className="h-9 px-3 text-xs">
                          Department
                        </TableHead>
                        <TableHead className="h-9 px-3 text-xs">
                          Reporting Staff
                        </TableHead>
                        <TableHead className="h-9 px-3 text-center text-xs">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{rows.slice(start, end)}</TableBody>
                  </Table>
                  <div className="flex items-center justify-end gap-2 border-t px-2 py-2 text-xs">
                    <span className="text-muted-foreground">
                      {start + 1}-{end} of {rows.length}
                    </span>
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
                      onClick={() =>
                        setOrgPage((p) => Math.min(totalPages - 1, p + 1))
                      }
                      disabled={orgPage >= totalPages - 1}
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      ) : (
        <div
          className="mt-2 origin-top"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
        >
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
  const [tab, setTab] = useState<string>("attendance");
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().slice(0, 10));
  const [subTab, setSubTab] = useState<"logs" | "timesheets" | "shift">("timesheets");
  const [tsRange, setTsRange] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [leaveView, setLeaveView] = useState<"requests" | "balances">("requests");
  const [weeklyPage, setWeeklyPage] = useState(0);
  const [monthlyPage, setMonthlyPage] = useState(0);
  const itemsPerPage = 10;
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);
  type WeeklyRow = { empId: string; name: string; mon: string; tue: string; wed: string; thu: string; fri: string; sat: string; sun: string; scheduled: string; worked: string };
  const WEEKLY_DATA: WeeklyRow[] = [
    { empId: "E-1001", name: "Alex Chen", mon: "0.0h", tue: "0.0h", wed: "9.0h", thu: "0.0h", fri: "0.0h", sat: "0.0h", sun: "0.0h", scheduled: "40h", worked: "9.0h" },
    { empId: "E-1002", name: "Maria Gomez", mon: "0.0h", tue: "0.0h", wed: "8.6h", thu: "0.0h", fri: "0.0h", sat: "0.0h", sun: "0.0h", scheduled: "40h", worked: "8.6h" },
    { empId: "E-1003", name: "Jordan Lee", mon: "0.0h", tue: "0.0h", wed: "8.9h", thu: "0.0h", fri: "0.0h", sat: "0.0h", sun: "0.0h", scheduled: "40h", worked: "8.9h" },
    { empId: "E-1004", name: "Priya Patel", mon: "0.0h", tue: "0.0h", wed: "0.0h", thu: "0.0h", fri: "0.0h", sat: "0.0h", sun: "0.0h", scheduled: "40h", worked: "0.0h" },
  ];
  const todaySlash = useMemo(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }, []);
  const monthlyDisplay = useMemo(() => {
    const d = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const yyyy = d.getFullYear();
    return `${months[d.getMonth()]} ${yyyy}`;
  }, []);
  const weeklyDisplay = useMemo(() => {
    const d = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDay = d.getDay();
    const diff = d.getDate() - currentDay;
    const weekStart = new Date(d.setDate(diff));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const startMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][weekStart.getMonth()];
    const endMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][weekEnd.getMonth()];
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();
    const year = weekEnd.getFullYear();

    return startMonth === endMonth ? `${startMonth} ${startDay} - ${endDay}, ${year}` : `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }, []);
  const tsDayHeader = useMemo(() => {
    const d = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${mm}/${dd} (${days[d.getDay()]})`;
  }, []);
  type TimesheetRow = { empId: string; name: string; scheduled: string; worked: string; day: string };
  const TS_ROWS: TimesheetRow[] = [
    { empId: "E-1001", name: "Alex Chen", scheduled: "8h", worked: "9.02h", day: "Present • 09:02–18:03" },
    { empId: "E-1002", name: "Maria Gomez", scheduled: "8h", worked: "8.57h", day: "On Leave" },
    { empId: "E-1003", name: "Jordan Lee", scheduled: "8h", worked: "8.92h", day: "Remote • 09:05–18:00" },
    { empId: "E-1004", name: "Priya Patel", scheduled: "8h", worked: "0.00h", day: "On Leave" },
  ];
  type MonthlyRow = { empId: string; name: string; days: (string | number)[]; hoursWorked: string; scheduled: string };
  const MONTHLY_DATA: MonthlyRow[] = [
    { empId: "1001", name: "Alex Chen", days: [0, 0, 0, "H", "H", 0, 0, 0, 0, "8h", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "H", "H", 0, 0, 0, 0, 0, 0, 0, 0, 0], hoursWorked: "152", scheduled: "160" },
    { empId: "1002", name: "Maria Gomez", days: [0, 0, 0, 0, 0, 0, 0, 0, 0, "L", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "H", "H", 0, 0, 0, 0, 0, 0, 0, 0, 0], hoursWorked: "0", scheduled: "160" },
  ];
  type LeaveBalance = { leaveType: string; leaveTaken: number; leaveBalance: number };
  type EmployeeLeaveBalance = { empId: string; name: string; department: string; position: string; balances: LeaveBalance[] };
  const EMPLOYEE_LEAVE_BALANCES: EmployeeLeaveBalance[] = [
    { empId: "EMP001", name: "Sarah Mitchell", department: "Engineering", position: "Senior Software Engineer", balances: [
      { leaveType: "Annual Leave", leaveTaken: 7, leaveBalance: 13 },
      { leaveType: "Sick Leave", leaveTaken: 3, leaveBalance: 7 },
      { leaveType: "Personal Leave", leaveTaken: 2, leaveBalance: 4 },
    ]},
    { empId: "EMP002", name: "Daniel Nguyen", department: "Product", position: "Product Manager", balances: [
      { leaveType: "Annual Leave", leaveTaken: 7, leaveBalance: 13 },
      { leaveType: "Sick Leave", leaveTaken: 3, leaveBalance: 7 },
      { leaveType: "Personal Leave", leaveTaken: 2, leaveBalance: 4 },
    ]},
    { empId: "EMP003", name: "Priya Kumar", department: "Design", position: "UX Designer", balances: [
      { leaveType: "Annual Leave", leaveTaken: 7, leaveBalance: 13 },
      { leaveType: "Sick Leave", leaveTaken: 3, leaveBalance: 7 },
      { leaveType: "Personal Leave", leaveTaken: 2, leaveBalance: 4 },
    ]},
    { empId: "EMP004", name: "Marcus Lee", department: "Analytics", position: "Data Analyst", balances: [
      { leaveType: "Annual Leave", leaveTaken: 7, leaveBalance: 13 },
      { leaveType: "Sick Leave", leaveTaken: 3, leaveBalance: 7 },
      { leaveType: "Personal Leave", leaveTaken: 2, leaveBalance: 4 },
    ]},
    { empId: "EMP005", name: "Elena Garcia", department: "Human Resources", position: "HR Coordinator", balances: [
      { leaveType: "Annual Leave", leaveTaken: 7, leaveBalance: 13 },
      { leaveType: "Sick Leave", leaveTaken: 3, leaveBalance: 7 },
      { leaveType: "Personal Leave", leaveTaken: 2, leaveBalance: 4 },
    ]},
    { empId: "EMP006", name: "Omar Hassan", department: "Engineering", position: "DevOps Engineer", balances: [
      { leaveType: "Annual Leave", leaveTaken: 7, leaveBalance: 13 },
      { leaveType: "Sick Leave", leaveTaken: 3, leaveBalance: 7 },
      { leaveType: "Personal Leave", leaveTaken: 2, leaveBalance: 4 },
    ]},
    { empId: "EMP007", name: "Julia Rossi", department: "Engineering", position: "QA Engineer", balances: [
      { leaveType: "Annual Leave", leaveTaken: 7, leaveBalance: 13 },
      { leaveType: "Sick Leave", leaveTaken: 3, leaveBalance: 7 },
      { leaveType: "Personal Leave", leaveTaken: 2, leaveBalance: 4 },
    ]},
  ];
  type ShiftSlot = { name: string; time: string; id: string };
  type ShiftDay = { day: string; slots: ShiftSlot[] };
  const SHIFT_DAYS: ShiftDay[] = [
    { day: "Mon", slots: [
      { name: "Alex", time: "9–18", id: "mon-1" },
      { name: "Maria", time: "10–19", id: "mon-2" },
      { name: "Jordan", time: "9–18", id: "mon-3" },
    ]},
    { day: "Tue", slots: [
      { name: "Alex", time: "9–18", id: "tue-1" },
      { name: "Priya", time: "9–18", id: "tue-2" },
      { name: "Jordan", time: "9–18", id: "tue-3" },
    ]},
    { day: "Wed", slots: [
      { name: "Maria", time: "10–19", id: "wed-1" },
      { name: "Priya", time: "9–18", id: "wed-2" },
      { name: "Jordan", time: "9–18", id: "wed-3" },
      { name: "Maria", time: "10–19", id: "wed-4" },
    ]},
    { day: "Thu", slots: [
      { name: "Alex", time: "9–18", id: "thu-1" },
      { name: "Maria", time: "10–19", id: "thu-2" },
      { name: "Jordan", time: "9�����18" },
    ]},
    { day: "Fri", slots: [
      { name: "Alex", time: "9–18", id: "fri-1" },
      { name: "Maria", time: "10–19", id: "fri-2" },
      { name: "Priya", time: "9–18", id: "fri-3" },
    ]},
  ];
  const [shiftFrom, setShiftFrom] = useState<string>(new Date().toISOString().slice(0, 10));
  const [shiftTo, setShiftTo] = useState<string>(new Date().toISOString().slice(0, 10));
  const [openFromPicker, setOpenFromPicker] = useState(false);
  const [openToPicker, setOpenToPicker] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{ from: string; itemId: string } | null>(null);
  const [shiftDays, setShiftDays] = useState<ShiftDay[]>(SHIFT_DAYS);
  const [openCreateLeave, setOpenCreateLeave] = useState(false);
  const [formData, setFormData] = useState({ empName: "", leaveType: "", periodFrom: "", periodTo: "" });

  const handleDragStart = (day: string, itemId: string) => {
    setDraggedItem({ from: day, itemId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (toDay: string) => {
    if (!draggedItem) return;
    if (draggedItem.from === toDay) {
      setDraggedItem(null);
      return;
    }

    const updatedDays = shiftDays.map((day) => ({
      ...day,
      slots: day.day === draggedItem.from
        ? day.slots.filter((s) => s.id !== draggedItem.itemId)
        : day.day === toDay
        ? [...day.slots, ...shiftDays.find((d) => d.day === draggedItem.from)?.slots.filter((s) => s.id === draggedItem.itemId) || []]
        : day.slots,
    }));

    setShiftDays(updatedDays);
    setDraggedItem(null);
  };
  // Use `leaves` state for leave requests list (defined below as LeaveReq[]). Remove duplicate leaveRequests state.
  const navigate = useNavigate();

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

  const todayStr = useMemo(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  }, []);

  function getAttendanceStatus(e: Employee): "Present" | "Late" | "Absent" {
    const s = String(e.status || "").toLowerCase();
    if (s.includes("on leave") || s.includes("inactive")) return "Absent";
    const num = parseInt(e.id.replace(/\D/g, ""), 10);
    if (Number.isNaN(num)) return "Present";
    return num % 5 === 0 ? "Late" : "Present";
  }

  function getInOutTimes(e: Employee): { in: string; out: string } {
    const s = getAttendanceStatus(e);
    if (s === "Absent") return { in: "—", out: "—" };
    if (s === "Late") return { in: "09:15 am", out: "05:30 pm" };
    return { in: "09:00 am", out: "05:30 pm" };
  }

  // Leave Requests demo data and search
  type LeaveReq = {
    empId: string;
    employee: string;
    type: string;
    from: string;
    to: string;
    days: number;
    status: "Pending" | "Approved";
  };
  const [lrSearch, setLrSearch] = useState("");
  const [lrTypeFilter, setLrTypeFilter] = useState("");
  const [leaves, setLeaves] = useState<LeaveReq[]>([
    { empId: "EMP201", employee: "Neha Gupta", type: "Annual Leave", from: "2025-10-16", to: "2025-10-17", days: 2, status: "Pending" },
    { empId: "EMP202", employee: "Aarav Sharma", type: "Annual Leave", from: "2025-10-15", to: "2025-10-17", days: 3, status: "Pending" },
    { empId: "EMP203", employee: "Sara Khan", type: "Sick Leave", from: "2025-10-12", to: "2025-10-13", days: 2, status: "Approved" },
  ]);
  const [lrCreateOpen, setLrCreateOpen] = useState(false);
  const [lrEmpId, setLrEmpId] = useState("EMP999");
  const [lrEmployee, setLrEmployee] = useState("");
  const [lrType, setLrType] = useState("Annual Leave");
  const [lrFrom, setLrFrom] = useState<string>(new Date().toISOString().slice(0, 10));
  const [lrTo, setLrTo] = useState<string>(new Date().toISOString().slice(0, 10));
  const [lrStatus, setLrStatus] = useState<"Pending" | "Approved">("Pending");
  const filteredLeaves = useMemo(
    () =>
      leaves.filter((l) => {
        const q = lrSearch.trim().toLowerCase();
        const matchSearch = !q || l.employee.toLowerCase().includes(q) || l.empId.toLowerCase().includes(q) || l.type.toLowerCase().includes(q);
        const matchType = !lrTypeFilter || lrTypeFilter === 'all' || l.type === lrTypeFilter;
        return matchSearch && matchType;
      }),
    [leaves, lrSearch, lrTypeFilter],
  );

  function exportLeavesCSV() {
    const headers = ["Employee ID", "Employee Name", "Leave Type", "Period From", "Period To", "Days", "Status"];
    const rows = filteredLeaves.map((l) => [l.empId, l.employee, l.type, l.from, l.to, String(l.days), l.status]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))].join("\n");
    download("leave-requests.csv", csv, "text/csv;charset=utf-8;");
  }
  const [lrPage, setLrPage] = useState(0);
  const lrPageSize = 5;
  const lrTotal = filteredLeaves.length;
  const lrTotalPages = Math.max(1, Math.ceil(lrTotal / lrPageSize));
  const lrStart = Math.min(lrPage * lrPageSize, lrTotal);
  const lrEnd = Math.min(lrStart + lrPageSize, lrTotal);
  const lrItems = filteredLeaves.slice(lrStart, lrEnd);

  type ShiftRow = { empId: string; employee: string; dept: string; shift: "Day" | "Night" | "Early" };
  const [shiftRows, setShiftRows] = useState<ShiftRow[]>([
    { empId: "EMP202", employee: "Aarav Sharma", dept: "Engineering", shift: "Day" },
    { empId: "EMP201", employee: "Neha Gupta", dept: "Finance", shift: "Day" },
    { empId: "EMP301", employee: "John Patel", dept: "Sales", shift: "Early" },
    { empId: "EMP203", employee: "Sara Khan", dept: "Support", shift: "Night" },
  ]);
  const [shiftEditIndex, setShiftEditIndex] = useState<number | null>(null);
  const [shiftEditValue, setShiftEditValue] = useState<"Day" | "Night" | "Early">("Day");

  type BalanceRow = { employee: string; type: string; balance: number };
  const [balances, setBalances] = useState<BalanceRow[]>([
    { employee: "Aarav Sharma", type: "Annual Leave", balance: 15 },
    { employee: "Aarav Sharma", type: "Sick Leave", balance: 9 },
    { employee: "Neha Gupta", type: "Annual Leave", balance: 12 },
    { employee: "John Patel", type: "Annual Leave", balance: 8 },
    { employee: "Sara Khan", type: "Annual Leave", balance: 16 },
  ]);

  const filtered = useMemo(() => {
    return EMPLOYEES.filter((e) => {
      const matchesSearch =
        !search.trim() ||
        [e.firstName, e.lastName, e.email, e.role, e.status, e.department, e.id]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesPos =
        position === "all" || e.role.toLowerCase().includes(position);
      const matchesStatus =
        status === "all" || e.status.toLowerCase() === status;
      return matchesSearch && matchesPos && matchesStatus;
    });
  }, [search, position, status]);

  // Pagination for Employee Records table
  const pageSize = 10;
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = Math.min(
    page * pageSize,
    Math.max(0, filtered.length - (filtered.length % pageSize || pageSize)),
  );
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
      [
        "javascript",
        "typescript",
        "react",
        "node",
        "aws",
        "docker",
        "kubernetes",
        "ci/cd",
      ].forEach((k) => skills.add(k));
    }
    // Role specific
    if (r.includes("devops")) {
      [
        "aws",
        "docker",
        "kubernetes",
        "terraform",
        "ci/cd",
        "linux",
        "cloud",
      ].forEach((k) => skills.add(k));
    }
    if (r.includes("qa")) {
      [
        "qa",
        "testing",
        "automation",
        "cypress",
        "selenium",
        "javascript",
        "typescript",
      ].forEach((k) => skills.add(k));
    }
    if (r.includes("software") || r.includes("engineer")) {
      ["javascript", "typescript", "react", "node", "testing", "git"].forEach(
        (k) => skills.add(k),
      );
    }
    if (r.includes("designer")) {
      ["design", "figma", "ux", "ui", "prototyping", "research"].forEach((k) =>
        skills.add(k),
      );
    }
    if (r.includes("analyst")) {
      ["sql", "python", "tableau", "excel", "analytics"].forEach((k) =>
        skills.add(k),
      );
    }
    if (r.includes("product")) {
      ["product", "agile", "scrum", "roadmap", "jira"].forEach((k) =>
        skills.add(k),
      );
    }
    if (r.includes("hr")) {
      ["hr", "recruiting", "onboarding", "payroll"].forEach((k) =>
        skills.add(k),
      );
    }
    return Array.from(skills);
  }

  function scoreCandidate(
    e: Employee,
    querySkills: string[],
  ): { score: number; matches: string[] } {
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
    {
      role: "assistant",
      content:
        "Hi! Try: who knows AWS, React, or TypeScript? I'll list matches with years and recommend top candidates.",
    },
  ]);
  const [openAddSingle, setOpenAddSingle] = useState(false);

  // Helpers for AI assistant
  function parseMDY(s: string): Date | null {
    const m = s.match(/(\d{1,2})[-\/](\d{1,2})[-\/]?(\d{2,4})/);
    if (!m) return null;
    const mm = parseInt(m[1], 10);
    const dd = parseInt(m[2], 10);
    const yy = parseInt(m[3].length === 2 ? `20${m[3]}` : m[3], 10);
    const d = new Date(yy, (mm || 1) - 1, dd || 1);
    return isNaN(d.getTime()) ? null : d;
  }
  function findEmployeeRef(text: string): Employee | null {
    const byId = text.match(/emp\d{3}/i);
    if (byId) {
      const id = byId[0].toUpperCase();
      const e = EMPLOYEES.find((x) => x.id.toUpperCase() === id);
      if (e) return e;
    }
    const byEmail = EMPLOYEES.find((e) => text.includes(e.email.toLowerCase()));
    if (byEmail) return byEmail;
    const byFull = EMPLOYEES.find((e) =>
      text.includes(`${e.firstName} ${e.lastName}`.toLowerCase()),
    );
    if (byFull) return byFull;
    // fallback: unique first or last name
    const byFirst = EMPLOYEES.filter((e) =>
      text.includes(e.firstName.toLowerCase()),
    );
    if (byFirst.length === 1) return byFirst[0];
    const byLast = EMPLOYEES.filter((e) =>
      text.includes(e.lastName.toLowerCase()),
    );
    if (byLast.length === 1) return byLast[0];
    return null;
  }
  function fmtEmp(e: Employee): string {
    const parts = [
      `${e.firstName} ${e.lastName} (${e.id})`,
      e.role,
      e.department,
      `Status: ${e.status}`,
      `Joined: ${e.joiningDate}`,
      `Email: ${e.email}`,
      e.contactNumber ? `Phone: ${e.contactNumber}` : null,
      e.location ? `Location: ${e.location}` : null,
    ].filter(Boolean) as string[];
    return parts.join(" • ");
  }
  function listByDept(d: string): string {
    const list = EMPLOYEES.filter(
      (e) => e.department.toLowerCase() === d.toLowerCase(),
    );
    if (!list.length) return `No employees found in ${d}.`;
    return `${d} (${list.length}):\n${list.map((e) => `• ${e.firstName} ${e.lastName} �� ${e.role} (${e.status})`).join("\n")}`;
  }

  function getAssistantReply(q: string): string {
    const raw = q.trim();
    const text = raw.toLowerCase();
    if (!text) return "Please type a question.";

    // Skills-based search and recommendations
    const tokens = text
      .split(/[^a-zA-Z0-9+/]+/)
      .map(normalizeSkill)
      .filter(Boolean) as string[];
    const skills = Array.from(new Set(tokens)).filter(
      (t) => Object.values(SKILL_ALIASES).includes(t) || t.length > 2,
    );
    if (skills.length) {
      const scored = EMPLOYEES.map((e) => ({ e, ...scoreCandidate(e, skills) }))
        .filter((x) => x.score > 0)
        .sort(
          (a, b) =>
            b.score - a.score ||
            getYearsExperience(b.e) - getYearsExperience(a.e),
        );
      if (!scored.length)
        return `No employees found for skills: ${skills.join(", ")}.`;
      const top = scored.slice(0, 3);
      const topLines = top.map(
        (x, i) =>
          `${i + 1}. ${x.e.firstName} ${x.e.lastName} – ${x.e.role}, ${x.e.department} • ${getYearsExperience(x.e)} yrs • Matches: ${x.matches.join(", ")}`,
      );
      const allLines = scored.map(
        (x) =>
          `�� ${x.e.firstName} ${x.e.lastName} – ${x.e.role}, ${x.e.department} • ${getYearsExperience(x.e)} yrs • Matches: ${x.matches.join(", ")}`,
      );
      return `Top candidates:\n${topLines.join("\n")}\n\nAll matches:\n${allLines.join("\n")}`;
    }

    // Direct employee record lookups
    const ref = findEmployeeRef(text);
    if (ref) {
      if (/(email|mail)/.test(text))
        return `${ref.firstName} ${ref.lastName} email: ${ref.email}`;
      if (/(phone|contact|number)/.test(text))
        return `${ref.firstName} ${ref.lastName} phone: ${ref.contactNumber ?? "—"}`;
      if (/location/.test(text))
        return `${ref.firstName} ${ref.lastName} location: ${ref.location ?? "—"}`;
      if (/(status|role|position|department)/.test(text)) return fmtEmp(ref);
      return fmtEmp(ref);
    }

    // Counts and summaries
    if (/how many|count|total/.test(text)) {
      const statusMatch = /(active|on leave)/.exec(text);
      if (statusMatch) {
        const s = statusMatch[1].toLowerCase().includes("active")
          ? "Active"
          : "On Leave";
        const c = EMPLOYEES.filter((e) => e.status === s).length;
        return `${s} employees: ${c}`;
      }
      const dept = departments.find((d) => text.includes(d.toLowerCase()));
      if (dept) {
        const c = EMPLOYEES.filter(
          (e) => e.department.toLowerCase() === dept.toLowerCase(),
        ).length;
        return `${dept} headcount: ${c}`;
      }
      return `Total employees: ${EMPLOYEES.length}`;
    }

    // Department lists
    const deptMatch = departments.find((d) => text.includes(d.toLowerCase()));
    if (deptMatch && /(list|show|who|employees|team)/.test(text)) {
      return listByDept(deptMatch);
    }

    // Join date filters
    if (/joined/.test(text) || /hired/.test(text)) {
      const after =
        /(after|since)\s+(\d{4}|\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/.exec(text);
      const before = /(before)\s+(\d{4}|\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/.exec(
        text,
      );
      let list = EMPLOYEES.slice();
      if (after) {
        const d = parseMDY(after[2]) || new Date(parseInt(after[2], 10), 0, 1);
        list = list.filter(
          (e) =>
            (parseMDY(e.joiningDate)?.getTime() ?? 0) >= (d?.getTime() ?? 0),
        );
      }
      if (before) {
        const d =
          parseMDY(before[2]) || new Date(parseInt(before[2], 10), 11, 31);
        list = list.filter(
          (e) =>
            (parseMDY(e.joiningDate)?.getTime() ?? 0) <= (d?.getTime() ?? 0),
        );
      }
      if (!list.length) return "No matches for that date filter.";
      return list
        .map(
          (e) =>
            `• ${e.firstName} ${e.lastName} – ${e.role}, ${e.department} • Joined ${e.joiningDate}`,
        )
        .join("\n");
    }

    // Status filters
    if (/active/.test(text) || /on leave/.test(text)) {
      const s = /on leave/.test(text) ? "On Leave" : "Active";
      const list = EMPLOYEES.filter((e) => e.status === s);
      return `${s} (${list.length}):\n${list.map((e) => `• ${e.firstName} ${e.lastName} �� ${e.role}, ${e.department}`).join("\n")}`;
    }

    // Fallback quick answers retained
    if (text.includes("active")) return `Active employees: ${totalActive}`;
    if (text.includes("on leave") || text.includes("leave"))
      return `On leave: ${onLeave}`;
    if (text.includes("new hire") || text.includes("new hires"))
      return `New hires this month: ${newHiresThisMonth}`;
    if (text.includes("offboard") || text.includes("exit"))
      return `Pending offboarding: ${pendingOffboarding}`;
    const byName = EMPLOYEES.find((e) =>
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(text),
    );
    if (byName)
      return `${byName.firstName} ${byName.lastName} – ${byName.role}, ${byName.department}. Status: ${byName.status}.`;
    return "Try asking things like: 'EMP001 details', 'list Engineering employees', 'email of Sarah Mitchell', 'who joined after 2022', or 'count active employees'.";
  }

  function sendAi() {
    const query = aiInput;
    if (!query.trim()) return;
    const reply = getAssistantReply(query);
    setAiMsgs((m) => [
      ...m,
      { role: "user", content: query },
      { role: "assistant", content: reply },
    ]);
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
      const matchesSearch =
        !dcSearch.trim() ||
        d.title.toLowerCase().includes(dcSearch.toLowerCase());
      const matchesDept =
        dcDept === "all" || d.department.toLowerCase() === dcDept;
      const matchesType =
        dcDocType === "all" || d.type.toLowerCase() === dcDocType;
      const matchesCat = dcCategory2 === d.category;
      const days = dcDateFilter === "any" ? null : daysUntil(d.uploadDate);
      const matchesDate =
        dcDateFilter === "any" ||
        (typeof days === "number" &&
          days >= 0 &&
          days <= parseInt(dcDateFilter, 10));
      return (
        matchesSearch && matchesDept && matchesType && matchesCat && matchesDate
      );
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
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Leave and Attendance Management</h2>
            <Button type="button" variant="ghost" className="h-8 w-8 p-0" aria-label="Settings" onClick={() => navigate("/settings")}>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Centralized leave and attendance tracking for employees
          </p>
        </header>


        <Tabs value={tab} onValueChange={setTab} className="w-full">

          <TabsList className="mt-1 inline-flex items-center gap-1 rounded-full bg-muted p-1 shadow-sm font-poppins">
            <TabsTrigger
              value="attendance"
              className={cn(
                "rounded-full px-3 py-1.5 text-xs transition-colors",
                "data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:font-semibold",
                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground",
              )}
            >
              Attendance
            </TabsTrigger>
            <TabsTrigger
              value="leave"
              className={cn(
                "rounded-full px-3 py-1.5 text-xs transition-colors",
                "data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:font-semibold",
                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground",
              )}
            >
              Leave
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="mt-5">
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Total Present Today"
                value={86}
                icon={<User className="h-5 w-5" />}
              />
              <MetricCard
                label="On Leave"
                value={12}
                icon={<CalendarDays className="h-5 w-5" />}
              />
              <MetricCard
                label="Pending Leave Request"
                value={5}
                icon={<ArrowLeftRight className="h-5 w-5" />}
              />
              <MetricCard
                label="Today's Late Arrival"
                value={7}
                icon={<Clock className="h-5 w-5" />}
              />
            </section>

            <Tabs value={subTab} onValueChange={setSubTab} className="w-full">
              <TabsList className="mt-3 inline-flex items-center gap-0.5 rounded-full bg-muted p-0.5 shadow-sm font-poppins">
                <TabsTrigger
                  value="logs"
                  className={cn(
                    "rounded-full px-2 py-1 text-[11px] transition-colors",
                    "data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:font-semibold",
                    "data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground",
                  )}
                >
                  Logs
                </TabsTrigger>
                <TabsTrigger
                  value="timesheets"
                  className={cn(
                    "rounded-full px-2 py-1 text-[11px] transition-colors",
                    "data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:font-semibold",
                    "data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground",
                  )}
                >
                  Timesheets
                </TabsTrigger>
                <TabsTrigger
                  value="shift"
                  className={cn(
                    "rounded-full px-2 py-1 text-[11px] transition-colors",
                    "data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:font-semibold",
                    "data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground",
                  )}
                >
                  Shift
                </TabsTrigger>
              </TabsList>
              <TabsContent value="logs">
                <div className="rounded-2xl border bg-card p-4 shadow-sm mt-4">
            <section className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full flex-1 items-center gap-2">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, dept, or date"
                  className="h-8 text-xs max-w-md"
                />
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger className="h-8 w-32 text-xs">
                    <SelectValue placeholder="Department Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Department Filter</SelectItem>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-8 w-28 text-xs">
                    <SelectValue placeholder="Status Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Status Filter</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on leave">On Leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 self-end">
                <div className="flex items-center gap-3">
                  <Dialog open={openAddSingle} onOpenChange={setOpenAddSingle}>
                    <DialogContent className="rounded-2xl p-6 shadow-xl">
                      <DialogHeader>
                        <DialogTitle>Add Employee</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-3 text-sm">
                        <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
                          <div className="grid gap-1.5">
                            <Label
                              className="text-xs font-semibold"
                              htmlFor="emp-first"
                            >
                              First Name
                            </Label>
                            <Input
                              id="emp-first"
                              placeholder="First name"
                              required
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <Label
                              className="text-xs font-semibold"
                              htmlFor="emp-last"
                            >
                              Last Name
                            </Label>
                            <Input
                              id="emp-last"
                              placeholder="Last name"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label
                            className="text-xs font-semibold"
                            htmlFor="emp-email"
                          >
                            Email
                          </Label>
                          <Input
                            id="emp-email"
                            type="email"
                            placeholder="email@company.com"
                            required
                          />
                        </div>
                        <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
                          <div className="grid gap-1.5">
                            <Label
                              className="text-xs font-semibold"
                              htmlFor="emp-role"
                            >
                              Role / Position
                            </Label>
                            <Input
                              id="emp-role"
                              placeholder="e.g., Software Engineer"
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold">
                              Department
                            </Label>
                            <Select>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((d) => (
                                  <SelectItem key={d} value={d.toLowerCase()}>
                                    {d}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
                          <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold">
                              Status
                            </Label>
                            <Select>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="on leave">
                                  On Leave
                                </SelectItem>
                                <SelectItem value="inactive">
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-1.5">
                            <Label
                              className="text-xs font-semibold"
                              htmlFor="emp-join"
                            >
                              Joined Date
                            </Label>
                            <Input id="emp-join" type="date" />
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
                          <Button
                            className="rounded-md bg-[#2563eb] px-4 text-white hover:bg-[#1d4ed8]"
                            onClick={() =>
                              toast({
                                title: "Employee added",
                                description: "New employee has been added.",
                              })
                            }
                          >
                            Save
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="h-8 w-[140px] text-xs"
                    />
                  </div>
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
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 rounded-md px-3 text-xs bg-white text-[#374151] border border-[#d1d5db] hover:bg-gray-50"
                >
                  <Download className="mr-1.5 h-4 w-4" /> Export
                </Button>
              </div>
            </section>

            {view === "table" ? (
              <section className="mt-4">
                <div className="overflow-hidden rounded-lg border">
                  <Table className="text-xs leading-tight">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">
                          Employee ID
                        </TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">
                          Employee Name
                        </TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">
                          System Date
                        </TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">
                          Department
                        </TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">
                          Punch In
                        </TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">
                          Punch Out
                        </TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">
                          Status
                        </TableHead>
                        <TableHead className="px-2 py-1 text-center text-xs font-semibold uppercase leading-tight">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageItems.map((e) => (
                        <TableRow key={e.id} className={cn("hover:bg-transparent")}>
                          <TableCell className="px-2 py-1 text-xs leading-tight font-medium text-foreground/90">
                            {e.id}
                          </TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1E4DD8] text-white font-semibold text-[10px]">
                                {(e.firstName?.[0] || "").toUpperCase()}
                                {(e.lastName?.[0] || "").toUpperCase()}
                              </div>
                              <span className="text-xs font-semibold text-foreground">
                                {e.firstName} {e.lastName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">
                            {todayStr}
                          </TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">
                            {e.department}
                          </TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">{getInOutTimes(e).in}</TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">{getInOutTimes(e).out}</TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">{getAttendanceStatus(e)}</TableCell>
                          <TableCell className="px-2 py-1 text-center text-xs leading-tight">
                            <RowActions employee={e} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-end gap-2 border-t px-2 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {start + 1}-{end} of {filtered.length}
                      </span>
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
                        onClick={() =>
                          setPage((p) => Math.min(totalPages - 1, p + 1))
                        }
                        disabled={page >= totalPages - 1}
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((e) => (
                  <div
                    key={e.id}
                    className="bg-white rounded-[12px] py-4 px-5"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E4DD8] text-white font-semibold text-[14px]">
                          {(e.firstName?.[0] || "").toUpperCase()}
                          {(e.lastName?.[0] || "").toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-[16px] font-bold text-[#1A1A1A]">
                              {e.firstName} {e.lastName}
                            </div>
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            ID: {e.id}
                          </div>
                        </div>
                      </div>
                      <RowActions employee={e} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-[11px] text-muted-foreground">
                          Date
                        </div>
                        <div className="text-foreground">{todayStr}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-muted-foreground">
                          Department
                        </div>
                        <div className="truncate text-foreground">
                          {e.department}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-muted-foreground">
                          In
                        </div>
                        <div className="text-foreground">{getInOutTimes(e).in}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-muted-foreground">
                          Out
                        </div>
                        <div className="text-foreground">{getInOutTimes(e).out}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[11px] text-muted-foreground">
                          Status
                        </div>
                        <div className="text-foreground">{getAttendanceStatus(e)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}
                </div>
              </TabsContent>
              <TabsContent value="timesheets">
                <div className="rounded-2xl border bg-card p-4 shadow-sm mt-4 font-poppins flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Input
                      placeholder="Search by name"
                      className="h-10 w-[280px] rounded-[6px] border border-[#D1D5DB] px-3 text-[14px] font-normal text-[#111827] placeholder:text-[#9CA3AF]"
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#6B7280]">
                        {tsRange === "monthly" ? monthlyDisplay : tsRange === "weekly" ? weeklyDisplay : `Today • ${todaySlash}`}
                      </span>
                      <div className="flex items-center gap-1">
                        {(["daily", "weekly", "monthly"] as const).map((k) => (
                          <button
                            key={k}
                            type="button"
                            onClick={() => setTsRange(k)}
                            className={cn(
                              "rounded-full px-4 py-1.5 text-[13px] transition",
                              tsRange === k
                                ? "bg-[#2563EB] text-white"
                                : "text-[#9CA3AF]",
                            )}
                          >
                            {k[0].toUpperCase() + k.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {tsRange === "weekly" ? (
                    <div className="overflow-hidden rounded-lg border border-[#E5E7EB]">
                      <Table className="text-sm">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563]">EMPLOYEE ID</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563]">EMPLOYEE NAME</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563]">MON 10/13</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563]">TUE 10/14</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563]">WED 10/15</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563]">THU 10/16</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563]">FRI 10/17</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563]">SAT 10/18</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563]">SUN 10/19</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563]">SCHEDULED</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563]">WORKED</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {WEEKLY_DATA.slice(weeklyPage * itemsPerPage, (weeklyPage + 1) * itemsPerPage).map((r) => (
                            <TableRow key={r.empId} className="hover:bg-[#F9FAFB]">
                              <TableCell className="px-3 py-2 text-[#111827]">{r.empId.replace('E-', '')}</TableCell>
                              <TableCell className="px-3 py-2 text-[#111827]">{r.name}</TableCell>
                              <TableCell className="px-3 py-2 text-[#111827]">{r.mon}</TableCell>
                              <TableCell className="px-3 py-2 text-[#111827]">{r.tue}</TableCell>
                              <TableCell className="px-3 py-2 text-[#111827]">{r.wed}</TableCell>
                              <TableCell className="px-3 py-2 text-[#111827]">{r.thu}</TableCell>
                              <TableCell className="px-3 py-2 text-[#111827]">{r.fri}</TableCell>
                              <TableCell className="px-3 py-2 text-[#111827]">{r.sat}</TableCell>
                              <TableCell className="px-3 py-2 text-[#111827]">{r.sun}</TableCell>
                              <TableCell className="px-3 py-2 text-[#111827] flex items-center justify-center">{r.scheduled}</TableCell>
                              <TableCell className="px-3 py-2 text-[#111827]">{r.worked}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex items-center justify-end gap-2 border-t px-3 py-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            className="h-7 w-7 rounded-md p-0"
                            onClick={() => setWeeklyPage(Math.max(0, weeklyPage - 1))}
                            disabled={weeklyPage === 0}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-[#6B7280] text-xs">{weeklyPage + 1}</span>
                          <Button
                            variant="outline"
                            className="h-7 w-7 rounded-md p-0"
                            onClick={() => setWeeklyPage(weeklyPage + 1)}
                            disabled={(weeklyPage + 1) * itemsPerPage >= WEEKLY_DATA.length}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : tsRange === "monthly" ? (
                    <div className="overflow-hidden rounded-lg border border-[#E5E7EB]">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="border-b border-[#E5E7EB] px-2 py-2 text-[10px] font-semibold text-[#4B5563]">EMPLOYEE ID</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-2 py-2 text-[10px] font-semibold text-[#4B5563]">EMPLOYEE NAME</TableHead>
                            {Array.from({ length: 31 }).map((_, i) => (
                              <TableHead key={`day-${i + 1}`} className="border-b border-[#E5E7EB] px-1 py-2 text-[9px] font-semibold text-[#4B5563] text-center">{i + 1}</TableHead>
                            ))}
                            <TableHead className="border-b border-[#E5E7EB] px-2 py-2 text-[10px] font-semibold text-red-600">HOURS WORKED</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-2 py-2 text-[10px] font-semibold text-red-600">SCHEDULED</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {MONTHLY_DATA.slice(monthlyPage * itemsPerPage, (monthlyPage + 1) * itemsPerPage).map((r) => (
                            <TableRow key={r.empId} className="hover:bg-[#F9FAFB]">
                              <TableCell className="px-2 py-1 text-[11px] text-[#111827]">{r.empId}</TableCell>
                              <TableCell className="px-2 py-1 text-[11px] text-[#111827]">{r.name}</TableCell>
                              {r.days.map((day, idx) => (
                                <TableCell key={`${r.empId}-day-${idx}`} className="px-1 py-1 text-[10px] text-[#111827] text-center">{day}</TableCell>
                              ))}
                              <TableCell className="px-2 py-1 text-[11px] text-red-600 font-semibold">{r.hoursWorked}</TableCell>
                              <TableCell className="px-2 py-1 text-[11px] text-red-600 font-semibold flex items-center justify-center">{r.scheduled}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex items-center justify-end gap-2 border-t px-3 py-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            className="h-7 w-7 rounded-md p-0"
                            onClick={() => setMonthlyPage(Math.max(0, monthlyPage - 1))}
                            disabled={monthlyPage === 0}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-[#6B7280] text-xs">{monthlyPage + 1}</span>
                          <Button
                            variant="outline"
                            className="h-7 w-7 rounded-md p-0"
                            onClick={() => setMonthlyPage(monthlyPage + 1)}
                            disabled={(monthlyPage + 1) * itemsPerPage >= MONTHLY_DATA.length}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-[#E5E7EB]">
                      <Table className="text-sm">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563]">EMPLOYEE ID</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563]">EMPLOYEE NAME</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563] text-center">SCHEDULED</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563]">WORKED</TableHead>
                            <TableHead className="border-b border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#4B5563]">{tsDayHeader.toUpperCase()}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {TS_ROWS.map((r) => (
                            <TableRow key={r.empId} className="hover:bg-[#F9FAFB]">
                              <TableCell className="px-3 py-2 text-[#111827]">{r.empId}</TableCell>
                              <TableCell className="px-3 py-2 text-[#111827]">{r.name}</TableCell>
                              <TableCell className="px-3 py-2 text-[#111827] flex items-center justify-center">{r.scheduled}</TableCell>
                              <TableCell className="px-3 py-2 text-[#111827]">{r.worked}</TableCell>
                              <TableCell className="px-3 py-2 text-[#111827]">{r.day}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex items-center justify-end gap-2 border-t px-3 py-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            className="h-7 w-7 rounded-md p-0"
                            disabled
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="h-7 w-7 rounded-md p-0"
                            disabled
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="hidden rounded-2xl border bg-card p-4 shadow-sm mt-4">
            <section className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full flex-1 items-center gap-2">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, dept, or date"
                  className="h-8 text-xs max-w-md"
                />
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger className="h-8 w-32 text-xs">
                    <SelectValue placeholder="Department Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Department Filter</SelectItem>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-8 w-28 text-xs">
                    <SelectValue placeholder="Status Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Status Filter</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on leave">On Leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 self-end">
                <div className="flex items-center gap-3">
                  <Dialog open={openAddSingle} onOpenChange={setOpenAddSingle}>
                    <DialogContent className="rounded-2xl p-6 shadow-xl">
                      <DialogHeader>
                        <DialogTitle>Add Employee</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-3 text-sm">
                        <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
                          <div className="grid gap-1.5">
                            <Label
                              className="text-xs font-semibold"
                              htmlFor="emp-first"
                            >
                              First Name
                            </Label>
                            <Input
                              id="emp-first"
                              placeholder="First name"
                              required
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <Label
                              className="text-xs font-semibold"
                              htmlFor="emp-last"
                            >
                              Last Name
                            </Label>
                            <Input
                              id="emp-last"
                              placeholder="Last name"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label
                            className="text-xs font-semibold"
                            htmlFor="emp-email"
                          >
                            Email
                          </Label>
                          <Input
                            id="emp-email"
                            type="email"
                            placeholder="email@company.com"
                            required
                          />
                        </div>
                        <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
                          <div className="grid gap-1.5">
                            <Label
                              className="text-xs font-semibold"
                              htmlFor="emp-role"
                            >
                              Role / Position
                            </Label>
                            <Input
                              id="emp-role"
                              placeholder="e.g., Software Engineer"
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold">
                              Department
                            </Label>
                            <Select>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((d) => (
                                  <SelectItem key={d} value={d.toLowerCase()}>
                                    {d}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
                          <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold">
                              Status
                            </Label>
                            <Select>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="on leave">
                                  On Leave
                                </SelectItem>
                                <SelectItem value="inactive">
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-1.5">
                            <Label
                              className="text-xs font-semibold"
                              htmlFor="emp-join"
                            >
                              Joined Date
                            </Label>
                            <Input id="emp-join" type="date" />
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
                          <Button
                            className="rounded-md bg-[#2563eb] px-4 text-white hover:bg-[#1d4ed8]"
                            onClick={() =>
                              toast({
                                title: "Employee added",
                                description: "New employee has been added.",
                              })
                            }
                          >
                            Save
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="h-8 w-[140px] text-xs"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 rounded-md px-3 text-xs bg-white text-[#374151] border border-[#d1d5db] hover:bg-gray-50"
                  >
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
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">
                          Employee ID
                        </TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">
                          Employee Name
                        </TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">
                          System Date
                        </TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">
                          Department
                        </TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">
                          Punch In
                        </TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">
                          Punch Out
                        </TableHead>
                        <TableHead className="px-2 py-1 text-xs font-semibold uppercase leading-tight">
                          Status
                        </TableHead>
                        <TableHead className="px-2 py-1 text-center text-xs font-semibold uppercase leading-tight">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageItems.map((e) => (
                        <TableRow key={e.id} className={cn("hover:bg-transparent")}>
                          <TableCell className="px-2 py-1 text-xs leading-tight font-medium text-foreground/90">
                            {e.id}
                          </TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1E4DD8] text-white font-semibold text-[10px]">
                                {(e.firstName?.[0] || "").toUpperCase()}
                                {(e.lastName?.[0] || "").toUpperCase()}
                              </div>
                              <span className="text-xs font-semibold text-foreground">
                                {e.firstName} {e.lastName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">
                            {todayStr}
                          </TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">
                            {e.department}
                          </TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">{getInOutTimes(e).in}</TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">{getInOutTimes(e).out}</TableCell>
                          <TableCell className="px-2 py-1 text-xs leading-tight">{getAttendanceStatus(e)}</TableCell>
                          <TableCell className="px-2 py-1 text-center text-xs leading-tight">
                            <RowActions employee={e} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-end gap-2 border-t px-2 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {start + 1}-{end} of {filtered.length}
                      </span>
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
                        onClick={() =>
                          setPage((p) => Math.min(totalPages - 1, p + 1))
                        }
                        disabled={page >= totalPages - 1}
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((e) => (
                  <div
                    key={e.id}
                    className="bg-white rounded-[12px] py-4 px-5"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E4DD8] text-white font-semibold text-[14px]">
                          {(e.firstName?.[0] || "").toUpperCase()}
                          {(e.lastName?.[0] || "").toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-[16px] font-bold text-[#1A1A1A]">
                              {e.firstName} {e.lastName}
                            </div>
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            ID: {e.id}
                          </div>
                        </div>
                      </div>
                      <RowActions employee={e} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-[11px] text-muted-foreground">
                          Date
                        </div>
                        <div className="text-foreground">{todayStr}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-muted-foreground">
                          Department
                        </div>
                        <div className="truncate text-foreground">
                          {e.department}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-muted-foreground">
                          In
                        </div>
                        <div className="text-foreground">{getInOutTimes(e).in}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-muted-foreground">
                          Out
                        </div>
                        <div className="text-foreground">{getInOutTimes(e).out}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[11px] text-muted-foreground">
                          Status
                        </div>
                        <div className="text-foreground">{getAttendanceStatus(e)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}
                </div>
              </TabsContent>
              <TabsContent value="shift">
                <div className="rounded-2xl border bg-card p-4 shadow-sm mt-4 font-poppins flex flex-col gap-3">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-sm text-[#6B7280]">Date</span>
                    <Popover open={openFromPicker} onOpenChange={setOpenFromPicker}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-9 w-[120px] rounded-[6px] border border-[#D1D5DB] px-[10px] text-[14px] text-[#111827] justify-between text-left font-normal"
                        >
                          <span>{new Date(shiftFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <CalendarDays className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={new Date(shiftFrom)}
                          onSelect={(date) => {
                            if (date) {
                              setShiftFrom(date.toISOString().slice(0, 10));
                              setOpenFromPicker(false);
                            }
                          }}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover open={openToPicker} onOpenChange={setOpenToPicker}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-9 w-[120px] rounded-[6px] border border-[#D1D5DB] px-[10px] text-[14px] text-[#111827] justify-between text-left font-normal"
                        >
                          <span>{new Date(shiftTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <CalendarDays className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={new Date(shiftTo)}
                          onSelect={(date) => {
                            if (date) {
                              setShiftTo(date.toISOString().slice(0, 10));
                              setOpenToPicker(false);
                            }
                          }}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
                    {shiftDays.map((d) => (
                      <div
                        key={d.day}
                        className="flex flex-col gap-2 rounded-[8px] border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] min-h-[200px]"
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(d.day)}
                      >
                        <div className="flex items-center justify-between text-[12px] font-semibold text-[#111827]">
                          <span>{d.day}</span>
                          <span className="text-[10px] font-normal text-[#6B7280]">{d.slots.length} slots</span>
                        </div>
                        <div className="space-y-1.5">
                          {d.slots.map((s) => (
                            <div
                              key={s.id}
                              draggable
                              onDragStart={() => handleDragStart(d.day, s.id)}
                              className="rounded-[6px] border border-[#E5E7EB] bg-[#F9FAFB] px-[10px] py-[6px] text-[13px] text-[#111827] cursor-move hover:bg-[#E5E7EB] transition-colors"
                            >
                              {s.name} - {s.time}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="leave" className="mt-6">
            <div className="rounded-2xl border bg-card p-4 shadow-sm font-poppins">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setLeaveView("requests")}
                    className={cn(
                      "rounded-full px-5 py-2 text-sm font-medium transition",
                      leaveView === "requests" ? "bg-[#2563EB] text-white" : "text-[#9CA3AF]",
                    )}
                  >
                    Requests
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaveView("balances")}
                    className={cn(
                      "rounded-full px-5 py-2 text-sm font-medium transition",
                      leaveView === "balances" ? "bg-[#2563EB] text-white" : "text-[#9CA3AF]",
                    )}
                  >
                    Balances
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    className="h-9 rounded-md px-3 text-sm font-medium bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    onClick={() => setLrCreateOpen(true)}
                  >
                    Create Leave Request
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 rounded-md px-3 text-xs bg-white text-[#374151] border border-[#d1d5db] hover:bg-gray-50"
                    onClick={exportLeavesCSV}
                  >
                    <Download className="mr-1.5 h-4 w-4" /> Export
                  </Button>
                </div>
              </div>

              {leaveView === "requests" ? (
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex-shrink-0 w-64">
                      <Input
                        type="text"
                        placeholder="Search Employee name, ID..."
                        value={lrSearch}
                        onChange={(e) => {
                          setLrSearch(e.target.value);
                          setLrPage(0);
                        }}
                        className="h-9 rounded-md border border-[#E5E7EB] px-3 text-sm"
                      />
                    </div>
                    <Select value={lrTypeFilter} onValueChange={(value) => {
                      setLrTypeFilter(value);
                      setLrPage(0);
                    }}>
                      <SelectTrigger className="w-40 h-9 rounded-md border border-[#E5E7EB]">
                        <SelectValue placeholder="All Leave Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Leave Types</SelectItem>
                        <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                        <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                        <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="overflow-hidden rounded-lg border">
                    <Table className="text-sm">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-3 py-3 text-sm font-semibold text-[#4B5563]">EMPLOYEE ID</TableHead>
                        <TableHead className="px-3 py-3 text-sm font-semibold text-[#4B5563]">EMPLOYEE NAME</TableHead>
                        <TableHead className="px-3 py-3 text-sm font-semibold text-[#4B5563]">LEAVE TYPE</TableHead>
                        <TableHead className="px-3 py-3 text-sm font-semibold text-[#4B5563]">PERIOD FROM</TableHead>
                        <TableHead className="px-3 py-3 text-sm font-semibold text-[#4B5563]">PERIOD TO</TableHead>
                        <TableHead className="px-3 py-3 text-sm font-semibold text-[#4B5563]">STATUS</TableHead>
                        <TableHead className="px-3 py-3 text-sm font-semibold text-[#4B5563]">ACTION</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lrItems.map((req) => (
                        <TableRow key={req.empId} className="hover:bg-[#F9FAFB]">
                          <TableCell className="px-3 py-2">{req.empId}</TableCell>
                          <TableCell className="px-3 py-2">{req.employee}</TableCell>
                          <TableCell className="px-3 py-2">{req.type}</TableCell>
                          <TableCell className="px-3 py-2">{req.from}</TableCell>
                          <TableCell className="px-3 py-2">{req.to}</TableCell>
                          <TableCell className="px-3 py-2">{req.status}</TableCell>
                          <TableCell className="px-3 py-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    const updated = leaves.map(r => r.empId === req.empId ? {...r, status: "Approved"} : r);
                                    setLeaves(updated);
                                    toast({ title: "Leave Request Approved", description: `${req.employee}'s leave request has been approved.` });
                                  }}
                                >
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    const updated = leaves.map(r => r.empId === req.empId ? {...r, status: "Rejected"} : r);
                                    setLeaves(updated);
                                    toast({ title: "Leave Request Rejected", description: `${req.employee}'s leave request has been rejected.` });
                                  }}
                                >
                                  Reject
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    </Table>
                    <div className="flex items-center justify-between px-3 py-3 border-t border-[#E5E7EB]">
                      <div className="text-xs text-[#6B7280]">
                        {lrStart + 1}–{lrEnd} of {lrTotal} results
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => setLrPage(Math.max(0, lrPage - 1))}
                          disabled={lrPage === 0}
                          title="Previous page"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-[#6B7280]">
                          Page {lrPage + 1} of {lrTotalPages}
                        </span>
                        <Button
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => setLrPage(Math.min(lrTotalPages - 1, lrPage + 1))}
                          disabled={lrPage >= lrTotalPages - 1}
                          title="Next page"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border">
                  <div className="flex items-center bg-[#F9FAFB] border-b border-[#E5E7EB] px-6 py-4 gap-6">
                    <div className="text-xs font-semibold text-[#4B5563] w-28 text-left">EMPLOYEE ID</div>
                    <div className="text-xs font-semibold text-[#4B5563] w-40 text-left">EMPLOYEE NAME</div>
                    <div className="text-xs font-semibold text-[#4B5563] w-40 text-left">DEPARTMENT</div>
                    <div className="text-xs font-semibold text-[#4B5563] flex-1 text-left">POSITION</div>
                    <div className="text-xs font-semibold text-[#4B5563] w-20 text-center">ACTION</div>
                  </div>
                  {EMPLOYEE_LEAVE_BALANCES.map((emp) => (
                    <div key={emp.empId}>
                      <button
                        type="button"
                        onClick={() => setExpandedEmployee(expandedEmployee === emp.empId ? null : emp.empId)}
                        className="w-full flex items-center hover:bg-white transition border-b border-[#E5E7EB] px-6 py-4 gap-6"
                      >
                        <div className="text-sm text-[#111827] w-28 text-left">{emp.empId}</div>
                        <div className="text-sm font-medium text-[#111827] w-40 text-left">{emp.name}</div>
                        <div className="text-sm text-[#111827] w-40 text-left">{emp.department}</div>
                        <div className="text-sm text-[#111827] flex-1 text-left truncate">{emp.position}</div>
                        <div className="flex items-center justify-center w-20">
                          {expandedEmployee === emp.empId ? (
                            <ChevronLeft className="h-5 w-5 text-[#111827] rotate-90 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-[#111827] flex-shrink-0" />
                          )}
                        </div>
                      </button>
                      {expandedEmployee === emp.empId && (
                        <div className="bg-[#F9FAFB] px-4 py-3 border-t">
                          <table className="w-full text-sm">
                            <thead>
                              <tr>
                                <th className="text-left py-2 px-2 text-[#4B5563] font-semibold border-b border-[#E5E7EB]">Leave Type</th>
                                <th className="text-left py-2 px-2 text-[#4B5563] font-semibold border-b border-[#E5E7EB]">Leave Taken</th>
                                <th className="text-left py-2 px-2 text-[#4B5563] font-semibold border-b border-[#E5E7EB]">Leave Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {emp.balances.map((balance, idx) => (
                                <tr key={idx} className="hover:bg-white transition">
                                  <td className="py-2 px-2 text-[#111827]">{balance.leaveType}</td>
                                  <td className="py-2 px-2 text-[#111827]">{balance.leaveTaken}</td>
                                  <td className="py-2 px-2 text-[#111827]">{balance.leaveBalance}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <div className="border-b border-[#E5E7EB]"></div>
                    </div>
                  ))}
                </div>
              )}

              <Dialog open={lrCreateOpen} onOpenChange={setLrCreateOpen}>
                <DialogContent className="rounded-2xl p-6 shadow-xl max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Leave Request</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 text-sm">
                    <div className="grid gap-1.5">
                      <Label className="text-xs font-semibold">Employee Name</Label>
                      <Select value={lrEmployee} onValueChange={setLrEmployee}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {EMPLOYEES.map((emp) => (
                            <SelectItem key={emp.id} value={emp.firstName + " " + emp.lastName}>
                              {emp.firstName} {emp.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-xs font-semibold">Leave Type</Label>
                      <Select value={lrType} onValueChange={setLrType}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                          <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                          <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <Label className="text-xs font-semibold">Period From</Label>
                        <Input
                          type="date"
                          value={lrFrom}
                          onChange={(e) => setLrFrom(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-xs font-semibold">Period To</Label>
                        <Input
                          type="date"
                          value={lrTo}
                          onChange={(e) => setLrTo(e.target.value)}
                          className="h-9 text-xs"
                        />
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
                    <Button
                      className="rounded-md bg-[#2563eb] px-4 text-white hover:bg-[#1d4ed8]"
                      onClick={() => {
                        if (lrEmployee && lrType && lrFrom && lrTo) {
                          const newRequest = {
                            empId: `LR${Math.floor(Math.random() * 10000)}`,
                            employee: lrEmployee,
                            type: lrType,
                            from: lrFrom,
                            to: lrTo,
                            days: Math.ceil((new Date(lrTo).getTime() - new Date(lrFrom).getTime()) / (1000 * 60 * 60 * 24)) + 1,
                            status: "Pending",
                          };
                          setLeaves((prev) => [...prev, newRequest]);
                          setLrCreateOpen(false);
                          setLrEmployee("");
                          setLrType("Annual Leave");
                          setLrFrom(new Date().toISOString().slice(0, 10));
                          setLrTo(new Date().toISOString().slice(0, 10));
                          toast({
                            title: "Leave Request Created",
                            description: `Leave request submitted for ${lrEmployee} from ${lrFrom} to ${lrTo}.`,
                          });
                        }
                      }}
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
          <TabsContent value="__disabled__" className="mt-6">
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <div className="overflow-hidden rounded-lg border">
                <Table className="text-xs leading-tight">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-3 py-2 text-xs font-semibold uppercase leading-tight">Employee ID</TableHead>
                      <TableHead className="px-3 py-2 text-xs font-semibold uppercase leading-tight">Employee Name</TableHead>
                      <TableHead className="px-3 py-2 text-xs font-semibold uppercase leading-tight">Dept</TableHead>
                      <TableHead className="px-3 py-2 text-xs font-semibold uppercase leading-tight">Shift</TableHead>
                      <TableHead className="px-3 py-2 text-center text-xs font-semibold uppercase leading-tight">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shiftRows.map((r, i) => (
                      <TableRow key={i} className="hover:bg-transparent">
                        <TableCell className="px-2 py-1 text-xs leading-tight">{r.empId}</TableCell>
                        <TableCell className="px-3 py-2 text-xs leading-tight">{r.employee}</TableCell>
                        <TableCell className="px-3 py-2 text-xs leading-tight">{r.dept}</TableCell>
                        <TableCell className="px-3 py-2 text-xs leading-tight">{r.shift}</TableCell>
                        <TableCell className="px-3 py-2 text-center text-xs leading-tight">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                aria-label={`Edit shift for ${r.employee}`}
                              >
                                <EllipsisVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => { setShiftEditIndex(i); setShiftEditValue(r.shift); }}>
                                Edit Shift
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
                <Dialog open={shiftEditIndex !== null} onOpenChange={(o) => { if (!o) setShiftEditIndex(null); }}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-base font-semibold">Edit Shift</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Select shift</div>
                      <div className="flex items-center gap-2">
                        {(["Day","Night","Early"] as const).map((opt) => (
                          <Button
                            key={opt}
                            type="button"
                            variant={shiftEditValue === opt ? "default" : "outline"}
                            className="h-8 rounded-md px-3 text-xs"
                            onClick={() => setShiftEditValue(opt)}
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShiftEditIndex(null)}>Cancel</Button>
                      <Button
                        className="h-9 rounded-md bg-[#2563EB] px-4 text-sm font-medium text-white hover:bg-[#1D4ED8]"
                        onClick={() => {
                          if (shiftEditIndex !== null) {
                            setShiftRows((prev) =>
                              prev.map((x, idx) => (idx === shiftEditIndex ? { ...x, shift: shiftEditValue } : x)),
                            );
                          }
                          setShiftEditIndex(null);
                        }}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </div>
          </TabsContent>
          <TabsContent value="leave-legacy" className="mt-6">
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <div className="overflow-hidden rounded-lg border">
                <Table className="text-xs leading-tight">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-3 py-2 text-xs font-semibold uppercase leading-tight">Employee</TableHead>
                      <TableHead className="px-3 py-2 text-xs font-semibold uppercase leading-tight">Type</TableHead>
                      <TableHead className="px-3 py-2 text-xs font-semibold uppercase leading-tight">Balance</TableHead>
                      <TableHead className="px-3 py-2 text-center text-xs font-semibold uppercase leading-tight">Adjust</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balances.map((r, i) => (
                      <TableRow key={i} className="hover:bg-transparent">
                        <TableCell className="px-3 py-2 text-xs leading-tight">{r.employee}</TableCell>
                        <TableCell className="px-3 py-2 text-xs leading-tight">{r.type}</TableCell>
                        <TableCell className="px-3 py-2 text-xs leading-tight">{r.balance} days</TableCell>
                        <TableCell className="px-3 py-2 text-center text-xs leading-tight">
                          <div className="inline-flex items-center gap-2">
                            <Button
                              type="button"
                              className="h-7 rounded-md bg-[#F3F4F6] px-3 text-xs font-medium text-black hover:bg-[#e5e7eb]"
                              onClick={() =>
                                setBalances((prev) =>
                                  prev.map((x, idx) =>
                                    idx === i ? { ...x, balance: Math.max(0, x.balance - 1) } : x,
                                  ),
                                )
                              }
                            >
                              -1
                            </Button>
                            <Button
                              type="button"
                              className="h-7 rounded-md bg-[#6C4DFF] px-3 text-xs font-medium text-white hover:bg-[#5a3fff]"
                              onClick={() =>
                                setBalances((prev) =>
                                  prev.map((x, idx) =>
                                    idx === i ? { ...x, balance: x.balance + 1 } : x,
                                  ),
                                )
                              }
                            >
                              +1
                            </Button>
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
              <button
                onClick={() => setAiOpen(false)}
                aria-label="Close"
                className="rounded p-1 hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-72 space-y-2 overflow-auto px-3 py-2 text-sm">
              {aiMsgs.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-md px-2 py-1.5",
                      m.role === "user"
                        ? "bg-[#2563eb] text-white"
                        : "bg-muted",
                    )}
                  >
                    {m.content}
                  </div>
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
              <Button
                type="button"
                onClick={sendAi}
                className="h-8 px-2 text-xs"
              >
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
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editIn, setEditIn] = useState("09:05");
  const [editOut, setEditOut] = useState("17:30");
  const [editStatus, setEditStatus] = useState<string>("Late");
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
              setEditOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
          <button
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left hover:bg-accent"
            onClick={() => {
              setOpen(false);
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      )}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Edit Attendance</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor={`in-${employee.id}`}>In</Label>
              <Input
                id={`in-${employee.id}`}
                type="time"
                value={editIn}
                onChange={(e) => setEditIn(e.target.value)}
                placeholder="09:05 am"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`out-${employee.id}`}>Out</Label>
              <Input
                id={`out-${employee.id}`}
                type="time"
                value={editOut}
                onChange={(e) => setEditOut(e.target.value)}
                placeholder="05:30 pm"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Status</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Late">Late</SelectItem>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="h-9 rounded-md bg-[#6C4DFF] px-4 text-sm font-medium text-white hover:bg-[#5a3fff]"
              onClick={() => setEditOpen(false)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Are you sure to delete?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="h-9 rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
              onClick={() => setDeleteOpen(false)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
