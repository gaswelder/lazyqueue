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
		const name = form.querySelector('[name="name"]').value;
		const description = form.querySelector('[name="description"]').value;
		onSave({ id: task.id, name, description });
	}

	render() {
		const { name, description } = this.props.task || {};
		return (
			<form onSubmit={this.handleSubmit} className={classes.form}>
				<label>Name</label>
				<input name="name" required defaultValue={name} />

				<label>Description</label>
				<textarea name="description" defaultValue={description} />

				<button type="submit">Save</button>
			</form>
		);
	}
}

export default TaskForm;
