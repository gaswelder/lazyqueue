import React from "react";
import classes from "./Dialog.css";

function Dialog(props) {
	const { children, onClose } = props;
	if (!children) {
		return <div className={classes.container} />;
	}
	return (
		<div className={[classes.container, classes.open].join(" ")}>
			{children}
			<div className={classes.footer}>
				<button type="button" onClick={onClose}>
					Close
				</button>
			</div>
		</div>
	);
}

export default Dialog;
