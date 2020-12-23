import React from 'react'

export default function imgUploadCloudinary(file) {
    let data = {
        "file": file,
        "upload_preset": "almakan",
    }
    fetch('https://api.cloudinary.com/v1_1/dfavoxppv/image/upload', {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
    }).then(async res => {
        let data = await res.json()
        console.log('sjssj:', data.url)
        return data.url;
    }).catch(err => {
        return null
    })

}
