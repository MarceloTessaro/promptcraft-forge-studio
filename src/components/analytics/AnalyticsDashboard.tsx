
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Share2,
  Eye,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

interface AnalyticsData {
  totalTemplates: number;
  totalShares: number;
  totalViews: number;
  recentActivity: Array<{
    date: string;
    templates: number;
    shares: number;
  }>;
  blockTypeUsage: Array<{
    type: string;
    count: number;
    color: string;
  }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      // Fetch user templates
      const { data: templates, error: templatesError } = await supabase
        .from('custom_templates')
        .select('*')
        .eq('user_id', user.id);

      if (templatesError) throw templatesError;

      // Calculate analytics
      const totalTemplates = templates?.length || 0;
      const totalShares = templates?.filter(t => t.is_public).length || 0;
      const totalViews = templates?.reduce((sum, t) => sum + (t.view_count || 0), 0) || 0;

      // Analyze block type usage
      const blockTypeCount: Record<string, number> = {};
      templates?.forEach(template => {
        const blocks = template.prompt as any[];
        blocks?.forEach(block => {
          blockTypeCount[block.type] = (blockTypeCount[block.type] || 0) + 1;
        });
      });

      const blockTypeUsage = Object.entries(blockTypeCount).map(([type, count], index) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count,
        color: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'][index % 5],
      }));

      // Generate recent activity (mock data for demo)
      const recentActivity = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
          templates: Math.floor(Math.random() * 5),
          shares: Math.floor(Math.random() * 3),
        };
      });

      setAnalytics({
        totalTemplates,
        totalShares,
        totalViews,
        recentActivity,
        blockTypeUsage,
      });

      logger.info('Analytics fetched', 'AnalyticsDashboard');
    } catch (error) {
      logger.error('Error fetching analytics', 'AnalyticsDashboard', { error });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Sign in to view your analytics</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">No analytics data available</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Templates',
      value: analytics.totalTemplates,
      icon: FileText,
      color: 'text-blue-400',
    },
    {
      title: 'Shared Templates',
      value: analytics.totalShares,
      icon: Share2,
      color: 'text-green-400',
    },
    {
      title: 'Total Views',
      value: analytics.totalViews,
      icon: Eye,
      color: 'text-purple-400',
    },
    {
      title: 'This Week',
      value: analytics.recentActivity.reduce((sum, day) => sum + day.templates, 0),
      icon: Calendar,
      color: 'text-orange-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.recentActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="templates" fill="#8B5CF6" />
                <Bar dataKey="shares" fill="#06B6D4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Block Type Usage */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Block Type Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.blockTypeUsage.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie
                        data={analytics.blockTypeUsage}
                        cx="50%"
                        cy="50%"
                        outerRadius={50}
                        dataKey="count"
                      >
                        {analytics.blockTypeUsage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2">
                    {analytics.blockTypeUsage.map((item) => (
                      <div key={item.type} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <Badge variant="secondary" className="text-xs">
                          {item.type}: {item.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-white/60 text-center">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
