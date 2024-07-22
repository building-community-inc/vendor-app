import { createClient } from "@sanity/client";

export const sanityWriteClient = createClient({
  apiVersion: '2023-10-16',
  dataset: 'production',
  projectId: 'xomfbfrw',
  useCdn: false,
  token: 'skQn2uk2XttOketiUngOA2HhdZd5mlov60h8fjut2RSTVst5miLf4r8NVX9xFaVKahQ5oXi6E2FXT3djKxUAgDOxkOMePyxMEm6sEmwmDY0FWsGWUknrzDXCD2CBgwYh1bnW4YVIWaxKxlx6GhOteDy9kwBaCIQtbM0E8SdGk0EvSHlNMsy0',
});


const deleteAllDocsOfType = async (type: string) => {
  const allDocs = await sanityWriteClient.fetch(`*[_type == "${type}"]{_id}`);
  console.log(allDocs);
  for (const doc of allDocs) {
    await sanityWriteClient.delete(doc._id);
  }

  console.log(`Deleted all ${type} documents`);

  const remainingDocs = await sanityWriteClient.fetch(`*[_type == "${type}"]{_id}`);

  console.log({remainingDocs});
}