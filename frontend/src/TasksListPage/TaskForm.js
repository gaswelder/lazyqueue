import React from "react";
import styled from "styled-components";
import Card from "./Card";

const Form = styled.form`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;

	& input,
	textarea {
		margin-bottom: 1em;
	}

	& textarea {
		height: 3em;
	}

	& > div {
		display: flex;
		flex-direction: column;
	}
	& > div:nth-child(1) {
		flex: 1;
	}
	& > div:nth-child(2) {
		width: 100px;
		flex: 0;
	}
	& > div:nth-child(3) {
		flex: 1;
		flex-basis: 100%;
	}
	& > div:nth-child(4) {
		flex-direction: row;
		flex: 1;
		justify-content: flex-end;
	}
`;

class TaskForm extends React.Component {
	render() {
		const { task = {}, onCancel, tags, onSave } = this.props;

		const handleSubmit = event => {
			event.preventDefault();
			const form = event.target;
			const tag = form.querySelector('[name="tag"]').value;
			const name = form.querySelector('[name="name"]').value;
			const description = form.querySelector('[name="description"]').value;
			onSave({ id: task.id, name, description, tag });
		};

		return (
			<Card>
				<Form onSubmit={handleSubmit}>
					<div>
						<label>Name</label>
						<input
							name="name"
							required
							defaultValue={task.name}
							autoFocus
							autoComplete="off"
						/>
					</div>

					<div>
						<label>Tag</label>
						<input
							name="tag"
							defaultValue={task.tag}
							autoComplete="off"
							list="tags"
						/>
						<datalist id="tags">
							{tags.map(tag => (
								<option key={tag} value={tag} />
							))}
						</datalist>
					</div>

					<div>
						<label>Description</label>
						<textarea name="description" defaultValue={task.description} />
					</div>

					<div>
						<button type="button" onClick={onCancel}>
							Close
						</button>
						<button type="submit">Save</button>
					</div>
				</Form>
			</Card>
		);
	}
}

export default TaskForm;
