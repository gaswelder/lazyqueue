import React from "react";

const matchesFilter = (filter, event) => {
	for (const [k, v] of Object.entries(filter)) {
		if (event[k] != v) {
			return false;
		}
	}
	return true;
};

export default function Hotkey(props) {
	const { filter, func } = props;

	React.useEffect(() => {
		const listener = event => {
			if (matchesFilter(filter, event)) {
				func(event);
			}
		};
		window.addEventListener("keyup", listener);
		return () => {
			window.removeEventListener("keyup", listener);
		};
	}, [filter]);

	return null;
}
