import { useQuery } from "@tanstack/react-query";

const useGetMessageCount = () => {
  return useQuery({
    queryKey: ["messageCount"],
    queryFn: async () => {
      const response = await fetch("/api/user/message-count");
      if (!response.ok) {
        throw new Error("Failed to fetch message count");
      }
      const data = await response.json();
      return data.messageCount;
    },
  });
};

export default useGetMessageCount;
