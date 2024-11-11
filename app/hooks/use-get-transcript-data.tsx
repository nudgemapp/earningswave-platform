import { useQuery } from "@tanstack/react-query";
import { Transcript } from "@prisma/client";

export const useGetTranscriptData = (transcriptId: string | null) => {
  return useQuery<Transcript>({
    queryKey: ["transcript", transcriptId],
    queryFn: async () => {
      if (!transcriptId) throw new Error("No transcript ID provided");
      const response = await fetch(`/api/earnings/${transcriptId}`);
      if (!response.ok) throw new Error("Failed to fetch transcript");
      return response.json();
    },
    enabled: !!transcriptId,
  });
};
