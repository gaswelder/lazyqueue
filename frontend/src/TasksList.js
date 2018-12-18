import React from "react";
import foo from "./tasks.css";
import Tasks from "./tasks";
import Task from "./Task";
import SyncIndicator from "./SyncIndicator";
import TaskView from "./TaskView";
import Dialog from "./components/Dialog";

class TaskForm extends React.Component {
	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		const { onSave } = this.props;
		event.preventDefault();
		const form = event.target;
		const name = form.querySelector('[name="name"]').value;
		const description = form.querySelector('[name="description"]').value;
		onSave({ name, description });
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<div>
					<label>Name</label>
					<input name="name" required />
				</div>
				<div>
					<label>Description</label>
					<textarea name="description" />
				</div>
				<button type="submit">Save</button>
			</form>
		);
	}
}

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
		const tasks = [task, ...this.state.tasks.filter(t => t.id != task.id)];
		this.setTasks(tasks);
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
					{viewTask && <TaskView task={viewTask} />}
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
