import React from "react";
import Tasks from "../tasks";
import SyncIndicator from "./SyncIndicator";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import ImportExport from "./ImportExport";
import { getAllTags } from "../selectors";

export default class ListPage extends React.Component {
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

	addTask(task) {
		const { name, description, tag } = task;
		if (name === null || name.trim() == "") {
			return false;
		}
		const tasks = [Tasks.make(name, description, tag)].concat(this.state.tasks);
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

	render() {
		const { viewTask, create, tasks } = this.state;

		if (!this.state.ready) {
			return <p>Loading...</p>;
		}

		const handleCreateClick = () => {
			this.setState({ create: true });
		};

		const content = () => {
			if (viewTask) {
				return (
					<TaskForm
						key={viewTask.id}
						task={viewTask}
						tags={getAllTags(tasks)}
						onSave={task => {
							this.updateTask(task);
							this.setState({ viewTask: null });
						}}
						onCancel={() => this.setState({ viewTask: null })}
					/>
				);
			}
			if (create) {
				return (
					<TaskForm
						tags={getAllTags(tasks)}
						onSave={task => {
							this.addTask(task);
							this.setState({ create: false });
						}}
						onCancel={() => this.setState({ create: false })}
					/>
				);
			}
			return (
				<TaskList
					tasks={tasks}
					onChange={tasks => {
						this.setTasks(tasks);
					}}
					onView={task => {
						this.setState({ viewTask: task });
					}}
					onAddClick={handleCreateClick}
				/>
			);
		};

		return (
			<div className="tasks-container">
				<SyncIndicator number={this.state.saving} />
				<ImportExport
					listID={this.props.userHash}
					onChange={tasks => {
						this.setTasks(tasks);
					}}
				/>
				{content()}
			</div>
		);
	}
}
