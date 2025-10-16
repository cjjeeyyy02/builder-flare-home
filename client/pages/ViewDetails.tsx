import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/local/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, MapPin, Clipboard, Plus, Pencil, CheckCircle, Calendar, Trash2, Send } from "lucide-react";

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
  const documents = [
    { id: "d1", name: "Resignation Letter.pdf" },
    { id: "d2", name: "Handover Checklist.docx" },
    { id: "d3", name: "Final Pay Summary.pdf" },
  ];

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
              <TabsTrigger value="comments" className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 hover:text-foreground transition-colors">Comments ({comments.length})</TabsTrigger>
              <TabsTrigger value="documents" className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 hover:text-foreground transition-colors">Documents ({documents.length})</TabsTrigger>
              <TabsTrigger value="timeline" className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 hover:text-foreground transition-colors">Timeline</TabsTrigger>
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
            <Card className="p-4">
              <ul className="space-y-2 text-sm">
                {comments.map((c) => (
                  <li key={c.id}>
                    <span className="font-medium">{c.author}:</span> {c.text}
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <Card className="p-4">
              <ul className="space-y-2 text-sm">
                {documents.map((d) => (
                  <li key={d.id}>{d.name}</li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <Card className="p-4 text-sm text-muted-foreground">No timeline events yet.</Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
