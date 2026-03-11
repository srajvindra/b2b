"use client"

import { useState } from "react"
import {
  Button
} from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRight, ChevronDown, HelpCircle, Plus, Download, Pencil, Trash2, Upload, Info } from "lucide-react"
import type { TenantNote, TenantLetter } from "../types"

export interface TenantInformationTabProps {
  notes: TenantNote[]
  letters: TenantLetter[]
  onNoteClick?: (note: TenantNote) => void
}

export function TenantInformationTab({ notes, letters, onNoteClick }: TenantInformationTabProps) {
  const [screeningExpanded, setScreeningExpanded] = useState(true)
  const [emergencyContactExpanded, setEmergencyContactExpanded] = useState(true)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
              <CardTitle className="text-base font-semibold text-slate-800">Status</CardTitle>
              <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Balance</span><span className="font-medium text-teal-600">$2,325.00</span></div>
                <div className="flex justify-between"><span className="text-slate-500 flex items-center gap-1">Delinquency Notes <HelpCircle className="h-3 w-3" /></span><span className="text-teal-600 cursor-pointer hover:underline">Add delinquency note</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Last Receipt</span><span className="font-medium text-teal-600">12/11/2025</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Evicting</span><span className="font-medium">No</span></div>
                <div className="flex justify-between"><span className="text-slate-500">In Collections</span><span className="font-medium">No</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Eligible for Renewal</span><span className="font-medium">Yes</span></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
              <CardTitle className="text-base font-semibold text-slate-800">Tags</CardTitle>
              <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="bg-slate-50 rounded-lg p-4 border">
                <h4 className="font-semibold text-slate-800 mb-2">FolioGuard Smart Ensure</h4>
                <p className="text-sm text-slate-600 mb-3">Unlock new revenue streams with Smart Ensure while protecting your properties.</p>
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Contact Me</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
              <CardTitle className="text-base font-semibold text-slate-800">Contact</CardTitle>
              <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div><h4 className="text-sm font-medium text-slate-700 mb-2">Phone Numbers</h4><div className="flex items-center justify-between"><span className="text-sm"><span className="text-slate-500">Home</span> <span className="font-medium">987654321</span></span><Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">Text</Button></div></div>
              <div><h4 className="text-sm font-medium text-slate-700 mb-2">Emails</h4><p className="text-sm text-slate-500 italic">Click edit to add emails.</p></div>
              <div><h4 className="text-sm font-medium text-slate-700 mb-2">Addresses</h4><div className="text-sm space-y-1"><div className="flex"><span className="text-slate-500 w-28">Primary Address</span><span className="font-medium">1000 NELAVIEW RD CLEVELAND HEIGHTS, OH. 44112</span></div></div></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
              <CardTitle className="text-base font-semibold text-slate-800">Tenant Status</CardTitle>
              <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2 text-sm">
                <div className="flex"><span className="text-slate-500 w-36">Type</span><span className="font-medium text-teal-600">Financially Responsible</span></div>
                <div className="flex"><span className="text-slate-500 w-36">Status</span><span className="font-medium">Current</span></div>
                <div className="flex"><span className="text-slate-500 w-36">Move In</span><span className="font-medium text-teal-600">06/18/2024</span></div>
                <div className="flex"><span className="text-slate-500 w-36">Move Out</span><span className="font-medium">--</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setScreeningExpanded(!screeningExpanded)}>
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2"><ChevronRight className={`h-4 w-4 transition-transform ${screeningExpanded ? "rotate-90" : ""}`} />Screening</CardTitle>
          <Button variant="link" className="text-teal-600 h-auto p-0 text-sm" onClick={(e) => e.stopPropagation()}>Edit</Button>
        </CardHeader>
        {screeningExpanded && <CardContent className="p-4"><div className="space-y-3 text-sm"><div className="flex"><span className="text-slate-500 w-36 text-right pr-4">Date Of Birth</span><span className="font-medium">--</span></div><div className="flex"><span className="text-slate-500 w-36 text-right pr-4">SSN</span><span className="font-medium">--</span></div></div></CardContent>}
      </Card>

      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setEmergencyContactExpanded(!emergencyContactExpanded)}>
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2"><ChevronRight className={`h-4 w-4 transition-transform ${emergencyContactExpanded ? "rotate-90" : ""}`} />Emergency Contact</CardTitle>
          <Button variant="link" className="text-teal-600 h-auto p-0 text-sm" onClick={(e) => e.stopPropagation()}>Edit</Button>
        </CardHeader>
        {emergencyContactExpanded && <CardContent className="p-4"><div className="space-y-3 text-sm"><div className="flex"><span className="text-slate-500 w-36 text-right pr-4">Name</span><span className="font-medium">--</span></div><div className="flex"><span className="text-slate-500 w-36 text-right pr-4">Phone Number</span><span className="font-medium">--</span></div></div></CardContent>}
      </Card>

      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-1">Notes <HelpCircle className="h-4 w-4 text-slate-400" /></CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Download className="h-3 w-3 mr-1" />Download Notes</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Plus className="h-3 w-3 mr-1" />Add Note</Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="divide-y">
            {notes.map((note) => (
              <div key={note.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <button type="button" onClick={() => onNoteClick?.(note)} className="text-sm font-medium text-teal-600 hover:underline text-left">{note.title}</button>
                    <div className="text-xs text-slate-500 mt-1">Created by {note.createdBy} on {note.createdAt}</div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-teal-600"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800">Letters</CardTitle>
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent"><Upload className="h-3 w-3 mr-1" />Upload Document</Button>
        </CardHeader>
        <CardContent className="p-4">
          <div className="divide-y">
            {letters.map((letter) => (
              <div key={letter.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <span className="text-sm text-teal-600 cursor-pointer hover:underline">{letter.title}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-500 text-right text-xs">Created on: {letter.createdOn}<br />{letter.createdTime}</span>
                  <span className="text-teal-600 cursor-pointer hover:underline flex items-center gap-1 text-xs">Preview</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4 border-b bg-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800">Monthly Charges</CardTitle>
        </CardHeader>
        <CardContent className="p-4"><p className="text-center text-sm font-medium">Total Charges For February: $1,100.00</p></CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800">Lease Information</CardTitle>
          <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
        </CardHeader>
        <CardContent className="p-4"><div className="grid grid-cols-2 gap-4 text-sm"><div className="flex"><span className="text-slate-500 w-36">Lease From</span><span className="font-medium">06/18/2024</span></div><div className="flex"><span className="text-slate-500 w-36">Lease To</span><span className="font-medium">06/17/2025</span></div></div></CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800">Late Fee Policy</CardTitle>
          <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
        </CardHeader>
        <CardContent className="p-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5" />
            <p className="text-sm text-blue-700">The late fee policy for this tenant is set by the property.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800">Animals</CardTitle>
          <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="bg-slate-50"><TableHead className="font-medium text-slate-600">Name</TableHead><TableHead className="font-medium text-slate-600">Type / Breed</TableHead><TableHead className="font-medium text-slate-600">Weight</TableHead></TableRow></TableHeader>
            <TableBody><TableRow><TableCell className="font-medium">Xerxes</TableCell><TableCell>Dog/Labrador Retriever</TableCell><TableCell>45.0 lbs</TableCell></TableRow></TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800">Vehicles</CardTitle>
          <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="bg-slate-50"><TableHead className="font-medium text-slate-600">Make</TableHead><TableHead className="font-medium text-slate-600">Model</TableHead><TableHead className="font-medium text-slate-600">Color</TableHead></TableRow></TableHeader>
            <TableBody><TableRow><TableCell className="font-medium">Ford</TableCell><TableCell>1967</TableCell><TableCell>Black</TableCell></TableRow></TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
