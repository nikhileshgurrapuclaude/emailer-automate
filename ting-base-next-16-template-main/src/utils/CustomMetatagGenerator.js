import defaultMetaData from "@/data/defaultMetaData";

/** Function to generate Custom Metadata */
export default function customGenerateMetadata({
	title,
	description,
	ogImage,
	url = "/",
	keywords,
}) {
	// Set the Meta Title
	const customTitle = title || defaultMetaData[0].title;
	// Set the Meta Description
	const customDescription = description || defaultMetaData[0].description;
	// Set the Meta OG Image
	const customImage = ogImage
		? `${process.env.API_URL}${ogImage.url}`
		: defaultMetaData[0].ogImage.src;

	return {
		title: customTitle,
		description: customDescription,
		metadataBase: new URL(process.env.DOMAIN_URL),
		...(url && {
			alternates: {
				canonical: url,
			},
		}),
		...(customImage && {
			openGraph: {
				images: customImage,
			},
		}),
		...(keywords && {
			keywords: keywords.split(","),
		}),
	};
}
