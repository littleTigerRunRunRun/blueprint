/*!
* rete-vue-plugin v2.1.2
* (c) 2026 Vitaliy Stoliarov
* Released under the MIT license.
* */
function ___$insertStylesToHeader(css) {
  if (!css) {
    return
  }
  if (typeof window === 'undefined') {
    return
  }

  const style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css
}

import _typeof from '@babel/runtime/helpers/typeof';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import _get from '@babel/runtime/helpers/get';
import _inherits from '@babel/runtime/helpers/inherits';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import { ClassicPreset, Scope } from 'rete';
import { ref, markRaw, createApp, h, openBlock, createElementBlock, createElementVNode, createBlock, resolveDynamicComponent, withModifiers, mergeProps, resolveComponent, normalizeClass, normalizeStyle, toDisplayString, createCommentVNode, Fragment, renderList, createVNode, withDirectives, vShow, renderSlot, withCtx, createTextVNode } from 'vue';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import { getDOMSocketPosition, loopConnectionPath, classicConnectionPath } from 'rete-render-utils';
import { BaseAreaPlugin } from 'rete-area-plugin';

function ownKeys$4(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$4(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$4(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function create(element, component, payload, onRendered, props) {
  var state = ref(markRaw(payload));
  var context = {
    render: function render() {
      // @ts-ignore
      return h(component, _objectSpread$4(_objectSpread$4({}, state.value), {}, {
        seed: Math.random()
      }));
    },
    mounted: function mounted() {
      onRendered();
    },
    updated: function updated() {
      onRendered();
    }
  };
  var app = props !== null && props !== void 0 && props.setup ? props.setup(context) : createApp(context);
  app.mount(element);
  return {
    app: app,
    payload: state
  };
}
function update(instance, payload) {
  instance.payload.value = markRaw(_objectSpread$4(_objectSpread$4({}, instance.payload.value), payload));
}
function destroy(instance) {
  instance.app.unmount();
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
function getRenderer(props) {
  var instances = new Map();
  return {
    get: function get(element) {
      return instances.get(element);
    },
    mount: function mount(element, vueComponent, payload, onRendered) {
      var app = create(element, vueComponent, payload, onRendered, props);
      instances.set(element, app);
      return app;
    },
    update: function update$1(app, payload) {
      update(app, payload);
    },
    unmount: function unmount(element) {
      var app = instances.get(element);
      if (app) {
        destroy(app);
        instances["delete"](element);
      }
    }
  };
}

const _hoisted_1$7 = { "data-testid": "connection" };
const _hoisted_2$1 = ["d"];

function render$d(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$7, [
    createElementVNode("path", { d: $props.path }, null, 8 /* PROPS */, _hoisted_2$1)
  ]))
}

___$insertStylesToHeader("/*! https://github.com/retejs/connection-plugin/commit/206ca0fd7fb82801ac45a0f7180ae05dff9ed901 */\nsvg[data-v-fee8858e] {\n  overflow: visible !important;\n  position: absolute;\n  pointer-events: none;\n  width: 9999px;\n  height: 9999px;\n}\nsvg[data-v-fee8858e] path[data-v-fee8858e] {\n  fill: none;\n  stroke-width: 5px;\n  stroke: steelblue;\n  pointer-events: auto;\n}");

var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _sfc_main$e = {
  props: ['data', 'start', 'end', 'path']
};
var Connection = /*#__PURE__*/_export_sfc(_sfc_main$e, [['render',render$d],['__scopeId',"data-v-fee8858e"],['__file',"C:\\Users\\Administrator\\Desktop\\vue-plugin\\src\\presets\\classic\\components\\Connection.vue"]]);

function render$c(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.component), {
    data: $props.data,
    start: $options.startPosition,
    end: $options.endPosition,
    path: $data.observedPath
  }, null, 8 /* PROPS */, ["data", "start", "end", "path"]))
}

const _sfc_main$d = {
  props: ['component', 'data', 'start', 'end', 'path'],
  data() {
    return {
      observedStart: { x: 0, y: 0 },
      observedEnd: { x: 0, y: 0 },
      observedPath: '',
      onDestroy: null
    }
  },
  computed: {
    startPosition() {
      if (this.start && 'x' in this.start) return this.start
      return this.observedStart
    },
    endPosition() {
      if (this.end && 'x' in this.end) return this.end
      return this.observedEnd
    }
  },
  watch: {
    startPosition() { this.fetchPath(); },
    endPosition() { this.fetchPath(); }
  },
  methods: {
    async fetchPath() {
      if (this.startPosition && this.endPosition) {
        this.observedPath = await this.path(this.startPosition, this.endPosition);
      }
    }
  },
  created() {
    const unwatch1 = typeof this.start === 'function' && this.start(pos => {
      this.observedStart = pos;
    });
    const unwatch2 = typeof this.end === 'function' && this.end(pos => {
      this.observedEnd = pos;
    });

    this.onDestroy = () => {
      unwatch1 && unwatch1();
      unwatch2 && unwatch2();
    };
  },
  destroyed() {
    if (this.onDestroy) this.onDestroy();
  }
};
var ConnectionWrapper = /*#__PURE__*/_export_sfc(_sfc_main$d, [['render',render$c],['__file',"C:\\Users\\Administrator\\Desktop\\vue-plugin\\src\\presets\\classic\\components\\ConnectionWrapper.vue"]]);

const _hoisted_1$6 = ["type", "value", "readonly"];

function render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("input", {
    type: $props.data.type,
    value: $props.data.value,
    readonly: $props.data.readonly,
    onInput: _cache[0] || (_cache[0] = (...args) => ($options.change && $options.change(...args))),
    onPointerdown: _cache[1] || (_cache[1] = withModifiers(() => {}, ["stop"]))
  }, null, 40 /* PROPS, NEED_HYDRATION */, _hoisted_1$6))
}

___$insertStylesToHeader("input[data-v-a4adbbb3] {\n  width: 100%;\n  border-radius: 30px;\n  background-color: white;\n  padding: 2px 6px;\n  border: 1px solid #999;\n  font-size: 110%;\n  box-sizing: border-box;\n}");

const _sfc_main$c = {
  props: ['data'],
  methods: {
    change(e) {
      const val = this.data.type === 'number'
        ? +e.target.value
        : e.target.value;

      this.data.setValue(val);
    }
  }
};
var Control = /*#__PURE__*/_export_sfc(_sfc_main$c, [['render',render$b],['__scopeId',"data-v-a4adbbb3"],['__file',"C:\\Users\\Administrator\\Desktop\\vue-plugin\\src\\presets\\classic\\components\\Control.vue"]]);

function render$a(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", mergeProps(_ctx.$props, { ref: "element" }), null, 16 /* FULL_PROPS */))
}

const _sfc_main$b = {
  props: ['data', 'emit'],
  mounted() {
    this.emit({ type: 'render', data: { ...this.data, element: this.$refs.element } });
  },
  beforeDestroy() {
    this.emit({ type: 'unmount', data: { element: this.$refs.element } });
  },
  beforeUnmount() {
    this.emit({ type: 'unmount', data: { element: this.$refs.element } });
  }
};
var Ref = /*#__PURE__*/_export_sfc(_sfc_main$b, [['render',render$a],['__file',"C:\\Users\\Administrator\\Desktop\\vue-plugin\\src\\Ref.vue"]]);

const _hoisted_1$5 = {
  class: "title",
  "data-testid": "title"
};
const _hoisted_2 = ["data-testid"];
const _hoisted_3 = {
  class: "output-title",
  "data-testid": "output-title"
};
const _hoisted_4 = ["data-testid"];

function render$9(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Ref = resolveComponent("Ref");

  return (openBlock(), createElementBlock("div", {
    class: normalizeClass(["node", { selected: $props.data.selected }]),
    style: normalizeStyle($options.nodeStyles()),
    "data-testid": "node"
  }, [
    createElementVNode("div", _hoisted_1$5, toDisplayString($props.data.label), 1 /* TEXT */),
    createCommentVNode(" Outputs"),
    (openBlock(true), createElementBlock(Fragment, null, renderList($options.outputs(), ([key, output]) => {
      return (openBlock(), createElementBlock("div", {
        class: "output",
        key: 'output' + key + $props.seed,
        "data-testid": 'output-'+key
      }, [
        createElementVNode("div", _hoisted_3, toDisplayString(output.label), 1 /* TEXT */),
        createVNode(_component_Ref, {
          class: "output-socket",
          data: { type: 'socket', side: 'output', key: key, nodeId: $props.data.id, payload: output.socket },
          emit: $props.emit,
          "data-testid": "output-socket"
        }, null, 8 /* PROPS */, ["data", "emit"])
      ], 8 /* PROPS */, _hoisted_2))
    }), 128 /* KEYED_FRAGMENT */)),
    createCommentVNode(" Controls"),
    (openBlock(true), createElementBlock(Fragment, null, renderList($options.controls(), ([key, control]) => {
      return (openBlock(), createBlock(_component_Ref, {
        class: "control",
        key: 'control' + key + $props.seed,
        "data-testid": 'control-'+key,
        emit: $props.emit,
        data: { type: 'control', payload: control }
      }, null, 8 /* PROPS */, ["data-testid", "emit", "data"]))
    }), 128 /* KEYED_FRAGMENT */)),
    createCommentVNode(" Inputs"),
    (openBlock(true), createElementBlock(Fragment, null, renderList($options.inputs(), ([key, input]) => {
      return (openBlock(), createElementBlock("div", {
        class: "input",
        key: 'input' + key + $props.seed,
        "data-testid": 'input-'+key
      }, [
        createVNode(_component_Ref, {
          class: "input-socket",
          data: { type: 'socket', side: 'input', key: key, nodeId: $props.data.id, payload: input.socket },
          emit: $props.emit,
          "data-testid": "input-socket"
        }, null, 8 /* PROPS */, ["data", "emit"]),
        withDirectives(createElementVNode("div", {
          class: "input-title",
          "data-testid": "input-title"
        }, toDisplayString(input.label), 513 /* TEXT, NEED_PATCH */), [
          [vShow, !input.control || !input.showControl]
        ]),
        withDirectives(createVNode(_component_Ref, {
          class: "input-control",
          emit: $props.emit,
          data: { type: 'control', payload: input.control },
          "data-testid": "input-control"
        }, null, 8 /* PROPS */, ["emit", "data"]), [
          [vShow, input.control && input.showControl]
        ])
      ], 8 /* PROPS */, _hoisted_4))
    }), 128 /* KEYED_FRAGMENT */))
  ], 6 /* CLASS, STYLE */))
}

___$insertStylesToHeader(".node[data-v-cc6bc301] {\n  background: rgba(110, 136, 255, 0.8);\n  border: 2px solid #4e58bf;\n  border-radius: 10px;\n  cursor: pointer;\n  box-sizing: border-box;\n  width: 180px;\n  height: auto;\n  padding-bottom: 6px;\n  position: relative;\n  user-select: none;\n  line-height: initial;\n  font-family: Arial;\n}\n.node[data-v-cc6bc301][data-v-cc6bc301]:hover {\n  background: rgba(130, 153, 255, 0.8);\n}\n.node[data-v-cc6bc301].selected[data-v-cc6bc301] {\n  background: #ffd92c;\n  border-color: #e3c000;\n}\n.node[data-v-cc6bc301] .title[data-v-cc6bc301] {\n  color: white;\n  font-family: sans-serif;\n  font-size: 18px;\n  padding: 8px;\n}\n.node[data-v-cc6bc301] .output[data-v-cc6bc301] {\n  text-align: right;\n}\n.node[data-v-cc6bc301] .input[data-v-cc6bc301] {\n  text-align: left;\n}\n.node[data-v-cc6bc301] .output-socket[data-v-cc6bc301] {\n  text-align: right;\n  margin-right: -18px;\n  display: inline-block;\n}\n.node[data-v-cc6bc301] .input-socket[data-v-cc6bc301] {\n  text-align: left;\n  margin-left: -18px;\n  display: inline-block;\n}\n.node[data-v-cc6bc301] .input-title[data-v-cc6bc301],\n.node[data-v-cc6bc301] .output-title[data-v-cc6bc301] {\n  vertical-align: middle;\n  color: white;\n  display: inline-block;\n  font-family: sans-serif;\n  font-size: 14px;\n  margin: 6px;\n  line-height: 24px;\n}\n.node[data-v-cc6bc301] .input-control[data-v-cc6bc301] {\n  z-index: 1;\n  width: calc(100% - 36px);\n  vertical-align: middle;\n  display: inline-block;\n}\n.node[data-v-cc6bc301] .control[data-v-cc6bc301] {\n  padding: 6px 18px;\n}");

function sortByIndex(entries) {
  entries.sort((a, b) => {
    const ai = a[1] && a[1].index || 0;
    const bi = b[1] && b[1].index || 0;

    return ai - bi
  });
  return entries
}

const _sfc_main$a = {
  props: ['data', 'emit', 'seed'],
  methods: {
    nodeStyles() {
      return {
        width: Number.isFinite(this.data.width) ? `${this.data.width}px` : '',
        height: Number.isFinite(this.data.height) ? `${this.data.height}px` : ''
      }
    },
    inputs() {
      return sortByIndex(Object.entries(this.data.inputs))
    },
    controls() {
      return sortByIndex(Object.entries(this.data.controls))
    },
    outputs() {
      return sortByIndex(Object.entries(this.data.outputs))
    }
  },
  components: {
    Ref
  }
};
var Node = /*#__PURE__*/_export_sfc(_sfc_main$a, [['render',render$9],['__scopeId',"data-v-cc6bc301"],['__file',"C:\\Users\\Administrator\\Desktop\\vue-plugin\\src\\presets\\classic\\components\\Node.vue"]]);

const _hoisted_1$4 = ["title"];

function render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", {
    class: "socket",
    title: $props.data.name
  }, null, 8 /* PROPS */, _hoisted_1$4))
}

___$insertStylesToHeader(".socket[data-v-4a0a4b7f] {\n  display: inline-block;\n  cursor: pointer;\n  border: 1px solid white;\n  border-radius: 12px;\n  width: 24px;\n  height: 24px;\n  margin: 6px;\n  vertical-align: middle;\n  background: #96b38a;\n  z-index: 2;\n  box-sizing: border-box;\n}\n.socket[data-v-4a0a4b7f][data-v-4a0a4b7f]:hover {\n  border-width: 4px;\n}\n.socket[data-v-4a0a4b7f].multiple[data-v-4a0a4b7f] {\n  border-color: yellow;\n}\n.socket[data-v-4a0a4b7f].output[data-v-4a0a4b7f] {\n  margin-right: -12px;\n}\n.socket[data-v-4a0a4b7f].input[data-v-4a0a4b7f] {\n  margin-left: -12px;\n}");

const _sfc_main$9 = {
  props: ['data']
};
var Socket = /*#__PURE__*/_export_sfc(_sfc_main$9, [['render',render$8],['__scopeId',"data-v-4a0a4b7f"],['__file',"C:\\Users\\Administrator\\Desktop\\vue-plugin\\src\\presets\\classic\\components\\Socket.vue"]]);

function ownKeys$3(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$3(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$3(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Classic preset for rendering nodes, connections, controls and sockets.
 */
function setup$3(props) {
  var _props$customize;
  var positionWatcher = typeof (props === null || props === void 0 ? void 0 : props.socketPositionWatcher) === 'undefined' ? getDOMSocketPosition() : props.socketPositionWatcher;
  var _ref = (_props$customize = props === null || props === void 0 ? void 0 : props.customize) !== null && _props$customize !== void 0 ? _props$customize : {},
    node = _ref.node,
    connection = _ref.connection,
    socket = _ref.socket,
    control = _ref.control;
  return {
    attach: function attach(plugin) {
      positionWatcher.attach(plugin);
    },
    update: function update(context, plugin) {
      var payload = context.data.payload;
      var parent = plugin.parentScope();
      if (!parent) throw new Error('parent');
      var emit = parent.emit.bind(parent);
      if (context.data.type === 'node') {
        return {
          data: payload,
          emit: emit
        };
      } else if (context.data.type === 'connection') {
        var _context$data = context.data,
          start = _context$data.start,
          end = _context$data.end;
        return _objectSpread$3(_objectSpread$3({
          data: payload
        }, start ? {
          start: start
        } : {}), end ? {
          end: end
        } : {});
      }
      return {
        data: payload
      };
    },
    // eslint-disable-next-line max-statements, complexity
    render: function render(context, plugin) {
      var parent = plugin.parentScope();
      var emit = parent.emit.bind(parent);
      if (context.data.type === 'node') {
        var component = node ? node(context.data) : Node;
        return component && {
          component: component,
          props: {
            data: context.data.payload,
            emit: emit
          }
        };
      } else if (context.data.type === 'connection') {
        var _context$data$start, _context$data$end;
        var _component = connection ? connection(context.data) : Connection;
        var payload = context.data.payload;
        var source = payload.source,
          target = payload.target,
          sourceOutput = payload.sourceOutput,
          targetInput = payload.targetInput;
        return _component && {
          component: ConnectionWrapper,
          props: {
            data: context.data.payload,
            component: _component,
            start: (_context$data$start = context.data.start) !== null && _context$data$start !== void 0 ? _context$data$start : function (change) {
              return positionWatcher.listen(source, 'output', sourceOutput, change);
            },
            end: (_context$data$end = context.data.end) !== null && _context$data$end !== void 0 ? _context$data$end : function (change) {
              return positionWatcher.listen(target, 'input', targetInput, change);
            },
            path: function () {
              var _path = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(start, end) {
                var response, _response$data, path, points, curvature;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return plugin.emit({
                        type: 'connectionpath',
                        data: {
                          payload: payload,
                          points: [start, end]
                        }
                      });
                    case 2:
                      response = _context.sent;
                      if (response) {
                        _context.next = 5;
                        break;
                      }
                      return _context.abrupt("return", '');
                    case 5:
                      _response$data = response.data, path = _response$data.path, points = _response$data.points;
                      curvature = 0.3;
                      if (!(!path && points.length !== 2)) {
                        _context.next = 9;
                        break;
                      }
                      throw new Error('cannot render connection with a custom number of points');
                    case 9:
                      if (path) {
                        _context.next = 11;
                        break;
                      }
                      return _context.abrupt("return", payload.isLoop ? loopConnectionPath(points, curvature, 120) : classicConnectionPath(points, curvature));
                    case 11:
                      return _context.abrupt("return", path);
                    case 12:
                    case "end":
                      return _context.stop();
                  }
                }, _callee);
              }));
              function path(_x, _x2) {
                return _path.apply(this, arguments);
              }
              return path;
            }()
          }
        };
      } else if (context.data.type === 'socket') {
        var _payload = context.data.payload;
        var _component2 = socket ? socket(context.data) : Socket;
        return {
          component: _component2,
          props: {
            data: _payload
          }
        };
      } else if (context.data.type === 'control') {
        var _payload2 = context.data.payload;
        if (control) {
          var _component3 = control(context.data);
          return _component3 && {
            component: _component3,
            props: {
              data: _payload2
            }
          };
        }
        return context.data.payload instanceof ClassicPreset.InputControl ? {
          component: Control,
          props: {
            data: _payload2
          }
        } : null;
      }
    }
  };
}

var index$4 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  setup: setup$3,
  Connection: Connection,
  Control: Control,
  Node: Node,
  Socket: Socket
});

const _hoisted_1$3 = { class: "block" };

function render$7(_ctx, _cache) {
  return (openBlock(), createElementBlock("div", _hoisted_1$3, [
    renderSlot(_ctx.$slots, "default", {}, undefined, true)
  ]))
}

___$insertStylesToHeader(".block[data-v-e9c17765] {\n  color: #fff;\n  padding: 4px;\n  border-bottom: 1px solid rgba(69, 103, 255, 0.8);\n  background-color: rgba(110, 136, 255, 0.8);\n  cursor: pointer;\n  box-sizing: border-box;\n  width: 100%;\n  position: relative;\n}\n.block[data-v-e9c17765][data-v-e9c17765]:first-child {\n  border-top-left-radius: 5px;\n  border-top-right-radius: 5px;\n}\n.block[data-v-e9c17765][data-v-e9c17765]:last-child {\n  border-bottom-left-radius: 5px;\n  border-bottom-right-radius: 5px;\n}\n.block[data-v-e9c17765][data-v-e9c17765]:hover {\n  background-color: rgba(130, 153, 255, 0.8);\n}");

const _sfc_main$8 = {};
var Block = /*#__PURE__*/_export_sfc(_sfc_main$8, [['render',render$7],['__scopeId',"data-v-e9c17765"],['__file',"C:\\Users\\Administrator\\Desktop\\vue-plugin\\src\\presets\\context-menu\\components\\Block.vue"]]);

const _hoisted_1$2 = ["value"];

function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("input", {
    class: "search",
    value: $props.text,
    onInput: _cache[0] || (_cache[0] = $event => (_ctx.$emit('change', $event.target.value))),
    "data-testid": "context-menu-search-input"
  }, null, 40 /* PROPS, NEED_HYDRATION */, _hoisted_1$2))
}

___$insertStylesToHeader(".search[data-v-3253b3e6] {\n  color: white;\n  padding: 1px 8px;\n  border: 1px solid white;\n  border-radius: 10px;\n  font-size: 16px;\n  font-family: serif;\n  width: 100%;\n  box-sizing: border-box;\n  background: transparent;\n}");

const _sfc_main$7 = {
  props: ['text']
};
var Search = /*#__PURE__*/_export_sfc(_sfc_main$7, [['render',render$6],['__scopeId',"data-v-3253b3e6"],['__file',"C:\\Users\\Administrator\\Desktop\\vue-plugin\\src\\presets\\context-menu\\components\\Search.vue"]]);

function debounce(delay, cb) {
  return {
    timeout: null,
    cancel: function cancel() {
      if (this.timeout) {
        window.clearTimeout(this.timeout);
        this.timeout = null;
      }
    },
    call: function call() {
      this.timeout = window.setTimeout(function () {
        cb();
      }, delay);
    }
  };
}

const _hoisted_1$1 = {
  key: 0,
  class: "subitems"
};

function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Item = resolveComponent("Item", true);
  const _component_Block = resolveComponent("Block");

  return (openBlock(), createBlock(_component_Block, {
    class: normalizeClass(["block", { hasSubitems: $props.subitems }]),
    "data-testid": "context-menu-item"
  }, {
    default: withCtx(() => [
      createElementVNode("div", {
        class: "content",
        onClick: _cache[1] || (_cache[1] = withModifiers($event => {_ctx.$emit('select', $event); _ctx.$emit('hide');}, ["stop"])),
        onWheel: _cache[2] || (_cache[2] = withModifiers(() => {}, ["stop"])),
        onPointerover: _cache[3] || (_cache[3] = $event => {$data.hide.cancel(); $data.visibleSubitems = true;}),
        onPointerleave: _cache[4] || (_cache[4] = $event => ($data.hide.call())),
        onPointerdown: _cache[5] || (_cache[5] = withModifiers(() => {}, ["stop"]))
      }, [
        renderSlot(_ctx.$slots, "default", {}, undefined, true),
        ($props.subitems && $data.visibleSubitems)
          ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
              (openBlock(true), createElementBlock(Fragment, null, renderList($props.subitems, (item) => {
                return (openBlock(), createBlock(_component_Item, {
                  key: item.key,
                  onSelect: $event => (item.handler($event)),
                  delay: $props.delay,
                  onHide: _cache[0] || (_cache[0] = $event => (_ctx.$emit('hide'))),
                  subitems: item.subitems
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(item.label), 1 /* TEXT */)
                  ]),
                  _: 2 /* DYNAMIC */
                }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["onSelect", "delay", "subitems"]))
              }), 128 /* KEYED_FRAGMENT */))
            ]))
          : createCommentVNode("v-if", true)
      ], 32 /* NEED_HYDRATION */)
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

___$insertStylesToHeader("@charset \"UTF-8\";\n.block[data-v-fc3b2bca] {\n  padding: 0;\n}\n\n.content[data-v-fc3b2bca] {\n  padding: 4px;\n}\n\n.hasSubitems[data-v-fc3b2bca][data-v-fc3b2bca]:after {\n  content: \"►\";\n  position: absolute;\n  opacity: 0.6;\n  right: 5px;\n  top: 5px;\n}\n\n.subitems[data-v-fc3b2bca] {\n  position: absolute;\n  top: 0;\n  left: 100%;\n  width: 120px;\n}");

const _sfc_main$6 = {
  name: 'Item',
  props: ['subitems', 'delay'],
  data() {
    return {
      visibleSubitems: false,
      hide: debounce(this.delay, this.hideSubitems)
    }
  },
  methods: {
    hideSubitems() {
      this.visibleSubitems = false;
    }
  },
  components: {
    Block
  }
};
var Item = /*#__PURE__*/_export_sfc(_sfc_main$6, [['render',render$5],['__scopeId',"data-v-fc3b2bca"],['__file',"C:\\Users\\Administrator\\Desktop\\vue-plugin\\src\\presets\\context-menu\\components\\Item.vue"]]);

___$insertStylesToHeader(".menu[data-v-2571168d] {\n  padding: 10px;\n  width: 120px;\n  margin-top: -20px;\n  margin-left: -60px;\n}");

const _sfc_main$5 = {
  props: ['items', 'delay', 'searchBar', 'onHide', 'className'],
  data() {
    return {
      filter: '',
      hide: debounce(this.delay, this.onHide)
    }
  },
  methods: {
    getItems() {
      const filterRegexp = new RegExp(this.filter, 'i');
      const filteredList = this.items.filter(item => (
        item.label.match(filterRegexp)
      ));

      return filteredList
    }
  },
  unmounted() {
    if (this.hide) this.hide.cancel();
  },
  components: {
    Block,
    Search,
    Item
  }
};

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Search = resolveComponent("Search");
  const _component_Block = resolveComponent("Block");
  const _component_Item = resolveComponent("Item");

  return (openBlock(), createElementBlock("div", {
    class: normalizeClass(["menu", [$props.className ? $props.className : '']]),
    onMouseover: _cache[2] || (_cache[2] = $event => ($data.hide.cancel())),
    onMouseleave: _cache[3] || (_cache[3] = $event => ($data.hide.call())),
    "data-testid": "context-menu",
    "rete-context-menu": ""
  }, [
    ($props.searchBar)
      ? (openBlock(), createBlock(_component_Block, { key: 0 }, {
          default: withCtx(() => [
            createVNode(_component_Search, {
              text: $data.filter,
              onChange: _cache[0] || (_cache[0] = $event => ($data.filter = $event))
            }, null, 8 /* PROPS */, ["text"])
          ]),
          _: 1 /* STABLE */
        }))
      : createCommentVNode("v-if", true),
    (openBlock(true), createElementBlock(Fragment, null, renderList($options.getItems(), (item) => {
      return (openBlock(), createBlock(_component_Item, {
        key: item.key,
        onSelect: $event => (item.handler($event)),
        delay: $props.delay,
        onHide: _cache[1] || (_cache[1] = $event => ($props.onHide())),
        subitems: item.subitems
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(item.label), 1 /* TEXT */)
        ]),
        _: 2 /* DYNAMIC */
      }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["onSelect", "delay", "subitems"]))
    }), 128 /* KEYED_FRAGMENT */))
  ], 34 /* CLASS, NEED_HYDRATION */))
}
var Menu = /*#__PURE__*/_export_sfc(_sfc_main$5, [['render',_sfc_render],['__scopeId',"data-v-2571168d"],['__file',"C:\\Users\\Administrator\\Desktop\\vue-plugin\\src\\presets\\context-menu\\components\\Menu.vue"]]);

/**
 * Preset for rendering context menu.
 */
function setup$2(props) {
  var delay = typeof (props === null || props === void 0 ? void 0 : props.delay) === 'undefined' ? 1000 : props.delay;
  return {
    update: function update(context) {
      if (context.data.type === 'contextmenu') {
        return {
          items: context.data.items,
          delay: delay,
          searchBar: context.data.searchBar,
          onHide: context.data.onHide
        };
      }
    },
    render: function render(context) {
      if (context.data.type === 'contextmenu') {
        return {
          component: Menu,
          props: {
            items: context.data.items,
            delay: delay,
            searchBar: context.data.searchBar,
            onHide: context.data.onHide,
            className: props === null || props === void 0 ? void 0 : props.className
          }
        };
      }
    }
  };
}

var index$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  setup: setup$2
});

function px(value) {
  return "".concat(value, "px");
}

function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", {
    class: "mini-node",
    style: normalizeStyle($options.styles),
    "data-testid": "minimap-node"
  }, null, 4 /* STYLE */))
}

___$insertStylesToHeader(".mini-node[data-v-2d96711d] {\n  position: absolute;\n  background: rgba(110, 136, 255, 0.8);\n  border: 1px solid rgba(192, 206, 212, 0.6);\n}");

const _sfc_main$4 = {
  props: ['left', 'top', 'width', 'height'],
  computed: {
    styles() {
      return {
        left: px(this.left),
        top: px(this.top),
        width: px(this.width),
        height: px(this.height)
      }
    }
  }
};
var MiniNode = /*#__PURE__*/_export_sfc(_sfc_main$4, [['render',render$4],['__scopeId',"data-v-2d96711d"],['__file',"C:\\Users\\Administrator\\Desktop\\vue-plugin\\src\\presets\\minimap\\MiniNode.vue"]]);

function ownKeys$2(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$2(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$2(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function useDrag(translate, getPointer) {
  return {
    start: function start(e) {
      var previous = _objectSpread$2({}, getPointer(e));
      function move(moveEvent) {
        var current = _objectSpread$2({}, getPointer(moveEvent));
        var dx = current.x - previous.x;
        var dy = current.y - previous.y;
        previous = current;
        translate(dx, dy);
      }
      function up() {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
      }
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    }
  };
}

function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", {
    class: "mini-viewport",
    onPointerdown: _cache[0] || (_cache[0] = withModifiers($event => ($data.drag.start($event)), ["stop"])),
    style: normalizeStyle($options.styles),
    "data-testid": "minimap-viewport"
  }, null, 36 /* STYLE, NEED_HYDRATION */))
}

___$insertStylesToHeader(".mini-viewport[data-v-ed5fcf61] {\n  position: absolute;\n  background: rgba(255, 251, 128, 0.32);\n  border: 1px solid #ffe52b;\n}");

const _sfc_main$3 = {
  props: ['left', 'top', 'width', 'height', 'containerWidth', 'translate'],
  data() {
    return {
      drag: useDrag(this.onDrag, e => ({ x: e.pageX, y: e.pageY }))
    }
  },
  methods: {
    scale(v) {
      return v * this.containerWidth
    },
    invert(v) {
      return v / this.containerWidth
    },
    onDrag(dx, dy) {
      this.translate(this.invert(-dx), this.invert(-dy));
    }
  },
  computed: {
    styles() {

      return {
        left: px(this.scale(this.left)),
        top: px(this.scale(this.top)),
        width: px(this.scale(this.width)),
        height: px(this.scale(this.height))
      }
    }
  }
};
var MiniViewport = /*#__PURE__*/_export_sfc(_sfc_main$3, [['render',render$3],['__scopeId',"data-v-ed5fcf61"],['__file',"C:\\Users\\Administrator\\Desktop\\vue-plugin\\src\\presets\\minimap\\MiniViewport.vue"]]);

function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_MiniNode = resolveComponent("MiniNode");
  const _component_MiniViewport = resolveComponent("MiniViewport");

  return (openBlock(), createElementBlock("div", {
    class: "minimap",
    ref: "container",
    style: normalizeStyle({ width: $options.px($props.size * $props.ratio), height: $options.px($props.size) }),
    onPointerdown: _cache[0] || (_cache[0] = withModifiers(() => {}, ["stop","prevent"])),
    onDblclick: _cache[1] || (_cache[1] = withModifiers($event => ($options.dblclick($event)), ["stop","prevent"])),
    "data-testid": "minimap"
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($props.nodes, (node, index) => {
      return (openBlock(), createBlock(_component_MiniNode, {
        key: [index, node.left].join('_'),
        left: $options.scale(node.left),
        top: $options.scale(node.top),
        width: $options.scale(node.width),
        height: $options.scale(node.height)
      }, null, 8 /* PROPS */, ["left", "top", "width", "height"]))
    }), 128 /* KEYED_FRAGMENT */)),
    createVNode(_component_MiniViewport, {
      left: $props.viewport.left,
      top: $props.viewport.top,
      width: $props.viewport.width,
      height: $props.viewport.height,
      containerWidth: _ctx.$refs.container && _ctx.$refs.container.clientWidth,
      translate: $props.translate
    }, null, 8 /* PROPS */, ["left", "top", "width", "height", "containerWidth", "translate"])
  ], 36 /* STYLE, NEED_HYDRATION */))
}

___$insertStylesToHeader(".minimap[data-v-403730b0] {\n  position: absolute;\n  right: 24px;\n  bottom: 24px;\n  background: rgba(229, 234, 239, 0.65);\n  padding: 20px;\n  overflow: hidden;\n  border: 1px solid #b1b7ff;\n  border-radius: 8px;\n  box-sizing: border-box;\n}");

const _sfc_main$2 = {
  props: {
    size: Number,
    ratio: Number,
    nodes: Array,
    viewport: Object,
    translate: Function,
    point: Function,
    seed: Number
  },
  methods: {
    dblclick(e) {
      if (!this.$refs.container) return
      const box = this.$refs.container.getBoundingClientRect();
      const x = (e.clientX - box.left) / (this.size * this.ratio);
      const y = (e.clientY - box.top) / (this.size * this.ratio);

      this.point(x, y);
    },
    px,
    scale(value) {
      if (!this.$refs.container) return 0

      return value * this.$refs.container.clientWidth
    }
  },
  components: {
    MiniNode,
    MiniViewport
  }
};
var Minimap = /*#__PURE__*/_export_sfc(_sfc_main$2, [['render',render$2],['__scopeId',"data-v-403730b0"],['__file',"C:\\Users\\Administrator\\Desktop\\vue-plugin\\src\\presets\\minimap\\Minimap.vue"]]);

/**
 * Preset for rendering minimap.
 */
function setup$1(props) {
  return {
    update: function update(context) {
      if (context.data.type === 'minimap') {
        var _props$size;
        return {
          nodes: context.data.nodes,
          size: (_props$size = props === null || props === void 0 ? void 0 : props.size) !== null && _props$size !== void 0 ? _props$size : 200,
          ratio: context.data.ratio,
          viewport: context.data.viewport,
          translate: context.data.translate,
          point: context.data.point
        };
      }
    },
    render: function render(context) {
      if (context.data.type === 'minimap') {
        var _props$size2;
        return {
          component: Minimap,
          props: {
            nodes: context.data.nodes,
            size: (_props$size2 = props === null || props === void 0 ? void 0 : props.size) !== null && _props$size2 !== void 0 ? _props$size2 : 200,
            ratio: context.data.ratio,
            viewport: context.data.viewport,
            translate: context.data.translate,
            point: context.data.point
          }
        };
      }
    }
  };
}

var index$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  setup: setup$1
});

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", {
    class: normalizeClass(["pin", { selected: $props.selected }]),
    onPointerdown: _cache[0] || (_cache[0] = withModifiers($event => {$data.drag.start($event); _ctx.$emit('down');}, ["stop","prevent"])),
    onContextmenu: _cache[1] || (_cache[1] = withModifiers($event => (_ctx.$emit('menu')), ["stop","prevent"])),
    style: normalizeStyle($options.style),
    "data-testid": "pin"
  }, null, 38 /* CLASS, STYLE, NEED_HYDRATION */))
}

___$insertStylesToHeader(".pin[data-v-42b064e9] {\n  width: 20px;\n  height: 20px;\n  box-sizing: border-box;\n  background: steelblue;\n  border: 2px solid white;\n  border-radius: 20px;\n}\n.pin[data-v-42b064e9].selected[data-v-42b064e9] {\n  background: #ffd92c;\n}");

const pinSize = 20;

const _sfc_main$1 = {
  props: ['position', 'selected', 'getPointer'],
  data() {
    return {
      drag: useDrag(this.onDrag, this.getPointer)
    }
  },
  computed: {
    style() {
      const { x, y } = this.position;

      return {
        position: 'absolute',
        top: `${y - pinSize / 2}px`,
        left: `${x - pinSize / 2}px`
      }
    }
  },
  methods: {
    onDrag(dx, dy) {
      this.$emit('translate', { dx, dy });
    }
  }
};
var Pin = /*#__PURE__*/_export_sfc(_sfc_main$1, [['render',render$1],['__scopeId',"data-v-42b064e9"],['__file',"C:\\Users\\Administrator\\Desktop\\vue-plugin\\src\\presets\\reroute\\Pin.vue"]]);

const _hoisted_1 = { class: "pins" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Pin = resolveComponent("Pin");

  return (openBlock(), createElementBlock("div", _hoisted_1, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($props.pins, (pin) => {
      return (openBlock(), createBlock(_component_Pin, {
        key: pin.id,
        position: pin.position,
        selected: pin.selected,
        getPointer: $props.getPointer,
        onMenu: $event => ($props.menu(pin.id)),
        onTranslate: $event => ($props.translate(pin.id, $event.dx, $event.dy)),
        onDown: $event => ($props.down(pin.id))
      }, null, 8 /* PROPS */, ["position", "selected", "getPointer", "onMenu", "onTranslate", "onDown"]))
    }), 128 /* KEYED_FRAGMENT */))
  ]))
}

const _sfc_main = {
  props: ['pins', 'menu', 'translate', 'down', 'seed', 'getPointer'],
  components: {
    Pin
  }
};
var Pins = /*#__PURE__*/_export_sfc(_sfc_main, [['render',render],['__file',"C:\\Users\\Administrator\\Desktop\\vue-plugin\\src\\presets\\reroute\\Pins.vue"]]);

function ownKeys$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Preset for rendering pins.
 */
function setup(props) {
  var getProps = function getProps() {
    var _props$contextMenu, _props$translate, _props$pointerdown;
    return {
      menu: (_props$contextMenu = props === null || props === void 0 ? void 0 : props.contextMenu) !== null && _props$contextMenu !== void 0 ? _props$contextMenu : function () {
        return null;
      },
      translate: (_props$translate = props === null || props === void 0 ? void 0 : props.translate) !== null && _props$translate !== void 0 ? _props$translate : function () {
        return null;
      },
      down: (_props$pointerdown = props === null || props === void 0 ? void 0 : props.pointerdown) !== null && _props$pointerdown !== void 0 ? _props$pointerdown : function () {
        return null;
      }
    };
  };
  return {
    update: function update(context) {
      if (context.data.type === 'reroute-pins') {
        return _objectSpread$1(_objectSpread$1({}, getProps()), {}, {
          pins: context.data.data.pins
        });
      }
    },
    render: function render(context, plugin) {
      if (context.data.type === 'reroute-pins') {
        var area = plugin.parentScope(BaseAreaPlugin);
        return {
          component: Pins,
          props: _objectSpread$1(_objectSpread$1({}, getProps()), {}, {
            getPointer: function getPointer() {
              return area.area.pointer;
            },
            pins: context.data.data.pins
          })
        };
      }
    }
  };
}

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  setup: setup
});

/**
 * Built-in presets, responsible for rendering different parts of the editor.
 * @module
 */

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  classic: index$4,
  contextMenu: index$3,
  minimap: index$2,
  reroute: index$1
});

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _superPropGet(t, e, o, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), e, o); return 2 & r && "function" == typeof p ? function (t) { return p.apply(o, t); } : p; }

/**
 * Signals that can be emitted by the plugin
 * @priority 10
 */

/**
 * Vue plugin options used to setup vue instance(s) used by retejs.
 */

/**
 * Vue plugin. Renders nodes, connections and other elements using React.
 * @priority 9
 * @emits connectionpath
 * @listens render
 * @listens unmount
 */
var VuePlugin = /*#__PURE__*/function (_Scope) {
  function VuePlugin(props) {
    var _this;
    _classCallCheck(this, VuePlugin);
    _this = _callSuper(this, VuePlugin, ['vue-render']);
    _defineProperty(_this, "presets", []);
    _defineProperty(_this, "owners", new WeakMap());
    _this.renderer = getRenderer(props);
    _this.addPipe(function (context) {
      if (!context || _typeof(context) !== 'object' || !('type' in context)) return context;
      if (context.type === 'unmount') {
        _this.unmount(context.data.element);
      } else if (context.type === 'render') {
        if ('filled' in context.data && context.data.filled) {
          return context;
        }
        if (_this.mount(context.data.element, context)) {
          return _objectSpread(_objectSpread({}, context), {}, {
            data: _objectSpread(_objectSpread({}, context.data), {}, {
              filled: true
            })
          });
        }
      }
      return context;
    });
    return _this;
  }
  _inherits(VuePlugin, _Scope);
  return _createClass(VuePlugin, [{
    key: "setParent",
    value: function setParent(scope) {
      var _this2 = this;
      _superPropGet(VuePlugin, "setParent", this, 3)([scope]);
      this.presets.forEach(function (preset) {
        if (preset.attach) preset.attach(_this2);
      });
    }
  }, {
    key: "unmount",
    value: function unmount(element) {
      this.owners["delete"](element);
      this.renderer.unmount(element);
    }
  }, {
    key: "mount",
    value: function mount(element, context) {
      var _this3 = this;
      var existing = this.renderer.get(element);
      var parent = this.parentScope();
      if (existing) {
        this.presets.forEach(function (preset) {
          if (_this3.owners.get(element) !== preset) return;
          var result = preset.update(context, _this3);
          if (result) {
            _this3.renderer.update(existing, result);
          }
        });
        return true;
      }
      var _iterator = _createForOfIteratorHelper(this.presets),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var preset = _step.value;
          var result = preset.render(context, this);
          if (!result) continue;
          this.renderer.mount(element, result.component, result.props, function () {
            return parent.emit({
              type: 'rendered',
              data: context.data
            });
          });
          this.owners.set(element, preset);
          return true;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    /**
     * Adds a preset to the plugin.
     * @param preset Preset that can render nodes, connections and other elements.
     */
  }, {
    key: "addPreset",
    value: function addPreset(preset) {
      var local = preset;
      if (local.attach) local.attach(this);
      this.presets.push(local);
    }
  }]);
}(Scope);

export { index as Presets, Ref, VuePlugin };
//# sourceMappingURL=rete-vue-plugin.esm.js.map
