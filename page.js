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

class PageElement extends Function {
	_attrs = {};
	_eventListeners = [];
	#tagName = null;

	attrData = { id: "string", style: "object", class: "string" };

	constructor(tagName, attrs = {}) {
		super();

		// Create Proxy
		const proxy = new Proxy(this, {
			apply: function (target, _that, children) {
				return target._render(children);
			}
		});

		// Add attr methods and tagName
		Object.entries({ ...this.attrData, ...attrs }).forEach(([attr, type]) => {
			this[attr] = function (value) {
				if (typeof value !== type)
					throw new TypeError(`Expected a ${type}, but got a ${typeof value}.`);
				if (attr === "id") console.log(this._attrs.id);
				this._attrs[attr] = value;
				return proxy;
			}.bind(this);
		});

		this.#tagName = tagName;

		return proxy;
	}

	_render(children) {
		/** @type {HTMLElement} */
		const el = document.createElement(this.#tagName);

		Object.entries(this._attrs.style ?? {}).forEach(([property, value]) =>
			el.style.setProperty(
				property.replaceAll(/([A-Z])/g, (_m, l) => `-${l.toLowerCase()}`),
				value
			)
		);
		Object.entries(this._attrs)
			.filter(([key]) => key !== "style")
			.forEach((kvPair) => el.setAttribute(...kvPair));

		// console.log(el.id, this._attrs.id);

		this._eventListeners.forEach(({ event, callback }) =>
			el.addEventListener(event, callback)
		);

		children.forEach((c) => el.appendChild(asElement(c)));

		this._attrs = {};
		this._eventListeners = [];

		return el;
	}

	on(event, callback) {
		this._eventListeners.push({ event, callback });
		return this;
	}

	getTagName = () => {
		return this.#tagName;
	};
}

export const el = {};
function createTag(tagName, attrs = null) {
	Object.defineProperty(el, tagName, {
		get() {
			return new PageElement(tagName, attrs);
		}
	});
}

createTag("div");
createTag("h1");
createTag("p");
createTag("button");
createTag("img", { src: "string" });
createTag("br");
createTag("span");
createTag("link", { rel: "string", href: "string" });
createTag("code");

export function renderPage(component, target) {
	const el = document.querySelector(target);
	const page = new component();

	el.appendChild(asElement(page._internalRender()));

	return page;
}
