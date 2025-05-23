
"use client"; // This module is intended for client-side use only

import type { JobApplication } from './types';

const JOBS_STORAGE_KEY = 'careerCompassJobs';

export function getJobs(): JobApplication[] {
  if (typeof window === 'undefined') return [];
  const jobsJson = localStorage.getItem(JOBS_STORAGE_KEY);
  return jobsJson ? JSON.parse(jobsJson) : [];
}

export function getJobById(id: string): JobApplication | undefined {
  if (typeof window === 'undefined') return undefined;
  const jobs = getJobs();
  return jobs.find(job => job.id === id);
}

export function addJob(job: Omit<JobApplication, 'id'>): JobApplication {
  if (typeof window === 'undefined') throw new Error("Cannot add job on server");
  const jobs = getJobs();
  const newJob: JobApplication = { ...job, id: crypto.randomUUID() };
  localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify([...jobs, newJob]));
  return newJob;
}

export function updateJob(updatedJob: JobApplication): JobApplication | undefined {
  if (typeof window === 'undefined') throw new Error("Cannot update job on server");
  let jobs = getJobs();
  const jobIndex = jobs.findIndex(job => job.id === updatedJob.id);
  if (jobIndex === -1) return undefined;
  
  jobs[jobIndex] = updatedJob;
  localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  return updatedJob;
}

export function deleteJob(id: string): boolean {
  if (typeof window === 'undefined') throw new Error("Cannot delete job on server");
  let jobs = getJobs();
  const initialLength = jobs.length;
  jobs = jobs.filter(job => job.id !== id);
  if (jobs.length < initialLength) {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
    return true;
  }
  return false;
}
