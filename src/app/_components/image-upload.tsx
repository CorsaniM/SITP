"use client"

import { UploadDropzone } from "~/utils/uploadthing" 
import Image from "next/image"
import { useState } from "react"

export default function ImageUpload () {

const [imageUrl, setImageUrl] = useState<string>("")

return <div>
        <h1>Subir una imagen</h1>
        
        <UploadDropzone 
        appearance={{
            container: {
                border: '5px dotted black',
            
            },
        uploadIcon: {
            background: 'blue'
        }}
        }
        endpoint='imageUploader'
         onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            setImageUrl(res[0]!.url);
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
        {/* {imageUrl ? (

            <div>
            <Image src={imageUrl} alt='image' width={300} height={300}></Image>
        </div>
        ) : (null)
            } */}

        </div>
}

