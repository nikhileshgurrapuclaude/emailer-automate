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

  // Resolve base image URL - strictly canonical Vercel HTTPS link
  getImageUrl(brand, folderName, filename, customDomain = '') {
    const CANONICAL_ORIGIN = 'https://emailer-automate.vercel.app';
    let origin = CANONICAL_ORIGIN;
    if (customDomain && customDomain.trim()) {
      const cleanCustom = customDomain.trim().replace(/\/+$/, '');
      if (!cleanCustom.includes('localhost') && !cleanCustom.includes('127.0.0.1') && !cleanCustom.startsWith('file:')) {
        origin = cleanCustom;
      }
    }

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
      bannerPreviewUrl = '',
      bannerBase64 = '',
      content = '',
      buttonLabel = 'Know More',
      buttonLink = 'https://www.avendus.com',
      buttonRadius = '43px',
      buttonColor = '#cc1919',
      customDomain = ''
    } = data;

    const formattedContent = this.formatContent(content);
    const ctaLabel = (buttonLabel || '').trim() || 'Know More';
    const ctaHref = this.normalizeUrl(buttonLink) || 'https://www.avendus.com';
    const snippet = previewText ? previewText.trim() : title;
    const cleanBrand = (brand || 'avendus').toLowerCase();
    const cleanFolder = (folderName || 'deal_KSH_Group').trim();

    const isLivePreview = options.isLivePreview === true;
    const CANONICAL_ORIGIN = 'https://emailer-automate.vercel.app';

    // Strictly enforce canonical Vercel HTTPS origin - never allow localhost or relative local paths
    let origin = CANONICAL_ORIGIN;
    if (customDomain && customDomain.trim()) {
      const cleanCustom = customDomain.trim().replace(/\/+$/, '');
      if (!cleanCustom.includes('localhost') && !cleanCustom.includes('127.0.0.1') && !cleanCustom.startsWith('file:')) {
        origin = cleanCustom;
      }
    }

    // Always resolve images to canonical Vercel HTTPS links
    const resolveImg = (filename) => {
      return `${origin}/${cleanBrand}/${cleanFolder}/img/${filename}`;
    };

    // Banner image resolution - always proper Vercel HTTPS link in production/HTML/ZIP
    let bannerSrc;
    const cleanBannerFile = (bannerFilename || 'bannerNew.jpg').replace(/^\/+/, '');

    if (isLivePreview && (bannerPreviewUrl || bannerBase64)) {
      // Live preview iframe uses in-memory thumbnail to show instant upload preview
      bannerSrc = bannerPreviewUrl || bannerBase64;
    } else if (bannerUrl && bannerUrl.startsWith('/') && !bannerUrl.startsWith('/blob:')) {
      // Local path relative to root converted to full Vercel link
      bannerSrc = `${origin}${bannerUrl}`;
    } else if (bannerUrl && (bannerUrl.includes('localhost') || bannerUrl.includes('127.0.0.1'))) {
      // Old localhost link converted to full Vercel link
      const relPath = bannerUrl.replace(/^https?:\/\/[^/]+/, '');
      bannerSrc = `${origin}${relPath}`;
    } else if (bannerUrl && (bannerUrl.startsWith('http://') || bannerUrl.startsWith('https://')) && !bannerUrl.startsWith('blob:')) {
      bannerSrc = bannerUrl;
    } else if (bannerUrl && bannerUrl.trim().length > 0 && !bannerUrl.startsWith('data:') && !bannerUrl.startsWith('blob:')) {
      bannerSrc = `${origin}/${cleanBrand}/${cleanFolder}/img/${bannerUrl.replace(/^\/+/, '')}`;
    } else {
      bannerSrc = `${origin}/${cleanBrand}/${cleanFolder}/img/${cleanBannerFile}`;
    }

    const fallbackAttr = (isLivePreview && (bannerPreviewUrl || bannerBase64))
      ? ` data-fallback="${bannerPreviewUrl || bannerBase64}" onerror="if(this.dataset.fallback && this.src!==this.dataset.fallback){this.src=this.dataset.fallback;}"`
      : '';

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
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
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
      p {
        margin: 10px 0;
        padding: 0;
      }

      table {
        border-collapse: collapse;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        display: block;
        margin: 0;
        padding: 0;
      }

      img,
      a img {
        border: 0;
        height: auto;
        outline: none;
        text-decoration: none;
      }

      body,
      #bodyCell {
        height: 100%;
        margin: 0;
        padding: 0;
        width: 100%;
      }

      #bodyTable {
        height: 100%;
        margin: 0 auto;
        padding: 0;
        width: 100%;
        max-width: 600px;
      }

      .mcnPreviewText {
        display: none !important;
      }

      #outlook a {
        padding: 0;
      }

      img {
        -ms-interpolation-mode: bicubic;
      }

      table {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }

      .ReadMsgBody {
        width: 100%;
      }

      .ExternalClass {
        width: 100%;
      }

      p,
      a,
      li,
      td,
      blockquote {
        mso-line-height-rule: exactly;
      }

      a[href^="tel"],
      a[href^="sms"] {
        color: inherit;
        cursor: default;
        text-decoration: none;
      }

      p,
      a,
      li,
      td,
      body,
      table,
      blockquote {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }

      .ExternalClass,
      .ExternalClass p,
      .ExternalClass td,
      .ExternalClass div,
      .ExternalClass span,
      .ExternalClass font {
        line-height: 100%;
      }

      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      .templateContainer {
        max-width: 600px !important;
      }

      a.mcnButton {
        display: block;
      }

      .mcnImage,
      .mcnRetinaImage {
        vertical-align: bottom;
      }

      .mcnTextContent {
        word-break: break-word;
      }

      .mcnTextContent img {
        height: auto !important;
      }

      .mcnDividerBlock {
        table-layout: fixed !important;
      }

      /*
	@tab Page
	@section Heading 1
	@style heading 1
	*/
      h1 {
        /*@editable*/
        color: #222222;
        /*@editable*/
        font-family: Helvetica;
        /*@editable*/
        font-size: 40px;
        /*@editable*/
        font-style: normal;
        /*@editable*/
        font-weight: bold;
        /*@editable*/
        line-height: 150%;
        /*@editable*/
        letter-spacing: normal;
        /*@editable*/
        text-align: center;
      }

      /*
	@tab Page
	@section Heading 2
	@style heading 2
	*/
      h2 {
        /*@editable*/
        color: #222222;
        /*@editable*/
        font-family: Helvetica;
        /*@editable*/
        font-size: 34px;
        /*@editable*/
        font-style: normal;
        /*@editable*/
        font-weight: bold;
        /*@editable*/
        line-height: 150%;
        /*@editable*/
        letter-spacing: normal;
        /*@editable*/
        text-align: left;
      }

      /*
	@tab Page
	@section Heading 3
	@style heading 3
	*/
      h3 {
        /*@editable*/
        color: #444444;
        /*@editable*/
        font-family: Helvetica;
        /*@editable*/
        font-size: 22px;
        /*@editable*/
        font-style: normal;
        /*@editable*/
        font-weight: bold;
        /*@editable*/
        line-height: 150%;
        /*@editable*/
        letter-spacing: normal;
        /*@editable*/
        text-align: left;
      }

      /*
	@tab Page
	@section Heading 4
	@style heading 4
	*/
      h4 {
        /*@editable*/
        color: #949494;
        /*@editable*/
        font-family: Georgia;
        /*@editable*/
        font-size: 20px;
        /*@editable*/
        font-style: italic;
        /*@editable*/
        font-weight: normal;
        /*@editable*/
        line-height: 125%;
        /*@editable*/
        letter-spacing: normal;
        /*@editable*/
        text-align: left;
      }

      /*
	@tab Header
	@section Header Container Style
	*/
      #templateHeader {
        /*@editable*/
        background-color: #f7f7f7;
        /*@editable*/
        background-image: none;
        /*@editable*/
        background-repeat: no-repeat;
        /*@editable*/
        background-position: center;
        /*@editable*/
        background-size: cover;
        /*@editable*/
        border-top: 0;
        /*@editable*/
        border-bottom: 0;
        /*@editable*/
        padding-top: 0px;
        /*@editable*/
        padding-bottom: 0px;
      }

      /*
	@tab Header
	@section Header Interior Style
	*/
      .headerContainer {
        /*@editable*/
        background-color: #transparent;
        /*@editable*/
        background-image: none;
        /*@editable*/
        background-repeat: no-repeat;
        /*@editable*/
        background-position: center;
        /*@editable*/
        background-size: cover;
        /*@editable*/
        border-top: 0;
        /*@editable*/
        border-bottom: 0;
        /*@editable*/
        padding-top: 0;
        /*@editable*/
        padding-bottom: 0;
      }

      /*
	@tab Header
	@section Header Text
	*/
      .headerContainer .mcnTextContent,
      .headerContainer .mcnTextContent p {
        /*@editable*/
        color: #757575;
        /*@editable*/
        font-family: Helvetica;
        /*@editable*/
        font-size: 16px;
        /*@editable*/
        line-height: 150%;
        /*@editable*/
        text-align: left;
      }

      /*
	@tab Header
	@section Header Link
	*/
      .headerContainer .mcnTextContent a,
      .headerContainer .mcnTextContent p a {
        /*@editable*/
        color: #007c89;
        /*@editable*/
        font-weight: normal;
        /*@editable*/
        text-decoration: underline;
      }

      /*
	@tab Body
	@section Body Container Style
	*/
      #templateBody {
        /*@editable*/
        background-color: #ffffff;
        /*@editable*/
        background-image: none;
        /*@editable*/
        background-repeat: no-repeat;
        /*@editable*/
        background-position: center;
        /*@editable*/
        background-size: cover;
        /*@editable*/
        border-top: 0;
        /*@editable*/
        border-bottom: 0;
        /*@editable*/
        padding-top: 0px;
        /*@editable*/
        padding-bottom: 0px;
      }

      /*
	@tab Body
	@section Body Interior Style
	*/
      .bodyContainer {
        /*@editable*/
        background-color: #transparent;
        /*@editable*/
        background-image: none;
        /*@editable*/
        background-repeat: no-repeat;
        /*@editable*/
        background-position: center;
        /*@editable*/
        background-size: cover;
        /*@editable*/
        border-top: 0;
        /*@editable*/
        border-bottom: 0;
        /*@editable*/
        padding-top: 0;
        /*@editable*/
        padding-bottom: 0;
      }

      /*
	@tab Body
	@section Body Text
	*/
      .bodyContainer .mcnTextContent,
      .bodyContainer .mcnTextContent p {
        /*@editable*/
        color: #757575;
        /*@editable*/
        font-family: Helvetica;
        /*@editable*/
        font-size: 16px;
        /*@editable*/
        line-height: 150%;
        /*@editable*/
        text-align: left;
      }

      /*
	@tab Body
	@section Body Link
	*/
      .bodyContainer .mcnTextContent a,
      .bodyContainer .mcnTextContent p a {
        /*@editable*/
        color: #007c89;
        /*@editable*/
        font-weight: normal;
        /*@editable*/
        text-decoration: underline;
      }

      /*
	@tab Footer
	@section Footer Style
	*/
      #templateFooter {
        /*@editable*/
        background-color: #transparent;
        /*@editable*/
        background-image: none;
        /*@editable*/
        background-repeat: no-repeat;
        /*@editable*/
        background-position: center;
        /*@editable*/
        background-size: cover;
        /*@editable*/
        border-top: 0;
        /*@editable*/
        border-bottom: 0;
        /*@editable*/
        padding-top: 51px;
        /*@editable*/
        padding-bottom: 51px;
      }

      /*
	@tab Footer
	@section Footer Interior Style
	*/
      .footerContainer {
        /*@editable*/
        background-color: transparent;
        /*@editable*/
        background-image: none;
        /*@editable*/
        background-repeat: no-repeat;
        /*@editable*/
        background-position: center;
        /*@editable*/
        background-size: cover;
        /*@editable*/
        border-top: 0;
        /*@editable*/
        border-bottom: 0;
        /*@editable*/
        padding-top: 0;
        /*@editable*/
        padding-bottom: 0;
      }

      /*
	@tab Footer
	@section Footer Text
	*/
      .footerContainer .mcnTextContent,
      .footerContainer .mcnTextContent p {
        /*@editable*/
        color: #ffffff;
        /*@editable*/
        font-family: Helvetica;
        /*@editable*/
        font-size: 12px;
        /*@editable*/
        line-height: 150%;
        /*@editable*/
        text-align: center;
      }

      /*
	@tab Footer
	@section Footer Link
	*/
      .footerContainer .mcnTextContent a,
      .footerContainer .mcnTextContent p a {
        /*@editable*/
        color: #ffffff;
        /*@editable*/
        font-weight: normal;
        /*@editable*/
        text-decoration: underline;
      }

      @media only screen and (min-width: 768px) {
        .templateContainer {
          width: 600px !important;
        }
      }

      @media only screen and (max-width: 480px) {
        body,
        table,
        td,
        p,
        a,
        li,
        blockquote {
          -webkit-text-size-adjust: none !important;
        }
      }

      @media only screen and (max-width: 480px) {
        body {
          width: 100% !important;
          min-width: 100% !important;
        }
      }

      @media only screen and (max-width: 480px) {
        .mcnRetinaImage {
          max-width: 100% !important;
        }
      }

      @media only screen and (max-width: 480px) {
        .mcnImage {
          width: 100% !important;
        }
      }

      @media only screen and (max-width: 480px) {
        .mcnCartContainer,
        .mcnCaptionTopContent,
        .mcnRecContentContainer,
        .mcnCaptionBottomContent,
        .mcnTextContentContainer,
        .mcnBoxedTextContentContainer,
        .mcnImageGroupContentContainer,
        .mcnCaptionLeftTextContentContainer,
        .mcnCaptionRightTextContentContainer,
        .mcnCaptionLeftImageContentContainer,
        .mcnCaptionRightImageContentContainer,
        .mcnImageCardLeftTextContentContainer,
        .mcnImageCardRightTextContentContainer,
        .mcnImageCardLeftImageContentContainer,
        .mcnImageCardRightImageContentContainer {
          max-width: 100% !important;
          width: 100% !important;
        }
      }

      @media only screen and (max-width: 480px) {
        .mcnBoxedTextContentContainer {
          min-width: 100% !important;
        }
      }

      @media only screen and (max-width: 480px) {
        .mcnImageGroupContent {
          padding: 9px !important;
        }
      }

      @media only screen and (max-width: 480px) {
        .mcnCaptionLeftContentOuter .mcnTextContent,
        .mcnCaptionRightContentOuter .mcnTextContent {
          padding-top: 9px !important;
        }
      }

      @media only screen and (max-width: 480px) {
        .mcnImageCardTopImageContent,
        .mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,
        .mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent {
          padding-top: 18px !important;
        }
      }

      @media only screen and (max-width: 480px) {
        .mcnImageCardBottomImageContent {
          padding-bottom: 9px !important;
        }
      }

      @media only screen and (max-width: 480px) {
        .mcnImageGroupBlockInner {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
      }

      @media only screen and (max-width: 480px) {
        .mcnImageGroupBlockOuter {
          padding-top: 9px !important;
          padding-bottom: 9px !important;
        }
      }

      @media only screen and (max-width: 480px) {
        .mcnTextContent,
        .mcnBoxedTextContentColumn {
          padding-right: 18px !important;
          padding-left: 18px !important;
        }
      }

      @media only screen and (max-width: 480px) {
        .mcnImageCardLeftImageContent,
        .mcnImageCardRightImageContent {
          padding-right: 18px !important;
          padding-bottom: 0 !important;
          padding-left: 18px !important;
        }
      }

      @media only screen and (max-width: 480px) {
        .mcpreview-image-uploader {
          display: none !important;
          width: 100% !important;
        }
      }

      @media only screen and (max-width: 480px) {
        /*
	@tab Mobile Styles
	@section Heading 1
	@tip Make the first-level headings larger in size for better readability on small screens.
	*/
        h1 {
          /*@editable*/
          font-size: 30px !important;
          /*@editable*/
          line-height: 125% !important;
        }
      }

      @media only screen and (max-width: 480px) {
        /*
	@tab Mobile Styles
	@section Heading 2
	@tip Make the second-level headings larger in size for better readability on small screens.
	*/
        h2 {
          /*@editable*/
          font-size: 26px !important;
          /*@editable*/
          line-height: 125% !important;
        }
      }

      @media only screen and (max-width: 480px) {
        /*
	@tab Mobile Styles
	@section Heading 3
	@tip Make the third-level headings larger in size for better readability on small screens.
	*/
        h3 {
          /*@editable*/
          font-size: 20px !important;
          /*@editable*/
          line-height: 150% !important;
        }
      }

      @media only screen and (max-width: 480px) {
        /*
	@tab Mobile Styles
	@section Heading 4
	@tip Make the fourth-level headings larger in size for better readability on small screens.
	*/
        h4 {
          /*@editable*/
          font-size: 18px !important;
          /*@editable*/
          line-height: 150% !important;
        }
      }

      @media only screen and (max-width: 480px) {
        /*
	@tab Mobile Styles
	@section Boxed Text
	@tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.
	*/
        .mcnBoxedTextContentContainer .mcnTextContent,
        .mcnBoxedTextContentContainer .mcnTextContent p {
          /*@editable*/
          font-size: 14px !important;
          /*@editable*/
          line-height: 150% !important;
        }
      }

      @media only screen and (max-width: 480px) {
        /*
	@tab Mobile Styles
	@section Header Text
	@tip Make the header text larger in size for better readability on small screens.
	*/
        .headerContainer .mcnTextContent,
        .headerContainer .mcnTextContent p {
          /*@editable*/
          font-size: 16px !important;
          /*@editable*/
          line-height: 150% !important;
        }
      }

      @media only screen and (max-width: 480px) {
        /*
	@tab Mobile Styles
	@section Body Text
	@tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.
	*/
        .bodyContainer .mcnTextContent,
        .bodyContainer .mcnTextContent p {
          /*@editable*/
          font-size: 16px !important;
          /*@editable*/
          line-height: 150% !important;
        }
      }

      @media only screen and (max-width: 480px) {
        /*
	@tab Mobile Styles
	@section Footer Text
	@tip Make the footer content text larger in size for better readability on small screens.
	*/
        .footerContainer .mcnTextContent,
        .footerContainer .mcnTextContent p {
          /*@editable*/
          font-size: 14px !important;
          /*@editable*/
          line-height: 150% !important;
        }
      }
    </style>
  </head>

  <body>
    <!--*|IF:MC_PREVIEW_TEXT|*-->
    <!--[if !gte mso 9]><!----><span
      class="mcnPreviewText"
      style="
        display: none;
        font-size: 0px;
        line-height: 0px;
        max-height: 0px;
        max-width: 0px;
        opacity: 0;
        overflow: hidden;
        visibility: hidden;
        mso-hide: all;
      "
      >
      ${this.escapeHtml(snippet)}
    </span>
    <!--<![endif]-->
    <!--*|END:IF|*-->
    <center>
      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        height="100%"
        width="100%"
        id="bodyTable"
        style="max-width: 600px; margin: 0 auto;"
      >
        <tr>
          <td align="center" valign="top" id="bodyCell">
            <!-- BEGIN TEMPLATE // -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
              <tr>
                <td
                  align="center"
                  valign="top"
                  id="templateHeader"
                  data-template-container
                >
                  <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    class="templateContainer"
                  >
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
                <td
                  align="center"
                  valign="top"
                  id="templateBody"
                  data-template-container
                >
                  <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    class="templateContainer"
                  >
                    <tr>
                      <td valign="top" class="bodyContainer">
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          class="mcnImageBlock"
                          style="min-width: 100%"
                        >
                          <tbody class="mcnImageBlockOuter">
                            <tr>
                              <td
                                valign="top"
                                style="padding: 0px"
                                class="mcnImageBlockInner"
                              >
                                <table
                                  align="left"
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="mcnImageContentContainer"
                                  style="min-width: 100%"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="mcnImageContent"
                                        valign="top"
                                        style="
                                          padding-right: 0px;
                                          padding-left: 0px;
                                          padding-top: 0;
                                          padding-bottom: 0;
                                          text-align: center;
                                        "
                                      >
                                        <img align="center" alt="${this.escapeHtml(title)}" src="${bannerSrc}"${fallbackAttr}
                                          width="600"
                                          style="
                                            max-width: 1000px;
                                            padding-bottom: 0;
                                            display: inline !important;
                                            vertical-align: bottom;
                                          "
                                          class="mcnImage" />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          class="mcnDividerBlock"
                          style="min-width: 100%"
                        >
                          <tbody class="mcnDividerBlockOuter">
                            <tr>
                              <td
                                class="mcnDividerBlockInner"
                                style="min-width: 100%; padding: 5px 18px"
                              >
                                <table
                                  class="mcnDividerContent"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  style="
                                    min-width: 100%;
                                    border-top: 2px solid #eaeaea;
                                  "
                                >
                                  <tbody>
                                    <tr>
                                      <td>
                                        <span></span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          class="mcnTextBlock"
                          style="min-width: 100%"
                        >
                          <tbody class="mcnTextBlockOuter">
                            <tr>
                              <td
                                valign="top"
                                class="mcnTextBlockInner"
                                style="padding-top: 9px"
                              >
                                <!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->

                                <!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                                <table
                                  align="left"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  style="max-width: 100%; min-width: 100%"
                                  width="100%"
                                  class="mcnTextContentContainer"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        valign="top"
                                        class="mcnTextContent"
                                        style="
                                          padding: 0px 18px 9px;
                                          line-height: 125%;
                                        "
                                      >
                                        ${formattedContent}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <!--[if mso]>
				</td>
				<![endif]-->

                                <!--[if mso]>
				</tr>
				</table>
				<![endif]-->
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          class="mcnButtonBlock"
                          style="min-width: 100%"
                        >
                          <tbody class="mcnButtonBlockOuter">
                            <tr>
                              <td
                                style="
                                  padding-top: 0;
                                  padding-right: 18px;
                                  padding-bottom: 18px;
                                  padding-left: 18px;
                                "
                                valign="top"
                                align="center"
                                class="mcnButtonBlockInner"
                              >
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="mcnButtonContentContainer"
                                  style="
                                    border-collapse: separate !important;
                                    
                                    background-color: ${buttonColor}; border-radius: ${buttonRadius};
                                  "
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        align="center"
                                        valign="middle"
                                        class="mcnButtonContent"
                                        style="
                                          font-family: Arial;
                                          font-size: 18px;
                                          padding: 13px;
                                        "
                                      >
                                        <a
                                          class="mcnButton"
                                          title="${this.escapeHtml(ctaLabel)}"
                                          href="${this.escapeHtml(ctaHref)}"
                                          target="_blank"
                                          style="
                                            font-weight: bold;
                                            letter-spacing: normal;
                                            line-height: 100%;
                                            text-align: center;
                                            text-decoration: none;
                                            color: #ffffff;
                                          "
                                          >${this.escapeHtml(ctaLabel)}</a
                                        >
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          class="mcnImageBlock"
                          style="min-width: 100%"
                        >
                          <tbody class="mcnImageBlockOuter">
                            <tr>
                              <td
                                valign="top"
                                style="padding: 0px"
                                class="mcnImageBlockInner"
                              >
                                <table
                                  align="left"
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="mcnImageContentContainer"
                                  style="min-width: 100%"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="mcnImageContent"
                                        valign="top"
                                        style="
                                          padding-right: 0px;
                                          padding-left: 0px;
                                          padding-top: 0;
                                          padding-bottom: 0;
                                          text-align: center;
                                        "
                                      >
                                        <a
                                          href="http://www.avendus.com"
                                          title
                                          class
                                          target="_blank"
                                        >
                                          <img
                                            align="center"
                                            alt
                                            src="${sigImg}"
                                            width="600"
                                            style="
                                              max-width: 1000px;
                                              padding-bottom: 0;
                                              display: inline !important;
                                              vertical-align: bottom;
                                            "
                                            class="mcnImage"
                                          />
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          class="mcnImageBlock"
                          style="min-width: 100%"
                        >
                          <tbody class="mcnImageBlockOuter">
                            <tr>
                              <td valign="top" class="mcnImageBlockInner">
                                <table
                                  align="left"
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="mcnImageContentContainer"
                                  style="min-width: 100%"
                                >
                                  <tbody>
                                    <tr>
                                      <td style="width: 86px">
                                        <a
                                          href="https://www.avendus.com/india/about-us"
                                          target="_blank"
                                        >
                                          <img
                                            src="${aboutImg}"
                                            style="display: block"
                                            height="28"
                                            width="86"
                                        /></a>
                                      </td>
                                      <td style="width: 103px">
                                        <a
                                          href="https://www.avendus.com/india/asset-management"
                                          target="_blank"
                                        >
                                          <img
                                            src="${amImg}"
                                            style="display: block"
                                            height="28"
                                            width="103"
                                        /></a>
                                      </td>
                                      <td style="width: 85px">
                                        <a
                                          href="https://www.avendus.com/india/credit-solutions"
                                          target="_blank"
                                          ><img
                                            src="${csImg}"
                                            style="display: block"
                                            height="28"
                                            width="85"
                                          />
                                        </a>
                                      </td>
                                      <td style="width: 106px">
                                        <a
                                          href="https://www.avendus.com/india/investment-banking"
                                          target="_blank"
                                        >
                                          <img
                                            src="${ibImg}"
                                            style="display: block"
                                            height="28"
                                            width="106"
                                        /></a>
                                      </td>
                                      <td style="width: 107px">
                                        <a
                                          href="https://www.avendus.com/india/institutional-equities"
                                          target="_blank"
                                        >
                                          <img
                                            src="${ieImg}"
                                            style="display: block"
                                            height="28"
                                            width="107"
                                        /></a>
                                      </td>
                                      <td style="width: 113px">
                                        <a
                                          href="https://www.avendus.com/india/wealth-management"
                                          target="_blank"
                                        >
                                          <img
                                            src="${wmImg}"
                                            style="display: block"
                                            height="28"
                                            width="113"
                                        /></a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          class="mcnImageBlock"
                          style="min-width: 100%"
                        >
                          <tbody class="mcnImageBlockOuter">
                            <tr>
                              <td
                                valign="top"
                                style="padding-top: 30px; padding-bottom: 30px"
                                class="mcnImageBlockInner"
                              >
                                <table
                                  align="left"
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="mcnImageContentContainer"
                                  style="min-width: 100%"
                                >
                                  <tbody>
                                    <tr>
                                      <td style="width: 200px"></td>
                                      <td style="width: 50px">
                                        <a
                                          href="http://www.linkedin.com/company/avendus"
                                          target="_blank"
                                        >
                                          <img
                                            src="${liImg}"
                                            style="display: block"
                                            height="24"
                                            width="24"
                                        /></a>
                                      </td>
                                      <td style="width: 50px">
                                        <a
                                          href="http://www.twitter.com/avendus"
                                          target="_blank"
                                        >
                                          <img
                                            src="${twImg}"
                                            style="display: block"
                                            height="24"
                                            width="24"
                                        /></a>
                                      </td>
                                      <td style="width: 50px">
                                        <a
                                          href="http://instagram.com/avendusgroup"
                                          target="_blank"
                                          ><img
                                            src="${inImg}"
                                            style="display: block"
                                            height="24"
                                            width="24"
                                          />
                                        </a>
                                      </td>
                                      <td style="width: 50px">
                                        <a
                                          href="https://www.youtube.com/channel/UCIcPdtsCqcRYfYf0s-wMB_Q/featured"
                                          target="_blank"
                                        >
                                          <img
                                            src="${ytImg}"
                                            style="display: block"
                                            height="24"
                                            width="24"
                                        /></a>
                                      </td>
                                      <td style="width: 200px"></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          class="mcnTextBlock"
                          style="min-width: 100%"
                        >
                          <tbody class="mcnTextBlockOuter">
                            <tr>
                              <td
                                valign="top"
                                class="mcnTextBlockInner"
                                style="padding-top: 9px"
                              >
                                <!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->

                                <!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                                <table
                                  align="left"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  style="max-width: 100%; min-width: 100%"
                                  width="100%"
                                  class="mcnTextContentContainer"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        valign="top"
                                        class="mcnTextContent"
                                        style="
                                          padding-top: 0;
                                          padding-right: 18px;
                                          padding-bottom: 9px;
                                          padding-left: 18px;
                                        "
                                      >
                                        <span style="font-size: 12px"
                                          >To view our updated Privacy Notice,
                                          please </span
                                        ><a
                                          href="https://www.avendus.com/india/privacy-policy"
                                          target="_blank"
                                          ><span style="font-size: 12px"
                                            >Click Here</span
                                          ></a
                                        >
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <!--[if mso]>
				</td>
				<![endif]-->

                                <!--[if mso]>
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
                <td
                  align="center"
                  valign="top"
                  id="templateFooter"
                  data-template-container
                >
                  <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    class="templateContainer"
                  >
                    <tr>
                      <td valign="top" class="footerContainer"></td>
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
</html>
`;
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

  // Make a CTA link usable in email clients: trim it, add https:// when the scheme is missing
  // (e.g. "www.avendus.com"), and drop javascript:/data: links.
  normalizeUrl(url) {
    const raw = String(url || '').trim();
    if (!raw) return '';
    if (/^(javascript|data|vbscript):/i.test(raw)) return '';
    if (/^(https?:|mailto:|tel:)/i.test(raw)) return raw;
    if (raw.startsWith('//')) return `https:${raw}`;
    return `https://${raw.replace(/^\/+/, '')}`;
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
    folderName: deal.folder_name || deal.folderName,
    brand: deal.brand_slug || deal.brand,
    title: deal.email_title || deal.title,
    previewText: deal.preview_text || deal.previewText,
    bannerUrl: deal.banner_url || deal.bannerUrl,
    bannerFilename: deal.banner_filename || deal.bannerFilename || 'bannerNew.jpg',
    bannerPreviewUrl: deal.banner_preview_url || deal.bannerPreviewUrl,
    bannerBase64: deal.banner_base64 || deal.bannerBase64,
    content: deal.body_content || deal.content,
    buttonLabel: deal.cta_text || deal.buttonLabel,
    buttonLink: deal.cta_url || deal.buttonLink,
    buttonColor: deal.buttonColor || undefined,
    buttonRadius: deal.buttonRadius || undefined,
    signoffText: deal.signoff_text,
    signatureName: deal.signature_name,
    customDomain: deal.originUrl,
  }, options);
}

export const templateGenerator = TemplateGenerator;
export default TemplateGenerator;
