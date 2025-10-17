import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ExitInterviewStep2() {
  const navigate = useNavigate();

  // Rating states
  const [ratings, setRatings] = useState({
    jobSatisfaction: 3,
    workLifeBalance: 3,
    managementSupport: 3,
    careerDevelopment: 3,
    compensation: 3,
    workEnvironment: 3,
    teamCollaboration: 3,
  });

  // Survey states
  const [reasonForLeaving, setReasonForLeaving] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [futureReturn, setFutureReturn] = useState("");

  const ratingItems = [
    { key: "jobSatisfaction", label: "Overall Job Satisfaction" },
    { key: "workLifeBalance", label: "Work-Life Balance" },
    { key: "managementSupport", label: "Management Support" },
    { key: "careerDevelopment", label: "Career Development Opportunities" },
    { key: "compensation", label: "Compensation and Benefits" },
    { key: "workEnvironment", label: "Work Environment" },
    { key: "teamCollaboration", label: "Team Collaboration" },
  ];

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

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Left Column - Rating Sliders Card */}
          <div className="bg-white rounded-lg p-4 border border-[#E5E7EB] shadow-sm" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 className="text-[14px] font-semibold text-[#111827] mb-4">Employee Satisfaction Rating</h3>

            <div className="space-y-4">
              {ratingItems.map((item) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] font-medium text-[#111827]">{item.label}</label>
                    <div className="flex gap-1">
                      <span className="text-[11px] text-[#6B7280] font-medium">
                        {ratings[item.key as keyof typeof ratings]}
                      </span>
                      <span className="text-[11px] text-[#9CA3AF]">
                        {ratings[item.key as keyof typeof ratings] === 1 && "Very Poor"}
                        {ratings[item.key as keyof typeof ratings] === 2 && "Poor"}
                        {ratings[item.key as keyof typeof ratings] === 3 && "Neutral"}
                        {ratings[item.key as keyof typeof ratings] === 4 && "Good"}
                        {ratings[item.key as keyof typeof ratings] === 5 && "Excellent"}
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={ratings[item.key as keyof typeof ratings]}
                    onChange={(e) => handleRatingChange(item.key, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer"
                    style={{
                      accentColor: "#3B82F6",
                    }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-[#9CA3AF]">Very Poor</span>
                    <span className="text-[10px] text-[#9CA3AF]">Excellent</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Survey Questions Card */}
          <div className="bg-white rounded-lg p-4 border border-[#E5E7EB] shadow-sm" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
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
