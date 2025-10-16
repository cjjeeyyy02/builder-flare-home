import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/local/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, MapPin, Clipboard, Plus, Pencil, CheckCircle, Calendar, Trash2, Send, Search, Download, Eye, FileText, File } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  const [viewDocument, setViewDocument] = useState<string | null>(null);

  const [timelineFilter, setTimelineFilter] = useState("All Events");

  const timelineEvents = [
    {
      id: "te1",
      title: "Case Created",
      timestamp: "December 15, 2023 at 9:30 AM",
      description: "Offboarding case initiated for Sarah Johnson",
      status: "completed",
      dotColor: "#22C55E",
    },
    {
      id: "te2",
      title: "HR Documentation Completed",
      timestamp: "January 4, 2024 at 2:15 PM",
      description: "Employee records updated and termination letter generated",
      status: "completed",
      dotColor: "#3B82F6",
    },
    {
      id: "te3",
      title: "IT Asset Collection In Progress",
      timestamp: "January 8, 2024 at 10:00 AM",
      description: "Asset collection meeting scheduled with IT team",
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

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Offboarding Details</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          <Button variant="outline">Edit Case</Button>
          <Button variant="outline">Export Report</Button>
          <Button variant="outline">Exit Interview</Button>
        </div>
      </div>

      {/* Combined Personal Info and Offboarding Summary Section */}
      <div className="mt-6">
        <Card className="bg-white rounded-lg p-6 border" style={{ borderColor: "#E5E7EB", boxShadow: "0px 2px 6px rgba(0,0,0,0.05)", fontFamily: 'Poppins, sans-serif' }}>
          {/* Personal Info Row */}
          <div className="flex items-center gap-4 pb-6 border-b" style={{ borderColor: "#E5E7EB" }}>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F3F6F9] text-[#111827] font-bold text-xl flex-shrink-0">SJ</div>
            <div className="flex-1">
              <div className="flex flex-col gap-2">
                <div>
                  <div className="text-[18px] font-semibold text-[#111827]">Sarah Johnson</div>
                  <div className="text-[14px] text-[#6B7280]">Senior Developer</div>
                </div>
                <div className="flex flex-wrap gap-4 text-[13px]">
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <Clipboard className="h-4 w-4" />
                    <span>{id ?? "EMP001"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <Mail className="h-4 w-4" />
                    <span>sarah.johnson@ai2aim.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <MapPin className="h-4 w-4" />
                    <span>New York, NY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage and Progress */}
            <div className="flex flex-col gap-3 pt-2">
              <div>
                <div className="text-[13px] font-medium text-[#6B7280]">Stage</div>
                <div className="text-[13px] font-semibold text-[#111827]">Exit Interview</div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[13px] font-medium text-[#6B7280]">Progress</div>
                  <div className="text-[13px] font-semibold text-[#111827]">65%</div>
                </div>
                <div className="h-2 w-full rounded-[10px] bg-[#E5E7EB]">
                  <div className="h-2 w-[65%] rounded-[10px] bg-[#3B82F6]" />
                </div>
              </div>
            </div>
          </div>

          {/* Offboarding Summary Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {/* Exit Details Card */}
            <div className="border border-[#E5E7EB] rounded-lg p-4 bg-white">
              <div className="text-[16px] font-semibold text-[#111827] mb-3">Exit Details</div>
              <div className="space-y-2 text-[13px]">
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
            <div className="border border-[#E5E7EB] rounded-lg p-4 bg-white">
              <div className="text-[16px] font-semibold text-[#111827] mb-3">Employment Info</div>
              <div className="space-y-2 text-[13px]">
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
            <div className="border border-[#E5E7EB] rounded-lg p-4 bg-white">
              <div className="text-[16px] font-semibold text-[#111827] mb-3">Case Info</div>

              <div className="space-y-2 text-[13px]">
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
            </TabsList>
          </div>

          <TabsContent value="tasks" className="mt-4">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#111827]">Offboarding Tasks</h3>
                  <p className="text-sm text-[#6B7280]">Track completion of required offboarding activities.</p>
                </div>
                <div className="flex items-center gap-2">
                  <select className="rounded border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827]">
                    <option value="all">All Tasks</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                  </select>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              </div>

              {/* Task Cards */}
              <div className="space-y-3">
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
                    <div key={task.id} className="bg-white border border-[#E5E7EB] rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-[#111827]">{task.title}</h4>
                            <span className="rounded-full bg-[#F3F4F6] px-2 py-1 text-[11px] font-medium text-[#6B7280]">{task.department}</span>
                            <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
                          </div>
                          <p className="text-sm text-[#6B7280] mb-3">{task.description}</p>
                          <div className="flex flex-wrap gap-3 text-xs">
                            <div><span className="text-[#6B7280]">Assigned To:</span> <span className="font-medium text-[#111827]">{task.assignedTo}</span></div>
                            <div className="flex items-center gap-1"><Calendar className="h-3 w-3 text-[#6B7280]" /> <span className="text-[#6B7280]">Due:</span> <span className="font-medium text-[#111827]">{task.dueDate}</span></div>
                            {task.completedDate && (
                              <div className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-600" /> <span className="text-[#6B7280]">Completed:</span> <span className="font-medium text-[#111827]">{task.completedDate}</span></div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[task.status]}`}>{task.status}</span>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                            <Pencil className="h-4 w-4 text-[#6B7280]" />
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
            <div>
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#111827]">Case Comments</h3>
                <p className="text-sm text-[#6B7280]">Communication and updates related to this offboarding case.</p>
              </div>

              {/* Comments List */}
              <div className="space-y-4 mb-6">
                {caseComments.map((comment) => (
                  <div key={comment.id} className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:shadow-sm transition-shadow group">
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] text-[#111827] font-bold text-sm flex-shrink-0">
                        {comment.initials}
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#111827]">{comment.author}</span>
                            <span className="text-xs text-[#6B7280]">{comment.role}</span>
                            <span className="text-xs text-[#9CA3AF]">{comment.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-gray-100">
                              <Pencil className="h-3.5 w-3.5 text-[#6B7280]" />
                            </Button>
                            <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-gray-100" onClick={() => setCaseComments(caseComments.filter(c => c.id !== comment.id))}>
                              <Trash2 className="h-3.5 w-3.5 text-[#6B7280]" />
                            </Button>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-[#111827]">{comment.text}</p>
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
            <div>
              {/* Header Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#111827]">Document Management</h3>
                <p className="text-sm text-[#6B7280]">Manage documents related to offboarding case #1.</p>
              </div>

              {/* Search, Filter, and Action Buttons */}
              <div className="flex gap-3 items-center mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded border border-[#E5E7EB] bg-white pl-10 pr-3 py-2 text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-blue-400"
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="rounded border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827]"
                >
                  <option value="All Categories">All Categories</option>
                  <option value="General Documents">General Documents</option>
                </select>

                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Upload Document
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setShowExportModal(true)}
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              {/* Document List - Scrollable Container */}
              <div className="border border-[#E5E7EB] rounded-lg overflow-y-auto" style={{ maxHeight: "500px" }}>
                <div className="space-y-4 p-4">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => {
                      const isSelected = selectedForExport.includes(doc.id);
                      const typeColor = doc.type === "PDF" ? "#EF4444" : "#22C55E";
                      const getIcon = () => doc.type === "PDF" ? <FileText className="h-5 w-5" /> : <File className="h-5 w-5" />;

                      return (
                        <div
                          key={doc.id}
                          className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded flex-shrink-0"
                              style={{ backgroundColor: `${typeColor}20`, color: typeColor }}
                            >
                              {getIcon()}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-[#111827]">{doc.name}</span>
                                <span className="text-xs font-medium bg-[#F3F4F6] text-[#6B7280] px-2 py-1 rounded-full">
                                  {doc.type}
                                </span>
                                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                  {doc.status}
                                </span>
                              </div>

                              <div className="text-sm text-[#6B7280] mb-1">
                                <span>{doc.size}</span>
                                <span className="mx-2">•</span>
                                <span>{doc.date}</span>
                                <span className="mx-2">•</span>
                                <span>{doc.uploader}</span>
                              </div>

                              <div className="text-xs text-[#9CA3AF] mb-2">{doc.category}</div>
                              <div className="text-xs text-[#9CA3AF]">{doc.note}</div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                                onClick={() => setViewDocument(doc.id)}
                              >
                                <Eye className="h-4 w-4 text-[#6B7280]" />
                              </Button>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                                onClick={() => setDeleteConfirm(doc.id)}
                              >
                                <Trash2 className="h-4 w-4 text-[#6B7280]" />
                              </Button>
                            </div>
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

          {/* Export Modal */}
          {showExportModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-bold text-[#111827] mb-4">Export Documents</h3>
                <p className="text-sm text-[#6B7280] mb-4">Select documents to download/export:</p>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`export-${doc.id}`}
                        checked={selectedForExport.includes(doc.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedForExport([...selectedForExport, doc.id]);
                          } else {
                            setSelectedForExport(selectedForExport.filter((id) => id !== doc.id));
                          }
                        }}
                        className="h-4 w-4 rounded border-[#E5E7EB] text-blue-600 cursor-pointer"
                      />
                      <label htmlFor={`export-${doc.id}`} className="ml-3 text-sm text-[#111827] cursor-pointer">
                        {doc.name}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowExportModal(false);
                      setSelectedForExport([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      setShowExportModal(false);
                      setSelectedForExport([]);
                    }}
                  >
                    Export {selectedForExport.length > 0 ? `(${selectedForExport.length})` : ""}
                  </Button>
                </div>
              </div>
            </div>
          )}

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
            <div>
              {/* Header Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#111827]">Case Timeline</h3>
                <p className="text-sm text-[#6B7280]">Chronological history of this offboarding case.</p>
              </div>

              {/* Filter Dropdown */}
              <div className="mb-6">
                <select
                  value={timelineFilter}
                  onChange={(e) => setTimelineFilter(e.target.value)}
                  className="rounded border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827]"
                >
                  <option value="All Events">All Events</option>
                  <option value="Completed Only">Completed Only</option>
                  <option value="In Progress Only">In Progress Only</option>
                </select>
              </div>

              {/* Timeline Container */}
              <div className="relative pl-6">
                {/* Vertical Line */}
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-[#E5E7EB]" />

                {/* Timeline Events */}
                <div className="space-y-5">
                  {filteredTimeline.length > 0 ? (
                    filteredTimeline.map((event, index) => (
                      <div key={event.id} className="relative">
                        {/* Status Dot */}
                        <div
                          className="absolute -left-4 top-1 w-3 h-3 rounded-full border-2 border-white"
                          style={{ backgroundColor: event.dotColor }}
                        />

                        {/* Content */}
                        <div className="pl-6">
                          <h4 className="font-bold text-[16px] text-[#111827]">{event.title}</h4>
                          <p className="text-[13px] text-[#6B7280] mt-1">{event.timestamp}</p>
                          <p className="text-[14px] text-[#4B5563] mt-2">{event.description}</p>
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
        </Tabs>
      </div>
    </section>
  );
}
