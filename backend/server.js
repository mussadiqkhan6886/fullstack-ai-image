import express from "express"
import cors from "cors"
import multer from "multer"
import fs from 'fs'
import dotenv from "dotenv"
import OpenAI from "openai"
const app = express()
const PORT = 8080
app.use(express.json())
app.use(cors())
dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API
})
const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, "./public")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + " - " + file.originalname)
    } 
})

const upload = multer({storage}).single("file")
let filePath;
app.post("/upload", upload, (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }
    filePath = req.file
    res.json({
        message: "Uploaded successfully",
        file: req.file
    });
})

app.post("/openai", (req, res) => {
    const prompt = req.body.message
    const imageAsBase64 = fs.readFileSync(filePath, 'base64')

    const response = openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: [
                    {type: "text", text: prompt},
                    {type: "image_url", image_url: {
                        url: `data:image/jpeg;base64,${imageAsBase64}`
                    }}
                ]
            }
        ]
    })
})

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})
