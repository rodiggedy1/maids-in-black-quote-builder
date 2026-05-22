# Maids in Black Quote Builder — TODO

## Database & Schema
- [x] Add `quotes` table: id, slug, clientName, rawInput, bedrooms, bathrooms, serviceType, extras (JSON), notes, estimateMin, estimateMax, ctaLabel, createdAt, updatedAt
- [x] Generate migration SQL and apply via webdev_execute_sql

## Server / API
- [x] `quote.create` — protected procedure: accepts rawInput, calls LLM parser, saves to DB, returns slug
- [x] `quote.parse` — protected procedure: LLM parses free text into structured fields (preview before save)
- [x] `quote.list` — protected procedure: returns all quotes for admin dashboard
- [x] `quote.getBySlug` — public procedure: returns quote by slug for client page
- [x] `quote.update` — protected procedure: update any field on an existing quote
- [x] `quote.delete` — protected procedure: delete a quote

## Admin Pages
- [x] `/admin` — Dashboard: list all quotes (name, date, estimate, copy-link button, edit/delete)
- [x] `/admin/new` — Quote Builder: free-text input form + LLM parse preview + save
- [x] `/admin/edit/:slug` — Edit Quote: pre-populated form with all parsed fields

## Client-Facing Pages
- [x] `/q/:slug` — Client landing page: hero video + personalized quote deck
- [x] Slide deck viewer: Intro, Why Choose Us, Official Quote, What Happens Next
- [x] Slide 1 (Intro): Maids in Black branding, client name, tagline
- [x] Slide 2 (Why Choose Us): key value props
- [x] Slide 3 (Official Quote): 3 bed/2 bath compact header, standard cleaning, extras (oven/fridge), notes, estimate range
- [x] Slide 4 (What Happens Next): 4-step booking flow
- [x] CTA button "Book This Cleaning" after Official Quote slide
- [x] CTA button "Confirm My Date & Time" at end of deck

## Design
- [x] Global CSS: black background, ember-orange accents (#E8651A), Playfair Display + Montserrat fonts
- [x] Admin pages: clean dark dashboard layout
- [x] Client page: full-screen premium branded experience
- [x] Slide transitions and navigation arrows
- [x] Mobile-responsive layout

## Tests
- [x] Vitest: quote.create procedure test
- [x] Vitest: quote.getBySlug procedure test
- [x] Vitest: LLM parse output schema validation test
