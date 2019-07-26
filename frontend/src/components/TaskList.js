import React from "react";
import foo from "../tasks.css";
import Task from "../Task";

export default function TaskList(props) {
	const { tasks, onChange, onView } = props;

	const [active, done] = tasks.reduce(
		function(s, task) {
			if (task.finishedDate) {
				return [s[0], s[1].concat([task])];
			}
			return [s[0].concat([task]), s[1]];
		},
		[[], []]
	);

	const moveToTop = task => {
		// If there are one or zero tasks, nothing to do.
		if (tasks.length < 2) {
			return;
		}

		// Move task in the second place (keeping the top task intact),
		// unless the task is in the second place already. If it's in the
		// second place, put it in the first place.
		const isSecond = tasks.findIndex(t => t.id == task.id) == 1;
		const rest = tasks.filter(t => t.id != task.id);
		const newList = isSecond
			? [task, ...rest]
			: [rest[0], task, ...rest.slice(1)];
		onChange(newList);
	};

	const moveToBottom = task => {
		const rest = tasks.filter(t => t.id != task.id);
		onChange([...rest, task]);
	};

	const remove = task => {
		if (!confirm(`This will remove task "${task.name}"`)) {
			return;
		}
		onChange(tasks.filter(t => t.id != task.id));
	};

	const close = task => {
		const newTasks = tasks.map(function(t) {
			if (t.id == task.id) {
				t = Object.assign({}, t, { finishedDate: new Date() });
			}
			return t;
		});
		onChange(newTasks);
	};

	const open = task => {
		const restored = Object.assign({}, task, { finishedDate: null });
		const newTasks = [restored, ...tasks.filter(t => t.id != task.id)];
		onChange(newTasks);
	};

	return (
		<React.Fragment>
			<h2>Active</h2>
			{active.map((t, i) => (
				<div key={t.id}>
					<Task
						first={i == 0}
						name={t.name}
						onTopClick={() => moveToTop(t)}
						onDownClick={() => moveToBottom(t)}
						onRemoveClick={() => remove(t)}
						onDoneClick={() => close(t)}
						onOpen={() => onView(t)}
					/>
				</div>
			))}
			<button
				className={foo.create}
				onClick={() => this.setState({ viewTaskShow: null, create: true })}
			>
				Create
			</button>
			<h2>Done</h2>
			{done.map(t => (
				<div key={t.id}>
					<Task
						name={t.name}
						onRemoveClick={() => remove(t)}
						onTopClick={() => open(t)}
					/>
				</div>
			))}
		</React.Fragment>
	);
}