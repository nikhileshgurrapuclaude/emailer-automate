# 🚀 Emailer Automation Studio (Part 1 - Working Model)

A modern, zero-dependency **Static Single-Page Application (SPA)** designed for **Ting Agency** to create, format, live-preview, and export 100% compliant HTML emailers for **Avendus Capital**, **Sanctum**, and **Custom clients**.

---

## 📁 Self-Contained Project & Deal Structure

Notice that **every deal has its own `img/` folder containing its own banner and all footer assets**. There is **zero external dependency** on a shared `assets/` folder:

```
antigravity-html/
├── index.html            # Main Single-Page Web Application
├── css/
│   └── style.css         # Modern dark-theme styling, sidebar transitions, iframe frames
├── js/
│   ├── generator.js      # Master Email Template Generator (single <p> & deal-isolated paths)
│   ├── editor.js         # Content editor with dual bold support (Ctrl+B & **markdown**)
│   ├── zip-builder.js    # Zero-dependency in-browser ZIP generator (PKZIP spec)
│   └── app.js            # App state, localStorage, tab-sync & UI event controller
└── avendus/              # Deals grouped by brand
    ├── deal_KSH_Group/
    │   ├── index.html
    │   └── img/          # ALL deal images (banner + all 11 footer assets!)
    ├── demo_emailer/
    │   └── img/
    ├── ecm_newsletter_march_2026/
    │   └── img/
    ├── ets_newsletter_march_2026/
    │   └── img/
    └── new_age_report/
        └── img/
```

---

## ⚡ How to Run

### 1. Locally on your Computer:
Simply **double-click** `antigravity-html/index.html` to open it in Google Chrome, Microsoft Edge, or Safari!
*(No terminal or npm dependencies required).*

### 2. Deployed to Vercel or Netlify:
- **Netlify:** Drag and drop the `antigravity-html` folder directly into your Netlify dashboard.
- **Vercel:** Connect the GitHub repository or deploy the `antigravity-html` root directory as a static project.

---

## ✨ Features Implemented

1. **Brand Selection Hub:**
   - **Avendus Emailer** (Active, loaded with 5 verified templates)
   - **Sanctum Emailer** (Ready for custom branding)
   - **Custom Emailer** (Blank canvas)
   - 1-click **"Switch Brand"** button in the header.

2. **Collapsible Sidebar:**
   - Toggle button (`◀ / ▶`) to hide/show the sidebar for full-screen editing.
   - Search filter to quickly locate deals.
   - Every deal displays its **Folder Name** and **Last Modified timestamp**.
   - Pre-loaded with 5 Avendus templates (*KSH Group, ECM Newsletter, ET&S Newsletter, New Age Report, Demo Emailer*).

3. **6 Configurable Fields:**
   - Folder Name
   - Email Title
   - Preview Text (Inbox Snippet)
   - Banner Image (File upload from computer **or** live URL)
   - Content Editor with **Dual Bold Support**:
     - Visual **Bold (B)** toolbar button
     - Keyboard shortcut: `Ctrl + B` (or `Cmd + B`)
     - Markdown: Type `**bold text**` directly
     - *Guaranteed output:* Strict single `<p>` tag, styled with Avendus fonts & `<br /><br />` paragraph breaks.
   - Button Label & Destination URL

4. **Live Side-by-Side Preview:**
   - Real-time rendering as you type.
   - Viewport toggles: **Desktop (600px)** and **Mobile (380px)**.

5. **"🚀 Generate Emailer" Action:**
   - Compiles the final production email HTML.
   - Formats asset URLs: `https://your-domain/[brand]/[folder_name]/img/[filename]`
   - Opens `index.html` in a new browser tab.
   - Activates and enables the **"💾 Download ZIP"** button.
   - Automatically saves the updated deal to `localStorage`.

6. **"🔄 Update Tab" Action:**
   - Pushes your latest edits directly into the currently opened browser tab without creating duplicate tabs.

7. **"💾 Download ZIP" Export:**
   - Disabled until you click "Generate".
   - Exports a clean ZIP package named `[folder_name].zip` with the exact structure:
     ```
     [brand]/[folder_name]/
       ├── index.html
       └── img/
            ├── (banner image)
            ├── IBSignature.png
            ├── abou_us.png
            ├── assest_management.png
            ├── credit_solutions.png
            ├── investment.png
            ├── institutional.png
            ├── wealth.png
            ├── linkedin.png
            ├── twitter.png
            ├── insta.png
            └── dark-youtube-48.png
     ```
