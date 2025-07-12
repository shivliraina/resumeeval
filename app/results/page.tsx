"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SparklesIcon, ArrowLeftIcon, DocumentArrowDownIcon, ArrowPathIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface ResumeResult {
  id: number;
  name: string;
  jobRole: string;
  experience: string;
  matchScore: number;
  skills: string[];
  status: "qualified" | "review";
}

interface SavedResume {
  id: number;
  name: string;
  size: string;
}

export default function Results() {
  const [results, setResults] = useState<ResumeResult[]>([]);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedJobTitle = localStorage.getItem("jobTitle");
    const savedResumes = localStorage.getItem("resumes");
    
    if (savedJobTitle) setJobTitle(savedJobTitle);
    
    if (savedResumes) {
      const resumes: SavedResume[] = JSON.parse(savedResumes);
      // Simulate AI processing
      setTimeout(() => {
        const mockResults: ResumeResult[] = resumes.map((resume, index) => ({
          id: resume.id,
          name: resume.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          jobRole: savedJobTitle || "Unknown Position",
          experience: `${Math.floor(Math.random() * 8) + 1} years`,
          matchScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
          skills: ["React", "JavaScript", "CSS", "Node.js", "Python"].slice(0, Math.floor(Math.random() * 3) + 2),
          status: Math.random() > 0.3 ? "qualified" : "review"
        }));
        setResults(mockResults.sort((a, b) => b.matchScore - a.matchScore));
        setLoading(false);
      }, 2000);
    }
  }, []);

  const exportToExcel = () => {
    // Create CSV content
    const csvContent = [
      ["Name", "Job Role", "Experience", "Match Score", "Skills", "Status"],
      ...results.map(result => [
        result.name,
        result.jobRole,
        result.experience,
        `${result.matchScore}%`,
        result.skills.join("; "),
        result.status
      ])
    ].map(row => row.join(",")).join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-evaluation-${jobTitle.replace(/\s+/g, '-')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-blue-100 text-blue-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusColor = (status: string): string => {
    return status === "qualified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <ArrowPathIcon className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Resumes...</h3>
            <p className="text-gray-600">Our AI is processing your resumes and generating match scores.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="text-sm font-medium text-green-600">Add Resumes</span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-sm font-medium text-blue-600">Results</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Evaluation Results</h2>
          <p className="text-lg text-gray-600">
            Resume matching results for: <strong>{jobTitle}</strong>
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resume Analysis Results</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {results.length} candidates evaluated, sorted by match score
                </p>
              </div>
              <Button onClick={exportToExcel} variant="outline">
                <DocumentArrowDownIcon className="mr-2 h-4 w-4" />
                Export to Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Key Skills</TableHead>
                    <TableHead>Match Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium">#{index + 1}</span>
                          {index < 3 && (
                            <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                              Top {index + 1}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{result.name}</TableCell>
                      <TableCell>{result.experience}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {result.skills.map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getScoreColor(result.matchScore)}>
                          {result.matchScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(result.status)}>
                          {result.status === "qualified" ? "Qualified" : "Under Review"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-8">
          <Link href="/add-resumes">
            <Button variant="outline">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Add Resumes
            </Button>
          </Link>
          <div className="flex space-x-4">
            <Link href="/upload-job">
              <Button variant="outline">
                Start New Analysis
              </Button>
            </Link>
            <Button onClick={exportToExcel} className="bg-blue-600 hover:bg-blue-700">
              <DocumentArrowDownIcon className="mr-2 h-4 w-4" />
              Download Results
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}