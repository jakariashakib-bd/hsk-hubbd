import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type UserPlan = "free" | "pro";

export const useUserPlan = () => {
  const { user } = useAuth();

  const { data: plan, isLoading } = useQuery({
    queryKey: ["user-plan", user?.id],
    queryFn: async () => {
      if (!user) return "free" as UserPlan;
      const { data, error } = await supabase
        .from("user_plans")
        .select("plan")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return (data?.plan as UserPlan) || "free";
    },
    enabled: !!user,
  });

  const currentPlan: UserPlan = plan || "free";
  const isPro = currentPlan === "pro";

  const canAccessLevel = (level: number) => {
    if (isPro) return true;
    return level <= 2;
  };

  const canAccessMockTests = () => isPro;

  return { plan: currentPlan, isPro, isLoading, canAccessLevel, canAccessMockTests };
};
