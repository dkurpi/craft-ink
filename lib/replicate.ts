import Replicate, { Prediction } from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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
          num_inference_steps: 50,
        },
    });
    return prediction.id;
}   


export async function getPredictionStatus(predictionId: string): Promise<Prediction> {
    const prediction = await replicate.predictions.get(predictionId);
    return prediction;
}

export default replicate;