
"use client";

import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Briefcase, CalendarDays, Edit3, Eye, MapPin, Sparkles, Trash2 } from 'lucide-react';
import type { JobApplication } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteJobDialog } from './DeleteJobDialog';
import { SuggestNextStepsDialog } from './SuggestNextStepsDialog';

interface JobApplicationCardProps {
  job: JobApplication;
  onDelete: (id: string) => void;
  onSuggestionApplied: (updatedJob: JobApplication) => void;
}

export function JobApplicationCard({ job, onDelete, onSuggestionApplied }: JobApplicationCardProps) {
  const formattedApplicationDate = job.applicationDate 
    ? format(parseISO(job.applicationDate), 'MMM d, yyyy') 
    : 'N/A';

  return (
    <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold text-primary-foreground bg-primary -mx-6 -mt-6 px-6 py-4 rounded-t-md flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              {job.jobTitle}
            </CardTitle>
            <CardDescription className="text-muted-foreground pt-2">{job.companyName}</CardDescription>
          </div>
          <div className="flex space-x-1">
              <SuggestNextStepsDialog job={job} onSuggestionApplied={onSuggestionApplied}>
                <Button variant="ghost" size="icon" aria-label="Suggest Next Steps" className="text-primary hover:text-primary/80">
                  <Sparkles className="h-5 w-5" />
                </Button>
              </SuggestNextStepsDialog>
            <DeleteJobDialog onConfirm={() => onDelete(job.id)}>
              <Button variant="ghost" size="icon" aria-label="Delete job" className="text-destructive hover:text-destructive/80">
                <Trash2 className="h-5 w-5" />
              </Button>
            </DeleteJobDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          {job.applicationStatus && (
            <Badge variant={job.applicationStatus === 'Offer' || job.applicationStatus === 'Accepted' ? 'default' : 'secondary'}>
              {job.applicationStatus}
            </Badge>
          )}
          {job.jobType && <Badge variant="outline">{job.jobType}</Badge>}
          
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2" />
            Applied: {formattedApplicationDate}
          </div>
          {job.jobLocation && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              {job.jobLocation}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full justify-end space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/jobs/${job.id}`}>
              <Eye className="mr-2 h-4 w-4" /> View
            </Link>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link href={`/jobs/${job.id}/edit`}>
              <Edit3 className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
