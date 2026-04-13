# Design Brief: MD Printing Press

**Tone:** Premium, trustworthy, conversion-focused. Professional blue anchor with sparingly-applied green accents. Bold geometric typography (Space Grotesk) paired with clean, legible body text (DM Sans). Signals quality, speed, and local expertise.

## Palette

| Token | Light OKLCH | Dark OKLCH | Semantic Use |
| :--- | :--- | :--- | :--- |
| Primary | `0.475 0.21 261` (deep blue) | `0.65 0.19 261` (vibrant blue) | CTAs, headers, active states, hero accents |
| Accent | `0.68 0.20 135` (green) | `0.72 0.18 135` (bright green) | WhatsApp CTA, success badges, spot highlights |
| Foreground | `0.15 0.01 0` (near black) | `0.96 0.01 0` (near white) | Body text, labels, primary content |
| Muted | `0.92 0.02 0` (light grey) | `0.2 0.01 0` (dark grey) | Secondary text, disabled states, borders |
| Border | `0.9 0.01 0` | `0.22 0.01 0` | Card edges, dividers, input outlines |

## Typography

| Layer | Font | Scale | Weight | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| Display | Space Grotesk | 2.25rem–3rem | 700 | Hero H1, section headers, card titles |
| Body | DM Sans | 0.875rem–1rem | 400–600 | Body copy, UI labels, descriptions |
| Mono | GeistMono | 0.75rem–0.875rem | 400–500 | Admin data tables, code snippets, numbers |

## Elevation & Depth

| Zone | Treatment | Shadow | Border |
| :--- | :--- | :--- | :--- |
| Header | `bg-card` with `border-b` | subtle | `border-border` |
| Hero Section | `bg-background` full-width | none | none |
| Card / Service Tile | `bg-card` + `rounded-lg` | subtle | `border-border` 1px |
| Admin Sidebar | `bg-sidebar` persistent left | none | `sidebar-border` right |
| Portfolio Gallery | Grid, hover → `shadow-elevated` | subtle default | none |
| Footer | `bg-muted/40` with `border-t` | none | `border-border` |
| CTA Buttons | Primary blue gradient hover | elevated on active | none |

## Structural Zones

- **Header:** Card-style header with logo (left), nav links (center/right), light bg with subtle bottom border. Sticky on scroll.
- **Hero:** Full-width centered layout, gradient-subtle background (optional), bold Space Grotesk H1, 2 primary CTAs (blue + green WhatsApp).
- **Services Grid:** 3-column grid (responsive 1–2 on mobile), alternating card/muted-bg rows. Each card has icon, title, description. Blue accent on hover.
- **Portfolio Gallery:** Clean 4-column grid gallery, subtle hover lift, overlay on hover with link.
- **Admin Sidebar:** Left sidebar (fixed/sticky), nav links with blue active state, dark toggle button in header.
- **Footer:** Muted background, contact info (address, phone, email), social links, copyright. Border-top separator.

## Spacing & Rhythm

- **Gutters:** 1rem (sm), 1.5rem (md), 2rem (lg)
- **Component padding:** 1rem cards, 1.5rem sections, 2rem hero/footer
- **Density:** Conversion pages (hero/services) have generous spacing; admin dashboard (tables, sidebars) is tighter

## Component Patterns

- **Primary CTA:** `bg-primary text-primary-foreground px-6 py-3 rounded-lg font-display font-bold hover:shadow-elevated transition-smooth`
- **WhatsApp CTA:** `bg-accent text-accent-foreground` (green), same layout as primary
- **Card:** `bg-card border border-border rounded-lg p-4 shadow-subtle hover:shadow-elevated transition-smooth`
- **Badge (Trust):** Inline flex, `bg-accent/10 text-accent font-display text-sm font-bold`, badges: "✓ Fast Delivery", "✓ Quality Guarantee", "✓ Local Expert"
- **Form Input:** `bg-input border-border rounded-md px-3 py-2 text-foreground placeholder-muted-foreground focus:ring focus:ring-ring/50`

## Motion & Interaction

- **Default transition:** `transition-smooth` (0.3s cubic-bezier(0.4, 0, 0.2, 1))
- **Hover states:** Buttons → `shadow-elevated` + slight scale. Cards → `shadow-elevated` only.
- **Focus states:** All interactive elements → `ring-2 ring-ring/50`
- **Animations:** Fade-in on page load, slide-up for content sections (optional, use sparingly)

## Constraints

- No neon glows, no bouncy animations, no excessive shadows
- Max 2 font families (Space Grotesk + DM Sans). Mono only in admin/code contexts.
- Stick to 3–5 core colors; reserve green accent strictly for WhatsApp/messaging CTAs and success badges
- All tokens via CSS variables; no hardcoded hex or rgb colors in components
- Dark mode: intentional tuning (not just inverted lightness), brighten primary/accent for readability

## Differentiation

**Signature detail:** Bold geometric display font (Space Grotesk) paired with refined body text creates distinctive, memorable hierarchy. Blue-and-green CTA pairing (primary + WhatsApp accent) signals both professional quality and instant communication. Trust badges (checkmark style, green accent) anchor credibility.

## Responsive Breakpoints

- Mobile: `sm` (640px) — single column, full-width cards, compact spacing
- Tablet: `md` (768px) — 2-column grid, sidebars collapse to drawers
- Desktop: `lg`+ (1024px+) — full layout, 3-4 column grids, persistent sidebars
