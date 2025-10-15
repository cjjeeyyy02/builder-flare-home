import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/local/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">Employee Information</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="text-muted-foreground">Name</div>
            <div className="font-medium">Sarah Johnson</div>
            <div className="text-muted-foreground">Position</div>
            <div className="font-medium">Senior Developer</div>
            <div className="text-muted-foreground">Employee ID</div>
            <div className="font-medium">{id ?? "EMP001"}</div>
            <div className="text-muted-foreground">Email</div>
            <div className="font-medium">sarah.johnson@ai2aim.com</div>
            <div className="text-muted-foreground">Location</div>
            <div className="font-medium">New York, NY</div>
            <div className="text-muted-foreground">Status</div>
            <div className="flex items-center gap-2"><Badge variant="secondary">In Progress</Badge><span className="sr-only">Status</span></div>
            <div className="text-muted-foreground">Progress</div>
            <div className="flex items-center gap-2">
              <Progress value={65} className="w-40" />
              <span className="font-medium">65%</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">Exit Details</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="text-muted-foreground">Type</div>
            <div className="font-medium">Resignation</div>
            <div className="text-muted-foreground">Last Working Day</div>
            <div className="font-medium">2024-01-15</div>
            <div className="text-muted-foreground">Notice Given</div>
            <div className="font-medium">2-weeks</div>
            <div className="text-muted-foreground">Reason for Departure</div>
            <div className="font-medium">Career advancement opportunity</div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">Employment Info</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="text-muted-foreground">Department</div>
            <div className="font-medium">Engineering</div>
            <div className="text-muted-foreground">Manager</div>
            <div className="font-medium">John Smith</div>
            <div className="text-muted-foreground">Start Date</div>
            <div className="font-medium">2022-03-15</div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">Case Info</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="text-muted-foreground">Assigned To</div>
            <div className="font-medium">HR Team</div>
            <div className="text-muted-foreground">Rehire Eligible</div>
            <div className="font-medium">Yes</div>
            <div className="text-muted-foreground">Urgent</div>
            <div className="font-medium">No</div>
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
