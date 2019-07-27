import React from "react";
import classes from "./TaskForm.css";

class TaskForm extends React.Component {
	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		const { onSave, task = {} } = this.props;
		event.preventDefault();
		const form = event.target;
		const tag = form.querySelector('[name="tag"]').value;
		const name = form.querySelector('[name="name"]').value;
		const description = form.querySelector('[name="description"]').value;
		onSave({ id: task.id, name, description, tag });
	}

	render() {
		const { task = {}, onCancel } = this.props;

		return (
			<form onSubmit={this.handleSubmit} className={classes.form}>
				<label>Name</label>
				<input
					name="name"
					required
					defaultValue={task.name}
					autoFocus
					autoComplete="off"
				/>

				<label>Tag</label>
				<input name="tag" defaultValue={task.tag} autoComplete="off" />

				<label>Description</label>
				<textarea name="description" defaultValue={task.description} />

				<div className={classes.footer}>
					<button type="button" onClick={onCancel}>
						Close
					</button>
					<button type="submit">Save</button>
				</div>
			</form>
		);
	}
}

export default TaskForm;
