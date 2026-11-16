// MODULES //

// COMPONENTS //
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";

// SECTIONS //

// STYLES //
import styles from "./Blogs.module.scss";

// DATA //

// METADATA //
export const metadata = {
	metadataBase: new URL(process.env.DOMAIN_URL),
	title: "Blogs",
	description: "",
	alternates: {
		canonical: "/blogs",
	},
};

/** Blogs Page */
export default function BlogsPage() {
	return (
		<div>
			{/* Header */}
			<Header />

			{/* Page Content starts here */}
			<main className={styles.BlogsPage}>
				<h1>Blogs</h1>
			</main>
			{/* Page Content ends here */}

			{/* Footer */}
			<Footer />
		</div>
	);
}
