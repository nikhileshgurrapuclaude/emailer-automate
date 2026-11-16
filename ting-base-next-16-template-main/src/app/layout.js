// MODULES //

// COMPONENTS //
import ScrollEffectWrapper from "@/components/scroll-effect-wrapper/ScrollEffectWrapper";

// SECTIONS //

// PLUGINS //
import { Inter, Poppins } from "next/font/google";

// UTILS //

// STYLES //
import "@/styles/globals/globals.scss";
import "@/styles/tailwind.css";

// IMAGES //

// DATA //
import defaultMetaData from "@/data/defaultMetaData";

// FONT //
const poppins = Poppins({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	display: "swap",
	variable: "--font-primary",
});

const inter = Inter({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	display: "swap",
	variable: "--font-secondary",
});

// METADATA //
export const metadata = {
	metadataBase: new URL(process.env.DOMAIN_URL),
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
			<body className={`${poppins.variable} ${inter.variable}`}>
				<ScrollEffectWrapper />

				{children}
			</body>
		</html>
	);
}
