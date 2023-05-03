import fs from "fs"
import path from "path"
import { NextApiRequest, NextApiResponse } from "next"
import { execSync } from "child_process"

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
    if (process.env.NODE_ENV !== "development") {
        res.status(403).json({ error: "This API is only available in development mode." })
        return
    }

    const basePath = path.join(process.cwd(), "versions")
    const commitHashes = fs.readdirSync(basePath)

    const formatDate = (date: Date): string => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()

        const seconds = Math.floor(diff / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        const months = Math.floor(days / 30)
        const years = Math.floor(months / 12)

        let ago = ""
        if (years > 0) {
            ago = `(${years} year${years > 1 ? "s" : ""}${months % 12 > 0 ? `, ${months % 12} month${months % 12 > 1 ? "s" : ""}` : ""} ago)`
        } else if (months > 0) {
            ago = `(${months} month${months > 1 ? "s" : ""}${days % 30 > 0 ? `, ${days % 30} day${days % 30 > 1 ? "s" : ""}` : ""} ago)`
        } else if (days > 0) {
            ago = `(${days} day${days > 1 ? "s" : ""}${hours % 24 > 0 ? `, ${hours % 24} hour${hours % 24 > 1 ? "s" : ""}` : ""} ago)`
        } else if (hours > 0) {
            ago = `(${hours} hour${hours > 1 ? "s" : ""} ago)`
        } else if (minutes > 0) {
            ago = `(${minutes} minute${minutes > 1 ? "s" : ""} ago)`
        } else {
            ago = `(${seconds} second${seconds > 1 ? "s" : ""} ago)`
        }

        return `${date.toISOString().slice(0, 19).replace("T", " ")} ${ago}`
    }

    const commits = commitHashes
        .map((commit) => {
            const commitPath = path.join(basePath, commit)
            const commitStat = fs.statSync(commitPath)

            if (commitStat.isDirectory() && fs.readdirSync(commitPath).length > 0) {
                try {
                    const logOutput = execSync(`git log -1 ${commit}`).toString().trim()
                    const message = execSync(`git log -1 --pretty=format:%s ${commit}`).toString().trim()
                    const rawDate = execSync(`git log -1 --pretty=format:%cI ${commit}`).toString().trim()

                    const authorRegex = /^Author:\s+(.+?)\s*<.+?>$/m
                    const authorMatch = logOutput.match(authorRegex)
                    const author = authorMatch ? authorMatch[1] : ""

                    const diffOutput = execSync(`git diff ${commit}~1 ${commit} --shortstat`).toString().trim()

                    return {
                        hash: commit,
                        message,
                        author,
                        rawDate,
                        formattedDate: formatDate(new Date(rawDate)),
                        diff: diffOutput,
                    }
                } catch (error) {
                    console.error(`Error fetching commit data: ${error.message}`)
                    return null
                }
            }
            return null
        })
        .filter(Boolean)
        .sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()) // Sort commits by date

    // Replace the rawDate with formattedDate, include author and diff for response
    const responseCommits = commits.map(({ hash, message, author, formattedDate, diff }) => ({
        hash,
        message,
        author,
        date: formattedDate,
        diff,
    }))

    res.status(200).json(responseCommits)
}

export default handler
