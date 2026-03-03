"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, MoreVertical } from "lucide-react"
import { INITIAL_PROPERTY_TAGS } from "@/features/settings/data/propertyTag"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { PropertyTag } from "../types"

export function PropertyTagsPage() {
    const [tags, setTags] = useState<PropertyTag[]>(INITIAL_PROPERTY_TAGS)
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingTag, setEditingTag] = useState<PropertyTag | null>(null)
    const [newTag, setNewTag] = useState({ name: "", description: "" })
  
    const filteredTags = tags.filter((tag) => {
      return (
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  
    const handleAddTag = () => {
      if (newTag.name.trim()) {
        setTags([
          ...tags,
          {
            id: String(tags.length + 1),
            name: newTag.name.trim(),
            description: newTag.description.trim(),
          },
        ])
        setNewTag({ name: "", description: "" })
        setIsAddDialogOpen(false)
      }
    }
  
    const handleEditTag = (tag: PropertyTag) => {
      setEditingTag(tag)
    }
  
    const handleSaveEdit = () => {
      if (editingTag) {
        setTags(tags.map((t) => (t.id === editingTag.id ? editingTag : t)))
        setEditingTag(null)
      }
    }
  
    const handleDeleteTag = (tagId: string) => {
      setTags(tags.filter((t) => t.id !== tagId))
    }
  
    return (
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Property Tags</h1>
            <p className="text-muted-foreground">Manage tags that can be attached to properties</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-foreground hover:bg-foreground/90 text-background">
                <Plus className="h-4 w-4 mr-2" />
                Add Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Tag</DialogTitle>
                <DialogDescription>Create a new tag to attach to properties.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="tag-name">Tag Name</Label>
                  <Input
                    id="tag-name"
                    value={newTag.name}
                    onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                    placeholder="e.g., Parking, Pool, Pet Friendly"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tag-description">Description</Label>
                  <Input
                    id="tag-description"
                    value={newTag.description}
                    onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                    placeholder="Brief description of the tag"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTag} className="bg-foreground hover:bg-foreground/90 text-background">
                  Add Tag
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
  
        {/* Search only - no category filter */}
        <Card className="border border-border mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Input
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4"
                />
              </div>
            </div>
          </CardContent>
        </Card>
  
        {/* Tags List */}
        <Card className="border border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Tag Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-24 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.map((tag, index) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      {editingTag?.id === tag.id ? (
                        <Input
                          value={editingTag.name}
                          onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        <span className="font-medium text-center">{tag.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingTag?.id === tag.id ? (
                        <Input
                          value={editingTag.description}
                          onChange={(e) => setEditingTag({ ...editingTag, description: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        <span className="text-muted-foreground">{tag.description}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {editingTag?.id === tag.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingTag(null)}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSaveEdit} className="bg-foreground hover:bg-foreground/90 text-background">
                            Save
                          </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditTag(tag)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteTag(tag.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }