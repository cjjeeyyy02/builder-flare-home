import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Employee } from "@/lib/data/employees";

interface ExitData {
  employee: Employee;
  exitType: string;
  lastWorkingDay: string;
  effectiveDate: string;
  reason: string;
  noticePeriod: string;
  eligibleForRehire: boolean;
  urgentProcessing: boolean;
}

export default function NewOffboardingStep3() {
  const navigate = useNavigate();
  const location = useLocation();
  const exitData = location.state as ExitData | undefined;
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (!exitData) {
    return (
      <section className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6B7280] mb-4">No exit data found</p>
          <Button onClick={() => navigate("/new-offboarding")}>
            Back to Step 1
          </Button>
        </div>
      </section>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const automatedTasks = [
    "HR documentation and file updates",
    "IT asset collection and account deactivation",
    "Exit interview scheduling",
    "Final payroll and benefits processing",
    "Security access revocation",
    "Knowledge transfer documentation",
  ];

  const handleSubmit = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB] px-6 py-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 hover:bg-[#E5E7EB] mb-3"
              onClick={() =>
                navigate("/new-offboarding-exit-details", {
                  state: { employee: exitData.employee },
                })
              }
            >
              <ArrowLeft className="h-5 w-5 text-[#6B7280]" />
            </Button>
            <h1 className="text-[20px] font-semibold text-[#111827] mb-2">
              Review Offboarding Details
            </h1>
            <p className="text-[14px] text-[#6B7280]">
              Please review all information before submitting.
            </p>
          </div>

          {/* Progress Indicator - Step 3 */}
          <div className="flex items-center gap-1">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-[10px]">
                1
              </div>
              <p className="text-[9px] text-[#6B7280] mt-0.5">Select</p>
            </div>

            {/* Connector */}
            <div className="w-2 h-0.5 bg-blue-600" />

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-[10px]">
                2
              </div>
              <p className="text-[9px] text-[#6B7280] mt-0.5">Details</p>
            </div>

            {/* Connector */}
            <div className="w-2 h-0.5 bg-blue-600" />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-[10px]">
                3
              </div>
              <p className="text-[9px] text-[#6B7280] mt-0.5 whitespace-nowrap">
                Review
              </p>
            </div>
          </div>
        </div>

        {/* Employee Information Section */}
        <div className="mb-4">
          <div className="bg-white rounded-[12px] shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-[16px] flex-shrink-0">
                {getInitials(
                  exitData.employee.firstName,
                  exitData.employee.lastName,
                )}
              </div>

              {/* Employee Details */}
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-[#111827] mb-1">
                  {exitData.employee.firstName} {exitData.employee.lastName}
                </p>
                <p className="text-[13px] text-[#6B7280] mb-2">
                  {exitData.employee.role} – {exitData.employee.department}
                </p>
                <p className="text-[13px] text-[#9CA3AF]">
                  {exitData.employee.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exit Details and Automated Workflow Tasks - Two Column Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {/* Left Column - Exit Details */}
          <div className="bg-white rounded-[12px] shadow-sm border border-[#E5E7EB] p-4">
            <h3 className="text-[15px] font-semibold text-[#111827] mb-4">
              Exit Details
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-[12px] font-semibold text-[#6B7280] mb-1">
                  Exit Type
                </p>
                <p className="text-[13px] text-[#111827]">
                  {exitData.exitType}
                </p>
              </div>

              <div>
                <p className="text-[12px] font-semibold text-[#6B7280] mb-1">
                  Effective Date
                </p>
                <p className="text-[13px] text-[#111827]">
                  {exitData.effectiveDate || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-[12px] font-semibold text-[#6B7280] mb-1">
                  Last Working Day
                </p>
                <p className="text-[13px] text-[#111827]">
                  {exitData.lastWorkingDay || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-[12px] font-semibold text-[#6B7280] mb-1">
                  Reason for Departure
                </p>
                <p className="text-[13px] text-[#111827]">
                  {exitData.reason || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-[12px] font-semibold text-[#6B7280] mb-1">
                  Notice Period
                </p>
                <p className="text-[13px] text-[#111827]">
                  {exitData.noticePeriod}
                </p>
              </div>

              {exitData.eligibleForRehire && (
                <div className="pt-2 mt-2 border-t border-[#E5E7EB]">
                  <span className="inline-block bg-[#DCFCE7] text-[#16A34A] text-[12px] px-2 py-1 rounded-[6px] font-medium">
                    Rehire Eligible
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Automated Workflow Tasks */}
          <div className="bg-white rounded-[12px] shadow-sm border border-[#E5E7EB] p-4">
            <h3 className="text-[15px] font-semibold text-[#111827] mb-2">
              Automated Workflow Tasks
            </h3>
            <p className="text-[13px] text-[#6B7280] mb-4">
              The following tasks will be automatically generated based on the
              exit type:
            </p>

            <div className="bg-[#F0F9FF] rounded-[8px] p-3">
              <ul className="space-y-2">
                {automatedTasks.map((task, idx) => (
                  <li
                    key={idx}
                    className="flex gap-2 text-[13px] text-[#111827]"
                  >
                    <span className="flex-shrink-0">•</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button - Bottom Right */}
        <div className="flex justify-end">
          <Button
            className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-[8px] text-[13px]"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-[12px] p-8 shadow-lg max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-[18px] font-semibold text-[#111827] mb-2">
              Offboarding details submitted successfully.
            </h2>
            <p className="text-[13px] text-[#6B7280]">
              The offboarding case for {exitData.employee.firstName}{" "}
              {exitData.employee.lastName} has been created and assigned to the
              HR team.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
