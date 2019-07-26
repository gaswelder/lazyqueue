import React from "react";
import styles from "./styles.css";

export default class LoginPage extends React.Component {
	render() {
		return (
			<form
				className={styles.loginForm}
				onSubmit={e => {
					e.preventDefault();
					this.props.onSubmit(this.input.value, this.password.value);
				}}
			>
				<input
					placeholder="Username"
					autoFocus
					ref={e => {
						this.input = e;
					}}
				/>
				<input
					placeholder="Password"
					type="password"
					ref={e => {
						this.password = e;
					}}
				/>
				<button type="submit">Enter</button>
			</form>
		);
	}
}
