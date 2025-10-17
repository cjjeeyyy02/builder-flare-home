import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ExitInterview() {
  const navigate = useNavigate();
  const [interviewDate, setInterviewDate] = useState("2025-10-23");
  const [interviewer, setInterviewer] = useState("Testing");
  const [interviewMode, setInterviewMode] = useState("Video Call");

  return (
    <section className="min-h-screen bg-[#F9FAFB] px-6 py-8">
      <div className="w-full">
        {/* Header Section with Back Button */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            className="h-10 w-10 p-0 hover:bg-[#E5E7EB]"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5 text-[#6B7280]" />
          </Button>
          <div>
            <h1 className="text-[28px] font-semibold text-[#111827] mb-2">Exit Interview</h1>
            <p className="text-[14px] text-[#6B7280]">Collect feedback and insights from departing employees</p>
          </div>
        </div>

        {/* Employee Information Card */}
        <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] shadow-sm mb-6" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 className="text-[16px] font-semibold text-[#111827] mb-6">Employee Information</h3>

          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-[24px] font-bold shadow-sm">
                SJ
              </div>
            </div>

            {/* Employee Details */}
            <div className="flex-1">
              <h4 className="text-[18px] font-bold text-[#111827] mb-1">Sarah Johnson</h4>
              <p className="text-[14px] text-[#6B7280] mb-4">Senior Developer • Engineering</p>

              {/* Metadata */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-[12px] text-[#9CA3AF] font-medium mb-1">Employee ID</p>
                  <p className="text-[13px] font-medium text-[#111827]">EMP001</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#9CA3AF] font-medium mb-1">Manager</p>
                  <p className="text-[13px] font-medium text-[#111827]">John Smith</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#9CA3AF] font-medium mb-1">Tenure</p>
                  <p className="text-[13px] font-medium text-[#111827]">2022-03-15 – 2024-01-15</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Setup Card */}
        <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] shadow-sm" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 className="text-[16px] font-semibold text-[#111827] mb-2">Interview Setup</h3>
          <p className="text-[13px] text-[#6B7280] mb-6">Configure the exit interview details</p>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Interview Date */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-2">
                Interview Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Interviewer */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-2">
                Interviewer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Interview Mode */}
          <div className="mb-8">
            <label className="block text-[13px] font-semibold text-[#111827] mb-2">
              Interview Mode <span className="text-red-500">*</span>
            </label>
            <select
              value={interviewMode}
              onChange={(e) => setInterviewMode(e.target.value)}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400"
            >
              <option value="Video Call">Video Call</option>
              <option value="Phone Call">Phone Call</option>
              <option value="In-Person">In-Person</option>
              <option value="Email">Email</option>
            </select>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-medium"
              onClick={() => navigate("/exit-interview-step2")}
            >
              Continue to Interview
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
