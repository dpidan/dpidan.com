import { siteData } from "./content.js";

const page = document.body.dataset.page;

function el(tag, options = {}) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text) node.textContent = options.text;
  if (options.html) node.innerHTML = options.html;
  if (options.href) node.href = options.href;
  return node;
}

function decodeText(encoded) {
  return String.fromCharCode(...encoded);
}

function getContactValue(item) {
  if (item.type === "email" && item.encoded) {
    return decodeText(item.encoded);
  }
  return item.value;
}

function getContactDisplay(item) {
  const value = getContactValue(item);
  if (item.type === "email") {
    return value.replace("@", " [at] ").replace(/\./g, " [dot] ");
  }
  return value;
}

function getContactHref(item) {
  if (item.type === "email") {
    return `mailto:${getContactValue(item)}`;
  }
  return item.href;
}

function renderNavigation() {
  const nav = document.querySelector("#site-nav");
  if (!nav) return;

  const fragment = document.createDocumentFragment();

  siteData.navigation.forEach((item) => {
    const link = el("a", { href: item.href, text: item.label });
    if (item.page === page) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
    fragment.append(link);
  });

  nav.replaceChildren(fragment);
}

function setupMobileNav() {
  const button = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
}

function fillFooter() {
  const name = document.querySelector("#footer-name");
  const tagline = document.querySelector("#footer-tagline");
  if (name) name.textContent = siteData.profile.shortName;
  if (tagline) tagline.textContent = `• ${siteData.profile.tagline}`;
}

function renderHome() {
  const summary = document.querySelector("#hero-summary");
  const currentRole = document.querySelector("#current-role");
  const currentCompany = document.querySelector("#current-company");
  const actions = document.querySelector("#hero-actions");
  const focusAreas = document.querySelector("#focus-areas");
  const highlightsGrid = document.querySelector("#highlights-grid");
  const principlesList = document.querySelector("#principles-list");
  const pageLinks = document.querySelector("#page-links");

  if (summary) summary.textContent = siteData.profile.summary;
  if (currentRole) currentRole.textContent = siteData.profile.role;
  if (currentCompany) {
    currentCompany.textContent = `${siteData.profile.employer} • ${siteData.profile.title}`;
  }

  if (actions) {
    actions.replaceChildren(
      ...siteData.actions.map((item) => {
        const link = el("a", {
          className: `button-link button-link-${item.variant}`,
          href: item.href,
          text: item.label,
        });
        return link;
      }),
    );
  }

  if (focusAreas) {
    focusAreas.replaceChildren(
      ...siteData.focusAreas.map((item) => el("li", { text: item })),
    );
  }

  if (highlightsGrid) {
    highlightsGrid.replaceChildren(
      ...siteData.highlights.map((item) => {
        const article = el("article", { className: "card" });
        article.append(el("h3", { text: item.title }), el("p", { text: item.body }));
        return article;
      }),
    );
  }

  if (principlesList) {
    principlesList.replaceChildren(
      ...siteData.principles.map((item) => {
        const block = el("div", { className: "stack-item" });
        block.append(el("h3", { text: item.title }), el("p", { text: item.body }));
        return block;
      }),
    );
  }

  if (pageLinks) {
    pageLinks.replaceChildren(
      ...siteData.pageLinks.map((item) => {
        const article = el("article", { className: "card" });
        const link = el("a", {
          className: "card-link",
          href: item.href,
          text: "Learn more",
        });
        article.append(el("h3", { text: item.title }), el("p", { text: item.body }));

        if (item.showContacts) {
          const list = el("ul", { className: "contact-preview" });
          siteData.contacts.forEach((contact) => {
            const listItem = el("li");
            const label = el("span", {
              className: "contact-preview-label",
              text: `${contact.label}: `,
            });
            const valueLink = el("a", {
              className: "contact-preview-link",
              href: getContactHref(contact),
              text: getContactDisplay(contact),
            });
            if (contact.type !== "email") {
              valueLink.target = "_blank";
              valueLink.rel = "noreferrer";
            }
            listItem.append(label, valueLink);
            list.append(listItem);
          });
          article.append(list);
        }

        article.append(link);
        return article;
      }),
    );
  }
}

function renderProfile() {
  const aboutCopy = document.querySelector("#about-copy");
  const skillsList = document.querySelector("#skills-list");
  const skillCloud = document.querySelector("#skill-cloud");
  const timeline = document.querySelector("#timeline");

  if (aboutCopy) {
    aboutCopy.replaceChildren(
      ...siteData.profile.about.map((item) => el("p", { text: item })),
    );
  }

  if (skillsList) {
    skillsList.replaceChildren(
      ...siteData.skills.map((item) => el("li", { text: item })),
    );
  }

  if (skillCloud) {
    skillCloud.replaceChildren(
      ...siteData.skillCloud.map((item) => el("span", { className: "skill-chip", text: item })),
    );
  }

  if (timeline) {
    timeline.replaceChildren(
      ...siteData.experience.map((item) => {
        const article = el("article", { className: "timeline-item" });
        const header = el("header");
        const headingGroup = el("div");
        const company = el("p", { className: "timeline-company", text: item.company });
        const meta = el("p", {
          className: "meta",
          text: item.period,
        });
        const location = item.location
          ? el("p", { className: "timeline-location", text: item.location })
          : null;
        const summary = el("p", { className: "timeline-summary", text: item.summary });

        headingGroup.append(el("h3", { text: item.role }), company, meta);
        if (location) {
          headingGroup.append(location);
        }
        header.append(headingGroup);
        article.append(header, summary);

        if (item.bullets && item.bullets.length > 0) {
          const list = el("ul", { className: "timeline-points" });
          item.bullets.forEach((point) => {
            list.append(el("li", { text: point }));
          });
          article.append(list);
        }

        return article;
      }),
    );
  }
}

function renderProjects() {
  const projectsGrid = document.querySelector("#projects-grid");
  if (!projectsGrid) return;

  projectsGrid.replaceChildren(
    ...siteData.projects.map((item) => {
      const article = el("article", { className: "card" });
      article.append(el("h3", { text: item.title }), el("p", { text: item.body }));
      return article;
    }),
  );
}

function renderContact() {
  const contactGrid = document.querySelector("#contact-grid");
  if (!contactGrid) return;

  const list = el("ul", { className: "contact-list" });

  siteData.contacts.forEach((item) => {
    const listItem = el("li", { className: "contact-list-item" });
    const label = el("span", {
      className: "contact-list-label",
      text: `${item.label}: `,
    });
    const link = el("a", {
      className: "contact-list-link",
      href: getContactHref(item),
      text: getContactDisplay(item),
    });

    if (item.type !== "email") {
      link.target = "_blank";
      link.rel = "noreferrer";
    }

    listItem.append(label, link);
    list.append(listItem);
  });

  contactGrid.replaceChildren(list);
}

renderNavigation();
setupMobileNav();
fillFooter();

if (page === "home") renderHome();
if (page === "profile") renderProfile();
if (page === "projects") renderProjects();
if (page === "contact") renderContact();
