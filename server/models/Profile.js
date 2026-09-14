const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Manish',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    heroTagline: {
      type: String,
      default: 'Video Editor',
    },
    heroHeading: {
      part1: { type: String, default: 'Craft the' },
      highlight: { type: String, default: 'Perfect' },
      part2: { type: String, default: 'Frame.' },
    },
    heroSubtext: {
      type: String,
      default:
        'I transform raw footage into compelling cinematic narratives. With over 2 years of experience in commercial, documentary, and creative video editing.',
    },
    showreelLabel: {
      type: String,
      default: 'Play Showreel 2024',
    },
    showreelVideoUrl: {
      type: String,
      default: '',
    },
    experienceYears: {
      type: String,
      default: '7+',
    },
    projectsDelivered: {
      type: String,
      default: '120+',
    },
    viewsGenerated: {
      type: String,
      default: '40M+',
    },
    clientSatisfaction: {
      type: String,
      default: '98%',
    },
    aboutTagline: {
      type: String,
      default: 'The Craft Behind the Cut',
    },
    aboutBio1: {
      type: String,
      default:
        "I'm a freelance video editor based in Mumbai, working with brands, filmmakers, and content creators to bring stories to life. I started in broadcast television, cut my teeth on documentary series, and now work across commercial, narrative, and digital formats.",
    },
    aboutBio2: {
      type: String,
      default:
        'My approach is simple: understand the story first, then find the edit. Good editing is invisible — you feel it before you see it. I work closely with clients from rough cut to final delivery, making sure every frame earns its place.',
    },
    skills: {
      type: [String],
      default: [
        'Adobe Premiere Pro',
        'DaVinci Resolve Studio',
        'After Effects',
        'Final Cut Pro X',
        'Narrative Pacing & Storytelling',
        'Broadcast ACES Color Grading',
        'Multi-cam Live Syncing',
        'Sound Design & Audio Mastering',
      ],
    },
    email: {
      type: String,
      default: 'manish.edit@portfolio.dev',
    },
    contactChannels: {
      type: [
        {
          icon: {
            type: String,
            default: 'mail', // 'mail' | 'instagram' | 'paperplane' | 'whatsapp' | 'link'
          },
          label: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            default: '',
          },
        },
      ],
      default: [
        {
          icon: 'mail',
          label: 'manish.edit@portfolio.dev',
          url: 'mailto:manish.edit@portfolio.dev',
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
      ],
    },
    socialLinks: {
      type: [
        {
          name: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
      default: [
        { name: 'Instagram', url: 'https://instagram.com' },
        { name: 'LinkedIn', url: 'https://linkedin.com' },
        {
          name: 'WhatsApp',
          url: "https://api.whatsapp.com/send?phone=+918102951819&text=Hello,%20I'm%20interested%20in%20your%20services",
        },
        { name: 'YouTube', url: 'https://youtube.com' },
      ],
    },
    socials: {
      instagram: { type: String, default: 'https://instagram.com' },
      vimeo: { type: String, default: 'https://vimeo.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      youtube: { type: String, default: 'https://youtube.com' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', ProfileSchema);
