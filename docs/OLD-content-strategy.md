# thomaswhite.me content strategy

This is a content and structure plan for `thomaswhite.me`, not a code plan. It records the decisions made with Tom on 21 September 2026 so that anyone (Tom, or a future session) can implement it page by page without re-asking. Where it names files it is only so the reader knows where the current copy lives. No site pages change with this document; each phase in §10 is its own change.

---

## 1. Context

The site (`thomaswhite.me`, hand-written HTML on GitHub Pages) currently reads as a hobby homepage: ten pages of equal weight, the only physics content is one TEDx talk, the Programming page is dominated by early toy projects, one testimonial, a live placeholder box on Volunteering ("my lazy ass hasn't figured out what to put here yet"), and a "Free coding help" offer as the main call to action. Recent commits are all tone tweaks, footer dates, a custom scrollbar and test documentation. Nothing new in content.

Tom's goals for the next one to two years, in his words: "I will be focusing on university applications and getting internships/volunteering jobs for coding/physics (involving both official ones and I want to do more like namesake)." University subject is physics; volunteering is programming. He wants visitors to look at the real work.

---

## 2. Facts gathered about Tom (the raw material)

Everything below came from Tom in this session or is already on the site. Nothing else should be claimed.

**Identity and stage**
- Tom White (also Thomas White), London, Year 12 as of September 2026. UCAS applications autumn 2027. Not applying this cycle, so the site has roughly a year to mature, but content written now is what a tutor will read.
- Started coding at seven ("still my favourite hobby almost a decade later"). First language Lua (Roblox), then Python (favourite, best known), JavaScript/HTML/CSS, some C++.
- Interests stated on the site: programming, astrophysics, particle physics, drumming, hiking, AI including AI safety. Cat called Dusty with his own site (`dusty.thomaswhite.me`).

**Physics**
- TEDx talk "Bridging the Gap", 28 February 2026 (Year 11), on why General Relativity and Quantum Mechanics disagree, gravity across both, String Theory and the Theory of Everything. Full talk on YouTube (`YJ-s-Gx1FN0`), 60-second highlight video hosted locally, TEDx event page 67110. Eight youth speakers, four adult speakers, theme "Bridges". Tom has the script as text.
- IYPT (International Young Physicists' Tournament) in-school project, now finished. Tom did not take part in the national competition. Team of three investigated "factors affecting a magnetic Newton's cradle". They built the cradle from scratch, put tracking stickers on it, filmed in slow motion under different parameters, and Tom used motion-tracking software to turn the footage into data. Tom still has: slow-mo clips, tracking data/plots, photos of the build. No written report or slides.
- EPQ: will happen, not started. Topic unknown.
- Reading Tom would put his name to: almost all of Stephen Hawking; *Why Does E=mc²?* (Cox and Forshaw); *Immune* (Dettmer); *If Anyone Builds It, Everyone Dies* (Yudkowsky and Soares); *The Anxious Generation* (Haidt); *This Mortal Coil* (Doig); all of Dennis E. Taylor (Bobiverse). Plus "quite a lot of science fiction".

**Programming**
- Namesake: US non-profit, free name-change guides and tools for trans people. Tom contributes code to the website and services, and is currently doing non-code research. Can provide merged PR links, screenshots, and his role in words. Cause matters to him. He wants organisations to see: real contributions to a real codebase, working with a team and users, and that the cause matters.
- VAXTB: not yet built. A web tool "similar to ScreenTB by WHO" for TB vaccines. Volunteer role. Tom was asked by the team his dad works in. Can be public once finished. Decision: mention only in a homepage "Now" line until it ships.
- TechAssist: built for his grandparents, written and video guides for everyday computer tasks plus a one-click encrypted backup app. "Massive amount of time." No GitHub link on the card today.
- This website: hand-written, Playwright end-to-end, visual and accessibility tests, Lighthouse budgets, ESLint/Stylelint/html-validate, GitHub Actions CI, Better Stack status page, CookieYes consent, Formspree contact. Tom agreed this is a featured project.
- Friends of St John's Garden website (`stjohnsgardenEC1.org`) for an Islington council park group. Source of the one testimonial (Analisa Plehn).
- Early projects: Bouncing Ball Physics Simulation, Minesweeper (Python, three difficulties), Game of Life (click/drag to add cells), Chrome Dino (first game, Python), SplitMate. Tom wants to keep "some of my earliest projects" but redo the page around better-quality work. One embedded playable demo: Game of Life.
- Old YouTube channel `leopardbookshop`: Roblox Studio/Lua tutorials, later some Python. "Just over 400 subscribers and 108,000 views." Age at the time: not stated, to be added.

**Volunteering (non-code)**
- Islington Council Parks: Grow Show (catalogued entries), Apple Day (made apple juice), Spring Festival at Gillespie Park (welcomed visitors). Appeared in Islington Life and Islington Gazette.
- Mind charity shop: till, sorting donations.

**Other**
- Sport: running (parkrun PB 21:21), Spartan races (5K then two 10Ks a year), Brighton Triathlon, squash, tennis, cross-country.
- Music and drama: drums and piano since primary school, school band ("Sunday Bloody Sunday"), LAMDA Grades 1 to 6 including Grade 6 Bronze Medal, five distinctions and one merit.
- Gallery: 17 captioned photos (Spartan, TEDx, Berlin, Machu Picchu, Sweden kayaking, Bulgaria rafting/skiing, magic tricks, "CUCUMBERS").
- Contact: Formspree form with reCAPTCHA. Email deliberately hidden today. No LinkedIn.

---

## 3. Goals, audiences, success

**Primary audiences, in order**
1. Physics admissions tutors and teachers writing references (reading in 2027).
2. Employers, internship coordinators, and volunteer organisations looking for a developer.

**What a successful visit looks like**
- A tutor finds the Physics page in one click, reads a summary of the cradle investigation and the TEDx essay, and thinks "this person does physics beyond the syllabus and can write."
- An organisation finds Programming in one click, sees three real projects with proof (merged PRs, screenshots, role in words), sees "open to volunteer work" with web development named explicitly, and emails Tom.

**Tension to resolve**
Tom: "for university, physics mindset with coding is best, but then I would want to push programming more than physics to all other visitors." Resolution chosen: one homepage, one mixed grid (no split "doors"), with Physics and Programming as the first two and largest cards, and a label-style hero lede that names both.

---

## 4. Principles (apply to every page)

1. **Keep the voice, lose the sloppiness.** "Heyyy", "Hello from London :)", "Contact :)", the Dusty link, the jokes all stay. Tom: "the heyyy is good. However the lazy ass stuff is too far." Remove self-deprecation that undercuts the work ("Some are useful, most are not", "my lazy ass", "hundered of half-finished things"). Fix every typo.
2. **Summary first, click-through second.** Tom: "click through to new pages is lower than just reading, summaries should also exist to interest the reader about a link." Every deep page gets a medium-length summary on its parent page. Never a bare link.
3. **Ages and school years, not dates.** Tom: "add ages and school years to everything. Specific dates would often be cloggy and not useful." Every project, talk, competition and channel carries "at 15" or "Year 11" style context. The one exception is the TEDx date, which is already an event fact.
4. **Proof over claims.** For anything an employer or tutor might doubt, show the artefact: merged PR, screenshot, video clip, plot, quote. Where proof is not yet available, say "in progress" rather than imply it exists.
5. **Say exactly what happened.** IYPT was an in-school project, not the national round; VAXTB came via his dad's team and is not built; TechAssist has no public repo. State each plainly. Understatement with evidence beats overstatement.
6. **Physics and programming lead; everything else stays but shrinks.** Gallery stays because "it adds a real human to the page." Sport and Music & Drama merge. YouTube leaves the nav.
7. **Name web development, not just Python.** Tom: "I do a lot of web development, like this website and namesake."

---

## 5. Current site audit (what to change and why)

| Page | Keep | Change |
|---|---|---|
| Home | Hero structure, portrait, About, Dusty link, card grid, footer | Lede text; grid order and card copy; "Free coding help" block becomes "Open to volunteer work"; add "Now" section; About gets Year 12 |
| Programming | Story section, GitHub button, Namesake | Rebuild into Featured / Game of Life / Where I started; fix typos; move YouTube here as a section; cut the "doesn't involve interacting with people" line (see §7.3) |
| Sport | All content | Merge into "Sport & music" |
| Music & Drama | All content | Merge into "Sport & music" |
| Volunteering | Parks, Mind, Namesake, photos | Split into tech vs community; delete placeholder box; CTA block replaced |
| Gallery | Everything | Nothing, except add Physics-related photos if the cradle build photos suit it |
| TEDx | Videos, photos, summary | Becomes a deep page under Physics; gains the written essay |
| YouTube | Content | Off nav and footer; page stays as a deep link from Programming's "Where I started" |
| Testimonials | One quote | Stays in "More" with one quote; Tom will collect more |
| Contact | Form, states | Add a prominent email above the form, add LinkedIn, rewrite the "I don't put my email on the site" paragraph |

**Live copy errors to fix (verbatim from the pages)**
- Volunteering: "Hmm, not much here is there?" / "This box is a bit blank." / "Clearly, my lazy ass hasn't figured out what to put here yet, so it's just a placeholder." Delete the whole aside and the stray `<br>` before it.
- Programming: "Here are some of my project, among the hundered of half-finished things on my computer." Replace (see §7.3).
- Programming: "You can tell the graphic weren't very good but I put my focus on flexibility and realistic physics." → "The graphics aren't much to look at; I put the effort into flexibility and realistic physics."
- Sport: "I've also do squash" → "I also play squash".
- TEDx: "acrossd the two theories" → "across the two theories".
- YouTube: "knowning" → "knowing", "recieve" → "receive".
- Home meta description and og:description list "running, music, physics" in a hobby order; rewrite to lead with physics and programming (see §7.1).

---

## 6. Target site map

**Desktop navigation (left to right)**
Home · Physics · Programming · Volunteering · Sport & music · Gallery · More ▸ (TEDx talk, Testimonials) · Contact :)

**More menu**: TEDx talk, Testimonials. YouTube removed.

**Footer "Pages" group**: Home, Physics, Programming, Volunteering, Sport & music, Gallery. **Footer "More" group**: TEDx talk, Testimonials, GitHub, LinkedIn, Contact :).

**Deep pages (linked from parents with summaries, not in nav)**
- `/physics/magnetic-newtons-cradle/` — full investigation
- `/tedx/` — talk page plus essay (URL kept; it may be linked from the TEDx event and social posts)
- `/youtube/` — unchanged content, reached from Programming
- `/testimonials/` — reached from More

**Pages removed**: `/sport/` and `/music&drama/` are replaced by `/sport-and-music/`. Keep the old URLs redirecting (a meta refresh page or Jekyll redirect) since the Better Stack monitor and any inbound links use them. Update the monitor keyword list when this happens.

---

## 7. Page-by-page briefs

### 7.1 Home

**Hero**
- Eyebrow: "Heyyy" (unchanged).
- H1: "Hi, I'm Tom." (unchanged).
- Lede (chosen by Tom): **"Physics student, volunteer developer, occasional TEDx speaker."** Add one warm follow-on sentence so it still reads as a homepage, e.g. "This is where I keep the physics I'm working on, the things I've built for people, and some of the other stuff I get up to." Tom to approve wording.
- Buttons: "Have a look around" (unchanged), "Send me a message" (unchanged).
- Portrait note "Hello from London :)" (unchanged).

**About me** (revise, keep the voice)
- Add stage: "I'm in Year 12 in London." Keep interests, but reorder so physics and programming come first: "My main interests are physics (particularly astrophysics and particle physics) and programming. I started programming when I was seven..." Keep AI safety, drums, LAMDA, science fiction, Bobiverse and Hawking, Dusty.
- Reading mention already exists here; it will link to the reading section on Physics.

**Now** (new section, directly under About)
- Heading eyebrow "Right now", H2 "What I'm up to". Three to four short lines, updated roughly monthly by hand:
  - "Building VAXTB, a volunteer web tool for a TB vaccine research team (public when it's released)."
  - "Contributing to Namesake."
  - "Writing up my magnetic Newton's cradle investigation."
  - "Reading: [current book]."
- Add a small "Updated [Month Year]" line so staleness is visible and Tom is nudged to refresh it. If it goes more than three months without an update, that's the signal to remove the section rather than leave it rotting.

**Card grid "What do you want to look at?"** (reorder and recopy)
1. **Physics** (wide card, new). Image: a cradle build photo or TEDx stage. Copy: "My TEDx talk on quantum gravity, a magnetic Newton's cradle investigation with slow-mo tracking data, and what I'm reading."
2. **Programming** (wide card). Image: Namesake or this site rather than the bouncing balls. Copy: "Real projects for real people: Namesake, this website, TechAssist. Plus a playable Game of Life and where I started."
3. **Volunteering**. Copy: "Building for charities and local groups, and hands-on help at Islington parks and a Mind shop."
4. **Sport & music**. Copy: "Running, Spartan races, a triathlon, drums and LAMDA."
5. **Gallery**. Copy unchanged.
The TEDx card is removed from this grid because it now lives inside Physics; the "A few other bits" strip keeps Testimonials and Contact, drops YouTube.

**Open to volunteer work** (replaces "Free coding help", also on Volunteering and Contact)
- Eyebrow: "Open to volunteer work". H2: "Need a developer? I'm free."
- Body (Tom's requirements: not just Python, web development named): "I build websites and web apps (this site and Namesake are examples), Python tools, and small desktop apps. I've worked in a real open-source codebase with a team, and I've built things for my grandparents and for a council parks group. I'm happy to volunteer for charities, community groups and small organisations: a whole site, a fix, a tool, or a review. Tell me roughly what you need."
- Buttons: "Email me" (mailto, once the public email exists), "See what I've made" (→ /programming/).

**Metadata**: description → "Tom White: Year 12 physics student in London, volunteer developer, TEDx speaker. Physics investigations, real projects, and a few other bits."

### 7.2 Physics (new page, nav slot 2)

Purpose: give a physics tutor everything in one scroll, with click-throughs for depth. Structure:

1. **Hero**. Eyebrow "The bit for the physicists". H1 "Physics". Lede: "I want to understand how the universe works. Here's what I've done about it so far, and what I'm reading."
2. **Magnetic Newton's cradle investigation** (medium summary, ~150 words, one photo or a 5-second clip, link to the full page). Summary content: the question (what factors affect a magnetic Newton's cradle), team of three, built it from scratch, tracking stickers, slow-mo filming under different parameters, motion-tracking software to extract position data, one headline finding, one honest limitation. "Read the full investigation →".
3. **TEDx talk: Bridging the Gap** (medium summary, thumbnail, link to /tedx/). Reuse the existing "Why our two best theories don't agree" paragraph. Add: "I've since written the talk up as an essay with a reading list." Mark it "Year 11, age [15/16]".
4. **EPQ** (one paragraph placeholder once a topic exists; omit the section until then. Do not publish "coming soon").
5. **Reading** (see §8.6 for the format). Physics books first (Hawking, Cox & Forshaw), then the rest under "Beyond physics" with a sentence on why they're here.
6. **Small physics-flavoured code** cross-link: the Bouncing Ball simulation and Game of Life are physics-adjacent; one line each linking to Programming.

Metadata: title "Physics | Tom White"; description "A magnetic Newton's cradle investigation with motion-tracking data, my TEDx talk on quantum gravity, and what I'm reading."

### 7.2a Magnetic Newton's cradle (deep page)

Full investigation, written like a short lab report but readable. Sections and what goes in each:
- **Question**: which factors affect the behaviour of a magnetic Newton's cradle (state the specific ones the team varied: e.g. magnet strength/spacing, release height/angle, number of balls, whatever they actually varied).
- **Why it's interesting**: one paragraph. Magnetic coupling changes the "one in, one out" behaviour of the classic cradle; energy and momentum transfer becomes non-trivial.
- **What we built**: photos of the cradle, how it was made, the sticker markers.
- **Method**: slow-mo filming, which parameters, how many runs, the motion-tracking software (name it), what was extracted (position vs time, then velocity).
- **Results**: one or two plots with axes labelled and a sentence each. A short embedded slow-mo clip with markers visible.
- **What we found**: plain-language conclusions, with the caveats.
- **What went wrong / what I'd do next**: honest section. Tutors value this more than clean results.
- **My role**: "I did the motion tracking and data processing" (or whatever is accurate), team of three, in-school IYPT project, Year [11/12], age [x]. State explicitly that this was the in-school stage, not the national competition.
- Optionally: the tracking data as a downloadable CSV. A tutor who clicks that is sold.

### 7.2b TEDx page (existing, grows)

Keep everything. Add below the videos: **"The talk as an essay"** (see §8.1) and **"If you want to go further"** (three to five items: Hawking, Cox & Forshaw, and whatever Tom actually drew on for the talk). Add "Year 11, age [x]" near the date.

### 7.3 Programming (rebuild)

**Hero**: eyebrow "Yeah, this is basically my life." (keep). H1 "Programming". Lede replacement for the typo line: "I started coding when I was seven and it's still my favourite hobby almost a decade later. Here are the projects I'm proudest of, one you can play, and where it all started." Buttons: "My GitHub", and replace "My old YouTube channel" with "Open to volunteer work" (anchor to the CTA block at the bottom).

**How I got into it** (keep, edit two lines)
- Keep the Lua → Python → web → C++ story and the "before the age of AI" opinion (it's a genuine view and reads as thoughtful; tidy the grammar).
- **Remove or rewrite**: "I'll be honest, it doesn't involve interacting with people so I can just spend hours doing whatever I like." Tom wants organisations to see that he works with a team and users. This line says the opposite. Replace with something true, e.g. "I like that it's solitary when I want it to be, and collaborative when it matters. Working on Namesake taught me the second half."
- Move the St John's Garden mention into Volunteering's tech section; keep a one-line pointer here.

**Featured projects** (three, each with a full block: image/screenshot, one-paragraph "what it is", "what I did" in first person with specifics, "what was hard", proof links, age/year)
1. **Namesake**. What it is (non-profit, name-change guides and tools for trans people in the US, "built by and for the trans community"). What I did: list the actual features/fixes with links to merged PRs. Working with maintainers, following conventions, code review. Currently doing non-code research. Why it matters to me: one honest sentence. Proof: merged PR links, screenshot of the live product. Age/year.
2. **This website**. What it is: hand-written HTML/CSS/JS, no framework. What I did: everything, plus the part most people never see: Playwright end-to-end, visual regression and accessibility tests across three browsers, Lighthouse budgets, linting, CI on every push, a public status page with uptime monitoring, consent-gated analytics. What was hard: keeping ten hand-maintained headers in sync, visual baselines. Proof: link to the repo and to the status page. This block is Tom's strongest evidence of professional practice.
3. **TechAssist**. What it is: guides app for grandparents plus encrypted backup tool. What I did: the whole thing. What was hard: designing for people who aren't confident with computers; encryption done properly. Proof: screenshots; if the code can't be public, say "private repo, happy to walk through it". Age/year.

VAXTB is deliberately **not** here until it ships. It appears only in the homepage "Now" line.

**Play: Game of Life** (embedded, runs in the page). Two-sentence intro connecting it to physics: simple rules, emergent behaviour, cellular automata. Keep the click/drag interaction. Link to the code.

**Where I started** (compact strip, one line each with age): Chrome Dino ("my first game, Python, age [x]"), Minesweeper, Bouncing Ball Physics Simulation, SplitMate, and the **YouTube channel** ("I taught Roblox Studio and Lua on YouTube at [age]; just over 400 subscribers and 108,000 views. The channel is still up →" linking to /youtube/). Framing line: "None of these are polished. All of them taught me something." This replaces "Some are useful, most are not. :)".

**Open to volunteer work** block (same as home).

Metadata: description → "Projects I'm proudest of: Namesake, this website, TechAssist. A playable Game of Life, and where I started."

### 7.4 Volunteering (reorganise)

**Hero**: keep "Things I've helped with" / "Volunteering". Lede: tighten to two sentences covering both kinds.

**Section 1: Building for people** (tech volunteering)
- Namesake (summary + link to the Programming featured block, not a duplicate).
- Friends of St John's Garden website (what, for whom, link, the Analisa Plehn quote moved or duplicated here in context).
- TechAssist for grandparents (one line, link).
- VAXTB: not listed until shipped.

**Section 2: Hands-on** (community)
- Islington Parks: Grow Show, Apple Day, Spring Festival; what Tom did at each; Islington Life and Gazette mentions (link if online). Keep the photos.
- Mind charity shop: keep as is ("Yep, my hair was stupidly long" can stay; it's the voice).

**Remove**: the placeholder aside entirely.

**Bottom**: "Open to volunteer work" block.

### 7.5 Sport & music (merged page, new URL `/sport-and-music/`)

Two halves, same content as today's two pages, each half keeping its own eyebrow/H2. Running first (parkrun PB, Spartan, triathlon, squash/tennis/cross-country), then drums/piano/school band, then LAMDA with the grades and medal. Fix "I've also do squash". Add ages where natural ("LAMDA from Year [x] to Year [x]"). Old URLs redirect here.

### 7.6 Gallery

Unchanged. Consider adding one or two cradle build photos captioned as such, so the "real human" page also quietly points at the physics.

### 7.7 Testimonials

Stays in More with the one quote. Add a short line: "I'll add more as I collect them." Tom's collection targets, in order of value: Namesake maintainer (one sentence on his contributions), Islington Parks contact, LAMDA or drama teacher, a TechAssist user (grandparent, with humour). When there are three, promote the page.

### 7.8 Contact

- Rewrite the intro. Tom's decision: email more prominent than the form, plus LinkedIn. Structure: H2 "Email is best", a dedicated public address (e.g. `hello@thomaswhite.me`, obfuscated in markup or simply accepted as scrapeable), then "Or use the form", then GitHub and LinkedIn links.
- Replace "I don't put my email address on the site because bots will scrape it" with the new address.
- Add LinkedIn to the JSON-LD `sameAs` on every page and to the footer.
- Keep the "Open to volunteer work" block.

### 7.9 YouTube

Content unchanged. Nav and footer links removed. Add "Year [x], age [x]" context at the top. Fix "knowning" and "recieve".

---

## 8. Writing backlog (briefs Tom can write to)

Priority order agreed: Physics page and cradle investigation first, Programming rebuild second. Everything else after.

### 8.1 TEDx talk as an essay (first piece; Tom has the script)
- 1,200 to 1,500 words. Title "Bridging the Gap" or "Why our two best theories don't agree".
- Structure: the problem in one paragraph; what General Relativity gets right and where; what Quantum Mechanics gets right and where; where they collide (black hole interiors, the very early universe, the nature of gravity as curvature vs a force carried by a particle); the candidate bridges (String Theory, and at least one alternative, e.g. loop quantum gravity, so it doesn't read as one-sided); what would count as evidence; a closing paragraph on why a 15/16-year-old cares.
- One or two diagrams if Tom can make them (spacetime curvature, scale ladder).
- Reading list at the end, only things Tom actually read.
- Voice: first person, plain, no hedging about being young.

### 8.2 Magnetic Newton's cradle investigation
- See §7.2a for the section list. Length: 800 to 1,500 words plus figures. Two plots minimum. One clip. Photos of the build.
- Tom needs to gather: the clips, the data files/plots, the photos, the name of the tracking software, the exact parameters varied, the team members' roles (to state his own accurately).

### 8.3 Namesake write-up (for the featured block)
- 200 to 300 words plus a list of merged PRs with one-line descriptions. Include: how he found Namesake, first contribution, review feedback he received and acted on, what he'd like to do next there.

### 8.4 This website write-up
- 200 to 300 words. Lead with the invisible engineering (tests, CI, status page, accessibility). One paragraph on design decisions (no framework, self-hosted fonts, consent-gated analytics). Link to repo and status page.

### 8.5 TechAssist write-up
- 150 to 250 words. Who it's for, what it does, the encryption choice, what grandparents said. Screenshots.

### 8.6 Reading notes (Physics page)
- Format per book: title, author, one to three sentences of Tom's own reaction (not a summary), and optionally "read at [age]". Order: physics first.
- Honest note: of the list Tom gave, only Hawking and *Why Does E=mc²?* are physics. *Immune*, *This Mortal Coil*, *The Anxious Generation*, *If Anyone Builds It, Everyone Dies* and Bobiverse show breadth and curiosity, and the AI-safety book connects to the interest already stated on the homepage, so keep them under a "Beyond physics" subheading with a one-line reason each. A physics tutor will mainly weigh the physics list, so it is worth adding one or two more physics titles as Tom reads them (Cox & Forshaw's *The Quantum Universe* would be a natural next step from *Why Does E=mc²?*, but only list what's actually read).

### 8.7 Ongoing: "Now" section
- Three lines, monthly. Five minutes of work. If it lapses, remove it.

---

## 9. Things Tom needs to gather before implementation

- Public email address decision (and set it up on the domain).
- LinkedIn profile URL.
- Namesake: list of merged PRs with links; a screenshot of the live product.
- TechAssist: screenshots; decision on whether the repo can be public.
- Cradle: clips, data/plots, photos, software name, parameters, his own role.
- Ages/years for: TEDx (Year 11, age?), YouTube channel, Chrome Dino, Minesweeper, Game of Life, Bouncing Ball, TechAssist, LAMDA years.
- Islington Life / Gazette links if online.
- Tom's approval of the hero follow-on sentence and the "Open to volunteer work" copy.

---

## 10. Sequencing

**Phase 0 (this session)**: commit this document to `docs/content-strategy.md`.

**Phase 1, quick copy fixes** (one small change set, no structure change): delete the Volunteering placeholder; fix the six typos; replace the Programming lede line; hero lede; About gets Year 12; "Free coding help" → "Open to volunteer work" on the three pages that carry it; YouTube off nav and footer.

**Phase 2, Physics**: create the Physics page and the cradle deep page; add the essay and reading list to /tedx/; add Physics to nav/footer/home grid; remove the TEDx card from the home grid.

**Phase 3, Programming rebuild**: featured blocks, Game of Life embed, "Where I started" strip with YouTube.

**Phase 4, consolidation**: Sport & music merge with redirects; Volunteering split; Contact rewrite with email and LinkedIn; "Now" section; JSON-LD `sameAs` updates.

**Phase 5, ongoing**: testimonials collection, reading notes, Now updates, VAXTB when it ships, EPQ when it exists.

Each implementation phase follows AGENTS.md: update desktop nav, mobile nav and footer separately on every page; set metadata per page; keep `aria-current` correct; add redirects and update the Better Stack keyword manifest when URLs change; run `npm run check` and regenerate visual baselines where layout changes.

---

## 11. Honest risks and pushback

- **Two audiences, one homepage.** The label lede and grid order are a compromise. If analytics later show tutors bounce, revisit the "two doors" idea Tom declined.
- **The site is currently better engineered than it is written.** The test suite is impressive; the copy has typos and a placeholder. The writing backlog is the whole game now. Tom said "yes" to physics/CS explainers; the plan depends on that being true. If the first essay isn't done within about a month, cut the reading list and Now section and keep the site small and current.
- **VAXTB via family.** Tom's decision to keep it out until it ships is right. When it does ship, say plainly "I was asked by the team my dad works in"; the code is the credential, the introduction isn't.
- **IYPT wording.** It must say in-school project, not "IYPT competitor". A tutor can check.
- **Public email** will attract spam. Accept it or use a dedicated address; either beats a form for response rate.
- **Old URLs.** Merging Sport and Music & Drama removes two monitored routes. Redirects and monitor updates are part of that phase, not optional.

---

## 12. Verification (for the implementation sessions, not this one)

- Each phase: `git diff --check`, `npm run check`, then serve with `node tests/support/clean-url-server.mjs` and read every changed page at desktop, tablet and phone widths, keyboard only.
- Content check per page against §7: summary present for every deep link, age/year present on every project, no placeholder text, no typos from §5, "Open to volunteer work" names web development.
- After URL changes: `npm run test:production` and update `tests/support/page-manifest.mjs` and the Better Stack monitors per `docs/status-page-operations.md`.
