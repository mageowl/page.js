import { Component, el, renderPage } from "./page.js";

function pageLink(page) {
	return () => App.instance.setState({ page });
}

class ImageWheel extends Component {
	state = { position: 0, moving: false };

	render() {
		const { div, img, attr: a } = el;

		let images = this.args[0].map((src) => img(a(`src=${src}`)));

		const container = div(
			a("class=image-wheel"),
			a.on(
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
			),
			...images.slice(this.state.position),
			...images.slice(0, this.state.position)
		);

		return container;
	}
}

class Page extends Component {
	render(...content) {
		const { div, h1, span, attr: a } = el;

		return div(
			a("id=page"),
			div(
				a("id=header"),
				h1(a("class=title"), a.on("click", pageLink(Home)), "My PageJS Site"),
				span(a("class=link"), a.on("click", pageLink(About)), "About"),
				span(a("class=link"), a.on("click", pageLink(Images)), "Images"),
				span(
					a("class=link"),
					a.on("click", () => (location.href = "//seattleowl.com")),
					"Games"
				)
			),
			div(a("id=content"), ...content),
			div(a("id=footer"), el.span("Made in PageJS ⭐️"))
		);
	}
}

class Home extends Page {
	render() {
		const { p, span, attr: a } = el;

		return super.render(
			p(
				"This site is made using Page.js! It is a React-like framework for making websites. You can click on the links above to travel to different pages, including ones outside this domain (Games). ",
				span(
					a.on("click", pageLink(About)),
					a.style({ textDecoration: "underline", cursor: "pointer" }),
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
		const { p, code } = el;

		return super.render(
			p(
				"This site is made using Page.js! It is a React-like framework for making websites. You can click on the links above to travel to different pages, including ones outside this domain (Games). You can create your own components, like the page base and image wheel, then render those using ",
				code("renderPage()"),
				". The entire website is contained in the ",
				code("App"),
				" component, which only renders one ",
				code("Page"),
				" component, like ",
				code("About"),
				" or ",
				code("Home"),
				", which then give content to the ",
				code("Page"),
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
		const { div, link, attr: a } = el;

		return div(
			link(a("rel=stylesheet"), a("href=./multipageSite.css")),
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
