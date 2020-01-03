import React from "react";
import styled from "styled-components";

const Container = styled.div`
	color: white;
	padding: 1em 0;
	& a {
		color: inherit;
		text-decoration: none;
		display: inline-block;
		margin-right: 0.5em;
	}
	& a.current {
		font-weight: bold;
	}
`;

export default function TasksFilter(props) {
	const {
		currentTab,
		currentTag,
		onTabClick,
		activeTasks,
		finishedTasks
	} = props;

	return (
		<Container>
			<a
				href="#"
				onClick={() => onTabClick(0)}
				className={currentTab == 0 && !currentTag ? "current" : ""}
			>
				Active ({activeTasks.length})
			</a>
			<a
				href="#"
				onClick={() => onTabClick(1)}
				className={currentTab == 1 && !currentTag ? "current" : ""}
			>
				Done ({finishedTasks.length})
			</a>
			{currentTag && (
				<a href="#" className="current">
					{currentTag} ({activeTasks.filter(t => t.tag == currentTag).length})
				</a>
			)}
		</Container>
	);
}
