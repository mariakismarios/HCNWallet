import $ from "jquery";

import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import Name from "./model";
import NameOverview from "./overview/view";

import NetworkFooter from "../network-footer/view";

import AlertView from "../alert/view";
import GetErrorText from "../utils/errors";

import NProgress from "nprogress";

import app from "../app";

export default LayoutView.extend({
	template: template,
	className: "name",

	regions: {
		overview: "#overview",
		networkFooter: "#network-footer"
	},

	ui: {
		gotoName: "#goto-name",
		gotoNameGo: "#goto-name-go"
	},

	triggers: {
		"click @ui.gotoNameGo": "goto:name"
	},

	initialize(options) {
		this.name = options.name;

		NProgress.start();

		let self = this;

		new Name({ name: this.name }).fetch({
			success(model, response) {
				if (!response || !response.ok) {
					NProgress.done();
					console.error(response);

					return self.overview.show(new AlertView({
						title: "Error",
						text: GetErrorText(response),
						style: "red"
					}));
				}

				self.overview.show(new NameOverview({
					model: model
				}));

				NProgress.done();
			},

			error(response) {
				NProgress.done();
				console.error(response);

				return self.overview.show(new AlertView({
					title: "Error",
					text: GetErrorText(response),
					style: "red"
				}));
			}
		});
	},

	onShow() {
		this.ui.gotoName.val(this.name);
	},

	onRender() {
		this.networkFooter.show(new NetworkFooter());
	},

	onGotoName() {
		app.router.navigate(`name/${encodeURIComponent(this.ui.gotoName.val())}`, { trigger: true });
	}
});