# Website status page operations

## Ownership and scope

- Better Stack hosts the public page at `https://status.thomaswhite.me/` and sends issue and recovery email only to the site owner.
- GitHub Pages remains the only website host. Do not add a Vercel project, redirect or fallback.
- Better Stack account credentials, API tokens and the notification email address must stay outside this repository.
- Public visitor subscriptions are disabled. The footer’s small `Status` link is the only integration in the website itself; it does not fetch status data or display a potentially stale green/red indicator.

## Initial Better Stack setup

- Before setup, recheck the [Better Stack pricing page](https://betterstack.com/pricing). The selected design uses ten monitors and one status page, which fitted the free personal-project allowance when this runbook was written. Do not start a paid plan without explicit approval.
- Create one email contact for the site owner. Enable incident and recovery email. Disable phone calls, SMS, push notifications and team escalation.
- Create the status page:
  - Name: `Thomas White — Website status`
  - Time zone: `Europe/London`
  - Theme: modern/system default
  - History: 90 days
  - Company URL: `https://thomaswhite.me/`
  - Use the existing site logo and favicon.
  - Do not add analytics, custom JavaScript, custom CSS, white-label features or a paid custom sender.
  - Disable public email subscriptions.
- Add a `Website` section and publish all ten monitors as separate visible components. Do not hide confirmed incidents from the public history.

## Monitor configuration

- Use an HTTP `GET` keyword monitor for every route.
- Follow redirects and verify TLS certificates.
- Timeout: 15 seconds.
- Check interval: 3 minutes.
- Regions: Better Stack’s default four-location check. An incident should require failures from at least three locations.
- Confirmation period: 180 seconds.
- Recovery period: 180 seconds.
- Certificate and domain-expiry alerts are not available on the current free plan. The monitors still verify TLS on every request. Do not start a paid plan merely to add expiry warnings without explicit approval.

| Component | URL | Required keyword |
| --- | --- | --- |
| Home | `https://thomaswhite.me/` | `Hi, I’m Tom.` |
| Programming | `https://thomaswhite.me/programming/` | `Programming` |
| Physics & Ideas | `https://thomaswhite.me/physics/` | `Physics & Ideas` |
| Volunteering | `https://thomaswhite.me/volunteering/` | `Volunteering` |
| Blog | `https://thomaswhite.me/blog/` | `Blog` |
| Sport, music & drama | `https://thomaswhite.me/sport-music-and-drama/` | `Sport, music & drama` |
| Gallery | `https://thomaswhite.me/gallery/` | `Gallery` |
| TEDx | `https://thomaswhite.me/tedx/` | `Bridging the Gap` |
| Testimonials | `https://thomaswhite.me/testimonials/` | `Testimonials` |
| Contact | `https://thomaswhite.me/contact/` | `Contact me` |

- The same routes and keywords live in `tests/support/page-manifest.mjs`; the monitored pages are the ones with `monitored: true` (every page in the navigation). Update the monitor, manifest and relevant page metadata together when a page moves or its identifying text changes.
- Ten monitors use the complete planned free allowance. Deep pages, blog posts, `/youtube/`, the CV, the two redirects and `/gravatar/` are deliberately not monitored; `npm run test:production` still checks all of them daily. Before adding an eleventh monitor, either consolidate components or obtain approval for a paid plan.

### Changing the monitors for the content-strategy pages

The content-strategy implementation replaced three routes. When it is merged into the main repository, change Better Stack in the same session as the deploy:

1. Edit the **Sport** monitor to `https://thomaswhite.me/sport-music-and-drama/` with keyword `Sport, music & drama`, and rename its component to **Sport, music & drama**.
2. Edit the **Music & Drama** monitor to `https://thomaswhite.me/physics/` with keyword `Physics & Ideas`, and rename its component to **Physics & Ideas**.
3. Edit the **My old YouTube channel** monitor to `https://thomaswhite.me/blog/` with keyword `Blog`, and rename its component to **Blog**.
4. Rename the **TEDx Talk** component to **TEDx** (URL and keyword unchanged).
5. Reorder the components to match the table above, then run `npm run test:production`.

Keywords containing `&` are written decoded here, as the production test reads them; the raw HTML contains `&amp;`. If an edited monitor reports a missing keyword, use the `&amp;` form or a phrase without an ampersand.

Editing rather than deleting keeps each component's history. `/sport/` and `/music&drama/` remain as redirect pages that still contain their old keywords, so nothing goes red if the edits happen shortly after the deploy.

## DNS and custom-domain operation

- In Better Stack, set the custom status-page domain to `status.thomaswhite.me`.
- Keep a DNS-only CNAME for host `status` pointing to `statuspage.betteruptime.com`. Preserve that record when changing DNS provider; do not proxy or flatten it unless Better Stack's current custom-domain instructions explicitly require it.
- The planned editor site uses `CNAME edit` → `thomaswcode.github.io` (see the `ThomasWCode/edit.thomaswhite.me` repository). Once that record exists, preserve it too when changing provider, together with the `new` CNAME for the preview site.
- Better Stack has verified the custom domain and HTTPS is active. If the DNS provider changes again, confirm public resolution and HTTPS before treating the migration as complete.
- Check all ten components, the 90-day history, branding, mobile layout and HTTPS at the custom domain.
- Run `npm run test:production` after any DNS or status-page change. The scheduled workflow enforces the same contract after merge.

## Notification acceptance test

- The ten production monitors use the entire free allowance, so do not create a temporary eleventh monitor or alter a production URL merely to force an outage.
- From one monitor's Better Stack detail page, use `Send test alert` to verify that the site owner's email destination receives a test notification. This sends a real email and requires explicit approval immediately before the action.
- Confirm recovery delivery during the first genuine incident, or during a separately approved maintenance-window test that cannot confuse visitors or damage public incident history.
- Record the date and result outside this public repository because the notification address is private account configuration.

## Incident response

- Acknowledge the Better Stack incident promptly so duplicate escalation does not continue.
- Confirm impact from a second network or the GitHub Pages status before posting a public update.
- Publish a short factual update naming the affected page or whole site, start time and known impact. Do not speculate about a cause.
- For planned work, schedule maintenance in advance and identify only the components expected to be affected.
- When service returns, verify the page, keyword, local resources and HTTPS before resolving the incident. Publish a concise resolution and any confirmed cause.
- If a page is intentionally removed or renamed, update or pause its monitor before deployment, then update the manifest, public component and runbook.

## Routine checks

- Review monitor configuration, notification delivery and component visibility quarterly.
- Review the free-plan monitor limit and current pricing before adding components.
- Keep the DNS CNAME documented with the domain provider. Better Stack is the status-page host; there is no Vercel fallback.
- Automated monitoring confirms availability, content keywords, TLS validation and recovery. The current free plan does not provide advance certificate or domain-expiry warnings. Monitoring also does not prove that Formspree, reCAPTCHA, CookieYes, analytics or embedded media work end to end; perform those live integration checks separately after relevant deployed changes.
