function asElement(el) {
	return el instanceof PageElement && new Set(["br"]).has(el.getTagName())
		? el()
		: el instanceof Component
		? el._internalRender()
		: typeof el === "string"
		? document.createTextNode(el)
		: el;
}

export class Component {
	state = {};
	args = null;
	dataType = "child";
	/** @type {HTMLElement} */
	#element = null;

	constructor(...args) {
		this.args = args;
	}

	setState(state) {
		this.state = { ...this.state, ...state };
		this._internalRender();
	}

	/**
	 * Used to render things.
	 *
	 * @memberof Component
	 */
	render() {}

	_internalRender() {
		const r = this.render();
		const newEl = asElement(r);
		if (this.#element != null) {
			this.#element.parentElement.replaceChild(newEl, this.#element);
		}
		this.#element = newEl;

		return newEl;
	}
}

class DotFunction extends Function {
	constructor(onCall) {
		super();

		const proxy = new Proxy(this, {
			apply: function (target, _that, args) {
				return onCall(target, ...args);
			}
		});

		return proxy;
	}
}

class PageElement extends DotFunction {
	tagName = null;
	dataType = "child";

	constructor(tagName) {
		super(function (target, ...data) {
			return target._render(data);
		});

		this.tagName = tagName;
	}

	/**
	 * @typedef Data
	 * @property {string} dataType Type of data.
	 */

	/**
	 * Render PageElement
	 *
	 * @param {Data[]} data Data to render.
	 * @return {HTMLElement} Rendered Element
	 * @memberof PageElement
	 */
	_render(data) {
		const children = data.filter(
			(data) =>
				data instanceof HTMLElement ||
				data instanceof Component ||
				typeof data === "string"
		);
		const attrs = Object.fromEntries(
			data
				.filter(({ dataType }) => dataType === "attr")
				.map(({ str }) => str.split("="))
		);
		const events = data.filter(({ dataType }) => dataType === "event");
		const style =
			data.find(({ dataType }) => dataType === "styleAttr")?.style ?? {};

		/** @type {HTMLElement} */
		const el = document.createElement(this.tagName);

		Object.entries(style).forEach(([property, value]) =>
			el.style.setProperty(
				property.replaceAll(/([A-Z])/g, (_m, l) => `-${l.toLowerCase()}`),
				value
			)
		);
		Object.entries(attrs)
			.filter(([key]) => key !== "style")
			.forEach((kvPair) => el.setAttribute(...kvPair));

		events.forEach(({ event, callback }) =>
			el.addEventListener(event, callback)
		);

		children.forEach((c) => el.appendChild(asElement(c)));

		this._attrs = {};
		this._eventListeners = [];

		return el;
	}
}

export const el = {
	div: new PageElement("div"),
	h1: new PageElement("h1"),
	p: new PageElement("p"),
	button: new PageElement("button"),
	img: new PageElement("img", "src"),
	br: new PageElement("br"),
	span: new PageElement("span"),
	link: new PageElement("link", "rel", "href"),
	code: new PageElement("code"),
	attr: new DotFunction(function (_t, str) {
		return { dataType: "attr", str };
	})
};

el.attr.on = function (event, callback) {
	return { dataType: "event", event, callback };
};

el.attr.style = function (style) {
	return { dataType: "styleAttr", style };
};

export function renderPage(component, target) {
	const el = document.querySelector(target);
	const page = new component();

	el.appendChild(asElement(page._internalRender()));

	return page;
}
