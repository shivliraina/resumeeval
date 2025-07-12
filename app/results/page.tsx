"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SparklesIcon, ArrowLeftIcon, DocumentArrowDownIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface ResumeResult {
  candidate_name: string;
  match_score: number;
  experience_years: number;
  matching_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  summary: string;
  error?: string;
}

interface AnalysisResults {
  job_title: string;
  total_candidates: number;
  results: ResumeResult[];
  timestamp: string;
}

export default function Results() {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedResults = localStorage.getItem("analysisResults");
    
    if (savedResults) {
      try {
        const results: AnalysisResults = JSON.parse(savedResults);
        setAnalysisResults(results);
      } catch (error) {
        console.error('Error parsing results:', error);
      }
    }
    
    setLoading(false);
  }, []);

  const exportToExcel = () => {
    if (!analysisResults) return;

    const csvContent = [
      ["Rank", "Name", "Match Score", "Experience", "Recommendation", "Matching Skills", "Missing Skills", "Summary"],
      ...analysisResults.results.map((result, index) => [
        `#${index + 1}`,
        result.candidate_name,
        `${result.match_score}%`,
        `${result.experience_years} years`,
        result.recommendation,
        result.matching_skills.join("; "),
        result.missing_skills.join("; "),
        result.summary
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${analysisResults.job_title.replace(/\s+/g, '-')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-blue-100 text-blue-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getRecommendationColor = (recommendation: string): string => {
    if (recommendation === "qualified") return "bg-green-100 text-green-800";
    if (recommendation === "review") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Results...</h3>
            <p className="text-gray-600">Please wait while we load your analysis results.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysisResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-4">No analysis results were found. Please start a new analysis.</p>
            <Link href="/upload-job">
              <Button>Start New Analysis</Button>
            </Link>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Analysis Results</h2>
          <p className="text-lg text-gray-600">
            Resume matching results for: <strong>{analysisResults.job_title}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Analysis completed on {new Date(analysisResults.timestamp).toLocaleString()}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resume Analysis Results</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {analysisResults.total_candidates} candidates evaluated, ranked by AI match score
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
                    <TableHead>Match Score</TableHead>
                    <TableHead>Recommendation</TableHead>
                    <TableHead>Key Skills</TableHead>
                    <TableHead>Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analysisResults.results.map((result, index) => (
                    <TableRow key={index}>
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
                      <TableCell className="font-medium">{result.candidate_name}</TableCell>
                      <TableCell>{result.experience_years} years</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getScoreColor(result.match_score)}>
                          {result.match_score}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getRecommendationColor(result.recommendation)}>
                          {result.recommendation}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {result.matching_skills.slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {result.matching_skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{result.matching_skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-gray-600 truncate" title={result.summary}>
                          {result.summary}
                        </p>
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