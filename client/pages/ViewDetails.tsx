import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/local/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";

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
  const comments = [
    { id: "c1", author: "John Smith", text: "Prepared exit checklist." },
    { id: "c2", author: "HR Team", text: "Exit interview scheduled for 2024-01-12." },
  ];
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

      <div className="mt-6">
        <Card className="bg-white rounded-[12px] p-6 border" style={{ borderColor: "#E5E7EB", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <div className="flex flex-col gap-10 md:flex-row">
            {/* Left: Employee Profile */}
            <div className="min-w-[240px]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E7EB] text-[#111827] font-semibold">SJ</div>
                <div>
                  <div className="text-[16px] font-bold text-[#111827]">Sarah Johnson</div>
                  <div className="text-sm text-[#6B7280]">Senior Developer</div>
                </div>
              </div>
              <div className="mt-4 space-y-1 text-sm">
                <div className="text-[#6B7280]">Employee ID</div>
                <div className="text-[#111827] font-medium">{id ?? "EMP001"}</div>
                <div className="text-[#6B7280]">Email</div>
                <div className="text-[#111827] font-medium">sarah.johnson@ai2aim.com</div>
                <div className="text-[#6B7280]">Location</div>
                <div className="text-[#111827] font-medium">New York, NY</div>
              </div>
            </div>

            {/* Middle: Exit Details + Employment Info */}
            <div className="flex-1 grid grid-cols-1 gap-10 md:grid-cols-2">
              <div>
                <div className="mb-2 text-[16px] font-bold text-[#111827]">Exit Details</div>
                <div className="space-y-1 text-sm">
                  <div className="text-[#6B7280]">Type</div>
                  <div className="text-[#111827] font-medium">Resignation</div>
                  <div className="text-[#6B7280]">Last Working Day</div>
                  <div className="text-[#111827] font-medium">2024-01-15</div>
                  <div className="text-[#6B7280]">Notice Given</div>
                  <div className="text-[#111827] font-medium">2-weeks</div>
                  <div className="pt-2 text-[#6B7280]">Reason for Departure</div>
                  <div className="text-[#111827] font-medium">Career advancement opportunity</div>
                </div>
              </div>
              <div>
                <div className="mb-2 text-[16px] font-bold text-[#111827]">Employment Info</div>
                <div className="space-y-1 text-sm">
                  <div className="text-[#6B7280]">Department</div>
                  <div className="text-[#111827] font-medium">Engineering</div>
                  <div className="text-[#6B7280]">Manager</div>
                  <div className="text-[#111827] font-medium">John Smith</div>
                  <div className="text-[#6B7280]">Start Date</div>
                  <div className="text-[#111827] font-medium">2022-03-15</div>
                </div>
              </div>
            </div>

            {/* Right: Case Info + Progress */}
            <div className="w-full md:w-[260px]">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#E0F2FE] px-3 py-1 text-sm font-medium text-[#1D4ED8]">In Progress</span>
                <span className="text-sm font-medium text-[#111827]">65%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-[#E5E7EB]">
                <div className="h-2 w-[65%] rounded-full bg-[#3B82F6]" />
              </div>

              <div className="mt-4">
                <div className="mb-2 text-[16px] font-bold text-[#111827]">Case Info</div>
                <div className="space-y-1 text-sm">
                  <div className="text-[#6B7280]">Assigned To</div>
                  <div className="text-[#111827] font-medium">HR Team</div>
                  <div className="text-[#6B7280]">Rehire Eligible</div>
                  <div className="text-[#111827] font-medium">Yes</div>
                  <div className="text-[#6B7280]">Urgent</div>
                  <div className="text-[#111827] font-medium">No</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="tasks">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
              <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
              <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tasks" className="mt-4">
            <Card className="p-4">
              <ul className="list-disc pl-5 text-sm">
                {tasks.map((t) => (
                  <li key={t.id}>{t.title}</li>
                ))}
              </ul>
            </Card>
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
