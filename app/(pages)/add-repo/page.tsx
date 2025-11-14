'use client';

import { FirestoreService } from '@/firebase/firestoreService';
import { CategoryDoc, LabelDoc } from '@/types/types';
import { useRouter } from 'next/navigation';
import React, { useState, useRef, FormEvent, use, useEffect } from 'react';



// --- Main Page Component ---
export default function UploadPage() {
  const [repoName, setRepoName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const [categories, setCategories] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);



  const [label, setLabel] = useState('');

  const [keywords, setKeywords] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter()

  const toast = {
    error: (msg: string) => alert(`Error: ${msg}`),
    success: (msg: string) => alert(`Success: ${msg}`),
    loading: (msg: string) => console.log(`Loading: ${msg}`),
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type === 'application/zip' ||
        selectedFile.type === 'application/x-zip-compressed' ||
        selectedFile.name.endsWith('.zip')
      ) {
        setFile(selectedFile);
      } else {
        toast.error('Invalid file type. Please upload a ZIP file.');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const resetForm = () => {
    setRepoName('');
    setTitle('');
    setDescription('');
    setKeywords('');
    setCategory('');
    setLabel('');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };



 

  const getCategories = async () => {
    const docs  = await FirestoreService.getAllDocs<CategoryDoc>("Categories");

    setCategories(docs.map((doc) => doc.name));
  }

  const getLabels = async () => {
    const docs = await FirestoreService.getAllDocs<LabelDoc>("Labels");

    setLabels(docs.map((doc) => doc.name));

  }

  const categoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  }

  const labelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLabel(e.target.value);
  }

   const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a ZIP file to upload.");
      return;
    }

    try {
      setIsLoading(true);
      toast.loading("Uploading tool...");

      const formData = new FormData();
      formData.append("file", file); // ZIP file
      formData.append("name", repoName);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("label", label);

      formData.append("description", description);
      formData.append("keywords", keywords);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
      }

      toast.success("Tool uploaded successfully!");

      router.push("/repos")

      resetForm();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to upload tool.");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {

    getCategories();
    getLabels();

   }, []);


  return (

    <div className="flex-1 p-6 lg:p-10">
      <div className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden border border-slate-700 bg-slate-800 text-slate-100 p-8 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-6">
          Tool Uploader
        </h1>
        <p className="text-slate-400 mb-6">
          Add your new tool to the Pentora ecosystem.
        </p>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Repo Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Meta Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Network Scanner"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-md h-10 px-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Repository Name
              </label>
              <input
                value={repoName}
                onChange={(e) =>
                  setRepoName(
                    e.target.value.toLowerCase().replace(/\s+/g, '-')
                  )
                }
                required
                placeholder="e.g., network-scanner"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-md h-10 px-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Meta Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="A short description of what this tool does."
              className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Categories
            </label>

            <select
              className="w-full p-2 bg-slate-800 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue=""
              required
              onChange={categoryChange}
            >
              <option value="" disabled>
                Select a category
              </option>
            
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            
            </select>
          </div>


           {/* Labels */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Labels
            </label>

            <select
              className="w-full p-2 bg-slate-800 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue=""
              onChange={labelChange}
              required
            >
              <option value="" disabled>
                Select a label
              </option>
            
                {labels.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
            
            </select>
          </div>




          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Meta  Keywords
            </label>
            <input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              required
              placeholder="scanner, network, security"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-md h-10 px-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Comma-separated keywords.
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tool Files (.zip)
            </label>
            {!file ? (
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-700/30 hover:bg-slate-700/60 transition-colors"
              >
                <p className="text-sm text-slate-400">
                  <span className="font-semibold text-purple-400">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-slate-500 mt-1">ZIP file only</p>
                <input
                  id="file-upload"
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".zip,application/zip,application/x-zip-compressed"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between w-full h-16 border border-slate-600 rounded-lg bg-slate-700/50 px-4">
                <span className="text-sm font-medium text-slate-200">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="bg-transparent hover:bg-red-500/20 text-slate-400 hover:text-red-400 h-8 w-8 rounded-md transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center rounded-md text-sm font-semibold bg-purple-600 text-white hover:bg-purple-600/90 h-11 px-8 shadow-lg"
          >
            {isLoading ? 'Uploading...' : 'Upload Tool'}
          </button>
        </form>
      </div>
    </div>

  );
}