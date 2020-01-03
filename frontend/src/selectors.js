const unique = xs => [...new Set(xs)];
export const getAllTags = tasks =>
	unique(tasks.map(t => t.tag).filter(t => t != undefined && t != ""));
