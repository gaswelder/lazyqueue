import React from "react";
import sha1 from "sha1";
import styled from "styled-components";

const Container = styled.span`
	display: inline-block;
	background-color: ${props => props.color || "#9fa8da"};
	color: white;
	font-size: small;
	font-weight: bold;
	padding: 0.2em 0.5em;
	margin-right: 0.5em;
	border-radius: 4px;
	flex-grow: 0;
	flex-basis: auto;
`;

export default function Tag(props) {
	const { title, onClick } = props;

	const color = "#" + sha1(title).substr(0, 6);

	return (
		<Container color={color} onClick={onClick}>
			{title}
		</Container>
	);
}
