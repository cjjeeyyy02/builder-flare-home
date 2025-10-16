import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/local/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, MapPin, Clipboard } from "lucide-react";

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
