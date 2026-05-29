---
name: ui-redesign
description: Audits and redesigns Yaver app screens for premium mobile UI quality. Identifies generic AI patterns, applies editorial minimalism principles, rewrites StyleSheet code without breaking functionality.
---

# Yaver UI Redesign Skill

**Stack:** React Native + Expo, StyleSheet (no Tailwind), Plus Jakarta Sans, react-native-reanimated

**Design direction:** Editorial minimalism. Premium workspace aesthetic (Linear, Things 3, Craft). Warm neutrals, strong typographic hierarchy, generous whitespace, deliberate motion.

---

## Step 1 — Scan

Read the target screen file completely. Identify:
- Current color usage (hardcoded vs token)
- Typography weights and sizes in use
- Layout patterns (flexDirection, padding, gap values)
- Interactive elements and their states
- Animations (or lack of)
- Empty/loading/error states

---

## Step 2 — Diagnose

Run through every category below. List all problems found before writing any code.

### Typography Problems

- **All weights are bold/semiBold with no range.** A premium UI uses 4+ weight levels in one screen. Introduce regular (400) for supporting text.
- **Headlines don't feel heavy.** Display text needs `letterSpacing: -0.5` or tighter, `lineHeight` tight (1.1–1.2x fontSize).
- **Body text too small.** Minimum 14px for readable body. 15–16px preferred.
- **No typographic rhythm.** Every text block same weight/size. Vary deliberately: one dominant headline, supporting subhead, muted metadata.
- **Section labels are all-caps everywhere.** Reserve all-caps + wide tracking only for section dividers/labels. Don't overuse.
- **Missing italic accent.** One italic word per major heading creates brand character (the Yaver micro-signature).

### Color & Surface Problems

- **Pure white (#FFFFFF) as main background.** Feels sterile. Use warm off-white (#F7F5F2) as screen background; white only for elevated cards.
- **Accent color overused.** Indigo (#4F6DE8) should appear max 2–3 times per screen — primary CTA + 1 highlight. Not on every badge/button/border.
- **No color hierarchy.** text1/text2/text3 must create visible steps. text2 should feel clearly softer than text1, text3 clearly muted.
- **Borders too heavy or too light.** border (#EBEBEB) at 1px on cards. Never 1.5–2px everywhere — it creates visual noise.
- **Warning state uses accent color.** warning and accent are currently identical (#4F6DE8). Warning state needs a distinct amber/orange.
- **No surface depth.** Cards float on same-color backgrounds. Use bg (#F7F5F2) for screen, surface (#FFFFFF) for cards — the contrast creates depth without shadows.

### Layout & Spacing Problems

- **Uniform padding everywhere.** spacing.base (16) on everything. A premium layout varies: tighter inside components (8–12), generous between sections (24–32).
- **Everything vertically stacked with equal gap.** Create visual grouping: tight gap within a group (8), large gap between groups (24+).
- **Full-width everything.** Break the grid occasionally. Metadata rows, badges, and labels don't need to stretch edge-to-edge.
- **Cards look like boxes.** Cards should feel like surfaces, not containers with visible borders. Either: border only (no shadow), or shadow only (no border), or background color difference only. Never all three.
- **Primary CTA button too generic.** Black background (#1A1A1A), white text, 14–16px radius, full-width. No shadow. Optionally a very subtle border (#333).
- **Symmetric vertical padding.** Top padding slightly tighter than bottom — optically correct.
- **Header rows feel crowded.** Give AppBar breathing room. Title should feel anchored, not squeezed.

### Interactivity & States

- **No pressed state feedback.** Every `TouchableOpacity` needs `activeOpacity={0.75}` minimum. Important actions need scale feedback via Reanimated.
- **No skeleton/loading states.** Screens that load data should show skeleton shapes, not spinners or blank space.
- **CTA button has no disabled visual.** Disabled state needs reduced opacity (0.4) + no press feedback.
- **No haptic feedback on primary actions.** Add `Haptics.impactAsync()` from expo-haptics on primary CTA press.

### Component-Specific Patterns to Replace

- **Generic chip/badge.** Square or very slightly rounded (radius 6–8), not pill-shaped (radius 100). Use pill only for status indicators (Active/Inactive).
- **Section labels using text3 + all-caps.** Should feel intentional, not washed out. Consider text2 weight with slightly wider tracking instead.
- **Bottom nav with uniform icon treatment.** Active tab should feel distinctly different — filled icon vs outline, or accent color dot, or weight change in label.
- **AppBar back button.** Should be a clean left-arrow icon, not a text label.
- **Cards with no breathing room.** Internal padding minimum 16px. Content-heavy cards: 20px.

### Animation Gaps

- **No screen entry animation.** First visible elements should fade+translateY(12) in over 350ms, ease-out.
- **No list stagger.** When rendering a list of cards, each item enters with 60–80ms delay after the previous.
- **State transitions instant.** Color changes (active/inactive, selected/unselected) should transition over 200ms.
- **Heavy animations on low-priority interactions.** Reserve Reanimated spring physics for primary CTA and important state changes only.

---

## Step 3 — Fix

Apply in this exact priority order (highest impact first):

1. **Color & surface hierarchy** — bg vs surface separation, fix accent overuse
2. **Typography weight range** — introduce Regular (400) for body, tighten display letterSpacing
3. **Spacing rhythm** — vary padding deliberately, group related elements tightly
4. **CTA button** — premium black button, proper active state
5. **Card treatment** — pick ONE: border only OR shadow only OR background color only
6. **Section labels** — consistent treatment, not overused all-caps
7. **Entry animations** — fade+translateY on screen mount, stagger on lists
8. **Interactive states** — activeOpacity, disabled treatment

---

## Rules

- **Work with the existing StyleSheet stack.** No new styling libraries.
- **Keep all navigation props and data flow intact.** Never remove or rename route params, navigation calls, or state variables.
- **Import only from existing tokens.** `colors`, `fonts`, `spacing`, `radius`, `shadows` — all available at `../../tokens/`.
- **If a new animation is added, use react-native-reanimated.** Not Animated.Value unless already in use.
- **Do not add new dependencies** unless expo-haptics (already in Expo SDK).
- **Output the complete rewritten file.** Not a diff, not a partial. The full working screen component.

---

## Current Design Tokens (reference)

```typescript
// colors.ts
bg: '#F7F5F2'        // screen background
surface: '#FFFFFF'   // card/elevated surface
accent: '#4F6DE8'    // indigo — use sparingly
accentLt: '#EEF0FD'  // accent tint
text1: '#1A1A1A'     // primary text
text2: '#6B6B6B'     // secondary
text3: '#B8B8B8'     // muted/metadata
border: '#EBEBEB'    // dividers, card borders
success: '#2D7A50' / successLt: '#E8F5EE'

// fonts.ts (Plus Jakarta Sans)
fonts.regular    // 400
fonts.medium     // 500
fonts.semiBold   // 600
fonts.bold       // 700
fonts.extraBold  // 800
fonts.italic     // 400 italic

// spacing.ts
xs:4  sm:8  md:12  base:16  lg:20  xl:24  xxl:32

// radius.ts
sm:10  md:14  card:18  btn:100  icon:12
```

---

## Output Format

When redesigning a screen, respond in this order:

1. **Audit** (bullet list of every problem found — be specific and harsh)
2. **What changes** (summary of the fixes being applied)
3. **Rewritten file** (complete, working TypeScript/React Native code)
