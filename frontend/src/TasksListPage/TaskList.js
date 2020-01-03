import React from "react";
import Task from "./Task";
import TasksFilter from "./TasksFilter";
import { getAllTags } from "../selectors";
import Tag from "./Tag";
import AddButton from "./AddButton";

export default function TaskList(props) {
	const { tasks, onChange, onView, onAddClick } = props;
	const [tab, setTab] = React.useState(0);
	const [tag, setTag] = React.useState(null);

	const [active, done] = tasks.reduce(
		function(s, task) {
			if (task.finishedDate) {
				return [s[0], s[1].concat([task])];
			}
			return [s[0].concat([task]), s[1]];
		},
		[[], []]
	);

	const handleTabClick = i => {
		setTab(i);
		setTag(null);
	};

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
			<TasksFilter
				currentTab={tab}
				currentTag={tag}
				onTabClick={handleTabClick}
				activeTasks={active}
				finishedTasks={done}
			/>
			{getAllTags(tasks).map(tag => (
				<Tag key={tag} title={tag} onClick={() => setTag(tag)} />
			))}
			{tab === 0 && !tag && (
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
								onTagClick={() => setTag(t.tag)}
							/>
						</div>
					))}
				</React.Fragment>
			)}
			{tab === 1 && !tag && (
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
			{tag && (
				<React.Fragment>
					{active
						.filter(t => t.tag == tag)
						.map((t, i) => (
							<div key={t.id}>
								<Task
									first={i == 0}
									task={t}
									onTopClick={() => moveToTop(t)}
									onDownClick={() => moveToBottom(t)}
									onRemoveClick={() => remove(t)}
									onDoneClick={() => close(t)}
									onOpen={() => onView(t)}
									onTagClick={() => setTag(t.tag)}
								/>
							</div>
						))}
				</React.Fragment>
			)}
			<AddButton onClick={onAddClick} />
		</React.Fragment>
	);
}
