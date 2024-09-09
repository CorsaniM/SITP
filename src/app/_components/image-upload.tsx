"use client"

import { UploadDropzone } from "~/utils/uploadthing"
import { useState } from "react"

interface UploadResponse {
  url: string;
}

export default function ImageUpload() {
  const [imageUrl, setImageUrl] = useState<string>("");

  return (
    <div>
      <h1>Subir una imagen</h1>
      
      <UploadDropzone
        appearance={{
          container: {
            border: '5px dotted black',
          },
          uploadIcon: {
            background: 'blue'
          }
        }}
        endpoint='imageUploader'
        onClientUploadComplete={(res: UploadResponse[]) => {
          // Do something with the response
          console.log("Files: ", res);
          if (res.length > 0 && res) {
            setImageUrl(res[0]?.url ?? "");
          }
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      
      {imageUrl ? (
        <div>
           <img src={imageUrl} alt='image' width={300} height={300} />
        </div>
      ) : null}
    </div>
  );
}
