import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clipboard, Mail, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ExitInterview() {
  const navigate = useNavigate();
  const [interviewDate, setInterviewDate] = useState("2025-10-23");
  const [interviewer, setInterviewer] = useState("Testing");
  const [interviewMode, setInterviewMode] = useState("Video Call");

  return (
    <section className="min-h-screen bg-[#F9FAFB] px-6 py-4">
      <div className="w-full">
        {/* Header Section with Back Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            className="h-10 w-10 p-0 hover:bg-[#E5E7EB] mb-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5 text-[#6B7280]" />
          </Button>
          <div>
            <h1 className="text-[16px] font-semibold text-[#111827] mb-1">
              Exit Interview
            </h1>
            <p className="text-[11px] text-[#6B7280]">
              Collect feedback and insights from departing employees
            </p>
          </div>
        </div>

        {/* Employee Information Card */}
        <div className="mt-4 mb-4">
          <Card
            className="bg-white rounded-lg p-4 border"
            style={{
              borderColor: "#E5E7EB",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {/* Personal Info Row */}
            <div
              className="flex items-center gap-3 pb-3 border-b"
              style={{ borderColor: "#E5E7EB" }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs flex-shrink-0">
                SJ
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-0.5">
                  <div>
                    <div className="text-[13px] font-semibold text-[#111827]">
                      Sarah Johnson
                    </div>
                    <div className="text-[11px] text-[#6B7280]">
                      Senior Developer
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <div className="flex items-center gap-1 text-[#6B7280]">
                      <Clipboard className="h-3 w-3" />
                      <span>EMP001</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#6B7280]">
                      <Mail className="h-3 w-3" />
                      <span>sarah.johnson@ai2aim.com</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#6B7280]">
                      <MapPin className="h-3 w-3" />
                      <span>New York, NY</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage and Progress */}
              <div className="flex flex-col gap-1.5 pt-0.5">
                <div>
                  <div className="text-[10px] font-medium text-[#6B7280] mb-0.5">
                    Stage
                  </div>
                  <select
                    defaultValue="HR Documentation Update"
                    className="w-full rounded border border-[#E5E7EB] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#111827] focus:outline-none focus:border-blue-400"
                  >
                    <option value="HR Documentation Update">
                      HR Documentation Update
                    </option>
                    <option value="IT Asset Collection">
                      IT Asset Collection
                    </option>
                    <option value="Exit Interview Scheduling">
                      Exit Interview Scheduling
                    </option>
                    <option value="Access Revocation">Access Revocation</option>
                    <option value="Post-Exit Follow-Up">
                      Post-Exit Follow-Up
                    </option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="text-[10px] font-medium text-[#6B7280]">
                      Progress
                    </div>
                    <div className="text-[11px] font-semibold text-[#111827]">
                      65%
                    </div>
                  </div>
                  <div className="h-1 w-full rounded-[8px] bg-[#E5E7EB]">
                    <div className="h-1 w-[65%] rounded-[8px] bg-[#3B82F6]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Offboarding Summary Grid */}
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
              {/* Exit Details Card */}
              <div className="border border-[#E5E7EB] rounded-lg p-2 bg-white">
                <div className="text-[12px] font-semibold text-[#111827] mb-1">
                  Exit Details
                </div>
                <div className="space-y-1 text-[10px]">
                  <div>
                    <div className="text-[#6B7280] font-medium">Type</div>
                    <div className="text-[#111827] font-semibold">
                      Resignation
                    </div>
                  </div>
                  <div>
                    <div className="text-[#6B7280] font-medium">
                      Last Working Day
                    </div>
                    <div className="text-[#111827] font-semibold">
                      2024-01-15
                    </div>
                  </div>
                  <div>
                    <div className="text-[#6B7280] font-medium">
                      Notice Given
                    </div>
                    <div className="text-[#111827] font-semibold">2-weeks</div>
                  </div>
                  <div>
                    <div className="text-[#6B7280] font-medium">Reason</div>
                    <div className="text-[#111827] font-semibold">
                      Career advancement
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Info Card */}
              <div className="border border-[#E5E7EB] rounded-lg p-2 bg-white">
                <div className="text-[12px] font-semibold text-[#111827] mb-1">
                  Employment Info
                </div>
                <div className="space-y-1 text-[10px]">
                  <div>
                    <div className="text-[#6B7280] font-medium">Department</div>
                    <div className="text-[#111827] font-semibold">
                      Engineering
                    </div>
                  </div>
                  <div>
                    <div className="text-[#6B7280] font-medium">Manager</div>
                    <div className="text-[#111827] font-semibold">
                      John Smith
                    </div>
                  </div>
                  <div>
                    <div className="text-[#6B7280] font-medium">Start Date</div>
                    <div className="text-[#111827] font-semibold">
                      2022-03-15
                    </div>
                  </div>
                </div>
              </div>

              {/* Case Info Card */}
              <div className="border border-[#E5E7EB] rounded-lg p-2 bg-white">
                <div className="text-[12px] font-semibold text-[#111827] mb-1">
                  Case Info
                </div>
                <div className="space-y-1 text-[10px]">
                  <div>
                    <div className="text-[#6B7280] font-medium">
                      Assigned To
                    </div>
                    <div className="text-[#111827] font-semibold">HR Team</div>
                  </div>
                  <div>
                    <div className="text-[#6B7280] font-medium">
                      Rehire Eligible
                    </div>
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

        {/* Interview Setup Card */}
        <div
          className="bg-white rounded-lg p-4 border border-[#E5E7EB] shadow-sm"
          style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}
        >
          <h3 className="text-[14px] font-semibold text-[#111827] mb-1">
            Interview Setup
          </h3>
          <p className="text-[12px] text-[#6B7280] mb-3">
            Configure the exit interview details
          </p>

          {/* Form Fields - Two Column Layout */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Left Column */}
            <div className="space-y-3">
              {/* Interview Date */}
              <div>
                <label className="block text-[12px] font-semibold text-[#111827] mb-1">
                  Interview Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] text-[#111827] focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Interview Mode */}
              <div>
                <label className="block text-[12px] font-semibold text-[#111827] mb-1">
                  Interview Mode <span className="text-red-500">*</span>
                </label>
                <select
                  value={interviewMode}
                  onChange={(e) => setInterviewMode(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] text-[#111827] focus:outline-none focus:border-blue-400"
                >
                  <option value="Video Call">Video Call</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Email">Email</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              {/* Interviewer */}
              <div>
                <label className="block text-[12px] font-semibold text-[#111827] mb-1">
                  Interviewer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] text-[#111827] focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Interview Duration */}
              <div>
                <label className="block text-[12px] font-semibold text-[#111827] mb-1">
                  Interview Duration <span className="text-red-500">*</span>
                </label>
                <select className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] text-[#111827] focus:outline-none focus:border-blue-400">
                  <option value="30 minutes">30 minutes</option>
                  <option value="45 minutes">45 minutes</option>
                  <option value="60 minutes">60 minutes</option>
                  <option value="90 minutes">90 minutes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-medium"
              onClick={() => navigate("/exit-interview-form")}
            >
              Continue to Interview
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
