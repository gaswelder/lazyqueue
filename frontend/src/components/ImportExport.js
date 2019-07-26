import React from "react";
import Tasks from "../tasks";
import Dialog from "./Dialog";
import classes from "./ImportExport.css";

function ImportForm(props) {
	const { onSubmit, onCancel } = props;
	const [val, setVal] = React.useState("");
	const data = Tasks.parseDump(val);

	const handleSubmit = e => {
		e.preventDefault();
		if (!data) return;
		onSubmit(data);
	};

	return (
		<form onSubmit={handleSubmit}>
			<textarea value={val} onChange={e => setVal(e.target.value)} />
			{data && (
				<p>
					version: {data.version}, entries: {data.list.length}
				</p>
			)}
			<button type="submit" disabled={!data}>
				Import
			</button>
			<button type="button" onClick={onCancel}>
				Cancel
			</button>
		</form>
	);
}

export default function ImportExport(props) {
	const { listID, onChange } = props;

	const [showImport, setShowImport] = React.useState(false);

	const handleImport = async data => {
		setShowImport(false);
		onChange(data.list);
	};

	return (
		<React.Fragment>
			<div className={classes.importExport}>
				<a href={Tasks.link(listID)}>Export</a>
				<a href="#" onClick={() => setShowImport(true)}>
					Import
				</a>
			</div>

			<Dialog show={showImport}>
				<ImportForm
					onSubmit={handleImport}
					onCancel={() => setShowImport(false)}
				/>
			</Dialog>
		</React.Fragment>
	);
}
