import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "./env";

const builder = imageUrlBuilder({ projectId, dataset });

type ImageSource = Parameters<typeof builder.image>[0];

export function urlForImage(source: unknown) {
  return builder.image(source as ImageSource);
}
