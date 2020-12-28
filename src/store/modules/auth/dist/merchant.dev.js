"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _apiClient = _interopRequireDefault(require("@/api/api-client"));

var _session = _interopRequireDefault(require("@/utils/session"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  balanceOperations: [],
  tariffs: [],
  orders: []
};
var mutations = {
  BALANCE_OPERATIONS: function BALANCE_OPERATIONS(state, data) {
    state.balanceOperations = data;
  },
  SET_ORDERS: function SET_ORDERS(state, data) {
    state.orders = data;
  },
  SET_TARIFFS: function SET_TARIFFS(state, data) {
    state.tariffs = data;
  },
  ADD_ORDER: function ADD_ORDER(state, payload) {
    state.orders.push(payload);
  },
  REMOVE_ORDER: function REMOVE_ORDER(state, orderId) {
    var index = state.orders.findIndex(function (x) {
      return x.id === orderId;
    });

    if (index >= 0) {
      state.orders.splice(index, 1);
    }
  },
  UPDATE_MERCHANT_TARIFF: function UPDATE_MERCHANT_TARIFF(state, payload) {
    state.merchant = Object.assign(state.merchant, payload);
  }
};
var actions = {
  login: function login(_ref, user) {
    var commit, state, result;
    return regeneratorRuntime.async(function login$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            commit = _ref.commit, state = _ref.state;
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(_apiClient["default"].post('/api-cabinet/login/merchant', user));

          case 4:
            result = _context.sent;
            // console.log(result)
            commit('auth/auth/SET_AUTH', result, {
              root: true
            });
            _context.next = 12;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](1);
            commit('auth/auth/SET_AUTH', null, {
              root: true
            });
            throw _context.t0;

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 8]]);
  },
  read: function read(_ref2) {
    var commit, result;
    return regeneratorRuntime.async(function read$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            commit = _ref2.commit;
            _context2.prev = 1;
            _context2.next = 4;
            return regeneratorRuntime.awrap(_apiClient["default"].get('/api-cabinet/merchant'));

          case 4:
            result = _context2.sent;
            // console.log('/api-cabinet/merchant')
            // console.log(result)
            commit('auth/auth/SET_MERCHANT', result, {
              root: true
            });
            commit('auth/auth/SET_MERCHANT_ID', result.id, {
              root: true
            });

            _session["default"].set('merchant_id', result.id);

            _context2.next = 14;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](1);
            commit('auth/auth/SET_AUTH', null, {
              root: true
            });
            throw _context2.t0;

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[1, 10]]);
  },
  GetBalanceOperations: function GetBalanceOperations(_ref3) {
    var commit, rootGetters, result;
    return regeneratorRuntime.async(function GetBalanceOperations$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            commit = _ref3.commit, rootGetters = _ref3.rootGetters;
            console.log('GetBalanceOperations', rootGetters.merchantId);
            _context3.next = 4;
            return regeneratorRuntime.awrap(_apiClient["default"].get("/api/merchant/balance/operations?merchant_id=".concat(rootGetters.merchantId)));

          case 4:
            result = _context3.sent;
            commit('BALANCE_OPERATIONS', result);
            return _context3.abrupt("return", result);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  GetOrders: function GetOrders(_ref4) {
    var rootGetters, commit, result;
    return regeneratorRuntime.async(function GetOrders$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            rootGetters = _ref4.rootGetters, commit = _ref4.commit;
            _context4.next = 3;
            return regeneratorRuntime.awrap(_apiClient["default"].get("/api/merchant/order/list?merchant_id=".concat(rootGetters.merchantId)));

          case 3:
            result = _context4.sent;
            commit('SET_ORDERS', result);
            return _context4.abrupt("return", result);

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  GetOrderPdf: function GetOrderPdf(_ref5, order) {
    var rootGetters, commit;
    return regeneratorRuntime.async(function GetOrderPdf$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            rootGetters = _ref5.rootGetters, commit = _ref5.commit;
            _context5.next = 3;
            return regeneratorRuntime.awrap(_apiClient["default"].downloadFile('/api/merchant/order/pdf', {
              order_id: order.id
            }, "\u0421\u0447\u0435\u0442 \u2116".concat(order.number, ".pdf")));

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  CreateOrder: function CreateOrder(_ref6, _ref7) {
    var state, rootState, commit, value, method, result;
    return regeneratorRuntime.async(function CreateOrder$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            state = _ref6.state, rootState = _ref6.rootState, commit = _ref6.commit;
            value = _ref7.value, method = _ref7.method;
            _context6.next = 4;
            return regeneratorRuntime.awrap(_apiClient["default"].post('/api/merchant/order/create', {
              merchant_id: state.merchant.id,
              method: method,
              value: value
            }));

          case 4:
            result = _context6.sent;
            commit('ADD_ORDER', result);
            return _context6.abrupt("return", result);

          case 7:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  DeleteOrder: function DeleteOrder(_ref8, orderId) {
    var state, rootState, commit;
    return regeneratorRuntime.async(function DeleteOrder$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            state = _ref8.state, rootState = _ref8.rootState, commit = _ref8.commit;
            _context7.next = 3;
            return regeneratorRuntime.awrap(_apiClient["default"]["delete"]("/api/merchant/order/delete?order_id=".concat(orderId)));

          case 3:
            commit('REMOVE_ORDER', orderId);

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    });
  },
  GetAvaibleTariffs: function GetAvaibleTariffs(_ref9) {
    var state, commit, result;
    return regeneratorRuntime.async(function GetAvaibleTariffs$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            state = _ref9.state, commit = _ref9.commit;
            _context8.next = 3;
            return regeneratorRuntime.awrap(_apiClient["default"].get('/api/tariff/list'));

          case 3:
            result = _context8.sent;
            commit('SET_TARIFFS', result);
            return _context8.abrupt("return", result);

          case 6:
          case "end":
            return _context8.stop();
        }
      }
    });
  },
  ChangeTariff: function ChangeTariff(_ref10, _ref11) {
    var state, commit, merchant_id, tariff_id, result;
    return regeneratorRuntime.async(function ChangeTariff$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            state = _ref10.state, commit = _ref10.commit;
            merchant_id = _ref11.merchant_id, tariff_id = _ref11.tariff_id;
            _context9.next = 4;
            return regeneratorRuntime.awrap(_apiClient["default"].post('/api/merchant/tariff/change', {
              merchant_id: merchant_id,
              tariff_id: tariff_id
            }));

          case 4:
            result = _context9.sent;
            commit('update_merchant_tariff', result);
            return _context9.abrupt("return", result);

          case 7:
          case "end":
            return _context9.stop();
        }
      }
    });
  },
  ChangeAutoRenewTariff: function ChangeAutoRenewTariff(_ref12, _ref13) {
    var state, commit, merchant_id, auto_renew, result;
    return regeneratorRuntime.async(function ChangeAutoRenewTariff$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            state = _ref12.state, commit = _ref12.commit;
            merchant_id = _ref13.merchant_id, auto_renew = _ref13.auto_renew;
            _context10.next = 4;
            return regeneratorRuntime.awrap(_apiClient["default"].post('/api/merchant/tariff/autorenew', {
              merchant_id: merchant_id,
              auto_renew: auto_renew
            }));

          case 4:
            result = _context10.sent;
            commit('update_merchant_tariff', result);
            return _context10.abrupt("return", result);

          case 7:
          case "end":
            return _context10.stop();
        }
      }
    });
  },
  RenewTariff: function RenewTariff(_ref14, _ref15) {
    var state, commit, merchant_id, result;
    return regeneratorRuntime.async(function RenewTariff$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            state = _ref14.state, commit = _ref14.commit;
            merchant_id = _ref15.merchant_id;
            _context11.next = 4;
            return regeneratorRuntime.awrap(_apiClient["default"].post('/api/merchant/tariff/renew', {
              merchant_id: merchant_id
            }));

          case 4:
            result = _context11.sent;
            commit('update_merchant_tariff', result);
            return _context11.abrupt("return", result);

          case 7:
          case "end":
            return _context11.stop();
        }
      }
    });
  }
};
var getters = {
  balanceOperations: function balanceOperations(state) {
    return state.balanceOperations;
  },
  orders: function orders(state) {
    return state.orders;
  },
  tariffs: function tariffs(state) {
    return state.tariffs;
  }
};
var _default = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
};
exports["default"] = _default;