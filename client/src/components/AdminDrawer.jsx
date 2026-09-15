import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config/api';

export default function AdminDrawer({
  isOpen,
  onClose,
  onLogout,
  profile,
  projects,
  services,
  testimonials = [],
  onRefreshAll,
}) {
  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries' | 'stats' | 'work' | 'services' | 'testimonials' | 'about' | 'socials' | 'compass' | 'credentials'

  // ===================== INQUIRIES STATE =====================
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [msgError, setMsgError] = useState(null);

  // ===================== STATS STATE =====================
  const [statsForm, setStatsForm] = useState({
    experienceYears: '2+',
    projectsDelivered: '120+',
    viewsGenerated: '40M+',
    clientSatisfaction: '98%',
  });
  const [savingStats, setSavingStats] = useState(false);
  const [statsFeedback, setStatsFeedback] = useState(null);

  // ===================== WORK / PROJECTS STATE =====================
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Brand Film',
    duration: '',
    year: new Date().getFullYear().toString(),
    tag: '',
    description: '',
    videoUrl: '',
    layoutSpan: 'medium',
    gradientType: 'card-bg-1',
  });
  const [savingProject, setSavingProject] = useState(false);
  const [projectFeedback, setProjectFeedback] = useState(null);

  // ===================== SERVICES STATE =====================
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    num: '01',
    name: '',
    desc: '',
    tools: '',
  });
  const [savingService, setSavingService] = useState(false);
  const [serviceFeedback, setServiceFeedback] = useState(null);

  // ===================== TESTIMONIALS STATE =====================
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    author: '',
    role: '',
    quote: '',
    initials: '',
  });
  const [savingTestimonial, setSavingTestimonial] = useState(false);
  const [testimonialFeedback, setTestimonialFeedback] = useState(null);

  // ===================== PROFILE PICTURE STATE =====================
  const [photoInputType, setPhotoInputType] = useState('file'); // 'file' | 'url'
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [photoFeedback, setPhotoFeedback] = useState(null);
  const [confirmDeletePhoto, setConfirmDeletePhoto] = useState(false);

  // ===================== ABOUT STATE =====================
  const [aboutForm, setAboutForm] = useState({
    aboutTagline: 'The Craft Behind the Cut',
    aboutBio1: '',
    aboutBio2: '',
    newSkill: '',
    skills: [],
  });
  const [savingAbout, setSavingAbout] = useState(false);
  const [aboutFeedback, setAboutFeedback] = useState(null);

  // ===================== SOCIAL LINKS STATE =====================
  const [socialLinks, setSocialLinks] = useState([]);
  const [editingSocialIndex, setEditingSocialIndex] = useState(null);
  const [newSocial, setNewSocial] = useState({ name: '', url: '' });
  const [savingSocials, setSavingSocials] = useState(false);
  const [socialFeedback, setSocialFeedback] = useState(null);

  // ===================== CONTACT CHANNELS (CONTACT SECTION) STATE =====================
  const [contactChannels, setContactChannels] = useState([]);
  const [editingContactChannelIndex, setEditingContactChannelIndex] = useState(null);
  const [newContactChannel, setNewContactChannel] = useState({ icon: 'mail', label: '', url: '' });
  const [savingContactChannels, setSavingContactChannels] = useState(false);
  const [contactChannelFeedback, setContactChannelFeedback] = useState(null);

  // ===================== CREDENTIALS STATE =====================
  const [credentialsData, setCredentialsData] = useState(null);
  const [loadingCredentials, setLoadingCredentials] = useState(false);
  const [showCurrentMasterPassword, setShowCurrentMasterPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [credentialForm, setCredentialForm] = useState({
    currentPassword: '',
    newUsername: '',
    newEmail: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingCredentials, setSavingCredentials] = useState(false);
  const [credentialFeedback, setCredentialFeedback] = useState(null);

  // Synchronize state when profile or drawer opens
  useEffect(() => {
    if (profile) {
      const currentPic = (profile.profilePicture && profile.profilePicture !== 'none') ? profile.profilePicture : '';
      setPhotoUrl(currentPic);
      setPhotoPreview(currentPic);
      setConfirmDeletePhoto(false);
      setStatsForm({
        experienceYears: profile.experienceYears || '2+',
        projectsDelivered: profile.projectsDelivered || '120+',
        viewsGenerated: profile.viewsGenerated || '40M+',
        clientSatisfaction: profile.clientSatisfaction || '98%',
      });
      setAboutForm({
        aboutTagline: profile.aboutTagline || 'The Craft Behind the Cut',
        aboutBio1:
          profile.aboutBio1 ||
          "I'm Manish, a freelance video editor based in Mumbai, working with brands, filmmakers, and content creators to bring stories to life.",
        aboutBio2:
          profile.aboutBio2 ||
          'My approach is simple: understand the story first, then find the edit. Good editing is invisible — you feel it before you see it.',
        newSkill: '',
        skills: profile.skills && profile.skills.length > 0 ? [...profile.skills] : [
          'Adobe Premiere Pro',
          'DaVinci Resolve Studio',
          'After Effects',
          'Final Cut Pro X',
          'Narrative Editing',
          'Broadcast Standards',
          'Remote Collaboration',
          'Multi-cam Editing',
        ],
      });
      const defaultSocials = [
        { name: 'Instagram', url: 'https://instagram.com' },
        { name: 'LinkedIn', url: 'https://linkedin.com' },
        {
          name: 'WhatsApp',
          url: "https://api.whatsapp.com/send?phone=+918102951819&text=Hello,%20I'm%20interested%20in%20your%20services",
        },
        { name: 'YouTube', url: 'https://youtube.com' },
      ];
      setSocialLinks(
        profile.socialLinks && profile.socialLinks.length > 0
          ? [...profile.socialLinks]
          : defaultSocials
      );
      const defaultChannels = [
        {
          icon: 'mail',
          label: profile.email || 'manish.edit@portfolio.dev',
          url: `mailto:${profile.email || 'manish.edit@portfolio.dev'}`,
        },
        {
          icon: 'instagram',
          label: '@manish.edit',
          url: 'https://instagram.com',
        },
        {
          icon: 'paperplane',
          label: 'Available on Contra & Upwork Enterprise',
          url: 'https://contra.com',
        },
      ];
      setContactChannels(
        profile.contactChannels && profile.contactChannels.length > 0
          ? [...profile.contactChannels]
          : defaultChannels
      );
    }
  }, [profile, isOpen]);

  // Fetch messages when Inquiries tab is selected
  const fetchMessages = async () => {
    setLoadingMessages(true);
    setMsgError(null);
    try {
      const res = await fetch(`${API_BASE}/messages`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      } else {
        setMsgError(data.error || 'Failed to fetch messages');
      }
    } catch (err) {
      setMsgError('Backend connection error: ' + err.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  // Handle ESC key and prevent body scroll when open in full screen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // ===================== INQUIRIES HANDLERS =====================
  const handleToggleRead = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/messages/${id}/read`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status: data.data.status } : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this inquiry from MongoDB?')) return;
    try {
      const res = await fetch(`${API_BASE}/messages/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ===================== STATS HANDLERS =====================
  const handleSaveStats = async (e) => {
    e.preventDefault();
    setSavingStats(true);
    setStatsFeedback(null);
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statsForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatsFeedback({ type: 'success', text: '✓ Stats updated in MongoDB & live on site!' });
        if (onRefreshAll) onRefreshAll();
      } else {
        throw new Error(data.error || 'Failed to update stats');
      }
    } catch (err) {
      setStatsFeedback({ type: 'error', text: err.message });
    } finally {
      setSavingStats(false);
    }
  };

  // ===================== WORK / PROJECTS HANDLERS =====================
  const startAddProject = () => {
    setIsAddingProject(true);
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      category: 'Brand Film',
      duration: '',
      year: new Date().getFullYear().toString(),
      tag: '',
      description: '',
      videoUrl: '',
      layoutSpan: 'medium',
      gradientType: 'card-bg-1',
    });
    setProjectFeedback(null);
  };

  const startEditProject = (proj) => {
    setIsAddingProject(false);
    setEditingProjectId(proj._id);
    setProjectForm({
      title: proj.title || '',
      category: proj.category || 'Brand Film',
      duration: proj.duration || '',
      year: proj.year || '',
      tag: proj.tag || '',
      description: proj.description || '',
      videoUrl: proj.videoUrl || '',
      layoutSpan: proj.layoutSpan || 'medium',
      gradientType: proj.gradientType || 'card-bg-1',
    });
    setProjectFeedback(null);
  };

  const cancelProjectEdit = () => {
    setIsAddingProject(false);
    setEditingProjectId(null);
    setProjectFeedback(null);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setSavingProject(true);
    setProjectFeedback(null);

    const isEditing = Boolean(editingProjectId);
    const url = isEditing
      ? `${API_BASE}/projects/${editingProjectId}`
      : `${API_BASE}/projects`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjectFeedback({
          type: 'success',
          text: isEditing
            ? '✓ Project updated in MongoDB!'
            : '✓ New project added to MongoDB!',
        });
        setIsAddingProject(false);
        setEditingProjectId(null);
        if (onRefreshAll) onRefreshAll();
      } else {
        throw new Error(data.error || 'Failed to save project');
      }
    } catch (err) {
      setProjectFeedback({ type: 'error', text: err.message });
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project from MongoDB?')) return;
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (onRefreshAll) onRefreshAll();
      } else {
        alert(data.error || 'Could not delete project');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // ===================== SERVICES HANDLERS =====================
  const startAddService = () => {
    setIsAddingService(true);
    setEditingServiceId(null);
    setServiceForm({
      num: `0${(services?.length || 0) + 1}`.slice(-2),
      name: '',
      desc: '',
      tools: 'Premiere Pro, DaVinci',
    });
    setServiceFeedback(null);
  };

  const startEditService = (svc) => {
    setIsAddingService(false);
    setEditingServiceId(svc._id);
    setServiceForm({
      num: svc.num || '01',
      name: svc.name || '',
      desc: svc.desc || '',
      tools: Array.isArray(svc.tools) ? svc.tools.join(', ') : svc.tools || '',
    });
    setServiceFeedback(null);
  };

  const cancelServiceEdit = () => {
    setIsAddingService(false);
    setEditingServiceId(null);
    setServiceFeedback(null);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setSavingService(true);
    setServiceFeedback(null);

    const toolsArray = serviceForm.tools
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      num: serviceForm.num,
      name: serviceForm.name,
      desc: serviceForm.desc,
      tools: toolsArray,
    };

    const isEditing = Boolean(editingServiceId);
    const url = isEditing
      ? `${API_BASE}/services/${editingServiceId}`
      : `${API_BASE}/services`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setServiceFeedback({
          type: 'success',
          text: isEditing
            ? '✓ Service updated in MongoDB!'
            : '✓ New service added to MongoDB!',
        });
        setIsAddingService(false);
        setEditingServiceId(null);
        if (onRefreshAll) onRefreshAll();
      } else {
        throw new Error(data.error || 'Failed to save service');
      }
    } catch (err) {
      setServiceFeedback({ type: 'error', text: err.message });
    } finally {
      setSavingService(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service from MongoDB?')) return;
    try {
      const res = await fetch(`${API_BASE}/services/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (onRefreshAll) onRefreshAll();
      } else {
        alert(data.error || 'Could not delete service');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // ===================== TESTIMONIALS HANDLERS =====================
  const startAddTestimonial = () => {
    setIsAddingTestimonial(true);
    setEditingTestimonialId(null);
    setTestimonialForm({
      author: '',
      role: '',
      quote: '',
      initials: '',
    });
    setTestimonialFeedback(null);
  };

  const startEditTestimonial = (t) => {
    setIsAddingTestimonial(false);
    setEditingTestimonialId(t._id);
    setTestimonialForm({
      author: t.author || '',
      role: t.role || '',
      quote: t.quote || '',
      initials: t.initials || '',
    });
    setTestimonialFeedback(null);
  };

  const cancelTestimonialEdit = () => {
    setIsAddingTestimonial(false);
    setEditingTestimonialId(null);
    setTestimonialFeedback(null);
  };

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    setSavingTestimonial(true);
    setTestimonialFeedback(null);

    const initials =
      testimonialForm.initials.trim() ||
      testimonialForm.author
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() ||
      'CL';

    const payload = {
      author: testimonialForm.author,
      role: testimonialForm.role,
      quote: testimonialForm.quote,
      initials,
    };

    const isEditing = Boolean(editingTestimonialId);
    const url = isEditing
      ? `${API_BASE}/testimonials/${editingTestimonialId}`
      : `${API_BASE}/testimonials`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestimonialFeedback({
          type: 'success',
          text: isEditing
            ? '✓ Testimonial updated in MongoDB!'
            : '✓ New testimonial added to MongoDB!',
        });
        setIsAddingTestimonial(false);
        setEditingTestimonialId(null);
        if (onRefreshAll) onRefreshAll();
      } else {
        throw new Error(data.error || 'Failed to save testimonial');
      }
    } catch (err) {
      setTestimonialFeedback({ type: 'error', text: err.message });
    } finally {
      setSavingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Delete this testimonial from MongoDB?')) return;
    try {
      const res = await fetch(`${API_BASE}/testimonials/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (onRefreshAll) onRefreshAll();
      } else {
        alert(data.error || 'Could not delete testimonial');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // ===================== PROFILE PICTURE HANDLERS =====================
  const handlePhotoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setPhotoFeedback({ type: 'error', text: 'Image file size must be under 15MB.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setPhotoFeedback(null);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUrlChange = (val) => {
    setPhotoUrl(val);
    setPhotoPreview(val);
    setPhotoFeedback(null);
  };

  const handleSavePhoto = async (e) => {
    e?.preventDefault();
    setSavingPhoto(true);
    setPhotoFeedback(null);

    const imageToSave = photoPreview ? photoPreview.trim() : '';
    if (!imageToSave) {
      setPhotoFeedback({ type: 'error', text: 'Please select an image file or enter a valid image URL first.' });
      setSavingPhoto(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePicture: imageToSave }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPhotoFeedback({ type: 'success', text: '✓ Profile picture saved to MongoDB & updated live on website!' });
        if (onRefreshAll) onRefreshAll();
      } else {
        throw new Error(data.error || 'Failed to save profile picture');
      }
    } catch (err) {
      setPhotoFeedback({ type: 'error', text: err.message });
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleDeletePhoto = async () => {
    setSavingPhoto(true);
    setPhotoFeedback(null);
    setConfirmDeletePhoto(false);
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePicture: '' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPhotoPreview('');
        setPhotoUrl('');
        setPhotoFeedback({ type: 'success', text: '✓ Profile picture removed from MongoDB. Reverted to monogram frame.' });
        if (onRefreshAll) onRefreshAll();
      } else {
        throw new Error(data.error || 'Failed to delete profile picture');
      }
    } catch (err) {
      setPhotoFeedback({ type: 'error', text: err.message });
    } finally {
      setSavingPhoto(false);
    }
  };

  // ===================== ABOUT HANDLERS =====================
  const handleAddSkill = () => {
    if (!aboutForm.newSkill.trim()) return;
    if (aboutForm.skills.includes(aboutForm.newSkill.trim())) return;
    setAboutForm({
      ...aboutForm,
      skills: [...aboutForm.skills, aboutForm.newSkill.trim()],
      newSkill: '',
    });
  };

  const handleRemoveSkill = (skillToRemove) => {
    setAboutForm({
      ...aboutForm,
      skills: aboutForm.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setSavingAbout(true);
    setAboutFeedback(null);
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aboutTagline: aboutForm.aboutTagline,
          aboutBio1: aboutForm.aboutBio1,
          aboutBio2: aboutForm.aboutBio2,
          skills: aboutForm.skills,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAboutFeedback({ type: 'success', text: '✓ About details and skills updated in MongoDB!' });
        if (onRefreshAll) onRefreshAll();
      } else {
        throw new Error(data.error || 'Failed to update about details');
      }
    } catch (err) {
      setAboutFeedback({ type: 'error', text: err.message });
    } finally {
      setSavingAbout(false);
    }
  };

  // ===================== SOCIAL LINKS HANDLERS =====================
  const handleAddSocial = (e) => {
    e.preventDefault();
    if (!newSocial.name.trim() || !newSocial.url.trim()) return;
    const updated = [...socialLinks, { name: newSocial.name.trim(), url: newSocial.url.trim() }];
    setSocialLinks(updated);
    setNewSocial({ name: '', url: '' });
    saveSocialsToDb(updated);
  };

  const handleDeleteSocial = (index) => {
    if (!window.confirm(`Delete ${socialLinks[index].name} link?`)) return;
    const updated = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updated);
    saveSocialsToDb(updated);
  };

  const handleUpdateSocialItem = (index, field, value) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
  };

  const saveSocialsToDb = async (linksToSave) => {
    setSavingSocials(true);
    setSocialFeedback(null);
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socialLinks: linksToSave || socialLinks }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSocialFeedback({ type: 'success', text: '✓ Social links updated in MongoDB & Footer!' });
        setEditingSocialIndex(null);
        if (onRefreshAll) onRefreshAll();
      } else {
        throw new Error(data.error || 'Failed to save social links');
      }
    } catch (err) {
      setSocialFeedback({ type: 'error', text: err.message });
    } finally {
      setSavingSocials(false);
    }
  };

  // ===================== CONTACT CHANNELS (CONTACT SECTION) HANDLERS =====================
  const handleAddContactChannel = async (e) => {
    e.preventDefault();
    if (!newContactChannel.label.trim()) return;
    const updated = [...contactChannels, { ...newContactChannel }];
    setContactChannels(updated);
    setNewContactChannel({ icon: 'mail', label: '', url: '' });
    await saveContactChannelsToDb(updated);
  };

  const handleDeleteContactChannel = async (index) => {
    if (!window.confirm(`Delete "${contactChannels[index].label}" from Contact Section?`)) return;
    const updated = contactChannels.filter((_, i) => i !== index);
    setContactChannels(updated);
    await saveContactChannelsToDb(updated);
  };

  const handleUpdateContactChannelItem = (index, field, value) => {
    const updated = [...contactChannels];
    updated[index] = { ...updated[index], [field]: value };
    setContactChannels(updated);
  };

  const saveContactChannelsToDb = async (channelsToSave) => {
    setSavingContactChannels(true);
    setContactChannelFeedback(null);
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactChannels: channelsToSave || contactChannels }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContactChannelFeedback({
          type: 'success',
          text: '✓ Contact section channels updated in MongoDB & live on site!',
        });
        setEditingContactChannelIndex(null);
        if (onRefreshAll) onRefreshAll();
      } else {
        throw new Error(data.error || 'Failed to save contact channels');
      }
    } catch (err) {
      setContactChannelFeedback({ type: 'error', text: err.message });
    } finally {
      setSavingContactChannels(false);
    }
  };

  // ===================== CREDENTIALS HANDLERS =====================
  const fetchCredentials = async () => {
    setLoadingCredentials(true);
    try {
      const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/auth/credentials`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCredentialsData(data.data);
        setCredentialForm((prev) => ({
          ...prev,
          newUsername: data.data.username || '',
          newEmail: data.data.email || '',
        }));
      } else {
        setCredentialFeedback({ type: 'error', text: data.error || 'Failed to load credentials' });
      }
    } catch (err) {
      setCredentialFeedback({ type: 'error', text: 'Backend connection error: ' + err.message });
    } finally {
      setLoadingCredentials(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'credentials') {
      fetchCredentials();
    }
  }, [isOpen, activeTab]);

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: '#ff5555' };
    if (score === 2) return { score: 2, label: 'Fair', color: '#ffb86c' };
    if (score === 3) return { score: 3, label: 'Good', color: '#f1fa8c' };
    if (score === 4) return { score: 4, label: 'Strong', color: '#50fa7b' };
    return { score: 5, label: 'Very Strong', color: '#00e5ff' };
  };

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    setCredentialFeedback(null);

    if (!credentialForm.currentPassword) {
      setCredentialFeedback({
        type: 'error',
        text: 'Current Master Password is required to authorize changes.',
      });
      return;
    }

    if (credentialForm.newPassword) {
      if (credentialForm.newPassword.length < 6) {
        setCredentialFeedback({
          type: 'error',
          text: 'New password must be at least 6 characters long.',
        });
        return;
      }
      if (credentialForm.newPassword !== credentialForm.confirmPassword) {
        setCredentialFeedback({
          type: 'error',
          text: 'New password and Confirm password do not match.',
        });
        return;
      }
    }

    setSavingCredentials(true);
    try {
      const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
      const payload = {
        currentPassword: credentialForm.currentPassword,
        newUsername: credentialForm.newUsername,
        newEmail: credentialForm.newEmail,
        newPassword: credentialForm.newPassword || undefined,
      };

      const res = await fetch(`${API_BASE}/auth/credentials`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) {
          if (localStorage.getItem('admin_token')) {
            localStorage.setItem('admin_token', data.token);
          } else {
            sessionStorage.setItem('admin_token', data.token);
          }
        }
        setCredentialFeedback({
          type: 'success',
          text: '✓ Admin credentials updated successfully in MongoDB and server configuration!',
        });
        setCredentialForm((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
        fetchCredentials();
      } else {
        setCredentialFeedback({ type: 'error', text: data.error || 'Failed to update credentials' });
      }
    } catch (err) {
      setCredentialFeedback({ type: 'error', text: 'Update failed: ' + err.message });
    } finally {
      setSavingCredentials(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-drawer-overlay" onClick={onClose}>
      <div className="admin-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-drawer-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', color: 'var(--gold)', letterSpacing: '0.05em', margin: 0 }}>
                Admin
              </h3>
              <span style={{
                fontSize: '0.65rem',
                background: 'rgba(201,168,76,0.15)',
                color: 'var(--gold)',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 600
              }}>
                Database Console
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>
              Manish Bhagat (<code>manish_portfolio</code>)
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <button
              type="button"
              className="admin-portfolio-btn"
              onClick={() => {
                onClose();
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 150);
              }}
              title="Return to public portfolio view"
            >
              <span>🌐</span>
              <span>View Portfolio</span>
            </button>
            {onLogout && (
              <button
                type="button"
                className="admin-logout-btn"
                onClick={onLogout}
                title="Log out and return to public portfolio view"
              >
                <span>🚪 Logout</span>
              </button>
            )}
            <button className="admin-close-btn" onClick={onClose} title="Close Console (Esc)">
              <span>Close</span>
              <span style={{ fontSize: '1.1rem' }}>✕</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-drawer-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            Inquiries ({messages.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Stats
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'work' ? 'active' : ''}`}
            onClick={() => setActiveTab('work')}
          >
            Work ({projects?.length || 0})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Services ({services?.length || 0})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
            onClick={() => setActiveTab('testimonials')}
          >
            Testimonials ({testimonials?.length || 0})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'photo' ? 'active' : ''}`}
            onClick={() => setActiveTab('photo')}
          >
            Profile Picture {profile?.profilePicture ? '●' : ''}
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About & Skills
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'socials' ? 'active' : ''}`}
            onClick={() => setActiveTab('socials')}
          >
            Socials & Contact ({contactChannels.length + socialLinks.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'compass' ? 'active' : ''}`}
            onClick={() => setActiveTab('compass')}
          >
            Compass
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'credentials' ? 'active' : ''}`}
            onClick={() => setActiveTab('credentials')}
          >
            🔑 Credentials
          </button>
        </div>

        {/* Body */}
        <div className="admin-drawer-body">
          <div className="admin-content-container">
            <div className="admin-compass-banner">
              <div>
                <strong>Database | Dashboard | Console</strong>
              </div>
              <div style={{ marginTop: '0.3rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
               Clients Inquiries | Admin Dashboard | Admin Console
              </div>
            </div>

          {/* ===================== TAB 1: INQUIRIES ===================== */}
          {activeTab === 'inquiries' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  Inquiries Database ({messages.length})
                </h4>
                <button className="action-btn-sm" onClick={fetchMessages}>
                  ↻ Refresh
                </button>
              </div>

              {loadingMessages && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading from MongoDB...</p>}
              {msgError && <div className="form-status error">{msgError}</div>}

              {messages.length === 0 && !loadingMessages && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No messages found yet. Submissions from the contact form appear here and in DataBase!
                </p>
              )}

              {messages.map((m) => (
                <div key={m._id} className={`message-card ${m.status === 'unread' ? 'unread' : ''}`}>
                  <div className="message-meta">
                    <span className="message-sender">{m.name}</span>
                    <span>{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                    ✉ {m.email}
                  </div>
                  <div>
                    <span className="message-type">{m.projectType}</span>
                    <span style={{
                      marginLeft: '0.5rem',
                      fontSize: '0.65rem',
                      color: m.status === 'unread' ? '#C9A84C' : '#5DCAA5',
                      textTransform: 'uppercase'
                    }}>
                      • {m.status}
                    </span>
                  </div>
                  <div className="message-body">{m.message}</div>
                  <div className="message-actions">
                    <button className="action-btn-sm" onClick={() => handleToggleRead(m._id)}>
                      Mark as {m.status === 'unread' ? 'Read' : 'Unread'}
                    </button>
                    <button className="action-btn-sm delete" onClick={() => handleDeleteMessage(m._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===================== TAB 2: STATS ===================== */}
          {activeTab === 'stats' && (
            <form onSubmit={handleSaveStats} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  Manage Metrics & Stats
                </h4>
              </div>

              {statsFeedback && (
                <div className={`form-status ${statsFeedback.type}`}>{statsFeedback.text}</div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Years Experience</label>
                  <input
                    className="form-input"
                    value={statsForm.experienceYears}
                    placeholder="e.g. 2+ or 7+"
                    onChange={(e) => setStatsForm({ ...statsForm, experienceYears: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Projects Delivered</label>
                  <input
                    className="form-input"
                    value={statsForm.projectsDelivered}
                    placeholder="e.g. 120+"
                    onChange={(e) => setStatsForm({ ...statsForm, projectsDelivered: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Views Generated</label>
                  <input
                    className="form-input"
                    value={statsForm.viewsGenerated}
                    placeholder="e.g. 40M+"
                    onChange={(e) => setStatsForm({ ...statsForm, viewsGenerated: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Client Satisfaction</label>
                  <input
                    className="form-input"
                    value={statsForm.clientSatisfaction}
                    placeholder="e.g. 98%"
                    onChange={(e) => setStatsForm({ ...statsForm, clientSatisfaction: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div style={{ background: 'var(--ink)', padding: '1rem', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '2px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Live Stats Bar Preview:
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold)' }}>
                      {statsForm.experienceYears}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Years Experience</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold)' }}>
                      {statsForm.projectsDelivered}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Projects Delivered</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold)' }}>
                      {statsForm.viewsGenerated}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Views Generated</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold)' }}>
                      {statsForm.clientSatisfaction}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Satisfaction</div>
                  </div>
                </div>
              </div>

              <button type="submit" className="form-submit" disabled={savingStats}>
                {savingStats ? 'Updating MongoDB...' : 'Save Stats to MongoDB →'}
              </button>
            </form>
          )}

          {/* ===================== TAB 3: WORK / PROJECTS ===================== */}
          {activeTab === 'work' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  Work / Portfolio Projects ({projects?.length || 0})
                </h4>
                {!isAddingProject && !editingProjectId && (
                  <button className="action-btn-sm" onClick={startAddProject}>
                    + Add New Project
                  </button>
                )}
              </div>

              {projectFeedback && (
                <div className={`form-status ${projectFeedback.type}`} style={{ marginBottom: '1rem' }}>
                  {projectFeedback.text}
                </div>
              )}

              {/* Add / Edit Form */}
              {(isAddingProject || editingProjectId) && (
                <form
                  onSubmit={handleSaveProject}
                  style={{
                    background: 'var(--ink)',
                    padding: '1.2rem',
                    border: '1px solid rgba(201,168,76,0.3)',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: 'var(--gold)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                      {editingProjectId ? 'Edit Project' : 'Create New Project'}
                    </strong>
                    <button type="button" className="action-btn-sm" onClick={cancelProjectEdit}>
                      Cancel
                    </button>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Project Title *</label>
                    <input
                      className="form-input"
                      required
                      value={projectForm.title}
                      placeholder="e.g. Horizon — Launch Campaign"
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select
                        className="form-input"
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        style={{ background: 'var(--ink-3)', color: 'var(--cream)' }}
                      >
                        <option value="Brand Film">Brand Film</option>
                        <option value="Documentary">Documentary</option>
                        <option value="Music Video">Music Video</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Short Film">Short Film</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Duration</label>
                      <input
                        className="form-input"
                        value={projectForm.duration}
                        placeholder="e.g. 3:45 min"
                        onChange={(e) => setProjectForm({ ...projectForm, duration: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Year</label>
                      <input
                        className="form-input"
                        value={projectForm.year}
                        placeholder="2024"
                        onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Deliverable Tag</label>
                      <input
                        className="form-input"
                        value={projectForm.tag}
                        placeholder="e.g. 4K Color Grade"
                        onChange={(e) => setProjectForm({ ...projectForm, tag: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Grid Layout Span</label>
                      <select
                        className="form-input"
                        value={projectForm.layoutSpan}
                        onChange={(e) => setProjectForm({ ...projectForm, layoutSpan: e.target.value })}
                        style={{ background: 'var(--ink-3)', color: 'var(--cream)' }}
                      >
                        <option value="medium">Medium (5 cols)</option>
                        <option value="large">Large (7 cols)</option>
                        <option value="wide">Wide (8 cols)</option>
                        <option value="small">Small (4 cols)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Background Theme</label>
                      <select
                        className="form-input"
                        value={projectForm.gradientType}
                        onChange={(e) => setProjectForm({ ...projectForm, gradientType: e.target.value })}
                        style={{ background: 'var(--ink-3)', color: 'var(--cream)' }}
                      >
                        <option value="card-bg-1">Crimson Dark</option>
                        <option value="card-bg-2">Teal Emerald</option>
                        <option value="card-bg-3">Amber Gold</option>
                        <option value="card-bg-4">Violet Indigo</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Video Embed URL (YouTube/Vimeo)</label>
                    <input
                      className="form-input"
                      value={projectForm.videoUrl}
                      placeholder="https://www.youtube.com/embed/..."
                      onChange={(e) => setProjectForm({ ...projectForm, videoUrl: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="form-submit" disabled={savingProject}>
                    {savingProject ? 'Saving to MongoDB...' : editingProjectId ? 'Update Project →' : 'Add Project to MongoDB →'}
                  </button>
                </form>
              )}

              {/* Projects List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {(!projects || projects.length === 0) && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No projects found in MongoDB yet. Click "+ Add New Project" above to showcase your first video project!
                  </p>
                )}
                {projects?.map((p) => (
                  <div
                    key={p._id}
                    style={{
                      background: 'var(--ink-3)',
                      border: '1px solid rgba(201,168,76,0.1)',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.95rem', color: 'var(--cream)', fontWeight: 500 }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--gold)', marginTop: '0.2rem' }}>
                        {p.category} • {p.duration} • {p.year}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="action-btn-sm" onClick={() => startEditProject(p)}>
                        Edit
                      </button>
                      <button className="action-btn-sm delete" onClick={() => handleDeleteProject(p._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB 4: SERVICES ===================== */}
          {activeTab === 'services' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  Manage Services ({services?.length || 0})
                </h4>
                {!isAddingService && !editingServiceId && (
                  <button className="action-btn-sm" onClick={startAddService}>
                    + Add New Service
                  </button>
                )}
              </div>

              {serviceFeedback && (
                <div className={`form-status ${serviceFeedback.type}`} style={{ marginBottom: '1rem' }}>
                  {serviceFeedback.text}
                </div>
              )}

              {/* Add / Edit Service Form */}
              {(isAddingService || editingServiceId) && (
                <form
                  onSubmit={handleSaveService}
                  style={{
                    background: 'var(--ink)',
                    padding: '1.2rem',
                    border: '1px solid rgba(201,168,76,0.3)',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: 'var(--gold)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                      {editingServiceId ? 'Edit Service' : 'Create New Service'}
                    </strong>
                    <button type="button" className="action-btn-sm" onClick={cancelServiceEdit}>
                      Cancel
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ maxWidth: '100px' }}>
                      <label className="form-label">No. *</label>
                      <input
                        className="form-input"
                        required
                        value={serviceForm.num}
                        placeholder="01"
                        onChange={(e) => setServiceForm({ ...serviceForm, num: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Service Name *</label>
                      <input
                        className="form-input"
                        required
                        value={serviceForm.name}
                        placeholder="e.g. Color Grading"
                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-textarea"
                      required
                      value={serviceForm.desc}
                      placeholder="Describe what is included in this service..."
                      onChange={(e) => setServiceForm({ ...serviceForm, desc: e.target.value })}
                      style={{ minHeight: '80px' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Software & Tools (comma separated)</label>
                    <input
                      className="form-input"
                      value={serviceForm.tools}
                      placeholder="Premiere Pro, DaVinci Resolve, Lumetri"
                      onChange={(e) => setServiceForm({ ...serviceForm, tools: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="form-submit" disabled={savingService}>
                    {savingService ? 'Saving to MongoDB...' : editingServiceId ? 'Update Service →' : 'Add Service to MongoDB →'}
                  </button>
                </form>
              )}

              {/* Services List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {(!services || services.length === 0) && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No services in MongoDB yet. Click "+ Add New Service" above to add your custom video editing offerings!
                  </p>
                )}
                {services?.map((s) => (
                  <div
                    key={s._id}
                    style={{
                      background: 'var(--ink-3)',
                      border: '1px solid rgba(201,168,76,0.1)',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.95rem', color: 'var(--cream)', fontWeight: 500 }}>
                        <span style={{ color: 'var(--gold)', marginRight: '0.5rem' }}>{s.num}</span>
                        {s.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {Array.isArray(s.tools) ? s.tools.join(', ') : s.tools}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="action-btn-sm" onClick={() => startEditService(s)}>
                        Edit
                      </button>
                      <button className="action-btn-sm delete" onClick={() => handleDeleteService(s._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB: TESTIMONIALS ===================== */}
          {activeTab === 'testimonials' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  Client Testimonials ({testimonials?.length || 0})
                </h4>
                {!isAddingTestimonial && !editingTestimonialId && (
                  <button className="action-btn-sm" onClick={startAddTestimonial}>
                    + Add Testimonial
                  </button>
                )}
              </div>

              {testimonialFeedback && (
                <div className={`form-status ${testimonialFeedback.type}`} style={{ marginBottom: '1rem' }}>
                  {testimonialFeedback.text}
                </div>
              )}

              {/* Add / Edit Form */}
              {(isAddingTestimonial || editingTestimonialId) && (
                <form
                  onSubmit={handleSaveTestimonial}
                  style={{
                    background: 'var(--ink)',
                    padding: '1.2rem',
                    border: '1px solid rgba(201,168,76,0.3)',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: 'var(--gold)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                      {editingTestimonialId ? 'Edit Testimonial' : 'Add New Testimonial'}
                    </strong>
                    <button type="button" className="action-btn-sm" onClick={cancelTestimonialEdit}>
                      Cancel
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Client / Author Name *</label>
                      <input
                        className="form-input"
                        required
                        value={testimonialForm.author}
                        placeholder="e.g. Sarah Jenkins"
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, author: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role / Company *</label>
                      <input
                        className="form-input"
                        required
                        value={testimonialForm.role}
                        placeholder="e.g. Director, Luminary Media"
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Client Quote / Review *</label>
                    <textarea
                      className="form-textarea"
                      required
                      value={testimonialForm.quote}
                      placeholder="Write what the client said about your video editing..."
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                      style={{ minHeight: '80px' }}
                    />
                  </div>

                  <div className="form-group" style={{ maxWidth: '120px' }}>
                    <label className="form-label">Avatar Initials</label>
                    <input
                      className="form-input"
                      value={testimonialForm.initials}
                      placeholder="e.g. SJ"
                      maxLength={3}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, initials: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="form-submit" disabled={savingTestimonial}>
                    {savingTestimonial
                      ? 'Saving to MongoDB...'
                      : editingTestimonialId
                      ? 'Update Testimonial →'
                      : 'Add Testimonial to MongoDB →'}
                  </button>
                </form>
              )}

              {/* Testimonials List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {(!testimonials || testimonials.length === 0) && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No testimonials in MongoDB yet. Click "+ Add Testimonial" above to showcase real client feedback!
                  </p>
                )}
                {testimonials?.map((t) => (
                  <div
                    key={t._id}
                    style={{
                      background: 'var(--ink-3)',
                      border: '1px solid rgba(201,168,76,0.1)',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.95rem', color: 'var(--cream)', fontWeight: 500 }}>
                        {t.author} <span style={{ fontSize: '0.75rem', color: 'var(--gold)', marginLeft: '0.4rem' }}>{t.role}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.3rem', fontStyle: 'italic' }}>
                        "{t.quote}"
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="action-btn-sm" onClick={() => startEditTestimonial(t)}>
                        Edit
                      </button>
                      <button className="action-btn-sm delete" onClick={() => handleDeleteTestimonial(t._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB: PROFILE PICTURE ===================== */}
          {activeTab === 'photo' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', margin: 0 }}>
                    Profile Picture Management
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>
                    Upload or update your official editorial portrait. Renders inside the About section frame with golden corner borders.
                  </p>
                </div>
                {profile?.profilePicture && profile.profilePicture !== 'none' && (
                  confirmDeletePhoto ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#E24B4A', fontWeight: 600 }}>Remove photo?</span>
                      <button
                        type="button"
                        className="action-btn-sm delete"
                        onClick={handleDeletePhoto}
                        disabled={savingPhoto}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', background: '#E24B4A', color: '#fff' }}
                      >
                        Yes, Remove
                      </button>
                      <button
                        type="button"
                        className="action-btn-sm"
                        onClick={() => setConfirmDeletePhoto(false)}
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="action-btn-sm delete"
                      onClick={() => setConfirmDeletePhoto(true)}
                      disabled={savingPhoto}
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}
                    >
                      🗑 Remove Profile Picture
                    </button>
                  )
                )}
              </div>

              {photoFeedback && (
                <div className={`form-status ${photoFeedback.type}`} style={{ marginBottom: '1.5rem' }}>
                  {photoFeedback.text}
                </div>
              )}

              <div className="photo-admin-grid">
                {/* Left Column: Upload & URL Controls */}
                <div className="photo-upload-card">
                  <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem' }}>
                    <button
                      type="button"
                      className={`filter-btn ${photoInputType === 'file' ? 'active' : ''}`}
                      onClick={() => setPhotoInputType('file')}
                    >
                      📁 Upload File from Device
                    </button>
                    <button
                      type="button"
                      className={`filter-btn ${photoInputType === 'url' ? 'active' : ''}`}
                      onClick={() => setPhotoInputType('url')}
                    >
                      🔗 Use Image URL
                    </button>
                  </div>

                  {photoInputType === 'file' ? (
                    <div style={{ marginBottom: '1.8rem' }}>
                      <div className="form-label" style={{ marginBottom: '0.8rem', display: 'block' }}>
                        Select Image File (JPG, PNG, WEBP, AVIF)
                      </div>
                      <label className={`photo-dropzone ${photoPreview ? 'has-file' : ''}`}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoFileChange}
                          style={{ display: 'none' }}
                        />
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem', color: 'var(--gold)', lineHeight: 1 }}>📷</div>
                        <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--cream)', marginBottom: '0.4rem', fontWeight: 600 }}>
                          {photoPreview && photoInputType === 'file' ? 'Click or Drag to Replace File' : 'Click to Browse or Drag Photo Here'}
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', maxWidth: '380px', margin: '0 auto', lineHeight: 1.5 }}>
                          Supports high-res images up to 15MB. Automatically processed and saved to MongoDB.
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div style={{ marginBottom: '1.8rem' }}>
                      <div className="form-group">
                        <label className="form-label">Direct Image URL</label>
                        <input
                          className="form-input"
                          value={photoUrl}
                          placeholder="https://images.unsplash.com/... or cloud image URL"
                          onChange={(e) => handlePhotoUrlChange(e.target.value)}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block' }}>
                          Paste a direct link to any portrait image on the web.
                        </span>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(201,168,76,0.1)', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="form-submit"
                      disabled={savingPhoto || !photoPreview}
                      onClick={handleSavePhoto}
                      style={{ padding: '0.85rem 1.8rem', minHeight: '46px' }}
                    >
                      {savingPhoto
                        ? 'Saving to MongoDB...'
                        : profile?.profilePicture
                        ? 'Save & Update Profile Picture →'
                        : 'Publish Profile Picture to Website →'}
                    </button>

                    {photoPreview && photoPreview !== profile?.profilePicture && (
                      <button
                        type="button"
                        className="action-btn-sm"
                        onClick={() => {
                          setPhotoPreview(profile?.profilePicture || '');
                          setPhotoUrl(profile?.profilePicture || '');
                        }}
                      >
                        Reset to Current
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Column: Live Website Mockup Preview */}
                <div className="photo-preview-mockup">
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--gold)', marginBottom: '1.2rem', fontWeight: 600 }}>
                    Live About Section Mockup
                  </div>

                  <div className="mockup-frame">
                    {photoPreview && photoPreview.trim() !== '' && photoPreview !== 'none' ? (
                      <div className="about-photo-wrapper">
                        <img
                          src={photoPreview}
                          alt="Profile Preview"
                          className="about-profile-img"
                        />
                        <div className="about-photo-overlay" />
                      </div>
                    ) : (
                      <div className="about-frame-inner" style={{ fontSize: '2.8rem' }}>
                        {(profile?.name || 'MANISH').toUpperCase()}<br />BHAGAT
                      </div>
                    )}
                    <div className="about-corner tl" />
                    <div className="about-corner tr" />
                    <div className="about-corner bl" />
                    <div className="about-corner br" />
                  </div>

                  <div style={{ marginTop: '1.2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: (photoPreview && photoPreview !== 'none') ? '#5DCAA5' : 'var(--text-muted)' }}>
                      {(photoPreview && photoPreview !== 'none')
                        ? photoPreview === profile?.profilePicture
                          ? '● Active in MongoDB & Displayed on Website'
                          : '⚡ Unsaved Preview — Click button to publish'
                        : '○ No photo set (Using text monogram fallback)'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 5: ABOUT & SKILLS ===================== */}
          {activeTab === 'about' && (
            <form onSubmit={handleSaveAbout} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                About Section & Skills Management
              </h4>

              {aboutFeedback && (
                <div className={`form-status ${aboutFeedback.type}`}>{aboutFeedback.text}</div>
              )}

              <div className="form-group">
                <label className="form-label">About Tagline</label>
                <input
                  className="form-input"
                  value={aboutForm.aboutTagline}
                  placeholder="The Craft Behind the Cut"
                  onChange={(e) => setAboutForm({ ...aboutForm, aboutTagline: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Biography Paragraph 1</label>
                <textarea
                  className="form-textarea"
                  value={aboutForm.aboutBio1}
                  placeholder="First bio paragraph..."
                  onChange={(e) => setAboutForm({ ...aboutForm, aboutBio1: e.target.value })}
                  style={{ minHeight: '80px' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Biography Paragraph 2</label>
                <textarea
                  className="form-textarea"
                  value={aboutForm.aboutBio2}
                  placeholder="Second bio paragraph..."
                  onChange={(e) => setAboutForm({ ...aboutForm, aboutBio2: e.target.value })}
                  style={{ minHeight: '80px' }}
                  required
                />
              </div>

              {/* Skills Manager */}
              <div className="form-group">
                <label className="form-label">Skills List ({aboutForm.skills.length})</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.8rem' }}>
                  {aboutForm.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(201,168,76,0.1)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        color: 'var(--gold)',
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.75rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#e74c3c',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                        title="Remove skill"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    className="form-input"
                    value={aboutForm.newSkill}
                    placeholder="Enter new skill (e.g. Unreal Engine, 3D Tracking)"
                    onChange={(e) => setAboutForm({ ...aboutForm, newSkill: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <button type="button" className="action-btn-sm" onClick={handleAddSkill}>
                    + Add
                  </button>
                </div>
              </div>

              <button type="submit" className="form-submit" disabled={savingAbout}>
                {savingAbout ? 'Updating MongoDB...' : 'Save About & Skills to MongoDB →'}
              </button>
            </form>
          )}

          {/* ===================== TAB 6: SOCIALS & CONTACT ===================== */}
          {activeTab === 'socials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* PART 1: DIRECT CONTACT CHANNELS (CONTACT SECTION) */}
              <div className="credentials-card" style={{ background: 'var(--ink-2)' }}>
                <div className="credentials-card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="card-badge">Contact Section</span>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--gold)', letterSpacing: '0.05em' }}>
                        Direct Channels & Social Handles ({contactChannels.length})
                      </h4>
                    </div>
                    <p style={{ margin: '0.4rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      These 3 channels display directly inside the portfolio's Contact section: Email, Instagram handle, and Availability on Enterprise platforms.
                    </p>
                  </div>
                </div>

                {contactChannelFeedback && (
                  <div className={`form-status ${contactChannelFeedback.type}`}>
                    {contactChannelFeedback.text}
                  </div>
                )}

                {/* Existing Contact Channels List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {contactChannels.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(201,168,76,0.15)',
                        borderRadius: '4px',
                        padding: '1rem',
                      }}
                    >
                      {editingContactChannelIndex === idx ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          <div className="form-row">
                            <div className="form-group" style={{ maxWidth: '180px' }}>
                              <label className="form-label">Icon Type</label>
                              <select
                                className="form-input"
                                value={item.icon}
                                onChange={(e) => handleUpdateContactChannelItem(idx, 'icon', e.target.value)}
                              >
                                <option value="mail">✉️ Email</option>
                                <option value="instagram">📷 Instagram</option>
                                <option value="paperplane">🚀 Availability</option>
                                <option value="whatsapp">💬 WhatsApp</option>
                                <option value="link">🔗 Custom Link</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Display Label</label>
                              <input
                                className="form-input"
                                value={item.label}
                                placeholder="Display text (e.g. @manish.edit)"
                                onChange={(e) => handleUpdateContactChannelItem(idx, 'label', e.target.value)}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Action URL</label>
                              <input
                                className="form-input"
                                value={item.url}
                                placeholder="https://... or mailto:..."
                                onChange={(e) => handleUpdateContactChannelItem(idx, 'url', e.target.value)}
                              />
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="action-btn-sm"
                              onClick={() => saveContactChannelsToDb(contactChannels)}
                              disabled={savingContactChannels}
                            >
                              {savingContactChannels ? 'Saving...' : '💾 Save Changes'}
                            </button>
                            <button
                              type="button"
                              className="action-btn-sm"
                              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
                              onClick={() => setEditingContactChannelIndex(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <span
                              style={{
                                background: 'rgba(201,168,76,0.12)',
                                border: '1px solid rgba(201,168,76,0.25)',
                                color: 'var(--gold)',
                                padding: '0.3rem 0.6rem',
                                borderRadius: '4px',
                                fontSize: '0.74rem',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                              }}
                            >
                              {item.icon === 'mail' && '✉️ Email'}
                              {item.icon === 'instagram' && '📷 Instagram'}
                              {(item.icon === 'paperplane' || item.icon === 'contra' || item.icon === 'upwork') && '🚀 Availability'}
                              {item.icon === 'whatsapp' && '💬 WhatsApp'}
                              {item.icon === 'link' && '🔗 Link'}
                            </span>
                            <div>
                              <strong style={{ color: 'var(--cream)', fontSize: '0.95rem' }}>{item.label}</strong>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                {item.url ? (
                                  <code>{item.url}</code>
                                ) : (
                                  <span style={{ fontStyle: 'italic' }}>Static text (no link)</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              className="action-btn-sm"
                              onClick={() => setEditingContactChannelIndex(idx)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              className="action-btn-sm delete"
                              onClick={() => handleDeleteContactChannel(idx)}
                              disabled={savingContactChannels}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Contact Channel Form */}
                <form
                  onSubmit={handleAddContactChannel}
                  style={{
                    background: 'var(--ink)',
                    padding: '1.2rem',
                    border: '1px dashed rgba(201,168,76,0.25)',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                    + Add New Contact Section Channel
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ maxWidth: '180px' }}>
                      <label className="form-label">Icon Type</label>
                      <select
                        className="form-input"
                        value={newContactChannel.icon}
                        onChange={(e) => setNewContactChannel({ ...newContactChannel, icon: e.target.value })}
                      >
                        <option value="mail">✉️ Email</option>
                        <option value="instagram">📷 Instagram</option>
                        <option value="paperplane">🚀 Availability</option>
                        <option value="whatsapp">💬 WhatsApp</option>
                        <option value="link">🔗 Custom Link</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Display Label *</label>
                      <input
                        className="form-input"
                        value={newContactChannel.label}
                        placeholder="e.g. @manish.edit or Available for Freelance"
                        onChange={(e) => setNewContactChannel({ ...newContactChannel, label: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Link URL (Optional)</label>
                      <input
                        className="form-input"
                        value={newContactChannel.url}
                        placeholder="https://... or mailto:..."
                        onChange={(e) => setNewContactChannel({ ...newContactChannel, url: e.target.value })}
                      />
                    </div>
                  </div>
                  <button type="submit" className="form-submit" disabled={savingContactChannels}>
                    {savingContactChannels ? 'Saving...' : 'Add Channel to Contact Section & MongoDB →'}
                  </button>
                </form>
              </div>

              {/* PART 2: FOOTER SOCIAL LINKS */}
              <div className="credentials-card" style={{ background: 'var(--ink-2)' }}>
                <div className="credentials-card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="card-badge">Footer</span>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--gold)', letterSpacing: '0.05em' }}>
                        Footer Social Links ({socialLinks.length})
                      </h4>
                    </div>
                    <p style={{ margin: '0.4rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Links displayed in the website footer at the bottom of every page.
                    </p>
                  </div>
                </div>

                {socialFeedback && (
                  <div className={`form-status ${socialFeedback.type}`}>
                    {socialFeedback.text}
                  </div>
                )}

                {/* Existing Social Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {socialLinks.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(201,168,76,0.15)',
                        borderRadius: '4px',
                        padding: '1rem',
                      }}
                    >
                      {editingSocialIndex === idx ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          <div className="form-row">
                            <input
                              className="form-input"
                              value={item.name}
                              placeholder="Platform Name"
                              onChange={(e) => handleUpdateSocialItem(idx, 'name', e.target.value)}
                            />
                            <input
                              className="form-input"
                              value={item.url}
                              placeholder="URL"
                              onChange={(e) => handleUpdateSocialItem(idx, 'url', e.target.value)}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="action-btn-sm"
                              onClick={() => saveSocialsToDb(socialLinks)}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="action-btn-sm"
                              onClick={() => setEditingSocialIndex(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>{item.name}</strong>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', wordBreak: 'break-all', marginTop: '0.2rem' }}>
                              {item.url}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              className="action-btn-sm"
                              onClick={() => setEditingSocialIndex(idx)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="action-btn-sm delete"
                              onClick={() => handleDeleteSocial(idx)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Social Link */}
                <form
                  onSubmit={handleAddSocial}
                  style={{
                    background: 'var(--ink)',
                    padding: '1.2rem',
                    border: '1px dashed rgba(201,168,76,0.25)',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: 'var(--gold)', textTransform: 'uppercase' }}>
                    + Add New Footer Social Link
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Platform Name</label>
                      <input
                        className="form-input"
                        value={newSocial.name}
                        placeholder="e.g. WhatsApp, Behance, X"
                        onChange={(e) => setNewSocial({ ...newSocial, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Link URL</label>
                      <input
                        className="form-input"
                        value={newSocial.url}
                        placeholder="https://..."
                        onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="form-submit" disabled={savingSocials}>
                    {savingSocials ? 'Saving...' : 'Add Link to Footer & MongoDB →'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ===================== TAB 7: COMPASS ===================== */}
          {activeTab === 'compass' && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.8 }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--gold)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                MongoDB Compass Collections
              </h4>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Open <strong>MongoDB Compass</strong> and connect to <code>mongodb://127.0.0.1:27017</code>. Under the <strong>manish_portfolio_v2</strong> database, all collections update dynamically:
              </p>
              <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li>
                  <strong style={{ color: 'var(--cream)' }}>profiles:</strong> Stores Stats metrics, About bio paragraphs, Skills array, and Social Links.
                </li>
                <li>
                  <strong style={{ color: 'var(--cream)' }}>projects:</strong> Stores all portfolio work with categories, duration, year, and video embeds.
                </li>
                <li>
                  <strong style={{ color: 'var(--cream)' }}>services:</strong> Stores video editing services and software tools.
                </li>
                <li>
                  <strong style={{ color: 'var(--cream)' }}>messages:</strong> Real-time contact form inquiries submitted from the website.
                </li>
              </ul>
            </div>
          )}

          {/* ===================== TAB 8: CREDENTIALS ===================== */}
          {activeTab === 'credentials' && (
            <div className="credentials-tab-container">
              <div className="credentials-header-banner">
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--gold)', letterSpacing: '0.05em' }}>
                    🔑 Admin Account & Master Credentials
                  </h4>
                  <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    View active admin authentication details and update your master credentials securely. Synchronized with MongoDB and server configuration.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-credentials-refresh"
                  onClick={fetchCredentials}
                  disabled={loadingCredentials}
                  title="Reload credentials from database"
                >
                  {loadingCredentials ? 'Refreshing...' : '🔄 Refresh Details'}
                </button>
              </div>

              <div className="credentials-grid">
                {/* CARD 1: CURRENT ACTIVE CREDENTIALS (READ & COPY) */}
                <div className="credentials-card">
                  <div className="credentials-card-header">
                    <span className="card-badge">Current Credentials</span>
                    <span className="sync-pill">
                      <span className="status-dot-active"></span> Active in MongoDB
                    </span>
                  </div>

                  <div className="credential-item-list">
                    {/* Username */}
                    <div className="credential-row">
                      <div className="credential-info">
                        <label className="credential-label">Admin Username</label>
                        <span className="credential-val">
                          {loadingCredentials ? 'Loading...' : (credentialsData?.username || '—')}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={`copy-pill-btn ${copiedField === 'username' ? 'copied' : ''}`}
                        onClick={() => handleCopy(credentialsData?.username, 'username')}
                        title="Copy Username to Clipboard"
                      >
                        {copiedField === 'username' ? '✓ Copied' : '📋 Copy'}
                      </button>
                    </div>

                    {/* Email ID */}
                    <div className="credential-row">
                      <div className="credential-info">
                        <label className="credential-label">Admin Email ID</label>
                        <span className="credential-val">
                          {loadingCredentials ? 'Loading...' : (credentialsData?.email || '—')}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={`copy-pill-btn ${copiedField === 'email' ? 'copied' : ''}`}
                        onClick={() => handleCopy(credentialsData?.email, 'email')}
                        title="Copy Email ID to Clipboard"
                      >
                        {copiedField === 'email' ? '✓ Copied' : '📋 Copy'}
                      </button>
                    </div>

                    {/* Master Password */}
                    <div className="credential-row">
                      <div className="credential-info">
                        <label className="credential-label">Master Password</label>
                        <span className="credential-val password-mono">
                          {loadingCredentials
                            ? '••••••••'
                            : showCurrentMasterPassword
                            ? (credentialsData?.masterPassword || '••••••••')
                            : '••••••••••••'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="eye-toggle-pill-btn"
                          onClick={() => setShowCurrentMasterPassword(!showCurrentMasterPassword)}
                          title={showCurrentMasterPassword ? 'Hide password' : 'Show password in plaintext'}
                        >
                          {showCurrentMasterPassword ? '🙈 Hide' : '👁️ Show'}
                        </button>
                        <button
                          type="button"
                          className={`copy-pill-btn ${copiedField === 'password' ? 'copied' : ''}`}
                          onClick={() => handleCopy(credentialsData?.masterPassword, 'password')}
                          title="Copy Password to Clipboard"
                        >
                          {copiedField === 'password' ? '✓ Copied' : '📋 Copy'}
                        </button>
                      </div>
                    </div>

                    {/* Last Changed */}
                    <div className="credential-row">
                      <div className="credential-info">
                        <label className="credential-label">Last Modified</label>
                        <span className="credential-val text-muted" style={{ fontSize: '0.8rem' }}>
                          {credentialsData?.lastPasswordChange
                            ? new Date(credentialsData.lastPasswordChange).toLocaleString('en-US', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })
                            : 'Initial Installation Default'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="credentials-security-note">
                    <span style={{ fontSize: '1rem' }}>🛡️</span>
                    <span>
                      These master credentials unlock access via <code>/admin/login</code> and the stealth shortcut <code>Ctrl+Shift+A</code>. Keep them confidential.
                    </span>
                  </div>
                </div>

                {/* CARD 2: UPDATE CREDENTIALS & CHANGE PASSWORD */}
                <div className="credentials-card">
                  <div className="credentials-card-header">
                    <span className="card-badge update-badge">Update Credentials</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Security Verification Required
                    </span>
                  </div>

                  <form onSubmit={handleUpdateCredentials} className="credentials-form">
                    {credentialFeedback && (
                      <div
                        className={`feedback-banner ${
                          credentialFeedback.type === 'success' ? 'feedback-success' : 'feedback-error'
                        }`}
                      >
                        {credentialFeedback.text}
                      </div>
                    )}

                    {/* Current Password (Authorization) */}
                    <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                      <label className="form-label" style={{ color: '#ffb86c' }}>
                        Current Master Password <span style={{ color: '#ff5555' }}>*</span>
                      </label>
                      <div className="password-input-wrapper">
                        <input
                          type={showVerifyPassword ? 'text' : 'password'}
                          className="form-input"
                          value={credentialForm.currentPassword}
                          onChange={(e) =>
                            setCredentialForm({ ...credentialForm, currentPassword: e.target.value })
                          }
                          placeholder="Required to authorize changes..."
                          required
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="input-eye-btn"
                          onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                          title={showVerifyPassword ? 'Hide password' : 'Show password'}
                          tabIndex="-1"
                        >
                          {showVerifyPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <span className="form-hint">
                        Enter your existing password to verify administrative ownership.
                      </span>
                    </div>

                    <div className="form-divider"></div>

                    {/* New Username */}
                    <div className="form-group">
                      <label className="form-label">New Username</label>
                      <input
                        type="text"
                        className="form-input"
                        value={credentialForm.newUsername}
                        onChange={(e) =>
                          setCredentialForm({ ...credentialForm, newUsername: e.target.value })
                        }
                        placeholder="Admin username"
                        autoComplete="username"
                      />
                    </div>

                    {/* New Email */}
                    <div className="form-group">
                      <label className="form-label">New Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        value={credentialForm.newEmail}
                        onChange={(e) =>
                          setCredentialForm({ ...credentialForm, newEmail: e.target.value })
                        }
                        placeholder="admin@portfolio.dev"
                        autoComplete="email"
                      />
                    </div>

                    {/* New Password */}
                    <div className="form-group">
                      <label className="form-label">
                        New Master Password <span style={{ color: 'var(--text-muted)' }}>(leave blank to keep current)</span>
                      </label>
                      <div className="password-input-wrapper">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          className="form-input"
                          value={credentialForm.newPassword}
                          onChange={(e) =>
                            setCredentialForm({ ...credentialForm, newPassword: e.target.value })
                          }
                          placeholder="Enter new password (min. 6 chars)..."
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="input-eye-btn"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          title={showNewPassword ? 'Hide password' : 'Show password'}
                          tabIndex="-1"
                        >
                          {showNewPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Dynamic Password Strength Meter */}
                      {credentialForm.newPassword && (
                        <div className="password-strength-container">
                          <div className="strength-header">
                            <span>Password Strength:</span>
                            <strong style={{ color: getPasswordStrength(credentialForm.newPassword).color }}>
                              {getPasswordStrength(credentialForm.newPassword).label}
                            </strong>
                          </div>
                          <div className="strength-bars">
                            {[1, 2, 3, 4, 5].map((level) => {
                              const strength = getPasswordStrength(credentialForm.newPassword);
                              const isActive = level <= strength.score;
                              return (
                                <div
                                  key={level}
                                  className="strength-bar-segment"
                                  style={{
                                    backgroundColor: isActive ? strength.color : 'rgba(255,255,255,0.08)',
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    {credentialForm.newPassword && (
                      <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <div className="password-input-wrapper">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="form-input"
                            value={credentialForm.confirmPassword}
                            onChange={(e) =>
                              setCredentialForm({ ...credentialForm, confirmPassword: e.target.value })
                            }
                            placeholder="Re-type new password to confirm..."
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            className="input-eye-btn"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            title={showConfirmPassword ? 'Hide password' : 'Show password'}
                            tabIndex="-1"
                          >
                            {showConfirmPassword ? (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                              </svg>
                            ) : (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            )}
                          </button>
                        </div>
                        {credentialForm.confirmPassword && (
                          <div
                            style={{
                              fontSize: '0.76rem',
                              marginTop: '0.35rem',
                              fontWeight: 600,
                              color:
                                credentialForm.newPassword === credentialForm.confirmPassword
                                  ? '#50fa7b'
                                  : '#ff5555',
                            }}
                          >
                            {credentialForm.newPassword === credentialForm.confirmPassword
                              ? '✓ Passwords match'
                              : '✕ Passwords do not match'}
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="form-submit"
                      disabled={savingCredentials}
                      style={{ marginTop: '0.8rem' }}
                    >
                      {savingCredentials ? 'Updating in MongoDB...' : '💾 Update Credentials & Save Changes →'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
