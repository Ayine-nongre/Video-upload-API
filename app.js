const express = require('express')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage,
    fileFilter: (req, file ,cb) => {
        if (file.mimetype == 'video/gif' || file.mimetype == 'video/mp4' || file.mimetype == 'video/mkv' || file.mimetype == 'video/webm'){
            cb(null, file.originalname)
        } else {
            cb(null, multer.MulterError)
            console.log("Error file type not supported")
        }
    }
}).single('vid1')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/api/uploads', function(req, res){
    upload(req, res, function(err){
        if (err instanceof multer.MulterError){
            return res.status(400).json({ status: "Failed", message: "File upload failed" })
        }
        else{
            res.status(400).json({ 
                status: "Success", 
                message: "File uploaded successfully",
                video_url: __dirname + "/uploads/" + req.file.originalname 
            })
        }
    })
})

app.listen(3000 || process.env.PORT, () => {
    console.log("Server is running")
})