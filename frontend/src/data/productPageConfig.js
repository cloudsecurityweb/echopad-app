/**
 * Product page layout config — different layout and section order per product
 * so each page tells its own story instead of sharing one template.
 *
 * Layouts:
 * - split-hero: Left copy + right demo (classic). Use when demo supports the headline.
 * - centered-hero: Centered headline + visual (e.g. DocMan, Medical Assistant).
 * - demo-first: Demo is the hero; copy is minimal. Use when "see it work" is the story.
 *
 * Hero blocks (for split-hero):
 * - minimal: Only headline, one-liner, optional one visual + CTA (no Business Value / What You See / Key Benefits in hero)
 * - full: All traditional blocks in hero (legacy cookie-cutter)
 *
 * Sections (order matters; omit what doesn't fit the story):
 * - whats-different, before-after, how-it-works, why-it-matters, setup-grid, perfect-for, cta
 */

export const productPageLayouts = {
  '/ai-scribe': {
    layout: 'split-hero',
    heroBlocks: 'minimal',
    sections: ['whats-different', 'why-it-matters', 'before-after', 'how-it-works', 'setup-grid', 'perfect-for', 'cta'],
    storyAngle: 'Outcome first: note done before you leave. Then what\'s different, proof, how it works, setup.',
  },
  '/ai-receptionist': {
    layout: 'demo-first',
    heroBlocks: 'minimal',
    sections: ['why-it-matters', 'setup-grid', 'cta'],
    storyAngle: 'Demo first (call flow). Then why 24/7 matters, implementation, CTA. No before/after or 3-step.',
  },
  '/aperio': {
    layout: 'split-hero',
    heroBlocks: 'minimal',
    sections: ['why-it-matters', 'how-it-works', 'setup-grid', 'cta'],
    storyAngle: 'Referral loop story. Punchy hero, then why it matters, how loop closes, setup, CTA.',
  },
  '/ai-docman': {
    layout: 'centered-hero',
    heroBlocks: 'minimal',
    sections: ['why-it-matters', 'template-gallery', 'how-it-works', 'key-features', 'roi-calculator', 'cta'],
    storyAngle: 'Speed + templates. Centered hero, why it matters, template gallery, 3-step, features, ROI, CTA.',
  },
  '/ai-medical-assistant': {
    layout: 'centered-hero',
    heroBlocks: 'minimal',
    sections: ['why-it-matters', 'what-gets-captured', 'benefits-grid', 'setup-grid', 'cta'],
    storyAngle: 'Complete visit capture. Centered hero + process timeline, why it matters, capture grid, benefits, setup, CTA.',
  },
  '/ai-admin-assistant': {
    layout: 'split-hero',
    heroBlocks: 'minimal',
    sections: ['why-it-matters', 'setup-grid', 'cta'],
    storyAngle: 'Operational workflows. Minimal hero, why it matters, implementation, CTA.',
  },
  '/ai-reminders': {
    layout: 'split-hero',
    heroBlocks: 'minimal',
    sections: ['why-it-matters', 'setup-grid', 'cta'],
    storyAngle: 'Care coordination. Minimal hero, why it matters, implementation, CTA.',
  },
  '/echopad-insights': {
    layout: 'split-hero',
    heroBlocks: 'minimal',
    sections: ['why-it-matters', 'features', 'use-cases', 'platform-capabilities', 'faq', 'cta'],
    storyAngle: 'Revenue intelligence. Minimal hero, why it matters, features, use cases, platform, FAQ, CTA.',
  },
};

export function getProductPageLayout(route) {
  return productPageLayouts[route] || {
    layout: 'split-hero',
    heroBlocks: 'full',
    sections: ['why-it-matters', 'setup-grid', 'cta'],
  };
}
