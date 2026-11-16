/**
 * Master Email Template Generator
 * Guarantees strict Avendus email standard:
 * - Full Outlook VML & MSO conditionals
 * - CSS Reset & Mobile Media Queries
 * - Single <p> tag content block with <span> typography and <br /><br /> paragraph breaks
 * - Deal-level Asset Isolation: All images are saved and referenced inside [brand]/[folderName]/img/
 */

const TemplateGenerator = {
  // Format body content into a strict SINGLE <p> tag with Avendus font spans
  formatContent(rawContent) {
    if (!rawContent || !rawContent.trim()) {
      return `<p style="text-align: justify; line-height: 125%; font-family: arial, helvetica neue, helvetica, sans-serif;">
        <span style="font-size: 14px"><span style="font-family: arial, helvetica neue, helvetica, sans-serif;">
          Dear Reader,
        </span></span>
      </p>`;
    }

    // Standardize line breaks
    let text = rawContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

    // 1. Convert Markdown bold **text** to <strong>text</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 2. Convert markdown italic *text* or _text_ to <em>text</em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 3. Split by double newlines into separate paragraphs
    const rawParagraphs = text.split(/\n\s*\n/);

    const formattedParagraphs = rawParagraphs.map(para => {
      let trimmed = para.trim();
      if (!trimmed) return '';

      // Inside a single paragraph, single newline becomes a single <br />
      let lineBreakProcessed = trimmed.replace(/\n/g, '<br />\n');

      return `<span style="font-size: 14px"><span style="font-family: arial, helvetica neue, helvetica, sans-serif;">${lineBreakProcessed}</span></span>`;
    }).filter(p => p.length > 0);

    // 4. Return everything joined with <br /><br /> strictly inside ONE single <p> tag
    return `<p style="text-align: justify; line-height: 125%; font-family: arial, helvetica neue, helvetica, sans-serif;">
      ${formattedParagraphs.join('<br />\n<br />\n')}
    </p>`;
  },

  // Resolve base image URL
  // Strictly isolates assets to: [Domain]/[Brand]/[FolderName]/img/[Filename]
  getImageUrl(brand, folderName, filename, customDomain = '') {
    const origin = (customDomain && customDomain.trim()) 
      ? customDomain.trim().replace(/\/+$/, '') 
      : (typeof window !== 'undefined' && window.location.origin && !window.location.origin.startsWith('file:') 
          ? window.location.origin 
          : 'https://your-app.vercel.app');

    const cleanBrand = (brand || 'avendus').toLowerCase();
    const cleanFolder = (folderName || 'deal_emailer').trim();
    const cleanFile = filename.replace(/^\/+/, '');

    return `${origin}/${cleanBrand}/${cleanFolder}/img/${cleanFile}`;
  },

  // Generate complete Avendus HTML
  generateAvendus(data, options = {}) {
    const {
      folderName = 'deal_KSH_Group',
      brand = 'avendus',
      title = 'Avendus Capital - Transaction Update',
      previewText = '',
      bannerUrl = '',
      bannerFilename = 'bannerNew.jpg',
      content = '',
      buttonLabel = 'Know More',
      buttonLink = 'https://www.avendus.com',
      buttonRadius = '43px',
      buttonColor = '#cc1919',
      customDomain = ''
    } = data;

    const formattedContent = this.formatContent(content);
    const snippet = previewText ? previewText.trim() : title;
    const cleanBrand = (brand || 'avendus').toLowerCase();
    const cleanFolder = (folderName || 'deal_KSH_Group').trim();

    // Mode resolution for image paths:
    // 1. isZipExport: 'img/[filename]' (relative to index.html inside the deal folder)
    // 2. isLivePreview: '${cleanBrand}/${cleanFolder}/img/[filename]' (relative to app root for iframe preview)
    // 3. Deployed / default: 'https://your-app.vercel.app/[brand]/[folderName]/img/[filename]'
    const isZipExport = options.relativeForZip === true;
    const isLivePreview = options.isLivePreview === true;

    const resolveImg = (filename) => {
      if (isZipExport) {
        return `img/${filename}`;
      }
      if (isLivePreview) {
        return `${cleanBrand}/${cleanFolder}/img/${filename}`;
      }
      return this.getImageUrl(brand, folderName, filename, customDomain);
    };

    // Banner image resolution:
    // If user provided a remote URL (http/https) or inline data URL, use it directly;
    // Otherwise, point to the deal's own img/ folder.
    let bannerSrc;
    if (bannerUrl && (bannerUrl.startsWith('http://') || bannerUrl.startsWith('https://') || bannerUrl.startsWith('data:'))) {
      bannerSrc = bannerUrl;
    } else {
      bannerSrc = resolveImg(bannerFilename);
    }

    // All footer assets reside inside this deal's own img/ folder
    const sigImg = resolveImg('IBSignature.png');
    const aboutImg = resolveImg('abou_us.png');
    const amImg = resolveImg('assest_management.png');
    const csImg = resolveImg('credit_solutions.png');
    const ibImg = resolveImg('investment.png');
    const ieImg = resolveImg('institutional.png');
    const wmImg = resolveImg('wealth.png');
    const liImg = resolveImg('linkedin.png');
    const twImg = resolveImg('twitter.png');
    const inImg = resolveImg('insta.png');
    const ytImg = resolveImg('dark-youtube-48.png');

    return `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <!-- NAME: SELL PRODUCTS -->
  <!--[if gte mso 15]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG />
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${this.escapeHtml(title)}</title>

  <style type="text/css">
    p { margin: 10px 0; padding: 0; }
    table { border-collapse: collapse; }
    h1, h2, h3, h4, h5, h6 { display: block; margin: 0; padding: 0; }
    img, a img { border: 0; height: auto; outline: none; text-decoration: none; }
    body, #bodyTable, #bodyCell { height: 100%; margin: 0; padding: 0; width: 100%; }
    .mcnPreviewText { display: none !important; }
    #outlook a { padding: 0; }
    img { -ms-interpolation-mode: bicubic; }
    table { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    .ReadMsgBody { width: 100%; }
    .ExternalClass { width: 100%; }
    p, a, li, td, blockquote { mso-line-height-rule: exactly; }
    a[href^="tel"], a[href^="sms"] { color: inherit; cursor: default; text-decoration: none; }
    p, a, li, td, body, table, blockquote { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
    .ExternalClass, .ExternalClass p, .ExternalClass td, .ExternalClass div, .ExternalClass span, .ExternalClass font { line-height: 100%; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    .templateContainer { max-width: 600px !important; }
    a.mcnButton { display: block; }
    .mcnImage, .mcnRetinaImage { vertical-align: bottom; }
    .mcnTextContent { word-break: break-word; }
    .mcnTextContent img { height: auto !important; }
    .mcnDividerBlock { table-layout: fixed !important; }
    h1 { color: #222222; font-family: Helvetica; font-size: 40px; font-weight: bold; line-height: 150%; text-align: center; }
    h2 { color: #222222; font-family: Helvetica; font-size: 34px; font-weight: bold; line-height: 150%; text-align: left; }
    h3 { color: #444444; font-family: Helvetica; font-size: 22px; font-weight: bold; line-height: 150%; text-align: left; }
    h4 { color: #949494; font-family: Georgia; font-size: 20px; font-style: italic; font-weight: normal; line-height: 125%; text-align: left; }
    #templateHeader { background-color: #f7f7f7; border-top: 0; border-bottom: 0; padding-top: 0px; padding-bottom: 0px; }
    .headerContainer { background-color: transparent; border-top: 0; border-bottom: 0; padding-top: 0; padding-bottom: 0; }
    .headerContainer .mcnTextContent { color: #757575; font-family: Helvetica; font-size: 16px; line-height: 150%; text-align: left; }
    #templateBody { background-color: #ffffff; border-top: 0; border-bottom: 0; padding-top: 0px; padding-bottom: 0px; }
    .bodyContainer { background-color: transparent; border-top: 0; border-bottom: 0; padding-top: 0; padding-bottom: 0; }
    .bodyContainer .mcnTextContent { color: #757575; font-family: Helvetica; font-size: 16px; line-height: 150%; text-align: left; }
    #templateFooter { background-color: transparent; border-top: 0; border-bottom: 0; padding-top: 51px; padding-bottom: 51px; }
    .footerContainer { background-color: transparent; border-top: 0; border-bottom: 0; padding-top: 0; padding-bottom: 0; }
    .footerContainer .mcnTextContent { color: #ffffff; font-family: Helvetica; font-size: 12px; line-height: 150%; text-align: center; }
    @media only screen and (min-width: 768px) { .templateContainer { width: 600px !important; } }
    @media only screen and (max-width: 480px) {
      body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: none !important; }
      body { width: 100% !important; min-width: 100% !important; }
      .mcnRetinaImage { max-width: 100% !important; }
      .mcnImage { width: 100% !important; }
      .mcnTextContent { padding-right: 18px !important; padding-left: 18px !important; }
      h1 { font-size: 30px !important; line-height: 125% !important; }
      h2 { font-size: 26px !important; line-height: 125% !important; }
      h3 { font-size: 20px !important; line-height: 150% !important; }
      h4 { font-size: 18px !important; line-height: 150% !important; }
      .bodyContainer .mcnTextContent { font-size: 16px !important; line-height: 150% !important; }
      .footerContainer .mcnTextContent { font-size: 14px !important; line-height: 150% !important; }
    }
  </style>
</head>
<body>
  <!--*|IF:MC_PREVIEW_TEXT|*-->
  <!--[if !gte mso 9]><!---->
  <span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">
    ${this.escapeHtml(snippet)}
  </span>
  <!--<![endif]-->
  <!--*|END:IF|*-->

  <center>
    <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
      <tr>
        <td align="center" valign="top" id="bodyCell">
          <!-- BEGIN TEMPLATE // -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" valign="top" id="templateHeader" data-template-container>
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                <tr>
                <td align="center" valign="top" width="600" style="width:600px;">
                <![endif]-->
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                  <tr>
                    <td valign="top" class="headerContainer"></td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <tr>
              <td align="center" valign="top" id="templateBody" data-template-container>
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                <tr>
                <td align="center" valign="top" width="600" style="width:600px;">
                <![endif]-->
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                  <tr>
                    <td valign="top" class="bodyContainer">

                      <!-- BLOCK 1: DYNAMIC BANNER IMAGE -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width: 100%">
                        <tbody class="mcnImageBlockOuter">
                          <tr>
                            <td valign="top" style="padding: 0px" class="mcnImageBlockInner">
                              <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width: 100%">
                                <tbody>
                                  <tr>
                                    <td class="mcnImageContent" valign="top" style="padding: 0px; text-align: center;">
                                      <img align="center" alt="${this.escapeHtml(title)}" src="${bannerSrc}" width="600" style="max-width: 1000px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage" />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- BLOCK 2: FIXED THIN DIVIDER -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width: 100%">
                        <tbody class="mcnDividerBlockOuter">
                          <tr>
                            <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 5px 18px">
                              <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border-top: 2px solid #eaeaea;">
                                <tbody>
                                  <tr><td><span></span></td></tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- BLOCK 3: DYNAMIC BODY CONTENT (STRICT SINGLE <p> TAG) -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width: 100%">
                        <tbody class="mcnTextBlockOuter">
                          <tr>
                            <td valign="top" class="mcnTextBlockInner" style="padding-top: 9px">
                              <!--[if mso]>
                              <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                              <tr>
                              <td valign="top" width="600" style="width:600px;">
                              <![endif]-->
                              <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%; min-width: 100%" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                  <tr>
                                    <td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px; line-height: 125%;">
                                      ${formattedContent}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if mso]>
                              </td>
                              </tr>
                              </table>
                              <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- BLOCK 4: DYNAMIC CTA BUTTON -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width: 100%">
                        <tbody class="mcnButtonBlockOuter">
                          <tr>
                            <td style="padding: 0 18px 18px 18px;" valign="top" align="center" class="mcnButtonBlockInner">
                              <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important; border-radius: ${buttonRadius}; background-color: ${buttonColor};">
                                <tbody>
                                  <tr>
                                    <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Arial; font-size: 16px; padding: 18px 30px;">
                                      <a class="mcnButton" title="${this.escapeHtml(buttonLabel)}" href="${this.escapeHtml(buttonLink)}" target="_blank" style="font-weight: bold; letter-spacing: normal; line-height: 100%; text-align: center; text-decoration: none; color: #ffffff;">
                                        ${this.escapeHtml(buttonLabel)}
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- BLOCK 5: FIXED IB SIGNATURE (SAVED IN DEAL'S IMG/ FOLDER) -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width: 100%">
                        <tbody class="mcnImageBlockOuter">
                          <tr>
                            <td valign="top" style="padding: 0px" class="mcnImageBlockInner">
                              <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width: 100%">
                                <tbody>
                                  <tr>
                                    <td class="mcnImageContent" valign="top" style="padding: 0px; text-align: center;">
                                      <a href="http://www.avendus.com" target="_blank">
                                        <img align="center" alt="Avendus Capital" src="${sigImg}" width="600" style="max-width: 1000px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage" />
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- BLOCK 6: FIXED 6 SERVICES NAVIGATION BAR (SAVED IN DEAL'S IMG/ FOLDER) -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width: 100%">
                        <tbody class="mcnImageBlockOuter">
                          <tr>
                            <td valign="top" class="mcnImageBlockInner">
                              <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width: 100%">
                                <tbody>
                                  <tr>
                                    <td style="width: 86px">
                                      <a href="https://www.avendus.com/india/about-us" target="_blank">
                                        <img src="${aboutImg}" style="display: block" height="28" width="86" alt="About Us" />
                                      </a>
                                    </td>
                                    <td style="width: 103px">
                                      <a href="https://www.avendus.com/india/asset-management" target="_blank">
                                        <img src="${amImg}" style="display: block" height="28" width="103" alt="Asset Management" />
                                      </a>
                                    </td>
                                    <td style="width: 85px">
                                      <a href="https://www.avendus.com/india/credit-solutions" target="_blank">
                                        <img src="${csImg}" style="display: block" height="28" width="85" alt="Credit Solutions" />
                                      </a>
                                    </td>
                                    <td style="width: 106px">
                                      <a href="https://www.avendus.com/india/investment-banking" target="_blank">
                                        <img src="${ibImg}" style="display: block" height="28" width="106" alt="Investment Banking" />
                                      </a>
                                    </td>
                                    <td style="width: 107px">
                                      <a href="https://www.avendus.com/india/institutional-equities" target="_blank">
                                        <img src="${ieImg}" style="display: block" height="28" width="107" alt="Institutional Equities" />
                                      </a>
                                    </td>
                                    <td style="width: 113px">
                                      <a href="https://www.avendus.com/india/wealth-management" target="_blank">
                                        <img src="${wmImg}" style="display: block" height="28" width="113" alt="Wealth Management" />
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- BLOCK 7: FIXED SOCIAL ICONS ROW (SAVED IN DEAL'S IMG/ FOLDER) -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width: 100%">
                        <tbody class="mcnImageBlockOuter">
                          <tr>
                            <td valign="top" style="padding-top: 30px; padding-bottom: 30px" class="mcnImageBlockInner">
                              <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width: 100%">
                                <tbody>
                                  <tr>
                                    <td style="width: 200px"></td>
                                    <td style="width: 50px">
                                      <a href="http://www.linkedin.com/company/avendus" target="_blank">
                                        <img src="${liImg}" style="display: block" height="24" width="24" alt="LinkedIn" />
                                      </a>
                                    </td>
                                    <td style="width: 50px">
                                      <a href="http://www.twitter.com/avendus" target="_blank">
                                        <img src="${twImg}" style="display: block" height="24" width="24" alt="Twitter" />
                                      </a>
                                    </td>
                                    <td style="width: 50px">
                                      <a href="http://instagram.com/avendusgroup" target="_blank">
                                        <img src="${inImg}" style="display: block" height="24" width="24" alt="Instagram" />
                                      </a>
                                    </td>
                                    <td style="width: 50px">
                                      <a href="https://www.youtube.com/channel/UCIcPdtsCqcRYfYf0s-wMB_Q/featured" target="_blank">
                                        <img src="${ytImg}" style="display: block" height="24" width="24" alt="YouTube" />
                                      </a>
                                    </td>
                                    <td style="width: 200px"></td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- BLOCK 8: FIXED PRIVACY NOTICE -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width: 100%">
                        <tbody class="mcnTextBlockOuter">
                          <tr>
                            <td valign="top" class="mcnTextBlockInner" style="padding-top: 9px">
                              <!--[if mso]>
                              <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                              <tr>
                              <td valign="top" width="600" style="width:600px;">
                              <![endif]-->
                              <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%; min-width: 100%" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                  <tr>
                                    <td valign="top" class="mcnTextContent" style="padding: 0 18px 9px 18px;">
                                      <span style="font-size: 12px">To view our updated Privacy Notice, please </span>
                                      <a href="https://www.avendus.com/india/privacy-policy" target="_blank"><span style="font-size: 12px">Click Here</span></a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if mso]>
                              </td>
                              </tr>
                              </table>
                              <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>

                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <tr>
              <td align="center" valign="top" id="templateFooter" data-template-container>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                  <tr><td valign="top" class="footerContainer"></td></tr>
                </table>
              </td>
            </tr>
          </table>
          <!-- // END TEMPLATE -->
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
  },

  generateSanctum(data, options = {}) {
    return this.generateAvendus(data, options);
  },

  generateCustom(data, options = {}) {
    return this.generateAvendus(data, options);
  },

  generate(data, options = {}) {
    const brand = (data.brand || 'avendus').toLowerCase();
    if (brand === 'sanctum') return this.generateSanctum(data, options);
    if (brand === 'custom') return this.generateCustom(data, options);
    return this.generateAvendus(data, options);
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

window.TemplateGenerator = TemplateGenerator;
