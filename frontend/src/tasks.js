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

const versions = {};

export default {
	async update(id, list) {
		if (!versions[id]) versions[id] = 0;

		const version = versions[id] + 1;
		const data = {
			list: list.map(format),
			version
		};

		const r = await fetch("/lists/" + id, {
			method: "PUT",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json"
			}
		});
		if (r.status == 409) {
			throw new Error("the list is out of sync (do a refresh)");
		}
		if (r.status != 200) {
			const data = await r.text();
			throw new Error(r.statusText + ": " + data);
		}
		versions[id] = Math.max(versions[id], version);
	},

	make(name, description, tag) {
		const id =
			Date.now().toString() + Math.round(Math.random() * 1e6).toString();
		return {
			id,
			name,
			description,
			tag,
			createdDate: new Date(),
			finishedDate: null
		};
	},

	parseDump(string) {
		let data;
		try {
			data = JSON.parse(string);
		} catch (e) {
			return null;
		}
		if (!data.list || !data.version) {
			return null;
		}
		return {
			version: data.version,
			list: data.list.map(parse)
		};
	},

	link(id) {
		return "/lists/" + id;
	},

	get(id) {
		return fetch(this.link(id))
			.then(r => r.json())
			.then(function(data) {
				versions[id] = data.version;
				return data.list.map(parse);
			});
	}
};
