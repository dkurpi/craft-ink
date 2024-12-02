import Replicate, { Prediction } from "replicate";
import crypto from 'crypto';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

type WebhookHeaders = {
    'webhook-id': string;
    'webhook-timestamp': string;
    'webhook-signature': string;
};

const WEBHOOK_TOLERANCE_IN_SECONDS = 300; // 5 minutes

export async function verifyWebhook(
    headers: WebhookHeaders,
    body: string
): Promise<boolean> {
    const webhookKey = process.env.REPLICATE_WEBHOOK_SECRET;
    if (!webhookKey) throw new Error('REPLICATE_WEBHOOK_SECRET is not set');

    // Verify timestamp to prevent replay attacks
    const timestamp = parseInt(headers['webhook-timestamp'], 10);
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > WEBHOOK_TOLERANCE_IN_SECONDS) {
        return false;
    }

    // Construct signed content
    const signedContent = `${headers['webhook-id']}.${headers['webhook-timestamp']}.${body}`;

    // Calculate signature
    const secretBytes = Buffer.from(webhookKey.split('_')[1], 'base64');
    const computedSignature = crypto
        .createHmac('sha256', secretBytes)
        .update(signedContent)
        .digest('base64');

    // Verify against provided signatures
    const expectedSignatures = headers['webhook-signature']
        .split(' ')
        .map(sig => sig.split(',')[1]);

    return expectedSignatures.some(
        expectedSignature => expectedSignature === computedSignature
    );
}

export async function startPrediction(prompt: string): Promise<string> {
    const prediction = await replicate.predictions.create({
        version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
        input: {
          prompt,
          width: 768,
          height: 768,
          num_outputs: 1,
          scheduler: "K_EULER",
          guidance_scale: 7.5,
          num_inference_steps: 50
        },
        webhook: process.env.REPLICATE_WEBHOOK_URL,
        webhook_events_filter: ["completed"],
    });
    return prediction.id;
}   


export async function getPredictionStatus(predictionId: string): Promise<Prediction> {
    const prediction = await replicate.predictions.get(predictionId);
    return prediction;
}

export default replicate;