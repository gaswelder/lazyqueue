function toTimestamp(date) {
	if (!date) return null;
	return date.getTime();
}

function fromTimestamp(t) {
	if (!t) return null;
	return new Date(t);
}

function format(task) {
	const rec = Object.assign({}, task);
	rec.createdDate = toTimestamp(rec.createdDate);
	rec.finishedDate = toTimestamp(rec.finishedDate);
	return rec;
}

function parse(rec) {
	const task = Object.assign({}, rec);
	task.createdDate = fromTimestamp(task.createdDate);
	task.finishedDate = fromTimestamp(task.finishedDate);
	return task;
}

export default {
	update(list) {
		return fetch("/lists/foo", {
			method: "POST",
			body: JSON.stringify(list.map(format)),
			headers: {
				"Content-Type": "application/json"
			}
		});
	},

	make(name) {
		const id =
			Date.now().toString() + Math.round(Math.random() * 1e6).toString();
		return {
			id,
			name,
			createdDate: new Date(),
			finishedDate: null
		};
	},

	get() {
		return fetch("/lists/foo")
			.then(r => r.json())
			.then(list => list.map(parse));
	}
};
