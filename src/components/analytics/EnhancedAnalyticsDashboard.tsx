
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  Zap, 
  Target,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTemplates } from '@/hooks/use-templates';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const EnhancedAnalyticsDashboard: React.FC = () => {
  const { session } = useAuth();
  const { customTemplates, isLoading } = useTemplates();
  const { getAnalytics } = useAnalytics();
  const { isOnline, lastSaved } = useOfflineStorage();
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    const data = getAnalytics();
    setAnalyticsData(data);
  }, [getAnalytics]);

  // Calculate enhanced metrics
  const totalTemplates = customTemplates.length;
  const recentTemplates = customTemplates.filter(template => {
    const createdDate = new Date(template.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return createdDate > sevenDaysAgo;
  }).length;

  const averageBlocksPerTemplate = totalTemplates > 0 
    ? Math.round(customTemplates.reduce((sum, template) => sum + template.blocks.length, 0) / totalTemplates)
    : 0;

  // Performance metrics
  const performanceScore = isOnline ? 95 : 75; // Simulated performance score
  const cacheHitRate = 87; // Simulated cache hit rate

  // Prepare chart data
  const chartData = analyticsData ? Object.entries(analyticsData.eventCounts).map(([event, count]) => ({
    event: event.replace(/([A-Z])/g, ' $1').trim(),
    count,
  })) : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="glass border-white/20 animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-white/20 rounded w-20"></div>
              <div className="h-4 w-4 bg-white/20 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-white/20 rounded w-16 mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const enhancedAnalyticsCards = [
    {
      title: "Total Templates",
      value: totalTemplates,
      description: "Templates created",
      icon: FileText,
      change: recentTemplates > 0 ? `+${recentTemplates} this week` : "No new templates this week",
      positive: recentTemplates > 0
    },
    {
      title: "Recent Activity",
      value: recentTemplates,
      description: "Templates this week",
      icon: TrendingUp,
      change: totalTemplates > 0 ? "Keep building!" : "Start creating templates",
      positive: true
    },
    {
      title: "Avg Complexity",
      value: averageBlocksPerTemplate,
      description: "Blocks per template",
      icon: BarChart3,
      change: averageBlocksPerTemplate > 3 ? "High complexity" : "Simple templates",
      positive: averageBlocksPerTemplate > 0
    },
    {
      title: "Connection Status",
      value: isOnline ? "Online" : "Offline",
      description: isOnline ? "Real-time sync" : "Offline mode",
      icon: isOnline ? Wifi : WifiOff,
      change: isOnline ? "All features available" : "Limited functionality",
      positive: isOnline
    },
    {
      title: "Performance Score",
      value: `${performanceScore}%`,
      description: "App performance",
      icon: Zap,
      change: performanceScore > 90 ? "Excellent" : "Good",
      positive: performanceScore > 80
    },
    {
      title: "Cache Hit Rate",
      value: `${cacheHitRate}%`,
      description: "Loading efficiency",
      icon: Target,
      change: cacheHitRate > 80 ? "Optimized" : "Needs improvement",
      positive: cacheHitRate > 70
    },
    {
      title: "Events Tracked",
      value: analyticsData?.totalEvents || 0,
      description: "User interactions",
      icon: Users,
      change: `${analyticsData?.uniqueEvents || 0} unique events`,
      positive: true
    },
    {
      title: "Last Auto-Save",
      value: lastSaved ? "Saved" : "None",
      description: lastSaved ? new Date(lastSaved).toLocaleTimeString() : "No drafts",
      icon: Clock,
      change: lastSaved ? "Draft protected" : "Start building to auto-save",
      positive: !!lastSaved
    }
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {enhancedAnalyticsCards.map((card, index) => (
          <Card key={index} className="glass border-white/20 hover:border-white/30 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.positive ? 'text-green-400' : 'text-orange-400'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">
                {card.value}
              </div>
              <p className="text-xs text-white/60 mb-2">
                {card.description}
              </p>
              <Badge 
                variant={card.positive ? "default" : "secondary"}
                className={`text-xs ${
                  card.positive 
                    ? "bg-green-500/20 text-green-300 border-green-500/30" 
                    : "bg-orange-500/20 text-orange-300 border-orange-500/30"
                }`}
              >
                {card.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-white/80 mb-2">
                <span>App Performance</span>
                <span>{performanceScore}%</span>
              </div>
              <Progress value={performanceScore} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm text-white/80 mb-2">
                <span>Cache Efficiency</span>
                <span>{cacheHitRate}%</span>
              </div>
              <Progress value={cacheHitRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm text-white/80 mb-2">
                <span>User Experience</span>
                <span>{isOnline ? '100' : '60'}%</span>
              </div>
              <Progress value={isOnline ? 100 : 60} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Event Activity Chart */}
        {chartData.length > 0 && (
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                User Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: {
                    label: "Events",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="event" fontSize={12} />
                    <YAxis fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Templates with Enhanced Info */}
      {totalTemplates > 0 && (
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customTemplates.slice(0, 5).map((template, index) => (
                <div key={template.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{template.name}</h4>
                    <p className="text-white/60 text-sm">
                      {template.blocks.length} blocks • Created {new Date(template.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-white/20 text-white/80">
                      #{index + 1}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`border-white/20 ${
                        template.blocks.length > 5 ? 'text-violet-300' : 'text-green-300'
                      }`}
                    >
                      {template.blocks.length > 5 ? 'Complex' : 'Simple'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {totalTemplates === 0 && (
        <Card className="glass border-white/20">
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Templates Yet</h3>
            <p className="text-white/60 mb-4">
              Start building your first prompt template to see detailed analytics and insights.
            </p>
            <Badge variant="outline" className="border-white/20 text-white/80">
              Go to Builder to get started
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
