# Record

Tom's private reference: every fact, date, age and decision from the content-strategy conversations, in note form, including things that do not go on the site. Not linked from the site and not advertised. It is the source for the personal statement and CV, and the `data-record` slugs in the site markup point at the headings here (see `docs/content-strategy.md` §11).

Ages are computed from the birth date below. Visible site copy shows ages and school years; this file holds the real dates.

## Identity

- Tom White (Thomas White). Born 6 June 2010. London.
- School years: Year 11 was September 2025 to July 2026 (age 15, then 16 from June). Year 12 from September 2026 (age 16). Year 13 from September 2027 (age 17). UCAS applications autumn 2027.
- Started programming at 7 (2017). Lua on Roblox first, then Python (favourite), JavaScript/HTML/CSS, some C++. Lots of web development.
- Interests: programming, astrophysics, particle physics, AI and AI safety, drumming, hiking, science fiction.
- Cat: Dusty, `dusty.thomaswhite.me`.
- Email now: `thomasawhite321@gmail.com`. Domain mailbox on Zoho Mail (free plan), unused; planned public address `tom@thomaswhite.me`. No LinkedIn yet.

### education
- Year 12 from September 2026. School name, A level subjects, predicted grades and GCSE results (summer 2026): to confirm. Needed for the CV (`cv.html`).

## Physics and ideas

### tedx-talk
- TEDxDulwich Youth, 28 February 2026. Year 11, age 15. Talk "Bridging the Gap": why General Relativity and Quantum Mechanics disagree, gravity across both, String Theory, Theory of Everything. Twelve minutes. Designed to be engaging and understandable, not technical.
- Eight youth speakers, four adult speakers, theme "Bridges". TEDx event page 67110. YouTube `YJ-s-Gx1FN0`. 60-second highlight hosted on the site. Script exists as text.
- Planned: blog post "Bridging the Gap", 800 to 1,000 words plus "Since the talk".

### tedx-organising
- TEDxDulwich Youth, 28 February 2027. Year 12, age 16. One of three student organisers. Licence held by an adult (never "licensee").
- Tom drives it: the applicant information site (`sites.google.com/view/tedxdulwich`, Google Sites), posters, application forms, PowerPoints and scripts for advertising, all technical work. Coordinates the drama department (event is in the theatre), marketing and its posting rules, a sister school, and school staff.
- Milestone dates for the Details line: to fill in as they happen (applications open, speakers chosen, rehearsals, event).
- Planned: proof block on `/tedx/` now; full blog post after the event.

### cradle
- IYPT in-school project, Year 11 (2025 to 2026, age 15 to 16). Not the national competition. Team of three.
- Question: factors affecting a magnetic Newton's cradle. Magnetic cradles are rare and could not be sourced, so the team built one from scratch.
- Parameters varied, in order of how thoroughly they were tested: initial release angle; number of magnets (3 or 5); separation between magnets at equilibrium; friction between wires and frame; magnet strength; mass of each magnet.
- Method: tracking stickers, slow-motion filming, motion-tracking software (name to confirm) to extract position against time. Tom did the motion tracking and data processing (confirm exact role split).
- Assets held: slow-mo clips, tracking data and plots, build photos. No report or slides.
- To confirm: software name, runs per parameter, which term, headline finding, main limitation.

### epq
- Will happen. Not started. Topic unknown. Not on the site until it exists.

### reading
- Books: almost all of Stephen Hawking; *Why Does E=mc²?* (Cox and Forshaw); *Immune* (Dettmer); *If Anyone Builds It, Everyone Dies* (Yudkowsky and Soares); *The Anxious Generation* (Haidt); *This Mortal Coil* (Doig); all of Dennis E. Taylor (Bobiverse); a lot of science fiction.
- Papers: Tom can list papers read, related and unrelated to the talk, across physics, philosophy, psychology and AI. Titles to add here as he writes the reactions.
- Planned: "Questions I'm stuck on", five items.

## Programming

### namesake
- Namesake (`namesakefyi/namesake`): US non-profit, free name-change guides and tools for trans people, "built by and for the trans community". Volunteer contributor. The cause matters to him.
- Merged pull requests, all July 2026, age 16, the week after Year 11 ended:
  - #717, 24 Jul 2026: fixed support map click navigation while keeping state outlines; separate outline layer, simpler D3 selectors; 45 added, 19 removed; co-authored with maintainer Ky Decker after review. Visible on the homepage.
  - #725, 27 Jul 2026: removed a passthrough image-service override that broke images in local dev after the Cloudflare adapter upgrade. Developer fix.
  - #728, 27 Jul 2026: `formatCleanUrl` now parses with `URL` and returns the hostname without "www", handles bare hostnames; tests updated. Visible in directory listings.
  - #729, 27 Jul 2026: seven directory entries for Illinois, Kentucky and North Carolina with logos (Chicago House, Fauver Law Office, Kentucky Health Justice Network, Kentucky Youth Law Project, Legal Aid Chicago, North Carolina Bar Association, Transformative Justice Law Project, UIC). Co-authored.
  - #735, 27 Jul 2026: `prepare` script so `simple-git-hooks` installs on install; ImageMagick added to the setup guide. Tooling.
- #753, 11 Sep 2026, by the maintainer: download a blank PDF packet from the form title view (689 lines). Tom raised issue #722 and led the idea and suggestions. Claim as "proposed and specified", never "built".
- Current: non-code research for the project. Described publicly only as "research, in progress".
- Note: PR descriptions and review threads were not readable from the planning session; the notes above come from the merged commits and diffs.

### this-website
- `thomaswhite.me`, hand-written HTML/CSS/JS, no framework. Playwright end-to-end, visual regression and accessibility tests across Chromium, Firefox and WebKit; Lighthouse budgets; ESLint, Stylelint, html-validate; GitHub Actions CI; Better Stack status page at `status.thomaswhite.me`; CookieYes consent-gated analytics; Formspree contact with reCAPTCHA. Evidence of GitHub, CI and status-page practice.
- Planned: pinned blog post "How this site works".

### techassist
- Built for grandparents, age to confirm. Written and video guides for everyday computer tasks plus a separate one-click encrypted backup app. Massive time investment.
- Honest limits: restore was manual; guide videos were on Dropbox and are no longer hosted. Early build for family, not a production app. Repo can be made public.

### vaxtb
- Not yet built. Web tool similar to WHO's ScreenTB, for TB vaccines. Volunteer. Asked by the TB vaccine modelling team at LSHTM that Tom's dad works in. Public once finished. Until then, only a line in the homepage Now section.

### early-projects
- Chrome Dino: first game, Python. Age to confirm.
- Minesweeper: Python, three difficulty levels. Age to confirm.
- Bouncing Ball Physics Simulation: gravity, friction, ball collisions; flexibility and realistic physics over graphics. Age to confirm.
- Game of Life: click or drag to add cells. Playable by running the repo. Embed deferred (pygbag if pygame, else a small JavaScript version). Age to confirm.
- SplitMate: first mobile app, splitting shared expenses. Age to confirm.

### youtube
- Channel `leopardbookshop`: Roblox Studio and Lua tutorials, later some Python. Just over 400 subscribers and 108,000 views. Age at the time to confirm.

### st-johns-garden
- Friends of St John's Garden website, `stjohnsgardenEC1.org`, for an Islington council group looking after a small green space in Farringdon. Source of the testimonial from Analisa Plehn. Date to confirm.

## Advising

### lshtm-advising
- Weekly calls with a TB vaccine mathematical modelling team at LSHTM (the team Tom's dad works in; the same team VAXTB is for). Advising on incorporating AI into the workflow for building the model's backend: AI practice, GitHub practice, prompts.
- Start month to confirm. Age 16.
- Public treatment: short claim, no evidence for now. A testimonial from the team may come later. Planned later post: "Using AI in a small research team".

## Volunteering, hands-on

### islington-parks
- Islington Council Parks: Grow Show (catalogued entries), Apple Day (made apple juice), Spring Festival at Gillespie Park (welcomed visitors). Appeared in Islington Life and the Islington Gazette. Dates and links to confirm.

### mind-shop
- Local Mind charity shop: till, sorting donations, helping other volunteers. Dates to confirm.

## Sport, music and drama

### sport
- Running is the favourite. parkrun PB 21:21. Spartan races: a 5K, then two 10Ks a year. Brighton Triathlon. Squash, tennis, cross-country. Dates to confirm.

### music-drama
- Drums and piano since primary school. School band, "Sunday Bloody Sunday". LAMDA Grades 1 to 6, Grade 6 Bronze Medal, five distinctions and one merit. Years to confirm.

## Decisions about what stays off the site

- VAXTB: off until it ships. When it does, say plainly it came via the team his dad works in.
- Namesake research: "in progress", no detail.
- TechAssist: say restore was manual, lightly; do not overstate the backup app.
- TEDx organising: "one of three student organisers"; licence is held by an adult.
- LSHTM advising: a short claim now; evidence later.
- IYPT: in-school project, never "IYPT competitor".
- CV PDF: public download, will be indexed by search engines; accepted.
- No AI-run rot check in the plan; the GitHub Action is deterministic. A scheduled AI review is Tom's separate addition if he wants it.

## To confirm (fill in and copy to the site's Details lines)

- Ages or years: YouTube channel, Chrome Dino, Minesweeper, Game of Life, Bouncing Ball, SplitMate, TechAssist, St John's Garden site, LAMDA grades, Parks events, Mind shop, LSHTM calls start.
- Cradle: software name, runs per parameter, term, headline finding, limitation, exact role.
- TEDx organising milestones.
- Islington Life and Gazette links.
- LinkedIn URL when created.
