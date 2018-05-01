import React from "react";
import ReactDOM from "react-dom";
import TasksList from "./TasksList";

class App extends React.Component {
	render() {
		return <TasksList />;
	}
}

ReactDOM.render(<App />, document.getElementById("app"));
