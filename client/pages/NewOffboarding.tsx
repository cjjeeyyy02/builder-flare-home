import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EMPLOYEES, Employee } from "@/lib/data/employees";

export default function NewOffboarding() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = EMPLOYEES.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      fullName.includes(query) ||
      emp.id.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query)
    );
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleContinue = () => {
    if (selectedEmployee) {
      navigate("/new-offboarding-exit-details", { state: { employee: selectedEmployee } });
    }
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB]">
      <div className="w-full px-6 py-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-[#E5E7EB] mb-2"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4 text-[#6B7280]" />
            </Button>
            <div>
              <h1 className="text-[20px] font-semibold text-[#111827]">Initiate Offboarding</h1>
              <p className="text-[13px] text-[#6B7280]">Select Employee</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs">
                1
              </div>
              <p className="text-[10px] text-[#6B7280] mt-0.5">Select</p>
            </div>

            {/* Connector */}
            <div className="w-6 h-0.5 bg-[#D1D5DB]" />

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#D1D5DB] text-[#9CA3AF] flex items-center justify-center font-semibold text-xs">
                2
              </div>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Details</p>
            </div>

            {/* Connector */}
            <div className="w-6 h-0.5 bg-[#D1D5DB]" />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#D1D5DB] text-[#9CA3AF] flex items-center justify-center font-semibold text-xs">
                3
              </div>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Review</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg p-5 mb-4 shadow-sm border border-[#E5E7EB]">
          <h2 className="text-[16px] font-semibold text-[#111827] mb-1">Select Employee to Offboard</h2>
          <p className="text-[12px] text-[#6B7280] mb-4">
            Search and select the employee who will be leaving the organization
          </p>

          {/* Search Bar */}
          <div className="relative mb-4 w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search by name, employee ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white pl-9 pr-3 py-2 text-xs placeholder-[#9CA3AF] focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Employee List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => setSelectedEmployee(employee)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedEmployee?.id === employee.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-[#E5E7EB] bg-white hover:shadow-sm hover:border-[#D1D5DB]"
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs">
                      {getInitials(employee.firstName, employee.lastName)}
                    </div>
                  </div>

                  {/* Employee Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <p className="font-semibold text-[13px] text-[#111827]">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF]">{employee.id}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                      <p>{employee.role}</p>
                      <span>•</span>
                      <p>{employee.department}</p>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedEmployee?.id === employee.id && (
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-[12px] text-[#9CA3AF]">No employees found.</div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="px-4 py-2 text-sm"
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
            disabled={!selectedEmployee}
            onClick={handleContinue}
          >
            Initiate Offboarding
          </Button>
        </div>
      </div>
    </section>
  );
}
