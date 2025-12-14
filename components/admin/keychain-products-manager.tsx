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

type KeychainProduct = {
  id: string
  code: string
  title: string
  image_url: string
  price: string
  description: string
  display_order: number
  is_active: boolean
}

export default function KeychainProductsManager({ initialKeychains }: { initialKeychains: KeychainProduct[] }) {
  const [keychains, setKeychains] = useState(initialKeychains)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<KeychainProduct>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newProduct, setNewProduct] = useState<Partial<KeychainProduct>>({
    code: "",
    title: "",
    image_url: "",
    price: "",
    description: "",
    display_order: keychains.length + 1,
    is_active: true,
  })
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleEdit = (keychain: KeychainProduct) => {
    setEditingId(keychain.id)
    setEditForm(keychain)
  }

  const handleSave = async (id: string) => {
    setIsSaving(true)
    try {
      const { error } = await supabase.from("keychain_products").update(editForm).eq("id", id)

      if (error) throw error

      setKeychains(keychains.map((k) => (k.id === id ? { ...k, ...editForm } : k)))
      setEditingId(null)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving keychain:", error)
      alert("Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("keychain_products").update({ is_active: !currentStatus }).eq("id", id)

      if (error) throw error

      setKeychains(keychains.map((k) => (k.id === id ? { ...k, is_active: !currentStatus } : k)))
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
        setNewProduct({ ...newProduct, image_url: data.url })
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
    if (!newProduct.code || !newProduct.title || !newProduct.image_url || !newProduct.price) {
      alert("Please fill in all required fields")
      return
    }

    setIsSaving(true)
    try {
      const { error } = await supabase.from("keychain_products").insert([newProduct])

      if (error) throw error

      setIsCreating(false)
      setNewProduct({
        code: "",
        title: "",
        image_url: "",
        price: "",
        description: "",
        display_order: keychains.length + 2,
        is_active: true,
      })
      router.refresh()
    } catch (error) {
      console.error("[v0] Error creating keychain:", error)
      alert("Failed to create product")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-accent-peach/20 bg-accent-peach/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="font-serif text-lg">Add New Keychain Product</span>
            {!isCreating ? (
              <Button onClick={() => setIsCreating(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Product
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
                {newProduct.image_url ? (
                  <Image
                    src={newProduct.image_url || "/placeholder.svg"}
                    alt="New product"
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
                    <Label htmlFor="new-code">Product Code *</Label>
                    <Input
                      id="new-code"
                      value={newProduct.code || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                      className="mt-1"
                      placeholder="e.g., K001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-price">Price *</Label>
                    <Input
                      id="new-price"
                      value={newProduct.price || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="mt-1"
                      placeholder="e.g., ₱150"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-title">Product Title *</Label>
                  <Input
                    id="new-title"
                    value={newProduct.title || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    className="mt-1"
                    placeholder="e.g., Heart Keychain"
                  />
                </div>
                <div>
                  <Label htmlFor="new-description">Description</Label>
                  <Textarea
                    id="new-description"
                    value={newProduct.description || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="mt-1"
                    rows={2}
                    placeholder="Product description..."
                  />
                </div>
                <div>
                  <Label htmlFor="new-image">Product Image *</Label>
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
                  {newProduct.image_url && (
                    <p className="text-xs text-muted-foreground mt-1">Image uploaded successfully</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="new-order">Display Order</Label>
                  <Input
                    id="new-order"
                    type="number"
                    value={newProduct.display_order || 0}
                    onChange={(e) => setNewProduct({ ...newProduct, display_order: Number.parseInt(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {keychains.map((keychain) => (
        <Card key={keychain.id} className="border-accent-peach/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="font-serif text-lg">
                {editingId === keychain.id ? "Edit Product" : `${keychain.code} - ${keychain.title}`}
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleToggleActive(keychain.id, keychain.is_active)}
                  variant="outline"
                  size="sm"
                  className={keychain.is_active ? "border-green-500 text-green-600" : "border-gray-400 text-gray-600"}
                >
                  {keychain.is_active ? "Active" : "Inactive"}
                </Button>
                {editingId === keychain.id ? (
                  <>
                    <Button onClick={() => handleSave(keychain.id)} size="sm" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button onClick={() => setEditingId(null)} variant="outline" size="sm" disabled={isSaving}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleEdit(keychain)} size="sm" variant="outline">
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
                  src={editingId === keychain.id ? editForm.image_url || keychain.image_url : keychain.image_url}
                  alt={keychain.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-4">
                {editingId === keychain.id ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`code-${keychain.id}`}>Product Code</Label>
                        <Input
                          id={`code-${keychain.id}`}
                          value={editForm.code || ""}
                          onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`price-${keychain.id}`}>Price</Label>
                        <Input
                          id={`price-${keychain.id}`}
                          value={editForm.price || ""}
                          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`title-${keychain.id}`}>Product Title</Label>
                      <Input
                        id={`title-${keychain.id}`}
                        value={editForm.title || ""}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`description-${keychain.id}`}>Description</Label>
                      <Textarea
                        id={`description-${keychain.id}`}
                        value={editForm.description || ""}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`image-${keychain.id}`}>Product Image</Label>
                        <div className="mt-1 flex gap-2">
                          <Input
                            id={`image-file-${keychain.id}`}
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
                          Current: {editForm.image_url || keychain.image_url}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor={`order-${keychain.id}`}>Display Order</Label>
                        <Input
                          id={`order-${keychain.id}`}
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
                      <span className="font-semibold">Price:</span> {keychain.price}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Description:</span> {keychain.description}
                    </p>
                    <p className="text-sm text-muted-foreground">Display Order: {keychain.display_order}</p>
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
