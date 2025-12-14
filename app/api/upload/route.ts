import { getStore } from "@netlify/blobs"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const store = getStore("product-images")

    // Generate a unique filename with timestamp
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Store the file in Netlify Blob
    await store.set(filename, buffer, {
      metadata: {
        contentType: file.type,
        originalName: file.name,
        size: file.size.toString(),
      },
    })

    // The URL format is: /.netlify/blobs/[store-name]/[key]
    const url = `/.netlify/blobs/product-images/${filename}`

    return NextResponse.json({
      url: url,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
