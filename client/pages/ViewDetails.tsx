import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/local/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, MapPin, Clipboard, Plus, Pencil, CheckCircle, Calendar, Trash2, Send, Search, Download, Eye, FileText, File, Edit, FileDown, LogOut, ArrowLeft } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Toggle } from "@/components/ui/toggle";

export default function ViewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const tasks = [
    { id: "t1", title: "Revoke system access" },
    { id: "t2", title: "Collect company laptop" },
    { id: "t3", title: "Transfer project ownership" },
    { id: "t4", title: "Finalize payroll adjustments" },
    { id: "t5", title: "Conduct exit interview" },
  ];

  const offboardingTasks = [
    {
      id: "ot1",
      title: "HR Documentation Update",
      department: "HR",
      priority: "High",
      description: "Complete all necessary HR paperwork and documentation",
      assignedTo: "Jane Smith",
      dueDate: "2024-01-05",
      completedDate: "2024-01-04",
      status: "Completed",
    },
    {
      id: "ot2",
      title: "IT Asset Collection",
      department: "IT",
      priority: "High",
      description: "Collect all company IT equipment and devices",
      assignedTo: "Mike Chen",
      dueDate: "2024-01-10",
      completedDate: null,
      status: "In Progress",
    },
    {
      id: "ot3",
      title: "Exit Interview Scheduling",
      department: "HR",
      priority: "Medium",
      description: "Schedule and conduct exit interview with employee",
      assignedTo: "Lisa Davis",
      dueDate: "2024-01-12",
      completedDate: null,
      status: "Pending",
    },
    {
      id: "ot4",
      title: "Access Revocation",
      department: "Security",
      priority: "High",
      description: "Revoke all system and physical access permissions",
      assignedTo: "Security Team",
      dueDate: "2024-01-15",
      completedDate: null,
      status: "Pending",
    },
  ];
  const initialComments = [
    {
      id: "c1",
      author: "Jane Smith",
      role: "HR Manager",
      timestamp: "2023-12-15 09:30 AM",
      text: "Employee submitted resignation letter. Two weeks notice provided as per policy.",
      initials: "JS",
    },
    {
      id: "c2",
      author: "Mike Chen",
      role: "IT Administrator",
      timestamp: "2023-12-18 02:15 PM",
      text: "Asset collection reminder sent to employee. Meeting scheduled for next Tuesday.",
      initials: "MC",
    },
  ];

  const [caseComments, setCaseComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const [documents, setDocuments] = useState([
    {
      id: "d1",
      name: "Resignation Letter.pdf",
      type: "PDF",
      status: "Final",
      size: "0 KB",
      date: "2023-12-15",
      uploader: "Sarah Johnson",
      category: "General Documents",
      note: "Document uploaded for Sarah Johnson",
    },
    {
      id: "d2",
      name: "HR Termination Checklist.pdf",
      type: "PDF",
      status: "Final",
      size: "0 KB",
      date: "2023-12-16",
      uploader: "Jane Smith",
      category: "General Documents",
      note: "Document uploaded for Sarah Johnson",
    },
    {
      id: "d3",
      name: "Asset Inventory.xlsx",
      type: "XLSX",
      status: "Final",
      size: "0 KB",
      date: "2023-12-18",
      uploader: "Mike Chen",
      category: "General Documents",
      note: "Document uploaded for Sarah Johnson",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedForExport, setSelectedForExport] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [stage, setStage] = useState("HR Documentation Update");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDepartment, setNewTaskDepartment] = useState("HR");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [isExportMode, setIsExportMode] = useState(false);
  const [viewDocument, setViewDocument] = useState<string | null>(null);

  const [timelineFilter, setTimelineFilter] = useState("All Events");

  const [systemAccess, setSystemAccess] = useState({
    email: false,
    github: false,
    bamboo: false,
    netsuite: false,
  });

  const formatDateOnly = (dateString: string) => {
    const date = new Date(dateString);
    return (
      String(date.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(date.getDate()).padStart(2, "0") +
      "/" +
      date.getFullYear()
    );
  };

  const timelineEvents = [
    {
      id: "te1",
      title: "Case Created",
      timestamp: "12/15/2023",
      description: "",
      status: "completed",
      dotColor: "#22C55E",
    },
    {
      id: "te2",
      title: "HR Documentation Completed",
      timestamp: "01/04/2024",
      description: "",
      status: "completed",
      dotColor: "#3B82F6",
    },
    {
      id: "te3",
      title: "IT Asset Collection In Progress",
      timestamp: "01/08/2024",
      description: "",
      status: "in-progress",
      dotColor: "#F59E0B",
    },
  ];

  const filteredTimeline = timelineEvents.filter((event) => {
    if (timelineFilter === "Completed Only") return event.status === "completed";
    if (timelineFilter === "In Progress Only") return event.status === "in-progress";
    return true;
  });

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === "All Categories" || doc.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      alert("Please enter a task title");
      return;
    }
    const newTask = {
      id: `ot${Math.random()}`,
      title: newTaskTitle,
      department: newTaskDepartment,
      priority: newTaskPriority,
      description: "",
      assignedTo: newTaskAssignee || "Unassigned",
      dueDate: newTaskDueDate || "Not set",
      completedDate: null,
      status: "Pending" as const,
    };
    setShowAddTaskModal(false);
    setNewTaskTitle("");
    setNewTaskDepartment("HR");
    setNewTaskPriority("Medium");
    setNewTaskAssignee("");
    setNewTaskDueDate("");
    alert(`Task "${newTask.title}" added successfully!`);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            className="h-10 w-10 p-0 hover:bg-[#E5E7EB] self-start"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 text-[#6B7280]" />
          </Button>
          <h1 className="text-base font-semibold">Offboarding Details</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="bg-white hover:bg-gray-50 text-[#6B7280] border border-[#D1D5DB] flex items-center gap-2 px-3 py-1.5 text-sm">
            <FileDown className="h-4 w-4" />
            Export Report
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-3 py-1.5 text-sm"
            onClick={() => navigate("/exit-interview")}
          >
            Exit Interview
          </Button>
        </div>
      </div>

      {/* Combined Personal Info and Offboarding Summary Section */}
      <div className="mt-6">
        <Card className="bg-white rounded-lg p-6 border" style={{ borderColor: "#E5E7EB", boxShadow: "0px 2px 6px rgba(0,0,0,0.05)", fontFamily: 'Poppins, sans-serif' }}>
          {/* Personal Info Row */}
          <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: "#E5E7EB" }}>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm flex-shrink-0">SJ</div>
            <div className="flex-1">
              <div className="flex flex-col gap-1">
                <div>
                  <div className="text-[15px] font-semibold text-[#111827]">Sarah Johnson</div>
                  <div className="text-[12px] text-[#6B7280]">Senior Developer</div>
                </div>
                <div className="flex flex-wrap gap-3 text-[11px]">
                  <div className="flex items-center gap-1.5 text-[#6B7280]">
                    <Clipboard className="h-3.5 w-3.5" />
                    <span>{id ?? "EMP001"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#6B7280]">
                    <Mail className="h-3.5 w-3.5" />
                    <span>sarah.johnson@ai2aim.com</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#6B7280]">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>New York, NY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage and Progress */}
            <div className="flex flex-col gap-2 pt-1">
              <div>
                <div className="text-[11px] font-medium text-[#6B7280]">Stage</div>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full rounded border border-[#E5E7EB] bg-white px-2 py-1 text-[12px] font-semibold text-[#111827] focus:outline-none focus:border-blue-400"
                >
                  <option value="HR Documentation Update">HR Documentation Update</option>
                  <option value="IT Asset Collection">IT Asset Collection</option>
                  <option value="Exit Interview Scheduling">Exit Interview Scheduling</option>
                  <option value="Access Revocation">Access Revocation</option>
                  <option value="Post-Exit Follow-Up">Post-Exit Follow-Up</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <div className="text-[11px] font-medium text-[#6B7280]">Progress</div>
                  <div className="text-[12px] font-semibold text-[#111827]">65%</div>
                </div>
                <div className="h-1.5 w-full rounded-[8px] bg-[#E5E7EB]">
                  <div className="h-1.5 w-[65%] rounded-[8px] bg-[#3B82F6]" />
                </div>
              </div>
            </div>
          </div>

          {/* Offboarding Summary Grid */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            {/* Exit Details Card */}
            <div className="border border-[#E5E7EB] rounded-lg p-3 bg-white">
              <div className="text-[13px] font-semibold text-[#111827] mb-2">Exit Details</div>
              <div className="space-y-1.5 text-[11px]">
                <div>
                  <div className="text-[#6B7280] font-medium">Type</div>
                  <div className="text-[#111827] font-semibold">Resignation</div>
                </div>
                <div>
                  <div className="text-[#6B7280] font-medium">Last Working Day</div>
                  <div className="text-[#111827] font-semibold">2024-01-15</div>
                </div>
                <div>
                  <div className="text-[#6B7280] font-medium">Notice Given</div>
                  <div className="text-[#111827] font-semibold">2-weeks</div>
                </div>
                <div>
                  <div className="text-[#6B7280] font-medium">Reason</div>
                  <div className="text-[#111827] font-semibold">Career advancement</div>
                </div>
              </div>
            </div>

            {/* Employment Info Card */}
            <div className="border border-[#E5E7EB] rounded-lg p-3 bg-white">
              <div className="text-[13px] font-semibold text-[#111827] mb-2">Employment Info</div>
              <div className="space-y-1.5 text-[11px]">
                <div>
                  <div className="text-[#6B7280] font-medium">Department</div>
                  <div className="text-[#111827] font-semibold">Engineering</div>
                </div>
                <div>
                  <div className="text-[#6B7280] font-medium">Manager</div>
                  <div className="text-[#111827] font-semibold">John Smith</div>
                </div>
                <div>
                  <div className="text-[#6B7280] font-medium">Start Date</div>
                  <div className="text-[#111827] font-semibold">2022-03-15</div>
                </div>
              </div>
            </div>

            {/* Case Info Card */}
            <div className="border border-[#E5E7EB] rounded-lg p-3 bg-white">
              <div className="text-[13px] font-semibold text-[#111827] mb-2">Case Info</div>

              <div className="space-y-1.5 text-[11px]">
                <div>
                  <div className="text-[#6B7280] font-medium">Assigned To</div>
                  <div className="text-[#111827] font-semibold">HR Team</div>
                </div>
                <div>
                  <div className="text-[#6B7280] font-medium">Rehire Eligible</div>
                  <div className="text-[#111827] font-semibold">Yes</div>
                </div>
                <div>
                  <div className="text-[#6B7280] font-medium">Urgent</div>
                  <div className="text-[#111827] font-semibold">No</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Section */}
      <div className="mt-6">
        <Tabs defaultValue="tasks">
          <div className="flex items-center justify-between border-b">
            <TabsList className="flex gap-0">
              <TabsTrigger value="tasks" className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 hover:text-foreground transition-colors">Tasks ({tasks.length})</TabsTrigger>
              <TabsTrigger value="comments" className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 hover:text-foreground transition-colors">Comments ({caseComments.length})</TabsTrigger>
              <TabsTrigger value="documents" className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 hover:text-foreground transition-colors">Documents ({documents.length})</TabsTrigger>
              <TabsTrigger value="timeline" className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 hover:text-foreground transition-colors">Exit Timeline</TabsTrigger>
              <TabsTrigger value="access-security" className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 hover:text-foreground transition-colors">Access & Security</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tasks" className="mt-4">
            <div style={{ fontFamily: 'Poppins, sans-serif' }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[14px] font-bold text-[#111827]">Offboarding Tasks</h3>
                  <p className="text-xs text-[#6B7280]">Track completion of required offboarding activities.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 px-3 py-1.5 text-sm"
                    onClick={() => setShowAddTaskModal(true)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Task
                  </Button>
                </div>
              </div>

              {/* Task Cards */}
              <div className="space-y-2">
                {offboardingTasks.map((task) => {
                  const statusColors = {
                    "Completed": "bg-green-100 text-green-700",
                    "In Progress": "bg-blue-100 text-blue-700",
                    "Pending": "bg-yellow-100 text-yellow-700",
                  };

                  const priorityColors = {
                    "High": "bg-red-100 text-red-700",
                    "Medium": "bg-yellow-100 text-yellow-700",
                    "Low": "bg-green-100 text-green-700",
                  };

                  return (
                    <div key={task.id} className="bg-white border border-[#E5E7EB] rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-[13px] text-[#111827]">{task.title}</h4>
                            <span className="rounded-full bg-[#F3F4F6] px-1.5 py-0.5 text-[10px] font-medium text-[#6B7280]">{task.department}</span>
                            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-[11px]">
                            <div><span className="text-[#6B7280]">Assigned To:</span> <span className="font-medium text-[#111827]">{task.assignedTo}</span></div>
                            <div className="flex items-center gap-0.5"><Calendar className="h-3 w-3 text-[#6B7280]" /> <span className="text-[#6B7280]">Due:</span> <span className="font-medium text-[#111827]">{task.dueDate}</span></div>
                            {task.completedDate && (
                              <div className="flex items-center gap-0.5"><CheckCircle className="h-3 w-3 text-green-600" /> <span className="text-[#6B7280]">Completed:</span> <span className="font-medium text-[#111827]">{task.completedDate}</span></div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[task.status]}`}>{task.status}</span>
                          <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-gray-100">
                            <Pencil className="h-3.5 w-3.5 text-[#6B7280]" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="mt-4">
            <div style={{ fontFamily: 'Poppins, sans-serif' }}>
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-[14px] font-bold text-[#111827]">Case Comments</h3>
                <p className="text-xs text-[#6B7280]">Communication and updates related to this offboarding case.</p>
              </div>

              {/* Comments List */}
              <div className="space-y-2 mb-6">
                {caseComments.map((comment) => (
                  <div key={comment.id} className="bg-white border border-[#E5E7EB] rounded-lg p-3 hover:shadow-sm transition-shadow group">
                    <div className="flex gap-2">
                      {/* Avatar */}
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F4F6] text-[#111827] font-bold text-xs flex-shrink-0">
                        {comment.initials}
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[12px] text-[#111827]">{comment.author}</span>
                            <span className="text-[10px] text-[#6B7280]">{comment.role}</span>
                            <span className="text-[10px] text-[#9CA3AF]">{comment.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" className="h-5 w-5 p-0 hover:bg-gray-100">
                              <Pencil className="h-3 w-3 text-[#6B7280]" />
                            </Button>
                            <Button variant="ghost" className="h-5 w-5 p-0 hover:bg-gray-100" onClick={() => setCaseComments(caseComments.filter(c => c.id !== comment.id))}>
                              <Trash2 className="h-3 w-3 text-[#6B7280]" />
                            </Button>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-[#111827]">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment Section */}
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
                <div className="flex gap-3 items-end">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] text-[#111827] font-bold text-sm flex-shrink-0">
                    AD
                  </div>

                  {/* Input */}
                  <input
                    type="text"
                    placeholder="Add a comment…"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 rounded border border-[#E5E7EB] bg-white px-3 py-2 text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-blue-400"
                  />

                  {/* Add Button */}
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    onClick={() => {
                      if (newComment.trim()) {
                        const newCommentObj = {
                          id: `c${caseComments.length + 1}`,
                          author: "You",
                          role: "Admin",
                          timestamp: new Date().toLocaleString(),
                          text: newComment,
                          initials: "AD",
                        };
                        setCaseComments([...caseComments, newCommentObj]);
                        setNewComment("");
                      }
                    }}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <div style={{ fontFamily: 'Poppins, sans-serif' }}>
              {/* Header Section */}
              <div className="mb-4">
                <h3 className="text-[14px] font-bold text-[#111827]">Document Management</h3>
                <p className="text-xs text-[#6B7280]">Manage documents related to offboarding.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 items-center mb-6 justify-end">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 px-3 py-1.5 text-sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Upload
                </Button>

                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const newDocs = Array.from(files).map((file, index) => ({
                        id: `doc-${Date.now()}-${index}`,
                        name: file.name,
                        type: file.name.endsWith('.pdf') ? 'PDF' : 'Other',
                        size: `${(file.size / 1024).toFixed(2)} KB`,
                        uploadedDate: new Date().toISOString().split('T')[0],
                      }));
                      setDocuments([...documents, ...newDocs]);
                      alert(`Successfully uploaded ${files.length} file(s)`);
                      e.target.value = '';
                    }
                  }}
                />

                <Button
                  variant={isExportMode ? "default" : "outline"}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm ${isExportMode ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                  onClick={() => {
                    if (isExportMode && selectedForExport.length > 0) {
                      alert(`Downloading ${selectedForExport.length} file(s)...`);
                      setSelectedForExport([]);
                      setIsExportMode(false);
                    } else {
                      setIsExportMode(!isExportMode);
                    }
                  }}
                >
                  <Download className="h-3.5 w-3.5" />
                  {isExportMode ? `Download (${selectedForExport.length})` : "Export"}
                </Button>

                {isExportMode && selectedForExport.length < filteredDocuments.length && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      setSelectedForExport(filteredDocuments.map(d => d.id));
                    }}
                  >
                    Select All
                  </Button>
                )}

                {isExportMode && selectedForExport.length > 0 && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      setSelectedForExport([]);
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>

              {/* Document List - Scrollable Container */}
              <div className="border border-[#E5E7EB] rounded-lg overflow-y-auto" style={{ maxHeight: "400px" }}>
                <div className="space-y-2 p-3">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => {
                      const isSelected = selectedForExport.includes(doc.id);
                      const typeColor = doc.type === "PDF" ? "#EF4444" : "#22C55E";
                      const getIcon = () => doc.type === "PDF" ? <FileText className="h-5 w-5" /> : <File className="h-5 w-5" />;

                      return (
                        <div
                          key={doc.id}
                          className="bg-white border border-[#E5E7EB] rounded-lg p-2.5 hover:shadow-sm transition-shadow group"
                        >
                          <div className="flex items-start gap-2">
                            {/* Checkbox or Icon */}
                            {isExportMode ? (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedForExport([...selectedForExport, doc.id]);
                                  } else {
                                    setSelectedForExport(selectedForExport.filter((id) => id !== doc.id));
                                  }
                                }}
                                className="h-4 w-4 mt-1 rounded border-[#E5E7EB] text-blue-600 cursor-pointer flex-shrink-0"
                              />
                            ) : (
                              <div
                                className="flex h-8 w-8 items-center justify-center rounded flex-shrink-0"
                                style={{ backgroundColor: `${typeColor}20`, color: typeColor }}
                              >
                                {getIcon()}
                              </div>
                            )}

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="font-bold text-[12px] text-[#111827]">{doc.name}</span>
                              </div>

                              <div className="text-xs text-[#6B7280]">
                                <span>{doc.size}</span>
                                <span className="mx-1">•</span>
                                <span>{doc.date}</span>
                              </div>

                            </div>

                            {/* Actions */}
                            {!isExportMode && (
                              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  className="h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={() => setViewDocument(doc.id)}
                                >
                                  <Eye className="h-3.5 w-3.5 text-[#6B7280]" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={() => setDeleteConfirm(doc.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-[#6B7280]" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-[#9CA3AF]">No documents found.</div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* View Document Modal */}
          {viewDocument && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#111827]">
                    {documents.find((d) => d.id === viewDocument)?.name}
                  </h3>
                  <Button
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => setViewDocument(null)}
                  >
                    ✕
                  </Button>
                </div>
                <div className="text-center py-12 bg-[#F9FAFB] rounded-lg text-[#9CA3AF]">
                  Document preview would be displayed here
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <AlertDialog open={true} onOpenChange={() => setDeleteConfirm(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Document</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{documents.find((d) => d.id === deleteConfirm)?.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex gap-3 justify-end">
                  <AlertDialogCancel onClick={() => setDeleteConfirm(null)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      setDocuments(documents.filter((d) => d.id !== deleteConfirm));
                      setDeleteConfirm(null);
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <TabsContent value="timeline" className="mt-4">
            <div style={{ fontFamily: 'Poppins, sans-serif' }}>
              {/* Header Section */}
              <div className="mb-4">
                <h3 className="text-[14px] font-bold text-[#111827]">Case Timeline</h3>
                <p className="text-xs text-[#6B7280]">Chronological history of this offboarding case.</p>
              </div>

              {/* Filter Dropdown */}

              {/* Timeline Container */}
              <div className="relative pl-4">

                {/* Timeline Events */}
                <div className="space-y-2">
                  {filteredTimeline.length > 0 ? (
                    filteredTimeline.map((event, index) => (
                      <div key={event.id} className="relative">
                        {/* Status Dot */}
                        <div
                          className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full border-2 border-white"
                          style={{ backgroundColor: event.dotColor }}
                        />

                        {/* Content */}
                        <div className="pl-4">
                          <h4 className="font-bold text-[13px] text-[#111827]">{event.title}</h4>
                          <p className="text-[11px] text-[#6B7280] mt-0.5">{event.timestamp}</p>
                          <p className="text-[12px] text-[#4B5563] mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-[#9CA3AF]">No timeline events found.</div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="access-security" className="mt-4">
            <div className="py-4 px-6 bg-white w-full" style={{ fontFamily: 'Poppins, sans-serif', gap: "16px" }}>
              {/* Header Section */}
              <div className="mb-4">
                <h3 className="font-semibold text-[14px] text-[#111827] mb-1">System Access Overview</h3>
                <p className="text-xs text-[#6B7280]">Monitor and manage access across all systems.</p>
              </div>

              {/* Access Cards */}
              <div className="space-y-2">
                {[
                  { name: "Email (Google Workspace)", key: "email" },
                  { name: "Source Control (GitHub)", key: "github" },
                  { name: "HRIS (BambooHR)", key: "bamboo" },
                  { name: "Finance (NetSuite)", key: "netsuite" },
                ].map((system) => {
                  const isRevoked = systemAccess[system.key as keyof typeof systemAccess];
                  return (
                    <div
                      key={system.key}
                      className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5 hover:bg-[#F9FAFB] transition-colors"
                      style={{
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      {/* Left Side */}
                      <div>
                        <p className="font-bold text-[13px] text-[#111827]">{system.name}</p>
                        <p className="text-[11px] text-[#6B7280]">
                          {isRevoked ? "Access revoked" : "Access active"}
                        </p>
                      </div>

                      {/* Right Side */}
                      <div className="flex items-center gap-2">
                        <span className={`text-[12px] ${isRevoked ? "text-red-600 font-medium" : "text-[#6B7280]"}`}>
                          {isRevoked ? "Revoked" : "Revoke"}
                        </span>
                        <button
                          onClick={() =>
                            setSystemAccess({
                              ...systemAccess,
                              [system.key]: !isRevoked,
                            })
                          }
                          className={`relative w-11 h-6 rounded-full transition-all ${
                            isRevoked ? "bg-blue-500" : "bg-[#D1D5DB]"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              isRevoked ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full mx-4">
            <h2 className="text-[18px] font-semibold text-[#111827] mb-4">Add New Task</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-2">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter task title"
                  className="w-full rounded border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-2">Department</label>
                  <select
                    value={newTaskDepartment}
                    onChange={(e) => setNewTaskDepartment(e.target.value)}
                    className="w-full rounded border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400"
                  >
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Security">Security</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-2">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full rounded border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-2">Assigned To</label>
                <input
                  type="text"
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  placeholder="Enter assignee name"
                  className="w-full rounded border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-2">Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full rounded border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddTaskModal(false);
                  setNewTaskTitle("");
                  setNewTaskDepartment("HR");
                  setNewTaskPriority("Medium");
                  setNewTaskAssignee("");
                  setNewTaskDueDate("");
                }}
                className="flex-1 px-4 py-2 border-[#D1D5DB]"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                onClick={handleAddTask}
              >
                Add Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
