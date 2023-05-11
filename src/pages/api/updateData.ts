import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const updatedData = req.body

            // Update the JSON file with the new data
            const filePath = path.join(process.cwd(), "public/data/cardData.json")
            fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 4))

            res.status(200).json({ message: "Data updated successfully." })
        } catch (error) {
            res.status(500).json({ error: "Error updating the data." })
        }
    } else {
        res.setHeader("Allow", ["POST"])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
