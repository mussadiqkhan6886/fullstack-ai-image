'use client';

import Image from 'next/image';
import React, { ChangeEvent, useState } from 'react'

const Home = () => {
  const [image, setImage] = useState<null | File>(null)
  const [prompt, setPrompt] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [response, setResponse] = useState<string>("")

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
        return console.log("error uploading image")
      }
      const data = await res.json()

    }catch(err){
      if(err instanceof Error){
        console.log(err)
      }
    }
  }

  const submitPrompt = async () => {
    if(!image){
      setError("Please upload an image")
      return
    }
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: prompt
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    const res = await fetch("http://localhost:8080/gemini", options)
    if(!res.ok){
      setError("Error fetching")
      return
    }
    const data = await res.text()
    setResponse(data)
  }

  const clear = () => {
    setImage(null)
    setPrompt("")
    setError("")
    setResponse("")
  }

  return (
    <main className="flex justify-center items-center h-screen flex-col gap-10">
      <section>
        <div className="relative w-70 h-70">
          {image && <Image src={URL.createObjectURL(image)} fill alt="uploaded image" />}
        </div>
        <div>
          <label htmlFor='image'>Upload an Image</label>
          <input hidden id="image" type="file" onChange={uploadImage} />
          <span>To ask question about.</span>
        </div>
        <div>
          <p>What do you want to know about the image?</p>
          <button>Surprise me</button>
        </div>
      </section>
      <section>
        <div>
          <input type="text" placeholder="What is in the image..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <button onClick={submitPrompt} >Ask me</button>
        </div>
        {(error || response) && <div>
          <div>
            {error && <p>{error}</p>}
            {response && <p>{response}</p>}
          </div>
          <button onClick={clear}>Clear</button>
        </div>}
      </section>
    </main>
  )
}

export default Home
