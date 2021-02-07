import {ItemView} from "backbone.marionette";
import template from "./edit-friend-template.hbs";

import ConfirmModal from "../modal/confirm/modal";
import WalletIconModal from "../modal/wallet-icon/modal";

import app from "../app";
import NProgress from "nprogress";

export default ItemView.extend({
	template: template,
	className: "edit-friend",

	ui: {
		remove: "#friend-remove",
		save: "#friend-save",
		icon: "#friend-icon"
	},

	triggers: {
		"click @ui.remove": "click:remove",
		"click @ui.save": "click:save",
		"click @ui.icon": "change:icon"
	},

	modelEvents: {
		change: "render"
	},

	onRender() {
		this.$el.attr("data-id", this.model.get("id"));
	},

	onShow() {
		this.$el.attr("data-id", this.model.get("id"));

		this.icon = this.model.get("icon");

		if (this.icon) {
			this.$("#friend-icon").text("").css("background-image", `url(${this.icon})`);
		} else {
			this.$("#friend-icon").text("Icon").css("background-image", "");
		}
	},

	onAttach() {
		this.$el.mCustomScrollbar({
			scrollInertia: 500
		});
	},

	serializeData() {
		return {
			address: this.model.get("address"),
			label: this.model.get("label"),
			icon: this.model.get("icon"),
			isName: this.model.get("isName")
		};
	},

	onChangeIcon() {
		let self = this;

		app.layout.modals.show(new (WalletIconModal.extend({
			title: "Contact Icon",

			success(imageData) {
				self.icon = imageData;

				self.$("#friend-icon").text("").css("background-image", `url(${self.icon})`);
			},

			removeIcon() {
				self.icon = null;
				self.$("#friend-icon").text("Icon").css("background-image", "");
			}
		}))());
	},

	onClickRemove() {
		let self = this;

		app.layout.modals.show(new (ConfirmModal.extend({
			title: "Remove Contact",
			extraData: {
				text: "Are you sure you want to remove this contact?",
				bad: true
			},

			submit() {
				self.model.destroy();
				self.destroy();
			}
		}))());
	},

	onClickSave() {
		if (!this.$("#friend-address").val()) {
			this.$("#friend-address-label").removeClass("label-hidden").addClass("text-red").text("Field is required.");
			return false;
		} else {
			this.$("#friend-address-label").addClass("label-hidden").removeClass("text-red");
		}

		if (!/^(?:[a-f0-9]{10}|k[a-z0-9]{9}|(?:[a-z0-9-_]{1,32}@)?[a-z0-9]{1,64}\.kst)$/i.test(this.$("#friend-address").val())) {
			this.$("#friend-address-label").removeClass("label-hidden").addClass("text-red").text("Invalid address or name.");
			return false;
		} else {
			this.$("#friend-address-label").addClass("label-hidden").removeClass("text-red");
		}

		NProgress.start();

		let label = this.$("#friend-label").val().substring(0, 30);
		let address = this.$("#friend-address").val();
		let icon = this.icon;

		this.model.set({
			address: address,
			label: label,
			icon: icon,
			isName: /^(?:[a-z0-9-_]{1,32}@)?[a-z0-9]{1,64}\.kst$/.test(address)
		});

		this.model.save();

		NProgress.done();
	}
});
