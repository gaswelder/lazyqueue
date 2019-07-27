import React from "react";
import foo from "./tasks.css";
import Task from "./Task";

export default function TaskList(props) {
	const { tasks, onChange, onView } = props;
	const [tab, setTab] = React.useState(0);

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
			<div className={foo.tabs}>
				<a
					href="#"
					onClick={() => setTab(0)}
					className={tab == 0 ? foo.current : ""}
				>
					Active ({active.length})
				</a>
				<a
					href="#"
					onClick={() => setTab(1)}
					className={tab == 1 ? foo.current : ""}
				>
					Done ({done.length})
				</a>
			</div>
			{tab === 0 && (
				<React.Fragment>
					{active.map((t, i) => (
						<div key={t.id}>
							<Task
								first={i == 0}
								task={t}
								onTopClick={() => moveToTop(t)}
								onDownClick={() => moveToBottom(t)}
								onRemoveClick={() => remove(t)}
								onDoneClick={() => close(t)}
								onOpen={() => onView(t)}
							/>
						</div>
					))}
				</React.Fragment>
			)}
			{tab === 1 && (
				<React.Fragment>
					{done.map(t => (
						<div key={t.id}>
							<Task
								task={t}
								onRemoveClick={() => remove(t)}
								onTopClick={() => open(t)}
							/>
						</div>
					))}
				</React.Fragment>
			)}
		</React.Fragment>
	);
}
