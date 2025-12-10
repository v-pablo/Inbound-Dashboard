import { 
  Users, MessageCircle, Phone, Instagram, 
  Facebook, Video, Headphones // <--- 1. Import Headphones icon
} from 'lucide-react';

export const INITIAL_AGENTS = ['Chinaza', 'Bukola', 'Anastacia'];

export const CHANNELS = [
  { 
    id: 'instagram', 
    name: 'Instagram', 
    color: 'from-pink-500 to-orange-500', 
    icon: Instagram, 
    shadow: 'shadow-orange-500/30' 
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    color: 'from-slate-900 to-slate-700 dark:from-slate-700 dark:to-slate-500', 
    icon: Video, 
    shadow: 'shadow-slate-500/30' 
  },
  { 
    id: 'whatsapp', 
    name: 'WhatsApp', 
    color: 'from-green-500 to-emerald-600', 
    icon: MessageCircle, 
    shadow: 'shadow-green-500/30' 
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    color: 'from-blue-600 to-blue-700', 
    icon: Facebook, 
    shadow: 'shadow-blue-500/30' 
  },
  { 
    id: '3cx', 
    name: '3CX Phone', 
    color: 'from-cyan-400 to-blue-400', 
    icon: Phone, 
    shadow: 'shadow-cyan-500/30' 
  },
  // --- NEW CARD HERE ---
  { 
    id: 'cx', 
    name: 'Customer Experience', 
    color: 'from-rose-500 to-red-600', 
    icon: Headphones, 
    shadow: 'shadow-rose-500/30' 
  },
  // ---------------------
  { 
    id: 'admin', 
    name: 'Admin', 
    color: 'from-purple-500 to-indigo-600', 
    icon: Users, 
    shadow: 'shadow-purple-500/30' 
  },
];