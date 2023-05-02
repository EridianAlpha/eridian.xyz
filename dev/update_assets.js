const fs = require("fs")
const path = require("path")

// This function updates the URLs for static assets in the index.html file
// to include the commit hash in the URL.
// This is needed for the development environment to enable routing to previous commits.

function updateStaticAssetUrls(commitHash, outputPath) {
    const indexPath = path.join(outputPath, "index.html")
    const htmlContent = fs.readFileSync(indexPath, "utf8")

    const updatedContent = htmlContent.replace(/\/_next\//g, `/${commitHash}/_next/`)

    fs.writeFileSync(indexPath, updatedContent, "utf8")
}

const commitHash = process.argv[2]
const outputPath = process.argv[3]

if (!commitHash || !outputPath) {
    console.error("Usage: node update_assets.js <commitHash> <outputPath>")
    process.exit(1)
}

updateStaticAssetUrls(commitHash, outputPath)
