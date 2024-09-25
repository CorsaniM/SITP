"use client";

import { UploadDropzone } from "~/utils/uploadthing";
import { useState } from "react";
import { Dialog,
  DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";

export default function ImageUpload() {
  
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isZoomed, setIsZoomed] = useState(false);     
  const [open, setOpen] = useState(false)
  const [transformOrigin, setTransformOrigin] = useState({ x: '50%', y: '50%' });

  const handleZoomToggle = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top; 

    const originX = `${(offsetX / rect.width) * 100}%`;
    const originY = `${(offsetY / rect.height) * 100}%`;

    setTransformOrigin({ x: originX, y: originY });
    setIsZoomed(prev => !prev);
  };

  const handleImageDelete = () => {
    setImageUrl(""); 
  };

  return (
    <div>
      {imageUrl ? (
        <div className="flex flex-auto justify-center">
          <img className="flex max-h-60 " 
            src={imageUrl} alt='image' width={300} height={300} 
            onClick={() => setOpen(true)}/>
          <Button variant="destructive" onClick={handleImageDelete} className="flex rounded-full justify-start place-self-end ml-4">
            Eliminar imagen
          </Button>
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
          setImageUrl(res[0]?.url ?? "");
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}/>
        </div>
        
      )}




<Dialog open={open} onOpenChange={setOpen}>
<DialogContent className="flex justify-center max-w-[80vw] max-h-[90vh]">
          <div
            className={`flex justify-center ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={handleZoomToggle}
          >
            <img
              src={imageUrl ?? ""}
              alt='image'
              style={{
                transformOrigin: `${transformOrigin.x} ${transformOrigin.y}`,
                transform: `scale(${isZoomed ? 2.5 : 1})`,
                transition: 'transform 0.5s ease',
              }}
            />
          </div>
        </DialogContent>

        </Dialog>
    </div>
  );
}
