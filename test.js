import { Component, el, renderPage } from "./page.js";

class MyButton extends Component {
	static styles = {
		borderRadius: "8px",
		border: "0px",
		backgroundColor: "lightgray",
		outline: "none"
	};

	state = { clicked: false };

	render() {
		const { button } = el;

		return this.state.clicked
			? "Thank you."
			: button
					.style(MyButton.styles)
					.on("click", () => this.setState({ clicked: true }))("Press Me!");
	}
}

class App extends Component {
	render() {
		const { div, h1, p, img, br } = el;

		return div.id("app")(
			h1("Welcome to my site!"),
			p(
				"This is made entirely with JS (except for the script, body and head elements), using page.js!"
			),
			MyButton,
			br,
			br,
			img
				.src("cat.jpg")
				.style({ height: innerHeight - 150, borderRadius: "8px" })(),
			br,
			br,
			MyButton
		);
	}
}

renderPage(App, "body");
