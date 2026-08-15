import express from "express"
import cors from "cors"
import multer from "multer"
import fs from 'fs'
import dotenv from "dotenv"
import { GoogleGenAI } from "@google/genai";

const app = express()
const PORT = 8080
app.use(express.json())
app.use(cors())
dotenv.config()

const ai = new GoogleGenAI({ apiKey: process.env.Gemini_API_Key })
const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, "./public")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + " - " + file.originalname)
    } 
})

const upload = multer({storage}).single("file")
app.post("/upload", upload, (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }
    res.json({
        message: "Uploaded successfully",
        filePath: req.file.path,
        mime: req.file.mimetype,
    });
})

app.post("/gemini", async (req, res) => {
    try{
         const { message, filePath, mime } = req.body;
        if (!filePath) {
            return res.status(400).json({
                message: "Upload image first"
            });
        }
        const imageAsBase64 = fs.readFileSync(filePath, 'base64')
        const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
       contents: [
        {
          inlineData: {
            mimeType: mime,
            data: imageAsBase64,
          },
        },
        {
          text: prompt,
        },
      ],
        })

        res.send(response.text)
    }catch(err){
        console.log(err)

        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})
