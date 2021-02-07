import {Behavior} from "backbone.marionette";

import app from "../app";

export default Behavior.extend({
	defaults: {
		code: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
	},

	initialize() {
		this.cache = [];
		window.$("body").keyup(this._epic.bind(this));

		const now = new Date();
		if (now.getMonth() === 3 && now.getDate() === 1) { // nothing to see here, carry on
			setTimeout(this._epic_behaviour, 10000);
		}
	},

	_epic(e) {
		if (this.options.code.length > this.cache.push(e.which)) return;
		if (this.options.code.length < this.cache.length) this.cache.shift();
		if (this.options.code.toString() !== this.cache.toString()) return;

		this._epic_behaviour();
	},

	_epic_behaviour() {
		//new Audio("/img/en_GB_en_GB_ai_ai.wav").play();
		app.epic = true;

		// eslint-disable-next-line no-console
		console.log("Truly epic");

		let observer = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (mutation.addedNodes) {
					mutation.addedNodes.forEach(node => {
						if (node.nodeType !== 3 || !node.parentNode) return;

						var replacementNode = document.createElement("span");
						replacementNode.innerHTML = node.textContent.replace(/ault/gi, "alut").replace(/allet/gi, "alelset").replace(/block/gi, "cock");

						node.parentNode.insertBefore(replacementNode, node);
						node.parentNode.removeChild(node);
					});
				}
			});
		});

		observer.observe(window.$("body")[0], { attributes: true, childList: true, characterData: true, subtree: true });

		window.$("div, p, a, b, i, u, h1, h2, h3, h4, h5, h6, span, select, option").each(function() {
			window.$(this).contents().each(function() {
				if (this.nodeType === 3) {
					//noinspection JSPotentiallyInvalidUsageOfThis
					this.nodeValue = this.nodeValue.replace(/ault/gi, "alut").replace(/allet/gi, "alelset").replace(/block/gi, "cock");
				}
			});
		});

		window.$("body").append("<img src=\"/img/yin.png\" class=\"yin\" />");

		for (let i = 0; i < 50; i++) {
			setTimeout(() => {
				window.$("<img />", {
					src: "/img/doot.png",
					class: "trumpet",
					style: "left: " + Math.floor(Math.random() * 100) + "vw;"
				}).one("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
					window.$(this).remove();
				}).appendTo("body");
			}, i * 15);
		}
	}
});