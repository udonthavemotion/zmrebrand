# Cursor Prompt Workbook

*Use in order. Each prompt is self-contained. Run on a feature branch and commit after each acceptance pass.*

## 0) Repo Audit & Safety Net

**Goal:** Snapshot the codebase and map pages/components before touching the UI.

**Acceptance Criteria:**
- A tree of the `src` directory is printed to the console.
- A new branch named `feat/site-polish-MMDD` (e.g., `feat/site-polish-0903`) is created and checked out.
- A `changes.md` file is created at the root of the project.
- There are zero diffs between the new branch and `main` initially.

**Cursor Prompt:**

'''
I need to prepare the repository for a full-site polish. Please perform the following setup tasks:

1.  **List the entire file structure** of the `src` directory to give me an overview of the current components, pages, and layouts.

2.  **Create and check out a new feature branch** named `feat/site-polish-` followed by today's month and day (e.g., `feat/site-polish-0903`).

3.  **Create a new file** named `changes.md` at the root of the project. This file will be used to log all changes made during this polish.

Confirm that the branch has been created and that there are no initial differences with the `main` branch.
'''

**Test Steps:**
1.  Verify the file tree output in the console.
2.  Run `git branch` to confirm the new branch is active.
3.  Check for the existence of `changes.md` in the file explorer.
4.  Run `git diff main` to ensure there are no initial changes.




## 1) Design Tokens & Global Styles

**Goal:** Centralize colors, spacing, and typography to ensure brand consistency and prevent style drift.

**Acceptance Criteria:**
- A design token system is established in a global CSS/SCSS file (e.g., `src/styles/tokens.css`).
- All components are updated to use the new design tokens (`--zm-*` variables).
- There are no visual regressions on any page.
- Headings (`h1` through `h6`) use the `clamp()` function for fluid typography and scale correctly on mobile devices.

**Cursor Prompt:**

'''
I need to establish a design token system to standardize the site's visual language. Please perform the following actions:

1.  **Create a new file** at `src/styles/tokens.css`.

2.  **Populate this file with the following CSS variables** under the `:root` selector. Map them to the existing brand colors and styles:

    ```css
    :root {
      --zm-bg: #0D0D1A; /* Near-black purple */
      --zm-surface: #1A1A2E; /* Dark blue-purple for cards */
      --zm-text: #FFFFFF;
      --zm-text-muted: #A0A0B0;
      --zm-primary: #8B5CF6; /* Main purple accent */
      --zm-primary-ghost: rgba(139, 92, 246, 0.2);
      --zm-accent: #FACC15; /* Optional accent */

      --zm-radius: 8px;
      --zm-gap-sm: 8px;
      --zm-gap-md: 16px;
      --zm-gap-lg: 32px;

      --zm-h1: clamp(2.5rem, 5vw, 4rem);
      --zm-h2: clamp(2rem, 4vw, 3rem);
      --zm-h3: clamp(1.75rem, 3.5vw, 2.5rem);
      --zm-h4: clamp(1.5rem, 3vw, 2rem);
      --zm-h5: clamp(1.25rem, 2.5vw, 1.75rem);
      --zm-h6: clamp(1rem, 2vw, 1.5rem);
    }
    ```

3.  **Refactor all existing stylesheets** (global styles, component styles) to replace hardcoded color, spacing, and font-size values with these new `--zm-*` variables.

4.  **Update the global typography styles** to apply the `clamp()`-based font sizes to the `h1`, `h2`, `h3`, `h4`, `h5`, and `h6` elements.
'''

**Test Steps:**
1.  Review the site on desktop and mobile (≥360px) to ensure no visual styles have been broken.
2.  Inspect key components (buttons, cards, text) in the browser's developer tools to confirm they are using the new CSS variables.
3.  Resize the browser window to verify that headings scale smoothly without abrupt breaks.




## 2) Navbar Rebuild (Flow + CTA hierarchy)

**Goal:** Ship a sticky, minimal navigation bar that provides clear user routing and a strong conversion focus.

**Acceptance Criteria:**
- The navbar is sticky and remains at the top of the viewport on scroll.
- It is transparent over hero sections and transitions to a solid background (`--zm-surface`) on scroll.
- The navigation structure matches the defined Information Architecture.
- The primary CTA button is context-aware: "View Pricing" on most pages, and "Book Free Consultation" on the Pricing page.
- The mobile drawer (hamburger menu) is clean, functional at 360px width, and mirrors the desktop navigation order.
- All navigation links have clear `active-link` states.
- The `cta_click` and `nav_open` analytics events are firing correctly.
- The navbar passes Lighthouse accessibility checks (≥95).

**Cursor Prompt:**

"""
I need to rebuild the site's primary navigation to improve user flow and standardize the CTA hierarchy. Please implement the following:

1.  **Component:** Target the existing `Navbar` component for a complete overhaul.

2.  **Structure and Information Architecture:**
    -   **Logo:** Links to the Home page (`/`).
    -   **Navigation Links (in this order):**
        -   `Services` (as a dropdown or mega menu) containing:
            -   `Brand & Identity` (`/services/brand-identity`)
            -   `Web Design` (`/services/web-design`)
            -   `Ad Campaigns` (`/services/ad-campaigns`)
            -   `AI Integration` (`/services/ai-integration`)
        -   `Pricing` (`/pricing`)
        -   `About` (`/about`)
    -   **Secondary CTA:** A ghost button with the text "Get CRM Software."
    -   **Primary CTA:** A solid purple button. The text and link must be props passed from the parent page:
        -   On the Pricing page, it should be "Book Free Consultation."
        -   On all other pages, it should be "View Pricing."

3.  **Behavior and Styling:**
    -   Make the navbar `position: sticky` and `top: 0`.
    -   Implement a scroll-based background color change. It should be `transparent` when the user is at the top of the page (intersecting with a hero section) and transition to `var(--zm-surface)` after scrolling down ~100px.
    -   Add a distinct visual style for the active navigation link (e.g., using `var(--zm-primary)` color).
    -   Ensure the mobile hamburger menu is well-styled, opens a full-height drawer, and contains the exact same navigation structure.

4.  **Analytics:**
    -   Fire a `cta_click` event with the label `nav_primary` when the main CTA is clicked.
    -   Fire a `nav_open` event when the mobile hamburger menu is opened.
"""

**Test Steps:**
1.  Navigate to the Home page. Verify the navbar is transparent. Scroll down and confirm it becomes solid.
2.  Check the primary CTA on the Home page ("View Pricing") and the Pricing page ("Book Free Consultation").
3.  Resize the browser to 360px. Open the hamburger menu and verify all links are present and in the correct order.
4.  Click through each navigation link and confirm the active state is applied correctly.
5.  Use browser developer tools to monitor the data layer for `cta_click` and `nav_open` events.
6.  Run a Lighthouse audit on a page with the new navbar and ensure the accessibility score is 95 or higher.




## 3) Footer Standardization + Local SEO

**Goal:** Create a single, clean footer component that is used on all pages and includes essential information for users and search engines.

**Acceptance Criteria:**
- A single, unified footer component is used across the entire website.
- The footer contains the correct sections: About blurb, Services, Company, and Contact (NAP).
- The NAP information is consistent and accurate for Houma, LA.
- `Organization` and `LocalBusiness` JSON-LD schema is implemented and validates correctly.

**Cursor Prompt:**

"""
I need to standardize the website footer and implement local SEO schema. Please create a single, reusable footer component with the following structure and features:

1.  **Component:** Create or refactor a global `Footer` component.

2.  **Structure and Content:**
    -   **About Blurb:** A brief, one-sentence mission statement for ZeroMotion.
    -   **Services List:**
        -   Brand & Identity (`/services/brand-identity`)
        -   Web Design (`/services/web-design`)
        -   Ad Campaigns (`/services/ad-campaigns`)
        -   AI Integration (`/services/ai-integration`)
    -   **Company List:**
        -   About (`/about`)
        -   Pricing (`/pricing`)
        -   Privacy (`/privacy`)
    -   **Contact (NAP):**
        -   Email: `zeromotionmarketing@gmail.com`
        -   Phone: `(985) 217-0368`
        -   Address: `Houma, Louisiana`

3.  **Local SEO Schema:**
    -   Embed a `<script type="application/ld+json">` block in the footer.
    -   **`Organization` Schema:** Include the company name, URL, and logo.
    -   **`LocalBusiness` Schema:** Include the business name, address (with `addressLocality`, `addressRegion`, and `addressCountry`), phone number, and `areaServed` for "Terrebonne Parish" and "Lafourche Parish".

4.  **Deployment:** Ensure this new global footer component is added to every page layout.
"""

**Test Steps:**
1.  Navigate through all pages of the site and confirm the same footer appears everywhere.
2.  Verify all links in the footer are correct.
3.  Use Google's Rich Results Test or Schema Markup Validator to paste the page's HTML and confirm that the `Organization` and `LocalBusiness` schemas are free of errors.




## 4) Home Flow Hardening

**Goal:** Restructure the Home page to create a clear conversion funnel that guides users toward viewing pricing or booking a consultation.

**Acceptance Criteria:**
- The Home page sections are reordered to follow the specified conversion flow.
- The hero section contains a primary "View Pricing" CTA and a secondary "Get CRM Software" CTA.
- All below-the-fold media (images/videos) are lazy-loaded.
- The hero video/image is compressed and has a poster image to improve LCP.
- The page achieves a CLS score of < 0.1.
- The user can get to the Pricing page in one click from the hero section.

**Cursor Prompt:**

"""
I need to overhaul the Home page to optimize its conversion flow. Please implement the following changes:

1.  **Section Reordering:** Rearrange the sections on the Home page in the following specific order:
    1.  **Hero:** Headline, subcopy, and CTAs.
    2.  **3 Pillars:** A section highlighting three core value propositions (e.g., "Conversion-first," "Fast & SEO-ready," "Automation baked-in").
    3.  **Plans Teaser:** A section with three cards teasing the Starter, Growth, and Scale plans, showing setup and monthly costs.
    4.  **Services Grid:** A grid of 4 tiles linking to the primary service pages.
    5.  **Proof/Logos:** A placeholder section for client logos (can be titled "Local businesses we’ve helped").
    6.  **Final CTA Band:** A full-width section with the heading "Ready to get started?" and a primary CTA to "Book Free Consultation."

2.  **Hero Section Update:**
    -   Ensure the primary CTA is "View Pricing" and links to `/pricing`.
    -   Ensure the secondary CTA is "Get CRM Software."

3.  **Performance Optimizations:**
    -   Compress the hero background media (video to 1080p, ≤8Mbps; image to <1600px WebP/AVIF).
    -   Add a `poster` attribute to the hero video.
    -   Apply `loading="lazy"` to all `<img>` and `<iframe>` elements that are not in the hero section.
"""

**Test Steps:**
1.  Load the Home page and verify the new section order.
2.  Confirm the hero CTAs are correct and functional.
3.  Use browser developer tools to inspect the network tab and confirm that below-the-fold images are only loaded as you scroll down.
4.  Run a Lighthouse audit to check the LCP and CLS scores.
5.  Click the "View Pricing" button and ensure it navigates to the Pricing page.




## 5) Pricing Page (Clarity + Comparison)

**Goal:** Create a clear, compelling pricing page that helps users easily compare plans and make a decision.

**Acceptance Criteria:**
- The three pricing tiers (Starter, Growth, Scale & Dominate) are presented with consistent feature language.
- A "Compare Features" table is implemented and is responsive on mobile devices.
- The global FAQ accordion component is used on this page.
- The `plan_selected` and `cta_click` analytics events are firing correctly.
- There are no price mismatches between this page and other mentions on the site.

**Cursor Prompt:**

"""
I need to refine the Pricing page to improve clarity and add a feature comparison table. Please implement the following:

1.  **Normalize Feature Language:** Review the feature lists for the "Starter Website," "Growth Marketing," and "Scale & Dominate" plans. Ensure the language is consistent and easy to understand. For example, use the same terminology for similar features across all plans.

2.  **Implement "Compare Features" Table:**
    -   Create a new responsive table component.
    -   The table should have a row for each key feature and a column for each plan.
    -   Include features like: Pages, Hosting, SEO basics, Ad setup, Automation, Reporting, and Support cadence.
    -   Use checkmarks or other icons to indicate which features are included in each plan.

3.  **Integrate FAQ Component:**
    -   Reuse the global FAQ accordion component at the bottom of the page to answer common pricing questions.

4.  **Analytics:**
    -   When a user clicks the primary CTA on a pricing card (e.g., "Get this plan"), fire a `plan_selected` event with the `label` set to the plan name (e.g., "Starter Website").
    -   Also fire a `cta_click` event with the label "Get this plan".
"""

**Test Steps:**
1.  Review the pricing cards to ensure the feature descriptions are clear and consistent.
2.  Check the "Compare Features" table on both desktop and mobile to ensure it is readable and responsive.
3.  Verify that the FAQ accordion is functioning correctly.
4.  Click the CTA on each pricing card and use the browser's developer tools to confirm that the `plan_selected` and `cta_click` events are being sent to the data layer with the correct labels.




## 6) Services – Brand & Identity

**Goal:** Create a standardized and compelling page for the Brand & Identity service.

**Acceptance Criteria:**
- The page follows the specified pattern: Hero → "Why branding..." → Feature cards → CTA.
- The feature cards reuse the global `Card` component.
- The content and tone are consistent with the rest of the site.
- The final CTA correctly routes to the Pricing page.

**Cursor Prompt:**

"""
I need to build out the "Brand & Identity" service page using our new standardized template and components.

1.  **Page:** `src/pages/services/brand-identity.astro` (or equivalent).

2.  **Structure and Content:** Implement the following sections in order:
    1.  **Hero Section:** A compelling hero with a headline focused on the value of professional branding.
    2.  **"Why it works" Section:** A text block explaining "Why branding combined with a great website and marketing strategy wins in the Louisiana market."
    3.  **Feature Cards Section:** A grid of 4-6 feature cards using the global `Card` component. Populate them with features like:
        -   Brand Guidelines
        -   Logo System
        -   Voice & Tone
        -   Social Media Kit
        -   Email Templates
    4.  **CTA Section:** A final call-to-action that directs users to the Pricing page (`/pricing`).

3.  **Component Usage:** Ensure that the feature cards are instances of the global `Card` component, inheriting the styles defined by the design tokens.
"""

**Test Steps:**
1.  Verify that the page layout matches the specified section order.
2.  Inspect the feature cards to confirm they are using the global `Card` component and its styles.
3.  Click the final CTA and confirm it navigates to `/pricing`.
4.  Check the page for consistent tone and branding.




## 7) Services – Web Design & Development

**Goal:** Create a compelling page for the Web Design & Development service that highlights the process and value.

**Acceptance Criteria:**
- The page follows the specified pattern: Hero → "Looks like luxury..." → 10-day build steps → Package teaser → CTA.
- The build steps component is styled consistently with other page elements.
- All images on the page are optimized and lazy-loaded.

**Cursor Prompt:**

"""
I need to build out the "Web Design & Development" service page. Please implement the following structure and content:

1.  **Page:** `src/pages/services/web-design.astro` (or equivalent).

2.  **Structure and Content:** Implement the following sections in order:
    1.  **Hero Section:** A hero with the headline "Looks like luxury. Performs like a machine."
    2.  **10-Day Build Steps:** A section detailing the 10-day build process, broken down into four key stages: Audit, Design, Build, and Launch.
    3.  **Package Teaser:** A section that briefly teases the website packages and links to the main Pricing page.
    4.  **CTA Section:** A final call-to-action that encourages users to view the packages or book a consultation.

3.  **Performance:**
    -   Ensure all images used on this page are optimized (e.g., WebP/AVIF format).
    -   Apply `loading="lazy"` to all images below the hero section.
"""

**Test Steps:**
1.  Verify the page layout and section order.
2.  Check that the build steps component is visually consistent with the site's design.
3.  Use browser developer tools to confirm that images are lazy-loaded.
4.  Click the CTAs to ensure they link to the correct pages.




## 8) Services – Ad Campaigns & Media

**Goal:** Create a service page for Ad Campaigns that highlights the process and targets specific local industries.

**Acceptance Criteria:**
- The page follows the specified pattern: Hero → 3-step graphic → Industries tiles → CTA.
- Each industry tile links to a relevant anchor or section with more information.
- The final CTA flows to the consultation booking page.

**Cursor Prompt:**

"""
I need to build the "Ad Campaigns & Media" service page. Please implement the following structure and content:

1.  **Page:** `src/pages/services/ad-campaigns.astro` (or equivalent).

2.  **Structure and Content:** Implement the following sections in order:
    1.  **Hero Section:** A hero with the headline "How we run ads that are simple and effective."
    2.  **3-Step Graphic:** A visual graphic that illustrates the 3-step process for running ad campaigns.
    3.  **Industries Tiles:** A section with clickable tiles for the following industries:
        -   Construction/Trades
        -   Real Estate
        -   Auto Detailing & Tint
        -   Restaurants
    4.  **CTA Section:** A final call-to-action that directs users to book a consultation.

3.  **Interactivity:**
    -   Each industry tile should link to an anchor on the page or a short section that provides more details on the value proposition for that specific industry.
"""

**Test Steps:**
1.  Verify the page layout and section order.
2.  Click on each industry tile and confirm that it navigates to the correct section or anchor.
3.  Click the final CTA and ensure it leads to the consultation booking page.




## 9) Services – AI Integration (and Add-Ons)

**Goal:** Unify the presentation of AI add-on services with clear pricing and features.

**Acceptance Criteria:**
- The page features standardized `Add-on Cards` for each AI service tier.
- Each card clearly displays the price and a bulleted list of features.
- The cards have hover and focus states that match the site-wide design system.
- CTAs on the cards link to the main Pricing page and the "Get CRM Software" page.

**Cursor Prompt:**

"""
I need to create a dedicated page for "AI Integration" that clearly presents our add-on packages. Please implement the following:

1.  **Page:** `src/pages/services/ai-integration.astro` (or equivalent).

2.  **Component:** Use a new or existing `AddonCard` component for the packages.

3.  **Content:** Create a section with three `AddonCard` instances for the following packages:
    -   **Basic AI Add-On:** $197/mo
    -   **Advanced AI Add-On:** $397/mo
    -   **AI Analytics Add-On:** $597/mo
    Each card should include a bulleted list of its key features.

4.  **Styling and Interactivity:**
    -   Ensure the cards use the global design tokens for consistent styling.
    -   Implement hover and focus states that match the rest of the site's interactive elements.

5.  **CTAs:**
    -   Include a button on each card that links to the main Pricing page (`/pricing`).
    -   Include a secondary link or button that directs users to the "Get CRM Software" page.
"""

**Test Steps:**
1.  Verify the page layout and that the three add-on cards are displayed correctly.
2.  Check the pricing and feature lists on each card for accuracy.
3.  Hover over and click on the cards to test their interactive states.
4.  Confirm that the CTAs link to the correct pages.




## 10) About Page Tighten

**Goal:** Refine the About page to clearly communicate the company's values and mission, aligned with the brand's core message.

**Acceptance Criteria:**
- The page prominently features the tagline "Minimalism. Functionality. Precision."
- The three value pillars (Lightning Fast, Heartfelt Design, Results Driven) are presented using the global `Card` component.
- The page ends with a clear call-to-action to book a consultation.
- The content has a reading grade of approximately 8, ensuring it is accessible and easy to understand.

**Cursor Prompt:**

"""
I need to tighten up the About page to better align with our brand's core values. Please implement the following changes:

1.  **Page:** `src/pages/about.astro` (or equivalent).

2.  **Structure and Content:**
    1.  **Headline:** Ensure the main headline is "Minimalism. Functionality. Precision."
    2.  **Mission Statement:** Include a concise mission statement that follows the headline.
    3.  **Value Pillars:** Create a section with three cards (using the global `Card` component) to represent the core value pillars:
        -   Lightning Fast
        -   Heartfelt Design
        -   Results Driven
    4.  **Final CTA:** End the page with a strong call-to-action to "Book a Free Consultation."

3.  **Content Simplification:** Review the page copy and simplify it to achieve a reading grade of approximately 8. Ensure there are no orphan words or CTAs.
"""

**Test Steps:**
1.  Verify the page layout and that the headline and value pillars are displayed correctly.
2.  Check that the value pillars are using the global `Card` component.
3.  Click the final CTA to ensure it links to the consultation booking page.
4.  Use an online tool to check the reading grade of the page's content.




## 11) FAQ Component (Global)

**Goal:** Create a single, reusable FAQ accordion component to be used across the entire site.

**Acceptance Criteria:**
- A global `FAQ` component is created.
- The component accepts an array of `items` as a prop, each with a `question`, `answer`, and optional `slug`.
- The accordion is keyboard accessible (e.g., users can tab through questions and press Enter to toggle).
- The expand/collapse animation is smooth.
- The `faq_toggle` analytics event is fired with the question `slug` when an item is toggled.

**Cursor Prompt:**

"""
I need to create a global, reusable FAQ accordion component. Please build it with the following specifications:

1.  **Component:** Create a new global component named `FAQ`.

2.  **Props:** The component should accept a single prop: `items`. This will be an array of objects, where each object has the following shape:
    ```typescript
    {
      question: string,
      answer: string,
      slug?: string // Optional identifier for analytics
    }
    ```

3.  **Functionality:**
    -   The component should render a list of questions.
    -   Clicking a question should smoothly expand to reveal the answer and collapse any other open answers.
    -   The component must be fully keyboard accessible.

4.  **Analytics:**
    -   When a user toggles an accordion item, fire an `faq_toggle` event. If the item has a `slug`, include it in the event data.

5.  **Deployment:** Replace existing FAQ sections on the Pricing and Services pages with this new global component.
"""

**Test Steps:**
1.  Add the new `FAQ` component to the Pricing page and a Service page.
2.  Use the mouse to click and toggle different FAQ items. Verify the smooth animation.
3.  Use the keyboard (Tab and Enter keys) to navigate and toggle the FAQ items.
4.  Open the browser developer tools and confirm that the `faq_toggle` event is fired with the correct `slug` each time an item is opened.




## 12) Forms, Calendars, and GHL Wiring

**Goal:** Ensure all forms and calendars are correctly integrated with GoHighLevel (GHL) and that the styling is consistent with the brand.

**Acceptance Criteria:**
- All forms submitted on the site are sent to the GHL pipeline with the correct tags.
- Hidden fields for `page`, `plan`, and `source` are included in all form submissions.
- The GHL calendar embed is responsive and styled to match the website's dark theme.
- The `form_submit`, `cal_open`, and `cal_submit` analytics events are firing correctly.
- An end-to-end test confirms that a new lead appears in GHL with the correct data and triggers the appropriate auto-reply.

**Cursor Prompt:**

"""
I need to wire up all forms and calendars to GoHighLevel (GHL) and ensure they are styled correctly.

1.  **Form Integration:**
    -   For all forms on the site, add the following hidden fields: `page`, `plan`, and `source`.
    -   Configure a webhook that, on form submission, sends the data to GHL to create or update a contact.
    -   The webhook should tag the lead with `lead_source:website`, add them to the "ZM Sales" pipeline, and set their status to "New Inquiry."

2.  **Calendar Styling:**
    -   For the embedded GHL calendar, ensure its container is responsive, taking up the full width on mobile devices with adequate padding.
    -   Apply CSS to the calendar embed to ensure its colors and fonts match the website's dark theme and brand.

3.  **Analytics:**
    -   Fire a `form_submit` event when any form is submitted.
    -   Fire a `cal_open` event when the calendar is viewed.
    -   Fire a `cal_submit` event when a meeting is booked through the calendar.
"""

**Test Steps:**
1.  Submit a test form from the website. Log in to GHL and confirm that the new contact appears in the "ZM Sales" pipeline with the correct tags and hidden field data.
2.  Verify that the auto-reply email/SMS is received.
3.  View the calendar on a mobile device (360px) and confirm it is responsive and styled correctly.
4.  Use the browser developer tools to monitor the data layer for the `form_submit`, `cal_open`, and `cal_submit` events during testing.




## 13) Analytics & Events

**Goal:** Implement a uniform data layer across the site to track key user interactions.

**Acceptance Criteria:**
- A GA4 (or existing analytics stack) initialization script is present.
- Data layer events are pushed for all specified user actions (nav clicks, CTAs, plan selections, forms, calendars).
- Events are visible in the GA4 DebugView with appropriate labels.

**Cursor Prompt:**

"""
I need to set up a uniform data layer for analytics tracking. Please implement the following:

1.  **Analytics Initialization:**
    -   Ensure that the Google Analytics 4 (GA4) or existing analytics script is loaded on all pages.

2.  **Data Layer Events:**
    -   Create a helper function or system to push events to the `dataLayer`.
    -   Implement the following events throughout the site:
        -   `cta_click`: When any primary or secondary CTA is clicked. Include `page` and `label` in the event data.
        -   `plan_selected`: When a user selects a pricing plan. Include `plan_name`.
        -   `nav_open`: When the mobile navigation is opened.
        -   `faq_toggle`: When an FAQ item is toggled. Include `faq_slug`.
        -   `form_submit`: When a form is submitted. Include `form_name`.
        -   `cal_open`: When the booking calendar is viewed.
        -   `cal_submit`: When a meeting is booked.
"""

**Test Steps:**
1.  Enable the GA4 DebugView.
2.  Navigate the site and perform all tracked actions (clicking CTAs, selecting plans, opening the mobile nav, etc.).
3.  Verify that each action appears as an event in the DebugView with the correct parameters and labels.




## 14) SEO Pack

**Goal:** Implement foundational on-page SEO to improve search visibility.

**Acceptance Criteria:**
- All pages have a unique title that follows the specified pattern.
- All pages have a unique meta description between 150-160 characters.
- `sitemap.xml` and `robots.txt` files are present and correctly configured.

**Cursor Prompt:**

"""
I need to implement foundational on-page SEO. Please perform the following actions:

1.  **Title and Meta Description Templates:**
    -   Create a system to generate page titles dynamically using the pattern: `{{Page Title}} · ZeroMotion Marketing — Houma, LA`.
    -   For each page, write a unique meta description between 150 and 160 characters that summarizes the page's content and includes relevant keywords.

2.  **sitemap.xml:**
    -   Generate a `sitemap.xml` file that includes all public pages of the website.

3.  **robots.txt:**
    -   Create a `robots.txt` file that allows all major search engines to crawl the site and provides the location of the sitemap.
"""

**Test Steps:**
1.  View the source of several pages and verify that the title and meta description are unique and follow the correct format.
2.  Navigate to `/sitemap.xml` and `/robots.txt` to ensure the files are present and correctly formatted.




## 15) Performance Pack

**Goal:** Optimize the site to meet Core Web Vitals targets.

**Acceptance Criteria:**
- LCP is < 2.5s, CLS is < 0.1, and TBT is < 200ms on a simulated 4G mobile connection.
- Hero video is compressed to 1080p, ≤8Mbps, and has a poster image.
- All images are converted to WebP/AVIF, correctly sized, and lazy-loaded offscreen.
- Main font is preloaded and uses `font-display: swap`.
- Unused CSS/JS is removed, and non-critical scripts are deferred.

**Cursor Prompt:**

"""
I need to implement a full performance optimization pass to meet Core Web Vitals targets. Please execute the following optimizations:

1.  **Media Compression:**
    -   **Hero Video:** Compress the main hero video to 1080p with a bitrate of ≤8Mbps. Add a `poster` image attribute.
    -   **Images:** Convert all images to a next-gen format like WebP or AVIF. Resize images to their container size to avoid serving oversized assets. Apply `loading="lazy"` to all offscreen images.

2.  **Font Loading:**
    -   Preload the main font files used in the initial viewport.
    -   Ensure the `@font-face` declarations use `font-display: swap`.

3.  **Asset Optimization:**
    -   Analyze the CSS and JavaScript bundles and remove any unused code.
    -   Defer the loading of any non-critical JavaScript files.
"""

**Test Steps:**
1.  Run a Lighthouse audit in a throttled mobile environment (simulated 4G) and verify that the LCP, CLS, and TBT scores meet the specified targets.
2.  Inspect the network tab to confirm that images are being served in WebP/AVIF format and that offscreen images are lazy-loaded.
3.  Check the font loading behavior to ensure fonts are swapped in without blocking rendering.




## 16) Accessibility Pass

**Goal:** Ensure the site meets WCAG AA basics for accessibility.

**Acceptance Criteria:**
- Color contrast between the purple accent and dark background passes WCAG AA standards.
- All interactive elements have visible focus rings.
- `aria-` labels and landmark roles are used correctly on navigation, menus, and accordions.
- The site achieves a Lighthouse accessibility score of ≥ 95.

**Cursor Prompt:**

"""
I need to perform an accessibility pass to ensure the site is usable for everyone. Please implement the following:

1.  **Color Contrast:**
    -   Check the color contrast ratio between the primary purple (`--zm-primary`) and the dark backgrounds (`--zm-bg`, `--zm-surface`). If it fails to meet the WCAG AA standard (4.5:1 for normal text), adjust the purple to a compliant shade.

2.  **Focus Indicators:**
    -   Ensure that all interactive elements (links, buttons, form fields) have a clear and visible focus ring when navigated to via the keyboard.

3.  **Semantic HTML and ARIA:**
    -   Review the site's structure and add appropriate ARIA labels and roles where necessary. For example, use `<nav>` for navigation, `<main>` for the main content, and add `aria-label` attributes to icon-only buttons.
"""

**Test Steps:**
1.  Use a color contrast checker to verify the purple accent against the dark backgrounds.
2.  Navigate the entire site using only the keyboard and ensure that a focus indicator is always visible.
3.  Run a Lighthouse audit and confirm that the accessibility score is 95 or higher.




## 17) Content Cleanup

**Goal:** Remove any legacy copy, duplicated sections, or placeholder content that conflicts with the new, polished messaging.

**Acceptance Criteria:**
- All instances of old taglines or conflicting messaging have been removed or replaced.
- No "work in progress" or placeholder content remains, with the exception of the client logos section.
- The site presents a single, unified message across all pages.

**Cursor Prompt:**

"""
I need to perform a final content cleanup to ensure the site is free of any legacy or conflicting information.

1.  **Search and Replace:**
    -   Search the entire codebase for any old taglines, outdated service descriptions, or inconsistent pricing information.
    -   Replace these instances with the new, approved copy.

2.  **Remove Placeholders:**
    -   Scan the site for any remaining "lorem ipsum" or other placeholder text.
    -   Ensure that the only placeholder section is the client logos area on the Home page.
"""

**Test Steps:**
1.  Read through every page of the website to check for any inconsistencies in messaging or tone.
2.  Verify that all placeholder content has been removed.




## 18) QA Script

**Goal:** Create a comprehensive QA checklist to ensure a thorough manual regression and smoke test of the polished site.

**Acceptance Criteria:**
- A `qa-checklist.md` file is created in the `/docs` directory.
- The checklist covers all key areas: routes, CTAs, forms, calendars, analytics, and viewport testing.
- The checklist is detailed enough for a non-developer to execute.

**Cursor Prompt:**

"""
I need to create a QA checklist for the final manual testing phase. Please create a new file at `/docs/qa-checklist.md` and populate it with the following content:

```markdown
# ZeroMotion Site Polish QA Checklist

## Instructions

- Test on the `feat/site-polish-MMDD` preview deployment.
- Test across the following viewports: 360px (Mobile), 768px (Tablet), 1024px (Small Laptop), 1440px (Desktop).
- Take screenshots of any visual bugs and add them to the `/docs/qa/` directory.

## 1. Navigation & Routes

- [ ] **Header Nav:** All links work correctly.
- [ ] **Footer Nav:** All links work correctly.
- [ ] **Mobile Nav:** Hamburger menu opens and closes smoothly. All links work.
- [ ] **Active States:** Current page is correctly highlighted in the navigation.

## 2. CTAs

- [ ] **Home Page:** "View Pricing" and "Get CRM Software" CTAs work.
- [ ] **Pricing Page:** "Book Free Consultation" CTAs work.
- [ ] **Service Pages:** All CTAs route to the correct pages.
- [ ] **About Page:** CTA routes to the consultation page.

## 3. Forms & Calendars

- [ ] **Contact Form:** Submit a test entry. Verify it appears in GHL.
- [ ] **Calendar:** Book a test meeting. Verify it appears in GHL and you receive a confirmation.
- [ ] **Mobile Forms:** Forms are usable and styled correctly on mobile.

## 4. Analytics

- [ ] **GA4 DebugView:** Open the DebugView and perform key actions.
- [ ] **`cta_click`:** Verify event fires on CTA clicks.
- [ ] **`plan_selected`:** Verify event fires when a plan is selected.
- [ ] **`form_submit`:** Verify event fires on form submission.
- [ ] **`cal_submit`:** Verify event fires when a meeting is booked.

## 5. Visual & Responsive

- [ ] **Home Page:** Check layout and styling on all viewports.
- [ ] **Pricing Page:** Check layout and styling on all viewports.
- [ ] **Service Pages:** Check layout and styling on all viewports.
- [ ] **About Page:** Check layout and styling on all viewports.
- [ ] **No Visual Regressions:** The site looks polished and professional on all devices.
```
"""

**Test Steps:**
1.  Verify that the `/docs/qa-checklist.md` file has been created with the correct content.




## 19) Release & Rollback

**Goal:** Safely deploy the polished site to production.

**Acceptance Criteria:**
- The feature branch is pushed and a preview link is generated.
- The owner signs off on the changes.
- The branch is merged to `main` and a release tag is created.
- A rollback script or plan is ready.
- The live site matches the preview, and analytics events are flowing.

**Cursor Prompt:**

"""
I need to prepare for the release of the site polish. Please outline the final steps for deployment and rollback.

1.  **Push and Preview:**
    -   Push the `feat/site-polish-MMDD` branch to the remote repository.
    -   Generate a preview deployment link.

2.  **Merge and Tag:**
    -   After owner sign-off, merge the feature branch into `main`.
    -   Create a new git tag for the release (e.g., `release-YYYY-MM-DD`).

3.  **Rollback Plan:**
    -   Prepare a script or document the steps required to revert the `main` branch to the previous commit in case of a critical issue.
"""

**Test Steps:**
1.  Verify that the preview deployment is accessible and looks correct.
2.  After merging, check the live production site to ensure it matches the preview.
3.  Monitor the analytics platform to confirm that events are still being tracked correctly on the live site.


