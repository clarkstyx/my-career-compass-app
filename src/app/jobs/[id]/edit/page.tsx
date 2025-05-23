
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { JobApplicationForm } from '@/components/JobApplicationForm';
import { getJobById, updateJob } from '@/lib/job-storage';
import type { JobApplication } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  
  const [job, setJob] = useState<JobApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchedJob = getJobById(id);
      if (fetchedJob) {
        setJob(fetchedJob);
      } else {
        toast({ title: "Not Found", description: "Job application not found.", variant: "destructive" });
        router.replace('/');
      }
      setIsLoading(false);
    }
  }, [id, router, toast]);

  const handleSubmit = (data: Omit<JobApplication, 'id'>) => {
    if (!job) return;
    try {
      updateJob({ ...data, id: job.id });
      toast({
        title: "Application Updated",
        description: `Successfully updated application for ${data.jobTitle} at ${data.companyName}.`,
      });
      router.push(`/jobs/${job.id}`); // Navigate to view page after edit
    } catch (error) {
      console.error("Failed to update job:", error);
      toast({
        title: "Error",
        description: "Could not update the application.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
     return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!job) {
    // This case should ideally be handled by the redirect in useEffect, but as a fallback:
    return <div className="text-center py-12"><p className="text-xl text-muted-foreground">Job application not found.</p></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Job Application</h1>
        <Button variant="outline" asChild>
          <Link href={`/jobs/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Cancel Edit
          </Link>
        </Button>
      </div>
      <JobApplicationForm job={job} onSubmit={handleSubmit} />
    </div>
  );
}
