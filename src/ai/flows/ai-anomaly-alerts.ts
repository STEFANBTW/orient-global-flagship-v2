'use server';
/**
 * @fileOverview An AI agent that analyzes system metrics and activity feeds to detect anomalies.
 *
 * - detectAnomaly - A function that handles the anomaly detection process.
 * - AIAnomalyAlertsInput - The input type for the detectAnomaly function.
 * - AIAnomalyAlertsOutput - The return type for the detectAnomaly function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIAnomalyAlertsInputSchema = z.object({
 totalRevenue: z.number().describe('The current total revenue in local currency.'),
 activeOrders: z.number().describe('The current number of active orders.'),
 onlineUsers: z.number().describe('The current number of online users.'),
 lowStockAlerts: z.number().describe('The current number of low stock alerts.'),
 recentActivityFeed: z.array(z.string()).describe('A list of recent system activities.'),
});
export type AIAnomalyAlertsInput = z.infer<typeof AIAnomalyAlertsInputSchema>;

const AIAnomalyAlertsOutputSchema = z.object({
 isAnomalyDetected: z.boolean().describe('Whether an unusual activity or critical issue has been detected.'),
 anomalyDescription: z.string().optional().describe('A detailed description of the detected anomaly, if any.'),
 severity: z.enum(['low', 'medium', 'high', 'critical']).optional().describe('The severity of the detected anomaly, if any.'),
});
export type AIAnomalyAlertsOutput = z.infer<typeof AIAnomalyAlertsOutputSchema>;

export async function detectAnomaly(input: AIAnomalyAlertsInput): Promise<AIAnomalyAlertsOutput> {
 return aiAnomalyAlertsFlow(input);
}

const prompt = ai.definePrompt({
 name: 'anomalyDetectorPrompt',
 input: { schema: AIAnomalyAlertsInputSchema },
 output: { schema: AIAnomalyAlertsOutputSchema },
 prompt: `You are an AI-powered anomaly detection system for the 'Orient' luxury lifestyle platform. Your task is to analyze real-time operational data and identify any unusual activities or critical issues that require immediate administrator attention.

Analyze the following metrics and recent activity feed. Determine if there's anything out of the ordinary or potentially problematic. If an anomaly is detected, provide a clear description and assign a severity level (low, medium, high, critical).

If no anomaly is detected, set 'isAnomalyDetected' to false and leave 'anomalyDescription' and 'severity' null.

--- Current System State ---
Total Revenue: {{{totalRevenue}}}
Active Orders: {{{activeOrders}}}
Online Users: {{{onlineUsers}}}
Low Stock Alerts: {{{lowStockAlerts}}}

--- Recent Activity Feed ---
{{#each recentActivityFeed}}- {{{this}}}
{{/each}}
`,
});

const aiAnomalyAlertsFlow = ai.defineFlow(
 {
 name: 'aiAnomalyAlertsFlow',
 inputSchema: AIAnomalyAlertsInputSchema,
 outputSchema: AIAnomalyAlertsOutputSchema,
 },
 async (input) => {
 const { output } = await prompt(input);
 return output!;
 }
);
