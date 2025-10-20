import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Employee } from "@/lib/data/employees";

export default function NewOffboardingStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedEmployee = location.state?.employee as Employee | undefined;

  if (!selectedEmployee) {
    return (
      <section className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6B7280] mb-4">No employee selected</p>
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

  const [exitType, setExitType] = useState("Resignation");
  const [lastWorkingDay, setLastWorkingDay] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [reason, setReason] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("2 Weeks");
  const [eligibleForRehire, setEligibleForRehire] = useState(true);
  const [urgentProcessing, setUrgentProcessing] = useState(false);

  const handleContinue = () => {
    const exitData = {
      employee: selectedEmployee,
      exitType,
      lastWorkingDay,
      effectiveDate,
      reason,
      noticePeriod,
      eligibleForRehire,
      urgentProcessing,
    };
    navigate("/new-offboarding-review", { state: exitData });
  };

  return (
    <section className="w-screen h-screen bg-[#F9FAFB] overflow-auto">
      <div className="w-full px-6 py-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 hover:bg-[#E5E7EB] mb-2"
              onClick={() => navigate("/new-offboarding")}
            >
              <ArrowLeft className="h-5 w-5 text-[#6B7280]" />
            </Button>
            <div>
              <h1 className="text-[24px] font-semibold text-[#111827]">
                Initiate Offboarding
              </h1>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-1">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs">
                1
              </div>
              <p className="text-[10px] text-[#6B7280] mt-0.5">Select</p>
            </div>

            {/* Connector */}
            <div className="w-3 h-0.5 bg-blue-600" />

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs">
                2
              </div>
              <p className="text-[10px] text-[#6B7280] mt-0.5">Details</p>
            </div>

            {/* Connector */}
            <div className="w-3 h-0.5 bg-[#D1D5DB]" />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-[#D1D5DB] text-[#9CA3AF] flex items-center justify-center font-semibold text-xs">
                3
              </div>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5 whitespace-nowrap">
                Review
              </p>
            </div>
          </div>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-[12px] p-6 shadow-sm border border-[#E5E7EB]">
          {/* Selected Employee Card - Minimized */}
          <div className="bg-[#F9FAFB] rounded-[8px] p-3 mb-6 border border-[#E5E7EB]">
            <h3 className="text-[12px] font-bold text-[#111827] mb-2">
              Selected Employee
            </h3>

            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {getInitials(
                  selectedEmployee.firstName,
                  selectedEmployee.lastName,
                )}
              </div>

              {/* Employee Info */}
              <div className="min-w-0">
                <p className="font-bold text-[13px] text-[#111827] truncate">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </p>
                <p className="text-[12px] text-[#6B7280] truncate">
                  {selectedEmployee.role} • {selectedEmployee.department}
                </p>
              </div>
            </div>
          </div>

          {/* Exit Details Form */}
          <div className="mb-6">
            <h3 className="text-[14px] font-semibold text-[#111827] mb-1">
              Exit Details
            </h3>
            <p className="text-[12px] text-[#6B7280] mb-4">
              Provide details about the employee's departure.
            </p>

            {/* Form Fields */}
            {/* Two Column Form Layout */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Exit Type */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#111827] mb-1.5">
                    Exit Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={exitType}
                    onChange={(e) => setExitType(e.target.value)}
                    className="w-full rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400"
                  >
                    <option value="Resignation">Resignation</option>
                    <option value="Termination">Termination</option>
                    <option value="Retirement">Retirement</option>
                    <option value="Layoff">Layoff</option>
                    <option value="End of Contract">End of Contract</option>
                  </select>
                  <p className="text-[11px] text-[#6B7280] mt-1">
                    Employee voluntarily leaving
                  </p>
                </div>

                {/* Effective Date */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#111827] mb-1.5">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400"
                  />
                </div>

                {/* Last Working Day */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#111827] mb-1.5">
                    Last Working Day <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={lastWorkingDay}
                    onChange={(e) => setLastWorkingDay(e.target.value)}
                    className="w-full rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Reason for Departure */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#111827] mb-1.5">
                    Reason for Departure
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason..."
                    rows={4}
                    className="w-full rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400 resize-none"
                  />
                </div>

                {/* Notice Period Given */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#111827] mb-1.5">
                    Notice Period Given
                  </label>
                  <select
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    className="w-full rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] text-[#111827] focus:outline-none focus:border-blue-400"
                  >
                    <option value="1 Week">1 Week</option>
                    <option value="2 Weeks">2 Weeks</option>
                    <option value="1 Month">1 Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months">3 Months</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-3 border-t border-[#E5E7EB]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={eligibleForRehire}
                      onChange={(e) => setEligibleForRehire(e.target.checked)}
                      className="w-4 h-4 rounded border-[#D1D5DB] text-blue-600 cursor-pointer"
                    />
                    <span className="text-[12px] text-[#111827]">
                      Employee is eligible for rehire
                    </span>
                  </label>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={urgentProcessing}
                        onChange={(e) => setUrgentProcessing(e.target.checked)}
                        className="w-4 h-4 rounded border-[#D1D5DB] text-blue-600 cursor-pointer"
                      />
                      <span className="text-[12px] text-[#111827]">
                        Urgent processing required
                      </span>
                    </label>
                    <p className="text-[11px] text-[#6B7280] ml-6">
                      This will expedite all offboarding tasks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons - Inside Container */}
          <div className="flex items-center justify-between gap-3 border-t border-[#E5E7EB] pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/new-offboarding")}
              className="px-6 py-2 border-[#D1D5DB] text-[13px]"
            >
              Back
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-[13px]"
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
