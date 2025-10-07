import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface AddReportFormData {
  fullName: string;
  position: string;
  department: string;
  email: string;
  phone?: string;
  location?: string;
}

interface AddReportModalTemplateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  managerName: string;
  managerRole: string;
  onAdd?: (data: AddReportFormData) => void;
}

export default function AddReportModalTemplate({ open, onOpenChange, managerName, managerRole, onAdd }: AddReportModalTemplateProps) {
  const [data, setData] = useState<AddReportFormData>({ fullName: "", position: "", department: "", email: "", phone: "", location: "" });

  const canSubmit = useMemo(() => data.fullName.trim() && data.position.trim() && data.department.trim() && data.email.trim(), [data]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[12px] p-6" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)", maxWidth: "800px" }}>
        <DialogHeader>
          <DialogTitle className="text-[18px] font-bold text-[#1A1A1A]">Add Report to {managerName}</DialogTitle>
        </DialogHeader>

        {/* Reporting info card */}
        <div className="mt-1 flex items-center gap-3 rounded-[8px] bg-[#F0F6FF] px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3B82F6]" />
          <div className="leading-tight">
            <div className="font-semibold text-[#1A1A1A]">Reporting to: {managerName}</div>
            <div className="text-[14px] text-[#6B7280]">{managerRole}</div>
          </div>
        </div>

        {/* Form */}
        <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-5">
          <div className="grid gap-1.5">
            <Label className="text-[14px] font-medium text-[#1A1A1A]">Full Name <span className="text-red-500">*</span></Label>
            <Input
              placeholder="Full name"
              className="rounded-[8px] border-[#E5E7EB] placeholder:text-[#9CA3AF] px-3 py-2"
              value={data.fullName}
              onChange={(e) => setData((d) => ({ ...d, fullName: e.target.value }))}
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-[14px] font-medium text-[#1A1A1A]">Position <span className="text-red-500">*</span></Label>
            <Input
              placeholder="Position / Title"
              className="rounded-[8px] border-[#E5E7EB] placeholder:text-[#9CA3AF] px-3 py-2"
              value={data.position}
              onChange={(e) => setData((d) => ({ ...d, position: e.target.value }))}
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-[14px] font-medium text-[#1A1A1A]">Department <span className="text-red-500">*</span></Label>
            <Select onValueChange={(v) => setData((d) => ({ ...d, department: v }))}>
              <SelectTrigger className="h-9 rounded-[8px] border-[#E5E7EB]"><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="human resources">Human Resources</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-[14px] font-medium text-[#1A1A1A]">Email <span className="text-red-500">*</span></Label>
            <Input
              type="email"
              placeholder="email@company.com"
              className="rounded-[8px] border-[#E5E7EB] placeholder:text-[#9CA3AF] px-3 py-2"
              value={data.email}
              onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-[14px] font-medium text-[#1A1A1A]">Phone</Label>
            <Input
              placeholder="Optional phone number"
              className="rounded-[8px] border-[#E5E7EB] placeholder:text-[#9CA3AF] px-3 py-2"
              value={data.phone}
              onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-[14px] font-medium text-[#1A1A1A]">Location</Label>
            <Input
              placeholder="Optional location"
              className="rounded-[8px] border-[#E5E7EB] placeholder:text-[#9CA3AF] px-3 py-2"
              value={data.location}
              onChange={(e) => setData((d) => ({ ...d, location: e.target.value }))}
            />
          </div>
        </div>

        {/* Note */}
        <div className="mt-4 rounded-[6px] bg-[#E6F8E8] px-4 py-3 text-[14px]">
          <span className="font-semibold text-[#16A34A]">Note:</span>{" "}
          <span className="text-[#374151]">This employee will be added as a direct report to {managerName}. You can edit additional details after creation.</span>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="rounded-[8px] border border-[#E5E7EB] bg-white text-[#1A1A1A]">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            className="rounded-[8px] bg-[#3B82F6] font-bold text-white hover:bg-[#2563EB]"
            onClick={() => {
              if (!canSubmit) return;
              onAdd?.(data);
              onOpenChange(false);
            }}
          >
            + Add Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
