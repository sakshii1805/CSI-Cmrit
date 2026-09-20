import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Bell,
  Image as ImageIcon,
  MessageSquare,
  Users,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  ExternalLink,
  Menu,
  Lightbulb,
  Camera,
  InboxIcon
} from 'lucide-react';
import { mockAdminStats, mockRecentApplications, mockPendingComments } from '../data/adminMock';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import { LogoMark } from '../components/common/Logo';

type AdminTab = 'dashboard' | 'events' | 'announcements' | 'highlights' | 'sih' | 'comments' | 'applications';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleAction = (actionName: string) => {
    showToast(`"${actionName}" will be available after backend integration.`, 'info');
  };

  const handleLogout = () => {
    showToast('Logged out of admin session.', 'info');
    navigate('/admin/login');
  };

  const sidebarLinks: { id: AdminTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" />, count: mockAdminStats.totalEvents },
    { id: 'announcements', label: 'Announcements', icon: <Bell className="w-4 h-4" />, count: mockAdminStats.totalAnnouncements },
    { id: 'highlights', label: 'Gallery', icon: <Camera className="w-4 h-4" />, count: mockAdminStats.galleryImages },
    { id: 'sih', label: 'SIH', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'comments', label: 'Comments', icon: <MessageSquare className="w-4 h-4" />, count: mockAdminStats.pendingComments },
    { id: 'applications', label: 'Join Applications', icon: <Users className="w-4 h-4" />, count: mockAdminStats.totalApplications },
  ];

  const EmptyTableState = ({ message }: { message: string }) => (
    <tr>
      <td colSpan={10} className="px-5 py-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <InboxIcon className="w-8 h-8 text-slate-300" />
          <p className="text-sm text-slate-500 font-medium">{message}</p>
          <p className="text-xs text-slate-400">Items will appear here once published.</p>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <LogoMark size={32} />
          <span className="font-bold text-sm">CSI CMRIT Admin</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800/80 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <LogoMark size={36} />
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">CSI CMRIT</h2>
              <span className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold block">
                Admin Console
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Content Management
          </div>

          {sidebarLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                  >
                    {link.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Return to Public Website & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 flex flex-col overflow-y-auto min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 capitalize">
              {activeTab === 'dashboard' ? 'Dashboard Overview'
                : activeTab === 'highlights' ? 'Gallery'
                  : activeTab === 'applications' ? 'Join Applications'
                    : activeTab}
            </h1>
            <p className="text-xs text-slate-500">
              CSI CMRIT Chapter Administration Console
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Frontend Only — Backend Pending
            </span>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-6 space-y-8 flex-1">

          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Events</span>
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{mockAdminStats.totalEvents}</div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">Published</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Announcements</span>
                <Bell className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{mockAdminStats.totalAnnouncements}</div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">Published</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Gallery</span>
                <Camera className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{mockAdminStats.galleryImages}</div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">Photos uploaded</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Comments</span>
                <MessageSquare className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{mockAdminStats.pendingComments}</div>
              <div className="text-[11px] text-amber-600 font-medium mt-1">Pending review</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Applications</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{mockAdminStats.totalApplications}</div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">Join requests</div>
            </div>
          </div>

          {/* Events Table */}
          {(activeTab === 'dashboard' || activeTab === 'events') && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Events Management</h3>
                  <p className="text-xs text-slate-500">Add, edit, and publish events for the public website</p>
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => handleAction('Add Event')}
                >
                  Add Event
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="px-5 py-3">Event Title</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <EmptyTableState message="No events added yet" />
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Announcements Table */}
          {(activeTab === 'dashboard' || activeTab === 'announcements') && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Announcements Management</h3>
                  <p className="text-xs text-slate-500">Create and publish official notices and circulars</p>
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => handleAction('New Announcement')}
                >
                  New Announcement
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="px-5 py-3">Title</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Published Date</th>
                      <th className="px-5 py-3">Author</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <EmptyTableState message="No announcements published yet" />
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Gallery Table */}
          {(activeTab === 'dashboard' || activeTab === 'highlights') && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Gallery</h3>
                  <p className="text-xs text-slate-500">Upload and manage photos from chapter activities</p>
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => handleAction('Upload Photo')}
                >
                  Upload Photo
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="px-5 py-3">Title / Caption</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <EmptyTableState message="No gallery photos uploaded yet" />
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SIH Section */}
          {(activeTab === 'dashboard' || activeTab === 'sih') && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">SIH Updates</h3>
                  <p className="text-xs text-slate-500">Add teams, projects, achievements and SIH related updates</p>
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => handleAction('Add SIH Update')}
                >
                  Add Update
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="px-5 py-3">Title</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Year</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <EmptyTableState message="No SIH updates published yet" />
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Comments Moderation Table */}
          {(activeTab === 'dashboard' || activeTab === 'comments') && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Pending Comments & Inquiries</h3>
                <p className="text-xs text-slate-500">Review and moderate visitor comments before they are published</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="px-5 py-3">Author</th>
                      <th className="px-5 py-3">Related Post</th>
                      <th className="px-5 py-3">Comment Preview</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {mockPendingComments.length > 0 ? (
                      mockPendingComments.map((comment) => (
                        <tr key={comment.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3 font-semibold text-slate-900">
                            <div>{comment.author}</div>
                            <span className="text-[11px] text-slate-400 font-normal">{comment.email}</span>
                          </td>
                          <td className="px-5 py-3 font-medium text-blue-600">{comment.target}</td>
                          <td className="px-5 py-3 max-w-sm text-slate-600 line-clamp-2">
                            &ldquo;{comment.content}&rdquo;
                          </td>
                          <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{comment.date}</td>
                          <td className="px-5 py-3 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleAction(`Approve comment from ${comment.author}`)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold border border-emerald-200"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleAction(`Reject comment from ${comment.author}`)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold border border-rose-200"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <EmptyTableState message="No pending comments" />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Join Applications Table */}
          {(activeTab === 'dashboard' || activeTab === 'applications') && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Join Applications</h3>
                  <p className="text-xs text-slate-500">Student membership applications submitted via the Join Us form</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction('Export Applications (CSV)')}
                >
                  Export Data
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="px-5 py-3">Applicant Name</th>
                      <th className="px-5 py-3">Department & Year</th>
                      <th className="px-5 py-3">Interests</th>
                      <th className="px-5 py-3">Submitted</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {mockRecentApplications.length > 0 ? (
                      mockRecentApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3 font-semibold text-slate-900">
                            <div>{app.fullName}</div>
                            <span className="text-[11px] text-slate-400 font-normal">{app.email}</span>
                          </td>
                          <td className="px-5 py-3 text-slate-600">
                            <div>{app.branch}</div>
                            <span className="text-[11px] text-slate-400">{app.year}</span>
                          </td>
                          <td className="px-5 py-3 max-w-xs">
                            <div className="flex flex-wrap gap-1">
                              {app.interests.map((int, i) => (
                                <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                                  {int}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{app.submittedAt}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${app.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleAction(`Approve: ${app.fullName}`)}
                              className="p-1 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAction(`Reject: ${app.fullName}`)}
                              className="p-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Reject"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <EmptyTableState message="No join applications received yet" />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};