import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ComplaintStats {
  total_complaints: number;
  resolved_count: number;
  pending_count: number;
  in_progress_count: number;
  resolution_rate: number;
}

export interface StateComplaintData {
  state_name: string;
  complaint_count: number;
}

export interface WeeklyData {
  week_start: string;
  total_complaints: number;
  resolved_complaints: number;
}

export const useComplaintStats = () => {
  return useQuery({
    queryKey: ['complaint-stats'],
    queryFn: async (): Promise<ComplaintStats> => {
      const { data, error } = await supabase
        .from('complaints')
        .select('status');
      
      if (error) throw error;
      
      const stats = {
        total_complaints: data?.length || 0,
        resolved_count: data?.filter(c => c.status === 'resolved').length || 0,
        pending_count: data?.filter(c => c.status === 'pending').length || 0,
        in_progress_count: data?.filter(c => c.status === 'in_progress').length || 0,
        resolution_rate: 0
      };
      
      stats.resolution_rate = stats.total_complaints > 0 
        ? Math.round(stats.resolved_count * 100 / stats.total_complaints * 10) / 10
        : 0;
        
      return stats;
    },
  });
};

export const useStateComplaintData = () => {
  return useQuery({
    queryKey: ['state-complaint-data'],
    queryFn: async (): Promise<StateComplaintData[]> => {
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          state_id,
          states (
            name
          )
        `);
      
      if (error) throw error;
      
      const stateGroups = data?.reduce((acc: Record<string, number>, complaint: any) => {
        const stateName = complaint.states?.name || 'Unknown';
        acc[stateName] = (acc[stateName] || 0) + 1;
        return acc;
      }, {}) || {};
      
      const result = Object.entries(stateGroups)
        .map(([state_name, complaint_count]) => ({ state_name, complaint_count }))
        .sort((a, b) => b.complaint_count - a.complaint_count)
        .slice(0, 5);
        
      return result;
    },
  });
};

export const useWeeklyComplaintData = () => {
  return useQuery({
    queryKey: ['weekly-complaint-data'],
    queryFn: async (): Promise<WeeklyData[]> => {
      const { data, error } = await supabase
        .from('complaints')
        .select('created_at, resolved_at')
        .gte('created_at', new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      
      const weeklyGroups: Record<string, { total: number, resolved: number }> = {};
      
      data?.forEach(complaint => {
        const weekStart = new Date(complaint.created_at);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyGroups[weekKey]) {
          weeklyGroups[weekKey] = { total: 0, resolved: 0 };
        }
        
        weeklyGroups[weekKey].total++;
        if (complaint.resolved_at) {
          weeklyGroups[weekKey].resolved++;
        }
      });
      
      const result = Object.entries(weeklyGroups)
        .map(([week_start, counts]) => ({
          week_start,
          total_complaints: counts.total,
          resolved_complaints: counts.resolved
        }))
        .sort((a, b) => a.week_start.localeCompare(b.week_start));
        
      return result;
    },
  });
};