import React from "react";
import Hotkey from "./Hotkey";
import styled from "styled-components";

const Container = styled.div`
	position: fixed;
	bottom: 6em;
	right: 2em;
	display: flex;
	flex-direction: column;
	& small {
		margin-left: 0.5em;
	}
`;

const Button = styled.button`
	background-color: #f44336;
	border: none;
	border-radius: 50%;
	width: 50px;
	box-shadow: 4px 4px 10px #00003399;
	height: 50px;
	color: #eceef9;
	font-weight: bold;
`;

export default function AddButton(props) {
	const { onClick } = props;

	return (
		<Container>
			<Hotkey filter={{ shiftKey: true, key: "+" }} func={onClick} />
			<Button onClick={onClick}>+</Button>
			<small>
				<kbd>shift +</kbd>
			</small>
		</Container>
	);
}
