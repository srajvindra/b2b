"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MessageSquare, Users } from "lucide-react"
import type { Communication } from "../types"

interface CommunicationModalProps {
  communication: Communication | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommunicationModal({
  communication,
  open,
  onOpenChange,
}: CommunicationModalProps) {
  if (!communication) return null

  const Icon =
    communication.type === "email"
      ? Mail
      : communication.type === "call"
        ? Phone
        : communication.isGroupSms
          ? Users
          : MessageSquare

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          communication.type === "call"
            ? "sm:max-w-[500px]"
            : "sm:max-w-[600px] max-h-[85vh] flex flex-col"
        }
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                communication.isGroupSms
                  ? "bg-purple-100"
                  : communication.type === "email"
                    ? "bg-blue-100"
                    : communication.type === "call"
                      ? "bg-green-100"
                      : "bg-slate-100"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  communication.isGroupSms
                    ? "text-purple-600"
                    : communication.type === "email"
                      ? "text-blue-600"
                      : communication.type === "call"
                        ? "text-green-600"
                        : "text-slate-600"
                }`}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg">
                  {communication.from}
                </DialogTitle>
                {communication.isGroupSms && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-purple-100 text-purple-700"
                  >
                    Group SMS
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-sm">
                {communication.type === "email"
                  ? "Email Thread"
                  : communication.type === "call"
                    ? "Phone Call"
                    : "Text Message"}{" "}
                • {communication.timestamp}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Assigned to: {communication.assignedTo}</span>
              {!communication.read && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 text-[10px]"
                >
                  Unread
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {communication.fullMessage || communication.preview}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
