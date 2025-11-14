'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useRef, FormEvent } from 'react';



// --- Main Page Component ---
export default function UploadPage() {
    const [name, setName] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter()

    const toast = {
        error: (msg: string) => alert(`Error: ${msg}`),
        success: (msg: string) => alert(`Success: ${msg}`),
        loading: (msg: string) => console.log(`Loading: ${msg}`),
    };



    const resetForm = () => {
        setName('');
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();



        try {
            setIsLoading(true);



            const res = await fetch("/api/category/create", {
                method: "POST",
                body: JSON.stringify({ name }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to create category.");
            }

            toast.success("Category created successfully!");

            router.push("/categories")

            resetForm();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to create category.");
        } finally {
            setIsLoading(false);
        }
    };


    return (

        <div className="flex-1 p-6 lg:p-10">
            <div className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden border border-slate-700 bg-slate-800 text-slate-100 p-8 sm:p-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-6">
                    Create Category
                </h1>


                {/* Upload Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title & Repo Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Name
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="e.g., Network Scanner"
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-md h-10 px-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center rounded-md text-sm font-semibold bg-purple-600 text-white hover:bg-purple-600/90 h-11 px-8 shadow-lg"
                    >
                        {isLoading ? 'Uploading...' : 'Create Category'}
                    </button>
                </form>
            </div>
        </div>

    );
}