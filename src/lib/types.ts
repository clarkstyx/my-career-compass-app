
export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  jobId?: string;
  jobLocation?: string;
  jobType?: string;
  jobSource?: string;
  applicationDate?: string;
  deadlineToApply?: string;
  resumeVersion?: string;
  coverLetterUsed?: string;
  documentsSent?: string;
  submittedVia?: string;
  contactPersonName?: string;
  contactEmailPhone?: string;
  followUpSent: boolean;
  followUpDate?: string;
  applicationStatus?: string;
  lastUpdate?: string;
  interviewStage?: string;
  interviewDates?: string;
  interviewerNames?: string;
  offerReceived: boolean;
  offerDetails?: string;
  acceptedDeclined?: string;
  jobDescriptionLink?: string;
  jobFitRating?: number;
  customNotes?: string;
  nextSteps?: string; // This can be manually entered or AI suggested
}

export type JobApplicationStatus = 
  | 'Not started' 
  | 'Applied' 
  | 'Interviewing' 
  | 'Offer' 
  | 'Rejected' 
  | 'Ghosted'
  | 'Accepted'
  | 'Declined';

export const JOB_APPLICATION_STATUSES: JobApplicationStatus[] = [
  'Not started', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Ghosted', 'Accepted', 'Declined'
];

export type JobType = 
  | 'Full-time' 
  | 'Part-time' 
  | 'Contract' 
  | 'Internship' 
  | 'Co-op' 
  | 'Temporary' 
  | 'Other';

export const JOB_TYPES: JobType[] = [
  'Full-time', 'Part-time', 'Contract', 'Internship', 'Co-op', 'Temporary', 'Other'
];

export type InterviewStage = 
  | 'None' 
  | 'Phone screen' 
  | 'First round' 
  | 'Final interview' 
  | 'Other';

export const INTERVIEW_STAGES: InterviewStage[] = [
  'None', 'Phone screen', 'First round', 'Final interview', 'Other'
];
