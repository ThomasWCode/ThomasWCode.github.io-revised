export const productionBaseUrl = "https://thomaswhite.me";
export const statusPageUrl = "https://status.thomaswhite.me/";

export const pages = [
  {
    source: "index.html",
    path: "/",
    title: "Home | Tom White",
    heading: "Hi, I’m Tom.",
    monitorKeyword: "Hi, I’m Tom.",
  },
  {
    source: "programming.html",
    path: "/programming/",
    title: "Programming | Tom White",
    heading: "Programming",
    monitorKeyword: "Programming",
  },
  {
    source: "physics.html",
    path: "/physics/",
    title: "Physics & Ideas | Tom White",
    heading: "Physics & Ideas",
    monitorKeyword: "Physics & Ideas",
  },
  {
    source: "physics/magnetic-newtons-cradle.html",
    path: "/physics/magnetic-newtons-cradle/",
    title: "Magnetic Newton’s cradle | Tom White",
    heading: "Magnetic Newton’s cradle",
    monitorKeyword: "Magnetic Newton’s cradle",
    stylesheet: "/CSS/physics.css",
    inNavigation: false,
  },
  {
    source: "volunteering.html",
    path: "/volunteering/",
    title: "Volunteering | Tom White",
    heading: "Volunteering",
    monitorKeyword: "Volunteering",
  },
  {
    source: "blog/index.html",
    path: "/blog/",
    title: "Blog | Tom White",
    heading: "Blog",
    monitorKeyword: "Blog",
    stylesheet: "/CSS/blog.css",
  },
  {
    source: "blog/bridging-the-gap.html",
    path: "/blog/bridging-the-gap/",
    title: "Bridging the Gap, the talk as an essay | Tom White",
    heading: "Bridging the Gap",
    monitorKeyword: "the talk as an essay",
    stylesheet: "/CSS/blog.css",
    inNavigation: false,
  },
  {
    source: "blog/how-this-site-works.html",
    path: "/blog/how-this-site-works/",
    title: "How this site works | Tom White",
    heading: "How this site works",
    monitorKeyword: "How this site works",
    stylesheet: "/CSS/blog.css",
    inNavigation: false,
  },
  {
    source: "sport-music-and-drama.html",
    path: "/sport-music-and-drama/",
    title: "Sport, music & drama | Tom White",
    heading: "Sport, music & drama",
    monitorKeyword: "Sport, music & drama",
  },
  {
    source: "gallery.html",
    path: "/gallery/",
    title: "Gallery | Tom White",
    heading: "Gallery",
    monitorKeyword: "Gallery",
  },
  {
    source: "tedx.html",
    path: "/tedx/",
    title: "TEDx | Tom White",
    heading: "Bridging the Gap",
    monitorKeyword: "Bridging the Gap",
  },
  {
    source: "youtube.html",
    path: "/youtube/",
    title: "My Old YouTube Channel | Tom White",
    heading: "leopardbookshop",
    monitorKeyword: "leopardbookshop",
    inNavigation: false,
  },
  {
    source: "testimonials.html",
    path: "/testimonials/",
    title: "Testimonials | Tom White",
    heading: "Testimonials",
    monitorKeyword: "Testimonials",
  },
  {
    source: "contact.html",
    path: "/contact/",
    title: "Contact | Tom White",
    heading: "Contact me",
    monitorKeyword: "Contact me",
  },
].map((page) => ({
  inNavigation: true,
  stylesheet: `/CSS/${page.source.replace(/\.html$/, ".css")}`,
  ...page,
  monitored: page.inNavigation !== false,
  canonical: `${productionBaseUrl}${page.path}`,
}));

export const redirects = [
  {
    source: "sport.html",
    path: "/sport/",
    target: "/sport-music-and-drama/#sport",
    heading: "Sport",
  },
  {
    source: "music&drama.html",
    path: "/music&drama/",
    target: "/sport-music-and-drama/#music",
    heading: "Music & Drama",
  },
];

export const externalRedirects = [
  {
    source: "gravatar.html",
    path: "/gravatar/",
    target: "https://gravatar.com/thomaswhiteuk",
    heading: "Redirecting…",
  },
];

export const documents = [
  {
    source: "cv.html",
    path: "/cv/",
    title: "CV | Tom White",
    heading: "Tom White",
    stylesheet: "/CSS/cv.css",
    pdf: "Tom-White-CV.pdf",
  },
].map((printDocument) => ({
  ...printDocument,
  canonical: `${productionBaseUrl}${printDocument.path}`,
}));

export const publishedSources = [...pages, ...documents, ...redirects, ...externalRedirects].map(
  (entry) => entry.source,
);
