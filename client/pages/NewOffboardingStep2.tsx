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
          <Button onClick={() => navigate("/new-offboarding")}>Back to Step 1</Button>
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
    <section className="min-h-screen bg-[#F9FAFB]">
      <div className="w-full px-6 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 hover:bg-[#E5E7EB]"
              onClick={() => navigate("/new-offboarding")}
            >
              <ArrowLeft className="h-5 w-5 text-[#6B7280]" />
            </Button>
            <div>
              <h1 className="text-[24px] font-semibold text-[#111827]">Initiate Offboarding</h1>
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
            <div className="w-8 h-0.5 bg-[#D1D5DB]" />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#D1D5DB] text-[#9CA3AF] flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <p className="text-xs text-[#9CA3AF] mt-1 whitespace-nowrap">Review</p>
            </div>
          </div>
        </div>

        {/* Selected Employee Card */}
        <div className="bg-white rounded-[12px] p-6 shadow-sm border border-[#E5E7EB] mb-8">
          <h3 className="text-[14px] font-bold text-[#111827] mb-4">Selected Employee</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-lg">
                {getInitials(selectedEmployee.firstName, selectedEmployee.lastName)}
              </div>

              {/* Employee Info */}
              <div>
                <p className="font-bold text-[16px] text-[#111827]">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </p>
                <p className="text-[14px] text-[#6B7280] mb-1">
                  {selectedEmployee.role} • {selectedEmployee.department}
                </p>
                <p className="text-[13px] text-[#9CA3AF]">
                  {selectedEmployee.id} • {selectedEmployee.email}
                </p>
              </div>
            </div>

            {/* Change Employee Button */}
            <Button
              variant="outline"
              className="px-4 py-2 border-[#D1D5DB]"
              onClick={() => navigate("/new-offboarding")}
            >
              Change Employee
            </Button>
          </div>
        </div>

        {/* Exit Details Card */}
        <div className="bg-white rounded-[12px] p-6 shadow-sm border border-[#E5E7EB] mb-8">
          <h3 className="text-[16px] font-semibold text-[#111827] mb-2">Exit Details</h3>
          <p className="text-[14px] text-[#6B7280] mb-6">Provide details about the employee's departure.</p>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Exit Type */}
            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-2">
                Exit Type <span className="text-red-500">*</span>
              </label>
              <select
                value={exitType}
                onChange={(e) => setExitType(e.target.value)}
                className="w-full rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2.5 text-[14px] text-[#111827] focus:outline-none focus:border-blue-400"
              >
                <option value="Resignation">Resignation</option>
                <option value="Termination">Termination</option>
                <option value="Retirement">Retirement</option>
                <option value="Layoff">Layoff</option>
                <option value="End of Contract">End of Contract</option>
              </select>
              <p className="text-[13px] text-[#6B7280] mt-1">Employee voluntarily leaving</p>
            </div>

            {/* Last Working Day and Effective Date */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[14px] font-bold text-[#111827] mb-2">
                  Last Working Day <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={lastWorkingDay}
                  onChange={(e) => setLastWorkingDay(e.target.value)}
                  className="w-full rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2.5 text-[14px] text-[#111827] focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#111827] mb-2">
                  Effective Date
                </label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2.5 text-[14px] text-[#111827] focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Reason for Departure */}
            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-2">
                Reason for Departure
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter the reason for departure..."
                rows={4}
                className="w-full rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2.5 text-[14px] text-[#111827] focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>

            {/* Notice Period */}
            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-2">
                Notice Period Given
              </label>
              <select
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                className="w-full rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2.5 text-[14px] text-[#111827] focus:outline-none focus:border-blue-400"
              >
                <option value="1 Week">1 Week</option>
                <option value="2 Weeks">2 Weeks</option>
                <option value="1 Month">1 Month</option>
                <option value="2 Months">2 Months</option>
                <option value="3 Months">3 Months</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 pt-4 border-t border-[#E5E7EB]">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eligibleForRehire}
                  onChange={(e) => setEligibleForRehire(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D1D5DB] text-blue-600 cursor-pointer"
                />
                <span className="text-[14px] text-[#111827]">Employee is eligible for rehire</span>
              </label>

              <div>
                <label className="flex items-center gap-3 cursor-pointer mb-1">
                  <input
                    type="checkbox"
                    checked={urgentProcessing}
                    onChange={(e) => setUrgentProcessing(e.target.checked)}
                    className="w-4 h-4 rounded border-[#D1D5DB] text-blue-600 cursor-pointer"
                  />
                  <span className="text-[14px] text-[#111827]">Urgent processing required</span>
                </label>
                <p className="text-[13px] text-[#6B7280] ml-7">This will expedite all offboarding tasks.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/new-offboarding")}
            className="px-6 py-2 border-[#D1D5DB]"
          >
            Back
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            onClick={handleContinue}
          >
            Continue to Review
          </Button>
        </div>
      </div>
    </section>
  );
}
