
"use client";

import type React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2, Sparkles } from 'lucide-react';
import { suggestNextSteps } from '@/ai/flows/suggest-next-steps';
import { useToast } from '@/hooks/use-toast';
import type { JobApplication } from '@/lib/types';
import { updateJob as updateJobInStorage } from '@/lib/job-storage';

interface SuggestNextStepsDialogProps {
  job: JobApplication;
  onSuggestionApplied?: (updatedJob: JobApplication) => void;
  children: React.ReactNode;
}

export function SuggestNextStepsDialog({ job, onSuggestionApplied, children }: SuggestNextStepsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSuggest = async () => {
    if (!job.applicationStatus) {
      toast({
        title: "Missing Information",
        description: "Application status is required to suggest next steps.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestNextSteps({ applicationStatus: job.applicationStatus });
      setSuggestion(result.nextSteps);
    } catch (error) {
      console.error("Error suggesting next steps:", error);
      toast({
        title: "AI Error",
        description: "Could not generate suggestions at this time.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestionToJob = () => {
    if (suggestion) {
      const updatedJob = { ...job, nextSteps: suggestion };
      updateJobInStorage(updatedJob);
      toast({
        title: "Suggestion Applied",
        description: "The suggested next step has been added to the job's 'Next Steps / To-Do' field.",
      });
      if (onSuggestionApplied) {
        onSuggestionApplied(updatedJob);
      }
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setSuggestion(null)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            AI Next Step Suggestion
          </DialogTitle>
          <DialogDescription>
            Let AI suggest the next actions based on your application status: <strong>{job.applicationStatus || 'N/A'}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!suggestion && !isLoading && (
            <Button onClick={handleSuggest} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Suggestion
            </Button>
          )}
          {isLoading && (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span>Generating...</span>
            </div>
          )}
          {suggestion && !isLoading && (
            <div className="mt-4 space-y-2 rounded-md border bg-muted/50 p-4">
              <p className="font-semibold">Suggested Next Step:</p>
              <p>{suggestion}</p>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {suggestion && !isLoading && (
             <Button onClick={applySuggestionToJob}>
                Apply to "Next Steps / To-Do"
              </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
