import { useState, useEffect } from 'react';
import { 
  Trophy, BookOpen, AlertCircle, Gamepad2, Megaphone, X, Calendar, MapPin, Award, 
  Plus, Edit, Trash2, Search, SlidersHorizontal, Briefcase 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NoticeItem {
  id: number;
  type: string;
  title: string;
  desc: string;
  timestamp: string;
  icon: any;
  iconName: string;
  color: string;
  image: string;
  venue?: string;
  date?: string;
  prizes?: string[];
  fullDesc?: string;
  collegeName: string;
  category?: 'Academic' | 'Examination' | 'Holiday' | 'Event' | 'Placement' | 'General';
  priority?: 'Normal' | 'Important' | 'Urgent';
  createdAt?: number;
}

function TerminalIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  );
}

export function NoticeBoard() {
  const { user } = useAuth();
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [notices, setNotices] = useState<NoticeItem[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [noticeToEdit, setNoticeToEdit] = useState<NoticeItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<NoticeItem | null>(null);

  // Form State & Validation
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formVenue, setFormVenue] = useState('');
  const [formPriority, setFormPriority] = useState<'Normal' | 'Important' | 'Urgent'>('Normal');
  const [formCategory, setFormCategory] = useState<'Academic' | 'Examination' | 'Holiday' | 'Event' | 'Placement' | 'General'>('Academic');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const loadNotices = () => {
    if (user) {
      const dbNotices = JSON.parse(localStorage.getItem('noticesDB') || '[]');
      const filtered = dbNotices.filter((n: any) => n.collegeName === user.collegeName);
      
      const iconMap: Record<string, any> = {
        BookOpen,
        TerminalIcon,
        Gamepad2,
        Trophy,
        AlertCircle,
        Calendar,
        Award,
        Megaphone,
        Briefcase
      };

      const mapped = filtered.map((n: any) => ({
        ...n,
        icon: iconMap[n.iconName] || AlertCircle
      }));

      // Sort by createdAt descending (latest first)
      mapped.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));

      setNotices(mapped);
    }
  };

  useEffect(() => {
    loadNotices();
  }, [user]);

  // Handle open modals
  const handleOpenAddModal = () => {
    setFormTitle('');
    setFormDesc('');
    setFormFullDesc('');
    setFormDate('');
    setFormVenue('');
    setFormPriority('Normal');
    setFormCategory('Academic');
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (notice: NoticeItem) => {
    setNoticeToEdit(notice);
    setFormTitle(notice.title);
    setFormDesc(notice.desc);
    setFormFullDesc(notice.fullDesc || '');
    setFormDate(notice.date || '');
    setFormVenue(notice.venue || '');
    setFormPriority(notice.priority || 'Normal');
    setFormCategory(notice.category || 'Academic');
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (notice: NoticeItem) => {
    setNoticeToDelete(notice);
    setIsDeleteModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formTitle.trim()) {
      errors.title = 'Notice Title is required';
    } else if (formTitle.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    
    if (!formDesc.trim()) {
      errors.desc = 'Brief Description is required';
    } else if (formDesc.trim().length < 10) {
      errors.desc = 'Brief Description must be at least 10 characters';
    }

    if (!formDate.trim()) {
      errors.date = 'Date is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add Notice action
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const dbNotices = JSON.parse(localStorage.getItem('noticesDB') || '[]');
    const newId = Math.max(...dbNotices.map((n: any) => n.id), 0) + 1;

    const CATEGORY_IMAGES = {
      Academic: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
      Examination: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
      Holiday: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
      Event: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
      Placement: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
      General: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop'
    };

    const CATEGORY_ICONS = {
      Academic: 'BookOpen',
      Examination: 'AlertCircle',
      Holiday: 'Gamepad2',
      Event: 'Trophy',
      Placement: 'BookOpen',
      General: 'AlertCircle'
    };

    const CATEGORY_COLORS = {
      Academic: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      Examination: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      Holiday: 'bg-green-500/20 text-green-400 border-green-500/30',
      Event: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      Placement: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      General: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };

    const now = new Date();
    const timestampStr = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const newNotice = {
      id: newId,
      type: formCategory,
      title: formTitle,
      desc: formDesc,
      fullDesc: formFullDesc,
      timestamp: timestampStr,
      iconName: CATEGORY_ICONS[formCategory],
      color: CATEGORY_COLORS[formCategory],
      image: CATEGORY_IMAGES[formCategory],
      venue: formVenue,
      date: formDate,
      collegeName: user?.collegeName,
      category: formCategory,
      priority: formPriority,
      createdAt: Date.now()
    };

    dbNotices.push(newNotice);
    localStorage.setItem('noticesDB', JSON.stringify(dbNotices));
    setIsAddModalOpen(false);
    loadNotices();
  };

  // Edit Notice action
  const handleEditNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !noticeToEdit) return;

    const dbNotices = JSON.parse(localStorage.getItem('noticesDB') || '[]');
    const index = dbNotices.findIndex((n: any) => n.id === noticeToEdit.id);

    if (index !== -1) {
      const CATEGORY_IMAGES = {
        Academic: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
        Examination: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
        Holiday: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
        Event: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
        Placement: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
        General: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop'
      };

      const CATEGORY_ICONS = {
        Academic: 'BookOpen',
        Examination: 'AlertCircle',
        Holiday: 'Gamepad2',
        Event: 'Trophy',
        Placement: 'BookOpen',
        General: 'AlertCircle'
      };

      const CATEGORY_COLORS = {
        Academic: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        Examination: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        Holiday: 'bg-green-500/20 text-green-400 border-green-500/30',
        Event: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        Placement: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        General: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      };

      dbNotices[index] = {
        ...dbNotices[index],
        title: formTitle,
        desc: formDesc,
        fullDesc: formFullDesc,
        venue: formVenue,
        date: formDate,
        category: formCategory,
        type: formCategory, // fallback
        priority: formPriority,
        iconName: CATEGORY_ICONS[formCategory],
        color: CATEGORY_COLORS[formCategory],
        image: CATEGORY_IMAGES[formCategory]
      };

      localStorage.setItem('noticesDB', JSON.stringify(dbNotices));
      setIsEditModalOpen(false);
      setNoticeToEdit(null);
      loadNotices();
    }
  };

  // Delete Notice action
  const handleDeleteNotice = () => {
    if (!noticeToDelete) return;

    const dbNotices = JSON.parse(localStorage.getItem('noticesDB') || '[]');
    const filtered = dbNotices.filter((n: any) => n.id !== noticeToDelete.id);

    localStorage.setItem('noticesDB', JSON.stringify(filtered));
    setIsDeleteModalOpen(false);
    setNoticeToDelete(null);
    loadNotices();
  };

  // Filter Notices
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      notice.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notice.fullDesc && notice.fullDesc.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const noticeCategory = notice.category || notice.type;
    const matchesCategory = 
      categoryFilter === 'All' || 
      noticeCategory?.toLowerCase() === categoryFilter.toLowerCase();
    
    const noticePriority = notice.priority || 'Normal';
    const matchesPriority = 
      priorityFilter === 'All' || 
      noticePriority.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityBadgeClass = (priority?: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30 ring-1 ring-red-500/50';
      case 'Important':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-5xl mx-auto relative">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Megaphone className="text-primary" size={28} /> Notice Board
          </h1>
          <p className="text-gray-400 mt-1">Latest university circulars, exam timetables, and academic announcements.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3 text-gray-500" size={18} />
          <input 
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        
        <div className="flex flex-wrap w-full md:w-auto gap-3 items-center justify-end">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
            <SlidersHorizontal size={14} className="text-primary" /> Filter By
          </div>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-primary/50 cursor-pointer min-w-[130px]"
          >
            <option value="All">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Examination">Examination</option>
            <option value="Holiday">Holiday</option>
            <option value="Event">Event</option>
            <option value="Placement">Placement</option>
            <option value="General">General</option>
          </select>

          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-primary/50 cursor-pointer min-w-[130px]"
          >
            <option value="All">All Priorities</option>
            <option value="Normal">Normal</option>
            <option value="Important">Important</option>
            <option value="Urgent">Urgent</option>
          </select>

          {user?.role === 'Admin' && (
            <button
              onClick={handleOpenAddModal}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-black font-semibold rounded-xl hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-300 active:scale-95"
            >
              <Plus size={18} /> Add Notice
            </button>
          )}
        </div>
      </div>

      {/* Notices List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredNotices.map((notice) => {
          const isUrgent = notice.priority === 'Urgent';
          return (
            <div 
              key={notice.id} 
              className={`glass-card overflow-hidden flex flex-col md:flex-row group transition-all duration-300 ${
                isUrgent 
                  ? 'border-red-500/30 shadow-[0_0_25px_rgba(239,68,68,0.1)] hover:border-red-500/50 hover:shadow-[0_0_35px_rgba(239,68,68,0.15)] ring-1 ring-red-500/10' 
                  : 'hover:shadow-[0_8px_30px_rgba(34,211,238,0.1)] hover:border-white/10'
              }`}
            >
              {/* Notice Image */}
              <div className="md:w-64 h-48 md:h-auto overflow-hidden shrink-0 relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                <img 
                  src={notice.image} 
                  alt={notice.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                {isUrgent && (
                  <div className="absolute top-3 left-3 z-20 bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-[0_2px_8px_rgba(239,68,68,0.5)] tracking-widest uppercase animate-pulse">
                    Urgent
                  </div>
                )}
              </div>
              
              {/* Notice Content */}
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {/* Category Badge */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${notice.color}`}>
                      <notice.icon size={13} /> {notice.category || notice.type}
                    </span>
                    
                    {/* Priority Badge */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getPriorityBadgeClass(notice.priority)}`}>
                      {notice.priority || 'Normal'}
                    </span>
                  </div>

                  <span className="text-xs text-gray-500 flex items-center gap-1 font-medium bg-white/5 px-2 py-1 rounded border border-white/5">
                    Published: {notice.timestamp}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors leading-tight">
                  {notice.title}
                </h2>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {notice.desc}
                </p>
                
                <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/5 pt-4">
                  <button 
                    onClick={() => setSelectedNotice(notice)}
                    className="text-sm font-semibold text-primary hover:text-white transition-colors flex items-center gap-2"
                  >
                    Read Full Details &rarr;
                  </button>

                  {/* Admin actions inside notices list */}
                  {user?.role === 'Admin' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenEditModal(notice)}
                        className="p-2 bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary rounded-xl transition-colors border border-white/5 hover:border-primary/20"
                        title="Edit Notice"
                      >
                        <Edit size={15} />
                      </button>
                      <button 
                        onClick={() => handleOpenDeleteModal(notice)}
                        className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-xl transition-colors border border-white/5 hover:border-red-500/20"
                        title="Delete Notice"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredNotices.length === 0 && (
          <div className="glass-card p-12 text-center text-gray-400">
            No notices match your filters or search query.
          </div>
        )}
      </div>

      {/* Details View Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:pl-[18rem] md:pr-6 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
           <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[90vh] rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative animate-in slide-in-from-right-8 fade-in duration-500">
              <button 
                 onClick={() => setSelectedNotice(null)} 
                 className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                 <X size={24} />
              </button>
              
              <div className="h-48 md:h-64 relative shrink-0">
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>
                 <img src={selectedNotice.image} alt={selectedNotice.title} className="w-full h-full object-cover" />
                 <div className="absolute bottom-6 left-6 z-20">
                    <div className="flex gap-2 mb-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${selectedNotice.color} bg-black/50 backdrop-blur-md`}>
                        <selectedNotice.icon size={14} /> {selectedNotice.category || selectedNotice.type}
                      </span>
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${getPriorityBadgeClass(selectedNotice.priority)} bg-black/50 backdrop-blur-md`}>
                        {selectedNotice.priority || 'Normal'}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight max-w-2xl">{selectedNotice.title}</h2>
                 </div>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto flex-1 flex flex-col md:flex-row gap-8">
                 <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="p-2 bg-primary/10 text-primary rounded-lg"><Calendar size={20}/></div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Date & Time</p>
                            <p className="text-sm text-gray-200 mt-0.5">{selectedNotice.date || "Not Specified"}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="p-2 bg-primary/10 text-primary rounded-lg"><MapPin size={20}/></div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Venue</p>
                            <p className="text-sm text-gray-200 mt-0.5">{selectedNotice.venue || "Not Specified"}</p>
                          </div>
                       </div>
                    </div>
                    
                    <div>
                       <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">Notice Description</h3>
                       <p className="text-gray-300 leading-relaxed max-w-prose text-sm md:text-base whitespace-pre-line">
                         {selectedNotice.fullDesc || selectedNotice.desc}
                       </p>
                    </div>
                 </div>
                 
                 {selectedNotice.prizes && (
                    <div className="md:w-72 shrink-0">
                       <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10">
                          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Award className="text-amber-400" size={18}/> Tournament Prizes</h3>
                          <ul className="space-y-4 text-sm mt-4">
                             {selectedNotice.prizes.map((prize, idx) => (
                               <li key={idx} className="flex gap-3">
                                 <div className={`flex w-6 h-6 items-center justify-center font-bold outline outline-1 outline-white/10 rounded-full shrink-0 ${idx === 0 ? 'bg-amber-400 text-black outline-none shadow-[0_0_10px_rgba(251,191,36,0.3)]' : idx === 1 ? 'bg-gray-300 text-black outline-none' : idx === 2 ? 'bg-amber-700 text-white outline-none' : 'bg-white/10 text-gray-300'}`}>
                                   {idx + 1}
                                 </div>
                                 <span className={idx === 0 ? 'text-amber-400 font-semibold' : 'text-gray-300'}>{prize}</span>
                               </li>
                             ))}
                          </ul>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Add / Edit Notice Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setNoticeToEdit(null);
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Megaphone className="text-primary" size={20} />
                {isAddModalOpen ? 'Add New Notice' : 'Edit Notice'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isAddModalOpen 
                  ? 'Publish a new notice to this college\'s Notice Board.' 
                  : 'Modify notice details. Changes will synchronize immediately.'}
              </p>
            </div>

            <form onSubmit={isAddModalOpen ? handleAddNotice : handleEditNotice} className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
              
              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e: any) => setFormCategory(e.target.value)}
                    className="bg-[#0d0d0d] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors w-full cursor-pointer"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Examination">Examination</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Event">Event</option>
                    <option value="Placement">Placement</option>
                    <option value="General">General</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e: any) => setFormPriority(e.target.value)}
                    className="bg-[#0d0d0d] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors w-full cursor-pointer"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notice Title *</label>
                <input
                  type="text"
                  placeholder="Enter notice title..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors ${formErrors.title ? 'border-red-500/50' : 'border-white/10'}`}
                />
                {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
              </div>

              {/* Date & Venue */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date / Deadline *</label>
                  <input
                    type="text"
                    placeholder="e.g., July 15, 2026"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors ${formErrors.date ? 'border-red-500/50' : 'border-white/10'}`}
                  />
                  {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Venue (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Campus Auditorium"
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Brief Summary *</label>
                <textarea
                  rows={2}
                  placeholder="Enter brief description for list view..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors resize-none ${formErrors.desc ? 'border-red-500/50' : 'border-white/10'}`}
                />
                {formErrors.desc && <p className="text-red-500 text-xs mt-1">{formErrors.desc}</p>}
              </div>

              {/* Full Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Detailed Notice</label>
                <textarea
                  rows={4}
                  placeholder="Enter detailed notice paragraphs..."
                  value={formFullDesc}
                  onChange={(e) => setFormFullDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setNoticeToEdit(null);
                  }}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-black font-semibold rounded-xl hover:bg-cyan-400 transition-all duration-300"
                >
                  {isAddModalOpen ? 'Publish Notice' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && noticeToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-[0_30px_100px_rgba(0,0,0,0.9)] space-y-4">
            <h3 className="text-lg font-bold text-white">Delete Notice</h3>
            <p className="text-gray-400 text-sm">
              Are you sure you want to delete the notice <strong className="text-white">"{noticeToDelete.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setNoticeToDelete(null);
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteNotice}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors text-sm font-semibold shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                Delete Notice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
