export const parseRecommendations = (recommendationText: string) => {
	const [promotion, pricing] = recommendationText
		.split("\n\n")
		.map((section) => section.replace(/^\*\*.*:\*\* /, ""))
	return { promotion, pricing }
}
