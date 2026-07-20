# affirm.com design scan notes (2026-07-19)

Source: live scan of affirm.com homepage + /wallet/where-you-can-pay at 1280 and 390,
plus mega-menu and category-page screenshots. Referenced by the page rebuild.

## Tokens (measured)
- Body font: Calibre, sans-serif (we approximate with Poppins for display, Inter for text)
- Pills/buttons: border-radius 96px; primary on dark = solid white pill, dark ink text
- Dark panels: bg near-black indigo (#0d0d21 range), border-radius ~40px,
  hairline border rgba(168,169,252,~.35), inner content cards are frosted glass
- Nav: transparent glass pill with thin light border, logo left, hamburger right (mobile)
- Tag pills on panels: small frosted chip, top-left corner ("Anywhere", "In the app", "At checkout")
- Floating category labels: white pill, indigo text, slight rotation, pinned to glass product cards

## Motion
- Hero: phone rises from bottom; product cards float around it with real product photos;
  labels tilted; slow bob animation; parallax on pointer
- Scroll: "Pay how you want" section = sticky stacked panels; each panel sticks at the
  same top offset and the next one slides over it (no fancy JS needed: position sticky)
- Reveals: gentle fade + translateY, no bounce
- Region modal: giant indigo arc (brand motif) rising inside the modal

## Copy voice
- Benefit headline (5-7 words) + ONE concrete sub-sentence + ONE verb-first CTA
- Numbers as proof everywhere (4.9 rating, 1.4M+ reviews, $0.00 interest rows)
- Value-prop trios: benefit title + one concrete line ("Clear terms, always")

## Signature components worth quoting in the pitch page
- Phone checkout module: 0% APR chip, radio + "$51.86 every month for 6 months",
  Interest $0.00 / Total rows, "For illustrative purposes only" caption
- Deals feed (their offers UX): category icon row + offer cards in-app
- Stores search: big rounded search bar + floating circular merchant logo bubbles
- Footer: link columns (Consumers / For businesses / About) + 4.9 App Store rating block
- Mega-menu: dark glass panel, rounded product tiles with imagery + label underneath
