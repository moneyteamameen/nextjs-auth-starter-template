"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import Link from "next/link";
import Header from "../components/Header";
import MetricCard from "../components/dashboard/MetricCard";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import QuickActions from "../components/dashboard/QuickActions";
import ProcessingProgress from "../components/dashboard/ProcessingProgress";
import { FolderKanban, FileText, BarChart4, Percent, ArrowRight } from "lucide-react";

interface Task {
  id: number;
  name: string;
  user_id: string;
}

export default function Dashboard() {
  const { user, supabase, isLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const [markdownFiles, setMarkdownFiles] = useState<File[]>([]);
  const [combinedMarkdown, setCombinedMarkdown] = useState<string>("");

  // Mock data for the dashboard
  const [metrics] = useState({
    totalProjects: 12,
    documentsProcessed: 156,
    reportsGenerated: 28,
    completionRate: 87
  });

  const [activities] = useState([
    {
      id: '1',
      type: 'document_upload' as const,
      title: 'Documents Uploaded',
      description: '5 new documents uploaded to Project Alpha',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      project: 'Project Alpha'
    },
    {
      id: '2',
      type: 'document_processed' as const,
      title: 'Documents Processed',
      description: '3 documents processed successfully',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      project: 'Project Beta'
    },
    {
      id: '3',
      type: 'report_generated' as const,
      title: 'Report Generated',
      description: 'Construction analysis report #CR-2023-0045 generated',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      project: 'Project Alpha'
    },
    {
      id: '4',
      type: 'processing_error' as const,
      title: 'Processing Error',
      description: 'Failed to process document "site-plan-v2.pdf"',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      project: 'Project Gamma'
    },
    {
      id: '5',
      type: 'processing_complete' as const,
      title: 'Processing Complete',
      description: 'All documents in batch #BD-2023-072 processed',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      project: 'Project Delta'
    }
  ]);

  const [processingItems] = useState([
    {
      id: 'proc1',
      name: 'Project Alpha - Construction Drawings',
      progress: 72,
      status: 'processing' as const,
      estimatedCompletion: new Date(Date.now() + 45 * 60 * 1000) // 45 minutes from now
    },
    {
      id: 'proc2',
      name: 'Project Beta - Specifications',
      progress: 100,
      status: 'completed' as const
    },
    {
      id: 'proc3',
      name: 'Project Gamma - Site Plans',
      progress: 0,
      status: 'queued' as const
    },
    {
      id: 'proc4',
      name: 'Project Delta - Electrical Drawings',
      progress: 34,
      status: 'processing' as const,
      estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
    }
  ]);

  // Load tasks when Supabase client is ready
  useEffect(() => {
    if (!user || !supabase) return;

    async function loadTasks() {
      setIsTasksLoading(true);
      try {
        const { data, error } = await supabase.from("tasks").select("*");
        
        if (error) {
          console.error("Error loading tasks:", error);
          return;
        }
        
        setTasks(data || []);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        setIsTasksLoading(false);
      }
    }

    loadTasks();
  }, [user, supabase]);

  // Handle markdown file upload
  const handleMarkdownUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMarkdownFiles(Array.from(e.target.files));
    }
  };

  // Combine markdown files into one
  const combineMarkdownFiles = async () => {
    if (markdownFiles.length === 0) return;
    
    let combined = "";
    
    for (const file of markdownFiles) {
      const content = await file.text();
      combined += `# ${file.name}\n\n${content}\n\n`;
    }
    
    setCombinedMarkdown(combined);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background-primary">
        <div className="animate-pulse flex items-center">
          <div className="h-12 w-12 bg-accent-secondary"></div>
          <div className="h-2 w-24 bg-text-secondary ml-4"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background-primary">
        <div className="text-center max-w-md">
          <div className="bg-accent-primary p-4 inline-block mb-6">
            <h2 className="text-text-light font-bold text-xl">SIGN IN REQUIRED</h2>
          </div>
          <p className="text-lg mb-8 text-text-secondary">Please sign in to access your construction project dashboard</p>
          <Link href="/sign-in" className="btn-primary inline-flex items-center">
            Sign In <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-primary gridline-background h-screen text-text-primary overflow-y-auto">
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-20">
        {/* Dashboard Header */}
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-medium tracking-tight mb-2">Dashboard</h1>
            <p className="text-text-secondary text-base font-light">Monitor your projects and activities</p>
          </div>
          <div>
            <Link href="/projects/new" className="btn-secondary inline-flex items-center gap-2">
              New Project <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="card p-7 border-t-4 border-accent-primary">
            <div className="flex justify-between items-start mb-5">
              <div className="text-text-secondary text-sm font-medium">Total Projects</div>
              <FolderKanban size={22} className="text-accent-primary" />
            </div>
            <div className="text-4xl font-light mb-3 text-accent-primary">{metrics.totalProjects}</div>
            <div className="text-xs text-success font-medium">↑ 20% increase</div>
          </div>
          
          <div className="card p-7 border-t-4 border-accent-tertiary">
            <div className="flex justify-between items-start mb-5">
              <div className="text-text-secondary text-sm font-medium">Documents Processed</div>
              <FileText size={22} className="text-accent-tertiary" />
            </div>
            <div className="text-4xl font-light mb-3 text-accent-tertiary">{metrics.documentsProcessed}</div>
            <div className="text-xs text-success font-medium">↑ 12% increase</div>
          </div>
          
          <div className="card p-7 border-t-4 border-accent-secondary">
            <div className="flex justify-between items-start mb-5">
              <div className="text-text-secondary text-sm font-medium">Reports Generated</div>
              <BarChart4 size={22} className="text-accent-secondary" />
            </div>
            <div className="text-4xl font-light mb-3 text-accent-secondary">{metrics.reportsGenerated}</div>
            <div className="text-xs text-success font-medium">↑ 5% increase</div>
          </div>
          
          <div className="card p-7 border-t-4 border-accent-primary">
            <div className="flex justify-between items-start mb-5">
              <div className="text-text-secondary text-sm font-medium">Completion Rate</div>
              <Percent size={22} className="text-accent-primary" />
            </div>
            <div className="text-4xl font-light mb-3 text-accent-primary">{metrics.completionRate}%</div>
            <div className="text-xs text-success font-medium">↑ 3% increase</div>
          </div>
        </div>
        
        {/* Quick Actions Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-medium tracking-tight">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card group p-0 overflow-hidden">
              <div className="h-1.5 bg-accent-secondary w-full"></div>
              <div className="p-7">
                <h3 className="text-lg font-medium mb-3 text-accent-primary">Upload Documents</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-5">Upload and process new construction documents</p>
                <Link href="/document-management" className="text-accent-secondary font-medium text-sm group-hover:underline flex items-center">
                  Upload Now <ArrowRight className="ml-2 group-hover:ml-3 transition-all" size={16} />
                </Link>
              </div>
            </div>
            
            <div className="card group p-0 overflow-hidden">
              <div className="h-1.5 bg-accent-tertiary w-full"></div>
              <div className="p-7">
                <h3 className="text-lg font-medium mb-3 text-accent-primary">Generate Report</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-5">Create new reports from your processed documents</p>
                <Link href="/reports/generate" className="text-accent-tertiary font-medium text-sm group-hover:underline flex items-center">
                  Generate <ArrowRight className="ml-2 group-hover:ml-3 transition-all" size={16} />
                </Link>
              </div>
            </div>
            
            <div className="card group p-0 overflow-hidden">
              <div className="h-1.5 bg-accent-primary w-full"></div>
              <div className="p-7">
                <h3 className="text-lg font-medium mb-3 text-accent-primary">Manage Projects</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-5">View and manage your construction projects</p>
                <Link href="/projects" className="text-accent-primary font-medium text-sm group-hover:underline flex items-center">
                  View Projects <ArrowRight className="ml-2 group-hover:ml-3 transition-all" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Processing Progress - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="card p-7 mb-6">
              <h2 className="text-xl font-medium tracking-tight mb-8">Processing Status</h2>
              <div className="space-y-8">
                {processingItems.map(item => (
                  <div key={item.id} className="border-l-3 pl-5" style={{
                    borderColor: item.status === 'processing' ? '#ED6A2E' : 
                                item.status === 'completed' ? '#10b981' : 
                                '#64748b'
                  }}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-accent-primary text-base">{item.name}</h3>
                        <div className="text-xs text-text-secondary mt-0.5">
                          {item.status === 'processing' ? 'Processing...' : 
                           item.status === 'completed' ? 'Completed' : 
                           'Queued'}
                        </div>
                      </div>
                      <div className="text-sm font-medium" style={{
                        color: item.status === 'processing' ? '#ED6A2E' : 
                               item.status === 'completed' ? '#10b981' : 
                               '#64748b'
                      }}>
                        {item.progress}%
                      </div>
                    </div>
                    <div className="w-full bg-background-accent rounded-none h-1.5">
                      <div 
                        className="h-full transition-all duration-500" 
                        style={{
                          width: `${item.progress}%`,
                          backgroundColor: item.status === 'processing' ? '#ED6A2E' : 
                                          item.status === 'completed' ? '#10b981' : 
                                          '#64748b'
                        }}
                      ></div>
                    </div>
                    {item.estimatedCompletion && (
                      <div className="text-xs text-text-secondary mt-2">
                        Est. completion: {item.estimatedCompletion.toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Activity Feed - Takes 1 column */}
          <div>
            <div className="card p-7">
              <h2 className="text-xl font-medium tracking-tight mb-8">Recent Activity</h2>
              <div className="space-y-8">
                {activities.map(activity => (
                  <div key={activity.id} className="group">
                    <div className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary mt-2 mr-3.5 group-hover:scale-150 transition-transform"></div>
                      <div>
                        <h3 className="font-medium text-accent-primary text-base">{activity.title}</h3>
                        <p className="text-text-primary text-sm mt-1 mb-2">{activity.description}</p>
                        <div className="text-xs text-text-secondary flex justify-between">
                          <span>{activity.project}</span>
                          <span>{formatTimeAgo(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-5 border-t border-border-light">
                <Link href="/activities" className="text-accent-secondary font-medium text-sm hover:underline flex items-center justify-center">
                  View All Activities <ArrowRight className="ml-2" size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Format time ago helper
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
}
