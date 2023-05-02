// server.js
const express = require("express")
const next = require("next")
const path = require("path")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

// This tells Next.js to use the `server.js` file
// for routing instead of the default `pages/index.js` file.
// This is needed for the development environment to enable routing to previous commits.

app.prepare().then(() => {
    const server = express()

    // Custom route to handle static assets for each version
    server.get("/:commit([0-9a-f]{7})/_next/*", (req, res) => {
        const commit = req.params.commit
        const reqPath = req.path
        const filePath = path.join(__dirname, "versions", reqPath)
        res.sendFile(filePath)
    })

    // Custom route to handle commit hashes in the URL
    server.get("/:commit([0-9a-f]{7})/*", (req, res) => {
        const commit = req.params.commit
        const reqPath = req.path === "/" ? "/index.html" : req.path
        const filePath = path.join(__dirname, "versions", reqPath)
        res.sendFile(filePath)
    })

    // Default route to handle all other requests
    server.all("*", (req, res) => {
        return handle(req, res)
    })

    const port = process.env.PORT || 3000
    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})
