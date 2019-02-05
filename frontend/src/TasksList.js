import React from "react";
import foo from "./tasks.css";
import Tasks from "./tasks";
import Task from "./Task";
import SyncIndicator from "./SyncIndicator";
import Dialog from "./components/Dialog";
import TaskForm from "./components/TaskForm";

export default class TasksList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tasks: [],
			ready: false,
			saving: 0,
			viewTask: null,
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

	moveToTop(task) {
		const { tasks } = this.state;

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
		this.setTasks(newList);
	}

	moveToBottom(task) {
		const { tasks } = this.state;

		const rest = tasks.filter(t => t.id != task.id);
		this.setTasks([...rest, task]);
	}

	remove(task) {
		if (!confirm(`This will remove task "${task.name}"`)) {
			return;
		}
		const tasks = this.state.tasks.filter(t => t.id != task.id);
		this.setTasks(tasks);
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

	close(task) {
		const tasks = this.state.tasks.map(function(t) {
			if (t.id == task.id) {
				t = Object.assign({}, t, { finishedDate: new Date() });
			}
			return t;
		});
		this.setTasks(tasks);
	}

	open(task) {
		const restored = Object.assign({}, task, { finishedDate: null });
		const tasks = [restored, ...this.state.tasks.filter(t => t.id != task.id)];
		this.setTasks(tasks);
	}

	async componentDidMount() {
		try {
			const tasks = await Tasks.get(this.props.userHash);
			this.setState({ tasks, ready: true });
		} catch (e) {
			alert("Failed to load the list: " + e);
		}
	}

	view(viewTask) {
		this.setState({ viewTask });
	}

	render() {
		const { viewTask, create } = this.state;

		if (!this.state.ready) {
			return <p>Loading...</p>;
		}
		const [active, done] = this.state.tasks.reduce(
			function(s, task) {
				if (task.finishedDate) {
					return [s[0], s[1].concat([task])];
				}
				return [s[0].concat([task]), s[1]];
			},
			[[], []]
		);

		return (
			<div className="tasks-container">
				<Dialog onClose={() => this.view(null)}>
					{viewTask && (
						<TaskForm
							task={viewTask}
							onSave={task => this.updateTask(task) && this.view(null)}
						/>
					)}
				</Dialog>
				<Dialog onClose={() => this.setState({ create: false })}>
					{create && (
						<TaskForm
							onSave={task =>
								this.addTask(task) && this.setState({ create: false })
							}
						/>
					)}
				</Dialog>
				<SyncIndicator number={this.state.saving} />
				<h2>Active</h2>
				{active.map((t, i) => (
					<div key={t.id}>
						<Task
							first={i == 0}
							name={t.name}
							onTopClick={() => this.moveToTop(t)}
							onDownClick={() => this.moveToBottom(t)}
							onRemoveClick={() => this.remove(t)}
							onDoneClick={() => this.close(t)}
							onOpen={() => this.view(t)}
						/>
					</div>
				))}
				<button
					className={foo.create}
					onClick={() => this.setState({ create: true })}
				>
					Create
				</button>
				<h2>Done</h2>
				{done.map(t => (
					<div key={t.id}>
						<Task
							name={t.name}
							onRemoveClick={() => this.remove(t)}
							onTopClick={() => this.open(t)}
						/>
					</div>
				))}
			</div>
		);
	}
}
