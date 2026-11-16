/** Get Details of Strapi media */
export const getStrapiMedia = (image) => {
	if (!image) return null;

	return {
		src: process.env.NEXT_PUBLIC_API_URL + image?.url || "",
		width: image?.width || null,
		height: image?.height || null,
		ext: image?.ext,
		mime: image?.mime,
	};
};
