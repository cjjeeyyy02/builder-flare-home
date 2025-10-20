import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, AlertDialog, AlertDialogAction } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          <Button onClick={() => navigate("/new-offboarding")}>Back to Step 1</Button>
        </div>
      </section>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const handleSubmit = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const automatedTasks = [
    "HR documentation and file updates",
    "IT asset collection and account deactivation",
    "Exit interview scheduling",
    "Final payroll and benefits processing",
    "Security access revocation",
    "Knowledge transfer documentation",
  ];

  return (
    <section className="min-h-screen bg-[#F9FAFB]">
      <div className="w-full px-6 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 hover:bg-[#E5E7EB]"
              onClick={() => navigate("/new-offboarding-exit-details", { state: { employee: exitData.employee } })}
            >
              <ArrowLeft className="h-5 w-5 text-[#6B7280]" />
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <p className="text-xs text-[#6B7280] mt-1">Select</p>
            </div>

            {/* Connector */}
            <div className="w-8 h-0.5 bg-blue-600" />

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <p className="text-xs text-[#6B7280] mt-1">Details</p>
            </div>

            {/* Connector */}
            <div className="w-8 h-0.5 bg-blue-600" />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <p className="text-xs text-[#6B7280] mt-1 whitespace-nowrap">Review & Submit</p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-[12px] p-4 shadow-sm border border-[#E5E7EB] mb-4">
          {/* Section 1 – Review Offboarding Details */}
          <div className="mb-4">
            <h2 className="text-[14px] font-semibold text-[#111827] mb-1">Review Offboarding Details</h2>
            <p className="text-[11px] text-[#6B7280]">Please review all information before submitting.</p>
          </div>

          {/* Section 2 – Employee Information */}
          <div className="pb-3 mb-3 border-b border-[#E5E7EB]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {getInitials(exitData.employee.firstName, exitData.employee.lastName)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[13px] text-[#111827]">
                  {exitData.employee.firstName} {exitData.employee.lastName}
                </p>
                <p className="text-[11px] text-[#6B7280] mb-2">
                  {exitData.employee.role} • {exitData.employee.department}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-semibold text-[#6B7280] mb-0.5">Employee ID</p>
                    <p className="text-[11px] text-[#111827]">{exitData.employee.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-[#6B7280] mb-0.5">Email Address</p>
                    <p className="text-[11px] text-[#111827]">{exitData.employee.email}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-[10px] font-semibold text-[#6B7280] mb-0.5">Joined Date</p>
                  <p className="text-[11px] text-[#111827]">{exitData.employee.joiningDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 – Exit Details */}
          <div className="pb-3 mb-3 border-b border-[#E5E7EB]">
            <h3 className="text-[13px] font-semibold text-[#111827] mb-2">Exit Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-[11px] font-bold text-[#111827] mb-0.5">Exit Type</p>
                <p className="text-[11px] text-[#6B7280]">{exitData.exitType}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#111827] mb-0.5">Last Working Day</p>
                <p className="text-[11px] text-[#6B7280]">{formatDate(exitData.lastWorkingDay)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#111827] mb-0.5">Notice Period</p>
                <p className="text-[11px] text-[#6B7280]">{exitData.noticePeriod}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#111827] mb-0.5">Effective Date</p>
                <p className="text-[11px] text-[#6B7280]">{formatDate(exitData.effectiveDate)}</p>
              </div>
            </div>
            {exitData.reason && (
              <div className="mb-2">
                <p className="text-[11px] font-bold text-[#111827] mb-0.5">Reason</p>
                <p className="text-[11px] text-[#6B7280]">{exitData.reason}</p>
              </div>
            )}
            <div className="flex gap-2 pt-2 border-t border-[#E5E7EB]">
              {exitData.eligibleForRehire && (
                <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-lg">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[10px] text-green-700 font-medium">Rehire Eligible</span>
                </div>
              )}
              {exitData.urgentProcessing && (
                <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-lg">
                  <span className="text-[10px] text-[#6B7280] font-medium">Urgent Processing</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 4 – Automated Workflow Tasks */}
          <div>
            <h3 className="text-[13px] font-semibold text-[#111827] mb-1">Automated Workflow Tasks</h3>
            <p className="text-[11px] text-[#6B7280] mb-2">The following tasks will be automatically generated based on the exit type:</p>

            <div className="bg-[#F0F7FF] border border-blue-200 rounded-[12px] p-3">
              <ul className="space-y-1">
                {automatedTasks.map((task, idx) => (
                  <li key={idx} className="flex gap-2 text-[11px] text-blue-900">
                    <span className="flex-shrink-0 mt-0.5">•</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/new-offboarding-exit-details", { state: { employee: exitData.employee } })}
            className="px-4 py-2 border-[#D1D5DB] text-[12px]"
          >
            Back to Edit
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-[12px]"
            onClick={handleSubmit}
          >
            Submit Offboarding Request
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
            <h2 className="text-[20px] font-semibold text-[#111827] mb-2">
              Offboarding request submitted successfully.
            </h2>
            <p className="text-[14px] text-[#6B7280] mb-6">
              The offboarding case for {exitData.employee.firstName} {exitData.employee.lastName} has been created and assigned to the HR team.
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              onClick={() => navigate("/")}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
