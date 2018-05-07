import React from "react";
import styles from "./styles.css";

export default class Login extends React.Component {
	render() {
		return (
			<form
				className={styles.loginForm}
				onSubmit={e => {
					e.preventDefault();
					this.props.onSubmit(this.input.value);
				}}
			>
				<input
					autoFocus
					ref={e => {
						this.input = e;
					}}
				/>
			</form>
		);
	}
}
