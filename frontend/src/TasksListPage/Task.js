import React from "react";
import styles from "./Task.css";

function IconButton(props) {
	const className = [styles["icon-button"], props.className]
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
		<div className={styles.task + (first ? " " + styles.first : "")}>
			{!first && onTopClick && <IconButton text="▲" onClick={onTopClick} />}
			<IconButton text="▼" onClick={onDownClick} />
			{task.tag && <span className={styles.tag}>{task.tag}</span>}
			<span onClick={onOpen}>{task.name}</span>
			{onDoneClick && (
				<IconButton className={styles.check} text="✓" onClick={onDoneClick} />
			)}
			{onRemoveClick && (
				<IconButton
					className={styles.delete}
					text="×"
					onClick={onRemoveClick}
				/>
			)}
		</div>
	);
}
