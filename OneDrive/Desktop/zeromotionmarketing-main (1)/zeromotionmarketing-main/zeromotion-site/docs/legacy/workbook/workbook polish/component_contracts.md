# Component Contracts

## 1. Navbar

- **Props**:
  - `primaryCtaText`: string (e.g., "View Pricing")
  - `primaryCtaLink`: string (e.g., "/pricing")
  - `secondaryCtaText`: string (e.g., "Get CRM Software")
  - `secondaryCtaLink`: string (e.g., "/crm")
- **Slots**:
  - `logo`: For the site logo
  - `navItems`: For the list of navigation links
- **Usage Rules**:
  - Must be sticky.
  - Transparent over hero sections, solid color on scroll.
  - Active link styling for the current page.
  - Mobile drawer should maintain the same navigation order.

## 2. Footer

- **Props**:
  - `aboutText`: string
  - `servicesLinks`: array of objects `[{text: string, link: string}]`
  - `companyLinks`: array of objects `[{text: string, link: string}]`
  - `contactInfo`: object `{email: string, phone: string, address: string}`
- **Usage Rules**:
  - Consistent across all pages.
  - Must include NAP for local SEO.

## 3. Hero

- **Props**:
  - `headline`: string
  - `subtext`: string
  - `primaryCtaText`: string
  - `primaryCtaLink`: string
  - `secondaryCtaText`: string
  - `secondaryCtaLink`: string
- **Slots**:
  - `background`: For the background video or image
- **Usage Rules**:
  - Hero media should be compressed and have a poster image.

## 4. Card

- **Props**:
  - `title`: string
  - `content`: string
  - `ctaText`: string (optional)
  - `ctaLink`: string (optional)
- **Usage Rules**:
  - Use `--zm-radius` for border-radius.
  - Use `--zm-gap-md` for internal padding.
  - Consistent hover and focus states.

## 5. CTA (Call to Action)

- **Props**:
  - `text`: string
  - `link`: string
  - `isPrimary`: boolean (true for solid, false for ghost)
- **Usage Rules**:
  - Primary CTAs should use `--zm-primary` background.
  - Secondary CTAs should be ghost buttons.

## 6. FAQ

- **Props**:
  - `items`: array of objects `[{question: string, answer: string, slug: string}]`
- **Usage Rules**:
  - Must be a single, reusable accordion component.
  - Keyboard accessible.

## 7. Pricing Table

- **Props**:
  - `plans`: array of objects, each with `name`, `price`, `features`, `ctaText`, `ctaLink`
- **Usage Rules**:
  - Feature language must be consistent across all plans.
  - Each plan should have a clear primary CTA.

## 8. Add-on Card

- **Props**:
  - `title`: string
  - `price`: string
  - `features`: array of strings
  - `ctaText`: string
  - `ctaLink`: string
- **Usage Rules**:
  - Consistent styling with other cards.
  - Tooltips for more detailed feature explanations.

## 9. Industry Card

- **Props**:
  - `industryName`: string
  - `description`: string
  - `link`: string
- **Usage Rules**:
  - Used on the Ad Campaigns page.
  - Should have a hover effect that reveals more information or a link.


