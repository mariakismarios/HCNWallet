import packageJSON from "../../../package.json";

import {LayoutView, ItemView} from "backbone.marionette";
import template from "./layout-template.hbs";
import Backbone from "backbone";
import Radio from "backbone.radio";

import CreateWalletModal from "../modal/create-wallet/modal";
import AddWalletModal from "../modal/add-wallet/modal";
import ImportWalletsModal from "../modal/import-wallets/modal";
import ExportWalletsModal from "../modal/export-wallets/modal";

import Epic from "../utils/epic";

let walletChannel = Radio.channel("wallet");
let appChannel = Radio.channel("global");

export default LayoutView.extend({
	el: "#app",
	template: template,

	behaviors: {
		Epic: {
			behaviorClass: Epic
		}
	},

	regions: {
		content: "#app-content",
		sidebar: "#sidebar",
		modals: {
			selector: "#modalsContainer",
			regionClass: Backbone.Marionette.Modals
		},
		walletChooserContainer: "#wallet-chooser-container",
		walletChooser: "#wallet-chooser",
		walletList: "#wallet-list",
		topBarAddressInfo: "#topBar-address-info"
	},

	ui: {
		alert: "#alert-bar",
		pageContainer: "#page-container",
		pageMain: "#page-main",
		sidebarOpener: "#sidebar-opener",
		sidebarContent: "#sidebar-content",
		sidebar: "#sidebar",
		sidebarDim: "#sidebar-dim",
		walletChooserButton: "#wallet-chooser-button",
		walletChooserContainer: "#wallet-chooser-container",
		walletChooser: "#wallet-chooser",
		walletChooserCreateWallet: "#wallet-chooser-create-wallet",
		walletChooserAddWallet: "#wallet-chooser-add-wallet",
		walletChooserImportWallets: "#wallet-chooser-import-wallets",
		walletChooserExportWallets: "#wallet-chooser-export-wallets",
		topBar: ".topBar",
		connectionInfo: "#topBar-connectionInfo",
		loginFirst: "#login-first"
	},

	triggers: {
		"click @ui.sidebarOpener": "click:sidebarOpener",
		"click @ui.sidebarDim": "click:sidebarDim",
		"click @ui.walletChooserButton": "toggle:walletChooser",
		"click @ui.walletChooserCreateWallet": "create:wallet",
		"click @ui.walletChooserAddWallet": "add:wallet",
		"click @ui.walletChooserImportWallets": "import:wallets",
		"click @ui.walletChooserExportWallets": "export:wallets"
	},

	initialize() {
		walletChannel.on("wallet:activeChanging", wallet => {
			this.topBarAddressInfo.show(new ItemView({ template: "<span>Loading...</span>" }));

			if (wallet.has("icon") && wallet.get("icon")) {
				this.ui.walletChooserButton.addClass("has-icon");
				this.ui.walletChooserButton.css("background-image", `url(${wallet.get("icon")})`);
			} else {
				this.ui.walletChooserButton.removeClass("has-icon");
				this.ui.walletChooserButton.css("background-image", "");
			}
		});

		walletChannel.on("wallet:changeFailed", () => {
			this.topBarAddressInfo.show(new ItemView({ template: "<span>Not logged in</span>" }));
		});

		appChannel.on("websocket:connectionStatusChanged", status => {
			this.websocketConnectionStatusChanged(status);
		});

		appChannel.on("websocket:keepalive", () => {
			this.ui.connectionInfo.find(".connectionBulb").addClass("pulse");
		});
	},

	onClickSidebarOpener() {
		this.ui.pageContainer.toggleClass("sidebar-open");

		localStorage.sidebarOpen = this.ui.pageContainer.hasClass("sidebar-open");
	},

	onClickSidebarDim() {
		this.ui.pageContainer.removeClass("sidebar-open");

		localStorage.sidebarOpen = this.ui.pageContainer.hasClass("sidebar-open");
	},

	onToggleWalletChooser() {
		if (this.ui.walletChooserContainer.hasClass("shown")) {
			this.ui.walletChooserContainer.removeClass("shown");
			this.ui.walletChooserContainer.addClass("hidden");
		} else {
			this.ui.walletChooserContainer.removeClass("hidden");
			this.ui.walletChooserContainer.addClass("shown");
		}
	},

	onRender() {
		if (localStorage.sidebarOpen === "true") {
			this.ui.pageContainer.addClass("sidebar-open");
		}

		this.ui.walletChooserContainer.css("top", this.ui.topBar.height() + "px");

		this.$(window).resize(() => {
			this.ui.walletChooserContainer.css("top", this.ui.topBar.height() + "px");
		});

		this.ui.walletChooser.mCustomScrollbar({
			scrollInertia: 500
		});
	},

	onCreateWallet() {
		this.modals.show(new CreateWalletModal());
	},

	onAddWallet() {
		this.modals.show(new AddWalletModal());
	},

	onImportWallets() {
		this.modals.show(new ImportWalletsModal());
	},

	onExportWallets() {
		this.modals.show(new ExportWalletsModal());
	},

	websocketConnectionStatusChanged(status) {
		this.ui.connectionInfo.removeClass("connecting");
		this.ui.connectionInfo.removeClass("connected");

		switch (status) {
			case 0:
				this.ui.connectionInfo.find(".connectionLabel").text("Disconnected");
				break;
			case 1:
				this.ui.connectionInfo.find(".connectionLabel").text("Connecting");
				this.ui.connectionInfo.addClass("connecting");
				break;
			case 2:
				this.ui.connectionInfo.find(".connectionLabel").text("Connected");
				this.ui.connectionInfo.addClass("connected");
				break;
			case 3:
				this.ui.connectionInfo.find(".connectionLabel").text("Connection Failed");
				break;
		}

		this.ui.connectionInfo.find(".connectionBulb").on("webkitAnimationEnd oanimationend msAnimationEnd animationend", () => {
			this.ui.connectionInfo.find(".connectionBulb").removeClass("pulse");
		});
	},

	templateHelpers() {
		return {
			appVersion: packageJSON.version
		};
	}
});