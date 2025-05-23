
"use client";

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO, isValid } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import type { JobApplication } from '@/lib/types';
import { JOB_APPLICATION_STATUSES, JOB_TYPES, INTERVIEW_STAGES } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobId: z.string().optional(),
  jobLocation: z.string().optional(),
  jobType: z.string().optional(),
  jobSource: z.string().optional(),
  applicationDate: z.string().optional(),
  deadlineToApply: z.string().optional(),
  resumeVersion: z.string().optional(),
  coverLetterUsed: z.string().optional(),
  documentsSent: z.string().optional(),
  submittedVia: z.string().optional(),
  contactPersonName: z.string().optional(),
  contactEmailPhone: z.string().optional(),
  followUpSent: z.boolean().default(false),
  followUpDate: z.string().optional(),
  applicationStatus: z.string().optional(),
  lastUpdate: z.string().optional(),
  interviewStage: z.string().optional(),
  interviewDates: z.string().optional(),
  interviewerNames: z.string().optional(),
  offerReceived: z.boolean().default(false),
  offerDetails: z.string().optional(),
  acceptedDeclined: z.string().optional(),
  jobDescriptionLink: z.string().url().optional().or(z.literal('')),
  jobFitRating: z.coerce.number().min(1).max(10).optional(),
  customNotes: z.string().optional(),
  nextSteps: z.string().optional(),
});

type JobApplicationFormData = z.infer<typeof formSchema>;

interface JobApplicationFormProps {
  job?: JobApplication;
  readOnly?: boolean;
  onSubmit: (data: JobApplicationFormData) => void;
}

export function JobApplicationForm({ job, readOnly = false, onSubmit }: JobApplicationFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<JobApplicationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: job ? {
      ...job,
      jobFitRating: job.jobFitRating || undefined, // Ensure empty string or null becomes undefined for zod coerce
      jobDescriptionLink: job.jobDescriptionLink || '',
    } : {
      followUpSent: false,
      offerReceived: false,
      jobDescriptionLink: '',
    },
  });

  const { handleSubmit, control, formState: { errors, isSubmitting }, watch, setValue } = form;

  const watchedApplicationStatus = watch("applicationStatus");

  const submitHandler = (data: JobApplicationFormData) => {
    onSubmit(data);
  };

  const DateField = ({ name, label }: { name: keyof JobApplicationFormData, label: string }) => (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
                disabled={readOnly}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? format(parseISO(field.value), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value ? parseISO(field.value) : undefined}
                onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : undefined)}
                initialFocus
                disabled={readOnly}
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {errors[name] && <p className="text-sm text-destructive">{errors[name]?.message}</p>}
    </div>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <h2 className="text-lg font-semibold mt-6 mb-3 border-b pb-2 text-primary">{title}</h2>
  );

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <SectionHeader title="Core Information" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">Company Name *</Label>
          <Input id="companyName" {...form.register("companyName")} disabled={readOnly} />
          {errors.companyName && <p className="text-sm text-destructive">{errors.companyName.message}</p>}
        </div>
        <div>
          <Label htmlFor="jobTitle">Job Title *</Label>
          <Input id="jobTitle" {...form.register("jobTitle")} disabled={readOnly} />
          {errors.jobTitle && <p className="text-sm text-destructive">{errors.jobTitle.message}</p>}
        </div>
        <div>
          <Label htmlFor="jobId">Job ID / Reference Number</Label>
          <Input id="jobId" {...form.register("jobId")} disabled={readOnly} />
        </div>
        <div>
          <Label htmlFor="jobLocation">Job Location</Label>
          <Input id="jobLocation" {...form.register("jobLocation")} disabled={readOnly} />
        </div>
        <div>
          <Label htmlFor="jobType">Job Type</Label>
          <Controller
            name="jobType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                <SelectTrigger id="jobType"><SelectValue placeholder="Select job type" /></SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label htmlFor="jobSource">Job Source (e.g. LinkedIn, Company Website)</Label>
          <Input id="jobSource" {...form.register("jobSource")} disabled={readOnly} />
        </div>
        <DateField name="applicationDate" label="Application Date" />
        <DateField name="deadlineToApply" label="Deadline to Apply" />
      </div>

      <SectionHeader title="Application Details" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="resumeVersion">Resume Version Used</Label>
          <Input id="resumeVersion" {...form.register("resumeVersion")} disabled={readOnly} />
        </div>
        <div>
          <Label htmlFor="coverLetterUsed">Cover Letter Used</Label>
          <Input id="coverLetterUsed" {...form.register("coverLetterUsed")} disabled={readOnly} />
        </div>
        <div>
          <Label htmlFor="documentsSent">Documents Sent (e.g. Portfolio, References)</Label>
          <Input id="documentsSent" {...form.register("documentsSent")} disabled={readOnly} />
        </div>
        <div>
          <Label htmlFor="submittedVia">Submitted Via (e.g. Online portal, Email)</Label>
          <Input id="submittedVia" {...form.register("submittedVia")} disabled={readOnly} />
        </div>
      </div>

      <SectionHeader title="Contact & Follow-up" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactPersonName">Contact Person Name</Label>
          <Input id="contactPersonName" {...form.register("contactPersonName")} disabled={readOnly} />
        </div>
        <div>
          <Label htmlFor="contactEmailPhone">Contact Email/Phone</Label>
          <Input id="contactEmailPhone" {...form.register("contactEmailPhone")} disabled={readOnly} />
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <Controller
            name="followUpSent"
            control={control}
            render={({ field }) => <Switch id="followUpSent" checked={field.value} onCheckedChange={field.onChange} disabled={readOnly} />}
          />
          <Label htmlFor="followUpSent">Follow-up Sent?</Label>
        </div>
        <DateField name="followUpDate" label="Follow-up Date" />
      </div>

      <SectionHeader title="Progress & Status" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="applicationStatus">Application Status</Label>
          <Controller
            name="applicationStatus"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                <SelectTrigger id="applicationStatus"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  {JOB_APPLICATION_STATUSES.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <DateField name="lastUpdate" label="Last Update" />

        {(watchedApplicationStatus === 'Interviewing' || watchedApplicationStatus === 'Offer' || job?.interviewStage) && (
          <>
            <div>
              <Label htmlFor="interviewStage">Interview Stage</Label>
              <Controller
                name="interviewStage"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                    <SelectTrigger id="interviewStage"><SelectValue placeholder="Select interview stage" /></SelectTrigger>
                    <SelectContent>
                      {INTERVIEW_STAGES.map(stage => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <DateField name="interviewDates" label="Interview Date(s)" />
            <div>
              <Label htmlFor="interviewerNames">Interviewer Name(s)</Label>
              <Input id="interviewerNames" {...form.register("interviewerNames")} disabled={readOnly} />
            </div>
          </>
        )}
        
        <div className="flex items-center space-x-2 pt-4">
           <Controller
            name="offerReceived"
            control={control}
            render={({ field }) => <Switch id="offerReceived" checked={field.value} onCheckedChange={field.onChange} disabled={readOnly} />}
          />
          <Label htmlFor="offerReceived">Offer Received?</Label>
        </div>

        {(watch("offerReceived") || job?.offerDetails || job?.acceptedDeclined) && (
          <>
            <div>
              <Label htmlFor="offerDetails">Offer Details (Salary, Benefits, etc.)</Label>
              <Textarea id="offerDetails" {...form.register("offerDetails")} disabled={readOnly} />
            </div>
            <div>
              <Label htmlFor="acceptedDeclined">Accepted/Declined</Label>
              <Controller
                name="acceptedDeclined"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                    <SelectTrigger id="acceptedDeclined"><SelectValue placeholder="Select action" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Declined">Declined</SelectItem>
                      <SelectItem value="Pending Decision">Pending Decision</SelectItem>
                    </SelectContent>
                  </Select>
                )}
            />
            </div>
          </>
        )}
      </div>
      
      <SectionHeader title="Additional Information" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <Label htmlFor="jobDescriptionLink">Job Description Link</Label>
            <Input id="jobDescriptionLink" {...form.register("jobDescriptionLink")} type="url" placeholder="https://..." disabled={readOnly} />
            {errors.jobDescriptionLink && <p className="text-sm text-destructive">{errors.jobDescriptionLink.message}</p>}
        </div>
        <div>
            <Label htmlFor="jobFitRating">Job Fit Rating (1-10)</Label>
            <Input id="jobFitRating" type="number" {...form.register("jobFitRating")} min="1" max="10" disabled={readOnly} />
            {errors.jobFitRating && <p className="text-sm text-destructive">{errors.jobFitRating.message}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="customNotes">Custom Notes</Label>
        <Textarea id="customNotes" {...form.register("customNotes")} rows={3} disabled={readOnly} />
      </div>
      <div>
        <Label htmlFor="nextSteps">Next Steps / To-Do</Label>
        <Textarea id="nextSteps" {...form.register("nextSteps")} rows={3} disabled={readOnly} />
      </div>

      {!readOnly && (
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (job ? 'Updating...' : 'Adding...') : (job ? 'Update Application' : 'Add Application')}
          </Button>
        </div>
      )}
    </form>
  );
}

