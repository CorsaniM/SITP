"use client"
// En algún componente del proyecto, como Pagina.tsx
import React, { useEffect, useState } from 'react';
import Boton from '../_components/unbotonk';
import { Button } from '../_components/ui/button';
import { Input } from '../_components/ui/input';
import { Label } from '../_components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


export default function Pagina () {
    async function creartexto() {
        if (!name || !apellido || edad<0 || edad>100){
            return toast.message("todos los campos son obligatorios")
        }
        
        
        setTexto("name: "+name+"apellido: "+apellido+"edad: "+edad)
        return toast.message(texto)
    }

const [name,setName] = useState ("")
const [apellido,setApellido] = useState ("")
const [edad,setEdad] = useState (0)
const [texto, setTexto] = useState("")

useEffect(()=>{
    setTexto(texto)
},[texto])

const router = useRouter()

return (
    <div>
      <h1>Bienvenido a mi proyecto</h1>
      <Label>name</Label>
      <Input value={name} onChange={(e)=> setName(e.target.value)} maxLength={20}></Input>

      <Label>apellido</Label>
      <Input value={apellido} onChange={(e)=> setApellido(e.target.value)} maxLength={20}></Input>
      <Label>edad</Label>
      <Input value={edad} onChange={(e)=> setEdad(parseInt(e.target.value))} type="number" max={100}min={0} ></Input>
      <Button onClick={creartexto}> click </Button>
      {texto ? texto : "ingrese los valores"}
    </div>
  );
};

