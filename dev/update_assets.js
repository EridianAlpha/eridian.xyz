const fs = require("fs")
const path = require("path")
const commit = process.argv[2]

// This script updates the URLs for static assets in the index.html file
// to include the commit hash in the URL.
// This is needed for the development environment to enable routing to previous commits.
const updateAssets = (commit) => {
    const basePath = path.join(__dirname, "..", "versions", commit)
    const files = fs.readdirSync(basePath)

    files.forEach((file) => {
        if (file.endsWith(".html")) {
            const filePath = path.join(basePath, file)
            let content = fs.readFileSync(filePath, "utf-8")

            content = content.replace(/\/_next\//g, `/${commit}/_next/`)

            fs.writeFileSync(filePath, content)
        }
    })
}

if (commit) {
    updateAssets(commit)
} else {
    const versionsPath = path.join(__dirname, "..", "versions")
    const commits = fs.readdirSync(versionsPath)

    commits.forEach((commit) => {
        updateAssets(commit)
    })
}
