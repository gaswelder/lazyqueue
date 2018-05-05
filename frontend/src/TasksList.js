import React from "react";
import foo from "./tasks.css";
import Tasks from "./tasks";

function IconButton(props) {
	const className = [foo["icon-button"], props.className]
		.filter(x => x)
		.join(" ");
	return (
		<button className={className} onClick={props.onClick}>
			{props.text}
		</button>
	);
}

function Task(props) {
	return (
		<div className={foo.task + (props.first ? " " + foo.first : "")}>
			{!props.first &&
				props.onTopClick && <IconButton text="▲" onClick={props.onTopClick} />}
			<span>{props.name}</span>
			{props.onDoneClick && (
				<IconButton
					className={foo.check}
					text="✓"
					onClick={props.onDoneClick}
				/>
			)}
			{props.onRemoveClick && (
				<IconButton
					className={foo.delete}
					text="×"
					onClick={props.onRemoveClick}
				/>
			)}
		</div>
	);
}

export default class TasksList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tasks: [],
			ready: false,
			saving: 0
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

	async componentDidMount() {
		const tasks = await Tasks.get(this.props.userHash);
		this.setState({ tasks, ready: true });
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

	create() {
		const name = prompt("");
		if (name === null || name.trim() == "") {
			return;
		}
		const tasks = this.state.tasks.concat([Tasks.make(name)]);
		this.setTasks(tasks);
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

	render() {
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
				{this.state.saving}
				<h2>Active</h2>
				{active.map((t, i) => (
					<div key={t.id}>
						<Task
							first={i == 0}
							name={t.name}
							onTopClick={() => this.moveToTop(t)}
							onRemoveClick={() => this.remove(t)}
							onDoneClick={() => this.close(t)}
						/>
					</div>
				))}
				<button className={foo.create} onClick={() => this.create()}>
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
