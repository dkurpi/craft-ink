import { headers } from 'next/headers';
import { updateTattooGenerationImagesAndStatus } from '@/data-access/tattoo';
import { verifyWebhook } from '@/lib/replicate';
import { uploadMultipleImagesFromUrls } from '@/lib/bucket';

export async function POST(req: Request) {
  // Get the raw body for verification
  const rawBody = await req.text();
  const payload = JSON.parse(rawBody);
  
  // Get required headers for verification
  const headersList = headers();
  const webhookHeaders = {
    'webhook-id': headersList.get('webhook-id') || '',
    'webhook-timestamp': headersList.get('webhook-timestamp') || '',
    'webhook-signature': headersList.get('webhook-signature') || '',
  };

  try {
    // Verify webhook signature
    const isValid = await verifyWebhook(webhookHeaders, rawBody);
    if (!isValid) {
      return new Response('Invalid signature', { status: 401 });
    }

    // Validate webhook payload schema
    // const webhookSchema = z.object({
    //   status: z.enum(['starting', 'processing', 'succeeded', 'failed', 'canceled']),
    //   input: z.object({
    //     id: z.string()
    //   }),
    //   output: z.array(z.string()).optional()
    // });

    // const result = webhookSchema.safeParse(payload);
    // if (!result.success) {
    //   console.error('Invalid webhook payload:', result.error);
    //   return new Response('Invalid payload', { status: 400 });
    // }


    // Handle different prediction statuses
    if (payload.status === 'succeeded') {
      const generationId = payload.id;
      const replicateImages = payload.output;

      // Upload images to Supabase and get public URLs
      const storedImageUrls = await uploadMultipleImagesFromUrls(
        replicateImages,
        'tattoos',  // your bucket name
        `generations/${generationId}`
      );

      await updateTattooGenerationImagesAndStatus(
        generationId,
        storedImageUrls,  // using stored image URLs instead of direct Replicate URLs
        'completed'
      );

      return new Response('Success', { status: 200 });
    }

    if (payload.status === 'failed') {
      const generationId = payload.input.id;
      
      await updateTattooGenerationImagesAndStatus(
        generationId,
        [],
        'failed'
      );

      return new Response('Failed', { status: 200 });
    }

    return new Response('Unhandled status', { status: 200 });
  } catch (error) {
    console.error('Webhook verification error:', error);
    return new Response('Verification failed', { status: 401 });
  }
}
