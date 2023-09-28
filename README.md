# Video-upload-API DOCUMENTATION
This api allows users upload video files

## Base URL
The base URL for accessing the api is:
https://hngx-vid.onrender.com

## ENDPOINTS
### Upload endpoint:
POST https://hngx-vid.onrender.com/api/uploads
### Description: 
Uploads a video file

### Request body
Set ```enctype``` to multipart/form-data and input name ```vid1```

## Response
### Success:
```
{
    "status": "Success",
    "message": "File uploaded successfully",
    "video_url": "https://hngx-vid.onrender.com/api/Screencast from 09-28-2023 03:35:10 PM.webm"
}
```
### Failure:
```
{
    "status": "Failed",
    "message": "File upload failed",
}
