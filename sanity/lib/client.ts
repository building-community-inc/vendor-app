import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, useCdn } from "../env";
// import { env } from "@/env.mjs";
export const sanityClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: false,
  // fetch: (url, options) => fetch(url, { ...options, cache: 'no-cache' }),
});

export const sanityWriteClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
});
