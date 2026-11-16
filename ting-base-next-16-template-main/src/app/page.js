// MODULES //

// COMPONENTS //
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";

// SECTIONS //

// PLUGINS //

// UTILS //

// STYLES //
import styles from "@/styles/pages/Home.module.scss";

// IMAGES //

// DATA //

// METADATA //

/** Home Page */
export default function HomePage() {
	return (
		<div>
			{/* Header */}
			<Header />

			{/* Page Content starts here */}
			<main className={`${styles.HomePage}`}>
				<div className="container">
					<h2 className="fadeInUp font-primary">
						This is ting base next.js template
					</h2>
					<p className="font-secondary">
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
					</p>
				</div>
			</main>
			{/* Page Content ends here */}

			{/* Footer */}
			<Footer />
		</div>
	);
}
