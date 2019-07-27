import React from "react";
import classes from "./Task.css";

function IconButton(props) {
	const className = [classes["icon-button"], props.className]
		.filter(x => x)
		.join(" ");
	return (
		<button className={className} onClick={props.onClick}>
			{props.text}
		</button>
	);
}

export default function Task(props) {
	const {
		onOpen,
		onTopClick,
		onDownClick,
		onDoneClick,
		onRemoveClick,
		task,
		first
	} = props;

	return (
		<div className={classes.task + (first ? " " + classes.first : "")}>
			{!first && onTopClick && <IconButton text="▲" onClick={onTopClick} />}
			<IconButton text="▼" onClick={onDownClick} />
			<span onClick={onOpen}>
				{task.tag && <span className={classes.tag}>{task.tag}</span>}
				{task.name}
				{task.description && <span className={classes.more}>...</span>}
			</span>
			{onDoneClick && (
				<IconButton className={classes.check} text="✓" onClick={onDoneClick} />
			)}
			{onRemoveClick && (
				<IconButton
					className={classes.delete}
					text="×"
					onClick={onRemoveClick}
				/>
			)}
		</div>
	);
}
