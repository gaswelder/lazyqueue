import React from "react";
import ReactDOM from "react-dom";
import sha1 from "sha1";
import ListPage from "./TasksListPage";
import LoginPage from "./LoginPage";
import styles from "./styles.css";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}

	login(user, pass) {
		localStorage.setItem("userHash", sha1(sha1(user) + pass));
		this.forceUpdate();
	}

	logout() {
		localStorage.removeItem("userHash");
		this.forceUpdate();
	}

	render() {
		const userHash = localStorage.getItem("userHash");
		if (!userHash) {
			return <LoginPage onSubmit={this.login} />;
		}
		return (
			<div>
				<button className={styles.logoutButton} onClick={this.logout}>
					Logout
				</button>
				<ListPage userHash={userHash} />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("app"));
