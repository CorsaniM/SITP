"use client";

import { UploadDropzone } from "~/utils/uploadthing";
import { useState } from "react";
import { Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle, } from "./ui/dialog";
import { Button } from "./ui/button";

// interface UploadResponse {
//   url: string;
// }

export default function ImageUpload() {
  
  const [imageUrl, setImageUrl] = useState<string>("");
  const [open, setOpen] = useState(false)
  return (
    <div>
      {imageUrl ? (
        <div>
        <img src={imageUrl} alt='image' width={300} height={300} onClick={() => setOpen(true)}/>
      </div>
      ) : (
<div>

      <h1>Subir una imagen</h1>

      <UploadDropzone
        appearance={{
          container: { border: '5px dotted white' },
          uploadIcon: { background: '' },
        }}
        endpoint='imageUploader'
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          setImageUrl(res[0]?.url ?? "");
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
       
        />

        </div>
        
      )}




<Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px]">
          
        <img src={imageUrl} alt='image' width={800} height={800} onClick={() => setOpen(false)}/>
              <Button onClick={() => setOpen(false)}>
               Cerrar
              </Button>
        </DialogContent>

        </Dialog>
    </div>
  );
}
