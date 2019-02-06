import React from "react";
import classes from "./Dialog.css";

function Dialog(props) {
	const { children, show } = props;

	const className = [classes.container, show && classes.open]
		.filter(Boolean)
		.join(" ");
	return <div className={className}>{children}</div>;
}

export default Dialog;
