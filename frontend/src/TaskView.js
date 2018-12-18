import React from "react";

function TaskView(props) {
	const { task } = props;
	return (
		<article>
			<h3>{task.name}</h3>
			<p>{task.description || "No description"}</p>
		</article>
	);
}

export default TaskView;
