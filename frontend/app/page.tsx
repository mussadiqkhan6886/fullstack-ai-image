'use client';

import Image from 'next/image';
import React, { ChangeEvent, useState } from 'react'

const Home = () => {
  const [image, setImage] = useState<null | File>(null)
  const [prompt, setPrompt] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [response, setResponse] = useState<string>("")
  const [imagePreview, setImagePreview] = useState("");
const [loading, setLoading] = useState(false);
const [uploading, setUploading] = useState(false);
const [filePath, setFilePath] = useState("");
const [mime, setMime] = useState("");

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setUploading(true);

    try {
      const file = e.target.files[0];

      setImage(file);
      setImagePreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setError("Failed to upload image");
        return
      }
      const data = await res.json();

      setFilePath(data.filePath);
      setMime(data.mime);
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  const submitPrompt = async () => {
  if (!image) {
    setError("Please upload an image");
    return;
  }

  setLoading(true);
  setError("");
  setResponse("");

  try {
    const res = await fetch("http://localhost:8080/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
         filePath,
        mime,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed");
    }

    const data = await res.json();
    console.log(data.answer)
    setResponse(data.answer);
    console.log(response)
  } catch {
    setError("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  const clear = () => {
     if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
   setImage(null);
  setImagePreview("");
  setPrompt("");
  setError("");
  setResponse("");
   setFilePath("");
  setMime("");
  }

  return (
    <main className="max-w-3xl mx-auto flex justify-center p-10 items-center h-screen flex-col gap-0">
      <section className="flex flex-col gap-3 w-full p-10 pt-20">
        <div className="relative aspect-video">
          {imagePreview && (
            <Image
              src={imagePreview}
              fill
              alt="preview"
              className="object-cover rounded-xl"
            />
          )}
        </div>
        <div className="text-center">
          <label htmlFor='image' className="underline italic uppercase font-semibold">Upload an Image </label>
          <input hidden id="image" type="file" onChange={uploadImage} />
          <span>to ask question about.</span>
        </div>
        <div className="flex justify-between flex-col gap-2  sm:flex-row items-center px-2">
          <p className="text-zinc-800">What do you want to know about the image?</p>
          <button className="bg-black text-white px-4 py-1 cursor-pointer text-sm">Surprise me</button>
        </div>
      </section>
      <section>
        <div className="flex gap-5">
          <input className="w-full border border-zinc-400 py-2 px-4 outline-none text-sm" type="text" placeholder="What is in the image..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <button
            disabled={loading || uploading}
            onClick={submitPrompt}
            className="bg-black text-white px-5 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Thinking..." : "Ask Me"}
          </button>
          {(error || response) && <button className="bg-zinc-600 text-white text-sm px-3 cursor-pointer" onClick={clear}>Clear</button>}
        </div>
        <div>
          <div className='mb-6'>
            {error && <p className="font-semibold text-red-600 bg-red-200 px-2 py-4">{error}</p>}
            <div className="mt-6">
              {loading ? (
                <div className="flex gap-2 animate-pulse">
                  <div className="h-2 w-2 bg-zinc-800 rounded" />
                  <div className="h-2 w-2 bg-zinc-800 rounded " />
                  <div className="h-2 w-2 bg-zinc-800 rounded " />
                </div>
              ) : (
                  <div className="rounded-xl border bg-zinc-100 p-4 whitespace-pre-wrap">
                    {response}
                  </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
