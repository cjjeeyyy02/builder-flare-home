import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ExitInterviewStep2() {
  const navigate = useNavigate();

  // Survey states
  const [reasonForLeaving, setReasonForLeaving] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [futureReturn, setFutureReturn] = useState("");

  const leaveReasons = [
    "Better compensation package",
    "Career advancement opportunity",
    "Poor work-life balance",
    "Lack of career development",
    "Management issues",
    "Company culture",
    "Relocation",
    "Personal reasons",
    "Retirement",
    "Other",
  ];

  const recommendationOptions = [
    "Definitely",
    "Probably",
    "Neutral",
    "Probably Not",
    "Definitely Not",
  ];

  const handleRatingChange = (key: string, value: number) => {
    setRatings({ ...ratings, [key]: value });
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB] px-6 py-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section with Back Button */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            className="h-10 w-10 p-0 hover:bg-[#E5E7EB]"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 text-[#6B7280]" />
          </Button>
          <div>
            <h1 className="text-[24px] font-semibold text-[#111827] mb-1">Job Satisfaction Assessment</h1>
            <p className="text-[12px] text-[#6B7280]">Rate your experience and answer survey questions</p>
          </div>
        </div>

        {/* Survey Questions Card */}
        <div className="bg-white rounded-lg p-4 border border-[#E5E7EB] shadow-sm mb-4" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 className="text-[14px] font-semibold text-[#111827] mb-4">Exit Survey Questions</h3>

            {/* Question 1 */}
            <div className="mb-3">
              <label className="block text-[12px] font-semibold text-[#111827] mb-2">
                Primary reason for leaving? <span className="text-red-500">*</span>
              </label>
              <select
                value={reasonForLeaving}
                onChange={(e) => setReasonForLeaving(e.target.value)}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-2 py-1.5 text-[12px] text-[#111827] focus:outline-none focus:border-blue-400"
              >
                <option value="">Select a reason</option>
                {leaveReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {/* Question 2 */}
            <div className="mb-3">
              <label className="block text-[12px] font-semibold text-[#111827] mb-2">
                Recommend company? <span className="text-red-500">*</span>
              </label>
              <select
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-2 py-1.5 text-[12px] text-[#111827] focus:outline-none focus:border-blue-400"
              >
                <option value="">Select an option</option>
                {recommendationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Question 3 */}
            <div>
              <label className="block text-[12px] font-semibold text-[#111827] mb-2">
                Return in future? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-1">
                {["Yes", "Maybe", "No"].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="radio"
                      id={`return-${option}`}
                      name="futureReturn"
                      value={option}
                      checked={futureReturn === option}
                      onChange={(e) => setFutureReturn(e.target.value)}
                      className="h-3 w-3 text-blue-600 border-[#D1D5DB] cursor-pointer"
                    />
                    <label htmlFor={`return-${option}`} className="ml-2 text-[12px] text-[#111827] cursor-pointer">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
        </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/exit-interview")}
            className="px-4 py-2 text-sm border-[#D1D5DB]"
          >
            Back to Setup
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium"
            onClick={() => navigate("/exit-interview-step3")}
          >
            Continue to Feedback
          </Button>
        </div>
      </div>
    </section>
  );
}
