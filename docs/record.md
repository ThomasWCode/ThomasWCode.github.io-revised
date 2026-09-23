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
- Planned: blog post "Bridging the Gap", 800 to 1,000 words plus "Since the talk". The page `/blog/bridging-the-gap/` and `docs/blog-sources/bridging-the-gap.md` hold the section structure; Tom writes the text.

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
- Pinned blog post "How this site works" (`/blog/how-this-site-works/`): drafted in September 2026 from what the repository does, for Tom to rewrite. The commit history shows AI coding tools (Claude) wrote part of the site; the site now says so.

### techassist
- Built for grandparents, age 14 (drafted; confirm). Written and video guides for everyday computer tasks plus a separate one-click encrypted backup app. Massive time investment.
- Honest limits: restore was manual; guide videos were on Dropbox and are no longer hosted. Early build for family, not a production app. Repo can be made public.
- Dates from `ThomasWCode/techassist` (the TechAssist website and installer): first commit 4 Feb 2025 (age 14), most commits February and April 2025, last 20 Aug 2025. The first commit already uploads setup version 1.4.5, so the app itself is older than the repository.

### vaxtb
- Not yet built. Mentioned only in the homepage Now section (September 2026). Web tool similar to WHO's ScreenTB, for TB vaccines. Volunteer. Asked by the TB vaccine modelling team at LSHTM that Tom's dad works in. Public once finished. Until then, only a line in the homepage Now section.

### early-projects
- Chrome Dino: first game, Python. Age 10 (Tom, September 2026). Repository uploaded 16 Aug 2025 (age 15).
- Minesweeper: Python, three difficulty levels. Age 12 (Tom, September 2026). Repository uploaded 20 Aug 2025 (age 15); its `flag.png` is dated 6 May 2024 (age 13).
- Bouncing Ball Physics Simulation: gravity, friction, ball collisions; flexibility and realistic physics over graphics. Repository uploaded 16 Aug 2025 (age 15), but an earlier single-file `BouncingBalls.py` is in `ThomasWCode/thomas-tutoring`, last modified 23 Jun 2024 (age 14). Age 14 (Tom, September 2026).
- Game of Life: click or drag to add cells. Playable by running the repo. Embed deferred (pygbag if pygame, else a small JavaScript version). Age 14 (Tom, September 2026). Repository uploaded 20 Aug 2025 (age 15).
- SplitMate: first mobile app, splitting shared expenses. Age 14 (Tom, September 2026). Repository uploaded 17 Aug 2025 (age 15).
- All five repositories were uploaded through GitHub's web "Add files via upload" between 16 and 20 August 2025, so their dates are when they went online, not when they were written. The site uses the ages Tom gave.
- Thomas Tutoring (`ThomasWCode/thomas-tutoring`, private): a tutoring website with sign-up and log-in pages, first commit 9 Jun 2024 (age 14), with Python projects (bouncing balls, speed typing) as downloads. Its projects page says "I have made many projects in Python, HTML and Lua". Earliest web development found; source of "since age 14" on the This website block. Not on the site.

### youtube
- Channel `leopardbookshop`: Roblox Studio and Lua tutorials, later some Python. Just over 400 subscribers and 108,000 views. Channel joined 29 Nov 2020 (age 10); 30 videos, the oldest Roblox tutorials about five years old, Advent of Code videos December 2022 (age 12), last upload 1 Sep 2023 (age 13). Site shows ages 10 to 13 and "learning Lua, at 10"; confirm.

### st-johns-garden
- Friends of St John's Garden website, `stjohnsgardenEC1.org`, for an Islington council group looking after a small green space in Farringdon. Source of the testimonial from Analisa Plehn, quoted word for word including "Thomas" (decided September 2026). Date to confirm: the domain was registered 8 Aug 2025 (age 15) and the Wayback Machine first saved it 15 Apr 2026, but neither shows when Tom built it.

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
- Drums and piano since primary school. School band, "Sunday Bloody Sunday". LAMDA Grades 1 to 6, Grade 6 Bronze Medal, five distinctions and one merit. LAMDA from Year 5 (September 2019, age 9) to now (Tom, September 2026).

## Decisions about what stays off the site

- This file and the rest of `docs/` are excluded from the published site by `_config.yml` (September 2026). Before that, GitHub Pages rendered this file publicly at `/docs/record.html`, birth date included.
- VAXTB: off until it ships. When it does, say plainly it came via the team his dad works in.
- Namesake research: "in progress", no detail.
- TechAssist: say restore was manual, lightly; do not overstate the backup app.
- TEDx organising: "one of three student organisers"; licence is held by an adult.
- LSHTM advising: a short claim now; evidence later.
- IYPT: in-school project, never "IYPT competitor".
- CV PDF: public download, will be indexed by search engines; accepted.
- Blog post dates show the month and year only, no age (September 2026).
- No AI-run rot check in the plan; the GitHub Action is deterministic. A scheduled AI review is Tom's separate addition if he wants it.

## To confirm (fill in and copy to the site's Details lines)

- Ages or years: St John's Garden site, Parks events, Mind shop, LSHTM calls start.
- Drafted from repository and channel dates, marked `data-draft="check"` on the site: YouTube channel, TechAssist, web development "since age 14".
- Cradle: software name, runs per parameter, term, headline finding, limitation, exact role.
- TEDx organising milestones.
- Islington Life and Gazette links.
- LinkedIn URL when created.
- CV: school, A level subjects, predicted grades, GCSE results.
- Author of *This Mortal Coil* (assumed Andrew Doig's history of death; confirm).
- Reading reactions, papers, and the five "Questions I'm stuck on".
