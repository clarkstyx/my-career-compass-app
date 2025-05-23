
"use client";

import { useRouter } from 'next/navigation';
import { JobApplicationForm } from '@/components/JobApplicationForm';
import { addJob } from '@/lib/job-storage';
import type { JobApplication } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function NewJobPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (data: Omit<JobApplication, 'id'>) => {
    try {
      addJob(data);
      toast({
        title: "Application Added",
        description: `Successfully added application for ${data.jobTitle} at ${data.companyName}.`,
      });
      router.push('/');
    } catch (error) {
      console.error("Failed to add job:", error);
      toast({
        title: "Error",
        description: "Could not add the application.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Add New Job Application</h1>
      <JobApplicationForm onSubmit={handleSubmit} />
    </div>
  );
}
