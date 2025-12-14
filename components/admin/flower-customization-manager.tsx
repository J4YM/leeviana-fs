"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Upload, Plus } from "lucide-react"

type FlowerCustomization = {
  id: string
  title: string
  price: string
  image_url: string
  description: string
  display_order: number
  is_active: boolean
}

export default function FlowerCustomizationManager({
  initialCustomizations,
}: {
  initialCustomizations: FlowerCustomization[]
}) {
  const [customizations, setCustomizations] = useState(initialCustomizations)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<FlowerCustomization>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newCustomization, setNewCustomization] = useState<Partial<FlowerCustomization>>({
    title: "",
    price: "",
    image_url: "",
    description: "",
    display_order: customizations.length + 1,
    is_active: true,
  })
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleEdit = (customization: FlowerCustomization) => {
    setEditingId(customization.id)
    setEditForm(customization)
  }

  const handleSave = async (id: string) => {
    setIsSaving(true)
    try {
      const { error } = await supabase.from("flower_customization").update(editForm).eq("id", id)

      if (error) throw error

      setCustomizations(customizations.map((c) => (c.id === id ? { ...c, ...editForm } : c)))
      setEditingId(null)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving customization:", error)
      alert("Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("flower_customization").update({ is_active: !currentStatus }).eq("id", id)

      if (error) throw error

      setCustomizations(customizations.map((c) => (c.id === id ? { ...c, is_active: !currentStatus } : c)))
      router.refresh()
    } catch (error) {
      console.error("[v0] Error toggling status:", error)
      alert("Failed to update status")
    }
  }

  const handleImageUpload = async (file: File, isNew = false) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()

      if (isNew) {
        setNewCustomization({ ...newCustomization, image_url: data.url })
      } else {
        setEditForm({ ...editForm, image_url: data.url })
      }
    } catch (error) {
      console.error("[v0] Error uploading image:", error)
      alert("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCreate = async () => {
    if (!newCustomization.title || !newCustomization.price || !newCustomization.image_url) {
      alert("Please fill in all required fields")
      return
    }

    setIsSaving(true)
    try {
      const { error } = await supabase.from("flower_customization").insert([newCustomization])

      if (error) throw error

      setIsCreating(false)
      setNewCustomization({
        title: "",
        price: "",
        image_url: "",
        description: "",
        display_order: customizations.length + 2,
        is_active: true,
      })
      router.refresh()
    } catch (error) {
      console.error("[v0] Error creating customization:", error)
      alert("Failed to create customization set")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-accent-peach/20 bg-accent-peach/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="font-serif text-lg">Add New Customization Set</span>
            {!isCreating ? (
              <Button onClick={() => setIsCreating(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Set
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleCreate} size="sm" disabled={isSaving || isUploading}>
                  {isSaving ? "Creating..." : "Create"}
                </Button>
                <Button onClick={() => setIsCreating(false)} variant="outline" size="sm" disabled={isSaving}>
                  Cancel
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        {isCreating && (
          <CardContent>
            <div className="flex gap-6">
              <div className="relative w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden border bg-muted">
                {newCustomization.image_url ? (
                  <Image
                    src={newCustomization.image_url || "/placeholder.svg"}
                    alt="New customization"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No image</div>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-title">Set Name *</Label>
                    <Input
                      id="new-title"
                      value={newCustomization.title || ""}
                      onChange={(e) => setNewCustomization({ ...newCustomization, title: e.target.value })}
                      className="mt-1"
                      placeholder="e.g., Elegant Set"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-price">Price *</Label>
                    <Input
                      id="new-price"
                      value={newCustomization.price || ""}
                      onChange={(e) => setNewCustomization({ ...newCustomization, price: e.target.value })}
                      className="mt-1"
                      placeholder="e.g., + ₱100"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-description">Description</Label>
                  <Textarea
                    id="new-description"
                    value={newCustomization.description || ""}
                    onChange={(e) => setNewCustomization({ ...newCustomization, description: e.target.value })}
                    className="mt-1"
                    rows={2}
                    placeholder="Describe this customization set..."
                  />
                </div>
                <div>
                  <Label htmlFor="new-image">Set Image *</Label>
                  <div className="mt-1 flex gap-2">
                    <Input
                      id="new-image-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, true)
                      }}
                      disabled={isUploading}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" disabled={isUploading} size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                  {newCustomization.image_url && (
                    <p className="text-xs text-muted-foreground mt-1">Image uploaded successfully</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="new-order">Display Order</Label>
                  <Input
                    id="new-order"
                    type="number"
                    value={newCustomization.display_order || 0}
                    onChange={(e) =>
                      setNewCustomization({ ...newCustomization, display_order: Number.parseInt(e.target.value) })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {customizations.map((customization) => (
        <Card key={customization.id} className="border-accent-peach/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="font-serif text-lg">
                {editingId === customization.id ? "Edit Set" : `${customization.title} - ${customization.price}`}
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleToggleActive(customization.id, customization.is_active)}
                  variant="outline"
                  size="sm"
                  className={
                    customization.is_active ? "border-green-500 text-green-600" : "border-gray-400 text-gray-600"
                  }
                >
                  {customization.is_active ? "Active" : "Inactive"}
                </Button>
                {editingId === customization.id ? (
                  <>
                    <Button onClick={() => handleSave(customization.id)} size="sm" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button onClick={() => setEditingId(null)} variant="outline" size="sm" disabled={isSaving}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleEdit(customization)} size="sm" variant="outline">
                    Edit
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div className="relative w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden border">
                <Image
                  src={
                    editingId === customization.id
                      ? editForm.image_url || customization.image_url
                      : customization.image_url
                  }
                  alt={customization.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-4">
                {editingId === customization.id ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`title-${customization.id}`}>Set Name</Label>
                        <Input
                          id={`title-${customization.id}`}
                          value={editForm.title || ""}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`price-${customization.id}`}>Price</Label>
                        <Input
                          id={`price-${customization.id}`}
                          value={editForm.price || ""}
                          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`description-${customization.id}`}>Description</Label>
                      <Textarea
                        id={`description-${customization.id}`}
                        value={editForm.description || ""}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`image-${customization.id}`}>Set Image</Label>
                        <div className="mt-1 flex gap-2">
                          <Input
                            id={`image-file-${customization.id}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(file, false)
                            }}
                            disabled={isUploading}
                            className="flex-1"
                          />
                          <Button type="button" variant="outline" disabled={isUploading} size="sm">
                            <Upload className="w-4 h-4 mr-2" />
                            {isUploading ? "Uploading..." : "Upload"}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          Current: {editForm.image_url || customization.image_url}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor={`order-${customization.id}`}>Display Order</Label>
                        <Input
                          id={`order-${customization.id}`}
                          type="number"
                          value={editForm.display_order || 0}
                          onChange={(e) => setEditForm({ ...editForm, display_order: Number.parseInt(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">Description:</span> {customization.description}
                    </p>
                    <p className="text-sm text-muted-foreground">Display Order: {customization.display_order}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
