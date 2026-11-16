/**
 * Main Application Controller
 * Handles State, LocalStorage, Live Preview, Open-Tab Sync, ZIP Export & UI Navigation
 * Asset Architecture: Deal-Level Asset Isolation (all images saved inside [brand]/[folderName]/img/)
 */

// Initial Seed Deals for Avendus
const SEED_DEALS = [
  {
    id: 'deal_ksh_group',
    brand: 'avendus',
    folderName: 'deal_KSH_Group',
    title: 'KSH Group sells 100% stake in KSH Distriparks to Delhi International Cargo Terminals for USD 35 mn',
    previewText: 'KSH Group sells 100% stake in KSH Distriparks to Delhi International Cargo Terminals for USD 35 mn',
    bannerUrl: 'avendus/deal_KSH_Group/img/bannerNew.jpg',
    bannerFilename: 'bannerNew.jpg',
    content: `**KSH Group sells 100% stake in KSH Distriparks to Delhi International Cargo Terminals for USD 35 mn**

The shareholders of KSH Distriparks Private Limited (“KSH”/Company), operator of Pune’s largest Inland Container Depot (“ICD”), have sold their 100% stake in the company to Delhi International Cargo Terminals Private Limited (jointly owned by J M Baxi Group and Hapag Lloyd). The ICD serves as an integrated platform for customs clearance, storage, warehousing, and transportation services, catering to Pune’s market of over 5 Lakh TEUs per annum. Led by a seasoned management team, it has established relationships amongst some of Pune’s large industrial and manufacturing players.

**Avendus Capital acted as the exclusive financial advisor to KSH and its shareholders on this transaction.**

**Rohit Hegde, Managing Director and Chairman, KSH Distriparks** said, “We are delighted to have passed on the control of our Pune ICD to J M Baxi Group. With its partnership with global shipping major Hapag-Lloyd, extensive network across India’s ports and logistics industry, and strong presence at Mumbai Port, we believe J M Baxi Group is best placed to build on the foundation we have created.”

**Dhruv Kotak, Managing Director, J M Baxi Group** said, “KSH’s Pune ICD is a valuable addition to our growing network of port terminals, CFSs, ICDs and CTO operations. This transaction strengthens our capabilities to provide a more comprehensive offering to our clients.”

**Gaurav Arora, Managing Director and Head, Infrastructure & Real Assets Investment Banking at Avendus Capital** said, “We are pleased to have advised KSH Distriparks Private Limited on its strategic sale to the J M Baxi Group, marking yet another successful transaction in our longstanding relationship with KSH Group.”`,
    buttonLabel: 'Know More',
    buttonLink: 'https://www.avendus.com/transactions/ksh-group-sells-100-stake-in-ksh-distriparks-to-delhi-international-cargo-terminals-for-usd-35-mn',
    buttonRadius: '3px',
    buttonColor: '#cd2027',
    lastModified: '2026-11-15T18:10:00.000Z'
  },
  {
    id: 'ecm_newsletter_march_2026',
    brand: 'avendus',
    folderName: 'ecm_newsletter_march_2026',
    title: 'ECM Newsletter March 2026',
    previewText: 'High Intensity Quarter - Outlook Remains Constructive',
    bannerUrl: 'avendus/ecm_newsletter_march_2026/img/ecm_banner.png',
    bannerFilename: 'ecm_banner.png',
    content: `Dear Reader,

We're back with our quarterly update on what moved India’s equity capital markets.

Q1 CY2026 highlighted that Indian equities faced turbulence from geopolitical tensions which led to FII outflows and rupee weakness. Valuation compression has opened attractive entry points, and despite volatility, we expect ECM activity to be resilient for the next 12-18 months with record filings worth USD 6.3 Bn in March, and landmark REIT-InvIT fundraises.

**Key highlights:**

**Domestic liquidity holds firm**
Despite heavy FII selling, domestic institutions stepped up, tripling their net inflows in March compared to February supported by SIP inflows of close to INR 30,000-31,000 Cr.

**Equity valuations reset**
Compression in NIFTY PE multiples to ~19.9x has created attractive re-entry levels. The RBI’s neutral stance and steady domestic demand provide a supportive backdrop.

**REITs & InvITs show resilience amidst volatility**
REITs and InvITs showcased resilience in Q1CY26, outperforming broader indices and attracting yield-oriented investors.

Download our detailed Q1 CY2026 capital markets update for more. Reach out at ecm@avendus.com.

Best regards,
**Avendus ECM Team**`,
    buttonLabel: 'Download Now',
    buttonLink: 'https://www.avendus.com/insights/investment-banking/newsletter/ecm-newsletter-high-intensity-quarter-outlook-remains-constructive',
    buttonRadius: '43px',
    buttonColor: '#cc1919',
    lastModified: '2026-11-15T18:15:00.000Z'
  },
  {
    id: 'ets_newsletter_march_2026',
    brand: 'avendus',
    folderName: 'ets_newsletter_march_2026',
    title: 'ETS Newsletter - March 2026',
    previewText: 'AI-led Transformation Reshaping IT Services and Semiconductors',
    bannerUrl: 'avendus/ets_newsletter_march_2026/img/ets_banner.png',
    bannerFilename: 'ets_banner.png',
    content: `Dear Reader,

In our latest edition of the ET&S Newsletter, we bring you a comprehensive view of the key trends shaping the IT and ITeS landscape.

In parallel, Generative AI is reshaping delivery into a **“Human + Token” operating model** - augmenting productivity, driving workforce reskilling, and redefining cost structures across service delivery. This transformation is also reflected in evolving commercial constructs, with a clear shift away from traditional Time & Materials (T&M) toward outcome-based, fixed-fee, and non-FTE subscription-led pricing models.

**Notable transactions included:**
- IBM’s acquisition of Confluent (~USD 11 bn)
- Coforge’s all-stock acquisition of Encora (~USD 2.3 bn)
- Tata Consultancy Services’ acquisition of Coastal Cloud (~USD 700 mn)

For a deeper dive into these themes, we invite you to explore the newsletter.

Happy reading!`,
    buttonLabel: 'Download Now',
    buttonLink: 'https://www.avendus.com/insights/investment-banking/newsletter/ai-led-transformation-reshaping-it-services-and-semiconductors',
    buttonRadius: '43px',
    buttonColor: '#cc1919',
    lastModified: '2026-11-15T18:20:00.000Z'
  },
  {
    id: 'new_age_report',
    brand: 'avendus',
    folderName: 'new_age_report',
    title: 'New Age Report - From Factory to Frontier',
    previewText: 'Building India\'s New-Age Industrial Stack',
    bannerUrl: 'avendus/new_age_report/img/emailer_banner.png',
    bannerFilename: 'emailer_banner.png',
    content: `Dear Reader,

The global economy is entering a new phase of industrial investment. After two decades in which capital and talent flowed towards software, they are returning to hard, physical technology.

In our latest report, **From Factory to Frontier: Building India's New-Age Industrial Stack**, we explore what this shift means for India.

**5 Key Themes Shaping the Sector:**
1. **From bits to atoms:** Deep tech's share of global venture funding has tripled in a decade.
2. **Manufacturing is the moat:** Unit costs have fallen 98-99.9%. Making critical inputs reliably is the key constraint.
3. **Security sets the demand floor:** 75% of Indian defence capital acquisition is reserved for domestic industry.
4. **Policy has moved upstream:** Incentives shifting to critical components and materials.
5. **The next 3-5 years will decide the winners:** Proprietary tech and sovereign customer validation are vital.

We invite you to explore the report!`,
    buttonLabel: 'Download Now',
    buttonLink: 'https://www.avendus.com/insights/investment-banking/report/from-factory-to-frontier-building-india-s-new-age-industrial-stack',
    buttonRadius: '43px',
    buttonColor: '#cc1919',
    lastModified: '2026-11-15T18:30:00.000Z'
  },
  {
    id: 'demo_emailer',
    brand: 'avendus',
    folderName: 'demo_emailer',
    title: 'Demo Emailer - Avendus Capital',
    previewText: 'Demo Emailer: Discover the latest insights and deal updates',
    bannerUrl: 'avendus/demo_emailer/img/bannerNew.jpg',
    bannerFilename: 'bannerNew.jpg',
    content: `**Avendus Capital advises on landmark strategic transaction in Indian logistics sector**

Dear Reader,

We are delighted to share our latest transaction update. Avendus Capital continues to reinforce its leadership position in India's Investment Banking and advisory space.

**Avendus Capital acted as the exclusive financial advisor on this transaction.**

India's industrial supply chain and logistics ecosystem continue to witness strong institutional backing. Our team remains committed to partnering with premier platforms to unlock synergistic growth.

We look forward to engaging with you!`,
    buttonLabel: 'Know More',
    buttonLink: 'https://www.avendus.com/india/investment-banking',
    buttonRadius: '43px',
    buttonColor: '#cc1919',
    lastModified: '2026-11-15T19:20:00.000Z'
  }
];

class EmailerStudioApp {
  constructor() {
    this.STORAGE_KEY = 'emailer_automate_deals_v3';
    this.deals = this.loadDeals();
    
    // Application state
    this.currentView = 'home';
    this.currentBrand = 'avendus';
    this.activeDealId = null;
    this.previewDevice = 'desktop';
    this.isSidebarCollapsed = false;
    
    // Generation state
    this.isGenerated = false;
    this.openedTabRef = null;
    this.uploadedBannerBlob = null;
    this.uploadedBannerFilename = 'bannerNew.jpg';

    // DOM Elements
    this._cacheDom();
    this._initEditor();
    this._bindEvents();
    this.renderSidebar();
    this.renderHomeRecent();
  }

  loadDeals() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    this.saveDeals(SEED_DEALS);
    return [...SEED_DEALS];
  }

  saveDeals(dealsToSave) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dealsToSave || this.deals));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  _cacheDom() {
    this.homeView = document.getElementById('homeView');
    this.studioView = document.getElementById('studioView');

    this.switchBrandBtn = document.getElementById('switchBrandBtn');
    this.brandBadge = document.getElementById('brandBadge');
    this.sidebarToggleBtn = document.getElementById('sidebarToggleBtn');

    this.sidebar = document.getElementById('appSidebar');
    this.sidebarDealList = document.getElementById('sidebarDealList');
    this.newEmailerBtn = document.getElementById('newEmailerBtn');
    this.sidebarSearch = document.getElementById('sidebarSearch');

    this.folderNameInput = document.getElementById('folderNameInput');
    this.emailTitleInput = document.getElementById('emailTitleInput');
    this.previewTextInput = document.getElementById('previewTextInput');
    this.bannerFileInput = document.getElementById('bannerFileInput');
    this.bannerUrlInput = document.getElementById('bannerUrlInput');
    this.bannerPreviewImg = document.getElementById('bannerPreviewImg');
    this.contentInput = document.getElementById('contentInput');
    this.buttonLabelInput = document.getElementById('buttonLabelInput');
    this.buttonLinkInput = document.getElementById('buttonLinkInput');
    this.customDomainInput = document.getElementById('customDomainInput');

    this.generateBtn = document.getElementById('generateBtn');
    this.updateTabBtn = document.getElementById('updateTabBtn');
    this.downloadZipBtn = document.getElementById('downloadZipBtn');

    this.previewIframe = document.getElementById('previewIframe');
    this.previewDesktopBtn = document.getElementById('previewDesktopBtn');
    this.previewMobileBtn = document.getElementById('previewMobileBtn');
    this.previewContainer = document.getElementById('previewContainer');

    this.toastEl = document.getElementById('toast');
    this.toastMessage = document.getElementById('toastMessage');
  }

  _initEditor() {
    const toolbar = document.getElementById('editorToolbar');
    this.editor = new ContentEditor(this.contentInput, toolbar, () => {
      this.updateLivePreview();
    });
  }

  _bindEvents() {
    document.querySelectorAll('[data-brand-select]').forEach(card => {
      card.addEventListener('click', () => {
        const brand = card.getAttribute('data-brand-select');
        this.selectBrand(brand);
      });
    });

    if (this.switchBrandBtn) {
      this.switchBrandBtn.addEventListener('click', () => {
        this.showHomeView();
      });
    }

    if (this.sidebarToggleBtn) {
      this.sidebarToggleBtn.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }

    if (this.newEmailerBtn) {
      this.newEmailerBtn.addEventListener('click', () => {
        this.createNewEmailer();
      });
    }

    if (this.sidebarSearch) {
      this.sidebarSearch.addEventListener('input', (e) => {
        this.renderSidebar(e.target.value);
      });
    }

    const formInputs = [
      this.folderNameInput,
      this.emailTitleInput,
      this.previewTextInput,
      this.bannerUrlInput,
      this.buttonLabelInput,
      this.buttonLinkInput,
      this.customDomainInput
    ];

    formInputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          this.updateLivePreview();
        });
      }
    });

    if (this.bannerFileInput) {
      this.bannerFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_') || 'banner.jpg';
          this.uploadedBannerBlob = file;
          this.uploadedBannerFilename = safeFilename;

          // Object URL for instant UI preview
          const objectUrl = URL.createObjectURL(file);
          if (this.bannerPreviewImg) {
            this.bannerPreviewImg.src = objectUrl;
            this.bannerPreviewImg.style.display = 'block';
          }
          if (this.bannerUrlInput) {
            this.bannerUrlInput.value = objectUrl;
          }

          // Convert to Base64 so banner is persisted in localStorage across page reloads
          const reader = new FileReader();
          reader.onload = (readEv) => {
            const base64Str = readEv.target.result;
            this.uploadedBannerBase64 = base64Str;
            if (this.activeDealId) {
              const deal = this.deals.find(d => d.id === this.activeDealId);
              if (deal) {
                deal.bannerBase64 = base64Str;
                deal.bannerFilename = safeFilename;
                deal.bannerUrl = base64Str;
                this.saveDeals();
              }
            }
          };
          reader.readAsDataURL(file);

          this.updateLivePreview();
          this.showToast(`Banner image loaded: ${file.name}`);
        }
      });
    }

    if (this.previewDesktopBtn && this.previewMobileBtn) {
      this.previewDesktopBtn.addEventListener('click', () => {
        this.setPreviewDevice('desktop');
      });
      this.previewMobileBtn.addEventListener('click', () => {
        this.setPreviewDevice('mobile');
      });
    }

    if (this.generateBtn) {
      this.generateBtn.addEventListener('click', () => {
        this.handleGenerateEmailer();
      });
    }

    if (this.updateTabBtn) {
      this.updateTabBtn.addEventListener('click', () => {
        this.handleUpdateTab();
      });
    }

    if (this.downloadZipBtn) {
      this.downloadZipBtn.addEventListener('click', () => {
        this.handleDownloadZip();
      });
    }
  }

  showHomeView() {
    this.currentView = 'home';
    this.homeView.classList.remove('hidden');
    this.studioView.classList.add('hidden');
    this.renderHomeRecent();
  }

  selectBrand(brand) {
    this.currentBrand = brand;
    this.currentView = 'studio';
    this.homeView.classList.add('hidden');
    this.studioView.classList.remove('hidden');

    if (this.brandBadge) {
      const labels = { avendus: 'Avendus Capital', sanctum: 'Sanctum Wealth', custom: 'Custom Emailer' };
      this.brandBadge.textContent = labels[brand] || 'Avendus Capital';
    }

    const brandDeals = this.deals.filter(d => (d.brand || 'avendus') === brand);
    if (brandDeals.length > 0) {
      this.loadDeal(brandDeals[0].id);
    } else {
      this.createNewEmailer();
    }

    this.renderSidebar();
  }

  toggleSidebar(forceState) {
    this.isSidebarCollapsed = forceState !== undefined ? forceState : !this.isSidebarCollapsed;
    
    if (this.isSidebarCollapsed) {
      this.sidebar.classList.add('collapsed');
      if (this.sidebarToggleBtn) this.sidebarToggleBtn.innerHTML = '<span>▶</span><span class="sr-only">Expand Sidebar</span>';
    } else {
      this.sidebar.classList.remove('collapsed');
      if (this.sidebarToggleBtn) this.sidebarToggleBtn.innerHTML = '<span>◀</span><span class="sr-only">Collapse Sidebar</span>';
    }
  }

  setPreviewDevice(device) {
    this.previewDevice = device;
    if (device === 'mobile') {
      this.previewContainer.classList.add('mobile-frame');
      this.previewMobileBtn.classList.add('active');
      this.previewDesktopBtn.classList.remove('active');
    } else {
      this.previewContainer.classList.remove('mobile-frame');
      this.previewDesktopBtn.classList.add('active');
      this.previewMobileBtn.classList.remove('active');
    }
  }

  createNewEmailer() {
    const defaultFolder = `new_${this.currentBrand}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
    const newDeal = {
      id: 'deal_' + Date.now(),
      brand: this.currentBrand,
      folderName: defaultFolder,
      title: 'New Transaction Announcement',
      previewText: 'Discover the latest transaction insights',
      bannerUrl: 'avendus/deal_KSH_Group/img/bannerNew.jpg',
      bannerFilename: 'bannerNew.jpg',
      content: `**New Transaction Announcement**

Dear Reader,

Avendus Capital is pleased to announce our latest strategic transaction advisory in India.

**Avendus Capital acted as the exclusive financial advisor on this transaction.**

Our team continues to lead transformative deals across high-growth sectors.

Best regards,
**Avendus Capital Team**`,
      buttonLabel: 'Know More',
      buttonLink: 'https://www.avendus.com',
      buttonRadius: '43px',
      buttonColor: '#cc1919',
      lastModified: new Date().toISOString()
    };

    // Reset upload state for fresh mailer
    this.uploadedBannerBlob = null;
    this.uploadedBannerBase64 = null;
    this.uploadedBannerFilename = 'bannerNew.jpg';
    if (this.bannerFileInput) this.bannerFileInput.value = '';

    this.deals.unshift(newDeal);
    this.saveDeals();
    this.loadDeal(newDeal.id);
    this.renderSidebar();
    this.showToast('Created new emailer draft');
  }

  loadDeal(dealId) {
    const deal = this.deals.find(d => d.id === dealId);
    if (!deal) return;

    this.activeDealId = deal.id;
    this.currentBrand = deal.brand || 'avendus';

    // Restore banner upload state if persisted
    if (deal.bannerBase64) {
      this.uploadedBannerBase64 = deal.bannerBase64;
      this.uploadedBannerFilename = deal.bannerFilename || 'banner.jpg';
      this.uploadedBannerBlob = this.base64ToBlob(deal.bannerBase64);
    } else {
      this.uploadedBannerBase64 = null;
      this.uploadedBannerFilename = deal.bannerFilename || 'bannerNew.jpg';
      this.uploadedBannerBlob = null;
    }
    if (this.bannerFileInput) this.bannerFileInput.value = '';

    this.folderNameInput.value = deal.folderName || '';
    this.emailTitleInput.value = deal.title || '';
    this.previewTextInput.value = deal.previewText || '';
    this.bannerUrlInput.value = deal.bannerBase64 || deal.bannerUrl || '';
    this.buttonLabelInput.value = deal.buttonLabel || 'Know More';
    this.buttonLinkInput.value = deal.buttonLink || 'https://www.avendus.com';

    if (this.bannerPreviewImg) {
      this.bannerPreviewImg.src = deal.bannerBase64 || deal.bannerUrl || `avendus/deal_KSH_Group/img/bannerNew.jpg`;
      this.bannerPreviewImg.style.display = 'block';
    }

    if (this.editor) {
      this.editor.setValue(deal.content || '');
    }

    this.setGeneratedState(false);
    this.updateLivePreview();
    this.renderSidebar();
  }

  base64ToBlob(base64Data) {
    if (!base64Data || typeof base64Data !== 'string' || !base64Data.includes(';base64,')) {
      return null;
    }
    try {
      const parts = base64Data.split(';base64,');
      const contentType = parts[0].split(':')[1] || 'image/jpeg';
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
    } catch (e) {
      console.error('Error converting base64 to blob:', e);
      return null;
    }
  }

  getFormData() {
    const deal = this.deals.find(d => d.id === this.activeDealId);
    const existingBase64 = this.uploadedBannerBase64 || (deal && deal.bannerBase64) || null;
    const existingFilename = this.uploadedBannerFilename || (deal && deal.bannerFilename) || 'bannerNew.jpg';

    return {
      id: this.activeDealId || 'deal_' + Date.now(),
      brand: this.currentBrand,
      folderName: (this.folderNameInput.value || 'deal_KSH_Group').trim(),
      title: (this.emailTitleInput.value || 'Transaction Announcement').trim(),
      previewText: (this.previewTextInput.value || '').trim(),
      bannerUrl: this.bannerUrlInput.value || existingBase64 || `avendus/deal_KSH_Group/img/bannerNew.jpg`,
      bannerFilename: existingFilename,
      bannerBase64: existingBase64,
      content: this.editor ? this.editor.getValue() : (this.contentInput.value || ''),
      buttonLabel: (this.buttonLabelInput.value || 'Know More').trim(),
      buttonLink: (this.buttonLinkInput.value || 'https://www.avendus.com').trim(),
      customDomain: (this.customDomainInput && this.customDomainInput.value) ? this.customDomainInput.value.trim() : '',
      lastModified: new Date().toISOString()
    };
  }

  // Update Live Preview inside the Iframe using deal-isolated image paths
  updateLivePreview() {
    if (!this.previewIframe) return;

    const data = this.getFormData();
    const html = TemplateGenerator.generate(data, { isLivePreview: true });

    const doc = this.previewIframe.contentDocument || this.previewIframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  }

  setGeneratedState(isGenerated) {
    this.isGenerated = isGenerated;
    if (this.downloadZipBtn) {
      if (isGenerated) {
        this.downloadZipBtn.removeAttribute('disabled');
        this.downloadZipBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        this.downloadZipBtn.classList.add('btn-active-zip');
        this.downloadZipBtn.title = 'Click to download complete folder as ZIP';
      } else {
        this.downloadZipBtn.setAttribute('disabled', 'disabled');
        this.downloadZipBtn.classList.add('opacity-50', 'cursor-not-allowed');
        this.downloadZipBtn.classList.remove('btn-active-zip');
        this.downloadZipBtn.title = 'Generate the emailer first to download ZIP';
      }
    }
  }

  handleGenerateEmailer() {
    const data = this.getFormData();

    const existingIndex = this.deals.findIndex(d => d.id === this.activeDealId);
    if (existingIndex >= 0) {
      this.deals[existingIndex] = { ...this.deals[existingIndex], ...data };
    } else {
      this.deals.unshift(data);
      this.activeDealId = data.id;
    }
    this.saveDeals();
    this.renderSidebar();

    // Generate with deal-isolated paths for local new-tab preview
    const finalHtml = TemplateGenerator.generate(data, { isLivePreview: true });

    const blob = new Blob([finalHtml], { type: 'text/html;charset=utf-8' });
    const tabUrl = URL.createObjectURL(blob);

    if (this.openedTabRef && !this.openedTabRef.closed) {
      this.openedTabRef.location.href = tabUrl;
      this.openedTabRef.focus();
    } else {
      this.openedTabRef = window.open(tabUrl, '_blank');
    }

    this.setGeneratedState(true);
    this.showToast(`Emailer "${data.folderName}" generated & opened in new tab!`);
  }

  handleUpdateTab() {
    const data = this.getFormData();
    const finalHtml = TemplateGenerator.generate(data, { isLivePreview: true });

    if (this.openedTabRef && !this.openedTabRef.closed) {
      try {
        this.openedTabRef.document.open();
        this.openedTabRef.document.write(finalHtml);
        this.openedTabRef.document.close();
        this.openedTabRef.focus();
        this.showToast('Open tab successfully updated with latest changes!');
        return;
      } catch (e) {
        const blob = new Blob([finalHtml], { type: 'text/html;charset=utf-8' });
        this.openedTabRef.location.href = URL.createObjectURL(blob);
        this.openedTabRef.focus();
        this.showToast('Open tab refreshed!');
        return;
      }
    }

    this.handleGenerateEmailer();
  }

  // Download ZIP with all images packaged inside this deal's OWN img/ folder
  async handleDownloadZip() {
    if (!this.isGenerated) {
      this.showToast('Please click "Generate Emailer" first before downloading ZIP.', 'warning');
      return;
    }

    const data = this.getFormData();
    this.showToast('Preparing ZIP package with isolated deal assets...', 'info');

    try {
      const zip = new SimpleZip();
      const folderPrefix = `${data.brand}/${data.folderName}/`;

      // 1. Generate HTML file for the ZIP package (all image src = "img/[filename]")
      const zipHtml = TemplateGenerator.generate(data, { relativeForZip: true });
      await zip.file(`${folderPrefix}index.html`, zipHtml);
      await zip.file(`${data.folderName}/index.html`, zipHtml);
      await zip.file(`index.html`, zipHtml);

      // 2. Add all 11 Footer Assets into this deal's OWN img/ folder
      const footerAssets = [
        'IBSignature.png',
        'abou_us.png',
        'assest_management.png',
        'credit_solutions.png',
        'investment.png',
        'institutional.png',
        'wealth.png',
        'linkedin.png',
        'twitter.png',
        'insta.png',
        'dark-youtube-48.png'
      ];

      for (const filename of footerAssets) {
        let loadedBlob = null;
        // Attempt 1: Fetch from this deal's own img directory
        try {
          const resp = await fetch(`${data.brand}/${data.folderName}/img/${filename}`);
          if (resp.ok) loadedBlob = await resp.blob();
        } catch (e) {}

        // Attempt 2: Fallback to reference deal deal_KSH_Group img directory
        if (!loadedBlob) {
          try {
            const resp2 = await fetch(`${data.brand}/deal_KSH_Group/img/${filename}`);
            if (resp2.ok) loadedBlob = await resp2.blob();
          } catch (e) {}
        }

        if (loadedBlob) {
          await zip.file(`${folderPrefix}img/${filename}`, loadedBlob);
          await zip.file(`${data.folderName}/img/${filename}`, loadedBlob);
          await zip.file(`img/${filename}`, loadedBlob);
        }
      }

      // 3. Add Banner Image to this deal's OWN img/ folder
      let bannerBlob = null;
      if (this.uploadedBannerBlob) {
        bannerBlob = this.uploadedBannerBlob;
      } else if (this.uploadedBannerBase64) {
        bannerBlob = this.base64ToBlob(this.uploadedBannerBase64);
      } else if (data.bannerBase64) {
        bannerBlob = this.base64ToBlob(data.bannerBase64);
      } else {
        const deal = this.deals.find(d => d.id === this.activeDealId);
        if (deal && deal.bannerBase64) {
          bannerBlob = this.base64ToBlob(deal.bannerBase64);
        }
      }

      // If no custom uploaded banner, fetch the default deal banner or master banner
      if (!bannerBlob) {
        try {
          const bResp = await fetch(`${data.brand}/${data.folderName}/img/${data.bannerFilename}`);
          if (bResp.ok) {
            bannerBlob = await bResp.blob();
          } else {
            const bResp2 = await fetch(`${data.brand}/deal_KSH_Group/img/bannerNew.jpg`);
            if (bResp2.ok) {
              bannerBlob = await bResp2.blob();
            }
          }
        } catch (err) {
          console.warn('Could not bundle banner:', err);
        }
      }

      if (bannerBlob) {
        await zip.file(`${folderPrefix}img/${data.bannerFilename}`, bannerBlob);
        await zip.file(`${data.folderName}/img/${data.bannerFilename}`, bannerBlob);
        await zip.file(`img/${data.bannerFilename}`, bannerBlob);
      }

      // 4. Compile ZIP Blob & trigger download
      const zipBlob = await zip.generateAsync();
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(zipBlob);
      downloadLink.download = `${data.folderName}.zip`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      this.showToast(`Downloaded: ${data.folderName}.zip!`);
    } catch (e) {
      console.error('ZIP generation error:', e);
      this.showToast('Error generating ZIP: ' + e.message, 'error');
    }
  }

  formatDate(dateString) {
    if (!dateString) return 'Just now';
    try {
      const d = new Date(dateString);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = d.getDate();
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      let hours = d.getHours();
      const mins = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${day} ${month} ${year}, ${hours}:${mins} ${ampm}`;
    } catch (e) {
      return dateString;
    }
  }

  renderSidebar(filterQuery = '') {
    if (!this.sidebarDealList) return;

    const brandDeals = this.deals.filter(d => (d.brand || 'avendus') === this.currentBrand);
    const q = (filterQuery || '').toLowerCase().trim();

    const filtered = brandDeals.filter(d => {
      if (!q) return true;
      return (d.folderName || '').toLowerCase().includes(q) || (d.title || '').toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      this.sidebarDealList.innerHTML = `
        <div class="p-4 text-center text-sm text-gray-400">
          No emailers found in ${this.currentBrand}.<br>
          <button id="quickCreateDeal" class="mt-2 text-red-500 font-semibold hover:underline">+ Create One</button>
        </div>`;
      const btn = document.getElementById('quickCreateDeal');
      if (btn) btn.addEventListener('click', () => this.createNewEmailer());
      return;
    }

    this.sidebarDealList.innerHTML = filtered.map(deal => {
      const isActive = deal.id === this.activeDealId;
      return `
        <div class="sidebar-deal-item ${isActive ? 'active' : ''}" data-deal-id="${deal.id}">
          <div class="flex items-start justify-between">
            <div class="font-medium text-sm text-white truncate max-w-[190px]" title="${deal.folderName}">
              📁 ${deal.folderName}
            </div>
            <button class="delete-deal-btn text-xs text-gray-500 hover:text-red-400" data-delete-id="${deal.id}" title="Delete">✕</button>
          </div>
          <div class="text-xs text-gray-400 line-clamp-1 mt-1" title="${deal.title}">
            ${deal.title}
          </div>
          <div class="text-[11px] text-gray-500 mt-2 flex items-center justify-between">
            <span>🕒 ${this.formatDate(deal.lastModified)}</span>
          </div>
        </div>`;
    }).join('');

    this.sidebarDealList.querySelectorAll('.sidebar-deal-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-deal-btn')) return;
        const id = item.getAttribute('data-deal-id');
        this.loadDeal(id);
      });
    });

    this.sidebarDealList.querySelectorAll('.delete-deal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-delete-id');
        this.deleteDeal(id);
      });
    });
  }

  renderHomeRecent() {
    const recentGrid = document.getElementById('homeRecentGrid');
    if (!recentGrid) return;

    const sorted = [...this.deals].sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified)).slice(0, 6);

    recentGrid.innerHTML = sorted.map(deal => `
      <div class="recent-card bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-red-600 transition" data-home-deal="${deal.id}" data-home-brand="${deal.brand || 'avendus'}">
        <div class="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span class="uppercase tracking-wider px-2 py-0.5 rounded bg-gray-800 text-red-400 font-semibold">${deal.brand || 'avendus'}</span>
          <span>🕒 ${this.formatDate(deal.lastModified)}</span>
        </div>
        <div class="text-sm font-semibold text-white truncate mb-1">
          📁 ${deal.folderName}
        </div>
        <div class="text-xs text-gray-400 line-clamp-2">
          ${deal.title}
        </div>
        <div class="mt-4 pt-3 border-t border-gray-800 flex justify-end">
          <span class="text-xs font-medium text-red-500 hover:underline">Edit Emailer →</span>
        </div>
      </div>`).join('');

    recentGrid.querySelectorAll('[data-home-deal]').forEach(card => {
      card.addEventListener('click', () => {
        const dealId = card.getAttribute('data-home-deal');
        const brand = card.getAttribute('data-home-brand');
        this.selectBrand(brand);
        this.loadDeal(dealId);
      });
    });
  }

  deleteDeal(dealId) {
    if (!confirm('Are you sure you want to delete this emailer draft?')) return;
    this.deals = this.deals.filter(d => d.id !== dealId);
    this.saveDeals();
    
    if (this.activeDealId === dealId) {
      if (this.deals.length > 0) {
        this.loadDeal(this.deals[0].id);
      } else {
        this.createNewEmailer();
      }
    } else {
      this.renderSidebar();
    }
    this.showToast('Emailer deleted');
  }

  showToast(message, type = 'success') {
    if (!this.toastEl || !this.toastMessage) return;
    this.toastMessage.textContent = message;
    this.toastEl.classList.remove('hidden', 'translate-y-10', 'opacity-0');
    this.toastEl.classList.add('translate-y-0', 'opacity-100');

    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.toastEl.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => this.toastEl.classList.add('hidden'), 300);
    }, 3500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new EmailerStudioApp();
});
