"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SparklesIcon, ArrowRightIcon, ArrowLeftIcon, DocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ResumeFile {
  id: number;
  name: string;
  file: File;
  size: string;
}

export default function AddResumes() {
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [jobTitle, setJobTitle] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const savedJobTitle = localStorage.getItem("jobTitle");
    if (savedJobTitle) {
      setJobTitle(savedJobTitle);
    }
  }, []);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      const newResumes: ResumeFile[] = filesArray.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        file: file,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB"
      }));
      setResumes([...resumes, ...newResumes]);
    }
  };

  const removeResume = (id: number) => {
    setResumes(resumes.filter(resume => resume.id !== id));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (resumes.length === 0) {
      alert("Please upload at least one resume");
      return;
    }
    // Save resumes to localStorage
    const resumeData = resumes.map(resume => ({
      id: resume.id,
      name: resume.name,
      size: resume.size
    }));
    localStorage.setItem("resumes", JSON.stringify(resumeData));
    router.push("/results");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <SparklesIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ResumeMatch AI</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="text-sm font-medium text-green-600">Upload Job</span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-sm font-medium text-blue-600">Add Resumes</span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                <div className="bg-gray-200 text-gray-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-sm text-gray-500">Results</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Add Resumes</h2>
          <p className="text-lg text-gray-600">
            Upload candidate resumes to match against: <strong>{jobTitle}</strong>
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Upload Resumes</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="resumes">Select Resume Files</Label>
                <div className="mt-2">
                  <Input
                    id="resumes"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    multiple
                    onChange={handleFileUpload}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Select multiple files. Supports PDF, Word, and text files (Max 10MB each)
                  </p>
                </div>
              </div>

              {resumes.length > 0 && (
                <div>
                  <Label>Uploaded Resumes ({resumes.length})</Label>
                  <div className="mt-2 space-y-2">
                    {resumes.map((resume) => (
                      <div key={resume.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <DocumentIcon className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">{resume.name}</p>
                            <p className="text-sm text-gray-500">{resume.size}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeResume(resume.id)}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-6">
                <Link href="/upload-job">
                  <Button variant="outline" type="button">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back to Job Description
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={resumes.length === 0}
                >
                  Analyze Resumes
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}