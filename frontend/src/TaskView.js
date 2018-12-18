import React from "react";
import classes from "./TaskView.css";

function TaskView(props) {
	const { task, onClose } = props;
	if (!task) {
		return <div className={classes.container} />;
	}
	return (
		<div className={[classes.container, classes.open].join(" ")}>
			<article>
				<h3>{task.name}</h3>
				<p>{task.description || "No description"}</p>
			</article>
			<div>
				<button type="button" onClick={onClose}>
					OK
				</button>
			</div>
		</div>
	);
}

export default TaskView;
