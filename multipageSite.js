import { Component, el, renderPage } from "./page.js";

function pageLink(page) {
	return () => App.instance.setState({ page });
}

class ImageWheel extends Component {
	state = { position: 0, moving: false };

	render() {
		const { div, img } = el;

		let images = this.args[0].map((src) => img.src(src)());

		const container = div.class("image-wheel").on(
			"click",
			() => (
				container.classList.add("move"),
				setTimeout(
					() =>
						this.setState({
							position: (this.state.position + 1) % this.args[0].length
						}),
					300
				)
			)
		)(
			...images.slice(this.state.position),
			...images.slice(0, this.state.position)
		);

		return container;
	}
}

class Page extends Component {
	render(...content) {
		return el.div.id("page")(
			el.div.id("header")(
				el.h1.class("title").on("click", pageLink(Home))("My PageJS Site"),
				el.span.on("click", pageLink(About)).class("link")("About"),
				el.span.on("click", pageLink(Images)).class("link")("Images"),
				el.span
					.on("click", () => (location.href = "//seattleowl.com"))
					.class("link")("Games")
			),
			el.div.id("content")(...content),
			el.div.id("footer")(el.span("Made in PageJS ⭐️"))
		);
	}
}

class Home extends Page {
	render() {
		return super.render(
			el.p(
				"This site is made using Page.js! It is a React-like framework for making websites. You can click on the links above to travel to different pages, including ones outside this domain (Games). ",
				el.span
					.on("click", pageLink(About))
					.style({ textDecoration: "underline", cursor: "pointer" })(
					"Read More"
				)
			),
			new ImageWheel([
				"imgs/cat.jpg",
				"imgs/js.jpg",
				"imgs/mc.jpg",
				"imgs/html.png"
			])
		);
	}
}

class About extends Page {
	render() {
		return super.render(
			el.p(
				"This site is made using Page.js! It is a React-like framework for making websites. You can click on the links above to travel to different pages, including ones outside this domain (Games). You can create your own components, like the page base and image wheel, then render those using ",
				el.code("renderPage()"),
				". The entire website is contained in the ",
				el.code("App"),
				" component, which only renders one ",
				el.code("Page"),
				" component, like ",
				el.code("About"),
				" or ",
				el.code("Home"),
				", which then give content to the ",
				el.code("Page"),
				" component's render to show the header and footer."
			)
		);
	}
}

class Images extends Page {
	render() {
		return super.render(
			new ImageWheel([
				"imgs/cat.jpg",
				"imgs/js.jpg",
				"imgs/mc.jpg",
				"imgs/html.png"
			]),
			el.br,
			new ImageWheel([
				"imgs/book1.png",
				"imgs/book2.png",
				"imgs/book3.png",
				"imgs/book4.png",
				"imgs/book5.png",
				"imgs/book6.png"
			]),
			el.br,
			new ImageWheel([
				"imgs/realms.jpg",
				"imgs/realms2.jpg",
				"imgs/realms3.jpg",
				"imgs/pilkie_world.jpg",
				"imgs/mc_game.jpg",
				"imgs/dungeons.png",
				"imgs/home-hero-mc.jpg"
			])
		);
	}
}
class App extends Component {
	state = { page: Home };

	render() {
		return el.div(
			el.link.rel("stylesheet").href("multipageSite.css")(),
			new this.state.page()
		);
	}

	/**
	 * Instance.
	 * @type {App}
	 *
	 * @static
	 * @memberof App
	 */
	static instance = renderPage(App, "body");
}
