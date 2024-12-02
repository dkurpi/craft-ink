import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadImageFromUrl(
  imageUrl: string,
  bucket: string,
  path: string
): Promise<string | null> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');
    
    const imageBuffer = await response.arrayBuffer();

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, imageBuffer, {
        contentType: response.headers.get('content-type') || 'image/png',
        upsert: true
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
}

// Helper to upload multiple images
export async function uploadMultipleImagesFromUrls(
  imageUrls: string[],
  bucket: string,
  basePath: string
): Promise<string[]> {
  console.log('uploadMultipleImagesFromUrls:', {imageUrls,  bucket, basePath});


  const uploadPromises = imageUrls.map((url, index) => {
    const path = `${basePath}/${Date.now()}-${index}.png`;
    return uploadImageFromUrl(url, bucket, path);
  });

  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => url !== null);
} 