import { useQuery } from "@tanstack/react-query";
import { Subscription, Invoice } from "@prisma/client";

interface SubscriptionWithStatus extends Partial<Subscription> {
  isExpired: boolean;
  isActive: boolean;
  invoices: Invoice[];
  status: string;
}

export const useUserSubscription = (userId: string | undefined) => {
  return useQuery<SubscriptionWithStatus>({
    queryKey: ["subscription", userId],
    queryFn: async () => {
      // console.log(userId);
      if (!userId) throw new Error("No user ID provided");
      const response = await fetch(`/api/subscriptions/${userId}`);

      // console.log(response);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        }
        throw new Error("Failed to fetch subscription data");
      }

      const data = await response.json();

      // console.log(data);

      // If no subscription found, return a default inactive state
      if (data.status === "inactive") {
        return {
          id: "",
          subscription_id: "",
          stripe_user_id: "",
          status: "inactive",
          start_date: new Date(),
          end_date: new Date(),
          plan_id: "",
          user_id: userId,
          isExpired: true,
          isActive: false,
          invoices: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        } as SubscriptionWithStatus;
      }

      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false, // Don't retry on error
  });
};
