import AddFriendModalTemplate from "./template.hbs";
import AddFriendModalButtons from "./buttons.hbs";

import Modal from "./../modal";
import WalletIconModal from "./../wallet-icon/modal";

import app from "../../app";
import Friend from "../../friends/model.js";
import NProgress from "nprogress";

export default Modal.extend({
	dialog: AddFriendModalTemplate,
	buttons: AddFriendModalButtons,

	title: "Add Contact",

	events: {
		"click #friend-icon": "changeIcon"
	},

	changeIcon() {
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

	beforeSubmit(e) {
		if (!this.$("#friend-address").val()) {
			e.preventDefault();
			this.$("#friend-address-label").removeClass("label-hidden").addClass("text-red").text("Field is required.");

			return false;
		} else {
			this.$("#friend-address-label").addClass("label-hidden").removeClass("text-red");
		}

		if (!/^(?:[a-f0-9]{10}|k[a-z0-9]{9}|(?:[a-z0-9-_]{1,32}@)?[a-z0-9]{1,64}\.kst)$/i.test(this.$el.find("#friend-address").val())) {
			e.preventDefault();
			this.$("#friend-address-label").removeClass("label-hidden").addClass("text-red").text("Invalid address or name.");

			return false;
		} else {
			this.$("#friend-address-label").addClass("label-hidden").removeClass("text-red");
		}
	},

	submit() {
		NProgress.start();

		let label = this.$("#friend-label").val();
		let address = this.$("#friend-address").val();
		let icon = this.icon;

		let friend = new Friend({
			address: address,
			label: label,
			icon: icon,
			isName: /^(?:[a-z0-9-_]{1,32}@)?[a-z0-9]{1,64}\.kst$/.test(address),
			position: app.friends.length,
			syncNode: app.syncNode
		});

		app.friends.add(friend);
		friend.save();

		NProgress.done();
	}
});
