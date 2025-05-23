
// src/ai/flows/suggest-next-steps.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest next steps for a job application.
 *
 * - suggestNextSteps - A function that takes a job application's status and suggests next steps.
 * - SuggestNextStepsInput - The input type for the suggestNextSteps function.
 * - SuggestNextStepsOutput - The return type for the suggestNextSteps function.
 */

import {ai}from '@/ai/genkit';
import {z}from 'genkit';

const SuggestNextStepsInputSchema = z.object({
  applicationStatus: z
    .string()
    .describe('The current status of the job application (e.g., Applied, Interviewing, Offer).'),
});
export type SuggestNextStepsInput = z.infer<typeof SuggestNextStepsInputSchema>;

const SuggestNextStepsOutputSchema = z.object({
  nextSteps: z
    .string()
    .describe('Suggested next steps for the job application based on its status.'),
});
export type SuggestNextStepsOutput = z.infer<typeof SuggestNextStepsOutputSchema>;

export async function suggestNextSteps(input: SuggestNextStepsInput): Promise<SuggestNextStepsOutput> {
  return suggestNextStepsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNextStepsPrompt',
  input: {schema: SuggestNextStepsInputSchema},
  output: {schema: SuggestNextStepsOutputSchema},
  prompt: `Based on the current status of my job application, suggest the most appropriate next steps. Current status: {{{applicationStatus}}}.`,
});

const suggestNextStepsFlow = ai.defineFlow(
  {
    name: 'suggestNextStepsFlow',
    inputSchema: SuggestNextStepsInputSchema,
    outputSchema: SuggestNextStepsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
