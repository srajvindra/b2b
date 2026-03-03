"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Upload, Eye, Download } from "lucide-react"
import type { OwnerDocument } from "../types"

export interface OwnerDocumentTabProps {
  documents: OwnerDocument[]
  onUploadClick: () => void
}

export function OwnerDocumentTab({ documents, onUploadClick }: OwnerDocumentTabProps) {
  return (
    <div className="mt-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-600" />
              Documents ({documents.length})
            </h3>
            <Button size="sm" className="h-8 text-xs bg-teal-600 hover:bg-teal-700" onClick={onUploadClick}>
              <Upload className="h-3 w-3 mr-1" />
              Upload Document
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Document Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Property</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Received Date</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Received Time</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-slate-700">{doc.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{doc.propertyName}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{doc.propertyAddress}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{doc.receivedDate}</td>
                    <td className="p-3 text-sm text-muted-foreground">{doc.receivedTime}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View">
                          <Eye className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download">
                          <Download className="h-4 w-4 text-slate-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
