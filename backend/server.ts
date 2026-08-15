import express from "express"
import cors from "cors"
import multer from "multer"
import fs from 'fs'

const app = express()
app.use(express.json())
app.use(cors())

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, "/public")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + " - " + file.originalname)
    } 
})

const upload = multer({storage}).single("file")

let filePath;

app.get("/upload", (req, res) => {
    upload(req, res, (err) => {
        if(err){
            return res.status(500).json(err)
        }
        if(req.file){
            filePath = req.file.path
        }
    })
})

