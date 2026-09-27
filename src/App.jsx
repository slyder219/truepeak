import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowDown, ArrowRight, ArrowUp, Menu, MoveUpRight, X } from 'lucide-react'

const capabilities = [
  { number: '01', title: 'Operations', short: 'Make the work make sense.', text: 'We expose drag, clean up handoffs, and shape an operating rhythm people can actually keep.', code: 'FLOW / PEOPLE / PROCESS' },
  { number: '02', title: 'Systems', short: 'Tools shaped around reality.', text: 'Purpose-built internal systems and automations that match the business instead of fighting it.', code: 'LOGIC / DATA / CONTROL' },
  { number: '03', title: 'Procurement', short: 'Source with fewer unknowns.', text: 'Vendor coordination, practical sourcing, and logistics support that keeps critical work moving.', code: 'SOURCE / MOVE / DELIVER' },
  { number: '04', title: 'Digital', short: 'Small builds. Real leverage.', text: 'Focused applications and web products with clear scope, fast feedback, and useful outcomes.', code: 'DESIGN / BUILD / SHIP' },
]

const work = [
  { title: 'Photography', domain: 'seanlyder.com', label: 'Personal photography', href: 'https://seanlyder.com', preview: '/assets/projects/seanlyder.com.webp' },
  { title: "Sophia's Lattes", domain: 'sophiaslattes.com', label: 'Independent hospitality', href: 'https://sophiaslattes.com', preview: '/assets/projects/sophiaslattes.com.webp' },
  { title: 'Sophia Lyder', domain: 'sophialyder.com', label: 'Author', href: 'https://sophialyder.com', preview: '/assets/projects/sophialyder.com.webp' },
  { title: 'TruePeak US (This)', domain: 'truepeak.us', label: 'Company system', href: 'https://truepeak.us', preview: '/assets/projects/truepeak.us.webp' },
  { title: 'Old Scripts Showcase', domain: 'showcase.seanlyder.com', label: 'Experiments and output', href: 'https://showcase.seanlyder.com', preview: '/assets/projects/showcase.seanlyder.com.webp' },
  { title: '72 Degrees East, Inc.', domain: '72degreeseast.com', label: 'Company website', href: 'https://72degreeseast.com', preview: '/assets/projects/72degreeseast.com.webp' },
  { title: 'A Leading Concept LLC', domain: 'aleadingconcept.com', label: 'Company website', href: 'https://aleadingconcept.com', preview: '/assets/projects/aleadingconcept.com.webp' },
  { title: 'Telonote', domain: 'telonote.com', label: 'AI audio note taker with user-context transcription accuracy', href: 'https://telonote.com', preview: '/assets/projects/telonote.com.webp' },
  { title: 'GitHub', domain: 'github.com/slyder219', label: 'Working code', href: 'https://github.com/slyder219', preview: '/assets/projects/github.webp' },
]

const process = [
  ['01', 'Locate', 'Find the actual constraint, not the loudest symptom.'],
  ['02', 'Reduce', 'Remove what does not move the outcome.'],
  ['03', 'Make', 'Build the shortest credible path forward.'],
  ['04', 'Transfer', 'Leave the work clearer than we found it.'],
]

function InquiryForm({ onSubmit, status, context = 'General inquiry', selectedService = '' }) {
  return <form className="inquiry-form" onSubmit={onSubmit}>
    <input type="hidden" name="inquiry_type" value={context}/>
    <input type="checkbox" name="botcheck" className="form-trap" tabIndex="-1" autoComplete="off"/>
    <div className="form-pair">
      <label><span>01 / Name</span><input type="text" name="name" autoComplete="name" placeholder="Your name" required/></label>
      <label><span>02 / Email</span><input type="email" name="email" autoComplete="email" placeholder="you@company.com" required/></label>
    </div>
    <div className="form-pair">
      <label><span>03 / Company <i>Optional</i></span><input type="text" name="company" autoComplete="organization" placeholder="Company or organization"/></label>
      <label><span>04 / Area</span><select name="service" defaultValue={selectedService}><option value="" disabled>Select one</option>{capabilities.map(({title}) => <option key={title} value={title}>{title}</option>)}<option value="Something else">Something else</option></select></label>
    </div>
    <label><span>05 / The situation</span><textarea name="message" rows="4" placeholder={context === 'Project inquiry' ? 'What are you looking to build, improve, or launch?' : 'What is happening, and what should be different?' } required/></label>
    <div className="form-submit"><button type="submit" disabled={status.state === 'sending'}><span>{status.state === 'sending' ? 'Sending' : 'Send inquiry'}</span><ArrowRight size={18}/></button><p className={status.state} role="status" aria-live="polite">{status.message}</p></div>
  </form>
}

function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const smoothX = useSpring(x, { stiffness: 650, damping: 45 })
  const smoothY = useSpring(y, { stiffness: 650, damping: 45 })
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined
    const move = (event) => { x.set(event.clientX - 7); y.set(event.clientY - 7) }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])
  return <motion.div className="cursor" style={{ x: smoothX, y: smoothY }} aria-hidden="true"/>
}

function App() {
  const [intro, setIntro] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [inquiry, setInquiry] = useState({ open: false, context: 'General inquiry', service: '' })
  const [formStatus, setFormStatus] = useState({ state: 'idle', message: '' })
  const [isMobile, setIsMobile] = useState(false)
  const reducedMotion = useReducedMotion()
  const servicesRef = useRef(null)
  const heroRef = useRef(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '24%'])
  const heroScale = useTransform(heroProgress, [0, 1], [1, .88])
  const { scrollYProgress: serviceProgress } = useScroll({ target: servicesRef, offset: ['start start', 'end end'] })
  const serviceX = useTransform(serviceProgress, [0, 1], ['0vw', '-260vw'])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 800px)')
    const update = () => setIsMobile(media.matches)
    update(); media.addEventListener('change', update)
    const timer = window.setTimeout(() => setIntro(false), reducedMotion ? 50 : 1150)
    return () => { media.removeEventListener('change', update); window.clearTimeout(timer) }
  }, [reducedMotion])

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const scrollToHash = () => document.getElementById(hash)?.scrollIntoView({ behavior: 'auto', block: 'start' })
    scrollToHash()
    const timer = window.setTimeout(scrollToHash, reducedMotion ? 60 : 1200)
    return () => window.clearTimeout(timer)
  }, [reducedMotion])

  useEffect(() => {
    const locked = inquiry.open || menuOpen
    document.body.classList.toggle('locked', locked)
    const onKey = (event) => event.key === 'Escape' && (setInquiry((v) => ({ ...v, open: false })), setMenuOpen(false))
    window.addEventListener('keydown', onKey)
    return () => { document.body.classList.remove('locked'); window.removeEventListener('keydown', onKey) }
  }, [inquiry.open, menuOpen])

  const openInquiry = (context = 'General inquiry', service = '') => {
    setFormStatus({ state: 'idle', message: '' }); setMenuOpen(false); setInquiry({ open: true, context, service })
  }

  const submitContact = async (event) => {
    event.preventDefault(); const form = event.currentTarget
    setFormStatus({ state: 'sending', message: 'Sending your message...' })
    try {
      const data = new FormData(form)
      data.append('access_key', '915ab1ab-e025-4feb-86d9-aa9641f1608d')
      data.append('subject', 'New TruePeak US website inquiry')
      data.append('from_name', 'TruePeak US Website')
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error()
      form.reset(); setFormStatus({ state: 'success', message: 'Received. We will be in touch soon.' })
    } catch { setFormStatus({ state: 'error', message: 'Could not send. Try again or use hello@truepeak.us.' }) }
  }

  const closeMenu = () => setMenuOpen(false)

  return <>
    <CustomCursor/>
    <AnimatePresence>{intro && <motion.div className="intro" initial={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: .75, ease: [0.76, 0, 0.24, 1] }}><motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .35 }}>TRUEPEAK <sup>US</sup></motion.span><div className="intro-line"><i/></div><small>MAKE THE NEXT MOVE CLEAR</small></motion.div>}</AnimatePresence>

    <header className="site-head">
      <a className="wordmark" href="#top" onClick={closeMenu} aria-label="TruePeak US home"><span>TRUE</span><span>PEAK <b>US</b></span></a>
      <span className="head-note">Operations / Logistics / Systems</span>
      <div className="head-actions"><button className="head-contact" type="button" onClick={() => openInquiry('Project inquiry')}>Start a project <ArrowRight size={14}/></button><button className="menu-trigger" type="button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen}><span>Index</span><Menu size={20}/></button></div>
    </header>
    <a className="back-top" href="#top" aria-label="Back to top"><span>Top</span><ArrowUp size={16}/></a>

    <AnimatePresence>{menuOpen && <motion.nav className="menu-screen" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: .55, ease: [0.76, 0, 0.24, 1] }} aria-label="Main navigation"><button onClick={closeMenu} aria-label="Close navigation"><X/></button><div className="menu-count">TP / INDEX</div>{[['01','Services','#services'],['02','Position','#manifesto'],['03','Work','#work'],['04','Method','#method']].map(([n,label,href]) => <a href={href} onClick={closeMenu} key={n}><small>{n}</small><span>{label}</span><ArrowRight/></a>)}<button className="menu-contact" onClick={() => openInquiry('Custom inquiry')}>Start a conversation <MoveUpRight/></button></motion.nav>}</AnimatePresence>

    <main id="top">
      <section className="hero" ref={heroRef}>
        <motion.div className="hero-stage" style={reducedMotion ? {} : { y: heroY, scale: heroScale }}>
          <p className="hero-kicker">Independent problem-solving practice<br/>Based in the United States</p>
          <h1><span>MOVE</span><em>what matters.</em></h1>
          <div className="hero-support"><p>TruePeak US turns operational friction into useful systems, dependable movement, and measurable momentum.</p><button onClick={() => openInquiry('Project inquiry')}>Bring us the problem <ArrowRight/></button></div>
          <div className="hero-axis" aria-hidden="true"><i/><span>N</span><b>↑</b><small>TRUE / 001</small></div>
          <a className="scroll-cue" href="#purpose"><span>Scroll to locate</span><ArrowDown size={15}/></a>
        </motion.div>
      </section>

      <section className="purpose" id="purpose">
        <div className="utility-label">00 / THE PREMISE</div>
        <motion.p initial={{ opacity: .2 }} whileInView={{ opacity: 1 }} viewport={{ amount: .6 }}>Most businesses do not need more noise.</motion.p>
        <h2>They need the next move to become <i>obvious.</i></h2>
        <aside>Strategy is only useful when it changes what happens on Monday morning.</aside>
      </section>

      <section className="capability-scroll" id="services" ref={servicesRef}>
        <div className="capability-sticky">
          <div className="capability-head"><span>01 / CAPABILITIES</span><span>SCROLL TO TRAVERSE</span></div>
          <motion.div className="capability-track" style={isMobile || reducedMotion ? {} : { x: serviceX }}>
            {capabilities.map((item) => <article className="capability" key={item.number}>
              <div className="cap-no">{item.number}</div><div className="cap-cross" aria-hidden="true">+</div>
              <h3>{item.title}</h3><strong>{item.short}</strong><p>{item.text}</p>
              <button onClick={() => openInquiry('Service inquiry', item.title)}>Discuss {item.title.toLowerCase()} <ArrowRight size={17}/></button>
              <small>{item.code}</small>
            </article>)}
            <article className="capability cap-end"><span>THE COMMON THREAD</span><h3>Less drag.<br/>More signal.</h3><button onClick={() => openInquiry('Custom inquiry')}>What is slowing you down? <MoveUpRight/></button></article>
          </motion.div>
          <motion.div className="progress-rule"><motion.i style={{ scaleX: serviceProgress }}/></motion.div>
        </div>
      </section>

      <section className="manifesto" id="manifesto">
        <div className="manifesto-top"><span>02 / POSITION</span><span>TRUEPEAK, LLC</span></div>
        <h2>NO<br/><i>THEATER.</i></h2>
        <div className="manifesto-copy"><p>We work close to the problem.</p><p>We favor clear ownership, useful tools, direct communication, and systems that survive contact with real life.</p></div>
        <div className="manifesto-marquee" aria-hidden="true"><div>CLARITY IS AN OPERATING ADVANTAGE — CLARITY IS AN OPERATING ADVANTAGE —&nbsp;</div></div>
      </section>

      <section className="work" id="work">
        <header><span>03 / LINKS AND WORK</span><h2>Things<br/>in motion.</h2><p>A modest index of active sites, experiments, and working output.</p></header>
        <div className="work-index">{work.map((item, index) => <a className="work-card" href={item.href} target="_blank" rel="noreferrer" key={item.href}>
          <span className="work-num">0{index + 1}</span>
          <div className="work-title-wrap">
            {item.preview && <span className="work-thumb"><img src={item.preview} alt={`${item.title} preview`} loading="lazy" /></span>}
            <strong>{item.title}</strong>
          </div>
          <small>{item.label}</small>
          <em>{item.domain}</em>
          <MoveUpRight/>
        </a>)}</div>
      </section>

      <section className="range" aria-label="TruePeak US capabilities"><div className="range-line"><span>OPERATIONS</span><i>→</i><span>SYSTEMS</span><i>→</i><span>SOURCING</span><i>→</i><span>LOGISTICS</span><i>→</i><span>SOFTWARE</span></div></section>

      <section className="method" id="method">
        <header><span>04 / METHOD</span><h2>Four moves.<br/><i>No mystery.</i></h2></header>
        <div className="method-steps">{process.map(([n,title,text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="closing" id="contact">
        <span className="closing-label">05 / NEXT</span><h2>Bring us the<br/><i>stubborn part.</i></h2><p>Operations. Procurement. Logistics. Systems. Focused digital work.</p><button onClick={() => openInquiry('Custom inquiry')}>Start here <ArrowRight/></button>
      </section>
    </main>

    <footer><div className="footer-word"><span>TRUEPEAK</span><sup>US</sup></div><div className="footer-bottom"><span>Practical strategy / purposeful systems</span><button onClick={() => openInquiry('Custom inquiry')}>hello@truepeak.us</button><a href="https://github.com/slyder219" target="_blank" rel="noreferrer">GitHub ↗</a><span>© {new Date().getFullYear()} TruePeak LLC</span></div></footer>

    <AnimatePresence>{inquiry.open && <motion.div className="inquiry-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && setInquiry((v) => ({ ...v, open: false }))}><motion.section className="inquiry-panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: .6, ease: [0.76, 0, 0.24, 1] }} role="dialog" aria-modal="true" aria-labelledby="inquiry-title"><button className="inquiry-close" onClick={() => setInquiry((v) => ({ ...v, open: false }))} aria-label="Close inquiry"><X/></button><span className="panel-label">{inquiry.context} / TRUEPEAK US</span><h2 id="inquiry-title">{inquiry.service ? `Let's talk ${inquiry.service.toLowerCase()}.` : inquiry.context === 'Project inquiry' ? 'What should we build?' : 'What needs to move?'}</h2><InquiryForm key={`${inquiry.context}-${inquiry.service}`} onSubmit={submitContact} status={formStatus} context={inquiry.context} selectedService={inquiry.service}/></motion.section></motion.div>}</AnimatePresence>
  </>
}

export default App
