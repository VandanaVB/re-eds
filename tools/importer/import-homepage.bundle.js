var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const cells = [];
    const imageCell = [];
    imageCell.push(document.createComment(" field:media_image "));
    const picture = element.querySelector("picture");
    if (picture) {
      imageCell.push(picture.cloneNode(true));
    } else {
      const img = element.querySelector("img.banner-background-image");
      if (img) imageCell.push(img.cloneNode(true));
    }
    const textCell = [];
    textCell.push(document.createComment(" field:content_text "));
    const heroTitle = element.querySelector(".hero-title p");
    if (heroTitle) {
      const h2 = document.createElement("h2");
      h2.textContent = heroTitle.textContent.trim();
      textCell.push(h2);
    }
    const heroDesc = element.querySelector(".hero-description p");
    if (heroDesc) {
      const p = document.createElement("p");
      p.textContent = heroDesc.textContent.trim();
      textCell.push(p);
    }
    const ctaButton = element.querySelector("button.glass-button");
    if (ctaButton) {
      const a = document.createElement("a");
      a.textContent = ctaButton.textContent.trim();
      a.href = ctaButton.getAttribute("title") || "#";
      textCell.push(a);
    }
    cells.push([imageCell, textCell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-hero",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-spotlight.js
  function parse2(element, { document }) {
    const cells = [];
    const imageCell = [];
    imageCell.push(document.createComment(" field:image "));
    const picture = element.querySelector(".trending-content-card .card-image picture");
    if (picture) {
      imageCell.push(picture.cloneNode(true));
    } else {
      const img = element.querySelector(".trending-content-card .card-image img.bg-img");
      if (img) imageCell.push(img.cloneNode(true));
    }
    const textCell = [];
    textCell.push(document.createComment(" field:text "));
    const title = element.querySelector(".card-title");
    if (title) {
      const h2 = document.createElement("h2");
      h2.textContent = title.textContent.trim();
      textCell.push(h2);
    }
    const desc = element.querySelector(".card-description p");
    if (desc) {
      const p = document.createElement("p");
      p.textContent = desc.textContent.trim();
      textCell.push(p);
    }
    const ctaLinks = element.querySelectorAll(".cta-buttons a");
    ctaLinks.forEach((a) => {
      const link = document.createElement("a");
      link.href = a.href || a.getAttribute("href");
      link.textContent = a.textContent.trim();
      textCell.push(link);
    });
    cells.push([imageCell, textCell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-spotlight",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-showcase.js
  function parse3(element, { document }) {
    const isMotorcycles = element.matches(".motorcyclewithcategories");
    const isRide = element.matches(".iridegrid");
    if (!isMotorcycles && !isRide) return;
    const rows = [];
    if (isMotorcycles) {
      const tabSpans = element.querySelectorAll(".category-tab:not(.slick-cloned) span");
      const seen = /* @__PURE__ */ new Set();
      const uniqueTabs = [];
      tabSpans.forEach((span) => {
        const label = span.textContent.trim();
        if (label && !seen.has(label)) {
          seen.add(label);
          uniqueTabs.push(label);
        }
      });
      const nameSlides = element.querySelectorAll(
        ".motorcycle-carousel-bike-names:not(.slick-cloned)"
      );
      const imageSlides = element.querySelectorAll(
        ".motorcycle-carousel-bike-images:not(.slick-cloned)"
      );
      uniqueTabs.forEach((tabLabel) => {
        const titleCell = [];
        titleCell.push(document.createComment(" field:title "));
        titleCell.push(document.createTextNode(tabLabel));
        const contentCell = [];
        contentCell.push(document.createComment(" field:content_heading "));
        const heading = document.createElement("h3");
        heading.textContent = tabLabel;
        contentCell.push(heading);
        contentCell.push(document.createComment(" field:content_image "));
        imageSlides.forEach((slide) => {
          if (slide.getAttribute("bike-category") === tabLabel) {
            const img = slide.querySelector("img");
            if (img) contentCell.push(img.cloneNode(true));
          }
        });
        contentCell.push(document.createComment(" field:content_richtext "));
        nameSlides.forEach((slide) => {
          if (slide.getAttribute("bike-category") === tabLabel) {
            const bikeName = slide.textContent.trim();
            if (bikeName) {
              const p = document.createElement("p");
              p.textContent = bikeName;
              contentCell.push(p);
            }
          }
        });
        rows.push([titleCell, contentCell]);
      });
    }
    if (isRide) {
      const cards = element.querySelectorAll(".swiper-slide.grid-item .card");
      cards.forEach((card) => {
        const headingEl = card.querySelector(".content h2");
        const tabLabel = headingEl ? headingEl.textContent.trim() : "";
        const titleCell = [];
        titleCell.push(document.createComment(" field:title "));
        titleCell.push(document.createTextNode(tabLabel));
        const contentCell = [];
        contentCell.push(document.createComment(" field:content_heading "));
        const heading = document.createElement("h3");
        heading.textContent = tabLabel;
        contentCell.push(heading);
        contentCell.push(document.createComment(" field:content_image "));
        const picture = card.querySelector("picture");
        if (picture) {
          contentCell.push(picture.cloneNode(true));
        } else {
          const img = card.querySelector("img");
          if (img) contentCell.push(img.cloneNode(true));
        }
        contentCell.push(document.createComment(" field:content_richtext "));
        const hiddenContent = card.querySelector(".content .hidden-one");
        if (hiddenContent) {
          const paras = hiddenContent.querySelectorAll("p");
          paras.forEach((p) => contentCell.push(p.cloneNode(true)));
          const links = hiddenContent.querySelectorAll("a");
          links.forEach((a) => {
            const p = document.createElement("p");
            p.append(a.cloneNode(true));
            contentCell.push(p);
          });
        }
        rows.push([titleCell, contentCell]);
      });
    }
    if (!rows.length) return;
    const block = WebImporter.Blocks.createBlock(document, {
      name: "tabs-showcase",
      cells: rows
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-culture.js
  function parse4(element, { document }) {
    const cells = [];
    const imageCell = [];
    imageCell.push(document.createComment(" field:image "));
    const img = element.querySelector(".img-box img");
    if (img) {
      imageCell.push(img.cloneNode(true));
    }
    const textCell = [];
    textCell.push(document.createComment(" field:text "));
    const textP = element.querySelector(".text-section p");
    if (textP) {
      const h4 = document.createElement("h4");
      h4.textContent = textP.textContent.trim();
      textCell.push(h4);
    }
    const href = element.href || element.getAttribute("href");
    if (href) {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = textP && textP.textContent.trim() || href;
      textCell.push(link);
    }
    cells.push([imageCell, textCell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-culture",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-events.js
  function parse5(element, { document }) {
    const cells = [];
    const imageCell = [];
    imageCell.push(document.createComment(" field:image "));
    const picture = element.querySelector("picture");
    if (picture) {
      imageCell.push(picture.cloneNode(true));
    } else {
      const img = element.querySelector("img");
      if (img) imageCell.push(img.cloneNode(true));
    }
    const textCell = [];
    textCell.push(document.createComment(" field:text "));
    const heading = element.querySelector('.card-heading, h3.card-heading, .card-content h3, [class*="title"]:not(.status-banner):not([class*="status"])');
    if (heading) {
      const h3 = document.createElement("h3");
      h3.textContent = heading.textContent.trim();
      textCell.push(h3);
    }
    const location = element.querySelector(".location p, .location");
    if (location) {
      const p = document.createElement("p");
      p.textContent = location.textContent.trim();
      textCell.push(p);
    }
    const date = element.querySelector(".date p, .date, .event-date");
    if (date) {
      const p = document.createElement("p");
      p.textContent = date.textContent.trim();
      textCell.push(p);
    }
    const cta = element.querySelector('.card-details-button, .card-buttons a, a[class*="button"]');
    if (cta) {
      const link = document.createElement("a");
      link.href = cta.href || cta.getAttribute("href");
      link.textContent = cta.textContent.trim();
      textCell.push(link);
    }
    cells.push([imageCell, textCell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-events",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-legacy.js
  function parse6(element, { document }) {
    const cells = [];
    const imageCell = [];
    imageCell.push(document.createComment(" field:media_image "));
    const desktopImg = element.querySelector("img.timeline-image");
    if (desktopImg) {
      const picture = document.createElement("picture");
      picture.append(desktopImg.cloneNode(true));
      imageCell.push(picture);
    }
    const textCell = [];
    textCell.push(document.createComment(" field:content_text "));
    const yearsEl = element.querySelector(".years");
    if (yearsEl) {
      const yearText = yearsEl.getAttribute("data-year") || yearsEl.textContent.trim();
      if (yearText) {
        const h2 = document.createElement("h2");
        h2.textContent = yearText;
        textCell.push(h2);
      }
    }
    const timelineContent = element.querySelector(".timeline-content");
    if (timelineContent) {
      const paragraphs = timelineContent.querySelectorAll("p");
      paragraphs.forEach((srcP) => {
        const cloned = srcP.cloneNode(true);
        const readMore = cloned.querySelector(".read-more");
        if (readMore) readMore.remove();
        const text = cloned.textContent.trim();
        if (text) {
          const p = document.createElement("p");
          p.innerHTML = cloned.innerHTML.trim();
          textCell.push(p);
        }
      });
    }
    cells.push([imageCell, textCell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-legacy",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-locator.js
  function parse7(element, { document }) {
    if (!element.matches(".section-locate-centre.re-rides-home-locate-us-component")) return;
    const leftCol = [];
    const h3 = element.querySelector("h3");
    if (h3) {
      const heading = document.createElement("h3");
      heading.textContent = h3.textContent.trim();
      leftCol.push(heading);
    }
    const descEl = element.querySelector(".locate-centre__card-desc");
    if (descEl) {
      const paras = descEl.querySelectorAll("p");
      paras.forEach((p) => {
        const text = p.textContent.trim();
        if (text) {
          const para = document.createElement("p");
          para.textContent = text;
          leftCol.push(para);
        }
      });
    }
    const ctaLink = element.querySelector(".locate-centre__card-cta a") || element.querySelector("a.locate-view-more-cta") || element.querySelector(".locate-centre__card-lh a");
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaLink.href || ctaLink.getAttribute("href");
      a.textContent = ctaLink.textContent.trim();
      p.append(a);
      leftCol.push(p);
    }
    const rightCol = [];
    const img = element.querySelector(".locate-centre__card img") || element.querySelector("img");
    if (img) {
      rightCol.push(img.cloneNode(true));
    }
    const cells = [[leftCol, rightCol]];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-locator",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-shop.js
  function parse8(element, { document }) {
    const cells = [];
    const imageCell = [];
    imageCell.push(document.createComment(" field:image "));
    const img = element.querySelector("img.shop-card__image") || element.querySelector(".shop-card__image-wrapper img");
    if (img) {
      imageCell.push(img.cloneNode(true));
    }
    const textCell = [];
    textCell.push(document.createComment(" field:text "));
    const title = element.querySelector(".shop-card__title");
    if (title) {
      const h3 = document.createElement("h3");
      h3.textContent = title.textContent.trim();
      textCell.push(h3);
    }
    const desc = element.querySelector(".shop-card__description");
    if (desc) {
      const p = document.createElement("p");
      p.textContent = desc.textContent.trim();
      textCell.push(p);
    }
    const ctaLink = element.querySelector(".shop-card__button");
    if (ctaLink) {
      const link = document.createElement("a");
      link.href = ctaLink.href || ctaLink.getAttribute("href");
      link.textContent = ctaLink.textContent.trim();
      textCell.push(link);
    }
    cells.push([imageCell, textCell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-shop",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/royalenfield-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      if (element.style && element.style.overflow === "hidden") {
        element.style.overflow = "";
      }
      WebImporter.DOMUtils.remove(element, [
        ".form-gdpr",
        ".consent__check",
        ".re__revamp-v4__consent__heading",
        ".gdpr-error",
        '[class*="cookie"]'
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--header",
        ".re-revamp-v4-header"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--footer",
        ".re-revamp__footer-fragment"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".re-revamp-v4-sidebar-header",
        ".re-revamp-v4-sidebar-footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript",
        "script"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
        el.removeAttribute("data-cmp-clickable");
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
      });
    }
  }

  // tools/importer/transformers/royalenfield-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "cards-spotlight": parse2,
    "tabs-showcase": parse3,
    "cards-culture": parse4,
    "cards-events": parse5,
    "carousel-legacy": parse6,
    "columns-locator": parse7,
    "cards-shop": parse8
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Royal Enfield India homepage with hero banners, product showcases, and brand content",
    urls: [
      "https://www.royalenfield.com/in/en/home/"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".swipercarousel.cmp--royal-enfield-swiper .swiper-slide"]
      },
      {
        name: "cards-spotlight",
        instances: ["#highlights-section .whats-trending-cmp-desktop .swiper-slide"]
      },
      {
        name: "tabs-showcase",
        instances: [".motorcyclewithcategories", ".iridegrid"]
      },
      {
        name: "cards-culture",
        instances: [".motoculture .swiper-slide"]
      },
      {
        name: "cards-events",
        instances: [".marquee-rides-events-cards .marquee-rides-events-card"]
      },
      {
        name: "carousel-legacy",
        instances: [".swiper-container--legacy .swiper-slide"]
      },
      {
        name: "columns-locator",
        instances: [".section-locate-centre.re-rides-home-locate-us-component"]
      },
      {
        name: "cards-shop",
        instances: [".shop-section .shop-section__cards .shop-card"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: ".swipercarousel.carousel.panelcontainer.cmp--royal-enfield-swiper",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "In the Headlights",
        selector: "#highlights-section",
        style: "dark",
        blocks: ["cards-spotlight"],
        defaultContent: ["#highlights-section .whatstrending h2"]
      },
      {
        id: "section-3",
        name: "Motorcycles Showcase",
        selector: ".motorcyclewithcategories",
        style: "dark",
        blocks: ["tabs-showcase"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "MotoCulture",
        selector: ".motoculture",
        style: "dark",
        blocks: ["cards-culture"],
        defaultContent: [".motoculture h3.heading"]
      },
      {
        id: "section-5",
        name: "Ride",
        selector: ".iridegrid",
        style: "dark",
        blocks: ["tabs-showcase"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Rides and Events",
        selector: "#latestSection",
        style: "dark",
        blocks: ["cards-events"],
        defaultContent: [".marquee-rides-events-container .marquee-rides-header h3"]
      },
      {
        id: "section-7",
        name: "Legacy since 1901",
        selector: ".swipercarousel.carousel.panelcontainer.swiper-container--legacy",
        style: "dark",
        blocks: ["carousel-legacy"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Locate Us",
        selector: ".locateservicecentrecard",
        style: "dark",
        blocks: ["columns-locator"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Shop",
        selector: ".royal-enfield-shop-us",
        style: "dark",
        blocks: ["cards-shop"],
        defaultContent: [".shop-section h3.shop-section__title"]
      },
      {
        id: "section-10",
        name: "Footer",
        selector: ".re-revamp__footer-fragment",
        style: null,
        blocks: [],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
