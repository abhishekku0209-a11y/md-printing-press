import { createActorWithConfig } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Backend, ExternalBlob } from "../backend";

type UploadFn = (file: ExternalBlob) => Promise<Uint8Array>;
type DownloadFn = (file: Uint8Array) => Promise<ExternalBlob>;

// Module-level references captured when the actor is first created.
// These are set once and reused for image uploads.
let _uploadFile: UploadFn | null = null;
let _downloadFile: DownloadFn | null = null;

function createActorAndCaptureStorageFns(
  canisterId: string,
  uploadFile: UploadFn,
  downloadFile: DownloadFn,
  options: Parameters<typeof createActor>[3],
): Backend {
  // Capture the storage functions for use by uploadImageFile
  _uploadFile = uploadFile;
  _downloadFile = downloadFile;
  return createActor(
    canisterId,
    uploadFile as Parameters<typeof createActor>[1],
    downloadFile as Parameters<typeof createActor>[2],
    options ?? {},
  );
}

/**
 * Upload a File (image) to the platform object storage and return a direct URL.
 *
 * Uses the same StorageClient that the actor was initialised with, so authentication
 * (certificate from the backend canister) is handled automatically.
 *
 * Must be called after useBackend() has initialised the actor at least once.
 */
export async function uploadImageFile(file: File): Promise<string> {
  if (!_uploadFile || !_downloadFile) {
    throw new Error(
      "Storage not initialised. Make sure useBackend() has loaded before uploading.",
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // ExternalBlob is imported from backend.ts (which re-exports it)
  const { ExternalBlob: Blob } = await import("../backend");
  const externalBlob = Blob.fromBytes(bytes);

  // Upload to object storage. _uploadFile returns encoded hash bytes of the form
  // "<sentinel><sha256-hash>". It does NOT update externalBlob.directURL.
  // We must pass the returned hash bytes to _downloadFile, which decodes the hash
  // and constructs the permanent CDN URL via storageClient.getDirectURL(hash).
  const hashBytes = await _uploadFile(externalBlob);

  // Derive the permanent direct URL by asking _downloadFile to resolve the hash.
  const downloadedBlob = await _downloadFile(hashBytes);
  const url = downloadedBlob.getDirectURL();
  if (!url || url.startsWith("blob:")) {
    throw new Error(
      "Upload succeeded but no permanent URL was returned. Please try again.",
    );
  }
  return url;
}

/**
 * Creates a backend actor using createActorWithConfig from
 * @caffeineai/core-infrastructure, capturing storage functions for image uploads.
 *
 * Returns { actor, isFetching } compatible with all existing data-fetching hooks.
 * NOTE: The useEffect-based invalidation was removed to prevent repeated cache
 * busting. Data queries are enabled only when the actor is ready.
 */
export function useBackend(): { actor: Backend | null; isFetching: boolean } {
  const actorQuery = useQuery<Backend>({
    queryKey: ["backend-actor"],
    queryFn: async () => {
      return createActorWithConfig(
        createActorAndCaptureStorageFns as Parameters<
          typeof createActorWithConfig
        >[0],
      ) as Promise<Backend>;
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    retry: 2,
  });

  return {
    actor: actorQuery.data ?? null,
    isFetching: actorQuery.isFetching,
  };
}
