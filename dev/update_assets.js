// const fs = require("fs")
// const path = require("path")

// // This function updates the URLs for static assets in the index.html file
// // to include the commit hash in the URL.
// // This is needed for the development environment to enable routing to previous commits.

// function updateStaticAssetUrls(commitHash, outputPath) {
//     const indexPath = path.join(outputPath, "index.html")
//     const htmlContent = fs.readFileSync(indexPath, "utf8")

//     const updatedContent = htmlContent.replace(/\/_next\//g, `/${commitHash}/_next/`)

//     fs.writeFileSync(indexPath, updatedContent, "utf8")
// }

// const commitHash = process.argv[2]
// const outputPath = process.argv[3]

// if (!commitHash || !outputPath) {
//     console.error("Usage: node update_assets.js <commitHash> <outputPath>")
//     process.exit(1)
// }

// updateStaticAssetUrls(commitHash, outputPath)

const fs = require("fs")
const path = require("path")
const commit = process.argv[2]

// This function updates the URLs for static assets in the index.html file
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
