import React from "react";

const styles = {
	icon: {
		width: "12px",
		height: "12px"
	},
	container: {
		height: "12px"
	},
	message: {
		fontSize: "12px",
		marginRight: "0.5em"
	}
};

function Icon() {
	return (
		<img
			style={styles.icon}
			src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzIwMCcgd2lkdGg9JzIwMCcgIGZpbGw9IiNmZmZmZmYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAgMTAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48Zz48Zz48cGF0aCBkPSJNODcuODc0LDU3Ljg0NGMtMC40NiwwLjM2NC0xLjA2MSwwLjU5NC0xLjgxMiwwLjU5NGMtMC42MjYsMC0xLjEzOS0wLjE2OS0xLjU2MS0wLjQzMyAgICAgYy0wLjAzNSwwLjIzMS0wLjEwNCwwLjQ2LTAuMTg5LDAuNjg2Yy0wLjAyMSwwLjEyNy0wLjA1OSwwLjI0OS0wLjA5NSwwLjM3Yy0wLjAxNywwLjEwNC0wLjA0LDAuMjAyLTAuMDY3LDAuMzAxICAgICBDODEuMjQ3LDc1Ljc0OCw2Ni45NTcsODguMjUsNDkuNzUsODguMjVjLTE5LjI5OSwwLTM1LTE1LjcwMS0zNS0zNXMxNS43MDEtMzUsMzUtMzVjMTEuMiwwLDIxLjE2Nyw1LjMwNCwyNy41NzUsMTMuNTE3ICAgICBjMi4zNzEtMi4zNzEsNC43NDItNC43NDIsNy4xMTMtNy4xMTNDNzYuMTg1LDE0LjY0Niw2My43MDcsOC4yNSw0OS43NSw4LjI1Yy0yNC44MTMsMC00NSwyMC4xODctNDUsNDVjMCwyNC44MTMsMjAuMTg3LDQ1LDQ1LDQ1ICAgICBjMjIuMzY5LDAsNDAuOTY5LTE2LjQwOSw0NC40MTUtMzcuODIxQzkyLjAyNyw1OS42OTYsODkuOTc4LDU4LjczNCw4Ny44NzQsNTcuODQ0eiI+PC9wYXRoPjwvZz48L2c+PGc+PGxpbmUgeDE9IjgzIiB5MT0iMzAiIHgyPSI2MCIgeTI9IjMwIj48L2xpbmU+PHBhdGggZD0iTTgzLDM1SDYwYy0yLjc2MiwwLTUtMi4yMzktNS01czIuMjM4LTUsNS01aDIzYzIuNzYyLDAsNSwyLjIzOSw1LDVTODUuNzYyLDM1LDgzLDM1eiI+PC9wYXRoPjwvZz48Zz48bGluZSB4MT0iODMiIHkxPSIzMCIgeDI9IjgzIiB5Mj0iNyI+PC9saW5lPjxwYXRoIGQ9Ik04MywzNWMtMi43NjIsMC01LTIuMjM5LTUtNVY3YzAtMi43NjEsMi4yMzgtNSw1LTVzNSwyLjIzOSw1LDV2MjNDODgsMzIuNzYxLDg1Ljc2MiwzNSw4MywzNXoiPjwvcGF0aD48L2c+PGc+PGNpcmNsZSBjeD0iODkuMjQ5IiBjeT0iNTkuNSIgcj0iNSI+PC9jaXJjbGU+PC9nPjwvZz48L3N2Zz4="
			alt=""
		/>
	);
}

const range = n => [...Array(n).keys()];

function Icons(props) {
	if (!props.number) return null;
	return range(props.number).map(i => <Icon key={i} />);
}

export default function SyncIndicator(props) {
	return (
		<div style={styles.container}>
			{props.number > 0 && <span style={styles.message}>Saving...</span>}
			<Icons number={props.number} />
		</div>
	);
}
