# thomaswhite.me content strategy

This is the content, structure and voice plan for `thomaswhite.me`. It records the decisions made with Tom on 21 and 22 September 2026 across five rounds of questions, so that anyone (Tom, or a future session) can implement it page by page without re-asking. Where it names files it is only so the reader knows where the current copy lives. No site pages change with this document; each phase in §12 is its own change.

**Implementation status (23 September 2026):** Phases 1 to 5 are implemented in the preview repository (`new.thomaswhite.me`). Phase 6 is ongoing writing. `docs/implementation-notes.md` lists what changed, every place Tom still has to write, and the open questions. Where the implementation departs from this plan it says so there.

Companion file: `docs/record.md` holds every fact, date and age from those conversations in note form, including things that will not appear on the site. It is Tom's private reference for his personal statement and CV. Ages on the site are computed from the birth date recorded there and never guessed.

---

## 1. Context

The site (`thomaswhite.me`, hand-written HTML on GitHub Pages) currently reads as a hobby homepage: ten pages of equal weight, the only physics content is one TEDx talk, the Programming page is dominated by early toy projects, one testimonial, a live placeholder box on Volunteering ("my lazy ass hasn't figured out what to put here yet"), and a "Free coding help" offer as the main call to action. Recent commits are all tone tweaks, footer dates, a custom scrollbar and test documentation. Nothing new in content.

Tom's goals for the next one to two years, in his words: "I will be focusing on university applications and getting internships/volunteering jobs for coding/physics (involving both official ones and I want to do more like namesake)." University subject is physics; volunteering is programming. He wants visitors to look at the real work.

Since the first draft of this plan, three things changed it materially:

- Tom is one of three student organisers of **TEDxDulwich Youth** (28 February 2027), the event he spoke at in 2026. He drives it: website, posters, application forms, advertising decks and scripts, all technical work, and coordination between the drama department, marketing, a sister school and staff.
- Tom has **weekly calls with a TB vaccine mathematical modelling team at LSHTM**, advising them on incorporating AI into their backend modelling workflow (AI practice, GitHub, prompts). It is the same team he is building the VAXTB tool for, and the team his dad works in.
- The site gets a **Blog**, and the site is explicitly a **source for the personal statement and CV** rather than something admissions tutors are expected to read.

---

## 2. Facts gathered about Tom (the raw material)

Everything below came from Tom or is already on the site. Nothing else should be claimed. Dates and ages are in `docs/record.md`; this section summarises.

**Identity and stage**
- Tom White (also Thomas White), London. Born June 2010. Year 12 from September 2026 (age 16). UCAS applications autumn 2027. Content written now is what a reference writer and an interviewer will read, and what Tom will quote from.
- Started coding at seven ("still my favourite hobby almost a decade later"). First language Lua (Roblox), then Python (favourite, best known), JavaScript/HTML/CSS, some C++. Does a lot of web development.
- Interests on the site: programming, astrophysics, particle physics, drumming, hiking, AI including AI safety. Cat called Dusty with his own site (`dusty.thomaswhite.me`).

**Physics and ideas**
- TEDx talk "Bridging the Gap", 28 February 2026 (Year 11, age 15), on why General Relativity and Quantum Mechanics disagree, gravity across both, String Theory and the Theory of Everything. Designed to be engaging and understandable rather than technical. Full talk on YouTube (`YJ-s-Gx1FN0`), 60-second highlight hosted locally, TEDx event page 67110. Eight youth speakers, four adult speakers, theme "Bridges". Tom has the script as text.
- IYPT (International Young Physicists' Tournament) in-school project, Year 11, now finished. Tom did not take part in the national competition. Team of three investigated "factors affecting a magnetic Newton's cradle". Magnetic cradles are rare and could not be sourced, so the team built one from scratch, put tracking stickers on it, filmed in slow motion under different parameters, and Tom used motion-tracking software to turn the footage into data. Parameters varied, in order of how thoroughly they were tested: initial release angle; number of magnets (3 or 5); separation between magnets at equilibrium; friction between wires and frame; magnet strength; mass of each magnet. Tom still has slow-mo clips, tracking data and plots, and build photos. No written report or slides.
- EPQ: will happen, not started. Topic unknown.
- Reading Tom would put his name to: almost all of Stephen Hawking; *Why Does E=mc²?* (Cox and Forshaw); *Immune* (Dettmer); *If Anyone Builds It, Everyone Dies* (Yudkowsky and Soares); *The Anxious Generation* (Haidt); *This Mortal Coil* (Doig); all of Dennis E. Taylor (Bobiverse). "Quite a lot of science fiction." Tom can also name papers he has read, both related to the talk and not, across physics, philosophy, psychology and AI.

**Programming**
- **Namesake**: US non-profit, free name-change guides and tools for trans people, "built by and for the trans community". Tom's merged contributions, from the repository history (July 2026, age 16, the week after Year 11 ended):

  | PR | Merged | What it does | Visible to users |
  |---|---|---|---|
  | [#717](https://github.com/namesakefyi/namesake/pull/717) | 24 Jul 2026 | Fixed the homepage support map: clicking states broke because hover code reordered SVG nodes. Added a separate outline layer and simplified the D3 selectors. 45 lines added, 19 removed. Co-authored with the maintainer after review. | Yes, homepage map |
  | [#725](https://github.com/namesakefyi/namesake/pull/725) | 27 Jul 2026 | Removed an image-service override that broke images in local development after a Cloudflare adapter upgrade. | No, developer fix |
  | [#728](https://github.com/namesakefyi/namesake/pull/728) | 27 Jul 2026 | Rewrote the clean-URL display formatter to use proper URL parsing and handle bare hostnames, tests updated. | Yes, directory listings |
  | [#729](https://github.com/namesakefyi/namesake/pull/729) | 27 Jul 2026 | Seven new support-directory entries for Illinois, Kentucky and North Carolina, with logos. Co-authored. | Yes, directory |
  | [#735](https://github.com/namesakefyi/namesake/pull/735) | 27 Jul 2026 | Made git hooks install automatically and documented ImageMagick in the setup guide. | No, tooling |
  | [#753](https://github.com/namesakefyi/namesake/pull/753) | 11 Sep 2026 | Download a blank PDF packet of every form. Built by the maintainer; Tom raised [issue #722](https://github.com/namesakefyi/namesake/issues/722) and led the idea and suggestions. | Yes, forms |

  Tom is currently doing non-code research for Namesake. It stays described as "research, in progress" with no further detail. The cause matters to him.
- **VAXTB**: not yet built. A web tool "similar to ScreenTB by WHO" for TB vaccines, for the LSHTM team above. Volunteer role. Public once finished. Decision: mention only in the homepage "Now" section until it ships.
- **LSHTM advisory work**: weekly calls advising the same team on AI in their workflow, GitHub practice and prompting. Can be stated as a short claim without evidence for now; a testimonial may follow later.
- **TechAssist**: built for his grandparents. Written and video guides for everyday computer tasks plus a one-click encrypted backup app. "Massive amount of time." Repo can go public. Honest limits: restore was manual, and the guide videos were hosted on Dropbox and are no longer online. It was an early build for family, not a production app, and the copy should say so lightly rather than defensively.
- **This website**: hand-written, Playwright end-to-end, visual and accessibility tests, Lighthouse budgets, ESLint/Stylelint/html-validate, GitHub Actions CI, Better Stack status page, CookieYes consent, Formspree contact. Featured project and evidence of practice (GitHub, CI, status pages).
- **TEDxDulwich Youth information site** (`sites.google.com/view/tedxdulwich`): a Google Sites page Tom made for applicants. Not coded; it is organising evidence, not programming evidence.
- **Friends of St John's Garden website** (`stjohnsgardenEC1.org`) for an Islington council park group. Source of the one testimonial (Analisa Plehn).
- Early projects: Bouncing Ball Physics Simulation, Minesweeper (Python, three difficulties), Game of Life (click/drag to add cells), Chrome Dino (first game, Python), SplitMate (first mobile app). Tom wants to keep "some of my earliest projects" but redo the page around better work. Game of Life is linked, not embedded, for now (§12 triggers).
- Old YouTube channel `leopardbookshop`: Roblox Studio/Lua tutorials, later some Python. "Just over 400 subscribers and 108,000 views." Age at the time: to confirm.

**Volunteering (non-code)**
- Islington Council Parks: Grow Show (catalogued entries), Apple Day (made apple juice), Spring Festival at Gillespie Park (welcomed visitors). Appeared in Islington Life and Islington Gazette.
- Mind charity shop: till, sorting donations.

**Other**
- Sport: running (parkrun PB 21:21), Spartan races (5K then two 10Ks a year), Brighton Triathlon, squash, tennis, cross-country.
- Music and drama: drums and piano since primary school, school band ("Sunday Bloody Sunday"), LAMDA Grades 1 to 6 including Grade 6 Bronze Medal, five distinctions and one merit.
- Gallery: 17 captioned photos, recently updated, and will keep growing.
- Contact: Formspree form with reCAPTCHA. Email deliberately hidden today. No LinkedIn yet.

---

## 3. Goals, audiences, success

**Who actually reads the site**
1. Employers, internship coordinators and volunteer organisations looking for a developer. They arrive from an email, a GitHub profile or a search.
2. Reference writers, interviewers and anyone who Googles Tom during applications. Admissions tutors rarely visit personal sites and UCAS statements cannot link, so the site is not a pitch to them.
3. Tom himself, when writing the personal statement and CV. The site is the collection he draws from.

**What a successful visit looks like**
- An organisation finds Programming in one click, sees real projects with proof (accepted changes to a real codebase, screenshots, role in words), sees "open to volunteer work" with web development named, and emails Tom.
- Someone checking Tom's story finds a Physics & Ideas page with an experiment he did, a talk he gave, an event he is organising, and what he reads, all with ages, and thinks "this is real and he can write".
- Tom opens `docs/record.md` and any page's Details line and has every date and specific he needs for a statement or CV.

**The UCAS shape.** The personal statement now answers three questions: why this course, how studies prepared you, and what you have done outside them. Every write-up on the site ends with one plain sentence of "what I took from it". That sentence is what gets quoted.

**Tension resolved.** Tom: "for university, physics mindset with coding is best, but then I would want to push programming more than physics to all other visitors." One homepage, one mixed grid, Programming first and Physics & Ideas second as the two wide cards, and a hero lede that names both.

---

## 4. Principles (apply to every page)

1. **Keep the voice, lose the sloppiness.** "Heyyy", "Hello from London :)", "Contact :)", the Dusty link and the jokes stay. Remove the placeholder box and fix every typo. Self-deprecation about Tom is fine anywhere; self-deprecation about the work ("Some are useful, most are not") is allowed only in page introductions, never in a proof block.
2. **Summary first, click-through second.** Tom: "click through to new pages is lower than just reading." Every deep page and every blog post gets a medium summary on its parent page. Never a bare link.
3. **Ages and school years in the copy, real dates in the markup.** Visible text says "Year 11" or "at 15". Each item carries its real month and year, and a review date, in data attributes (§11). The one visible exception is an event date that is itself a fact (the TEDx talks).
4. **Proof over claims, and specifics over adjectives.** "108,000 views", not "a popular channel". "Five changes accepted into Namesake's code in my first week", not "an active contributor". Where proof does not exist yet, say "in progress". The LSHTM advisory work is the one deliberate short claim without evidence, for now.
5. **Emphasis is allowed, once, plainly.** Not everything is downplayed. Each featured item may carry one sentence of pride ("This is the best thing I've built"). The word "passionate" may appear at most once on the whole site. Banned everywhere: impressive, incredible, journey, leverage, showcase.
6. **Say exactly what happened.** IYPT was an in-school project, not the national round. VAXTB and the LSHTM calls came via the team his dad works in, and the copy says so. TechAssist's restore was manual. Tom proposed the blank-packet feature; the maintainer built it. Understatement with evidence beats overstatement.
7. **Programming and physics lead; everything else stays but shrinks.** Gallery stays because "it adds a real human to the page" and it keeps growing. Sport, Music & Drama merge. YouTube leaves the nav.
8. **Name web development, not just Python.** "I do a lot of web development, like this website and namesake."
9. **One design language.** The Blog and every new page use the existing components (§8). Nothing may feel like a different site.

---

## 5. Voice and structure guide

This guide exists to inform AI suggestions and the site's structure (what space is made for and how it is labelled). Tom writes in his own voice; this tells an implementer what shape to give it.

**What the voice sounds like today** (examples to match)
- Eyebrows: "Heyyy" · "Yeah, this is basically my life." · "Twelve minutes too long?" · "Things I've helped with" · "A few other bits"
- Ledes and asides: "I'd love to hear from you. No, really." · "all talking about 'Bridges' in completely different ways, one literally." · "Just like the original, really." · "My voice has changed a lot since then..." · "Yep, my hair was stupidly long."
- Plain statements where it matters: "I started coding when I was seven and it's still my favourite hobby almost a decade later."

**Rules**
- Short declarative sentences. First person. Contractions. British spelling. At most one exclamation mark per page.
- The joke is a short aside at the end of a plain sentence. Jokes may appear in eyebrows, ledes and the last sentence of a section. Never in an H2, a figure caption, or the "What I did" part of a proof block.
- Emphasis by specificity (numbers, names, dates in Details). One plain sentence of pride per featured item. "Passionate" at most once site-wide. Banned words in §4.5.
- It is fine, and often good, for phrasing not to be perfect. Do not polish Tom's sentences into corporate ones.

**Page skeleton**
- Eyebrow: at most six words, cheeky allowed.
- H1: one to three words.
- Lede: one or two sentences of fact; the last may joke.
- Then sections.

**Section skeleton**
- Eyebrow: a plain topic label ("How I got into it", "Videos").
- H2: a plain statement or question, never a joke.
- One to three paragraphs of at most four sentences each.
- Optional figure with a sentence-case caption.
- Optional arrow link to the full page or post ("Read the full investigation →").

**Proof block skeleton** (featured projects, the cradle, TEDx organising, the LSHTM work)
- Image or screenshot.
- "What it is": one paragraph.
- "What I did": first person, specifics, plain words for non-developers (explain what a pull request is the first time).
- "What was hard": one paragraph. Honest.
- One sentence of pride, optional.
- "What I took from it": one sentence (the UCAS line).
- Details (collapsed): real dates, team size, hours, role, links.
- Proof links.

**Blog post skeleton**
- Eyebrow: month, year and age ("March 2027, age 16").
- Title. Lede. Prose in the 70-character column with an eyebrow-style subheading every 300 to 400 words.
- "Related" block linking the parent page and any project.
- Posts can be pure thoughts. Pinned posts are the informative ones.

---

## 6. Target site map

**Desktop navigation, in priority order**
Home · Programming · Physics & Ideas · Volunteering · Blog · Sport, music & drama · Gallery · More ▸ · Contact :)

- The nav is **priority-plus**: when the header is too narrow, trailing items move into More, last first (Gallery, then Sport, music & drama, then Blog...). Item padding shrinks within a set range before anything moves. Contact :) never moves. Without JavaScript, the last two items sit inside More by default and CSS media queries at known widths promote them out, so the nav never wraps. JavaScript measures and refines. Items duplicated for the no-JS fallback carry `aria-hidden` when not shown so screen readers hear each once. The mobile menu keeps the current breakpoint.
- **More** always holds: TEDx, Testimonials, plus any overflow.

**Footer "Pages" group**: Home, Programming, Physics & Ideas, Volunteering, Blog, Sport music & drama, Gallery. **Footer "More" group**: TEDx, Testimonials, GitHub, LinkedIn (when it exists), CV (PDF), Contact :).

**Deep pages and posts (linked from parents with summaries, not in nav)**
- `/physics/magnetic-newtons-cradle/` — full investigation
- `/tedx/` — the talk (2026) and organising it (2027); URL kept because the event page and social posts link to it
- `/blog/<slug>/` — one page per post; first post is the talk essay at `/blog/bridging-the-gap/`
- `/youtube/` — unchanged content, reached from Programming
- `/testimonials/` — reached from More
- `/Tom-White-CV.pdf` — download only, linked from the footer, About and Contact; unlinked `cv.html` is its source

**Pages removed**: `/sport/` and `/music&drama/` are replaced by `/sport-music-and-drama/`. Keep the old URLs redirecting (Jekyll redirect page or meta refresh) since the Better Stack monitor and inbound links use them. Update the monitor keyword list and `tests/support/page-manifest.mjs` in the same change.

**Blog file layout**: `blog/index.html` (permalink `/blog/`), `blog/<slug>.html` (permalink `/blog/<slug>/`), one shared `CSS/blog.css`. Tom writes each post in Markdown in `docs/blog-sources/<slug>.md`; an implementation session converts it to the post template. Markdown without front matter is not processed by GitHub Pages, so the sources stay raw and unlinked. *(Correction at implementation: GitHub Pages does render Markdown without front matter, through `jekyll-optional-front-matter`; this file and `docs/record.md` were public at `/docs/…`. `_config.yml` now excludes `docs/`, so the sources really are unpublished.)* Keeping the Markdown is the hedge for a later Eleventy migration (§12).

---

## 7. Page-by-page briefs

### 7.1 Home

**Hero**
- Eyebrow "Heyyy". H1 "Hi, I'm Tom." (unchanged).
- Lede: **"Physics student, volunteer developer, occasional TEDx speaker."** plus one warm sentence, e.g. "This is where I keep the physics I'm working on, the things I've built for people, and some of the other stuff I get up to." Tom to approve wording.
- Buttons "Have a look around", "Send me a message" (unchanged). Portrait note "Hello from London :)" (unchanged).

**About me** (revise, keep the voice)
- Add stage: "I'm in Year 12 in London." Reorder so physics and programming come first. Keep AI safety, drums, LAMDA, science fiction, Bobiverse, Hawking, Dusty. Reading mention links to the Physics & Ideas reading section. Add a small "CV (PDF)" link at the end.

**Now** (new section, directly under About)
- Eyebrow "Right now", H2 "What I'm up to". Three to five short lines, hand-updated. Tom will keep it current when there is something to add; slightly old items are acceptable. Current lines:
  - "Organising TEDxDulwich Youth (28 February 2027): the website, posters, application forms, and most of the technical bits."
  - "Building VAXTB, a volunteer web tool for a TB vaccine research team at LSHTM (public when it's released)."
  - "Weekly calls with that team about using AI in their modelling workflow."
  - "Contributing to Namesake."
  - "Writing up my magnetic Newton's cradle investigation."
- Carries `data-updated="YYYY-MM"` and a visible "Updated Month Year" line. The rot check (§11) flags it after 60 days.

**Card grid "What do you want to look at?"** (reorder and recopy; keep the current picture-card look, which Tom likes)
1. **Programming** (wide). Image: the Namesake map or this site. Copy: "Real projects for real people: Namesake, this website, TechAssist. Plus where I started."
2. **Physics & Ideas** (wide, new). Image: cradle build photo or TEDx stage. Copy: "A magnetic Newton's cradle investigation with slow-mo tracking data, my TEDx talk on quantum gravity, and what I'm reading."
3. **My TEDx talk** (stays, recopied). Copy: "I spoke at TEDxDulwich Youth in Year 11. This year I'm organising it."
4. **Volunteering**. Copy: "Building for charities and local groups, advising a research team on AI, and hands-on help at Islington parks and a Mind shop."
5. **Blog**. Copy: "Things I've written: the talk as an essay, how this site is built, and whatever else I'm thinking about."
6. **Sport, music & drama**. Copy: "Running, Spartan races, a triathlon, drums and LAMDA."
7. **Gallery**. Copy unchanged.
The "A few other bits" strip keeps Contact and Testimonials, drops YouTube.

**Call to action** (replaces "Free coding help", also on Programming, Volunteering and Contact)
- Eyebrow: not "Free coding help" (Tom: "looks like a scam advert", and people don't know a website is code). Proposed: "Volunteering, the online kind". Tom may veto.
- H2: **"Got something technical you need help with?"** (kept; Tom prefers it to every alternative offered).
- Body (approved): "If there's something technical you want doing, get in touch and we can talk about it. I'm happy to volunteer for charities, community groups and other small organisations. Mostly that means websites and web apps, like this site and Namesake, but also Python tools and small desktop apps. Anything big, small, long or short term: a whole website, a fix, a tool, or a second pair of eyes on something broken. Just tell me roughly what you need."
- Buttons: "Email me" (mailto), "See what I've made" (→ /programming/).

**Metadata**: description → "Tom White: Year 12 physics student in London, volunteer developer, TEDx speaker and organiser. Physics investigations, real projects, and a few other bits."

### 7.2 Physics & Ideas (new page, nav slot 3)

Purpose: the physics, academic and "intellectual side of hobbies" page. Not exclusively physics. Structure:

1. **Hero**. Eyebrow "Thinking about things". H1 "Physics & Ideas". Lede (approved): "A magnetic Newton's cradle we built and filmed, a TEDx talk about why gravity is awkward, and the physics, philosophy and AI papers I read when I should be doing homework."
2. **Magnetic Newton's cradle investigation** (proof block, ~150 words, one photo or 5-second clip, link to the full page). The question, why we had to build one, team of three, tracking stickers, slow-mo, motion tracking to data, one headline finding, one honest limitation, "Year 11". "Read the full investigation →".
3. **TEDx: the talk and the event** (medium summary, thumbnail, link to /tedx/). Reuse "Why our two best theories don't agree". Add that the talk now exists as an essay (link to the post) and that Tom is organising the 2027 event.
4. **EPQ**: omit until a topic exists. Do not publish "coming soon".
5. **Reading** (format in §9.8). Physics books first, then papers, then "Beyond physics" with a one-line reason each.
6. **Questions I'm stuck on**: five open questions in Tom's own words. More convincing than any reading list.
7. **Physics-flavoured code**: one line each for the Bouncing Ball simulation and Game of Life, linking to Programming.

Metadata: title "Physics & Ideas | Tom White"; description "A magnetic Newton's cradle investigation with motion-tracking data, my TEDx talk on quantum gravity, and what I'm reading and thinking about."

### 7.2a Magnetic Newton's cradle (deep page)

Full investigation, written like a short lab report but readable. Sections:
- **Question**: which factors affect the behaviour of a magnetic Newton's cradle. Parameters varied, in the order they were tested: initial release angle; number of magnets (3 or 5); separation at equilibrium; friction between wires and frame; magnet strength; mass of each magnet.
- **Why it's interesting**: magnetic coupling changes the "one in, one out" behaviour; energy and momentum transfer becomes non-trivial.
- **What we built**: magnetic cradles are rare and could not be sourced, so the team built one. Photos, how it was made, the sticker markers.
- **Method**: slow-mo filming, runs per parameter, the motion-tracking software (name it), what was extracted (position against time, then velocity).
- **Results**: at least two plots with labelled axes and a sentence each. One short clip with markers visible.
- **What we found**: plain-language conclusions with caveats. The best-tested parameters (release angle, magnet count) carry the strongest claims; the least-tested (magnet strength, mass) are stated as indicative.
- **What went wrong / what I'd do next**: honest section. Reviewers value it more than clean results.
- **My role**: "I did the motion tracking and data processing" (or whatever is accurate), team of three, in-school IYPT project, Year 11. State explicitly that this was the in-school stage, not the national competition.
- **What I took from it**: one sentence.
- Optionally the tracking data as a downloadable CSV.

### 7.2b TEDx page (existing, grows into two halves)

- **Hero**: eyebrow "TEDxDulwich Youth", H1 "Bridging the Gap" stays, lede gains "I spoke in 2026. I'm organising the 2027 event."
- **Half 1, The talk (Year 11, age 15)**: everything currently on the page. Below the videos, a summary of the essay with "Read the talk as an essay →" (blog post). "If you want to go further": three to five items Tom actually drew on.
- **Half 2, Organising it (Year 12)**: proof block. What it is: TEDxDulwich Youth, 28 February 2027, one of three student organisers (the licence is held by an adult; never say licensee). What I do: drive it forward; the applicant information site (`sites.google.com/view/tedxdulwich`, linked), posters, application forms, advertising decks and scripts, all the technical work; coordinating the drama department (the theatre), marketing and its posting rules, the sister school, and staff. What's hard: one honest paragraph. After the event, the summary blog post is linked here.
- Both halves carry Details lines with real dates.

### 7.3 Programming (rebuild)

**Hero**: eyebrow "Yeah, this is basically my life." (keep). H1 "Programming". Lede: "I started coding when I was seven and it's still my favourite hobby almost a decade later. Here are the projects I'm proudest of, and where it all started." Buttons: "My GitHub", and "Got something technical?" anchoring to the CTA block.

**How I got into it** (keep, edit two lines)
- Keep the Lua → Python → web → C++ story and the "before the age of AI" opinion; tidy the grammar.
- Replace "it doesn't involve interacting with people so I can just spend hours doing whatever I like" with something true, e.g. "I like that it's solitary when I want it to be, and collaborative when it matters. Namesake taught me the second half."
- St John's Garden moves to Volunteering; keep a one-line pointer here.

**Featured projects** (proof blocks per §5)
1. **Namesake**. What it is. What I did, in plain words: "Five changes accepted into Namesake's code in my first week (July 2026, age 16). A pull request is a proposed change that the maintainers review and accept." Then the list: fixed the interactive support map on the homepage; fixed a bug that stopped images loading for developers; rewrote how website addresses are shown in the directory, with tests; added seven organisations to the directory; made the developer tooling set itself up. "I also proposed the blank-forms download and wrote the issue for it; the maintainer built it." Currently doing research for the project. Why it matters: one honest sentence. Proof: PR links, a before-and-after screenshot of the map. Details: dates, co-authored with the maintainer after code review.
2. **This website**. What it is: hand-written HTML/CSS/JS, no framework. What I did: everything, including the part most people never see: end-to-end, visual regression and accessibility tests across three browsers, Lighthouse budgets, linting, CI on every push, a public status page with uptime monitoring, consent-gated analytics. What was hard: ten hand-maintained headers, visual baselines. Links: repo, status page, the "How this site works" post. This is Tom's strongest evidence of professional practice.
3. **TechAssist**. What it is: guides app for grandparents plus encrypted backup tool. What I did: the whole thing, at age [to confirm]. What was hard: designing for people who aren't confident with computers. Honest line: early build for family; restore was manual; the videos are no longer online. Proof: screenshots, public repo.

VAXTB is **not** here until it ships. TEDxDulwich Youth's Google Site is not here either; it is on the TEDx page as organising evidence.

**Using AI** (new short section)
- Tom's existing view ("lucky to have started before the age of AI") plus how he actually uses it now, and a one-paragraph pointer to the LSHTM advisory work on Volunteering. Later, a pinned post on AI practice for a small research team.

**Where I started** (compact strip, one line each with age): Chrome Dino ("my first game, Python, age [x]"), Minesweeper, Bouncing Ball Physics Simulation, Game of Life ("playable: clone the repo and run it" with a link), SplitMate, and the YouTube channel ("I taught Roblox Studio and Lua on YouTube at [age]; just over 400 subscribers and 108,000 views. The channel is still up →"). Framing line: "None of these are polished. All of them taught me something." The intro joke "Some are useful, most are not. :)" may stay above the strip because it is a page-intro joke, not a proof-block one.

**CTA block** (as home).

Metadata: description → "Projects I'm proudest of: Namesake, this website, TechAssist. How I use AI, and where I started."

### 7.4 Volunteering (reorganise)

**Hero**: keep "Things I've helped with" / "Volunteering". Lede: two sentences covering building, advising and hands-on.

**Section 1: Building for people**
- Namesake (summary + link to the Programming block).
- Friends of St John's Garden website (what, for whom, link, the Analisa Plehn quote in context).
- TechAssist (one line, link).
- VAXTB: not listed until shipped.

**Section 2: Advising** (new)
- Weekly calls with a TB vaccine modelling team at LSHTM about bringing AI into how they build the backend of their model: AI practice, GitHub, prompts. "The team my dad works in asked me." Short claim, no evidence yet; a testimonial may follow. Details: started [month], cadence weekly.

**Section 3: Hands-on**
- Islington Parks: Grow Show, Apple Day, Spring Festival; what Tom did at each; Islington Life and Gazette mentions (link if online). Keep the photos.
- Mind charity shop: keep ("Yep, my hair was stupidly long" stays).

**Remove**: the placeholder aside. **Bottom**: CTA block.

### 7.5 Blog (new page and post template)

- **Index** (`/blog/`): eyebrow "Things I've written", H1 "Blog", lede one line. **Pinned** strip at the top using the homepage card grid (up to three). Then the full list newest first: date and age eyebrow, title, one-line summary.
- **Post template**: page hero (eyebrow with month, year, age; title; lede), prose column, "Related" block, footer. Same header and footer as every page.
- **Planned posts, in order**: "Bridging the Gap" (the talk as an essay, pinned); "How this site works" (pinned); "Organising TEDxDulwich Youth" (after the event, pinned); "Using AI in a small research team" (from the LSHTM work); reading and thought posts as they come.
- Subject pages summarise and link their posts (principle 2).

### 7.6 Sport, music & drama (merged page, `/sport-music-and-drama/`)

Nav label "Sport, music & drama". Three parts with their own eyebrow and H2: running (parkrun PB, Spartan, triathlon, squash, tennis, cross-country), drums, piano and the school band, then LAMDA with grades and medal. Fix "I've also do squash". Ages where natural ("LAMDA from Year [x] to Year [x]"). Old URLs redirect here.

### 7.7 Gallery

Layout unchanged. Add cradle build photos and TEDx organising photos as they exist, captioned. The page keeps growing.

### 7.8 Testimonials

Stays in More with the one quote. Add "I'll add more as I collect them." Collection targets: Namesake maintainer, the LSHTM team, Islington Parks contact, LAMDA or drama teacher, a TechAssist user. When there are three, promote the page.

### 7.9 Contact

- H2 "Email is best". Address: `thomasawhite321@gmail.com` now. Switch to `tom@thomaswhite.me` when the domain mailbox is set up (§12 triggers). Then "Or use the form", then GitHub, LinkedIn (when it exists) and the CV PDF.
- Replace "I don't put my email address on the site because bots will scrape it".
- Keep the CTA block. Keep "Contact :)" as the nav label.

### 7.10 YouTube

Content unchanged. Off nav and footer. Add "age [x]" context at the top. Fix "knowning" and "recieve".

### 7.11 CV

`cv.html`: an unlinked page with `<meta name="robots" content="noindex">`, in the site's design, generated to `/Tom-White-CV.pdf` by a Playwright print script (`npm run build:cv`). The PDF is committed and linked from the footer, About and Contact. The PDF itself will be indexed by search engines eventually; Tom accepts that.

---

## 8. Component briefs (one design language)

Every new element maps to an existing class so implementation sessions do not invent a second look. Shared components go in `CSS/general.css`; page-only layout in the page stylesheet.

| Component | Used on | Built from |
|---|---|---|
| Proof block | Programming, Physics & Ideas, TEDx, Volunteering | `.project-card.editorial-card` extended with subheadings "What it is / What I did / What was hard / What I took from it", a `.button-row` of proof links, and a Details toggle |
| Details toggle | every dated item | existing `initialiseInfoToggles()` (`aria-controls` + `data-info-toggle`); collapsed by default; plain text list |
| Post layout | Blog posts, cradle page | `.page-hero` + `.prose` (70ch) + `.section--paper` "Related" |
| Figure row | cradle page, TEDx | `.media-card.editorial-card` + `.image-frame` + `<figcaption>` as on `/tedx/` |
| Compact list | Where I started, reading, Now, Questions I'm stuck on | new shared `.compact-list`: one line per item, eyebrow-style age label, optional arrow link |
| Pinned strip | Blog index | the homepage `.path-card` grid, three across |
| Post list | Blog index | new `.post-list`: rows of eyebrow (date, age), title link, one-line summary |
| Priority-plus nav | every page | existing `.nav-links` and `.nav-more`, plus measuring logic in `initialiseNavigation()` and CSS media queries for the no-JS fallback |
| CTA block | Home, Programming, Volunteering, Contact | existing block, new copy |

Date attributes (§11) go on the outermost element of each proof block, list item and the Now section.

---

## 9. Writing backlog (briefs Tom writes to, in this order)

Tom writes; an implementation session places the text into the templates. Each brief says what to write about, how long, and what to attach.

### 9.1 "Bridging the Gap", the talk as a blog post (first, pinned; Tom has the script)
- 800 to 1,000 words. A summary of the talk, not a new technical essay; the talk was designed to be engaging rather than questionable, and the post keeps that level.
- Structure: the problem in one paragraph; what General Relativity gets right; what Quantum Mechanics gets right; where they collide; the bridges the talk mentioned; why a 15-year-old cared.
- Add a closing paragraph, **"Since the talk"**: anything learned or that Tom would change now.
- Reading list at the end, only things actually read.
- Voice: first person, plain, no hedging about being young. Eyebrow "February 2026, age 15".

### 9.2 Magnetic Newton's cradle investigation
- 800 to 1,500 words plus figures, sections per §7.2a. Two plots minimum, one clip, build photos.
- Gather: clips, data and plots, photos, tracking software name, runs per parameter, team roles.

### 9.3 "How this site works" (blog post, pinned)
- 600 to 900 words. Lead with the invisible engineering: tests, CI, visual baselines, Lighthouse budgets, status page, consent-gated analytics, image pipeline, accessibility checks. One paragraph on design decisions (no framework, self-hosted fonts). One paragraph on what building it taught (GitHub practice, status pages, what "best practice" turned out to mean). Link to repo and status page.

### 9.4 TEDxDulwich Youth, organising it
- Now: 200 to 300 words for the TEDx page proof block (§7.2b) plus one Now line, refreshed when there is news.
- After 28 February 2027: a full blog post, 1,000 to 1,500 words, pinned. What happened, what went wrong, what Tom decided, what he took from it.

### 9.5 Namesake write-up
- 200 to 300 words for the proof block, from the PR table in §2, in plain words. Include how he found Namesake, the first contribution, review feedback he acted on, what he'd do next there. An implementation session can draft this from the diffs for Tom to correct.

### 9.6 TechAssist write-up
- 150 to 250 words. Who it's for, what it does, what grandparents said, the honest limits, screenshots.

### 9.7 LSHTM advisory paragraph
- 100 to 150 words for Volunteering §7.4 Section 2. What the team does, what the calls cover, one example of advice that changed something. Later, a post "Using AI in a small research team".

### 9.8 Reading and questions (Physics & Ideas)
- Per book or paper: title, author, one to three sentences of Tom's own reaction (not a summary), optionally "read at [age]". Physics first, then papers (physics, philosophy, psychology, AI), then "Beyond physics" with a one-line reason each.
- "Questions I'm stuck on": five, in Tom's words.

### 9.9 Small edits
- Sport, music & drama: ages. YouTube: age line. Contact: Tom approves the rewrite. Home: approve the hero follow-on sentence and the CTA eyebrow.

---

## 10. Things Tom needs to gather before implementation

- LinkedIn profile URL (when created).
- Namesake: a before-and-after screenshot of the support map; the live product screenshot.
- TechAssist: screenshots; make the repo public.
- Cradle: clips, data and plots, photos, software name, parameters and runs, his own role.
- TEDx organising: photos, the poster, dates of milestones for Details.
- Ages to confirm (in `docs/record.md`): YouTube channel, Chrome Dino, Minesweeper, Game of Life, Bouncing Ball, TechAssist, LAMDA years, start month of the LSHTM calls.
- Islington Life and Gazette links if online.
- Approval of the hero follow-on sentence and the CTA eyebrow.

---

## 11. Maintenance: dates, review and rot

**Date attributes.** Every proof block, list item and the Now section carries:
- `data-record="<slug>"` matching its entry in `docs/record.md`
- `data-when="YYYY-MM"` the real month (a range uses `data-when="2025-09/2026-07"`)
- `data-review="YYYY-MM-DD"` the date after which the copy must be re-read (school-year mentions: the next 1 September; "currently" and "this year" lines: 90 days out; the Now section uses `data-updated` instead, flagged after 60 days)
Visible copy still shows ages and school years only.

**Rot check (deterministic, no AI).** A GitHub Actions workflow on a monthly schedule runs a Node script (the repo already has Node tooling) that parses every HTML file, lists elements whose `data-review` is in the past or whose `data-updated` is older than 60 days, and any literal "Year 1[0-3]" without a future review date. It opens one issue titled "Content review: <Month Year>" listing each item with file and line, or updates the open one. Nothing else. A static contract test in `npm run check` asserts that every element with `data-when` also has `data-review` and a `data-record` that exists in `docs/record.md`.

**September pass.** Each September, Tom bumps school years, ages where "at 16" style copy has become "at 17" style history, and the CV. The rot check will list them.

**Now section.** Hand-updated when there is news. Tom may separately set up a scheduled AI routine to review the site and message him; that is outside this plan.

**Record file.** `docs/record.md` is updated whenever a fact enters the site or a decision is made not to publish something.

---

## 12. Sequencing

**Phase 0 (done)**: this document and `docs/record.md`.

**Phase 1, quick copy fixes** (one small change set, no structure change): delete the Volunteering placeholder; fix the six typos; replace the Programming lede line; hero lede; About gets Year 12; the CTA copy on the four pages that carry it; the Gmail address on Contact; YouTube off nav and footer.

**Phase 2, structure**: priority-plus nav in the new order (Blog slot present but hidden until Phase 3 so no empty page ships); shared components from §8 (proof block, Details toggle, compact list, post list, pinned strip); date attributes convention; the rot-check workflow and its contract test; `cv.html` and the PDF build script.

**Phase 3, Physics & Ideas and the Blog**: Physics & Ideas page; cradle deep page; Blog index and post template; first post "Bridging the Gap"; TEDx page split into talk and organising; Blog and Physics & Ideas in nav, footer and home grid.

**Phase 4, Programming and Volunteering**: featured proof blocks; Using AI section; Where I started strip with YouTube; Volunteering's three sections with Advising; "How this site works" post.

**Phase 5, consolidation**: Sport, music & drama merge with redirects; Contact rewrite; Now section; JSON-LD `sameAs`; rewrite AGENTS.md and the docs (§13).

**Phase 6, ongoing**: Now lines; posts; reading notes; testimonials; VAXTB when it ships; EPQ when it exists; the post-event TEDx post after 28 February 2027.

**Triggers (not phases)**
- **Eleventy migration**: when the Blog passes about eight posts or the site about fifteen pages, move to Eleventy so the header lives in one file and posts are Markdown. The Markdown sources in `docs/blog-sources/` are the migration input. Not before.
- **Game of Life embed**: if the project is pygame, `pygbag` can compile it to run in the page at a path or subdomain without a JavaScript rewrite. Otherwise a small JavaScript version. Until then, link the repo and say it's playable.
- **Domain email**: switch Contact to `tom@thomaswhite.me` once mail is set up. Free Zoho does not (as far as known) allow IMAP or POP, so either Zoho Mail Lite (adds IMAP so Gmail can fetch and send through it) or Cloudflare Email Routing to Gmail with Gmail "send mail as", keeping DMARC at monitoring. Check the Zoho plan page first.
- **Testimonials**: promote the page at three quotes.

Each implementation phase follows the repository instructions as rewritten in §13: update desktop nav, mobile nav and footer on every page; set metadata per page; keep `aria-current` correct; add redirects and update the Better Stack keyword manifest when URLs change; run `npm run check` and regenerate visual baselines where layout changes.

---

## 13. Documentation to rewrite at implementation

AGENTS.md and the docs were treated as suggestions for this planning session. During implementation they are rewritten to match the site, in the same phase as the change they describe:

- **AGENTS.md**: page map (new pages, `blog/` folder, `cv.html`, redirects); nav rules (priority order, More contents, priority-plus behaviour and no-JS fallback); the date-attribute convention and the rot-check workflow; the blog source convention (`docs/blog-sources/`); the CV build script; the CTA block copy; the "no build step" rule restated with the Eleventy trigger; the list of initialisers with any new nav logic.
- **docs/testing.md** and **docs/updating-tests-and-baselines.md**: the new contract test, the CV script, and which baselines change per phase.
- **docs/status-page-operations.md** and `tests/support/page-manifest.mjs`: every route change.
- **docs/record.md**: kept current (§11).

---

## 14. Honest risks and pushback

- **The site is better engineered than it is written.** The writing backlog is the whole game. If 9.1 is not written within about a month, ship Phases 1 and 2 anyway and keep the site small and current; do not ship a Blog with nothing in it.
- **Two audiences, one homepage.** The label lede and grid order are a compromise. If organisations bounce, revisit.
- **Overclaiming is the main content risk**, specifically: IYPT wording (in-school, not competitor); TEDx organising (student organiser, not licensee); the LSHTM work (advising, via his dad's team, a short claim until a testimonial exists); Namesake #753 (proposed, not built). A reviewer can check all four.
- **Ages go stale annually.** The date attributes and the rot check exist for this. If the Action is not built in Phase 2, the site will drift.
- **Public email** attracts spam. Accepted. The Gmail address reads younger than a domain address; switching is a trigger, not optional forever.
- **Old URLs.** Merging Sport and Music & Drama removes two monitored routes. Redirects and monitor updates are part of that phase.
- **Priority-plus nav** is the one piece of real front-end work in the plan and will change every visual baseline. Budget a day plus tests.

---

## 15. Verification (for the implementation sessions)

- Each phase: `git diff --check`, `npm run check`, then serve with `node tests/support/clean-url-server.mjs` and read every changed page at desktop, tablet and phone widths, keyboard only, and once with JavaScript disabled (the nav must not wrap).
- Content check per page against §5 and §7: summary present for every deep link and post, age or school year on every project, a Details line and date attributes on every proof block, no placeholder text, no typos from the original audit, the CTA names web development, no banned words, "passionate" at most once site-wide.
- After URL changes: `npm run test:production`, update `tests/support/page-manifest.mjs` and the Better Stack monitors per `docs/status-page-operations.md`.
- After the rot-check workflow lands: run it manually once and confirm it opens exactly one issue.
