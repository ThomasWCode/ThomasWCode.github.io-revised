September 2026, age 16

# How this site works

Most of this website is stuff you can’t see: the tests, checks and monitoring that stop it breaking, and the editor I change it with. This is how it fits together.

<!--
Brief (content strategy §9.3). 600 to 900 words. This first version was drafted from the repository for Tom to rewrite in his own voice; every claim below can be checked against the code. Replace the last section with your own paragraph.
-->

## Plain HTML, on purpose

The site you’re on: HTML, CSS and JavaScript, with lots of little features I wanted to build dotted around.

The fonts, Inter and Fraunces, are hosted on the site itself rather than loaded from Google, and every big photo comes in smaller WebP versions so a phone doesn’t download a 6000-pixel image. The header and footer are copied into every page, which is part of why the next bit exists.

## Tests for everything

Every change runs through the whole test suite on GitHub Actions.

- Static checks read every page and make sure the basics hold: one main heading, a description, a canonical link, valid HTML, images whose declared sizes match the real files, and no link to a file that doesn’t exist.
- Content checks read the words, not just the code. They fail if a page uses a word I’ve banned from the site, or mentions a school year without a date for me to re-read it.
- Playwright opens every page in Chromium at desktop and phone sizes, with reduced motion and with JavaScript turned off, and runs quicker smoke tests in Firefox and WebKit. It tries the navigation, the contact form (against a fake Formspree) and the gallery, and runs axe accessibility checks on every page.
- Visual regression tests take screenshots of key pages and compare them with approved ones, so a stray CSS change can’t quietly break the layout.
- Lighthouse audits the main pages three times each and fails if the median performance, accessibility, best-practice or SEO score drops below its budget.
- ESLint and Stylelint catch mistakes in the JavaScript and CSS.

## Watching the live site

Tests only prove the code works on my side. Better Stack checks the site’s pages every three minutes from four locations and publishes the results on a status page (https://status.thomaswhite.me/), linked in the footer. A scheduled job also checks the live pages every morning, and the links to other sites once a week.

## Changing it without opening the code

I don’t open the code to change a sentence any more. There’s a separate editor for that: I sign in with GitHub, it shows each page as it looks, and I click into the text and type. When I save, it rewrites only the words I changed, leaving the rest of the HTML exactly as it was, and first checks them against the same content rules as the static tests.

Each save is a commit on the editor’s own branch, where saves build up until I press Publish. Then it opens a pull request, waits for every test to pass and merges it, so a change from the editor goes through the same checks as one from my laptop.

It can also save a change as a draft: a new paragraph, a rewrite, or something to take down. Drafts show on a preview copy of the site, and when the live site is built, a script takes them out before anything is served. The morning check of the live pages fails if one ever gets through.

## Keeping it up to date

The site itself doesn’t use any packages, but the tools that test it do. Once a month, Dependabot opens pull requests to update them, and a check fails if npm finds a serious security problem in one that has a fix.

Once a month, a script also reads every page for anything with a date that is due a re-read, like a “Year 12”, and opens an issue on GitHub so the site doesn’t quietly go out of date.

## Small things that matter

Analytics only load if you agree to them in the cookie banner. The “Last updated” date in the footer comes from the server’s record of when the site was published, not from something I have to remember to change. The navigation measures how much room it has and moves pages into “More” instead of wrapping onto two lines.

On a phone, the header gets out of the way: once you scroll, the bar slides up and the Menu button swings in as a quarter circle in the corner. My CV is a page on the site too, and the PDF is printed from it every time the site is published, so the two can’t disagree.

## What building it taught me

(One paragraph: GitHub practice (branches, pull requests, checks on every change), status pages, and what “best practice” turned out to mean. Say plainly how you used AI tools to build it.)

## Related

- /programming/#this-website
- https://github.com/ThomasWCode/ThomasWCode.github.io
- /blog/
