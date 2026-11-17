/**
 * Master Email Template Generator (Next.js / React 19)
 * Guarantees strict client-compliant email structure:
 * - Full Outlook VML & MSO conditionals
 * - CSS Reset & Mobile Media Queries
 * - Single <p> tag content block with <span> typography and <br /><br /> paragraph breaks
 * - Clean multi-brand support: Avendus Capital, Sanctum Wealth, Custom
 */

export const TemplateGenerator = {
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
      const trimmed = para.trim();
      if (!trimmed) return '';

      // Inside a single paragraph, single newline becomes a single <br />
      const lineBreakProcessed = trimmed.replace(/\n/g, '<br />\n');

      return `<span style="font-size: 14px"><span style="font-family: arial, helvetica neue, helvetica, sans-serif;">${lineBreakProcessed}</span></span>`;
    }).filter(p => p.length > 0);

    // 4. Return everything joined with <br /><br /> strictly inside ONE single <p> tag
    return `<p style="text-align: justify; line-height: 125%; font-family: arial, helvetica neue, helvetica, sans-serif;">
      ${formattedParagraphs.join('<br />\n<br />\n')}
    </p>`;
  },

  // Resolve base image URL
  getImageUrl(brand, folderName, filename, customDomain = '') {
    const defaultOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://emailer-automate-antigravity-html.vercel.app';
    const origin = (customDomain && customDomain.trim()) 
      ? customDomain.trim().replace(/\/+$/, '') 
      : (typeof window !== 'undefined' && window.location.origin && !window.location.origin.startsWith('file:') 
          ? window.location.origin 
          : defaultOrigin);

    const cleanBrand = (brand || 'avendus').toLowerCase();
    const cleanFolder = (folderName || 'deal_KSH_Group').trim();
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

    const isLivePreview = options.isLivePreview === true;
    const useOfflineRelative = options.useOfflineRelativePaths === true;

    // List of known pre-deployed deals
    const KNOWN_SERVER_DEALS = [
      'deal_KSH_Group',
      'demo_emailer',
      'ecm_newsletter_march_2026',
      'ets_newsletter_march_2026',
      'new_age_report'
    ];

    const resolveImg = (filename) => {
      if (useOfflineRelative) {
        return `img/${filename}`;
      }
      const serverFolder = KNOWN_SERVER_DEALS.includes(cleanFolder) ? cleanFolder : 'deal_KSH_Group';
      if (isLivePreview) {
        return `${cleanBrand}/${serverFolder}/img/${filename}`;
      }
      // Public HTTPS URL for live emails and downloaded ZIP index.html
      return this.getImageUrl(brand, serverFolder, filename, customDomain);
    };

    // Banner image resolution
    let bannerSrc;
    if (useOfflineRelative) {
      bannerSrc = `img/${bannerFilename}`;
    } else if (bannerUrl && (bannerUrl.startsWith('http://') || bannerUrl.startsWith('https://') || bannerUrl.startsWith('data:'))) {
      bannerSrc = bannerUrl;
    } else if (bannerUrl && bannerUrl.startsWith('blob:') && isLivePreview) {
      bannerSrc = bannerUrl;
    } else {
      const serverFolder = KNOWN_SERVER_DEALS.includes(cleanFolder) ? cleanFolder : 'deal_KSH_Group';
      bannerSrc = this.getImageUrl(brand, serverFolder, bannerFilename, customDomain);
    }

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
    h1 { color: #222222; font-family: Helvetica; font-size: 40px; font-style: normal; font-weight: bold; line-height: 150%; letter-spacing: normal; text-align: center; }
    h2 { color: #222222; font-family: Helvetica; font-size: 34px; font-style: normal; font-weight: bold; line-height: 150%; letter-spacing: normal; text-align: left; }
    h3 { color: #444444; font-family: Helvetica; font-size: 22px; font-style: normal; font-weight: bold; line-height: 150%; letter-spacing: normal; text-align: left; }
    h4 { color: #949494; font-family: Georgia; font-size: 20px; font-style: italic; font-weight: normal; line-height: 125%; letter-spacing: normal; text-align: left; }
    #templateHeader { background-color: #f7f7f7; background-image: none; background-repeat: no-repeat; background-position: center; background-size: cover; border-top: 0; border-bottom: 0; padding-top: 9px; padding-bottom: 0; }
    .headerContainer { background-color: transparent; background-image: none; background-repeat: no-repeat; background-position: center; background-size: cover; border-top: 0; border-bottom: 0; padding-top: 0; padding-bottom: 0; }
    .headerContainer .mcnTextContent, .headerContainer .mcnTextContent p { color: #757575; font-family: Helvetica; font-size: 16px; line-height: 150%; text-align: left; }
    .headerContainer .mcnTextContent a, .headerContainer .mcnTextContent p a { color: #007c89; font-weight: normal; text-decoration: underline; }
    #templateBody { background-color: #ffffff; background-image: none; background-repeat: no-repeat; background-position: center; background-size: cover; border-top: 0; border-bottom: 0; padding-top: 9px; padding-bottom: 0; }
    .bodyContainer { background-color: transparent; background-image: none; background-repeat: no-repeat; background-position: center; background-size: cover; border-top: 0; border-bottom: 0; padding-top: 0; padding-bottom: 0; }
    .bodyContainer .mcnTextContent, .bodyContainer .mcnTextContent p { color: #757575; font-family: Helvetica; font-size: 16px; line-height: 150%; text-align: left; }
    .bodyContainer .mcnTextContent a, .bodyContainer .mcnTextContent p a { color: #007c89; font-weight: normal; text-decoration: underline; }
    #templateFooter { background-color: #333333; background-image: none; background-repeat: no-repeat; background-position: center; background-size: cover; border-top: 0; border-bottom: 0; padding-top: 9px; padding-bottom: 9px; }
    .footerContainer { background-color: transparent; background-image: none; background-repeat: no-repeat; background-position: center; background-size: cover; border-top: 0; border-bottom: 0; padding-top: 0; padding-bottom: 0; }
    .footerContainer .mcnTextContent, .footerContainer .mcnTextContent p { color: #ffffff; font-family: Helvetica; font-size: 12px; line-height: 150%; text-align: center; }
    .footerContainer .mcnTextContent a, .footerContainer .mcnTextContent p a { color: #ffffff; font-weight: normal; text-decoration: underline; }
    @media only screen and (min-width: 768px) {
      .templateContainer { width: 600px !important; }
    }
    @media only screen and (max-width: 480px) {
      body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: none !important; }
      body { width: 100% !important; min-width: 100% !important; }
      .mcnRetinaImage { max-width: 100% !important; }
      .mcnImage { width: 100% !important; }
      .mcnImageBlockInner { padding-left: 0px !important; padding-right: 0px !important; }
      .mcnTextContent { padding-right: 18px !important; padding-left: 18px !important; }
    }
  </style>
</head>
<body style="height: 100%; margin: 0; padding: 0; width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #ffffff;">
  <!-- INBOX PREVIEW SNIPPET -->
  <span class="mcnPreviewText" style="display: none; font-size: 0px; line-height: 0px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; visibility: hidden; mso-hide: all;">
    ${this.escapeHtml(snippet)}
  </span>

  <center>
    <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; height: 100%; margin: 0; padding: 0; width: 100%; background-color: #ffffff;">
      <tr>
        <td align="center" valign="top" id="bodyCell" style="mso-line-height-rule: exactly; height: 100%; margin: 0; padding: 0; width: 100%;">
          <!-- BEGIN TEMPLATE -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
            <tr>
              <td align="center" valign="top" id="templateBody" data-template-container style="mso-line-height-rule: exactly; background-color: #ffffff;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                <tr>
                <td align="center" valign="top" width="600" style="width:600px;">
                <![endif]-->
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; max-width: 600px !important;">
                  <tr>
                    <td valign="top" class="bodyContainer" style="mso-line-height-rule: exactly;">

                      <!-- BLOCK 1: DYNAMIC BANNER IMAGE -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%">
                        <tbody class="mcnImageBlockOuter">
                          <tr>
                            <td valign="top" style="mso-line-height-rule: exactly; padding: 0px" class="mcnImageBlockInner">
                              <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%">
                                <tbody>
                                  <tr>
                                    <td class="mcnImageContent" valign="top" style="mso-line-height-rule: exactly; padding: 0px; text-align: center;">
                                      <img align="center" alt="${this.escapeHtml(title)}" src="${bannerSrc}" width="600" style="border: 0; height: auto; outline: none; text-decoration: none; max-width: 1000px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage" />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- BLOCK 2: FIXED THIN DIVIDER -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%">
                        <tbody class="mcnDividerBlockOuter">
                          <tr>
                            <td class="mcnDividerBlockInner" style="mso-line-height-rule: exactly; min-width: 100%; padding: 5px 18px">
                              <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; border-top: 2px solid #eaeaea;">
                                <tbody>
                                  <tr><td><span></span></td></tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- BLOCK 3: DYNAMIC BODY CONTENT (STRICT SINGLE <p> TAG) -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%">
                        <tbody class="mcnTextBlockOuter">
                          <tr>
                            <td valign="top" class="mcnTextBlockInner" style="mso-line-height-rule: exactly; padding-top: 9px">
                              <!--[if mso]>
                              <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                              <tr>
                              <td valign="top" width="600" style="width:600px;">
                              <![endif]-->
                              <table align="left" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; max-width: 100%; min-width: 100%" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                  <tr>
                                    <td valign="top" class="mcnTextContent" style="mso-line-height-rule: exactly; padding-top: 0; padding-right: 18px; padding-bottom: 9px; padding-left: 18px; color: #555555; word-break: break-word;">
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

                      <!-- BLOCK 4: DYNAMIC ACTION BUTTON (VML BULLETPROOF) -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%">
                        <tbody class="mcnButtonBlockOuter">
                          <tr>
                            <td style="mso-line-height-rule: exactly; padding-top: 0; padding-right: 18px; padding-bottom: 18px; padding-left: 18px" valign="top" align="center" class="mcnButtonBlockInner">
                              <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important; border-radius: ${buttonRadius}; background-color: ${buttonColor};">
                                <tbody>
                                  <tr>
                                    <td align="center" valign="middle" class="mcnButtonContent" style="mso-line-height-rule: exactly; font-family: Arial; font-size: 16px; padding: 15px 30px">
                                      <!--[if mso]>
                                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${this.escapeHtml(buttonLink)}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="10%" strokecolor="${buttonColor}" fillcolor="${buttonColor}">
                                      <w:anchorlock/>
                                      <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">${this.escapeHtml(buttonLabel)}</center>
                                      </v:roundrect>
                                      <![endif]-->
                                      <!--[if !mso]><!-->
                                      <a class="mcnButton" title="${this.escapeHtml(buttonLabel)}" href="${this.escapeHtml(buttonLink)}" target="_blank" style="mso-line-height-rule: exactly; font-weight: bold; letter-spacing: normal; line-height: 100%; text-align: center; text-decoration: none; color: #ffffff; display: block;">
                                        ${this.escapeHtml(buttonLabel)}
                                      </a>
                                      <!--<![endif]-->
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- BLOCK 5: SIGNATURE & FOOTER NAVIGATION -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%">
                        <tbody class="mcnImageBlockOuter">
                          <tr>
                            <td valign="top" style="mso-line-height-rule: exactly; padding: 9px" class="mcnImageBlockInner">
                              <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%">
                                <tbody>
                                  <tr>
                                    <td class="mcnImageContent" valign="top" style="mso-line-height-rule: exactly; padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align: center;">
                                      <img align="center" alt="Signature" src="${sigImg}" width="564" style="border: 0; height: auto; outline: none; text-decoration: none; max-width: 1200px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage" />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- BRAND NAVIGATION LINKS -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageGroupBlock" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody class="mcnImageGroupBlockOuter">
                          <tr>
                            <td valign="top" style="mso-line-height-rule: exactly; padding: 9px" class="mcnImageGroupBlockInner">
                              <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageGroupContentContainer" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                  <tr>
                                    <td class="mcnImageGroupContent" valign="top" style="mso-line-height-rule: exactly; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align: center;">
                                      <a href="https://www.avendus.com/about-us" target="_blank"><img alt="About Us" src="${aboutImg}" width="80" style="border: 0; height: auto; outline: none; text-decoration: none; display: inline !important;" class="mcnImage" /></a>
                                      <a href="https://www.avendus.com/asset-management" target="_blank"><img alt="Asset Management" src="${amImg}" width="80" style="border: 0; height: auto; outline: none; text-decoration: none; display: inline !important;" class="mcnImage" /></a>
                                      <a href="https://www.avendus.com/credit-solutions" target="_blank"><img alt="Credit Solutions" src="${csImg}" width="80" style="border: 0; height: auto; outline: none; text-decoration: none; display: inline !important;" class="mcnImage" /></a>
                                      <a href="https://www.avendus.com/investment-banking" target="_blank"><img alt="Investment Banking" src="${ibImg}" width="80" style="border: 0; height: auto; outline: none; text-decoration: none; display: inline !important;" class="mcnImage" /></a>
                                      <a href="https://www.avendus.com/institutional-equities" target="_blank"><img alt="Institutional Equities" src="${ieImg}" width="80" style="border: 0; height: auto; outline: none; text-decoration: none; display: inline !important;" class="mcnImage" /></a>
                                      <a href="https://www.avendus.com/wealth-management" target="_blank"><img alt="Wealth Management" src="${wmImg}" width="80" style="border: 0; height: auto; outline: none; text-decoration: none; display: inline !important;" class="mcnImage" /></a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- SOCIAL ICONS -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageGroupBlock" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody class="mcnImageGroupBlockOuter">
                          <tr>
                            <td valign="top" style="mso-line-height-rule: exactly; padding: 9px" class="mcnImageGroupBlockInner">
                              <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                  <tr>
                                    <td valign="top" style="mso-line-height-rule: exactly; text-align: center;">
                                      <a href="https://www.linkedin.com/company/avendus/" target="_blank"><img alt="LinkedIn" src="${liImg}" width="24" style="border: 0; outline: none; text-decoration: none; display: inline !important; margin: 0 4px;" /></a>
                                      <a href="https://twitter.com/AvendusCapital" target="_blank"><img alt="Twitter" src="${twImg}" width="24" style="border: 0; outline: none; text-decoration: none; display: inline !important; margin: 0 4px;" /></a>
                                      <a href="https://www.instagram.com/avenduscapital/" target="_blank"><img alt="Instagram" src="${inImg}" width="24" style="border: 0; outline: none; text-decoration: none; display: inline !important; margin: 0 4px;" /></a>
                                      <a href="https://www.youtube.com/@AvendusCapital" target="_blank"><img alt="YouTube" src="${ytImg}" width="24" style="border: 0; outline: none; text-decoration: none; display: inline !important; margin: 0 4px;" /></a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- LEGAL PRIVACY FOOTER -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%">
                        <tbody class="mcnTextBlockOuter">
                          <tr>
                            <td valign="top" class="mcnTextBlockInner" style="mso-line-height-rule: exactly; padding-top: 9px">
                              <table align="left" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; max-width: 100%; min-width: 100%" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                  <tr>
                                    <td valign="top" class="mcnTextContent" style="mso-line-height-rule: exactly; padding-top: 0; padding-right: 18px; padding-bottom: 9px; padding-left: 18px; text-align: center; font-size: 11px; color: #777777;">
                                      To view our updated Privacy Notice, please <a href="https://www.avendus.com/india/privacy-policy" target="_blank" style="color: #777777; text-decoration: underline;">Click Here</a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
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

export function generateEmailerHtml(deal, options = {}) {
  if (!deal) return '';
  return TemplateGenerator.generateAvendus({
    folderName: deal.folder_name,
    brand: deal.brand_slug,
    title: deal.email_title,
    previewText: deal.preview_text,
    bannerUrl: deal.banner_url,
    content: deal.body_content,
    buttonLabel: deal.cta_text,
    buttonLink: deal.cta_url,
    signoffText: deal.signoff_text,
    signatureName: deal.signature_name,
    customDomain: deal.originUrl,
  }, options);
}

export const templateGenerator = TemplateGenerator;
export default TemplateGenerator;
