# MASTER PROMPT — EONOVA ATLAS
## Build a complete, premium, interactive historical atlas and digital museum

You are the principal software architect, senior full-stack engineer, geospatial engineer, UX/UI designer, historical research editor, and quality assurance engineer responsible for building this product.

You are working with Claude Fable 5.2. Use your strongest engineering, research, planning, and execution capabilities.

Your assignment is to independently design, build, test, refine, and deliver a complete, production-quality web application called **EONOVA ATLAS**.

This is an execution task, not a brainstorming exercise.

Do not stop after providing a plan, architecture, mockup, or explanation. You must implement the application, verify that it works, fix the problems you discover, and deliver a usable result.

---

# 1. PRODUCT VISION

Build EONOVA ATLAS: an interactive digital museum and historical atlas that allows users to explore the history of human civilizations through maps, timelines, historical events, people, and geographical information.

The product should feel like a combination of:

- A professional historical atlas.
- A modern digital museum.
- An interactive educational platform.
- A carefully researched historical encyclopedia.
- A premium data-visualization product.

The central experience should be an interactive world map.

A user should be able to select a historical year, see which documented historical entities existed during that period, explore their approximate geographical extent, discover important events, and open detailed historical profiles.

For example, a user should be able to select 550 BCE and explore the Achaemenid Empire, then move to 330 BCE and see how the historical landscape changed.

The experience must be visual, educational, intuitive, accurate, and genuinely interactive.

**The application must be a real functioning product, not a static design prototype.**

# 2. PRODUCT IDENTITY AND DESIGN DIRECTION

Product name:

EONOVA ATLAS

Suggested tagline:

"Explore the Past. Understand the World."

Brand direction:

Create an understated, premium, editorial identity inspired by modern digital museums, academic publications, historical atlases, and professional cartographic platforms.

Do not create a flashy gaming interface or a generic AI-generated dashboard.

## Visual language

Use a sophisticated dark visual system:

- Deep charcoal and graphite backgrounds.
- Muted antique gold or bronze accents.
- Warm parchment-like text and secondary surfaces.
- Subtle geographic lines and cartographic details.
- Carefully balanced contrast.
- Restrained shadows and transitions.

Avoid:

- Excessive gradients.
- Neon colors.
- Excessive glassmorphism.
- Unnecessary visual effects.
- Oversized typography.
- Cluttered dashboards.
- Generic template-like cards.

The interface should look carefully art-directed.

Use a consistent design system with reusable components, spacing rules, typography, colors, borders, radii, and interaction states.

## Typography

The Persian interface must use a high-quality Persian typeface such as Vazirmatn.

The English interface should use a clean modern typeface such as Inter.

Use sensible fallbacks if external fonts are unavailable.

Persian typography must be readable, correctly aligned, and properly shaped.

## Reference direction

Use the visual quality and clarity of professional historical and geographical platforms as inspiration.

Do not copy another website's layout, branding, assets, or source code.

Create an original visual identity for EONOVA ATLAS.

# 3. LANGUAGE AND INTERNATIONALIZATION

The primary language is Persian.

Requirements:

1. Persian must be the default application language.
2. The complete interface must support RTL layout.
3. Provide a fully functional English language switch.
4. English mode must use LTR layout.
5. Navigation, buttons, filters, menus, notifications, forms, charts, and dates must change correctly when the language changes.
6. All initial historical entries must have Persian and English descriptions.
7. Avoid untranslated interface labels.
8. Persist the selected language locally.

The Persian interface must feel native rather than like an English website with reversed alignment.

# 4. INITIAL HISTORICAL COVERAGE

The first release should focus on ancient and classical history.

Build a curated initial collection covering approximately 3500 BCE to 700 CE.

Include these historical subjects:

1. Ancient Egypt.
2. Neo-Assyrian Empire.
3. Achaemenid Empire.
4. Macedonian Empire under Alexander and the subsequent Hellenistic world.
5. Maurya Empire.
6. Han Dynasty.
7. Roman Empire.
8. Sasanian Empire.

Important:

Do not treat a civilization, dynasty, kingdom, and empire as interchangeable concepts.

Represent them accurately as different kinds of historical entities.

For instance:

- Ancient Egypt is a broad civilization with several political periods and dynasties.
- The Achaemenid Empire is a specific imperial state.
- The Han Dynasty is a Chinese imperial dynasty.
- The Roman Empire must not be incorrectly described as ending completely in 476 CE. Explain the distinction between the Western Roman Empire and the Eastern Roman Empire.

Create a data model that supports these distinctions.

The initial collection should contain, where reliable information is available:

- At least 8 historical entity profiles.
- At least 16 documented historical events.
- At least 12 historical personalities.
- Historical locations and capitals.
- Chronological records.
- Geographical representations where supported by credible evidence.
- Relevant academic and institutional references.

These are content targets, not permission to invent information. Historical accuracy takes priority over reaching a particular number.

# 5. HISTORICAL RESEARCH AND DATA INTEGRITY

This is one of the most important requirements.

You are not simply building a map visualization. You are building a historical information product.

Historical accuracy must be treated as a core engineering requirement.

## Research standards

Use credible sources, prioritizing:

- Academic publications.
- University research and historical departments.
- Archaeological institutions.
- National museums.
- UNESCO publications.
- Encyclopaedia Iranica.
- The British Museum.
- The Metropolitan Museum of Art.
- Other reputable institutional and scholarly resources.
- Reliable translations and editions of primary historical sources.

Use web research where available.

Verify significant dates, historical claims, geographical interpretations, and disputed historical accounts.

Do not rely exclusively on random blogs, social media, AI-generated summaries, or unsourced websites.

## Citation system

Every significant historical record must contain source references.

Create a structured source registry.

Each source should have:

- Unique ID.
- Title.
- Author or institution.
- Publication information when available.
- URL.
- Source type.
- Access date where applicable.
- Relevant notes.
- License information when an asset or dataset is used.

Historical entities, events, people, and geographical records must reference the relevant source IDs.

Users must be able to open references from the corresponding historical content.

## Historical uncertainty

Historical research is not always definitive.

When appropriate, distinguish:

- Established historical facts.
- Approximate dates.
- Scholarly interpretations.
- Disputed historical claims.
- Uncertain geographical reconstructions.

Use labels such as:

"Approximate date"

"Scholarly debate"

"Approximate territorial extent"

"Historical reconstruction"

Never present an uncertain interpretation as an established fact.

Do not invent quotations, archaeological discoveries, historical documents, source references, or publication information.

If a claim cannot be verified, omit it or label its uncertainty clearly.

Do not copy large passages from copyrighted publications. Summarize information in original wording and provide attribution.

# 6. HISTORICAL DATE SYSTEM

Implement a reliable historical date system that supports BCE and CE dates.

This requirement is particularly important because ordinary date formatting can introduce chronological errors.

Use astronomical year numbering internally:

- 1 CE = 1
- 1 BCE = 0
- 2 BCE = -1
- 550 BCE = -549

The application must never display a historical year as "Year 0".

Create reusable, well-tested date utilities.

Requirements:

- Convert internal years into correct Persian date labels.
- Convert internal years into correct English date labels.
- Support BCE and CE.
- Support approximate dates.
- Support date ranges.
- Support centuries.
- Correctly sort dates across the BCE/CE transition.
- Display historical periods consistently.

Examples:

550 BCE

330 BCE

117 CE

651 CE

The user interface should display dates in an appropriate localized form.

# 7. THE CENTRAL EXPERIENCE — INTERACTIVE HISTORICAL ATLAS

This is the most important feature.

Build a full-screen or spacious interactive historical atlas.

Use a suitable geospatial library such as MapLibre GL JS, with a carefully implemented client-side map component.

Choose a stable implementation compatible with the project's framework.

## Map requirements

The map must support:

- Pan.
- Zoom.
- Geographic navigation.
- Historical territory overlays.
- Historical location markers.
- Clickable entities.
- Interactive popups or detail panels.
- A map legend.
- Historical year selection.
- Geographic labels where appropriate.
- A reset view action.
- Responsive behavior.

Use a clean, restrained map style that matches the product identity.

Make the historical information visually prominent without making the map difficult to read.

## Historical territory overlays

Historical territories must be driven by the currently selected historical year.

When the selected year changes, the visible historical entities and their corresponding geographical information must update.

For example:

- Selecting 550 BCE should show relevant entities documented for that period, including the Achaemenid Empire where supported by the historical data.
- Selecting 330 BCE should update the map to reflect the historical situation around that period.
- Selecting 117 CE should display the relevant imperial and political landscape.
- Selecting 651 CE should reflect the historical entities relevant to that year.

These are demonstration milestones, not assumptions that every map polygon must be available.

## Critical geographical accuracy rule

Never fabricate historical borders to make the map look impressive.

Historical boundaries are often uncertain and changed over time.

Use reliable historical geographical datasets or carefully researched reconstructions.

If a polygon cannot be supported by credible evidence:

- Do not invent one.
- Use a documented location marker or a clearly identified approximate region when appropriate.
- Explain the limitation in the interface.
- Do not imply that a marker represents the full territory.

Every historical polygon or reconstructed area must have provenance information.

Include metadata such as:

- Historical entity ID.
- Valid time range.
- Source IDs.
- Reconstruction method.
- Accuracy or confidence label.
- Notes about geographical uncertainty.

Clearly distinguish between:

1. A historical territorial boundary.
2. An approximate reconstructed territorial extent.
3. A geographical area of influence.
4. A significant historical location.

Do not present these as equivalent.

If the public map tile provider is unavailable, show a useful fallback rather than a broken map.

Use a tile provider whose usage terms permit the intended demonstration. Set visible attribution and follow its fair-use rules. Do not scrape or bulk-download map tiles.

Do not require a paid map API key.

# 8. HISTORICAL TIMELINE

Build a prominent timeline integrated with the atlas.

The timeline should be visually clear and easy to operate.

Requirements:

- Select a historical year.
- Move through time using a slider.
- See the selected date.
- Navigate between major historical periods.
- Display significant events.
- Display relevant historical entities.
- Filter events by region and category.
- Jump to important historical milestones.
- Synchronize the timeline with the map.

Provide convenient preset dates for the initial demo, such as:

- 550 BCE.
- 330 BCE.
- 117 CE.
- 651 CE.

Presets must use the correct internal date representation.

When the user changes the timeline, update all related components.

Avoid making this a decorative slider that has no real effect.

# 9. HISTORICAL ENTITY PROFILES

Create dedicated profile pages for civilizations, empires, kingdoms, and dynasties.

Each profile should include, when documented:

- Name.
- Alternative names.
- Historical entity type.
- Beginning and ending dates.
- Geographic region.
- Historical overview.
- Political structure.
- Important rulers.
- Capitals and major cities.
- Historical events.
- Cultural and technological achievements.
- Relations with other historical entities.
- Related people.
- Related locations.
- Geographical representation.
- Sources and references.

Use a consistent page structure.

Include a small historical map preview showing the entity's documented geographical context.

Provide clear links between related people, events, places, and entities.

The Achaemenid and Sasanian profiles should receive particular attention in the initial historical collection.

However, do not introduce nationalistic exaggerations or unsupported historical claims.

Maintain academic neutrality.

# 10. HISTORICAL EVENTS

Create a dedicated event system.

Events should contain:

- Unique ID.
- Persian title.
- English title.
- Date or date range.
- Historical overview.
- Location.
- Related entities.
- Related historical people.
- Historical significance.
- Source references.
- Date precision.
- Uncertainty notes where relevant.

Create event detail pages.

Events must connect to the historical timeline and the interactive atlas.

Users should be able to discover events through search, filtering, and related historical profiles.

# 11. HISTORICAL PEOPLE

Create historical person profiles.

Each profile should support:

- Name.
- Alternative names.
- Birth and death dates where established.
- Historical role.
- Associated historical entity.
- Historical overview.
- Major contributions.
- Related events.
- Related locations.
- References.

Clearly identify uncertain dates and disputed biographical information.

Do not invent personal quotations.

# 12. SEARCH AND DISCOVERY

Implement a functional global search.

Users should be able to search for:

- Historical civilizations.
- Empires.
- Dynasties.
- People.
- Events.
- Cities.
- Historical locations.

Requirements:

- Search in Persian and English.
- Search by alternative names where appropriate.
- Show relevant categories.
- Provide useful result descriptions.
- Open the correct profile.
- Display an appropriate empty state.
- Support keyboard navigation when practical.

Do not build a search box that only looks functional.

# 13. COMPARISON TOOL

Create a historical comparison page.

Users should be able to select two historical entities and compare them.

Possible comparison fields:

- Historical period.
- Geographic region.
- Political structure.
- Major capitals.
- Important rulers.
- Significant events.
- Cultural characteristics.
- Historical achievements.
- Relevant sources.

The interface should make it easy to understand similarities and differences.

Never compare two entities as though their historical categories are identical when they are not.

Display an appropriate explanation where the comparison requires historical context.

# 14. KNOWLEDGE TEST

Build a functional historical quiz.

Requirements:

- Questions based on the curated historical dataset.
- Multiple-choice questions.
- Persian and English support.
- Score tracking.
- Correct and incorrect answer feedback.
- Explanations.
- Relevant source links.
- Replay functionality.
- Categories and difficulty levels.

Do not generate random unsupported facts.

Quiz answers must come from verified application data.

# 15. FAVORITES AND LOCAL PERSONALIZATION

Allow users to:

- Save historical entities.
- Bookmark events.
- Save historical people.
- Maintain a list of favorites.
- Restore preferences after refreshing the page.

Use localStorage or another lightweight local persistence mechanism.

Do not require user registration.

The application should be usable immediately.

# 16. APPLICATION PAGES

Create a coherent navigation system with these pages:

1. Home `/`
2. Historical Atlas `/atlas`
3. Historical Timeline `/timeline`
4. Civilizations and Empires `/entities`
5. Entity Details `/entities/[slug]`
6. Event Details `/events/[slug]`
7. Historical People `/people/[slug]`
8. Historical Comparison `/compare`
9. Knowledge Test `/quiz`
10. Sources and References `/sources`
11. Methodology and About `/about`

Implement correct routing, loading states, not-found pages, and error handling.

Do not leave important navigation items disconnected.

# 17. HOME PAGE DESIGN

The home page is the main entry point.

It should immediately communicate the purpose and quality of the product.

Include:

- A strong editorial hero section.
- Product title and tagline.
- A clear entry point to the historical atlas.
- A carefully designed interactive atlas preview.
- Featured historical civilizations.
- Important historical milestones.
- A selected-events section.
- A timeline preview.
- A brief methodology and source-quality explanation.

Use meaningful historical content rather than generic placeholder text.

The home page should look impressive during a desktop screen recording.

# 18. TECHNICAL ARCHITECTURE

First inspect the repository and available environment.

If this is an empty project directory, initialize a clean application.

If an existing project is present, inspect its files and conventions before modifying anything.

Choose a modern and stable stack.

Preferred starting architecture:

- Next.js App Router.
- React.
- TypeScript.
- Tailwind CSS.
- MapLibre GL JS for geographical visualization.
- A lightweight icon library such as Lucide.
- A clear typed data layer.
- A simple local persistence solution.
- A suitable testing framework.

Use current stable dependency versions compatible with the installed environment.

Avoid experimental APIs unless they provide a clear and necessary benefit.

Do not add complex infrastructure without a real requirement.

## Architecture requirements

Organize the project into clear areas:

- Application routes.
- Shared components.
- Layout components.
- Design system.
- Map components.
- Timeline components.
- Historical entity components.
- Data models.
- Historical content.
- Geographical datasets.
- Research sources.
- Localization.
- Utilities.
- Tests.
- Documentation.

Create reusable, maintainable components.

Avoid:

- A giant single component.
- Repeated code.
- Unnecessary abstractions.
- Overengineering.
- Dead code.
- Unused packages.
- Artificial complexity.

Use strict TypeScript where practical.

Use schema validation for important historical data structures.

Keep the geographical layer separate from the historical content layer.

The map must not contain hardcoded historical facts that should belong in the data layer.

## Database and backend

Do not introduce a backend or a database unless there is a clearly justified need.

The first release should work as a self-contained frontend application with a curated local dataset.

Do not add user accounts, payments, subscription systems, or unnecessary authentication.

Do not connect to an external AI API.

The application must not require an API key to run.

# 19. USER EXPERIENCE AND INTERACTION QUALITY

Every visible interactive control must perform its advertised action.

Implement:

- Buttons.
- Search.
- Filters.
- Menus.
- Selectors.
- Language switching.
- Timeline controls.
- Map interactions.
- Popups.
- Drawers.
- Tabs.
- Favorites.
- Comparison selection.
- Quiz interactions.

Provide:

- Loading states where needed.
- Useful empty states.
- Error states.
- Success feedback.
- Keyboard accessibility.
- Visible focus states.
- Semantic HTML.
- Responsive behavior.

Do not use placeholder buttons.

Do not simulate functionality with static screenshots.

Do not create fake historical loading animations.

Keep interactions fast and predictable.

# 20. RESPONSIVE DESIGN

The product must work on:

- Desktop.
- Laptop.
- Tablet.
- Mobile phones.

Desktop is the primary presentation target because the product will be demonstrated in a YouTube video.

However, mobile usability is still mandatory.

On desktop, prioritize the map, historical information panel, and timeline.

On smaller screens, reorganize the layout without losing important functionality.

Avoid horizontal overflow.

Make controls touch-friendly.

# 21. PERFORMANCE AND RELIABILITY

Optimize the application.

Requirements:

- Lazy-load the map where appropriate.
- Avoid unnecessary re-rendering.
- Keep geographical datasets reasonably sized.
- Avoid loading large libraries before needed.
- Use efficient filtering.
- Handle failed map requests.
- Handle missing assets.
- Provide robust error boundaries.
- Avoid browser console errors.
- Avoid hydration errors.
- Ensure correct behavior after page refresh.
- Preserve shareable historical states through URL parameters when practical.

The application should load and remain useful even if an optional remote service fails.

# 22. ASSETS AND IMAGE LICENSING

Use historical imagery only when it materially improves the product.

Prefer:

- Public-domain historical images.
- Properly licensed museum assets.
- Permitted Wikimedia Commons assets.
- Original, locally created SVG illustrations.

Record the source and license information for third-party assets.

Do not use copyrighted images without appropriate permission.

Do not leave broken image URLs.

Do not make the whole application dependent on external image servers.

If an image is unavailable, use an elegant designed fallback.

# 23. TESTING AND QUALITY ASSURANCE

Testing is mandatory.

Do not claim that something works simply because the code was written.

Actually run the relevant checks.

At minimum:

- Lint.
- Type checking.
- Unit tests.
- Production build.

Add automated tests for critical date and historical data utilities.

Test the following date cases:

- 550 BCE.
- 330 BCE.
- 1 BCE.
- 1 CE.
- 117 CE.
- 651 CE.

Test the absence of a displayed year zero.

Test:

- Historical timeline filtering.
- Entity date ranges.
- Event sorting.
- Language switching.
- Favorites persistence.
- Search.
- Comparison logic.
- Quiz scoring.

Test the map's historical-year filtering.

Use browser-based testing where the environment supports it.

Verify the actual UI, not only the source code.

Check the application at desktop and mobile viewport sizes.

Fix errors you discover.

Do not suppress errors simply to obtain a successful build.

Do not report a test as passed unless it was actually executed successfully.

If an optional external service is unavailable, document the limitation and verify the fallback.

# 24. DOCUMENTATION

Create a professional README.

It must explain:

- What EONOVA ATLAS is.
- Main features.
- Technology stack.
- Installation.
- Development startup.
- Production build.
- Test commands.
- Project structure.
- How historical data is organized.
- How to add a civilization.
- How to add an event.
- How to add a historical person.
- How to add a geographical feature.
- How citations work.
- How historical date numbering works.
- Known limitations.

Also create:

`docs/PROJECT_ARCHITECTURE.md`

`docs/HISTORICAL_DATA_METHODOLOGY.md`

`docs/SOURCES_AND_ATTRIBUTION.md`

`docs/QA_REPORT.md`

`docs/VIDEO_DEMO_SCRIPT_FA.md`

The Persian video demo script should describe an honest 3–5 minute demonstration of the application, with a suggested sequence for showing the map, timeline, profiles, comparison, and quiz.

Only describe features that are actually implemented.

# 25. EXECUTION STRATEGY

Execute the work from start to finish.

Follow this internal sequence:

## Phase A — Inspection and architecture

- Inspect the repository.
- Inspect the runtime and installed tools.
- Read existing instructions.
- Identify dependencies and constraints.
- Decide the architecture.
- Create a practical implementation plan.

Do not stop after this phase.

## Phase B — Historical research and data modeling

- Research the initial historical collection.
- Create the source registry.
- Establish the data schemas.
- Create verified initial content.
- Establish geographical data provenance.
- Record uncertainty where required.

## Phase C — Application foundation

- Initialize the application.
- Configure TypeScript.
- Configure styling.
- Create the layout.
- Implement localization.
- Implement shared components.
- Build the data layer.

## Phase D — Core product

Implement the home page, map, historical timeline, profiles, events, people, search, comparison tool, quiz, favorites, and source pages.

Prioritize real functionality over visual decoration.

## Phase E — Visual refinement

Review the complete application.

Improve:

- Typography.
- Spacing.
- Color balance.
- Map presentation.
- Responsive layout.
- Interaction states.
- Information hierarchy.
- Overall visual consistency.

Do not stop at the first acceptable-looking version.

## Phase F — Verification

Run tests.

Run the production build.

Inspect the application in a browser if available.

Fix discovered problems.

Check historical date conversions and geographical filtering carefully.

## Phase G — Delivery

Produce the final application and documentation.

Ensure the user can launch the project using clear commands.

# 26. AUTONOMOUS WORK RULES

You are responsible for the implementation.

Treat this codebase as your own project to build and maintain.

Make sound engineering decisions without asking the user to approve every ordinary implementation detail.

Do not ask unnecessary clarification questions.

Do not stop after presenting a plan.

Do not stop because an ordinary command fails. Diagnose the issue and try a reasonable alternative.

You may install the normal dependencies required by this local project.

You may create and modify project files.

You may run local tests and builds.

You may refactor your implementation when necessary to maintain quality.

You must preserve existing user data and avoid destructive operations unrelated to the project.

Do not perform production deployments, purchase services, incur paid API usage, or expose credentials without explicit authorization.

Use subagents only when genuinely independent work can be performed in parallel and the environment supports them. Do not delegate simply for the sake of delegation. You remain responsible for the complete result and its integration.

Do not create unnecessary progress reports or ask the user whether to continue after every phase.

Give only brief useful status updates when needed.

Most importantly:

**Do not finish with a list of things you could build. Finish the things you were asked to build.**

If an external research source, dataset, or service is unavailable, diagnose the limitation and use a documented alternative. Do not invent evidence or claim successful verification when it did not occur.

# 27. DEFINITION OF DONE

The project is complete only when all of the following are true:

- A functioning EONOVA ATLAS application exists.
- The home page is fully implemented.
- The Persian interface works correctly.
- The English language mode works.
- RTL and LTR layouts work correctly.
- The historical atlas renders.
- The historical timeline works.
- Selecting a historical year updates the map data.
- Historical profiles are accessible.
- Event pages are accessible.
- People pages are accessible.
- Historical search works.
- Comparison functionality works.
- The quiz works.
- Favorites persist.
- Sources and citations are accessible.
- Historical date conversion is tested.
- Approximate geographical reconstructions are identified honestly.
- The application is responsive.
- Major interactions are functional.
- Automated checks have been run.
- The production build succeeds, or any genuine blocker is clearly documented.
- Documentation is complete.
- The project can be launched locally.

Do not declare completion prematurely.

# 28. FINAL DELIVERY REPORT

When the implementation is complete, provide a concise Persian final report.

Include:

1. What was actually built.
2. Main implemented features.
3. Technology stack.
4. Project structure.
5. Installation and startup commands.
6. Test results.
7. Production build result.
8. Known limitations.
9. Location of the Persian YouTube demonstration script.

Be completely honest about unfinished work.

Do not claim that the historical database is exhaustive.

Do not claim that geographical reconstructions are exact.

Do not claim that the application is production-ready if required testing remains incomplete.

The final result should be a polished, credible, interactive historical atlas that demonstrates the capabilities of a sophisticated software engineering agent.

**BEGIN EXECUTION NOW.**