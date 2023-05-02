import fs from "fs"
import path from "path"
import { NextApiRequest, NextApiResponse } from "next"
import { execSync } from "child_process"

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
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

        if (years > 0) {
            return `${date.toISOString().slice(0, 19).replace("T", " ")} (${years} year${years > 1 ? "s" : ""}, ${months % 12} month${
                months % 12 > 1 ? "s" : ""
            }, ${days % 30} day${days % 30 > 1 ? "s" : ""}, ${hours % 24} hour${hours % 24 > 1 ? "s" : ""} ago)`
        } else if (months > 0) {
            return `${date.toISOString().slice(0, 19).replace("T", " ")} (${months} month${months > 1 ? "s" : ""}, ${days % 30} day${
                days % 30 > 1 ? "s" : ""
            }, ${hours % 24} hour${hours % 24 > 1 ? "s" : ""} ago)`
        } else if (days > 0) {
            return `${date.toISOString().slice(0, 19).replace("T", " ")} (${days} day${days > 1 ? "s" : ""}, ${hours % 24} hour${
                hours % 24 > 1 ? "s" : ""
            } ago)`
        } else if (hours > 0) {
            return `${date.toISOString().slice(0, 19).replace("T", " ")} (${hours} hour${hours > 1 ? "s" : ""} ago)`
        } else if (minutes > 0) {
            return `${date.toISOString().slice(0, 19).replace("T", " ")} (${minutes} minute${minutes > 1 ? "s" : ""} ago)`
        } else {
            return `${date.toISOString().slice(0, 19).replace("T", " ")} (${seconds} second${seconds > 1 ? "s" : ""} ago)`
        }
    }

    const commits = commitHashes
        .map((commit) => {
            const commitPath = path.join(basePath, commit)
            const commitStat = fs.statSync(commitPath)

            if (commitStat.isDirectory() && fs.readdirSync(commitPath).length > 0) {
                try {
                    const message = execSync(`git log -1 --pretty=format:%s ${commit}`).toString().trim()
                    const date = execSync(`git log -1 --pretty=format:%cI ${commit}`).toString().trim()

                    return {
                        hash: commit,
                        message,
                        date: formatDate(new Date(date)),
                    }
                } catch (error) {
                    console.error(`Error fetching commit data: ${error.message}`)
                    return null
                }
            }
            return null
        })
        .filter(Boolean)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort commits by date
    res.status(200).json(commits)
}

export default handler
