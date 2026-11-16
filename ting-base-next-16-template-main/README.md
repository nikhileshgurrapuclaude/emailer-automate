# Next.js Template README

This template provides a structured starting point for your Next.js project.

## Folder Structure

- **public**: Publicly accessible files.
  - **img**: Image assets.
    - **icons**: Store all svg icons of your project here.
  - **fonts**: Font files.
  - **videos**: Video files.
- **src**: Source code.
  - **app**: Contains Next.js pages and API routes.
    - **api**: API endpoints.
  - **components**: Reusable React components.
  - **sections**: Specific sections or parts of your pages.
  - **styles**: Stylesheets and styling-related files.
  - **data**: Data files or mocks.
  - **utils**: Utility functions and helper modules.
- **scripts**: Custom scripts for project setup or automation.
  - **createPage.js**: Script to create new pages.
  - **createComponent.js**: Script to generate new components.
  - **createSection.js**: Script to scaffold new sections.
- **.env.example**: Example environment variables file.
- **package.json**: Node.js dependencies and project configuration.
- **next.config.json**: Next.js configuration.

## Getting Started

1. Clone this repository.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

## Custom Scripts

Custom scripts in the `scripts` folder can be used to streamline certain tasks.

1. **To create Components** - `npm run create-component component-name`  
   The Component name should be in Lowercase and can have Hyphens(-) but no Underscores(\_) for eg:  
   `npm run create-component button` or  
   `npm run create-component inner-page-banner`

2. **To create Sections** - `npm run create-section section-name`  
   The Section name should be in Lowercase and can have Hyphens(-) but no Underscores(\_) for eg:  
   `npm run create-section home-hero` or  
   `npm run create-section who-we-are-mission`

3. **To create Pages** - `npm run create-page page-name`  
   The Page name should be in Lowercase and can have Hyphens(-) but no Underscores(\_) for eg:  
   `npm run create-page about` or  
   `npm run create-page who-we-are`

## Predefined Components

1. **Button.js** - Buttons used in the project

2. **ContentFromCms.js** - Use this components to render RichText / HTML coming from backend or any API or if you want to pass static HTML. For example:  
   `<ContentFromCms>{data.desc}</ContentFromCms>`  
   `<ContentFromCms>{"<p>Hello</p><p>Brother</p>"}</ContentFromCms>`

3. **Footer.js** - Footer of the project

4. **Header.js** - Header of the project

## Utils

Utils are just small helper functions that you might require in lot of places and you dont want to write it everywhere. Some of these functions are

1. **EqualHeight.js** - If you want to make height of 2 or more elements equal you can use this function. You can pass class of the element as an argument. For example:  
   `EqualHeight("list_item")` - Here list_item is the class name of the element

2. **RequestHeaders.js** - The `RequestHeaders.js` file, serves as a centralized location for defining request headers used in server-side and client-side API calls within the project.

   **For Server-side api call**  
   `const res = await fetch(API_URL, ServerHeaders); const data = await res.json();`

   **For Client-side api call**  
   `const res = await fetch(API_URL, ClientHeaders); const data = await res.json();`

3. **CustomMetatagGenerator.js** - The `CustomMetatagGenerator.js` file, can be used for generating metetags of dynamic Pages

   **For Eg. /blogs/[slug]/page.js**

   ```
   // METADATA //
   /** Generate dynamic metadata */
   export async function generateMetadata({ params }) {
      const { slug } = await params;
      const slugRes = await getDataFromBackend(slug);
      const metaData = slugRes?.data?.[0];
      const metas = metaData?.metas;

      return customGenerateMetadata({
         title: metas?.metaTitle || metaData?.title,
         description: metas?.metaDescription || metaData?.short_description || "",
         ogImage: metas?.shareImage || metaData?.thumbnail_image?.[0],
         keywords: metas?.keywords,
         url: `/path/to/${slug}`,
      });
   }
   ```

4. **FormatDate.js** - The `FormatDate.js` file, can be used to format date that is coming from backend.

   Converts `12-01-2025` to `Jan 12, 2025`

   `<p>{formatDate("12-01-2025")}</p>`

5. **GetStrapiMedia.js** - The `GetStrapiMedia.js` file, can be used wherever the image is coming from backend.

   Instead of always concating `process.env.NEXT_PUBLIC_API_URL` with the backend image path we can directly use this function.

   So Instead of using:

   `<Image src={process.env.NEXT_PUBLIC_API_URL + item.thumbnail_image.url} width={item.thumbnail_image.width} height={item.thumbnail_image.height} alt="" />`

   You can just use

   `<Image src={getStrapiMedia(item.thumbnail_image)} alt=""/>`

   OR

   `<img src={getStrapiMedia(item.thumbnail_image).src} alt="" />`

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your environment-specific variables.

## Additional Information

Feel free to modify and expand upon this template to suit your project's needs.

```

```
