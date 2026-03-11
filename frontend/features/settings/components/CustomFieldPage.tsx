"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, X, Trash2 } from "lucide-react"
import { initialCustomFields, availableProcessTypes } from "../data/customField"
import { LoadMorePagination } from "@/components/shared/LoadMorePagination"

export function CustomFieldsPage() {
    const [customFields, setCustomFields] = useState(initialCustomFields)
    const [visibleCount, setVisibleCount] = useState(10)

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [newFieldLabel, setNewFieldLabel] = useState("")
    const [newFieldType, setNewFieldType] = useState<string>("Multiple Choice")
    const [newFieldChoices, setNewFieldChoices] = useState<string[]>([""])
    const [newFieldProcessTypes, setNewFieldProcessTypes] = useState<string[]>([])
  
    const handleDeleteField = (fieldId: number) => {
      setCustomFields(customFields.filter((f) => f.id !== fieldId))
    }
  
    const handleAddChoice = () => {
      setNewFieldChoices([...newFieldChoices, ""])
    }
  
    const handleRemoveChoice = (index: number) => {
      setNewFieldChoices(newFieldChoices.filter((_, i) => i !== index))
    }
  
    const handleChoiceChange = (index: number, value: string) => {
      const updated = [...newFieldChoices]
      updated[index] = value
      setNewFieldChoices(updated)
    }
  
    const handleToggleProcessType = (processType: string) => {
      if (newFieldProcessTypes.includes(processType)) {
        setNewFieldProcessTypes(newFieldProcessTypes.filter((p) => p !== processType))
      } else {
        setNewFieldProcessTypes([...newFieldProcessTypes, processType])
      }
    }
  
    const handleAddField = () => {
      if (!newFieldLabel.trim()) return
  
      const newField = {
        id: Math.max(...customFields.map((f) => f.id)) + 1,
        label: newFieldLabel,
        dataType: newFieldType,
        defaultValues: newFieldType === "Multiple Choice" ? newFieldChoices.filter((c) => c.trim()) : [],
        processTypes: newFieldProcessTypes,
      }
  
      setCustomFields([...customFields, newField])
      setIsAddDialogOpen(false)
      setNewFieldLabel("")
      setNewFieldType("Multiple Choice")
      setNewFieldChoices([""])
      setNewFieldProcessTypes([])
    }

    const visibleFields = customFields.slice(0, visibleCount)

    useEffect(() => {
      setVisibleCount(10)
    }, [customFields.length])
  
    return (
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Custom Fields</h1>
            <p className="text-muted-foreground">Manage custom fields for processes and workflows</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-foreground hover:bg-foreground/90 text-background">
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Custom Field</DialogTitle>
                <DialogDescription>Create a new custom field for your processes and workflows.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Label Name */}
                <div className="grid gap-2">
                  <Label htmlFor="field-label">Label Name</Label>
                  <Input
                    id="field-label"
                    placeholder="Enter field label..."
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                  />
                </div>
  
                {/* Field Type */}
                <div className="grid gap-2">
                  <Label>Field Type</Label>
                  <Select value={newFieldType} onValueChange={setNewFieldType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                      <SelectItem value="Date">Date</SelectItem>
                      <SelectItem value="Time">Time</SelectItem>
                      <SelectItem value="Text">Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
  
                {/* Multiple Choice Values */}
                {newFieldType === "Multiple Choice" && (
                  <div className="grid gap-2">
                    <Label>Choice Values</Label>
                    <div className="space-y-2">
                      {newFieldChoices.map((choice, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={choice}
                            onChange={(e) => handleChoiceChange(index, e.target.value)}
                          />
                          {newFieldChoices.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveChoice(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={handleAddChoice}>
                        <Plus className="h-3 w-3 mr-1" />
                        Add Option
                      </Button>
                    </div>
                  </div>
                )}
  
                {/* Process Types */}
                <div className="grid gap-2">
                  <Label>Process Types</Label>
                  <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                    {availableProcessTypes.map((processType) => (
                      <label key={processType} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={newFieldProcessTypes.includes(processType)}
                          onChange={() => handleToggleProcessType(processType)}
                        />
                        <span className="text-sm">{processType}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddField} disabled={!newFieldLabel.trim()}>
                  Add Field
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
  
        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold text-foreground">Label</TableHead>
                <TableHead className="font-semibold text-foreground">Data Type</TableHead>
                <TableHead className="font-semibold text-foreground">Default / Value</TableHead>
                <TableHead className="font-semibold text-foreground">Process Types</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
              {visibleFields.map((field) => (
                <TableRow key={field.id} className="hover:bg-muted/20">
                  <TableCell className="font-medium text-foreground">{field.label}</TableCell>
                  <TableCell className="text-muted-foreground">{field.dataType}</TableCell>
                  <TableCell>
                    {field.defaultValues.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {field.defaultValues.map((value, index) => (
                          <span key={index} className="text-muted-foreground">
                            {value}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {field.processTypes.join(", ")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteField(field.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <LoadMorePagination
          total={customFields.length}
          visibleCount={visibleCount}
          label="fields"
          onLoadMore={() => setVisibleCount((prev) => Math.min(prev + 10, customFields.length))}
        />
      </div>
    )
  } 