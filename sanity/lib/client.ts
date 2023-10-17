import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, useCdn, apiToken } from "../env";

export const sanityClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
});


export const sanityWriteClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: false,
  token: apiToken,
});
