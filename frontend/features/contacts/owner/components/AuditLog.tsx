"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { History, Eye } from "lucide-react"
import type { ContactAuditLogEntry } from "../types"

export interface OwnerAuditLogTabProps {
  logs: ContactAuditLogEntry[]
  onDeletedNoteClick?: (entry: { content: string; deletedBy: string; deletedOn: string }) => void
}

export function OwnerAuditLogTab({ logs, onDeletedNoteClick }: OwnerAuditLogTabProps) {
  return (
    <div className="mt-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <History className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold">Audit Log</h3>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-44">Date & Time</TableHead>
                  <TableHead className="w-32">User</TableHead>
                  <TableHead className="w-36">Action Type</TableHead>
                  <TableHead className="w-32">Entity / Section</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-24">Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => {
                    const isDeletedNote =
                      log.actionType === "Deleted" && log.entity === "Note" && log.deletedNoteContent != null
                    return (
                      <TableRow
                        key={log.id}
                        className={isDeletedNote ? "cursor-pointer hover:bg-muted/50" : ""}
                        onClick={() => {
                          if (isDeletedNote && log.deletedNoteContent && log.deletedBy && log.deletedOn && onDeletedNoteClick) {
                            onDeletedNoteClick({
                              content: log.deletedNoteContent,
                              deletedBy: log.deletedBy,
                              deletedOn: log.deletedOn,
                            })
                          }
                        }}
                      >
                        <TableCell className="text-sm text-muted-foreground">{log.dateTime}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{log.user}</span>
                            <span className="text-xs text-muted-foreground">{log.userRole}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              log.actionType === "Created"
                                ? "border-green-300 bg-green-50 text-green-700"
                                : log.actionType === "Updated"
                                  ? "border-blue-300 bg-blue-50 text-blue-700"
                                  : log.actionType === "Deleted"
                                    ? "border-red-300 bg-red-50 text-red-700"
                                    : log.actionType === "Logged"
                                      ? "border-amber-300 bg-amber-50 text-amber-700"
                                      : "border-gray-300 bg-gray-50 text-gray-700"
                            }
                          >
                            {log.actionType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{log.entity}</TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <span>{log.description}</span>
                            {isDeletedNote && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-teal-600 hover:text-teal-700 hover:bg-transparent"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {log.source}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No activity recorded for this contact yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
