"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { TableHead } from "@/components/ui/table"
import { LoadMorePagination } from "@/components/shared/LoadMorePagination"
import {
    ownerAuditLogs as versionHistoryLogs,
} from "@/features/leads/data/ownerDetailData"

const INITIAL_VISIBLE = 10

export function VersionHistoryPage() {
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
    const visibleLogs = versionHistoryLogs.slice(0, visibleCount)

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 mb-4">
                {/* <History className="h-5 w-5 text-teal-600" /> */}
                <h3 className="text-lg font-semibold">Version History</h3>
                <p className="text-sm text-muted-foreground">View the version history of this process. You can filter the versions by action type, user, and date range.</p>
            </div>
            {/* Filter Controls (UI Only - Non-functional) */}
            <div className="flex flex-wrap items-center gap-3 mb-4 p-4 bg-muted/50 rounded-lg border">
                <div className="flex-1 flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search versions..."
                        className="w-full h-9"
                    />
                </div>
                <Select>
                    <SelectTrigger className="w-40 h-9">
                        <SelectValue placeholder="Action Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="created">Created</SelectItem>
                        <SelectItem value="updated">Updated</SelectItem>
                        <SelectItem value="deleted">Deleted</SelectItem>
                        <SelectItem value="viewed">Viewed</SelectItem>
                        <SelectItem value="status-changed">Status Changed</SelectItem>
                        <SelectItem value="assignment-changed">Assignment Changed</SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger className="w-36 h-9">
                        <SelectValue placeholder="User" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="sarah">Sarah M</SelectItem>
                        <SelectItem value="mike">Mike D</SelectItem>
                        <SelectItem value="nina">Nina P</SelectItem>
                        <SelectItem value="richard">Richard S</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                        type="date"
                        className="w-36 h-9"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                        type="date"
                        className="w-36 h-9"
                    />
                </div>
            </div>
            {/* Version History Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-44">Date & Time</TableHead>
                            <TableHead className="w-32">User</TableHead>
                            <TableHead className="w-36">Action Type</TableHead>
                            <TableHead className="w-32">Entity / Section</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-32">Source</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visibleLogs.length > 0 ? (
                            visibleLogs.map((version) => (
                                <TableRow key={version.id}>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {version.dateTime}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{version.user}</span>
                                            <span className="text-xs text-muted-foreground">{version.userRole}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                version.actionType === "Created"
                                                    ? "border-green-300 bg-green-50 text-green-700"
                                                    : version.actionType === "Updated"
                                                        ? "border-blue-300 bg-blue-50 text-blue-700"
                                                        : version.actionType === "Deleted"
                                                            ? "border-red-300 bg-red-50 text-red-700"
                                                            : version.actionType === "Viewed"
                                                                ? "border-gray-300 bg-gray-50 text-gray-700"
                                                                : version.actionType === "Status Changed"
                                                                    ? "border-purple-300 bg-purple-50 text-purple-700"
                                                                    : "border-amber-300 bg-amber-50 text-amber-700"
                                            }
                                        >
                                            {version.actionType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">{version.entity}</TableCell>
                                    <TableCell className="text-sm">{version.description}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="text-xs">
                                            {version.source}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No versions recorded for this process yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <LoadMorePagination
                total={versionHistoryLogs.length}
                visibleCount={visibleCount}
                label="versions"
                onLoadMore={() => setVisibleCount((prev) => Math.min(prev + INITIAL_VISIBLE, versionHistoryLogs.length))}
            />
        </div>
    )
}