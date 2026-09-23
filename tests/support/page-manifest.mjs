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
    source: "sport.html",
    path: "/sport/",
    title: "Sport | Tom White",
    heading: "Sport",
    monitorKeyword: "Sport",
  },
  {
    source: "music&drama.html",
    path: "/music&drama/",
    title: "Music & Drama | Tom White",
    heading: "Music & Drama",
    monitorKeyword: "Music & Drama",
  },
  {
    source: "volunteering.html",
    path: "/volunteering/",
    title: "Volunteering | Tom White",
    heading: "Volunteering",
    monitorKeyword: "Volunteering",
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
    title: "TEDx Talk | Tom White",
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
  ...page,
  canonical: `${productionBaseUrl}${page.path}`,
}));
