
"use client";

import { useEffect, useState }from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { JobApplicationForm } from '@/components/JobApplicationForm';
import { getJobById } from '@/lib/job-storage';
import type { JobApplication } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ViewJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [job, setJob] = useState<JobApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchedJob = getJobById(id);
      if (fetchedJob) {
        setJob(fetchedJob);
      } else {
        // Handle job not found, maybe redirect or show error
        router.replace('/'); // Or a dedicated 404 page
      }
      setIsLoading(false);
    }
  }, [id, router]);

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
    return <div className="text-center py-12"><p className="text-xl text-muted-foreground">Job application not found.</p></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">View Application Details</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/jobs/${id}/edit`}>
              <Edit3 className="mr-2 h-4 w-4" /> Edit Application
            </Link>
          </Button>
        </div>
      </div>
      <JobApplicationForm job={job} readOnly={true} onSubmit={() => {}} />
    </div>
  );
}
