export interface HeroConfig {
  theme: 'default' | 'dakhla' | 'futuristic' | 'neon';
  styles: {
    section: string;
    container: string;
    content: string;
    title: string;
    subtitle: string;
    cta: string;
    background: string;
    overlay: string;
  };
  animations: {
    title: {
      initial: any;
      animate: any;
      transition: any;
    };
    subtitle: {
      initial: any;
      animate: any;
      transition: any;
    };
    cta: {
      initial: any;
      animate: any;
      transition: any;
    };
  };
}

export const heroConfigs: Record<HeroConfig['theme'], HeroConfig> = {
  default: {
    theme: 'default',
    styles: {
      section:
        'relative min-h-screen flex items-center justify-center overflow-hidden',
      container: 'container mx-auto px-4 z-10 relative',
      content: 'text-center max-w-4xl mx-auto',
      title: 'text-5xl md:text-7xl font-bold text-white mb-6 leading-tight',
      subtitle:
        'text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed',
      cta: 'inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl',
      background:
        'absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900',
      overlay: 'absolute inset-0 bg-black/40',
    },
    animations: {
      title: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: 'easeOut' },
      },
      subtitle: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' },
      },
      cta: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay: 0.4, ease: 'easeOut' },
      },
    },
  },
  dakhla: {
    theme: 'dakhla',
    styles: {
      section:
        'relative min-h-screen flex items-center justify-center overflow-hidden',
      container: 'container mx-auto px-4 z-10 relative',
      content: 'text-center max-w-4xl mx-auto',
      title:
        'text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl',
      subtitle:
        'text-xl md:text-2xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg',
      cta: 'inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-orange-400',
      background:
        'absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-yellow-500',
      overlay: 'absolute inset-0 bg-black/30',
    },
    animations: {
      title: {
        initial: { opacity: 0, y: 30, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 1, ease: 'easeOut' },
      },
      subtitle: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay: 0.3, ease: 'easeOut' },
      },
      cta: {
        initial: { opacity: 0, y: 20, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.8, delay: 0.6, ease: 'easeOut' },
      },
    },
  },
  futuristic: {
    theme: 'futuristic',
    styles: {
      section:
        'relative min-h-screen flex items-center justify-center overflow-hidden',
      container: 'container mx-auto px-4 z-10 relative',
      content: 'text-center max-w-4xl mx-auto',
      title:
        'text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 leading-tight',
      subtitle:
        'text-xl md:text-2xl text-cyan-100 mb-8 max-w-2xl mx-auto leading-relaxed',
      cta: 'inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-cyan-400/50',
      background:
        'absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-black',
      overlay:
        'absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]',
    },
    animations: {
      title: {
        initial: { opacity: 0, y: 30, scale: 0.8 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 1.2, ease: 'easeOut' },
      },
      subtitle: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay: 0.4, ease: 'easeOut' },
      },
      cta: {
        initial: { opacity: 0, y: 20, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.8, delay: 0.8, ease: 'easeOut' },
      },
    },
  },
  neon: {
    theme: 'neon',
    styles: {
      section:
        'relative min-h-screen flex items-center justify-center overflow-hidden',
      container: 'container mx-auto px-4 z-10 relative',
      content: 'text-center max-w-4xl mx-auto',
      title:
        'text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-[0_0_20px_rgba(255,0,255,0.8)]',
      subtitle:
        'text-xl md:text-2xl text-pink-200 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]',
      cta: 'inline-block bg-transparent border-2 border-pink-500 hover:border-pink-400 text-pink-400 hover:text-pink-300 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] backdrop-blur-sm',
      background:
        'absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-pink-900',
      overlay:
        'absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.1)_0%,transparent_70%)]',
    },
    animations: {
      title: {
        initial: { opacity: 0, y: 30, scale: 0.8 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 1.5, ease: 'easeOut' },
      },
      subtitle: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay: 0.5, ease: 'easeOut' },
      },
      cta: {
        initial: { opacity: 0, y: 20, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.8, delay: 1, ease: 'easeOut' },
      },
    },
  },
};
