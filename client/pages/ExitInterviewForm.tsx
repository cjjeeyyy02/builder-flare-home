import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";

export default function ExitInterviewForm() {
  const navigate = useNavigate();

  // Overall Job Satisfaction (radio buttons 1-5)
  const [jobSatisfaction, setJobSatisfaction] = useState({
    workLifeBalance: 3,
    managementSupport: 3,
    careerDevelopment: 3,
    compensation: 3,
    workEnvironment: 3,
    teamCollaboration: 3,
  });

  // Detailed Feedback
  const [enjoyedMost, setEnjoyedMost] = useState("");
  const [enjoyedLeast, setEnjoyedLeast] = useState("");
  const [improvements, setImprovements] = useState("");
  const [managerRelationship, setManagerRelationship] = useState("");

  // Exit Survey Questions
  const [reasonForLeaving, setReasonForLeaving] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [futureReturn, setFutureReturn] = useState("");

  // Decision Factors
  const [decisionFactors, setDecisionFactors] = useState({
    salary: false,
    careerGrowth: false,
    culture: false,
    recognition: false,
    management: false,
    training: false,
    workEnvironment: false,
    workLifeBalance: false,
    jobSecurity: false,
  });

  const [additionalComments, setAdditionalComments] = useState("");

  // Edit modes for sections
  const [editMode, setEditMode] = useState({
    jobSatisfaction: false,
    exitSurvey: false,
    detailedFeedback: false,
    decisionFactors: false,
  });

  const toggleEditMode = (section: keyof typeof editMode) => {
    setEditMode({
      ...editMode,
      [section]: !editMode[section],
    });
  };

  const satisfactionItems = [
    { key: "workLifeBalance", label: "Work-Life Balance" },
    { key: "managementSupport", label: "Management Support" },
    { key: "careerDevelopment", label: "Career Development Opportunities" },
    { key: "compensation", label: "Compensation and Benefits" },
    { key: "workEnvironment", label: "Work Environment" },
    { key: "teamCollaboration", label: "Team Collaboration" },
  ];

  const decisionFactorsList = [
    { key: "salary", label: "Salary and benefits" },
    { key: "careerGrowth", label: "Career growth opportunities" },
    { key: "culture", label: "Company culture" },
    { key: "recognition", label: "Recognition and rewards" },
    { key: "management", label: "Management and leadership" },
    { key: "training", label: "Training and development" },
    { key: "workEnvironment", label: "Work environment" },
    { key: "workLifeBalance", label: "Work-life balance" },
    { key: "jobSecurity", label: "Job security" },
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
    setJobSatisfaction({
      ...jobSatisfaction,
      [key]: value,
    });
  };

  const handleDecisionFactorChange = (key: string) => {
    setDecisionFactors({
      ...decisionFactors,
      [key]: !decisionFactors[key as keyof typeof decisionFactors],
    });
  };

  const handleSubmit = () => {
    alert("Exit Interview submitted successfully!");
    navigate("/");
  };

  const handleSaveDraft = () => {
    alert("Draft saved successfully!");
  };

  const getRatingLabel = (value: number) => {
    switch (value) {
      case 1:
        return "Very Poor";
      case 2:
        return "Poor";
      case 3:
        return "Neutral";
      case 4:
        return "Good";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB] px-6 py-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section with Back Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            className="h-10 w-10 p-0 hover:bg-[#E5E7EB] mb-2"
            onClick={() => navigate("/exit-interview")}
          >
            <ArrowLeft className="h-5 w-5 text-[#6B7280]" />
          </Button>
          <div>
            <h1 className="text-[16px] font-semibold text-[#111827] mb-1">Job Satisfaction Assessment</h1>
            <p className="text-[11px] text-[#6B7280]">Provide your feedback and insights</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Overall Job Satisfaction Card */}
            <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] shadow-sm" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[16px] font-semibold text-[#111827]">Overall Job Satisfaction</h3>
                <button
                  onClick={() => toggleEditMode("jobSatisfaction")}
                  className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4 text-[#6B7280] hover:text-[#111827]" />
                </button>
              </div>

              <div className="space-y-5">
                {satisfactionItems.map((item) => (
                  <div key={item.key}>
                    <label className="block text-[13px] font-medium text-[#111827] mb-3">{item.label}</label>
                    <div className="flex items-center gap-4">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} className="flex items-center">
                          <input
                            type="radio"
                            id={`${item.key}-${rating}`}
                            name={item.key}
                            value={rating}
                            checked={jobSatisfaction[item.key as keyof typeof jobSatisfaction] === rating}
                            onChange={() => handleRatingChange(item.key, rating)}
                            className="h-4 w-4 text-blue-600 border-[#D1D5DB] cursor-pointer"
                          />
                          <label htmlFor={`${item.key}-${rating}`} className="ml-2 text-[12px] text-[#6B7280] cursor-pointer">
                            {rating}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Feedback Card */}
            <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] shadow-sm" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[16px] font-semibold text-[#111827]">Detailed Feedback</h3>
                <button
                  onClick={() => toggleEditMode("detailedFeedback")}
                  className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4 text-[#6B7280] hover:text-[#111827]" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Q1 */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-2">What aspects of your job did you enjoy most?</label>
                  <textarea
                    value={enjoyedMost}
                    onChange={(e) => setEnjoyedMost(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-blue-400 resize-none"
                  />
                </div>

                {/* Q2 */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-2">What aspects of your job did you enjoy least?</label>
                  <textarea
                    value={enjoyedLeast}
                    onChange={(e) => setEnjoyedLeast(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-blue-400 resize-none"
                  />
                </div>

                {/* Q3 */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-2">What suggestions do you have for improving the company?</label>
                  <textarea
                    value={improvements}
                    onChange={(e) => setImprovements(e.target.value)}
                    placeholder="Share your suggestions..."
                    rows={3}
                    className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-blue-400 resize-none"
                  />
                </div>

                {/* Q4 */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-2">How would you rate your relationship with your direct manager?</label>
                  <textarea
                    value={managerRelationship}
                    onChange={(e) => setManagerRelationship(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-blue-400 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Exit Survey Questions Card */}
            <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] shadow-sm" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[16px] font-semibold text-[#111827]">Exit Survey Questions</h3>
                <button
                  onClick={() => toggleEditMode("exitSurvey")}
                  className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4 text-[#6B7280] hover:text-[#111827]" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Question 1 */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-2">
                    Primary reason for leaving? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reasonForLeaving}
                    onChange={(e) => setReasonForLeaving(e.target.value)}
                    className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400"
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
                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-2">
                    Recommend company? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400"
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
                  <label className="block text-[13px] font-semibold text-[#111827] mb-2">
                    Return in future? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={futureReturn}
                    onChange={(e) => setFutureReturn(e.target.value)}
                    className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400"
                  >
                    <option value="">Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="Maybe">Maybe</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Decision Factors Card */}
            <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] shadow-sm" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[16px] font-semibold text-[#111827]">Decision Factors</h3>
                <button
                  onClick={() => toggleEditMode("decisionFactors")}
                  className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4 text-[#6B7280] hover:text-[#111827]" />
                </button>
              </div>
              <p className="text-[13px] text-[#6B7280] mb-4">Select the factors that influenced your decision to leave:</p>

              <div className="space-y-3">
                {decisionFactorsList.map((factor) => (
                  <div key={factor.key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`factor-${factor.key}`}
                      checked={decisionFactors[factor.key as keyof typeof decisionFactors]}
                      onChange={() => handleDecisionFactorChange(factor.key)}
                      className="h-4 w-4 rounded border-[#D1D5DB] text-blue-600 cursor-pointer"
                    />
                    <label htmlFor={`factor-${factor.key}`} className="ml-3 text-[13px] text-[#111827] cursor-pointer">
                      {factor.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Comments Card */}
            <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] shadow-sm" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
              <h3 className="text-[16px] font-semibold text-[#111827] mb-2">Additional Comments</h3>
              <p className="text-[13px] text-[#6B7280] mb-4">Is there anything else you'd like to share?</p>

              <textarea
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                placeholder="Share any additional thoughts or feedback…"
                rows={5}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/exit-interview")}
            className="px-4 py-2.5 text-sm border-[#D1D5DB]"
          >
            Back to Ratings
          </Button>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="px-4 py-2.5 text-sm border-[#D1D5DB]"
            >
              Save Draft
            </Button>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-medium"
              onClick={handleSubmit}
            >
              Submit Interview
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
