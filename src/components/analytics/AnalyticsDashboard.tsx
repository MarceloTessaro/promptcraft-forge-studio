
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTemplates } from '@/hooks/use-templates';

const AnalyticsDashboard: React.FC = () => {
  const { session } = useAuth();
  const { customTemplates, isLoading } = useTemplates();

  // Calculate basic analytics from available data
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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

  const analyticsCards = [
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
      title: "User Status",
      value: session ? "Logged In" : "Guest",
      description: session ? "Data synced" : "Local storage",
      icon: Users,
      change: session ? "Cloud backup active" : "Sign in to sync",
      positive: !!session
    }
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => (
          <Card key={index} className="glass border-white/20 hover:border-white/30 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-white/60" />
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

      {/* Recent Templates */}
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
                  <div>
                    <h4 className="text-white font-medium">{template.name}</h4>
                    <p className="text-white/60 text-sm">
                      {template.blocks.length} blocks • Created {new Date(template.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-white/20 text-white/80">
                    #{index + 1}
                  </Badge>
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
              Start building your first prompt template to see analytics and insights.
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

export default AnalyticsDashboard;
