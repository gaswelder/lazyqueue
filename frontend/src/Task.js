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
	return (
		<div className={styles.task + (props.first ? " " + styles.first : "")}>
			{!props.first &&
				props.onTopClick && <IconButton text="▲" onClick={props.onTopClick} />}
			<span>{props.name}</span>
			{props.onDoneClick && (
				<IconButton
					className={styles.check}
					text="✓"
					onClick={props.onDoneClick}
				/>
			)}
			{props.onRemoveClick && (
				<IconButton
					className={styles.delete}
					text="×"
					onClick={props.onRemoveClick}
				/>
			)}
		</div>
	);
}
