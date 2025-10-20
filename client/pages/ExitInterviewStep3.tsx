import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ExitInterviewStep3() {
  const navigate = useNavigate();

  // Decision factors
  const [decisionFactors, setDecisionFactors] = useState({
    salary: false,
    careerGrowth: false,
    culture: false,
    environment: false,
    recognition: false,
    workLifeBalance: false,
    management: false,
    jobSecurity: false,
    training: false,
    workload: false,
  });

  const [additionalComments, setAdditionalComments] = useState("");

  const decisionFactorsList = [
    { key: "salary", label: "Salary and benefits" },
    { key: "careerGrowth", label: "Career growth opportunities" },
    { key: "culture", label: "Company culture" },
    { key: "environment", label: "Work environment" },
    { key: "recognition", label: "Recognition and rewards" },
    { key: "workLifeBalance", label: "Work-life balance" },
    { key: "management", label: "Management and leadership" },
    { key: "jobSecurity", label: "Job security" },
    { key: "training", label: "Training and development" },
    { key: "workload", label: "Workload and stress levels" },
  ];

  const handleDecisionFactorChange = (key: string) => {
    setDecisionFactors({
      ...decisionFactors,
      [key]: !decisionFactors[key as keyof typeof decisionFactors],
    });
  };

  const handleSubmit = () => {
    // Handle submission - show success message or navigate
    alert("Exit Interview submitted successfully!");
    navigate("/");
  };

  const handleSaveDraft = () => {
    // Handle saving draft
    alert("Draft saved successfully!");
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB] px-6 py-8">
      <div className="w-full">
        {/* Header Section with Back Button */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            className="h-10 w-10 p-0 hover:bg-[#E5E7EB]"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 text-[#6B7280]" />
          </Button>
          <div>
            <h1 className="text-[28px] font-semibold text-[#111827] mb-2">Exit Interview</h1>
            <p className="text-[14px] text-[#6B7280]">Feedback</p>
          </div>
        </div>

        {/* Employee Information Card */}
        <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] shadow-sm mb-6" style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 className="text-[16px] font-semibold text-[#111827] mb-6">Employee Information</h3>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            <div>
              <p className="text-[12px] text-[#9CA3AF] font-medium mb-1">Name</p>
              <p className="text-[13px] font-medium text-[#111827]">Sarah Johnson</p>
            </div>
            <div>
              <p className="text-[12px] text-[#9CA3AF] font-medium mb-1">Position</p>
              <p className="text-[13px] font-medium text-[#111827]">Senior Developer</p>
            </div>
            <div>
              <p className="text-[12px] text-[#9CA3AF] font-medium mb-1">Department</p>
              <p className="text-[13px] font-medium text-[#111827]">Engineering</p>
            </div>
            <div>
              <p className="text-[12px] text-[#9CA3AF] font-medium mb-1">Employee ID</p>
              <p className="text-[13px] font-medium text-[#111827]">EMP017</p>
            </div>
            <div>
              <p className="text-[12px] text-[#9CA3AF] font-medium mb-1">Manager</p>
              <p className="text-[13px] font-medium text-[#111827]">John Smith</p>
            </div>
            <div>
              <p className="text-[12px] text-[#9CA3AF] font-medium mb-1">Tenure</p>
              <p className="text-[13px] font-medium text-[#111827]">2022-03-15 to 2024-01-15</p>
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
            onClick={() => navigate("/exit-interview-step2")}
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
