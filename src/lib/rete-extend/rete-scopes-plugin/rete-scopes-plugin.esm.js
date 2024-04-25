/*!
* rete-scopes-plugin v2.0.1
* (c) 2024 Vitaliy Stoliarov
* Released under the CC-BY-NC-SA-4.0 license.
* */
import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _get from '@babel/runtime/helpers/get';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import _inherits from '@babel/runtime/helpers/inherits';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import { NodeEditor, Scope } from 'rete';
import { BaseAreaPlugin } from 'rete-area-plugin';
import _typeof from '@babel/runtime/helpers/typeof';

function bringConnectionForward(id, props) {
  var view = props.area.connectionViews.get(id);
  if (view) {
    props.area.area.content.reorder(view.element, null);
  }
}
function bringConnectionBack(id, props) {
  var view = props.area.connectionViews.get(id);
  var content = props.area.area.content;
  if (view) {
    content.reorder(view.element, content.holder.firstChild);
  }
}
function bringForward(nodeId, props) {
  var view = props.area.nodeViews.get(nodeId);
  var connections = props.editor.getConnections().filter(function (c) {
    return nodeId === c.source || nodeId === c.target;
  });
  var children = props.editor.getNodes().filter(function (n) {
    return n.parent === nodeId;
  });
  connections.forEach(function (connection) {
    return bringConnectionForward(connection.id, props);
  });
  if (view) {
    props.area.area.content.reorder(view.element, null);
  }
  children.forEach(function (child) {
    return bringForward(child.id, props);
  });
}
function useOrdering(props) {
  // eslint-disable-next-line max-statements
  props.area.addPipe( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(context) {
      var id, connection;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(!(context instanceof Object) || !('type' in context))) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return", context);
          case 2:
            if (context.type === 'nodepicked') {
              bringForward(context.data.id, props);
            }
            if (!(context.type === 'connectioncreated')) {
              _context.next = 11;
              break;
            }
            id = context.data.id;
            connection = props.editor.getConnection(id);
            if (connection) {
              _context.next = 8;
              break;
            }
            throw new Error('connection was removed');
          case 8:
            bringConnectionBack(context.data.id, props);
            bringForward(connection.source, props);
            bringForward(connection.target, props);
          case 11:
            return _context.abrupt("return", context);
          case 12:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
}

function getNodesBoundingBox(nodes, _ref) {
  var area = _ref.area;
  var boxes = nodes.map(function (node) {
    var view = area.nodeViews.get(node.id);
    if (!view) throw new Error('view');
    return {
      position: view.position,
      width: node.width,
      height: node.height
    };
  });
  var left = Math.min.apply(Math, _toConsumableArray(boxes.map(function (b) {
    return b.position.x;
  })));
  var right = Math.max.apply(Math, _toConsumableArray(boxes.map(function (b) {
    return b.position.x + b.width;
  })));
  var top = Math.min.apply(Math, _toConsumableArray(boxes.map(function (b) {
    return b.position.y;
  })));
  var bottom = Math.max.apply(Math, _toConsumableArray(boxes.map(function (b) {
    return b.position.y + b.height;
  })));
  var width = right - left;
  var height = bottom - top;
  return {
    top: top,
    left: left,
    right: right,
    bottom: bottom,
    width: width,
    height: height
  };
}
function updateNodeSizes(node, size, _ref2) {
  var area = _ref2.area;
  var width = size.width,
    height = size.height;
  node.width = width;
  node.height = height;
  area.resize(node.id, width, height);
}

// eslint-disable-next-line max-statements
function resizeParent(_x, _x2, _x3) {
  return _resizeParent.apply(this, arguments);
}
function _resizeParent() {
  _resizeParent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(parent, agentParams, props) {
    var id, children, padding, size, _getNodesBoundingBox, top, left, width, height, outerWidth, outerHeight, outerTop, outerLeft, parentsParent;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          id = parent.id;
          children = props.editor.getNodes().filter(function (child) {
            return child.parent === id;
          }).filter(function (node) {
            return !agentParams.exclude(node.id);
          });
          padding = agentParams.padding(id);
          if (!(children.length === 0)) {
            _context.next = 8;
            break;
          }
          size = agentParams.size(id, {
            width: padding.left + padding.right,
            height: padding.top + padding.bottom
          });
          updateNodeSizes(parent, size, props);
          _context.next = 16;
          break;
        case 8:
          _getNodesBoundingBox = getNodesBoundingBox(children, props), top = _getNodesBoundingBox.top, left = _getNodesBoundingBox.left, width = _getNodesBoundingBox.width, height = _getNodesBoundingBox.height;
          outerWidth = width + padding.left + padding.right;
          outerHeight = height + padding.top + padding.bottom;
          outerTop = top - padding.top;
          outerLeft = left - padding.left;
          updateNodeSizes(parent, agentParams.size(id, {
            width: outerWidth,
            height: outerHeight
          }), props);
          _context.next = 16;
          return agentParams.translate(parent.id, outerLeft, outerTop);
        case 16:
          if (!parent.parent) {
            _context.next = 21;
            break;
          }
          parentsParent = props.editor.getNode(parent.parent);
          if (!parentsParent) {
            _context.next = 21;
            break;
          }
          _context.next = 21;
          return resizeParent(parentsParent, agentParams, props);
        case 21:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _resizeParent.apply(this, arguments);
}

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
// eslint-disable-next-line max-statements, max-len
function reassignParent(_x, _x2, _x3, _x4) {
  return _reassignParent.apply(this, arguments);
}
function _reassignParent() {
  _reassignParent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(ids, pointer, agentParams, props) {
    var nodes, overlayNodes, areaElements, overlayNodesWithIndex, topOverlayParent, formerParents, _iterator, _step, formerParent;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (ids.length) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return");
        case 2:
          nodes = ids.map(function (id) {
            return props.editor.getNode(id);
          }).filter(function (n) {
            return Boolean(n);
          });
          overlayNodes = props.editor.getNodes().filter(function (node) {
            return agentParams.elder(node.id);
          }).map(function (node) {
            var view = props.area.nodeViews.get(node.id);
            if (!view) throw new Error('node view');
            return {
              node: node,
              view: view
            };
          }).filter(function (_ref2) {
            var node = _ref2.node,
              view = _ref2.view;
            return !ids.includes(node.id) && pointer.x > view.position.x && pointer.y > view.position.y && pointer.x < view.position.x + node.width && pointer.y < view.position.y + node.height;
          });
          areaElements = Array.from(props.area.area.content.holder.childNodes);
          overlayNodesWithIndex = overlayNodes.map(function (_ref3) {
            var node = _ref3.node,
              view = _ref3.view;
            var index = areaElements.indexOf(view.element);
            return {
              node: node,
              view: view,
              index: index
            };
          });
          overlayNodesWithIndex.sort(function (a, b) {
            return b.index - a.index;
          });
          topOverlayParent = overlayNodesWithIndex[0];
          formerParents = nodes.map(function (node) {
            return node.parent;
          }).filter(function (id) {
            return Boolean(id);
          }).map(function (id) {
            var node = props.editor.getNode(id);
            if (!node) throw new Error('node');
            return node;
          }); // eslint-disable-next-line no-undefined
          nodes.forEach(function (node) {
            return node.parent = undefined;
          });
          if (!topOverlayParent) {
            _context.next = 14;
            break;
          }
          nodes.forEach(function (node) {
            return node.parent = topOverlayParent.node.id;
          });
          _context.next = 14;
          return resizeParent(topOverlayParent.node, agentParams, props);
        case 14:
          _iterator = _createForOfIteratorHelper(formerParents);
          _context.prev = 15;
          _iterator.s();
        case 17:
          if ((_step = _iterator.n()).done) {
            _context.next = 23;
            break;
          }
          formerParent = _step.value;
          _context.next = 21;
          return resizeParent(formerParent, agentParams, props);
        case 21:
          _context.next = 17;
          break;
        case 23:
          _context.next = 28;
          break;
        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](15);
          _iterator.e(_context.t0);
        case 28:
          _context.prev = 28;
          _iterator.f();
          return _context.finish(28);
        case 31:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[15, 25, 28, 31]]);
  }));
  return _reassignParent.apply(this, arguments);
}
function translateChildren(_x5, _x6, _x7) {
  return _translateChildren.apply(this, arguments);
}
function _translateChildren() {
  _translateChildren = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(id, _ref, props) {
    var position, previous, children;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          position = _ref.position, previous = _ref.previous;
          children = props.editor.getNodes().filter(function (n) {
            return n.parent === id;
          });
          _context3.next = 4;
          return Promise.all(children.map( /*#__PURE__*/function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(n) {
              var dx, dy, view, node, nodePosition;
              return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    dx = position.x - previous.x;
                    dy = position.y - previous.y;
                    view = props.area.nodeViews.get(n.id);
                    node = props.editor.getNode(n.id);
                    if (!(view && node && !node.selected)) {
                      _context2.next = 8;
                      break;
                    }
                    nodePosition = view.position;
                    _context2.next = 8;
                    return view.translate(nodePosition.x + dx, nodePosition.y + dy);
                  case 8:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2);
            }));
            return function (_x8) {
              return _ref4.apply(this, arguments);
            };
          }()));
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _translateChildren.apply(this, arguments);
}

function belongsTo(nodeId, ids, props) {
  var node = props.editor.getNode(nodeId);
  if (!node) throw new Error('node');
  if (ids.includes(nodeId)) return true;
  if (!node.parent) return false;
  if (belongsTo(node.parent, ids, props)) return true;
}
function hasSelectedParent(nodeId, props) {
  var node = props.editor.getNode(nodeId);
  if (!node) throw new Error('node');
  if (!node.parent) return false;
  var parent = props.editor.getNode(node.parent);
  if (!parent) throw new Error('node');
  if (parent.selected) return true;
  return hasSelectedParent(node.parent, props);
}
/**
 * keep track of currently moving nodes (to prevent infinite loop)
 */
function trackedTranslate(props) {
  var active = new Map();
  var increment = function increment(id) {
    return active.set(id, (active.get(id) || 0) + 1);
  };
  var decrement = function decrement(id) {
    return active.set(id, (active.get(id) || 0) - 1);
  };
  return {
    translate: function translate(id, x, y) {
      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var view, previous;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              view = props.area.nodeViews.get(id);
              if (view) {
                _context.next = 3;
                break;
              }
              throw new Error('cannot find parent node view');
            case 3:
              previous = view.position;
              if (!(previous.x !== x || previous.y !== y)) {
                _context.next = 9;
                break;
              }
              increment(id);
              _context.next = 8;
              return view.translate(x, y);
            case 8:
              decrement(id);
            case 9:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    },
    isTranslating: function isTranslating(id) {
      return (active.get(id) || 0) > 0;
    }
  };
}
function watchClearing(editor) {
  var state = false;
  editor.addPipe(function (context) {
    if (context.type === 'clear') {
      state = true;
    }
    if (context.type === 'cleared' || context.type === 'clearcancelled') {
      state = false;
    }
    return context;
  });
  return function () {
    return state;
  };
}

function useValidator(props) {
  var isClearing = watchClearing(props.editor);

  // eslint-disable-next-line max-statements
  props.area.addPipe(function (context) {
    if (!context || !(_typeof(context) === 'object' && 'type' in context)) return context;
    if (context.type === 'nodecreate') {
      var parentId = context.data.parent;
      if (parentId) {
        var parent = props.editor.getNodes().find(function (n) {
          return n.id === parentId;
        });
        if (!parent) throw new Error('parent node doesnt exist');
      }
    }
    if (context.type === 'noderemove' && !isClearing()) {
      var id = context.data.id;
      var child = props.editor.getNodes().find(function (n) {
        return n.parent === id;
      });
      if (child) throw new Error('cannot remove parent node with a children');
    }
    return context;
  });
}

var useScopeAgent = function useScopeAgent(params, _ref) {
  var area = _ref.area,
    editor = _ref.editor,
    scopes = _ref.scopes;
  var timeout = params.timeout || 250;
  var picked = null;
  var candidates = [];
  function cancel() {
    if (picked) {
      window.clearTimeout(picked.timeout);
      picked = null;
    }
  }
  function pick(id) {
    var timeoutId = window.setTimeout(function () {
      var _candidates;
      var selected = editor.getNodes().filter(function (n) {
        return n.selected;
      });
      var targets = selected.length ? selected.map(function (n) {
        return n.id;
      }) : [id];
      (_candidates = candidates).push.apply(_candidates, _toConsumableArray(targets));
      scopes.emit({
        type: 'scopepicked',
        data: {
          ids: targets
        }
      });
    }, timeout);
    picked = {
      timeout: timeoutId
    };
  }
  function release() {
    var list = _toConsumableArray(candidates);
    cancel();
    candidates = [];
    scopes.emit({
      type: 'scopereleased',
      data: {
        ids: list
      }
    });
    return list;
  }
  area.addPipe( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(context) {
      var pointer, ids;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(!(context instanceof Object) || !('type' in context))) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return", context);
          case 2:
            if (context.type === 'nodepicked') {
              pick(context.data.id);
            }
            if (context.type === 'nodetranslated') {
              cancel();
            }
            if (!(context.type === 'nodedragged')) {
              _context.next = 11;
              break;
            }
            pointer = area.area.pointer;
            ids = release();
            if (!(ids.length === 0)) {
              _context.next = 9;
              break;
            }
            return _context.abrupt("return");
          case 9:
            _context.next = 11;
            return reassignParent(ids, pointer, params, {
              area: area,
              editor: editor
            });
          case 11:
            return _context.abrupt("return", context);
          case 12:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
};
function useVisualEffects(params, _ref3) {
  var area = _ref3.area,
    editor = _ref3.editor,
    scopes = _ref3.scopes;
  var pickedNodes = getPickedNodes(scopes);
  var previousHighlighted = null;
  var clientPointerPostion = null;

  // eslint-disable-next-line max-statements
  function updateHighlightedScopes(position, nodes) {
    // 如果先前有高亮对象，先取消其高亮
    if (previousHighlighted) {
      var view = area.nodeViews.get(previousHighlighted);
      if (view && nodes.length) view.element.style.opacity = '0.4';
      previousHighlighted = null;
    }
    if (nodes.length) {
      var x = position.x,
        y = position.y;
      var elements = document.elementsFromPoint(x, y);
      var nodeViews = editor.getNodes().filter(function (node) {
        return params.elder(node.id);
      }).map(function (node) {
        var view = area.nodeViews.get(node.id);
        if (!view) throw new Error('view');
        return {
          node: node,
          view: view
        };
      });
      var intersectedNodes = elements.map(function (el) {
        return nodeViews.find(function (item) {
          return item.view.element === el;
        });
      }).filter(function (item) {
        return Boolean(item);
      });
      var nonSelected = intersectedNodes.filter(function (item) {
        return !item.node.selected;
      });
      // 从交互点出发，找到画布中交互点位置上的节点们，然后和画布中记录的节点做比对，找出交叉内容，之后剔除选中（正在拖拽的）的内容后，第一个交互点就是会进行拖入操作的。
      var first = nonSelected[0];
      if (first) {
        first.view.element.style.opacity = '0.8';
        previousHighlighted = first.node.id;
      }
    }
  }
  // eslint-disable-next-line max-statements
  scopes.addPipe(function (context) {
    if (context.type === 'scopepicked') {
      var ids = context.data.ids;

      // 未选中的节点统统改为虚化（opacity=0.4)
      editor.getNodes().filter(function (n) {
        return !ids.includes(n.id);
      }).forEach(function (node) {
        var view = area.nodeViews.get(node.id);
        if (view) view.element.style.opacity = '0.4';
      });
      if (clientPointerPostion) {
        updateHighlightedScopes(clientPointerPostion, pickedNodes);
      }
    }
    if (context.type === 'scopereleased') {
      var _ids = context.data.ids;

      // 未选中的节点统统解除虚化（opacity='')
      editor.getNodes().filter(function (n) {
        return !_ids.includes(n.id);
      }).forEach(function (node) {
        var view = area.nodeViews.get(node.id);
        if (view) view.element.style.opacity = '';
      });
      if (clientPointerPostion) {
        updateHighlightedScopes(clientPointerPostion, pickedNodes);
      }
    }
    if (context.type === 'pointermove') {
      clientPointerPostion = {
        x: context.data.event.clientX,
        y: context.data.event.clientY
      };
      updateHighlightedScopes(clientPointerPostion, pickedNodes);
    }
    return context;
  });
}

/**
 * Classic preset allowing capturing a node by long-pressing it and dropping it onto another node to make it a nested.
 * @returns Preset
 * @listens nodepicked
 * @listens nodetranslated
 * @listens nodedragged
 * @emits scopepicked
 * @emits scopereleased
 */
function setup() {
  return function (params, context) {
    useScopeAgent(params, context);
    useVisualEffects(params, context);
  };
}

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  setup: setup
});

/**
 * Presets for scopes plugin.
 * @module
 */

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  classic: index$1
});

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
/**
 * Props for `ScopesPlugin` class.
 */
/**
 * Signal types produced by ConnectionPlugin instance
 * @priority 10
 */
/**
 * Scope plugin. Responsible for user interaction with scopes (nested nodes, groups)
 * @priority 9
 * @listens nodetranslated
 * @listens noderemoved
 * @emits scopepicked
 * @emits scopereleased
 */
var ScopesPlugin = /*#__PURE__*/function (_Scope) {
  function ScopesPlugin(props) {
    var _this;
    _classCallCheck(this, ScopesPlugin);
    _this = _callSuper(this, ScopesPlugin, ['scopes']);
    _defineProperty(_this, "presets", []);
    _this.padding = (props === null || props === void 0 ? void 0 : props.padding) || function () {
      return {
        top: 40,
        left: 20,
        right: 20,
        bottom: 20
      };
    };
    _this.exclude = (props === null || props === void 0 ? void 0 : props.exclude) || function () {
      return false;
    };
    _this.size = (props === null || props === void 0 ? void 0 : props.size) || function (id, size) {
      return size;
    };
    _this.elder = (props === null || props === void 0 ? void 0 : props.elder) || function () {
      return true;
    };
    return _this;
  }

  // eslint-disable-next-line max-statements
  _inherits(ScopesPlugin, _Scope);
  return _createClass(ScopesPlugin, [{
    key: "setParent",
    value: function setParent(scope) {
      var _this2 = this;
      _get(_getPrototypeOf(ScopesPlugin.prototype), "setParent", this).call(this, scope);
      this.area = this.parentScope(BaseAreaPlugin);
      this.editor = this.area.parentScope(NodeEditor);
      var props = {
        editor: this.editor,
        area: this.area
      };
      var padding = this.padding,
        size = this.size,
        exclude = this.exclude,
        elder = this.elder;
      var pickedNodes = getPickedNodes(this);
      var _trackedTranslate = trackedTranslate(props),
        translate = _trackedTranslate.translate,
        isTranslating = _trackedTranslate.isTranslating;
      var agentParams = {
        padding: padding,
        size: size,
        exclude: exclude,
        elder: elder,
        translate: translate
      };
      useValidator(props);
      useOrdering(props);
      this.presets.forEach(function (preset) {
        preset(agentParams, _objectSpread(_objectSpread({}, props), {}, {
          scopes: _this2
        }));
      });

      // eslint-disable-next-line max-statements, complexity
      this.addPipe( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(context) {
          var _id, current, parent, hasAnySelectedParent, isPicked, parentId, _parent;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                if (!(context.type === 'nodetranslated')) {
                  _context.next = 15;
                  break;
                }
                _id = context.data.id;
                current = props.editor.getNode(_id);
                if (current) {
                  _context.next = 5;
                  break;
                }
                throw new Error('cannot find node');
              case 5:
                if (isTranslating(_id)) {
                  _context.next = 8;
                  break;
                }
                _context.next = 8;
                return translateChildren(_id, context.data, props);
              case 8:
                parent = current.parent ? props.editor.getNode(current.parent) : null;
                if (!(parent && !agentParams.exclude(_id))) {
                  _context.next = 15;
                  break;
                }
                hasAnySelectedParent = hasSelectedParent(_id, props);
                isPicked = belongsTo(current.id, pickedNodes, props);
                if (!(!hasAnySelectedParent && !isPicked)) {
                  _context.next = 15;
                  break;
                }
                _context.next = 15;
                return resizeParent(parent, agentParams, props);
              case 15:
                if (!(context.type === 'noderemoved')) {
                  _context.next = 21;
                  break;
                }
                parentId = context.data.parent;
                _parent = parentId && props.editor.getNode(parentId);
                if (!_parent) {
                  _context.next = 21;
                  break;
                }
                _context.next = 21;
                return resizeParent(_parent, agentParams, props);
              case 21:
                return _context.abrupt("return", context);
              case 22:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }

    /**
     * Adds a preset to the plugin.
     * @param preset Preset that is responsible for user interactions with scopes (e.g. assigning nodes to scopes)
     */
  }, {
    key: "addPreset",
    value: function addPreset(preset) {
      this.presets.push(preset);
    }
  }, {
    key: "isDependent",
    value: function isDependent(id) {
      var props = {
        editor: this.editor,
        area: this.area
      };
      var node = this.editor.getNode(id);
      return node && (node.selected || hasSelectedParent(id, props));
    }
  }]);
}(Scope);
function getPickedNodes(scopes) {
  var nodes = [];
  scopes.addPipe( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(context) {
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if ('type' in context) {
              _context2.next = 2;
              break;
            }
            return _context2.abrupt("return", context);
          case 2:
            if (context.type === 'scopepicked') {
              nodes.push.apply(nodes, _toConsumableArray(context.data.ids));
            }
            if (context.type === 'scopereleased') {
              nodes.splice.apply(nodes, [0, nodes.length].concat(_toConsumableArray(nodes.filter(function (id) {
                return !context.data.ids.includes(id);
              }))));
            }
            return _context2.abrupt("return", context);
          case 5:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
  return nodes;
}

export { index as Presets, ScopesPlugin, getPickedNodes };
//# sourceMappingURL=rete-scopes-plugin.esm.js.map
