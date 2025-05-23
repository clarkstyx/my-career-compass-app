
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Search } from 'lucide-react';
import type { JobApplication } from '@/lib/types';
import { getJobs, deleteJob as deleteJobFromStorage } from '@/lib/job-storage';
import { JobApplicationCard } from '@/components/JobApplicationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { JOB_APPLICATION_STATUSES } from '@/lib/types';


export default function JobListPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
    setIsLoading(false);
  }, []);

  const loadJobs = () => {
    setJobs(getJobs());
  };

  const handleDeleteJob = (id: string) => {
    const success = deleteJobFromStorage(id);
    if (success) {
      toast({ title: "Application Deleted", description: "The job application has been removed." });
      loadJobs(); // Refresh list
    } else {
      toast({ title: "Error", description: "Could not delete the application.", variant: "destructive" });
    }
  };
  
  const handleSuggestionApplied = (updatedJob: JobApplication) => {
    // This is called when AI suggestion is applied from the card's dialog
    // The job is already updated in localStorage by SuggestNextStepsDialog
    // We just need to refresh the list to show the updated "nextSteps" if it's displayed on the card
    // or if other components depend on the updated job list.
    loadJobs(); 
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearchTerm = job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? job.applicationStatus === statusFilter : true;
    return matchesSearchTerm && matchesStatus;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><p>Loading applications...</p></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Job Applications</h1>
        <Button asChild>
          <Link href="/jobs/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Application
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Search by title or company..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            {JOB_APPLICATION_STATUSES.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <img src="https://placehold.co/300x200.png" alt="No applications" data-ai-hint="empty state document" className="mx-auto mb-4 rounded-lg" />
          <p className="text-xl text-muted-foreground">
            {jobs.length === 0 ? "You haven't added any job applications yet." : "No applications match your current filters."}
          </p>
          {jobs.length === 0 && (
             <Button asChild className="mt-4">
              <Link href="/jobs/new">
                <PlusCircle className="mr-2 h-5 w-5" /> Add your first application
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobApplicationCard key={job.id} job={job} onDelete={handleDeleteJob} onSuggestionApplied={handleSuggestionApplied} />
          ))}
        </div>
      )}
    </div>
  );
}
