import React from "react";
import ReactDOM from "react-dom";
import sha1 from "sha1";
import TasksList from "./TasksList";

class Login extends React.Component {
	render() {
		return (
			<form
				onSubmit={e => {
					e.preventDefault();
					this.props.onSubmit(this.input.value);
				}}
			>
				<input
					ref={e => {
						this.input = e;
					}}
				/>
			</form>
		);
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userHash: null
		};
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}

	login(pass) {
		this.setState({ userHash: sha1(pass) });
	}

	logout() {
		this.setState({ userHash: null });
	}

	render() {
		if (!this.state.userHash) {
			return <Login onSubmit={this.login} />;
		}
		return (
			<div>
				<button onClick={this.logout}>Logout</button>
				<TasksList userHash={this.state.userHash} />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("app"));
