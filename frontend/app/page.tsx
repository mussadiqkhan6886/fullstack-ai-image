'use client';

import Image from 'next/image';
import React, { ChangeEvent, useState } from 'react'

const Home = () => {
  const [image, setImage] = useState<null | File>(null)

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData()
    if(!e.target.files){
      throw new Error("Please upload file")
    }
    formData.append('file', e.target.files[0])
    setImage(e.target.files[0])
    e.target.value = ''
    const options = {
      method: "POST",
      body: formData
    }
    try{
      const res = await fetch("http://localhost:8080/upload", options)
      if(!res.ok){
        return console.log("error")
      }
      const data = await res.json()

      console.log(data)
    }catch(err){
      if(err instanceof Error){
        console.log(err)
      }
    }
  }
  return (
    <main className="flex justify-center items-center h-screen flex-col gap-10">
      <div className="relative w-70 h-70">
        {image && <Image src={URL.createObjectURL(image)} fill alt="uploaded image" />}
      </div>
        <label htmlFor='image'>Upload Image</label>
        <input hidden id="image" type="file" onChange={uploadImage} />
    </main>
  )
}

export default Home
