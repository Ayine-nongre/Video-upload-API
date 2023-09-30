require('dotenv').config({path: '.env'})
const express = require('express')
const multer = require('multer')
const path = require('path');
const { Deepgram } = require('@deepgram/sdk')

const uploadPath = path.join(process.cwd(), '/uploads')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage,
    fileFilter: (req, file ,cb) => {
        if (file.mimetype == 'video/gif' || file.mimetype == 'video/mp4' || file.mimetype == 'video/mkv' || file.mimetype == 'video/webm' || file.mimetype == 'video/blob'){
            cb(null, file.originalname)
        } else {
            cb(null, multer.MulterError)
        }
    }
}).single('vid1')

const app = express()
const deepgram = new Deepgram(process.env.Auth)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get ('/api', function(req,res){
    res.status(200).json({ Message: "Welcome to my video api"})
})

app.get('/api/:filename', function(req, res){
    const name = req.params.filename
    const videoPath = path.join(process.cwd(), '/uploads/') + name
    res.sendFile(videoPath)
})

app.get('/api/:filename/transcribe', async function(req, res){
    const response = await deepgram.transcription.preRecorded(
        { url: "https://hngx-vid.onrender.com/api/" + req.params.filename },
        { punctuate: true, utterances: true }
    ).catch(err => {
        console.log(err)
        return res.status(400).json({ status: "Failed", message: "Error getting tran"})
    })

    const srtTranscript = response.toSRT();

    res.status(200).json({ 
        status: "Success", 
        transcript: srtTranscript 
    })
})

app.post('/api/uploads', function(req, res){
    upload(req, res, async function(err){
        if (err instanceof multer.MulterError){
            console.log(err)
            return res.status(400).json({ status: "Failed", message: "File upload failed" })
        }
        else if(err){
            console.log(err)
            res.status(400).json({ status: "Failed", message: "File upload failed" })
        }
        else{
            res.status(200).json({ 
                status: "Success", 
                message: "File uploaded successfully",
                video_url: "https://hngx-vid.onrender.com/api/" + req.file.originalname, 
            })
        }
    })
})

app.listen(3000 || process.env.PORT, () => {
    console.log("Server is running")
})
