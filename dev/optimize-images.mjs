import fs from "fs"
import path from "path"
import sharp from "sharp"

const projectRoot = path.resolve(process.cwd())
const publicDir = path.join(projectRoot, "public")
const imagesDirs = [path.join(publicDir, "images"), publicDir]

const validExts = new Set([".png", ".jpg", ".jpeg"])

async function ensureDir(dir) {
    await fs.promises.mkdir(dir, { recursive: true })
}

async function walk(dir, files = []) {
    let entries
    try {
        entries = await fs.promises.readdir(dir, { withFileTypes: true })
    } catch (e) {
        return files
    }
    for (const entry of entries) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            await walk(full, files)
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase()
            if (validExts.has(ext)) files.push(full)
        }
    }
    return files
}

async function optimizeFile(srcPath) {
    const dir = path.dirname(srcPath)
    const base = path.basename(srcPath, path.extname(srcPath))
    const webpPath = path.join(dir, `${base}.webp`)

    // Skip if webp exists and is newer than source
    try {
        const [srcStat, webpStat] = await Promise.all([fs.promises.stat(srcPath), fs.promises.stat(webpPath).catch(() => null)])
        if (webpStat && webpStat.mtimeMs >= srcStat.mtimeMs) {
            return { srcPath, webpPath, skipped: true }
        }
    } catch {}

    const pipeline = sharp(srcPath)
    const metadata = await pipeline.metadata()
    const maxWidth = 1600
    const shouldResize = metadata.width && metadata.width > maxWidth

    let img = pipeline
    if (shouldResize) {
        img = img.resize({ width: maxWidth })
    }

    await img.webp({ quality: 72 }).toFile(webpPath)
    return { srcPath, webpPath, skipped: false }
}

async function main() {
    let total = 0
    let skipped = 0
    let optimized = 0
    for (const dir of imagesDirs) {
        const exists = fs.existsSync(dir)
        if (!exists) continue
        const files = await walk(dir)
        for (const file of files) {
            const res = await optimizeFile(file)
            total += 1
            if (res.skipped) {
                skipped += 1
            } else {
                optimized += 1
            }
        }
    }
    console.log(`Done. Processed ${total} images (${optimized} optimized, ${skipped} skipped).`)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
