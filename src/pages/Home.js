import React, { useEffect, useState, useRef } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaGamepad, FaInstagram } from 'react-icons/fa';
import RetroGame from '../components/RetroGame';
import PenguinGame from '../components/PenguinGame';
import Model3D from '../components/Model3D';
import Decor3D from '../components/Decor3D';
import GitHubContributions from '../components/GitHubContributions';
import resumeData from './resume.json';
import projectsMeta from './projects.json';
import './Home.css';
import './Resume.css';
import './About.css';

const PROFILE = '/profile.jpg';

const REELS = [
  { url: 'https://www.instagram.com/p/DV4ZEQujEKr/', title: 'Unity MCP × RocketRide — demo reel', img: 'https://github.com/dsapandora/turn-based-strategy-mcp-server/raw/main/docs/social-demo-banner.png' },
  { url: 'https://www.instagram.com/p/DYJycPejF4O/', title: '3T Soccer — humanoid robot agent', img: 'https://raw.githubusercontent.com/dsapandora/3t_soccer_webots_agent/main/docs/instagram-reel-DYJycPejF4O-preview.jpg' },
  { url: 'https://www.instagram.com/reel/Cwy4ss7tsFF/', title: 'Research reel' },
  { url: 'https://www.instagram.com/p/B2I7XEaBkWZ/', title: 'Robotics — in the lab' },
  { url: 'https://www.instagram.com/p/BuVO-ZRhDWL/', title: 'AI research experiment' },
  { url: 'https://www.instagram.com/p/B1MU9BhBL3b/', title: 'Robots at work' },
];

function LogoBadge({ src, name, className }) {
  const [err, setErr] = useState(false);
  const initials = name.split(/[\s(]/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  if (!src || err) return <div className={`monogram ${className || ''}`}>{initials}</div>;
  return <img src={src} alt={name} className={className} onError={() => setErr(true)} loading="lazy" />;
}

function hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
}

// Elegant, demonstrative "3D object" project card (parallax tilt on hover).
function RepoCard({ repo }) {
  const ref = useRef(null);
  const m = projectsMeta[repo.name] || {};
  const hue = m.hue ?? hashHue(repo.name);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(760px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ''; };
  return (
    <a
      ref={ref} href={repo.url} target="_blank" rel="noopener noreferrer"
      className="repo3d" style={{ '--h': hue }}
      onMouseMove={onMove} onMouseLeave={reset}
    >
      <div
        className={'repo3d-cover' + (m.banner ? ' has-banner' : '')}
        style={m.banner ? { backgroundImage: `linear-gradient(180deg, rgba(8,10,22,0.05), rgba(8,10,22,0.66)), url(${m.banner})` } : undefined}
      >
        <span className="repo3d-icon">{m.icon || '{ }'}</span>
        {m.type && <span className="repo3d-type">{m.type}</span>}
        <span className="repo3d-name">{m.title || repo.name}</span>
      </div>
      <div className="repo3d-body">
        <p>{m.blurb || repo.description || 'An experiment worth a look.'}</p>
        {m.tags && (
          <div className="repo3d-tags">
            {m.tags.map((t) => <span key={t} className="repo3d-tag">{t}</span>)}
          </div>
        )}
        <div className="repo3d-foot">
          <span className="repo3d-repo mono">{repo.name}</span>
          <span className="repo3d-link">Open on GitHub →</span>
        </div>
      </div>
    </a>
  );
}

// Origin demo — gated behind a click so nothing loads (or plays sound) until asked.
function OriginDemo() {
  const [go, setGo] = useState(false);
  return (
    <div className="rg-frame demo-frame">
      {go ? (
        <iframe className="demo-iframe" src="https://lazy-racoon.github.io/RelicHunterMiharuDemo/" title="Relic Hunter Miharu — the origin" />
      ) : (
        <button className="demo-play" onClick={() => setGo(true)}>
          <span className="demo-cube">🗿</span>
          <span>Load the origin demo</span>
        </button>
      )}
      <div className="rg-scan" />
    </div>
  );
}

function Home() {
  const { experience, education, skills, summary } = resumeData;
  const [repos, setRepos] = useState([]);
  const [repoState, setRepoState] = useState('loading');

  useEffect(() => {
    fetch('https://dsapandora-backend.lazyracoon.tech/pinned-repos')
      .then((r) => r.json())
      .then((res) => {
        const edges = res?.data?.user?.pinnedItems?.edges || [];
        if (!edges.length) { setRepoState('error'); return; }
        setRepos(edges.map((e) => e.node));
        setRepoState('ok');
      })
      .catch(() => setRepoState('error'));
  }, []);

  // render the Instagram embeds once their script is ready
  useEffect(() => {
    let tries = 0;
    const id = setInterval(() => {
      if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
        window.instgrm.Embeds.process();
        clearInterval(id);
      } else if (++tries > 25) {
        clearInterval(id);
      }
    }, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="home" id="top">
      {/* HERO */}
      <section className="hero container">
        <div className="hero-text">
          <span className="pill"><span className="dot" />full-stack software engineer · AI specialist · code sorcerer</span>
          <h1>I build <span className="accent">AI software</span><br />and design <span className="mint">games</span>.</h1>
          <p className="lead">
            I'm <strong>Ariel Vernaza</strong> — a <strong>full-stack software engineer</strong> specialized
            in AI, founder of Lazyracoon, core maintainer of <strong>RocketRide</strong>, and a Panamanian
            game designer based in Madrid. I lead teams and take AI from zero to production.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#play"><FaGamepad size={15} /> Play the page</a>
            <a className="btn btn-ghost" href="#work">See my work</a>
          </div>
          <div className="hero-social">
            <a href="https://github.com/dsapandora" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
            <a href="https://linkedin.com/in/dsapandora" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="mailto:ariel@lazyracoon.tech" aria-label="Email"><FaEnvelope /></a>
          </div>
        </div>
        <div className="hero-avatar">
          <div className="avatar-frame"><img src={PROFILE} alt="Ariel Vernaza" /></div>
          <span className="avatar-tag">PLAYER 1</span>
        </div>
      </section>

      {/* GAMES — step inside a neon arcade */}
      <section className="games-section" id="play">
        <div className="arcade-glow" aria-hidden="true" />
        <div className="arcade-sign sign-left" aria-hidden="true">INSERT<br />COIN</div>
        <div className="arcade-sign sign-right" aria-hidden="true">GAME<br />OVER</div>
        <div className="arcade-invaders" aria-hidden="true">👾&nbsp;&nbsp;🕹️&nbsp;&nbsp;👻&nbsp;&nbsp;⭐</div>
        <div className="arcade-floor" aria-hidden="true" />
        <Decor3D src="/models/conjuror.glb" className="decor-conjuror-arcade" orbit="22deg 84deg 100%" />
        <Decor3D src="/models/raccoon.glb" className="decor-raccoon-arcade" orbit="28deg 84deg 100%" />
        <div className="container">
          <div className="arcade-neon">ARCADE</div>
          <div className="section-head">
            <span className="pill pill-arcade"><span className="dot" />insert coin</span>
            <h2>Step into the arcade.</h2>
            <p>Two playable games I coded from scratch in vanilla JS — plus the origin of a story that's becoming a 3D RPG.</p>
          </div>
          <div className="games-grid three">
            <div className="game-col">
              <div className="marquee">🦭 ICE DASH</div>
              <RetroGame />
              <div className="cabinet-controls" aria-hidden="true"><span className="stick" /><i className="btn-r" /><i className="btn-c" /><i className="btn-g" /></div>
            </div>
            <div className="game-col">
              <div className="marquee">🐧 PENGUIN DASH</div>
              <PenguinGame />
              <div className="cabinet-controls" aria-hidden="true"><span className="stick" /><i className="btn-r" /><i className="btn-c" /><i className="btn-g" /></div>
            </div>
            <div className="game-col">
              <div className="marquee">🗿 RELIC HUNTER · ORIGIN</div>
              <OriginDemo />
              <div className="rg-caption"><span>Where the story began — now growing into a 3D RPG.</span></div>
              <div className="cabinet-controls" aria-hidden="true"><span className="stick" /><i className="btn-r" /><i className="btn-c" /><i className="btn-g" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* WORK — straight from GitHub */}
      <section className="work-section" id="work">
        <div className="container work-inner">
        <div className="section-head">
          <span className="pill"><span className="dot" />what I ship</span>
          <h2>Selected work</h2>
          <p>Pinned repositories &amp; a year of commits, live from GitHub.</p>
        </div>

        {repoState === 'loading' && <p className="repo-note">Loading projects…</p>}
        {repoState === 'error' && (
          <p className="repo-note">See everything on <a href="https://github.com/dsapandora" target="_blank" rel="noopener noreferrer">github.com/dsapandora</a>.</p>
        )}
        {repoState === 'ok' && (
          <div className="repo-grid">
            {[...repos]
              .sort((a, b) => (projectsMeta[a.name]?.order ?? 99) - (projectsMeta[b.name]?.order ?? 99))
              .slice(0, 6)
              .map((repo) => <RepoCard key={repo.url} repo={repo} />)}
          </div>
        )}

        <div className="contrib"><GitHubContributions username="dsapandora" /></div>
        </div>
      </section>

      {/* CREATIVE — a moonlit, comic-tinted band, woven into the page */}
      <section className="creative-section" id="creative">
        <div className="forest-eyes" aria-hidden="true">
          <span className="eye eye-v" style={{ top: '20%', left: '7%' }} />
          <span className="eye eye-p" style={{ top: '58%', left: '12%' }} />
          <span className="eye eye-v" style={{ top: '32%', right: '9%' }} />
          <span className="eye eye-p" style={{ top: '70%', right: '16%' }} />
          <span className="eye eye-v" style={{ top: '15%', left: '44%' }} />
          <span className="eye eye-p" style={{ top: '82%', left: '52%' }} />
        </div>
        <div className="lore-bg" aria-hidden="true">
          <img src="/lore_1.webp" className="lore lore-a" alt="" loading="lazy" />
          <img src="/lore_2.webp" className="lore lore-b" alt="" loading="lazy" />
          <img src="/lore_3.webp" className="lore lore-c" alt="" loading="lazy" />
          <img src="/lore_4.webp" className="lore lore-d" alt="" loading="lazy" />
          <img src="/lore_5.webp" className="lore lore-e" alt="" loading="lazy" />
          <img src="/lore_6.webp" className="lore lore-f" alt="" loading="lazy" />
          <img src="/lore_7.webp" className="lore lore-g" alt="" loading="lazy" />
          <img src="/lore_8.webp" className="lore lore-h" alt="" loading="lazy" />
          <img src="/lore_9.webp" className="lore lore-i" alt="" loading="lazy" />
          <img src="/lore_10.webp" className="lore lore-j" alt="" loading="lazy" />
          <img src="/lore_11.webp" className="lore lore-k" alt="" loading="lazy" />
          <img src="/lore_12.webp" className="lore lore-l" alt="" loading="lazy" />
        </div>
        <div className="container creative-inner">
          <div className="creative-head">
            <span className="pill pill-lilac"><span className="dot" />beyond code</span>
            <h2>I design worlds, not just software.</h2>
            <p>An original action-RPG &amp; comic I craft on the side — a moonlit world of story, characters and art. There's more I want to tell you… just not yet.</p>
          </div>
          <div className="creative-media">
            <div className="creative-panel"><img src="/wip_rpg.webp" alt="Original fantasy comic artwork" loading="lazy" /></div>
            <Model3D src="/models/nightwarden.glb" label="" orbit="-24deg 84deg 108%" className="creative-fig" />
          </div>
        </div>
      </section>

      {/* EXPERIENCE + SKILLS */}
      <section className="container" id="experience">
        <div className="resume-block">
          <h3 className="block-title"><span className="arcade-num">01</span> Experience</h3>
          <div className="timeline">
            {experience.map((exp, i) => (
              <div className="tl-item" key={exp.company + i}>
                <div className="tl-dot" />
                <div className="gcard tl-card">
                  <div className="tl-logo"><LogoBadge src={exp.logo} name={exp.company} className="company-logo" /></div>
                  <div className="tl-body">
                    <div className="tl-top">
                      <h4>{exp.position}</h4>
                      <span className="tl-dates">{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <div className="tl-company">{exp.company}</div>
                    <p>{exp.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="resume-block">
          <h3 className="block-title"><span className="arcade-num">02</span> Education</h3>
          <div className="edu-grid">
            {education.map((edu, i) => (
              <div className="gcard edu-card" key={edu.institution + i}>
                <div className="edu-logo"><LogoBadge src={edu.logo} name={edu.institution} className="institution-logo" /></div>
                <div>
                  <h4>{edu.degree}</h4>
                  <div className="edu-inst">{edu.institution}</div>
                  <span className="edu-dates">{edu.startDate} — {edu.endDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="resume-block">
          <h3 className="block-title"><span className="arcade-num">03</span> Skills &amp; tools</h3>
          <div className="skills-grid">
            {skills.map((skill, i) => (
              <div className="skill-chip" key={skill.name + i}>
                <LogoBadge src={skill.logo} name={skill.name} className="skill-logo" />
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM — curated reels (research, robots, demos) */}
      <section className="ig-section container" id="reels">
        <div className="section-head">
          <span className="pill"><span className="dot" />on instagram · @dsapandora</span>
          <h2>Research, robots &amp; demos.</h2>
          <p>Reels from the lab and the arcade — AI, robotics and agentic experiments I share.</p>
        </div>
        <div className="ig-grid">
          {REELS.map((r) => (
            <blockquote
              key={r.url}
              className="instagram-media ig-embed"
              data-instgrm-permalink={r.url}
              data-instgrm-version="14"
            />
          ))}
        </div>
        <div className="ig-follow-row">
          <a className="btn btn-ghost" href="https://instagram.com/dsapandora" target="_blank" rel="noopener noreferrer"><FaInstagram /> Follow @dsapandora</a>
        </div>
      </section>

      {/* ABOUT */}
      <section className="container about-section" id="about">
        <div className="section-head">
          <span className="pill"><span className="dot" />about · lore</span>
          <h2>Full-stack engineer &amp; game designer.</h2>
        </div>
        <div className="about-grid">
          <div className="about-bio">
            <p>{summary}</p>
            <div className="beyond">
              <h3><FaGamepad /> Beyond the keyboard</h3>
              <div className="beyond-tags">
                <span>🥋 Kendo</span><span>🎮 Action RPGs</span><span>👾 Pixel art</span>
                <span>🕹️ Game engines</span><span>🏊 Swimming</span>
              </div>
            </div>
            <div className="alter-ego">
              <video className="alter-video" src="/alter_ego.mp4" poster="/alter_ego_poster.jpg" autoPlay loop muted playsInline />
            </div>
          </div>
          <div className="about-right">
            <aside className="about-contact gcard">
              <h3>Contact card</h3>
              <ul>
                <li><FaMapMarkerAlt /> Madrid, Spain · from Panamá 🇵🇦</li>
                <li><FaEnvelope /> <a href="mailto:ariel@lazyracoon.tech">ariel@lazyracoon.tech</a></li>
                <li><FaLinkedin /> <a href="https://linkedin.com/in/dsapandora" target="_blank" rel="noopener noreferrer">/in/dsapandora</a></li>
                <li><FaGithub /> <a href="https://github.com/dsapandora" target="_blank" rel="noopener noreferrer">@dsapandora</a></li>
              </ul>
            </aside>
            <Decor3D src="/models/mail_tree.glb" className="decor-tree-below" orbit="14deg 78deg 100%" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
