import { useQuery } from "@tanstack/react-query";
import { Transcript } from "@prisma/client";

interface ExtendedTranscript extends Transcript {
  financials?: {
    epsActual: number | null;
    epsEstimate: number | null;
    revenueActual: number | null;
    revenueEstimate: number | null;
  };
  company?: {
    id: string;
    currency: string;
    description: string;
    displaySymbol: string;
    // ... other company fields
  };
  participants?: Array<{
    id: string | null;
    name: string | null;
    role: string | null;
    description: string | null;
    speeches: string | null;
  }>;
}

export const useGetTranscriptData = (transcriptId: string | null) => {
  return useQuery<ExtendedTranscript>({
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
