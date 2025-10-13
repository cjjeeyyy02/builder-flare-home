import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const [steps, setSteps] = useState<string[]>(["Line Manager", "HR"]);
  const [tab, setTab] = useState("workflows");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-4">
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure workflows, leave types, and shift templates.
          </p>
        </header>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList>
            <TabsTrigger value="workflows">Approval Workflows</TabsTrigger>
            <TabsTrigger value="types">Leave Types</TabsTrigger>
            <TabsTrigger value="shifts">Shift Templates</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="mt-4">
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <h3 className="text-sm font-semibold">Workflow Steps</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {steps.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  type="button"
                  className="h-8 rounded-md bg-[#6C4DFF] px-3 text-xs font-medium text-white hover:bg-[#5a3fff]"
                  onClick={() => setSteps((prev) => [...prev, "New Step"])}
                >
                  Add Step
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 rounded-md px-3 text-xs"
                  onClick={() => setSteps((prev) => (prev.length ? prev.slice(0, -1) : prev))}
                >
                  Remove Step
                </Button>
                <Button
                  type="button"
                  className="h-8 rounded-md bg-[#6C4DFF] px-3 text-xs font-medium text-white hover:bg-[#5a3fff]"
                  onClick={() => console.log("Workflow saved:", steps.join(" → "))}
                >
                  Save Workflow
                </Button>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-semibold">Preview</h4>
                <p className="mt-1 text-sm text-muted-foreground">{steps.join(" → ")}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="types" className="mt-4">
            <div className="rounded-2xl border bg-card p-4 shadow-sm text-sm text-muted-foreground">
              Manage leave types (coming soon).
            </div>
          </TabsContent>

          <TabsContent value="shifts" className="mt-4">
            <div className="rounded-2xl border bg-card p-4 shadow-sm text-sm text-muted-foreground">
              Configure shift templates (coming soon).
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <div className="rounded-2xl border bg-card p-4 shadow-sm text-sm text-muted-foreground">
              Notification preferences (coming soon).
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
