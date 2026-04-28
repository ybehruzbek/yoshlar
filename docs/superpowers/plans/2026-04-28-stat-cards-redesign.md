# Statistics Cards Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the statistics cards in the dashboard to an "Ultra-Glass" aesthetic.

**Architecture:** Update the CSS global variables and card-specific styles in `globals.css`, then refine the component structure in `page.tsx`.

**Tech Stack:** Next.js, Vanilla CSS, Phosphor Icons.

---

### Task 1: Update CSS Global Variables and Base Styles

**Files:**
- Modify: `dashboard-app/app/globals.css`

- [ ] **Step 1: Add new glassmorphism variables to :root**
    ```css
    --glass-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 100%);
    --glass-border: rgba(255, 255, 255, 0.4);
    --glass-border-light: rgba(255, 255, 255, 0.6);
    --glass-blur: blur(40px) saturate(180%);
    ```

- [ ] **Step 2: Update `.stat-card` base styles**
    ```css
    .stat-card {
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
      border-top: 1px solid var(--glass-border-light);
      border-radius: var(--radius);
      padding: 24px;
      position: relative;
      overflow: hidden;
      transition: all 0.4s var(--ease);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
    }
    ```

- [ ] **Step 3: Add hover effects and typography refinements**
    ```css
    .stat-card:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border-color: var(--glass-border-light);
    }

    .stat-value {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -1.5px;
      line-height: 1.1;
      margin-bottom: 4px;
      color: var(--text-primary);
    }

    .stat-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-weight: 700;
      color: var(--text-secondary);
    }
    ```

- [ ] **Step 4: Commit changes**
    ```bash
    git add dashboard-app/app/globals.css
    git commit -m "style: update glassmorphism variables and stat-card base styles"
    ```

### Task 2: Refine Card Structure in page.tsx

**Files:**
- Modify: `dashboard-app/app/page.tsx`

- [ ] **Step 1: Update the StatCard JSX to use improved typography and layout**
    Ensure the `stat-value` and `stat-label` order and structure match the new design.
    Add a subtle inner glow to the `stat-icon-wrap`.

- [ ] **Step 2: Update stat-icon-wrap styles in CSS (if needed)**
    ```css
    .stat-icon-wrap {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 2px 4px rgba(255,255,255,0.4);
    }
    ```

- [ ] **Step 3: Commit changes**
    ```bash
    git add dashboard-app/app/page.tsx dashboard-app/app/globals.css
    git commit -m "feat: refine stat card structure and icon styling"
    ```
