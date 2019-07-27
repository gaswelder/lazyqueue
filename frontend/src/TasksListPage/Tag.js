import React from "react";
import classes from "./index.css";
import sha1 from "sha1";

export default function Tag(props) {
	const { title, onClick } = props;

	const color = "#" + sha1(title).substr(0, 6);

	return (
		<span
			className={classes.tag}
			onClick={onClick}
			style={{ backgroundColor: color }}
		>
			{title}
		</span>
	);
}
