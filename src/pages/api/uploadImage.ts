import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

const IMAGES_DIR = path.join(process.cwd(), "public/images")
const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"])

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "20mb",
        },
    },
}

function sanitizeFilename(filename: string): string | null {
    const basename = path.basename(filename.trim())

    if (!basename || basename.includes("..")) {
        return null
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(basename)) {
        return null
    }

    const ext = path.extname(basename).toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(ext)) {
        return null
    }

    return basename
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (process.env.NODE_ENV !== "development") {
        res.status(403).json({ error: "This API is only available in development mode." })
        return
    }

    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"])
        res.status(405).end(`Method ${req.method} Not Allowed`)
        return
    }

    try {
        const { filename, data } = req.body

        const sanitizedFilename = sanitizeFilename(filename)
        if (!sanitizedFilename) {
            res.status(400).json({ error: "Invalid filename. Use letters, numbers, dots, dashes, and underscores only." })
            return
        }

        if (!data || typeof data !== "string") {
            res.status(400).json({ error: "Missing image data." })
            return
        }

        const filePath = path.join(IMAGES_DIR, sanitizedFilename)
        if (fs.existsSync(filePath)) {
            res.status(409).json({ error: "A file with this name already exists." })
            return
        }

        if (!fs.existsSync(IMAGES_DIR)) {
            fs.mkdirSync(IMAGES_DIR, { recursive: true })
        }

        const buffer = Buffer.from(data, "base64")
        fs.writeFileSync(filePath, buffer)

        res.status(200).json({
            message: "Image uploaded successfully.",
            path: `./images/${sanitizedFilename}`,
        })
    } catch (error) {
        res.status(500).json({ error: "Error uploading image." })
    }
}
