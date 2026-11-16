"use client";
// MODULES //

// COMPONENTS //
import Modal, { openModal } from "@/components/modal/Modal";
import InnerBanner from "@/components/inner-banner/InnerBanner";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTitle,
} from "@/components/accordian/Accordian";
import Button from "@/components/button/Button";

// SECTIONS //

// PLUGINS //

// UTILS //

// STYLES //
import styles from "./Styleguide.module.scss";

// IMAGES //

// DATA //
import accordianData from "@/data/accordianData.json";

/** Styleguide Page */
const StyleGuide = () => {
	return (
		<div className={styles.styleguide}>
			{/* ============ InnerBanner ================ */}
			<h2 className="text_xxxxl font-primary">InnerBanner</h2>
			<section>
				<InnerBanner
					bannerTitle={"About Us"}
					bannerDescription={"About Us Description"}
					desktopImage=""
					mobileImage=""
				/>
			</section>

			{/* ============ Accordian ================ */}
			<h2 className="text_xxxxl font-primary fadeInUp">Accordian</h2>
			<section>
				<Accordion>
					{/* Accordian Items using json */}
					{accordianData.map((data, index) => (
						<AccordionItem key={index}>
							<AccordionTitle>{data.title}</AccordionTitle>
							<AccordionContent>{data.description}</AccordionContent>
						</AccordionItem>
					))}
					{/* Accordian Items using Static content */}
					<AccordionItem>
						<AccordionTitle>Test Accordian title</AccordionTitle>
						<AccordionContent>
							<h1>Test Accordian Content</h1>
							<p>
								Learn how to implement accordions using JavaScript, including event
								handling, DOM manipulation, and integrating with front-end frameworks
								like React or Vue.js.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</section>

			{/* ============ Fonts ================ */}
			<h2 className="text_xxxxl font-primary fadeInUp">Fonts</h2>
			<section className="fadeInUp">
				<p className="text_xxxxl font-primary">86 - paytone font</p>
			</section>

			{/* ============ Modal ================ */}
			<h2 className="text_xxxxl font-primary fadeInUp">Modal</h2>
			<section className="fadeInUp">
				<div className="btn_event_box" onClick={() => openModal("demo")}>
					<Button color="secondary" variant="filled" shape="rounded">
						Open Modal
					</Button>
				</div>
				<Modal id={"demo"}>
					<h1>Hello</h1>
				</Modal>
			</section>

			{/* ============ Button ================ */}
			<h2 className="text_xxxxl font-primary">Buttons</h2>
			<section className="fadeInUp">
				<div className={styles.color_palette}>
					<div className={styles.btn_box}>
						<Button color="primary" variant="filled" shape="rounded">
							Read More
						</Button>
						<Button color="primary" variant="filled" shape="squared">
							Read More
						</Button>
						<Button color="primary" variant="filled">
							Read More
						</Button>
					</div>
				</div>
				<div className={styles.color_palette}>
					<div className={styles.btn_box}>
						<Button color="secondary" variant="filled" shape="rounded">
							Read More
						</Button>
						<Button color="secondary" variant="filled" shape="squared">
							Read More
						</Button>
						<Button color="secondary" variant="filled">
							Read More
						</Button>
					</div>
				</div>
				<div className={styles.color_palette}>
					<div className={styles.btn_box}>
						<Button color="primary" variant="outlined" shape="rounded">
							Read More
						</Button>
						<Button color="primary" variant="outlined" shape="squared">
							Read More
						</Button>
						<Button color="primary" variant="outlined">
							Read More
						</Button>
					</div>
				</div>
				<div className={styles.color_palette}>
					<div className={styles.btn_box}>
						<Button color="secondary" variant="outlined" shape="rounded">
							Read More
						</Button>
						<Button color="secondary" variant="outlined" shape="squared">
							Read More
						</Button>
						<Button color="secondary" variant="outlined">
							Read More
						</Button>
					</div>
				</div>
				<div className={styles.color_palette}>
					<div className={styles.btn_box}>
						<Button color="secondary" variant="underline">
							Read More
						</Button>
						<Button color="primary" variant="underline">
							Read More
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default StyleGuide;
