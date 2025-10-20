import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ExitInterviewForm() {
  const navigate = useNavigate();

  // Overall Job Satisfaction
  const [jobSatisfaction, setJobSatisfaction] = useState(3);

  // Ratings
  const [workLifeBalance, setWorkLifeBalance] = useState(3);
  const [managementSupport, setManagementSupport] = useState(3);
  const [careerDevelopment, setCareerDevelopment] = useState(3);
  const [compensation, setCompensation] = useState(3);
  const [workEnvironment, setWorkEnvironment] = useState(3);
  const [teamCollaboration, setTeamCollaboration] = useState(3);

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
    teamCollaboration: false,
    workEnvironment: false,
    workLifeBalance: false,
    jobSecurity: false,
    jobDevelopment: false,
  });

  const [additionalComments, setAdditionalComments] = useState("");

  const decisionFactorsList = [
    { key: "salary", label: "Salary and benefits" },
    { key: "careerGrowth", label: "Career growth opportunities" },
    { key: "culture", label: "Company culture" },
    { key: "recognition", label: "Recognition and rewards" },
    { key: "management", label: "Management and leadership" },
    { key: "training", label: "Training and development" },
    { key: "teamCollaboration", label: "Team collaboration" },
    { key: "workEnvironment", label: "Work environment" },
    { key: "workLifeBalance", label: "Work-life balance" },
    { key: "jobSecurity", label: "Job security" },
    { key: "jobDevelopment", label: "Job development" },
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

  return (
    <section className="min-h-screen bg-[#F9FAFB] px-6 py-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Section with Back Button */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            className="h-10 w-10 p-0 hover:bg-[#E5E7EB]"
            onClick={() => navigate("/exit-interview")}
          >
            <ArrowLeft className="h-5 w-5 text-[#6B7280]" />
          </Button>
          <div>
            <h1 className="text-[28px] font-semibold text-[#111827] mb-2">Exit Interview Form</h1>
            <p className="text-[14px] text-[#6B7280]">Provide your feedback and insights</p>
          </div>
        </div>

        {/* Overall Job Satisfaction Card */}
        <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] shadow-sm mb-6" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 className="text-[16px] font-semibold text-[#111827] mb-6">Overall Job Satisfaction</h3>

          <div className="space-y-6">
            {/* Job Satisfaction */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#111827]">How would you rate your overall job satisfaction?</label>
                <div className="flex gap-1">
                  <span className="text-[12px] text-[#6B7280] font-medium">{jobSatisfaction}</span>
                  <span className="text-[12px] text-[#9CA3AF]">
                    {jobSatisfaction === 1 && "Very Poor"}
                    {jobSatisfaction === 2 && "Poor"}
                    {jobSatisfaction === 3 && "Neutral"}
                    {jobSatisfaction === 4 && "Good"}
                    {jobSatisfaction === 5 && "Excellent"}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={jobSatisfaction}
                onChange={(e) => setJobSatisfaction(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: "#3B82F6" }}
              />
            </div>

            {/* Work-Life Balance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#111827]">Work-Life Balance</label>
                <div className="flex gap-1">
                  <span className="text-[12px] text-[#6B7280] font-medium">{workLifeBalance}</span>
                  <span className="text-[12px] text-[#9CA3AF]">
                    {workLifeBalance === 1 && "Very Poor"}
                    {workLifeBalance === 2 && "Poor"}
                    {workLifeBalance === 3 && "Neutral"}
                    {workLifeBalance === 4 && "Good"}
                    {workLifeBalance === 5 && "Excellent"}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={workLifeBalance}
                onChange={(e) => setWorkLifeBalance(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: "#3B82F6" }}
              />
            </div>

            {/* Management Support */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#111827]">Management Support</label>
                <div className="flex gap-1">
                  <span className="text-[12px] text-[#6B7280] font-medium">{managementSupport}</span>
                  <span className="text-[12px] text-[#9CA3AF]">
                    {managementSupport === 1 && "Very Poor"}
                    {managementSupport === 2 && "Poor"}
                    {managementSupport === 3 && "Neutral"}
                    {managementSupport === 4 && "Good"}
                    {managementSupport === 5 && "Excellent"}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={managementSupport}
                onChange={(e) => setManagementSupport(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: "#3B82F6" }}
              />
            </div>

            {/* Career Development Opportunities */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#111827]">Career Development Opportunities</label>
                <div className="flex gap-1">
                  <span className="text-[12px] text-[#6B7280] font-medium">{careerDevelopment}</span>
                  <span className="text-[12px] text-[#9CA3AF]">
                    {careerDevelopment === 1 && "Very Poor"}
                    {careerDevelopment === 2 && "Poor"}
                    {careerDevelopment === 3 && "Neutral"}
                    {careerDevelopment === 4 && "Good"}
                    {careerDevelopment === 5 && "Excellent"}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={careerDevelopment}
                onChange={(e) => setCareerDevelopment(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: "#3B82F6" }}
              />
            </div>

            {/* Compensation and Benefits */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#111827]">Compensation and Benefits</label>
                <div className="flex gap-1">
                  <span className="text-[12px] text-[#6B7280] font-medium">{compensation}</span>
                  <span className="text-[12px] text-[#9CA3AF]">
                    {compensation === 1 && "Very Poor"}
                    {compensation === 2 && "Poor"}
                    {compensation === 3 && "Neutral"}
                    {compensation === 4 && "Good"}
                    {compensation === 5 && "Excellent"}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={compensation}
                onChange={(e) => setCompensation(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: "#3B82F6" }}
              />
            </div>

            {/* Work Environment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#111827]">Work Environment</label>
                <div className="flex gap-1">
                  <span className="text-[12px] text-[#6B7280] font-medium">{workEnvironment}</span>
                  <span className="text-[12px] text-[#9CA3AF]">
                    {workEnvironment === 1 && "Very Poor"}
                    {workEnvironment === 2 && "Poor"}
                    {workEnvironment === 3 && "Neutral"}
                    {workEnvironment === 4 && "Good"}
                    {workEnvironment === 5 && "Excellent"}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={workEnvironment}
                onChange={(e) => setWorkEnvironment(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: "#3B82F6" }}
              />
            </div>

            {/* Team Collaboration */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#111827]">Team Collaboration</label>
                <div className="flex gap-1">
                  <span className="text-[12px] text-[#6B7280] font-medium">{teamCollaboration}</span>
                  <span className="text-[12px] text-[#9CA3AF]">
                    {teamCollaboration === 1 && "Very Poor"}
                    {teamCollaboration === 2 && "Poor"}
                    {teamCollaboration === 3 && "Neutral"}
                    {teamCollaboration === 4 && "Good"}
                    {teamCollaboration === 5 && "Excellent"}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={teamCollaboration}
                onChange={(e) => setTeamCollaboration(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: "#3B82F6" }}
              />
            </div>
          </div>
        </div>

        {/* Detailed Feedback Card */}
        <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] shadow-sm mb-6" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 className="text-[16px] font-semibold text-[#111827] mb-6">Detailed Feedback</h3>

          <div className="space-y-6">
            {/* Q1 */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-2">What aspects of your job did you enjoy most?</label>
              <textarea
                value={enjoyedMost}
                onChange={(e) => setEnjoyedMost(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
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
                rows={4}
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
                rows={4}
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
                rows={4}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Exit Survey Questions Card */}
        <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] shadow-sm mb-6" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 className="text-[16px] font-semibold text-[#111827] mb-6">Exit Survey Questions</h3>

          <div className="space-y-6">
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
        <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] shadow-sm mb-6" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 className="text-[16px] font-semibold text-[#111827] mb-6">Decision Factors</h3>
          <p className="text-[13px] text-[#6B7280] mb-6">Select the factors that influenced your decision to leave:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decisionFactorsList.map((factor) => (
              <div key={factor.key} className="flex items-center">
                <input
                  type="checkbox"
                  id={`factor-${factor.key}`}
                  checked={decisionFactors[factor.key as keyof typeof decisionFactors]}
                  onChange={() => handleDecisionFactorChange(factor.key)}
                  className="h-4 w-4 rounded border-[#D1D5DB] text-blue-600 cursor-pointer"
                />
                <label htmlFor={`factor-${factor.key}`} className="ml-2 text-[13px] text-[#111827] cursor-pointer">
                  {factor.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Comments Card */}
        <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] shadow-sm mb-6" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 className="text-[16px] font-semibold text-[#111827] mb-2">Additional Comments</h3>
          <p className="text-[13px] text-[#6B7280] mb-4">Is there anything else you'd like to share?</p>

          <textarea
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            placeholder="Share any additional thoughts or feedback…"
            rows={6}
            className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-blue-400 resize-none"
          />
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
