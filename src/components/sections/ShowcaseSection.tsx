'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { PortfolioProject } from '@/lib/data';
import { smoothScrollTo } from '@/lib/scrollUtils';
import {
  X,
  MapPin,
  Calendar,
  Users,
  Clock,
  Briefcase,
  Zap,
  Wrench,
  ChevronRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

// Categories mapping to database structure
const categories = [
  { id: 'all', label: 'Tất Cả' },
  { id: 'mega', label: 'Mega Concert' },
  { id: 'medium', label: 'Tầm Trung' },
  { id: 'vip', label: 'VIP / Private' },
];

export function ShowcaseSection({ projects }: { projects: PortfolioProject[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-50px' });

  // Global Home Page Scroll Handler
  // This handles scrolls for ANY ID on the home page when arriving from other pages
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash.replace('#', '');
    if (!hash) return;

    // Wait for the page and sections to be fully rendered
    const timer = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        // Decide the best scroll block based on the type of target
        const isProject = hash.startsWith('project-');
        const isService = hash === 'services';

        smoothScrollTo(hash, 1200, isProject ? -150 : -80);
      }
    }, 850); // Robust delay for Next.js hydration and layout stability

    return () => clearTimeout(timer);
  }, []); // Run once on home page mount

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p: any) => p.category === activeCategory);

  return (
    <section id="showcase" className="relative py-16 sm:py-24 responsive-section" style={{ background: '#02050A' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <motion.div ref={titleRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: titleInView ? 1 : 0, y: titleInView ? 0 : 30 }} transition={{ duration: 0.6 }} className="text-center mb-10">
          <p className="mb-4 font-semibold tracking-widest text-[0.70rem] uppercase font-body" style={{ color: 'var(--neon-green)', letterSpacing: '0.2em' }}>
            — PORTFOLIO —
          </p>
          <h2 className="mb-5 font-body" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1 }}>
            <span className="text-white block">Những Dự Án</span>
            <span className="block" style={{ color: 'var(--neon-green)', padding: '0.1em 0' }}>Chúng Tôi Tự Hào</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', fontFamily: 'var(--font-vietnam)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>
            Từ concert sân vận động đến tiệc cưới thân mật — mỗi dự án đều là một tác phẩm ánh sáng được kiến tạo với tất cả tâm huyết.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-[50px] text-[0.85rem] font-bold transition-all duration-300 border bg-transparent`}
                style={{
                  fontFamily: 'var(--font-vietnam)',
                  borderColor: isActive ? 'var(--neon-green)' : 'rgba(255,255,255,0.1)',
                  color: isActive ? 'var(--neon-green)' : 'rgba(255,255,255,0.4)',
                  boxShadow: isActive ? '0 0 20px rgba(0,255,136,0.1)' : 'none'
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <Link
              href={`/du-an/${project.slug}`}
              key={project.id}
              id={`project-${project.slug}`}
              className="group block outline-none h-full scroll-mt-32"
            >
              <motion.div
                initial="initial"
                whileHover="hover"
                className="group cursor-pointer relative h-full"
              >
                {/* Animated Card Content */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  variants={{
                    hover: {
                      y: -8,
                      borderColor: project.color,
                      boxShadow: `0 0 40px ${project.color}33, 0 20px 60px rgba(0,0,0,0.5)`,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                      }
                    }
                  }}
                  transition={{
                    duration: 0.5,
                    delay: (index % 3) * 0.1
                  }}
                  className="flex flex-col rounded-[20px] overflow-hidden card-laser h-full border"
                  style={{ background: '#050912', borderColor: 'rgba(255,255,255,0.06)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Image Top Half */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0F1A]">
                    <Image
                      src={project.thumbnailImage || 'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=800&q=80'}
                      alt={project.title}
                      fill
                      priority={index < 3}
                      className="object-cover transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full text-[0.62rem] font-bold font-body tracking-wider z-10 backdrop-blur-md"
                      style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${project.color}60`, color: project.color }}>
                      {project.categoryLabel.toUpperCase()}
                    </div>

                    {/* Bottom Image Gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-28 z-0" style={{ background: 'linear-gradient(to top, #050912, transparent)' }} />

                    {/* Laser Line Hover Effect - Moved here to separate image and content */}
                    <motion.div
                      variants={{
                        initial: { opacity: 0, scaleX: 0 },
                        hover: { opacity: 1, scaleX: 1 }
                      }}
                      transition={{ duration: 0.4 }}
                      className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none z-20"
                      style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
                    />
                  </div>

                  {/* Content Bottom Half */}
                  <div className="p-6 flex flex-col flex-1 z-10 relative">
                    <h3 className="text-white font-bold mb-1.5 line-clamp-2" style={{ fontSize: '1.25rem', fontFamily: 'var(--font-vietnam)', lineHeight: 1.35 }}>{project.title}</h3>
                    <p className="mb-5" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontFamily: 'var(--font-vietnam)' }}>{project.location} · {project.year}</p>

                    {/* Highlight Pill */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 self-start" style={{ background: `${project.color}15`, border: `1px solid ${project.color}30` }}>
                      <span className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: project.color }}></span>
                      <span style={{ color: project.color, fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-vietnam)' }}>{project.highlight}</span>
                    </div>

                    <p className="text-sm line-clamp-2 mb-7" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-vietnam)', lineHeight: 1.6 }}>
                      {project.description}
                    </p>

                    {/* View Details Button (Visual only) */}
                    <div
                      className="mt-auto w-full py-3 px-4 rounded-xl text-[0.85rem] font-bold flex items-center justify-center gap-2 transition-all duration-300 group/btn"
                      style={{
                        background: `${project.color}10`,
                        border: `1px solid ${project.color}30`,
                        color: project.color,
                        fontFamily: 'var(--font-vietnam)',
                      }}
                    >
                      Xem Chi Tiết
                      <span className="group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                    </div>

                  </div>
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* View on Facebook bottom button */}
        <div className="mt-16 flex justify-center">
          <a href="https://facebook.com/nguyenquang.hiep.39" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-[50px] text-[0.9rem] font-bold transition-all duration-300" style={{ color: 'var(--neon-green)', border: '1px solid var(--neon-green)', background: 'rgba(0, 255, 136, 0.03)', fontFamily: 'var(--font-vietnam)', boxShadow: '0 0 15px rgba(0, 255, 136, 0.05)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--neon-green)'; e.currentTarget.style.color = '#000'; e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 136, 0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 255, 136, 0.03)'; e.currentTarget.style.color = 'var(--neon-green)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.05)'; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            Xem Thêm Dự Án Trên Facebook
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
