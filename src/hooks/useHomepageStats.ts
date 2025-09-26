import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HomepageStats {
  totalReported: number;
  totalResolved: number;
  resolutionRate: number;
  topCities: Array<{
    cityName: string;
    stateName: string;
    count: number;
  }>;
  trendingProblems: Array<{
    category: string;
    count: number;
  }>;
  recentlyResolved: Array<{
    id: string;
    category: string;
    cityName: string;
    stateName: string;
    resolvedAt: string;
    photoUrl?: string;
    description: string;
  }>;
  topReporter?: {
    name: string;
    phone: string;
    weeklyCount: number;
  };
}

export const useHomepageStats = () => {
  return useQuery({
    queryKey: ['homepage-stats'],
    queryFn: async (): Promise<HomepageStats> => {
      // Get total stats
      const { data: allComplaints, error: statsError } = await supabase
        .from('complaints')
        .select('status, category');
      
      if (statsError) throw statsError;

      const totalReported = allComplaints?.length || 0;
      const totalResolved = allComplaints?.filter(c => c.status === 'resolved').length || 0;
      const resolutionRate = totalReported > 0 ? Math.round((totalResolved / totalReported) * 100) : 0;

      // Get top cities
      const { data: cityData, error: cityError } = await supabase
        .from('complaints')
        .select(`
          city_id,
          cities (name),
          states (name)
        `);
      
      if (cityError) throw cityError;

      const cityGroups = cityData?.reduce((acc: Record<string, { count: number, cityName: string, stateName: string }>, complaint: any) => {
        const cityName = complaint.cities?.name || 'Unknown';
        const stateName = complaint.states?.name || 'Unknown';
        const key = `${cityName}-${stateName}`;
        
        if (!acc[key]) {
          acc[key] = { count: 0, cityName, stateName };
        }
        acc[key].count++;
        return acc;
      }, {}) || {};

      const topCities = Object.values(cityGroups)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get trending problems
      const categoryGroups = allComplaints?.reduce((acc: Record<string, number>, complaint) => {
        acc[complaint.category] = (acc[complaint.category] || 0) + 1;
        return acc;
      }, {}) || {};

      const trendingProblems = Object.entries(categoryGroups)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      // Get recently resolved with details
      const { data: recentlyResolvedData, error: resolvedError } = await supabase
        .from('complaints')
        .select(`
          id,
          category,
          description,
          photo_url,
          resolved_at,
          cities (name),
          states (name)
        `)
        .eq('status', 'resolved')
        .not('resolved_at', 'is', null)
        .order('resolved_at', { ascending: false })
        .limit(6);
      
      if (resolvedError) throw resolvedError;

      const recentlyResolved = recentlyResolvedData?.map(item => ({
        id: item.id,
        category: item.category,
        cityName: item.cities?.name || 'Unknown',
        stateName: item.states?.name || 'Unknown',
        resolvedAt: item.resolved_at || '',
        photoUrl: item.photo_url,
        description: item.description
      })) || [];

      // Get top reporter this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data: reporterData, error: reporterError } = await supabase
        .from('complaints')
        .select('citizen_name, citizen_phone')
        .gte('created_at', weekAgo.toISOString());
      
      if (reporterError) throw reporterError;

      const reporterGroups = reporterData?.reduce((acc: Record<string, { name: string, phone: string, count: number }>, complaint) => {
        const key = complaint.citizen_phone;
        if (!acc[key]) {
          acc[key] = { name: complaint.citizen_name, phone: complaint.citizen_phone, count: 0 };
        }
        acc[key].count++;
        return acc;
      }, {}) || {};

      const topReporter = Object.values(reporterGroups)
        .sort((a, b) => b.count - a.count)[0];

      return {
        totalReported,
        totalResolved,
        resolutionRate,
        topCities,
        trendingProblems,
        recentlyResolved,
        topReporter: topReporter ? {
          name: topReporter.name,
          phone: topReporter.phone,
          weeklyCount: topReporter.count
        } : undefined
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds for live data
  });
};