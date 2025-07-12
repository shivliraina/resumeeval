"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadJob() {
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("jobTitle", jobTitle);
    localStorage.setItem("jobDescription", jobDescription);
    router.push("/add-resumes");
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    // TODO: parse the file here (e.g. readAsText or PDF-to-text)
    setJobDescription("Sample job description from uploaded file...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <SparklesIcon
                className="h-8 w-8 text-blue-600"
                aria-hidden="true"
              />
              <h1 className="text-2xl font-bold text-gray-900">
                ResumeMatch AI
              </h1>
            </Link>
            {/* Progress */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="text-sm font-medium text-blue-600">
                  Upload Job
                </span>
                <ArrowRightIcon
                  className="h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
                <div className="bg-gray-200 text-gray-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-sm text-gray-500">Add Resumes</span>
                <ArrowRightIcon
                  className="h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
                <div className="bg-gray-200 text-gray-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-sm text-gray-500">Results</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Upload Job Description
          </h2>
          <p className="text-lg text-gray-600">
            Start by adding the job description you want to match candidates
            against
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Job Description Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="e.g., Frontend Developer, Data Scientist, etc."
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  name="jobDescription"
                  placeholder="Paste the complete job description here..."
                  rows={12}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />
              </div>

              {/* File Upload */}
              <div className="border-t pt-6">
                <Label htmlFor="file">Or Upload Job Description File</Label>
                <div className="mt-2">
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supports PDF, Word, and text files
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/")}
                >
                  <ArrowLeftIcon
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                  />
                  Back to Home
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Add Resumes
                  <ArrowRightIcon
                    className="ml-2 h-4 w-4"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}