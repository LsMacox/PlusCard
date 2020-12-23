"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ICONIFY_ICONS = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vue2 = _interopRequireDefault(require("@iconify/vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// https://iconify.design/icon-sets/?query=plus-circle
// npm i @iconify/icons-bx -D
// npm i @iconify/icons-codicon -D
// npm i @iconify/icons-ant-design -D
// npm i @iconify/icons-entypo -D
// npm i @iconify/icons-ls -D
var ICONIFY_ICONS = {
  // uil
  'plus-circle': function plusCircle() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-uil/plus-circle'));
    });
  },
  // ant-design
  'plus-circle-outlined': function plusCircleOutlined() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ant-design/plus-circle-outlined'));
    });
  },
  'search-outlined': function searchOutlined() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ant-design/search-outlined'));
    });
  },
  'ant-design-gift-outlined': function antDesignGiftOutlined() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ant-design/gift-outlined'));
    });
  },
  'ant-design-youtube-filled': function antDesignYoutubeFilled() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ant-design/youtube-filled'));
    });
  },
  'question-circle-outlined': function questionCircleOutlined() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ant-design/question-circle-outlined'));
    });
  },
  // bi
  'arrow-left': function arrowLeft() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-bi/arrow-left'));
    });
  },
  'bi-phone': function biPhone() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-bi/phone'));
    });
  },
  // bx
  'bx-bx-ruble': function bxBxRuble() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-bx/bx-ruble'));
    });
  },
  'bx-check': function bxCheck() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-bx/bx-check'));
    });
  },
  'arrow-back': function arrowBack() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-bx/bx-arrow-back'));
    });
  },
  'bx-bx-building-house': function bxBxBuildingHouse() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-bx/bx-building-house'));
    });
  },
  'bx-bxs-error-alt': function bxBxsErrorAlt() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify-icons/bx/bxs-error-alt'));
    });
  },
  'bx-bxs-error': function bxBxsError() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify-icons/bx/bxs-error'));
    });
  },
  // codicon
  'chrome-close': function chromeClose() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-codicon/chrome-close'));
    });
  },
  // tabler
  'tabler-external-link': function tablerExternalLink() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-tabler/external-link'));
    });
  },
  // jam
  'jam-close': function jamClose() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-jam/close'));
    });
  },
  'jam-square-minus': function jamSquareMinus() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-jam/minus-rectangle-f'));
    });
  },
  'jam-square-plus': function jamSquarePlus() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-jam/plus-rectangle-f'));
    });
  },
  // carbon
  'carbon-email': function carbonEmail() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-carbon/email'));
    });
  },
  'carbon-diagram': function carbonDiagram() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-carbon/diagram'));
    });
  },
  'carbon-stop': function carbonStop() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify-icons/carbon/stop'));
    });
  },
  // clarity
  'clarity-import-line': function clarityImportLine() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify-icons/clarity/import-line'));
    });
  },
  // entypo
  'chevron-right': function chevronRight() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-entypo/chevron-right'));
    });
  },
  'chevron-left': function chevronLeft() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-entypo/chevron-left'));
    });
  },
  // ion
  'ion-checkmark-done': function ionCheckmarkDone() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/checkmark-done'));
    });
  },
  'ion-close': function ionClose() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/close'));
    });
  },
  'ion-archive-outline': function ionArchiveOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/archive-outline'));
    });
  },
  'ion-close-circle': function ionCloseCircle() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/close-circle'));
    });
  },
  'ion-close-circle-outline': function ionCloseCircleOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/close-circle-outline'));
    });
  },
  'ion-checkmark-circle-outline': function ionCheckmarkCircleOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/checkmark-circle-outline'));
    });
  },
  'ion-stats-chart': function ionStatsChart() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/stats-chart'));
    });
  },
  'ion-wallet-outline': function ionWalletOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/wallet-outline'));
    });
  },
  'ion-funnel-outline': function ionFunnelOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/funnel-outline'));
    });
  },
  'ion-megaphone-outline': function ionMegaphoneOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/megaphone-outline'));
    });
  },
  'ion-chatbox-outline': function ionChatboxOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/chatbox-outline'));
    });
  },
  'ion-exit-outline': function ionExitOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/exit-outline'));
    });
  },
  'ion-color-fill-outline': function ionColorFillOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/color-fill-outline'));
    });
  },
  'ion-document-outline': function ionDocumentOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/document-outline'));
    });
  },
  'ion-logo-vk': function ionLogoVk() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/logo-vk'));
    });
  },
  'ion-logo-instagram': function ionLogoInstagram() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/logo-instagram'));
    });
  },
  'ion-location-outline': function ionLocationOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/location-outline'));
    });
  },
  'ion-qr-code-outline': function ionQrCodeOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/qr-code-outline'));
    });
  },
  'ion-mail-outline': function ionMailOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/mail-outline'));
    });
  },
  'ion-phone-portrait-outline': function ionPhonePortraitOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/phone-portrait-outline'));
    });
  },
  'ion-barcode-outline': function ionBarcodeOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/barcode-outline'));
    });
  },
  'ion-warning': function ionWarning() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/warning'));
    });
  },
  'ion-attach': function ionAttach() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/attach-outline'));
    });
  },
  'ion-search-outline': function ionSearchOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/search-outline'));
    });
  },
  'ion-pause-outline': function ionPauseOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/pause-outline'));
    });
  },
  'ion-arrow-undo-outline': function ionArrowUndoOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/arrow-undo-outline'));
    });
  },
  'add-circle-outline': function addCircleOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ion/add-circle-outline'));
    });
  },
  // feather
  'feather-refresh-ccw': function featherRefreshCcw() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/refresh-ccw'));
    });
  },
  'feather-settings': function featherSettings() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/settings'));
    });
  },
  'feather-trash': function featherTrash() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/trash'));
    });
  },
  'feather-download': function featherDownload() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/download'));
    });
  },
  'feather-chevron-down': function featherChevronDown() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/chevron-down'));
    });
  },
  'feather-chevron-up': function featherChevronUp() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/chevron-up'));
    });
  },
  'feather-chevron-right': function featherChevronRight() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/chevron-right'));
    });
  },
  'feather-chevron-left': function featherChevronLeft() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/chevron-left'));
    });
  },
  'feather-phone': function featherPhone() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/phone'));
    });
  },
  'feather-mouse-pointer': function featherMousePointer() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/mouse-pointer'));
    });
  },
  'feather-more-vertical': function featherMoreVertical() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/more-vertical'));
    });
  },
  'feather-calendar': function featherCalendar() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/calendar'));
    });
  },
  'feather-clock': function featherClock() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/clock'));
    });
  },
  'feather-coffee': function featherCoffee() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/coffee'));
    });
  },
  'feather-plus-circle': function featherPlusCircle() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/plus-circle'));
    });
  },
  'feather-edit': function featherEdit() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/edit'));
    });
  },
  'feather-edit-2': function featherEdit2() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify-icons/feather/edit-2'));
    });
  },
  'feather-users': function featherUsers() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/users'));
    });
  },
  'feather-user': function featherUser() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/user'));
    });
  },
  'feather-shopping-bag': function featherShoppingBag() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/shopping-bag'));
    });
  },
  'feather-copy': function featherCopy() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/copy'));
    });
  },
  'feather-credit-card': function featherCreditCard() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/credit-card'));
    });
  },
  'feather-minus': function featherMinus() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/minus'));
    });
  },
  'feather-play': function featherPlay() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/play'));
    });
  },
  'feather-plus': function featherPlus() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/plus'));
    });
  },
  'feather-mic': function featherMic() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify-icons/feather/mic'));
    });
  },
  'feather-hash': function featherHash() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify-icons/feather/hash'));
    });
  },
  'feather-smile': function featherSmile() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify-icons/feather/smile'));
    });
  },
  'feather-send': function featherSend() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify-icons/feather/send'));
    });
  },
  'feather-star': function featherStar() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify-icons/feather/star'));
    });
  },
  'feather-volume': function featherVolume() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/volume'));
    });
  },
  'feather-volume-1': function featherVolume1() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-feather/volume-1'));
    });
  },
  'feather-check': function featherCheck() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify-icons/feather/check'));
    });
  },
  'feather-circle': function featherCircle() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify-icons/feather/circle'));
    });
  },
  // la
  'la-facebook-f': function laFacebookF() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-la/facebook-f'));
    });
  },
  // ls
  'ls-sort': function lsSort() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-ls/sort'));
    });
  },
  // typcn
  'typcn-forward-outline': function typcnForwardOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify-icons/typcn/arrow-forward-outline'));
    });
  },
  // mdi
  'mdi-square-rounded-outline': function mdiSquareRoundedOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-mdi/square-rounded-outline'));
    });
  },
  // octicon
  'octicon-chevron-up-16': function octiconChevronUp16() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-octicon/chevron-up-16'));
    });
  },
  'check-circle': function checkCircle() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-octicon/check-circle-24'));
    });
  },
  'octicon-triangle-up-24': function octiconTriangleUp24() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-octicon/triangle-up-24'));
    });
  },
  'octicon-triangle-down-24': function octiconTriangleDown24() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-octicon/triangle-down-24'));
    });
  },
  'octicon-check-16': function octiconCheck16() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-octicon/check-16'));
    });
  },
  'octicon-check-circle-fill-16': function octiconCheckCircleFill16() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-octicon/check-circle-fill-16'));
    });
  },
  // si-glyph
  'si-glyph-triangle-down': function siGlyphTriangleDown() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-si-glyph/triangle-down'));
    });
  },
  'si-glyph-triangle-up': function siGlyphTriangleUp() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-si-glyph/triangle-up'));
    });
  },
  // eva
  'eva-plus-outline': function evaPlusOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-eva/plus-outline'));
    });
  },
  'eva-info-fill': function evaInfoFill() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-eva/info-fill'));
    });
  },
  'eva-checkmark-outline': function evaCheckmarkOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-eva/checkmark-outline'));
    });
  },
  'eva-square-minus': function evaSquareMinus() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-eva/minus-square-fill'));
    });
  },
  'eva-square-outline': function evaSquareOutline() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@iconify/icons-eva/square-outline'));
    });
  }
};
exports.ICONIFY_ICONS = ICONIFY_ICONS;

var _loop = function _loop(icon) {
  // console.log('get icon', icon)
  ICONIFY_ICONS[icon]().then(function (component) {
    // console.log('addIcon', icon)
    _vue2["default"].addIcon(icon, component["default"]);
  });
};

for (var icon in ICONIFY_ICONS) {
  _loop(icon);
}

_vue["default"].use(_vue2["default"]);