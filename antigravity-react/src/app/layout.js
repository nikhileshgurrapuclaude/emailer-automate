// MODULES //

// COMPONENTS //
import ScrollEffectWrapper from "@/components/scroll-effect-wrapper/ScrollEffectWrapper";

// SECTIONS //

// STYLES //
import "@/styles/globals/globals.scss";
import "@/styles/tailwind.css";

// DATA //
import defaultMetaData from "@/data/defaultMetaData";

// METADATA //
export const metadata = {
	metadataBase: new URL(process.env.DOMAIN_URL || "https://emailer-automate-antigravity-html.vercel.app"),
	title: defaultMetaData[0].title,
	description: defaultMetaData[0].description,
	keywords: defaultMetaData[0].keywords,
	openGraph: {
		images: defaultMetaData[0].ogImage.src,
	},
	icons: {
		icon: defaultMetaData[0].icon.src,
	},
	alternates: {
		canonical: "/",
	},
};

/** Root Layout */
export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<ScrollEffectWrapper />
				{children}
			</body>
		</html>
	);
}
