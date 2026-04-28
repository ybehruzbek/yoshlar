# Statistics Cards Redesign Spec

## Goal
Redesign the statistics cards in the Qarz Monitoring dashboard to use an "Ultra-Glass" aesthetic, providing a premium, modern feel inspired by high-end iOS/macOS interfaces.

## User Review Required
> [!NOTE]
> This redesign focuses on visual aesthetics (CSS) and minor layout adjustments in `app/page.tsx`. No functional changes are planned.

## Proposed Changes

### Visual Style (CSS)
- **Glassmorphism**: 
    - `backdrop-filter: blur(40px) saturate(180%)`
    - Background: `linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 100%)`
- **Borders**: 
    - High-contrast top border: `1px solid rgba(255, 255, 255, 0.6)`
    - Subtle side borders: `1px solid rgba(255, 255, 255, 0.4)`
- **Typography**: 
    - Values: `font-weight: 800`, `letter-spacing: -1.5px`, `font-size: 32px`
    - Labels: `text-transform: uppercase`, `font-size: 11px`, `letter-spacing: 0.5px`, `color: var(--text-secondary)`
- **Icon Wrap**: 
    - Soft background with `box-shadow` matching the icon's primary color.
    - Subtle inner shadow for depth.

### Interactive Elements
- **Hover State**: 
    - `transform: translateY(-6px) scale(1.02)`
    - `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12)`
    - Border brightness increase.

## Verification Plan
### Manual Verification
- Verify the new styles in the browser.
- Check responsiveness to ensure the new card layout works on mobile and tablet.
