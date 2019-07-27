import React from "react";
import Tasks from "./tasks";
import SyncIndicator from "./SyncIndicator";
import Dialog from "./components/Dialog";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import ImportExport from "./components/ImportExport";

export default class ListPage extends React.Component {
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
				<ImportExport
					listID={this.props.userHash}
					onChange={tasks => {
						this.setTasks(tasks);
					}}
				/>
				<TaskList
					tasks={this.state.tasks}
					onChange={tasks => {
						this.setTasks(tasks);
					}}
					onView={t => this.view(t)}
				/>
			</div>
		);
	}
}
