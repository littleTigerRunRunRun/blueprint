/*!
* rete-area-plugin v2.0.4
* (c) 2024 Vitaliy Stoliarov
* Released under the MIT license.
* */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _asyncToGenerator = require('@babel/runtime/helpers/asyncToGenerator');
var _typeof = require('@babel/runtime/helpers/typeof');
var _classCallCheck = require('@babel/runtime/helpers/classCallCheck');
var _createClass = require('@babel/runtime/helpers/createClass');
var _possibleConstructorReturn = require('@babel/runtime/helpers/possibleConstructorReturn');
var _getPrototypeOf = require('@babel/runtime/helpers/getPrototypeOf');
var _inherits = require('@babel/runtime/helpers/inherits');
var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var _regeneratorRuntime = require('@babel/runtime/regenerator');
var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var rete = require('rete');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var _classCallCheck__default = /*#__PURE__*/_interopDefaultLegacy(_classCallCheck);
var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);
var _possibleConstructorReturn__default = /*#__PURE__*/_interopDefaultLegacy(_possibleConstructorReturn);
var _getPrototypeOf__default = /*#__PURE__*/_interopDefaultLegacy(_getPrototypeOf);
var _inherits__default = /*#__PURE__*/_interopDefaultLegacy(_inherits);
var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);

var Content = /*#__PURE__*/function () {
  function Content(reordered) {
    _classCallCheck__default["default"](this, Content);
    this.reordered = reordered;
    this.holder = document.createElement('div');
    this.holder.style.transformOrigin = '0 0';
  }
  return _createClass__default["default"](Content, [{
    key: "getPointerFrom",
    value: function getPointerFrom(event) {
      var _this$holder$getBound = this.holder.getBoundingClientRect(),
        left = _this$holder$getBound.left,
        top = _this$holder$getBound.top;
      var x = event.clientX - left;
      var y = event.clientY - top;
      return {
        x: x,
        y: y
      };
    }
  }, {
    key: "add",
    value: function add(element) {
      this.holder.appendChild(element);
    }

    // eslint-disable-next-line no-undef
  }, {
    key: "reorder",
    value: function () {
      var _reorder = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee(target, next) {
        return _regeneratorRuntime__default["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (this.holder.contains(target)) {
                _context.next = 2;
                break;
              }
              throw new Error("content doesn't have 'target' for reordering");
            case 2:
              if (!(next !== null && !this.holder.contains(next))) {
                _context.next = 4;
                break;
              }
              throw new Error("content doesn't have 'next' for reordering");
            case 4:
              this.holder.insertBefore(target, next);
              _context.next = 7;
              return this.reordered(target);
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function reorder(_x, _x2) {
        return _reorder.apply(this, arguments);
      }
      return reorder;
    }()
  }, {
    key: "remove",
    value: function remove(element) {
      this.holder.removeChild(element);
    }
  }]);
}();

/**
 * listen to pointerdown, window's pointermove and pointerup events,
 * where last two not active before pointerdown triggered for performance reasons
 */
function usePointerListener(element, handlers) {
  var move = function move(event) {
    handlers.move(event);
  };
  var up = function up(event) {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', up);
    handlers.up(event);
  };
  var down = function down(event) {
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    handlers.down(event);
  };
  element.addEventListener('pointerdown', down);
  return {
    destroy: function destroy() {
      element.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    }
  };
}

/**
 * Bounding box
 */
var min = function min(arr) {
  return arr.length === 0 ? 0 : Math.min.apply(Math, _toConsumableArray__default["default"](arr));
};
var max = function max(arr) {
  return arr.length === 0 ? 0 : Math.max.apply(Math, _toConsumableArray__default["default"](arr));
};
function getBoundingBox$1(rects) {
  var left = min(rects.map(function (rect) {
    return rect.position.x;
  }));
  var top = min(rects.map(function (rect) {
    return rect.position.y;
  }));
  var right = max(rects.map(function (rect) {
    return rect.position.x + rect.width;
  }));
  var bottom = max(rects.map(function (rect) {
    return rect.position.y + rect.height;
  }));
  return {
    left: left,
    right: right,
    top: top,
    bottom: bottom,
    width: Math.abs(left - right),
    height: Math.abs(top - bottom),
    center: {
      x: (left + right) / 2,
      y: (top + bottom) / 2
    }
  };
}

function ownKeys$4(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$4(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$4(Object(t), !0).forEach(function (r) { _defineProperty__default["default"](e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Drag handler, used to handle dragging of the area and nodes. Can be extended to add custom behavior.
 */
var Drag = /*#__PURE__*/function () {
  function Drag(guards) {
    var _this = this;
    _classCallCheck__default["default"](this, Drag);
    _defineProperty__default["default"](this, "down", function (e) {
      if (!_this.guards.down(e)) return;
      e.stopPropagation();
      _this.pointerStart = {
        x: e.pageX,
        y: e.pageY
      };
      _this.startPosition = _objectSpread$4({}, _this.config.getCurrentPosition());
      _this.events.start(e);
    });
    _defineProperty__default["default"](this, "move", function (e) {
      if (!_this.pointerStart || !_this.startPosition) return;
      if (!_this.guards.move(e)) return;
      e.preventDefault();
      var delta = {
        x: e.pageX - _this.pointerStart.x,
        y: e.pageY - _this.pointerStart.y
      };
      var zoom = _this.config.getZoom();
      var x = _this.startPosition.x + delta.x / zoom;
      var y = _this.startPosition.y + delta.y / zoom;
      _this.events.translate(x, y, e);
    });
    _defineProperty__default["default"](this, "up", function (e) {
      if (!_this.pointerStart) return;
      delete _this.pointerStart;
      _this.events.drag(e);
    });
    this.guards = guards || {
      down: function down(e) {
        return !(e.pointerType === 'mouse' && e.button !== 0);
      },
      move: function move() {
        return true;
      }
    };
  }
  return _createClass__default["default"](Drag, [{
    key: "initialize",
    value: function initialize(element, config, events) {
      this.config = config;
      this.events = events;
      element.style.touchAction = 'none';
      this.pointerListener = usePointerListener(element, {
        down: this.down,
        move: this.move,
        up: this.up
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.pointerListener.destroy();
    }
  }]);
}();

/**
 * Zoom source
 */

/**
 * Zoom class, used to handle zooming of the area. Can be extended to add custom behavior.
 * @internal
 */
var Zoom = /*#__PURE__*/function () {
  function Zoom(intensity, filter) {
    var _this = this;
    _classCallCheck__default["default"](this, Zoom);
    _defineProperty__default["default"](this, "previous", null);
    _defineProperty__default["default"](this, "pointers", []);
    _defineProperty__default["default"](this, "wheel", function (e) {
      e.preventDefault();
      var _this$element$getBoun = _this.element.getBoundingClientRect(),
        left = _this$element$getBoun.left,
        top = _this$element$getBoun.top;
      var isNegative = e.deltaY < 0;
      var delta = isNegative ? _this.intensity : -_this.intensity;
      var ox = (left - e.clientX) * delta;
      var oy = (top - e.clientY) * delta;
      _this.onzoom(delta, ox, oy, 'wheel');
    });
    _defineProperty__default["default"](this, "down", function (e) {
      _this.pointers.push(e);
    });
    _defineProperty__default["default"](this, "move", function (e) {
      _this.pointers = _this.pointers.map(function (p) {
        return p.pointerId === e.pointerId ? e : p;
      });
      if (!_this.isTranslating()) return;
      var _this$element$getBoun2 = _this.element.getBoundingClientRect(),
        left = _this$element$getBoun2.left,
        top = _this$element$getBoun2.top;
      var _this$getTouches = _this.getTouches(),
        cx = _this$getTouches.cx,
        cy = _this$getTouches.cy,
        distance = _this$getTouches.distance;
      if (_this.previous !== null && _this.previous.distance > 0) {
        var _delta = distance / _this.previous.distance - 1;
        var _ox = (left - cx) * _delta;
        var _oy = (top - cy) * _delta;
        _this.onzoom(_delta, _ox - (_this.previous.cx - cx), _oy - (_this.previous.cy - cy), 'touch');
      }
      _this.previous = {
        cx: cx,
        cy: cy,
        distance: distance
      };
    });
    _defineProperty__default["default"](this, "contextmenu", function () {
      _this.pointers = [];
    });
    _defineProperty__default["default"](this, "up", function (e) {
      _this.previous = null;
      _this.pointers = _this.pointers.filter(function (p) {
        return p.pointerId !== e.pointerId;
      });
    });
    _defineProperty__default["default"](this, "dblclick", function (e) {
      var _this$filter;
      e.preventDefault();
      var _this$element$getBoun3 = _this.element.getBoundingClientRect(),
        left = _this$element$getBoun3.left,
        top = _this$element$getBoun3.top;
      var delta = (((_this$filter = _this.filter) === null || _this$filter === void 0 ? void 0 : _this$filter.dblclick) || function (n) {
        return n;
      })(4 * _this.intensity);
      if (delta === 0) return;
      var ox = (left - e.clientX) * delta;
      var oy = (top - e.clientY) * delta;
      _this.onzoom(delta, ox, oy, 'dblclick');
    });
    this.intensity = intensity;
    this.filter = filter;
  }
  return _createClass__default["default"](Zoom, [{
    key: "initialize",
    value: function initialize(container, element, onzoom) {
      this.container = container;
      this.element = element;
      this.onzoom = onzoom;
      this.container.addEventListener('wheel', this.wheel);
      this.container.addEventListener('pointerdown', this.down);
      this.container.addEventListener('dblclick', this.dblclick);
      window.addEventListener('pointermove', this.move);
      window.addEventListener('pointerup', this.up);
      window.addEventListener('contextmenu', this.contextmenu);
      window.addEventListener('pointercancel', this.up);
    }
  }, {
    key: "getTouches",
    value: function getTouches() {
      var e = {
        touches: this.pointers
      };
      var _ref = [e.touches[0].clientX, e.touches[0].clientY],
        x1 = _ref[0],
        y1 = _ref[1];
      var _ref2 = [e.touches[1].clientX, e.touches[1].clientY],
        x2 = _ref2[0],
        y2 = _ref2[1];
      var distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
      return {
        cx: (x1 + x2) / 2,
        cy: (y1 + y2) / 2,
        distance: distance
      };
    }
  }, {
    key: "isTranslating",
    value: function isTranslating() {
      // is translating while zoom (works on multitouch)
      return this.pointers.length >= 2;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.container.removeEventListener('wheel', this.wheel);
      this.container.removeEventListener('pointerdown', this.down);
      this.container.removeEventListener('dblclick', this.dblclick);
      window.removeEventListener('pointermove', this.move);
      window.removeEventListener('pointerup', this.up);
      window.removeEventListener('pointercancel', this.up);
    }
  }]);
}();

var Area = /*#__PURE__*/function () {
  function Area(container, events, guards, filter) {
    var _this = this;
    _classCallCheck__default["default"](this, Area);
    _defineProperty__default["default"](this, "transform", {
      k: 1,
      x: 0,
      y: 0
    });
    _defineProperty__default["default"](this, "pointer", {
      x: 0,
      y: 0
    });
    _defineProperty__default["default"](this, "zoomHandler", null);
    _defineProperty__default["default"](this, "dragHandler", null);
    _defineProperty__default["default"](this, "pointerdown", function (event) {
      _this.setPointerFrom(event);
      _this.events.pointerDown(_this.pointer, event);
    });
    _defineProperty__default["default"](this, "pointermove", function (event) {
      _this.setPointerFrom(event);
      _this.events.pointerMove(_this.pointer, event);
    });
    _defineProperty__default["default"](this, "pointerup", function (event) {
      _this.setPointerFrom(event);
      _this.events.pointerUp(_this.pointer, event);
    });
    _defineProperty__default["default"](this, "resize", function (event) {
      _this.events.resize(event);
    });
    _defineProperty__default["default"](this, "onTranslate", function (x, y) {
      if (_this.zoomHandler && _this.zoomHandler.isTranslating()) return; // lock translation while zoom on multitouch
      _this.translate(x, y);
    });
    _defineProperty__default["default"](this, "onZoom", function (delta, ox, oy, source) {
      _this.zoom(_this.transform.k * (1 + delta), ox, oy, source);
      _this.update();
    });
    this.container = container;
    this.events = events;
    this.guards = guards;
    this.filter = filter;
    this.content = new Content(function (element) {
      return _this.events.reordered(element);
    });
    this.content.holder.style.transformOrigin = '0 0';
    this.setZoomHandler(new Zoom(0.1, filter === null || filter === void 0 ? void 0 : filter.zoom));
    this.setDragHandler(new Drag());
    this.container.addEventListener('pointerdown', this.pointerdown);
    this.container.addEventListener('pointermove', this.pointermove);
    window.addEventListener('pointerup', this.pointerup);
    window.addEventListener('resize', this.resize);
    container.appendChild(this.content.holder);
    this.update();
  }
  return _createClass__default["default"](Area, [{
    key: "update",
    value: function update() {
      var _this$transform = this.transform,
        x = _this$transform.x,
        y = _this$transform.y,
        k = _this$transform.k;
      this.content.holder.style.transform = "translate(".concat(x, "px, ").concat(y, "px) scale(").concat(k, ")");
    }

    /**
     * Drag handler. Destroy previous drag handler if exists.
     * @param drag drag handler
     * @example area.area.setDragHandler(null) // disable drag
     */
  }, {
    key: "setDragHandler",
    value: function setDragHandler(drag) {
      var _this2 = this;
      if (this.dragHandler) this.dragHandler.destroy();
      this.dragHandler = drag;
      if (this.dragHandler) this.dragHandler.initialize(this.container, {
        getCurrentPosition: function getCurrentPosition() {
          return _this2.transform;
        },
        getZoom: function getZoom() {
          return 1;
        }
      }, {
        start: function start() {
          return null;
        },
        translate: this.onTranslate,
        drag: function drag() {
          return null;
        }
      });
    }

    /**
     * Set zoom handler. Destroy previous zoom handler if exists.
     * @param zoom zoom handler
     * @example area.area.setZoomHandler(null) // disable zoom
     */
  }, {
    key: "setZoomHandler",
    value: function setZoomHandler(zoom) {
      if (this.zoomHandler) this.zoomHandler.destroy();
      this.zoomHandler = zoom;
      if (this.zoomHandler) this.zoomHandler.initialize(this.container, this.content.holder, this.onZoom);
    }
  }, {
    key: "setPointerFrom",
    value: function setPointerFrom(event) {
      var _this$content$getPoin = this.content.getPointerFrom(event),
        x = _this$content$getPoin.x,
        y = _this$content$getPoin.y;
      var k = this.transform.k;
      this.pointer = {
        x: x / k,
        y: y / k
      };
    }
  }, {
    key: "translate",
    value: (
    /**
     * Change position of the area
     * @param x desired x coordinate
     * @param y desired y coordinate
     * @returns true if the translation was successful, false otherwise
     * @emits translate
     * @emits translated
     */
    function () {
      var _translate = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee(x, y) {
        var position, result;
        return _regeneratorRuntime__default["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              position = {
                x: x,
                y: y
              };
              _context.next = 3;
              return this.guards.translate({
                previous: this.transform,
                position: position
              });
            case 3:
              result = _context.sent;
              if (result) {
                _context.next = 6;
                break;
              }
              return _context.abrupt("return", false);
            case 6:
              this.transform.x = result.data.position.x;
              this.transform.y = result.data.position.y;
              this.update();
              _context.next = 11;
              return this.events.translated(result.data);
            case 11:
              return _context.abrupt("return", true);
            case 12:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function translate(_x, _x2) {
        return _translate.apply(this, arguments);
      }
      return translate;
    }()
    /**
     * Change zoom level of the area
     * @param zoom new zoom level
     * @param ox x coordinate of the origin of the zoom
     * @param oy y coordinate of the origin of the zoom
     * @param source source of the zoom
     * @returns true if the zoom was successful, false otherwise
     * @emits zoom
     * @emits zoomed
     */
    )
  }, {
    key: "zoom",
    value: (function () {
      var _zoom2 = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee2(_zoom) {
        var ox,
          oy,
          source,
          k,
          result,
          d,
          _args2 = arguments;
        return _regeneratorRuntime__default["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              ox = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 0;
              oy = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 0;
              source = _args2.length > 3 ? _args2[3] : undefined;
              k = this.transform.k;
              _context2.next = 6;
              return this.guards.zoom({
                previous: this.transform,
                zoom: _zoom,
                source: source
              });
            case 6:
              result = _context2.sent;
              if (result) {
                _context2.next = 9;
                break;
              }
              return _context2.abrupt("return", true);
            case 9:
              d = (k - result.data.zoom) / (k - _zoom || 1);
              this.transform.k = result.data.zoom || 1;
              this.transform.x += ox * d;
              this.transform.y += oy * d;
              this.update();
              _context2.next = 16;
              return this.events.zoomed(result.data);
            case 16:
              return _context2.abrupt("return", false);
            case 17:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function zoom(_x3) {
        return _zoom2.apply(this, arguments);
      }
      return zoom;
    }())
  }, {
    key: "destroy",
    value: function destroy() {
      this.container.removeEventListener('pointerdown', this.pointerdown);
      this.container.removeEventListener('pointermove', this.pointermove);
      window.removeEventListener('pointerup', this.pointerup);
      window.removeEventListener('resize', this.resize);
      if (this.dragHandler) this.dragHandler.destroy();
      if (this.zoomHandler) this.zoomHandler.destroy();
      this.content.holder.innerHTML = '';
    }
  }]);
}();

function _callSuper$1(t, o, e) { return o = _getPrototypeOf__default["default"](o), _possibleConstructorReturn__default["default"](t, _isNativeReflectConstruct$1() ? Reflect.construct(o, e || [], _getPrototypeOf__default["default"](t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct$1() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct$1 = function _isNativeReflectConstruct() { return !!t; })(); }

/**
 * A union of all possible signals that can be emitted by any area plugin
 * @priority 10
 */

/**
 * Base abstract class for area plugins that provides a common interface
 * @abstract
 */
var BaseAreaPlugin = /*#__PURE__*/function (_Scope) {
  function BaseAreaPlugin() {
    _classCallCheck__default["default"](this, BaseAreaPlugin);
    return _callSuper$1(this, BaseAreaPlugin, arguments);
  }
  _inherits__default["default"](BaseAreaPlugin, _Scope);
  return _createClass__default["default"](BaseAreaPlugin);
}(rete.Scope);

var ConnectionView = /*#__PURE__*/_createClass__default["default"](function ConnectionView(events) {
  _classCallCheck__default["default"](this, ConnectionView);
  this.element = document.createElement('div');
  this.element.style.position = 'absolute';
  this.element.style.left = '0';
  this.element.style.top = '0';
  this.element.addEventListener('contextmenu', function (event) {
    return events.contextmenu(event);
  });
});

var ElementsHolder = /*#__PURE__*/function () {
  function ElementsHolder() {
    _classCallCheck__default["default"](this, ElementsHolder);
    _defineProperty__default["default"](this, "views", new WeakMap());
    _defineProperty__default["default"](this, "viewsElements", new Map());
  }
  return _createClass__default["default"](ElementsHolder, [{
    key: "set",
    value: function set(context) {
      var element = context.element,
        type = context.type,
        payload = context.payload;
      if (payload !== null && payload !== void 0 && payload.id) {
        this.views.set(element, context);
        this.viewsElements.set("".concat(type, "_").concat(payload.id), element);
      }
    }
  }, {
    key: "get",
    value: function get(type, id) {
      var element = this.viewsElements.get("".concat(type, "_").concat(id));
      return element && this.views.get(element);
    }
  }, {
    key: "delete",
    value: function _delete(element) {
      var _view$payload;
      var view = this.views.get(element);
      if (view && (_view$payload = view.payload) !== null && _view$payload !== void 0 && _view$payload.id) {
        this.views["delete"](element);
        this.viewsElements["delete"]("".concat(view.type, "_").concat(view.payload.id));
      }
    }
  }]);
}();

function ownKeys$3(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$3(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$3(Object(t), !0).forEach(function (r) { _defineProperty__default["default"](e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var NodeView = /*#__PURE__*/function () {
  function NodeView(getZoom, events, guards) {
    var _this = this;
    _classCallCheck__default["default"](this, NodeView);
    _defineProperty__default["default"](this, "translate", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee(x, y) {
        var previous, translation;
        return _regeneratorRuntime__default["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              previous = _objectSpread$3({}, _this.position);
              _context.next = 3;
              return _this.guards.translate({
                previous: previous,
                position: {
                  x: x,
                  y: y
                }
              });
            case 3:
              translation = _context.sent;
              if (translation) {
                _context.next = 6;
                break;
              }
              return _context.abrupt("return", false);
            case 6:
              _this.position = _objectSpread$3({}, translation.data.position);
              _this.element.style.transform = "translate(".concat(_this.position.x, "px, ").concat(_this.position.y, "px)");
              _context.next = 10;
              return _this.events.translated({
                position: _this.position,
                previous: previous
              });
            case 10:
              return _context.abrupt("return", true);
            case 11:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
    _defineProperty__default["default"](this, "resize", /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee2(width, height) {
        var size, el;
        return _regeneratorRuntime__default["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              size = {
                width: width,
                height: height
              };
              _context2.next = 3;
              return _this.guards.resize({
                size: size
              });
            case 3:
              if (_context2.sent) {
                _context2.next = 5;
                break;
              }
              return _context2.abrupt("return", false);
            case 5:
              el = _this.element.querySelector('*:not(span)');
              if (!(!el || !(el instanceof HTMLElement))) {
                _context2.next = 8;
                break;
              }
              return _context2.abrupt("return", false);
            case 8:
              el.style.width = "".concat(width, "px");
              el.style.height = "".concat(height, "px");
              _context2.next = 12;
              return _this.events.resized({
                size: size
              });
            case 12:
              return _context2.abrupt("return", true);
            case 13:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }());
    this.getZoom = getZoom;
    this.events = events;
    this.guards = guards;
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.position = {
      x: 0,
      y: 0
    };
    this.translate(0, 0);
    this.element.addEventListener('contextmenu', function (event) {
      return _this.events.contextmenu(event);
    });
    this.dragHandler = new Drag();
    this.dragHandler.initialize(this.element, {
      getCurrentPosition: function getCurrentPosition() {
        return _this.position;
      },
      getZoom: function getZoom() {
        return _this.getZoom();
      }
    }, {
      start: this.events.picked,
      translate: this.translate,
      drag: this.events.dragged
    });
  }
  return _createClass__default["default"](NodeView, [{
    key: "destroy",
    value: function destroy() {
      this.dragHandler.destroy();
    }
  }]);
}();

function getNodesRect(nodes, views) {
  return nodes.map(function (node) {
    return {
      view: views.get(node.id),
      node: node
    };
  }).filter(function (item) {
    return item.view;
  }).map(function (_ref) {
    var view = _ref.view,
      node = _ref.node;
    var width = node.width,
      height = node.height;
    if (typeof width !== 'undefined' && typeof height !== 'undefined') {
      return {
        position: view.position,
        width: width,
        height: height
      };
    }
    return {
      position: view.position,
      width: view.element.clientWidth,
      height: view.element.clientHeight
    };
  });
}

/**
 * Get the bounding box of the given nodes
 * @param plugin The area plugin
 * @param nodes The nodes to get the bounding box of
 * @returns The bounding box
 */
function getBoundingBox(plugin, nodes) {
  var editor = plugin.parentScope(rete.NodeEditor);
  var list = nodes.map(function (node) {
    return _typeof__default["default"](node) === 'object' ? node : editor.getNode(node);
  });
  var rects = getNodesRect(list, plugin.nodeViews);
  return getBoundingBox$1(rects);
}

/**
 * Simple nodes order extension
 * @param base The base area plugin
 * @listens nodepicked
 * @listens connectioncreated
 */
function simpleNodesOrder(base) {
  var area = base;
  area.addPipe(function (context) {
    if (!context || _typeof__default["default"](context) !== 'object' || !('type' in context)) return context;
    if (context.type === 'nodepicked') {
      var view = area.nodeViews.get(context.data.id);
      var content = area.area.content;
      if (view) {
        content.reorder(view.element, null);
      }
    }
    if (context.type === 'connectioncreated') {
      var _view = area.connectionViews.get(context.data.id);
      var _content = area.area.content;
      if (_view) {
        _content.reorder(_view.element, _content.holder.firstChild);
      }
    }
    return context;
  });
}

function ownKeys$2(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$2(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$2(Object(t), !0).forEach(function (r) { _defineProperty__default["default"](e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Restrictor extension parameters
 */

/**
 * Restrictor extension. Restricts the area zoom and position
 * @param plugin The area plugin
 * @param params The restrictor parameters
 * @listens zoom
 * @listens zoomed
 * @listens translated
 */
function restrictor(plugin, params) {
  var scaling = params !== null && params !== void 0 && params.scaling ? params.scaling === true ? {
    min: 0.1,
    max: 1
  } : params.scaling : false;
  var translation = params !== null && params !== void 0 && params.translation ? params.translation === true ? {
    left: 0,
    top: 0,
    right: 1000,
    bottom: 1000
  } : params.translation : false;
  function restrictZoom(zoom) {
    if (!scaling) throw new Error('scaling param isnt defined');
    var _ref = typeof scaling === 'function' ? scaling() : scaling,
      min = _ref.min,
      max = _ref.max;
    if (zoom < min) {
      return min;
    } else if (zoom > max) {
      return max;
    }
    return zoom;
  }

  // eslint-disable-next-line max-statements
  function restrictPosition(position) {
    if (!translation) throw new Error('translation param isnt defined');
    var nextPosition = _objectSpread$2({}, position);
    var _ref2 = typeof translation === 'function' ? translation() : translation,
      left = _ref2.left,
      top = _ref2.top,
      right = _ref2.right,
      bottom = _ref2.bottom;
    if (nextPosition.x < left) {
      nextPosition.x = left;
    }
    if (nextPosition.x > right) {
      nextPosition.x = right;
    }
    if (nextPosition.y < top) {
      nextPosition.y = top;
    }
    if (nextPosition.y > bottom) {
      nextPosition.y = bottom;
    }
    return nextPosition;
  }
  plugin.addPipe(function (context) {
    if (!context || _typeof__default["default"](context) !== 'object' || !('type' in context)) return context;
    if (scaling && context.type === 'zoom') {
      return _objectSpread$2(_objectSpread$2({}, context), {}, {
        data: _objectSpread$2(_objectSpread$2({}, context.data), {}, {
          zoom: restrictZoom(context.data.zoom)
        })
      });
    }
    if (translation && context.type === 'zoomed') {
      var position = restrictPosition(plugin.area.transform);
      plugin.area.translate(position.x, position.y);
    }
    if (translation && context.type === 'translate') {
      return _objectSpread$2(_objectSpread$2({}, context), {}, {
        data: _objectSpread$2(_objectSpread$2({}, context.data), {}, {
          position: restrictPosition(context.data.position)
        })
      });
    }
    return context;
  });
}

/**
 * Selector's accumulate function, activated when the ctrl key is pressed
 */
function accumulateOnCtrl() {
  var pressed = false;
  function keydown(e) {
    if (e.key === 'Control') pressed = true;
  }
  function keyup(e) {
    if (e.key === 'Control') pressed = false;
  }
  document.addEventListener('keydown', keydown);
  document.addEventListener('keyup', keyup);
  return {
    active: function active() {
      return pressed;
    },
    destroy: function destroy() {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('keyup', keyup);
    }
  };
}
/**
 * Selector class. Used to collect selected entities (nodes, connections, etc.) and synchronize them (select, unselect, translate, etc.).
 * Can be extended to add custom functionality.
 */
var Selector = /*#__PURE__*/function () {
  function Selector() {
    _classCallCheck__default["default"](this, Selector);
    _defineProperty__default["default"](this, "entities", new Map());
    _defineProperty__default["default"](this, "pickId", null);
  }
  return _createClass__default["default"](Selector, [{
    key: "isSelected",
    value: function isSelected(entity) {
      return this.entities.has("".concat(entity.label, "_").concat(entity.id));
    }
  }, {
    key: "add",
    value: function add(entity, accumulate) {
      if (!accumulate) this.unselectAll();
      this.entities.set("".concat(entity.label, "_").concat(entity.id), entity);
    }
  }, {
    key: "remove",
    value: function remove(entity) {
      var id = "".concat(entity.label, "_").concat(entity.id);
      var item = this.entities.get(id);
      if (item) {
        this.entities["delete"](id);
        item.unselect();
      }
    }
  }, {
    key: "unselectAll",
    value: function unselectAll() {
      var _this = this;
      _toConsumableArray__default["default"](Array.from(this.entities.values())).forEach(function (item) {
        return _this.remove(item);
      });
    }
  }, {
    key: "translate",
    value: function translate(dx, dy) {
      var _this2 = this;
      this.entities.forEach(function (item) {
        return !_this2.isPicked(item) && item.translate(dx, dy);
      });
    }
  }, {
    key: "pick",
    value: function pick(entity) {
      this.pickId = "".concat(entity.label, "_").concat(entity.id);
    }
  }, {
    key: "release",
    value: function release() {
      this.pickId = null;
    }
  }, {
    key: "isPicked",
    value: function isPicked(entity) {
      return this.pickId === "".concat(entity.label, "_").concat(entity.id);
    }
  }]);
}();

/**
 * Selector factory, uses default Selector class
 * @returns Selector instance
 */
function selector() {
  return new Selector();
}

/**
 * Accumulating interface, used to determine whether to accumulate entities on selection
 */

/**
 * Selectable nodes extension. Adds the ability to select nodes in the area.
 * @param base BaseAreaPlugin instance
 * @param core Selectable instance
 * @param options.accumulating Accumulating interface
 * @listens nodepicked
 * @listens nodetranslated
 * @listens pointerdown
 * @listens pointermove
 * @listens pointerup
 */
function selectableNodes(base, core, options) {
  var editor = null;
  var area = base;
  var getEditor = function getEditor() {
    return editor || (editor = area.parentScope(rete.NodeEditor));
  };
  var twitch = 0;
  function selectNode(node) {
    if (!node.selected) {
      node.selected = true;
      area.update('node', node.id);
    }
  }
  function unselectNode(node) {
    if (node.selected) {
      node.selected = false;
      area.update('node', node.id);
    }
  }
  /**
   * Select node programmatically
   * @param nodeId Node id
   * @param accumulate Whether to accumulate nodes on selection
   */
  function add(nodeId, accumulate) {
    var node = getEditor().getNode(nodeId);
    if (!node) return;
    core.add({
      label: 'node',
      id: node.id,
      translate: function translate(dx, dy) {
        var view = area.nodeViews.get(node.id);
        var current = view === null || view === void 0 ? void 0 : view.position;
        if (current) {
          view.translate(current.x + dx, current.y + dy);
        }
      },
      unselect: function unselect() {
        unselectNode(node);
      }
    }, accumulate);
    selectNode(node);
  }
  /**
   * Unselect node programmatically
   * @param nodeId Node id
   */
  function remove(nodeId) {
    core.remove({
      id: nodeId,
      label: 'node'
    });
  }

  // eslint-disable-next-line max-statements, complexity
  area.addPipe(function (context) {
    if (!context || _typeof__default["default"](context) !== 'object' || !('type' in context)) return context;
    if (context.type === 'nodepicked') {
      var pickedId = context.data.id;
      var accumulate = options.accumulating.active();
      core.pick({
        id: pickedId,
        label: 'node'
      });
      twitch = null;
      add(pickedId, accumulate);
    } else if (context.type === 'nodetranslated') {
      var _context$data = context.data,
        id = _context$data.id,
        position = _context$data.position,
        previous = _context$data.previous;
      var _dx = position.x - previous.x;
      var _dy = position.y - previous.y;
      if (core.isPicked({
        id: id,
        label: 'node'
      })) {
        core.translate(_dx, _dy);
      }
    } else if (context.type === 'pointerdown') {
      twitch = 0;
    } else if (context.type === 'pointermove') {
      if (twitch !== null) twitch++;
    } else if (context.type === 'pointerup') {
      if (twitch !== null && twitch < 4) {
        core.unselectAll();
      }
      twitch = null;
    }
    return context;
  });
  return {
    select: add,
    unselect: remove
  };
}

/**
 * Show input control extension. It will show the input's control when there is no connection and hide it when there is a connection.
 * @param area The base area plugin
 * @param visible The visible function
 * @listens connectioncreated
 * @listens connectionremoved
 */
function showInputControl(area, visible) {
  var editor = null;
  var getEditor = function getEditor() {
    return editor || (editor = area.parentScope(rete.NodeEditor));
  };
  function updateInputControlVisibility(target, targetInput) {
    var node = getEditor().getNode(target);
    if (!node) return;
    var input = node.inputs[targetInput];
    if (!input) throw new Error('cannot find input');
    var previous = input.showControl;
    var connections = getEditor().getConnections();
    var hasAnyConnection = Boolean(connections.find(function (connection) {
      return connection.target === target && connection.targetInput === targetInput;
    }));
    input.showControl = visible ? visible({
      hasAnyConnection: hasAnyConnection,
      input: input
    }) : !hasAnyConnection;
    if (input.showControl !== previous) {
      area.update('node', node.id);
    }
  }
  area.addPipe(function (context) {
    if (context.type === 'connectioncreated' || context.type === 'connectionremoved') {
      updateInputControlVisibility(context.data.target, context.data.targetInput);
    }
    return context;
  });
}

function ownKeys$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1(Object(t), !0).forEach(function (r) { _defineProperty__default["default"](e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Snap grid extension parameters
 */

/**
 * Snap grid extension
 * @param base The base area plugin
 * @param params The snap parameters
 * @listens nodetranslate
 * @listens nodedragged
 */
function snapGrid(base, params) {
  var area = base;
  var size = typeof (params === null || params === void 0 ? void 0 : params.size) === 'undefined' ? 16 : params.size;
  var dynamic = typeof (params === null || params === void 0 ? void 0 : params.dynamic) === 'undefined' ? true : params.dynamic;
  function snap(value) {
    return Math.round(value / size) * size;
  }
  area.addPipe(function (context) {
    if (!context || _typeof__default["default"](context) !== 'object' || !('type' in context)) return context;
    if (dynamic && context.type === 'nodetranslate') {
      var position = context.data.position;
      var x = snap(position.x);
      var y = snap(position.y);
      return _objectSpread$1(_objectSpread$1({}, context), {}, {
        data: _objectSpread$1(_objectSpread$1({}, context.data), {}, {
          position: {
            x: x,
            y: y
          }
        })
      });
    }
    if (!dynamic && context.type === 'nodedragged') {
      var view = area.nodeViews.get(context.data.id);
      if (view) {
        var _view$position = view.position,
          _x = _view$position.x,
          _y = _view$position.y;
        view.translate(snap(_x), snap(_y));
      }
    }
    return context;
  });
}

/**
 * Zoom extension parameters
 */

/**
 * Zooms the area to fit the given nodes
 * @param plugin The area plugin
 * @param nodes The nodes to fit
 * @param params The zoom parameters
 */
// eslint-disable-next-line max-statements, max-len
function zoomAt(_x, _x2, _x3) {
  return _zoomAt.apply(this, arguments);
}
function _zoomAt() {
  _zoomAt = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee(plugin, nodes, params) {
    var _ref, _ref$scale, scale, editor, list, rects, boundingBox, _ref2, w, h, kw, kh, k;
    return _regeneratorRuntime__default["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _ref = params || {}, _ref$scale = _ref.scale, scale = _ref$scale === void 0 ? 0.9 : _ref$scale;
          editor = plugin.parentScope(rete.NodeEditor);
          list = nodes.map(function (node) {
            return _typeof__default["default"](node) === 'object' ? node : editor.getNode(node);
          });
          rects = getNodesRect(list, plugin.nodeViews);
          boundingBox = getBoundingBox$1(rects);
          _ref2 = [plugin.container.clientWidth, plugin.container.clientHeight], w = _ref2[0], h = _ref2[1];
          kw = w / boundingBox.width, kh = h / boundingBox.height;
          k = Math.min(kh * scale, kw * scale, 1);
          plugin.area.transform.x = w / 2 - boundingBox.center.x * k;
          plugin.area.transform.y = h / 2 - boundingBox.center.y * k;
          _context.next = 12;
          return plugin.area.zoom(k, 0, 0);
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _zoomAt.apply(this, arguments);
}

/**
 * Area extensions
 * @priority 7
 * @module Extensions
 */

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getBoundingBox: getBoundingBox,
  simpleNodesOrder: simpleNodesOrder,
  restrictor: restrictor,
  accumulateOnCtrl: accumulateOnCtrl,
  selectableNodes: selectableNodes,
  Selector: Selector,
  selector: selector,
  showInputControl: showInputControl,
  snapGrid: snapGrid,
  zoomAt: zoomAt
});

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty__default["default"](e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf__default["default"](o), _possibleConstructorReturn__default["default"](t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf__default["default"](t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }

/**
 * A union of all possible signals that can be emitted by the area
 * @priority 9
 */

/**
 * A plugin that provides a 2D area for nodes and connections
 * @priority 8
 * @emits render
 * @emits rendered
 * @emits unmount
 * @listens nodecreated
 * @listens noderemoved
 * @listens connectioncreated
 * @listens connectionremoved
 */
var AreaPlugin = /*#__PURE__*/function (_BaseAreaPlugin) {
  function AreaPlugin(container, filter) {
    var _this;
    _classCallCheck__default["default"](this, AreaPlugin);
    _this = _callSuper(this, AreaPlugin, ['area']);
    _defineProperty__default["default"](_this, "nodeViews", new Map());
    _defineProperty__default["default"](_this, "connectionViews", new Map());
    _defineProperty__default["default"](_this, "elements", new ElementsHolder());
    _defineProperty__default["default"](_this, "onContextMenu", function (event) {
      _this.emit({
        type: 'contextmenu',
        data: {
          event: event,
          context: 'root'
        }
      });
    });
    _this.container = container;
    container.style.overflow = 'hidden';
    container.addEventListener('contextmenu', _this.onContextMenu);

    // eslint-disable-next-line max-statements
    _this.addPipe(function (context) {
      if (!context || !(_typeof__default["default"](context) === 'object' && 'type' in context)) return context;
      if (context.type === 'nodecreated') {
        _this.addNodeView(context.data);
      }
      if (context.type === 'noderemoved') {
        _this.removeNodeView(context.data.id);
      }
      if (context.type === 'connectioncreated') {
        _this.addConnectionView(context.data);
      }
      if (context.type === 'connectionremoved') {
        _this.removeConnectionView(context.data.id);
      }
      if (context.type === 'render') {
        _this.elements.set(context.data);
      }
      if (context.type === 'unmount') {
        _this.elements["delete"](context.data.element);
      }
      return context;
    });
    _this.area = new Area(container, {
      zoomed: function zoomed(params) {
        return _this.emit({
          type: 'zoomed',
          data: params
        });
      },
      pointerDown: function pointerDown(position, event) {
        return _this.emit({
          type: 'pointerdown',
          data: {
            position: position,
            event: event
          }
        });
      },
      pointerMove: function pointerMove(position, event) {
        return _this.emit({
          type: 'pointermove',
          data: {
            position: position,
            event: event
          }
        });
      },
      pointerUp: function pointerUp(position, event) {
        return _this.emit({
          type: 'pointerup',
          data: {
            position: position,
            event: event
          }
        });
      },
      resize: function resize(event) {
        return _this.emit({
          type: 'resized',
          data: {
            event: event
          }
        });
      },
      translated: function translated(params) {
        return _this.emit({
          type: 'translated',
          data: params
        });
      },
      reordered: function reordered(element) {
        return _this.emit({
          type: 'reordered',
          data: {
            element: element
          }
        });
      }
    }, {
      translate: function translate(params) {
        return _this.emit({
          type: 'translate',
          data: params
        });
      },
      zoom: function zoom(params) {
        return _this.emit({
          type: 'zoom',
          data: params
        });
      }
    }, filter || {});
    return _this;
  }
  _inherits__default["default"](AreaPlugin, _BaseAreaPlugin);
  return _createClass__default["default"](AreaPlugin, [{
    key: "addNodeView",
    value: function addNodeView(node) {
      var _this2 = this;
      var id = node.id;
      var view = new NodeView(function () {
        return _this2.area.transform.k;
      }, {
        picked: function picked() {
          return _this2.emit({
            type: 'nodepicked',
            data: {
              id: id
            }
          });
        },
        translated: function translated(data) {
          return _this2.emit({
            type: 'nodetranslated',
            data: _objectSpread({
              id: id
            }, data)
          });
        },
        dragged: function dragged() {
          return _this2.emit({
            type: 'nodedragged',
            data: node
          });
        },
        contextmenu: function contextmenu(event) {
          return _this2.emit({
            type: 'contextmenu',
            data: {
              event: event,
              context: node
            }
          });
        },
        resized: function resized(_ref) {
          var size = _ref.size;
          return _this2.emit({
            type: 'noderesized',
            data: {
              id: node.id,
              size: size
            }
          });
        }
      }, {
        translate: function translate(data) {
          var _this2$area$filter$mo;
          if ((_this2$area$filter$mo = _this2.area.filter.move) !== null && _this2$area$filter$mo !== void 0 && _this2$area$filter$mo.limit) {
            data.position = _this2.area.filter.move.limit(data.position.x, data.position.y, id);
          }
          return _this2.emit({
            type: 'nodetranslate',
            data: _objectSpread({
              id: id
            }, data)
          });
        },
        resize: function resize(_ref2) {
          var size = _ref2.size;
          return _this2.emit({
            type: 'noderesize',
            data: {
              id: node.id,
              size: size
            }
          });
        }
      });
      this.nodeViews.set(id, view);
      this.area.content.add(view.element);
      this.emit({
        type: 'render',
        data: {
          element: view.element,
          type: 'node',
          payload: node
        }
      });
      return view;
    }
  }, {
    key: "removeNodeView",
    value: function removeNodeView(id) {
      var view = this.nodeViews.get(id);
      if (view) {
        this.emit({
          type: 'unmount',
          data: {
            element: view.element
          }
        });
        this.nodeViews["delete"](id);
        this.area.content.remove(view.element);
      }
    }
  }, {
    key: "addConnectionView",
    value: function addConnectionView(connection) {
      var _this3 = this;
      var view = new ConnectionView({
        contextmenu: function contextmenu(event) {
          return _this3.emit({
            type: 'contextmenu',
            data: {
              event: event,
              context: connection
            }
          });
        }
      });
      this.connectionViews.set(connection.id, view);
      this.area.content.add(view.element);
      this.emit({
        type: 'render',
        data: {
          element: view.element,
          type: 'connection',
          payload: connection
        }
      });
      return view;
    }
  }, {
    key: "removeConnectionView",
    value: function removeConnectionView(id) {
      var view = this.connectionViews.get(id);
      if (view) {
        this.emit({
          type: 'unmount',
          data: {
            element: view.element
          }
        });
        this.connectionViews["delete"](id);
        this.area.content.remove(view.element);
      }
    }

    /**
     * Force update rendered element by id (node, connection, etc.)
     * @param type Element type
     * @param id Element id
     * @emits render
     */
  }, {
    key: "update",
    value: (function () {
      var _update = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee(type, id) {
        var data;
        return _regeneratorRuntime__default["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              data = this.elements.get(type, id);
              if (!data) {
                _context.next = 4;
                break;
              }
              _context.next = 4;
              return this.emit({
                type: 'render',
                data: data
              });
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function update(_x, _x2) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
    /**
     * Resize node
     * @param id Node id
     * @param width Desired width
     * @param height Desired height
     */
    )
  }, {
    key: "resize",
    value: (function () {
      var _resize = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee2(id, width, height) {
        var view;
        return _regeneratorRuntime__default["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              view = this.nodeViews.get(id);
              if (!view) {
                _context2.next = 5;
                break;
              }
              _context2.next = 4;
              return view.resize(width, height);
            case 4:
              return _context2.abrupt("return", _context2.sent);
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function resize(_x3, _x4, _x5) {
        return _resize.apply(this, arguments);
      }
      return resize;
    }()
    /**
     * Translate node to position
     * @param id Node id
     * @param position Position
     */
    )
  }, {
    key: "translate",
    value: (function () {
      var _translate = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee3(id, _ref3) {
        var x, y, view;
        return _regeneratorRuntime__default["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              x = _ref3.x, y = _ref3.y;
              view = this.nodeViews.get(id);
              if (!view) {
                _context3.next = 6;
                break;
              }
              _context3.next = 5;
              return view.translate(x, y);
            case 5:
              return _context3.abrupt("return", _context3.sent);
            case 6:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function translate(_x6, _x7) {
        return _translate.apply(this, arguments);
      }
      return translate;
    }()
    /**
     * Destroy all views and remove all event listeners
     */
    )
  }, {
    key: "destroy",
    value: function destroy() {
      var _this4 = this;
      this.container.removeEventListener('contextmenu', this.onContextMenu);
      Array.from(this.connectionViews.keys()).forEach(function (id) {
        return _this4.removeConnectionView(id);
      });
      Array.from(this.nodeViews.keys()).forEach(function (id) {
        return _this4.removeNodeView(id);
      });
      this.area.destroy();
    }
  }]);
}(BaseAreaPlugin);

exports.Area = Area;
exports.AreaExtensions = index;
exports.AreaPlugin = AreaPlugin;
exports.BaseAreaPlugin = BaseAreaPlugin;
exports.Drag = Drag;
exports.NodeView = NodeView;
exports.Zoom = Zoom;
exports.usePointerListener = usePointerListener;
//# sourceMappingURL=rete-area-plugin.common.js.map
