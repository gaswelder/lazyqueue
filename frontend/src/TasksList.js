import React from "react";
import foo from "./tasks.css";
import Tasks from "./tasks";
import Task from "./Task";
import SyncIndicator from "./SyncIndicator";
import Dialog from "./components/Dialog";
import TaskForm from "./components/TaskForm";

function List(props) {
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

export default class TasksList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tasks: [],
			ready: false,
			saving: 0,
			viewTask: null,
			viewTaskShow: false,
			create: false
		};
	}

	setTasks(tasks) {
		this.setState({ tasks }, this.save);
	}

	async save() {
		this.setState(
			s => ({ saving: s.saving + 1 }),
			async () => {
				try {
					await Tasks.update(this.props.userHash, this.state.tasks);
				} catch (e) {
					alert("Couldn't save the list: " + e);
				}
				this.setState(s => ({ saving: s.saving - 1 }));
			}
		);
	}

	addTask(task) {
		const { name, description } = task;
		if (name === null || name.trim() == "") {
			return false;
		}
		const tasks = [Tasks.make(name, description)].concat(this.state.tasks);
		this.setTasks(tasks);
		return true;
	}

	updateTask(updatedTask) {
		this.setState(function(state) {
			return {
				tasks: state.tasks.map(t =>
					t.id == updatedTask.id ? Object.assign({}, t, updatedTask) : t
				)
			};
		}, this.save);
		return true;
	}

	async componentDidMount() {
		try {
			const tasks = await Tasks.get(this.props.userHash);
			this.setState({ tasks, ready: true });
		} catch (e) {
			alert("Failed to load the list: " + e);
		}
	}

	/**
	 * Shows the given task in the dialog.
	 * If task is null, hides the dialog.
	 *
	 * @param {task} viewTask
	 */
	view(viewTask) {
		if (viewTask) {
			this.setState({ create: null, viewTask, viewTaskShow: true });
		} else {
			// Hide the dialog, but don't remove the task so that
			// the dialog can animate away nicely.
			this.setState({ viewTaskShow: false });
		}
	}

	render() {
		const { viewTask, viewTaskShow, create } = this.state;

		if (!this.state.ready) {
			return <p>Loading...</p>;
		}

		return (
			<div className="tasks-container">
				<Dialog show={viewTaskShow}>
					{viewTask && (
						<TaskForm
							key={viewTask.id}
							task={viewTask}
							onSave={task => this.updateTask(task) && this.view(null)}
							onCancel={() => this.view(null)}
						/>
					)}
				</Dialog>

				<Dialog show={create}>
					{create && (
						<TaskForm
							onSave={task =>
								this.addTask(task) && this.setState({ create: false })
							}
							onCancel={() => this.setState({ create: false })}
						/>
					)}
				</Dialog>

				<SyncIndicator number={this.state.saving} />
				<List
					tasks={this.state.tasks}
					onChange={tasks => {
						this.setTasks(tasks);
					}}
					onView={this.view}
				/>
			</div>
		);
	}
}
