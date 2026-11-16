// MODULES //
import fs from "fs";
import path from "path";

// SERVICES //

/** Generate dynamic sitemap */
export default async function sitemap() {
	const domainUrl = process.env.DOMAIN_URL || "https://domain.com";
	const appDir = path.join(process.cwd(), "src/app");
	const routes = [];
	const ignoreRoutes = ["/styleguide"];

	/** Add the root route */
	routes.push({
		url: `${domainUrl}/`,
		lastModified: new Date(),
		priority: 1.0,
	});

	/** Scan static routes */
	const generateStaticRoutes = (dir, baseUrl = "") => {
		const files = fs.readdirSync(dir);

		for (const file of files) {
			const fullPath = path.join(dir, file);
			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				// Ignore dynamic and special folders
				if (
					!file.startsWith("[") &&
					!file.startsWith("(") &&
					!file.startsWith("_")
				) {
					generateStaticRoutes(fullPath, `${baseUrl}/${file}`);
				}
			} else if (file === "page.js" || file === "page.tsx") {
				const route = baseUrl || "/";
				if (
					route !== "/" &&
					!route.includes("[") &&
					!ignoreRoutes.includes(route)
				) {
					routes.push({
						url: `${domainUrl}${route}`,
						lastModified: new Date(),
						priority: 0.8,
					});
				}
			}
		}
	};

	generateStaticRoutes(appDir);

	/** Fetch dynamic routes */
	// const blogData = await getBlogRequest();

	// // Generating routes for Blogs
	// const eventCategoryRoutes = blogData?.map((post) => ({
	// 	url: `${domainUrl}/${post.slug}`,
	// 	lastModified: new Date(),
	// 	priority: 0.8,
	// }));

	// Combine static + dynamic routes
	const allRoutes = [...routes];

	return allRoutes;
}
