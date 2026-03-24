/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsSpotlightParser from './parsers/cards-spotlight.js';
import tabsShowcaseParser from './parsers/tabs-showcase.js';
import cardsCultureParser from './parsers/cards-culture.js';
import cardsEventsParser from './parsers/cards-events.js';
import carouselLegacyParser from './parsers/carousel-legacy.js';
import columnsLocatorParser from './parsers/columns-locator.js';
import cardsShopParser from './parsers/cards-shop.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/royalenfield-cleanup.js';
import sectionsTransformer from './transformers/royalenfield-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-spotlight': cardsSpotlightParser,
  'tabs-showcase': tabsShowcaseParser,
  'cards-culture': cardsCultureParser,
  'cards-events': cardsEventsParser,
  'carousel-legacy': carouselLegacyParser,
  'columns-locator': columnsLocatorParser,
  'cards-shop': cardsShopParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Royal Enfield India homepage with hero banners, product showcases, and brand content',
  urls: [
    'https://www.royalenfield.com/in/en/home/',
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.swipercarousel.cmp--royal-enfield-swiper .swiper-slide'],
    },
    {
      name: 'cards-spotlight',
      instances: ['#highlights-section .whats-trending-cmp-desktop .swiper-slide'],
    },
    {
      name: 'tabs-showcase',
      instances: ['.motorcyclewithcategories', '.iridegrid'],
    },
    {
      name: 'cards-culture',
      instances: ['.motoculture .swiper-slide'],
    },
    {
      name: 'cards-events',
      instances: ['.marquee-rides-events-cards .marquee-rides-events-card'],
    },
    {
      name: 'carousel-legacy',
      instances: ['.swiper-container--legacy .swiper-slide'],
    },
    {
      name: 'columns-locator',
      instances: ['.section-locate-centre.re-rides-home-locate-us-component'],
    },
    {
      name: 'cards-shop',
      instances: ['.shop-section .shop-section__cards .shop-card'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '.swipercarousel.carousel.panelcontainer.cmp--royal-enfield-swiper',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'In the Headlights',
      selector: '#highlights-section',
      style: 'dark',
      blocks: ['cards-spotlight'],
      defaultContent: ['#highlights-section .whatstrending h2'],
    },
    {
      id: 'section-3',
      name: 'Motorcycles Showcase',
      selector: '.motorcyclewithcategories',
      style: 'dark',
      blocks: ['tabs-showcase'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'MotoCulture',
      selector: '.motoculture',
      style: 'dark',
      blocks: ['cards-culture'],
      defaultContent: ['.motoculture h3.heading'],
    },
    {
      id: 'section-5',
      name: 'Ride',
      selector: '.iridegrid',
      style: 'dark',
      blocks: ['tabs-showcase'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Rides and Events',
      selector: '#latestSection',
      style: 'dark',
      blocks: ['cards-events'],
      defaultContent: ['.marquee-rides-events-container .marquee-rides-header h3'],
    },
    {
      id: 'section-7',
      name: 'Legacy since 1901',
      selector: '.swipercarousel.carousel.panelcontainer.swiper-container--legacy',
      style: 'dark',
      blocks: ['carousel-legacy'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Locate Us',
      selector: '.locateservicecentrecard',
      style: 'dark',
      blocks: ['columns-locator'],
      defaultContent: [],
    },
    {
      id: 'section-9',
      name: 'Shop',
      selector: '.royal-enfield-shop-us',
      style: 'dark',
      blocks: ['cards-shop'],
      defaultContent: ['.shop-section h3.shop-section__title'],
    },
    {
      id: 'section-10',
      name: 'Footer',
      selector: '.re-revamp__footer-fragment',
      style: null,
      blocks: [],
      defaultContent: [],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
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
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
