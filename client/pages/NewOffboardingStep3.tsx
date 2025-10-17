import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
  const [submitted, setSubmitted] = useState(false);

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
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  if (submitted) {
    return (
      <section className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="bg-white rounded-[12px] p-8 shadow-sm border border-[#E5E7EB] text-center max-w-md">
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
          <h2 className="text-[20px] font-semibold text-[#111827] mb-2">Offboarding Initiated</h2>
          <p className="text-[14px] text-[#6B7280] mb-4">
            The offboarding process for {exitData.employee.firstName} {exitData.employee.lastName} has been successfully initiated.
          </p>
          <p className="text-[13px] text-[#9CA3AF]">Redirecting to dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 hover:bg-[#E5E7EB]"
              onClick={() => navigate("/new-offboarding-exit-details", { state: { employee: exitData.employee } })}
            >
              <ArrowLeft className="h-5 w-5 text-[#6B7280]" />
            </Button>
            <div>
              <h1 className="text-[24px] font-semibold text-[#111827]">Initiate Offboarding</h1>
              <p className="text-[16px] font-medium text-[#6B7280]">Review & Submit</p>
            </div>
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
              <p className="text-xs text-[#6B7280] mt-1 whitespace-nowrap">Review</p>
            </div>
          </div>
        </div>

        {/* Review Summary Card */}
        <div className="bg-white rounded-[12px] p-6 shadow-sm border border-[#E5E7EB] mb-8">
          <h3 className="text-[16px] font-semibold text-[#111827] mb-6">Offboarding Summary</h3>

          {/* Employee Section */}
          <div className="pb-6 border-b border-[#E5E7EB]">
            <p className="text-[14px] font-bold text-[#111827] mb-4">Selected Employee</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold">
                {getInitials(exitData.employee.firstName, exitData.employee.lastName)}
              </div>
              <div>
                <p className="font-bold text-[16px] text-[#111827]">
                  {exitData.employee.firstName} {exitData.employee.lastName}
                </p>
                <p className="text-[14px] text-[#6B7280]">
                  {exitData.employee.role} • {exitData.employee.department}
                </p>
              </div>
            </div>
          </div>

          {/* Exit Details Section */}
          <div className="py-6 border-b border-[#E5E7EB]">
            <p className="text-[14px] font-bold text-[#111827] mb-4">Exit Details</p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[13px] text-[#6B7280] mb-1">Exit Type</p>
                <p className="text-[14px] font-medium text-[#111827]">{exitData.exitType}</p>
              </div>
              <div>
                <p className="text-[13px] text-[#6B7280] mb-1">Notice Period</p>
                <p className="text-[14px] font-medium text-[#111827]">{exitData.noticePeriod}</p>
              </div>
              <div>
                <p className="text-[13px] text-[#6B7280] mb-1">Last Working Day</p>
                <p className="text-[14px] font-medium text-[#111827]">{formatDate(exitData.lastWorkingDay)}</p>
              </div>
              <div>
                <p className="text-[13px] text-[#6B7280] mb-1">Effective Date</p>
                <p className="text-[14px] font-medium text-[#111827]">{formatDate(exitData.effectiveDate)}</p>
              </div>
            </div>
            {exitData.reason && (
              <div className="mt-4">
                <p className="text-[13px] text-[#6B7280] mb-1">Reason for Departure</p>
                <p className="text-[14px] text-[#111827]">{exitData.reason}</p>
              </div>
            )}
          </div>

          {/* Flags Section */}
          <div className="py-6">
            <p className="text-[14px] font-bold text-[#111827] mb-4">Additional Information</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded flex items-center justify-center ${exitData.eligibleForRehire ? "bg-green-100" : "bg-gray-100"}`}>
                  {exitData.eligibleForRehire && (
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-[14px] text-[#111827]">Eligible for rehire</p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded flex items-center justify-center ${exitData.urgentProcessing ? "bg-red-100" : "bg-gray-100"}`}>
                  {exitData.urgentProcessing && (
                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-[14px] text-[#111827]">Urgent processing required</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-[12px] p-4 mb-8">
          <p className="text-[13px] text-blue-700">
            <span className="font-semibold">Note:</span> Once submitted, an offboarding case will be created and assigned to the HR team. All relevant stakeholders will be notified.
          </p>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/new-offboarding-exit-details", { state: { employee: exitData.employee } })}
            className="px-6 py-2 border-[#D1D5DB]"
          >
            Back
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
            onClick={handleSubmit}
          >
            Submit & Create Case
          </Button>
        </div>
      </div>
    </section>
  );
}
