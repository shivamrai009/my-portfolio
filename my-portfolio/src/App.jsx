import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  Code2,
  Cpu,
  Database,
  Download,
  ExternalLink,
  Filter,
  Github,
  GitBranch,
  Linkedin,
  Mail,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';

const githubUsername = 'shivamrai009';
const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT || '';
const pinnedPriority = ['NextFlow', 'finance-graph-rag', 'smart-model-router', 'RAG-Pipeline-Optimizer'];
const resumeUrl = `/resume-latest.pdf?v=${new Date().toISOString().slice(0, 10)}`;

const coreSkills = [
  { icon: Cpu, label: 'AI Systems' },
  { icon: Workflow, label: 'MLOps Pipelines' },
  { icon: Database, label: 'Data Engineering' },
  { icon: ShieldCheck, label: 'Production Reliability' },
];

const featuredProjects = [
  {
    title: 'NextFlow',
    subtitle: 'Visual AI workflow builder for text, image, and video pipelines',
    description:
      'A Krea-style canvas application that lets teams compose reusable workflow nodes, run background jobs, and ship resilient pipelines with Gemini-first model routing and Groq fallback.',
    stack: [
      'Next.js 15',
      'TypeScript',
      'Tailwind 4',
      'Prisma',
      'PostgreSQL',
      'Trigger.dev',
      'Gemini',
      'Groq',
    ],
    live: 'https://next-flow-three.vercel.app',
    repo: 'https://github.com/shivamrai009/NextFlow',
  },
  {
    title: 'Finance Graph RAG',
    subtitle: 'Graph intelligence over financial data',
    description:
      'Combines Graph Neural Networks with Retrieval-Augmented Generation to discover relationships and produce high-signal financial analysis outputs.',
    stack: ['Python', 'Graph Neural Networks', 'RAG', 'FastAPI'],
    repo: 'https://github.com/shivamrai009/finance-graph-rag',
  },
  {
    title: 'Smart Model Router',
    subtitle: 'Cost-aware LLM traffic orchestration',
    description:
      'A gateway that scores prompt complexity and automatically routes requests to the most effective model for quality, latency, and cost balance.',
    stack: ['FastAPI', 'Groq', 'Llama 3', 'OpenAI'],
    repo: 'https://github.com/shivamrai009/smart-model-router',
  },
];

function App() {
  const [repos, setRepos] = useState([]);
  const [repoError, setRepoError] = useState('');
  const [activities, setActivities] = useState([]);
  const [activityError, setActivityError] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [formData, setFormData] = useState({ name: '', email: '', message: '', company: '' });
  const [contactStatus, setContactStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStartTime] = useState(Date.now());

  useEffect(() => {
    const controller = new AbortController();

    const loadRepos = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Unable to load repositories from GitHub right now.');
        }

        const data = await response.json();
        const cleaned = data
          .filter((repo) => !repo.fork)
          .sort((a, b) => {
            const scoreA = a.stargazers_count * 10 + a.forks_count;
            const scoreB = b.stargazers_count * 10 + b.forks_count;
            return scoreB - scoreA;
          })
          .slice(0, 8);

        setRepos(cleaned);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setRepoError(error.message);
        }
      }
    };

    const loadActivity = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${githubUsername}/events/public?per_page=6`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Unable to load recent GitHub activity.');
        }

        const data = await response.json();
        const cleaned = data
          .filter((event) => ['PushEvent', 'CreateEvent', 'PullRequestEvent'].includes(event.type))
          .slice(0, 6)
          .map((event) => ({
            id: event.id,
            type: event.type,
            repo: event.repo?.name,
            date: event.created_at,
            commits: event.payload?.commits?.length || 0,
            refType: event.payload?.ref_type || '',
          }));

        setActivities(cleaned);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setActivityError(error.message);
        }
      }
    };

    loadRepos();
    loadActivity();
    return () => controller.abort();
  }, []);

  const profileStats = useMemo(() => {
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    return [
      { label: 'Top Repos Loaded', value: repos.length || '--' },
      { label: 'Stars (Top Set)', value: totalStars || '--' },
      { label: 'Primary Focus', value: 'AI + Full Stack' },
    ];
  }, [repos]);

  const pinnedRepos = useMemo(() => {
    if (!repos.length) {
      return [];
    }

    const mapped = pinnedPriority
      .map((name) => repos.find((repo) => repo.name.toLowerCase() === name.toLowerCase()))
      .filter(Boolean);

    if (mapped.length >= 3) {
      return mapped.slice(0, 3);
    }

    const fallback = repos.filter((repo) => !mapped.some((selected) => selected.id === repo.id));
    return [...mapped, ...fallback].slice(0, 3);
  }, [repos]);

  const projectFilters = useMemo(() => {
    const tags = new Set();
    featuredProjects.forEach((project) => {
      project.stack.forEach((item) => {
        const normalized = item.toLowerCase();
        if (['python', 'fastapi', 'rag', 'groq', 'next.js 15'].includes(normalized)) {
          tags.add(item);
        }
      });
    });

    return ['All', ...Array.from(tags)];
  }, []);

  const filteredProjects = useMemo(() => {
    const source = featuredProjects.slice(1);
    if (projectFilter === 'All') {
      return source;
    }

    return source.filter((project) => project.stack.includes(projectFilter));
  }, [projectFilter]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (formData.company.trim()) {
      setContactStatus({ type: 'error', message: 'Spam protection triggered.' });
      return;
    }

    const elapsedSeconds = (Date.now() - formStartTime) / 1000;
    if (elapsedSeconds < 4) {
      setContactStatus({ type: 'error', message: 'Please take a moment before submitting.' });
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setContactStatus({ type: 'error', message: 'Please fill all required fields.' });
      return;
    }

    if (formData.message.trim().length < 15) {
      setContactStatus({ type: 'error', message: 'Message should be at least 15 characters.' });
      return;
    }

    try {
      setIsSubmitting(true);
      if (contactEndpoint) {
        const response = await fetch(contactEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
            source: 'portfolio',
          }),
        });

        if (!response.ok) {
          throw new Error('Contact API rejected the request.');
        }

        setContactStatus({ type: 'success', message: 'Message sent successfully. I will get back to you soon.' });
        setFormData({ name: '', email: '', message: '', company: '' });
        return;
      }

      const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name.trim()}`);
      const body = encodeURIComponent(
        `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\n\nMessage:\n${formData.message.trim()}`
      );
      window.location.href = `mailto:shivamrai047@gmail.com?subject=${subject}&body=${body}`;
      setContactStatus({
        type: 'success',
        message: 'Opening your email client. Add VITE_CONTACT_ENDPOINT for direct form delivery.',
      });
      setFormData({ name: '', email: '', message: '', company: '' });
    } catch (error) {
      setContactStatus({ type: 'error', message: error.message || 'Could not send message.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink text-zinc-100">
      <BackgroundLayer />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8 lg:px-10">
        <header className="mb-16 border-b border-zinc-800/80 pb-10">
          <nav className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <p className="font-display text-lg tracking-[0.2em] text-cyan-300">SHIVAM_RAI</p>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <SocialButton href="https://github.com/shivamrai009" label="GitHub" icon={Github} />
              <SocialButton
                href="https://www.linkedin.com/in/shivam-rai-761a37271/"
                label="LinkedIn"
                icon={Linkedin}
              />
              <SocialButton href="mailto:shivamrai047@gmail.com" label="Email" icon={Mail} />
            </div>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
                <Activity size={14} />
                Engineering AI products end to end
              </p>
              <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                Building systems that move from notebook experiments to production-grade products.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                I design reliable AI workflows, backend infrastructure, and high-performance interfaces.
                My work centers on practical intelligence: strong architecture, measurable quality, and
                developer-first tooling.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {coreSkills.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-200"
                  >
                    <Icon size={15} className="text-cyan-300" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">runtime/profile</p>
              <div className="space-y-3 rounded-xl border border-zinc-800 bg-ink/70 p-4 font-mono text-sm text-zinc-200">
                <p>
                  role: <span className="text-cyan-300">AI Engineer / Full-Stack Builder</span>
                </p>
                <p>
                  education: <span className="text-violet-300">Electrical Engineering, IIT Roorkee (2026)</span>
                </p>
                <p>
                  current_focus: <span className="text-lime-300">Autonomous workflows + MLOps</span>
                </p>
                <p>
                  availability: <span className="text-amber-300">Open to impactful projects</span>
                </p>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {profileStats.map((item) => (
                  <div key={item.label} className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-3">
                    <p className="font-display text-xl text-white">{item.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-zinc-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </header>

        <main className="space-y-16">
          <section>
            <SectionTitle
              icon={Rocket}
              title="Flagship Build"
              subtitle="Recently completed and currently live"
            />

            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="group relative overflow-hidden rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-cyan-500/10 via-zinc-950 to-zinc-900 p-6 sm:p-8"
            >
              <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />
              <div className="relative z-10">
                <h2 className="font-display text-3xl text-white">{featuredProjects[0].title}</h2>
                <p className="mt-2 text-sm uppercase tracking-[0.16em] text-cyan-200">
                  {featuredProjects[0].subtitle}
                </p>
                <p className="mt-5 max-w-3xl text-zinc-200">{featuredProjects[0].description}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {featuredProjects[0].stack.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-zinc-700 bg-zinc-900/90 px-3 py-1 text-xs text-zinc-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <ActionLink href={featuredProjects[0].live} label="Open Live App" />
                  <ActionLink href={featuredProjects[0].repo} label="Open Repository" />
                </div>
              </div>
            </motion.article>
          </section>

          <section>
            <SectionTitle icon={Code2} title="Selected Projects" subtitle="Core projects from my engineering track" />
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs uppercase tracking-wide text-zinc-300">
                <Filter size={12} />
                Filter
              </span>
              {projectFilters.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setProjectFilter(tag)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    projectFilter === tag
                      ? 'border-cyan-300/70 bg-cyan-400/15 text-cyan-200'
                      : 'border-zinc-700 bg-zinc-900/70 text-zinc-300 hover:border-zinc-500'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredProjects.map((project, index) => (
                <motion.article
                  key={project.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
                >
                  <p className="font-display text-2xl text-white">{project.title}</p>
                  <p className="mt-1 text-sm uppercase tracking-widest text-zinc-400">{project.subtitle}</p>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-300">{project.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((tool) => (
                      <span key={tool} className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300">
                        {tool}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                  >
                    View on GitHub <ArrowUpRight size={15} />
                  </a>
                </motion.article>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle
              icon={GitBranch}
              title="GitHub Repositories"
              subtitle="Live data pulled from my GitHub profile"
            />

            {repoError ? (
              <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {repoError}
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {repos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-xl border border-zinc-800 bg-zinc-900/55 p-4 transition hover:-translate-y-1 hover:border-cyan-300/40"
                  >
                    <p className="font-display text-xl text-white">{repo.name}</p>
                    <p className="mt-2 min-h-[60px] text-sm text-zinc-300">
                      {repo.description || 'Repository contains implementation details and technical docs.'}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                      <span>{repo.language || 'Multi-language'}</span>
                      <span>{repo.stargazers_count} stars</span>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm text-cyan-300">
                      Open repo <ExternalLink size={14} />
                    </span>
                  </a>
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionTitle
              icon={Github}
              title="Pinned Repositories"
              subtitle="Manually prioritized from your strongest public work"
            />
            {pinnedRepos.length ? (
              <div className="grid gap-4 md:grid-cols-3">
                {pinnedRepos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-cyan-300/35 bg-cyan-500/10 p-4 transition hover:-translate-y-1"
                  >
                    <p className="font-display text-xl text-white">{repo.name}</p>
                    <p className="mt-2 min-h-[46px] text-sm text-zinc-200">
                      {repo.description || 'Pinned engineering repository from GitHub.'}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-cyan-100/80">
                      <span>{repo.language || 'Mixed stack'}</span>
                      <span>{repo.stargazers_count} stars</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-300">
                Loading pinned repositories...
              </p>
            )}
          </section>

          <section>
            <SectionTitle
              icon={Sparkles}
              title="Now Building"
              subtitle="Recent commit and repository activity"
            />
            {activityError ? (
              <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {activityError}
              </p>
            ) : (
              activities.length ? (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-zinc-100">{formatActivity(activity)}</p>
                        <p className="text-xs text-zinc-400">{activity.repo}</p>
                      </div>
                      <p className="text-xs text-zinc-400">{formatRelativeTime(activity.date)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-300">
                  Loading recent activity...
                </p>
              )
            )}
          </section>

          <section>
            <SectionTitle
              icon={MessageSquare}
              title="Resume + Contact"
              subtitle="Download credentials and start a conversation"
            />

            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/55 p-5">
                <p className="font-display text-2xl text-white">Resume Access</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  Download my latest resume package and review project impact, stack depth, and shipped
                  production systems.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={resumeUrl}
                    download
                    className="inline-flex items-center gap-2 rounded-md border border-cyan-300/40 bg-cyan-400/15 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-200"
                  >
                    <Download size={14} />
                    Download Resume
                  </a>
                  <a
                    href="mailto:shivamrai047@gmail.com?subject=Resume%20Request"
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500"
                  >
                    <Mail size={14} />
                    Request PDF
                  </a>
                </div>
                <p className="mt-4 text-xs text-zinc-500">
                  Put your latest PDF at public/resume-latest.pdf. You can replace this file any day
                  without changing code.
                </p>
              </div>

              <form
                onSubmit={handleContactSubmit}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/55 p-5"
              >
                <p className="font-display text-2xl text-white">Contact Form</p>
                <p className="mt-2 text-sm text-zinc-300">
                  Includes anti-spam checks with a honeypot field and minimum completion time.
                </p>

                <label className="mt-4 block text-xs uppercase tracking-wide text-zinc-400" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300/60"
                  required
                />

                <label className="mt-3 block text-xs uppercase tracking-wide text-zinc-400" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300/60"
                  required
                />

                <label className="mt-3 block text-xs uppercase tracking-wide text-zinc-400" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300/60"
                  required
                />

                <div className="hidden" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input id="company" name="company" value={formData.company} onChange={handleChange} />
                </div>

                {contactStatus.message ? (
                  <p
                    className={`mt-3 text-xs ${
                      contactStatus.type === 'success' ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {contactStatus.message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 inline-flex items-center gap-2 rounded-md border border-cyan-300/40 bg-cyan-400/15 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <ArrowUpRight size={14} />
                </button>
              </form>
            </div>
          </section>
        </main>

        <footer className="mt-16 border-t border-zinc-800 pt-6 text-sm text-zinc-400">
          <p>Designed and engineered by Shivam Rai. Built with React, Tailwind CSS, and Framer Motion.</p>
        </footer>
      </div>
    </div>
  );
}

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-6">
    <p className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-200">
      <Icon size={14} />
      {subtitle}
    </p>
    <h2 className="font-display text-3xl text-white">{title}</h2>
  </div>
);

const SocialButton = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/70 px-3 py-2 transition hover:border-cyan-300/40 hover:text-cyan-200"
  >
    <Icon size={15} />
    <span>{label}</span>
  </a>
);

const ActionLink = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-2 rounded-md border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/20"
  >
    {label}
    <ArrowUpRight size={14} />
  </a>
);

const BackgroundLayer = () => (
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(6,182,212,0.22),transparent_35%),radial-gradient(circle_at_84%_74%,rgba(59,130,246,0.14),transparent_42%)]" />
    <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:46px_46px]" />
  </div>
);

const formatRelativeTime = (input) => {
  const then = new Date(input).getTime();
  const now = Date.now();
  const delta = Math.max(0, Math.floor((now - then) / 1000));

  if (delta < 60) {
    return `${delta}s ago`;
  }

  const minutes = Math.floor(delta / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const formatActivity = (activity) => {
  if (activity.type === 'PushEvent') {
    return `Pushed ${activity.commits} commit${activity.commits === 1 ? '' : 's'}`;
  }

  if (activity.type === 'CreateEvent') {
    return `Created ${activity.refType || 'repository'} artifact`;
  }

  if (activity.type === 'PullRequestEvent') {
    return 'Updated a pull request';
  }

  return 'Worked on repository updates';
};

export default App;