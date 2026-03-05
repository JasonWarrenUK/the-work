export interface TagResult {
	clear: boolean;
	classes: string[];
	mood: string | null;
}

/**
 * Process ink tags from a line.
 * Returns structured results for the renderer.
 */
export function processTags(tags: string[]): TagResult {
	const result: TagResult = {
		clear: false,
		classes: [],
		mood: null
	};

	for (const tag of tags) {
		const trimmed = tag.trim();

		if (trimmed === 'CLEAR') {
			result.clear = true;
			continue;
		}

		// #mood:tense — set atmospheric mood
		if (trimmed.startsWith('mood:')) {
			result.mood = trimmed.slice(5).trim();
			continue;
		}

		// #class:italic — add CSS class to paragraph
		if (trimmed.startsWith('class:')) {
			result.classes.push(trimmed.slice(6).trim());
			continue;
		}

		// Bare tags become CSS classes (Calico convention)
		result.classes.push(trimmed);
	}

	return result;
}
