/*eslint-disable */
define(["knockout", "Magento_PageBuilder/js/preview-collection", "Magento_PageBuilder/js/component/block/factory", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/event-bus"], function (_knockout, _previewCollection, _factory, _config, _eventBus) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Buttons =
  /*#__PURE__*/
  function (_PreviewCollection) {
    _inheritsLoose(Buttons, _PreviewCollection);

    function Buttons() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _PreviewCollection.call.apply(_PreviewCollection, [this].concat(args)) || this, _this.isLiveEditing = _knockout.observable(false), _temp) || _this;
    }

    var _proto = Buttons.prototype;

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _PreviewCollection.prototype.bindEvents.call(this);

      _eventBus.on("buttons:block:ready", function (event, params) {
        if (params.id === _this2.parent.id && _this2.parent.children().length === 0) {
          _this2.addButton();
        }
      });
    };
    /**
     * Add button-item to buttons children array
     */


    _proto.addButton = function addButton() {
      var _this3 = this;

      var createBlockPromise = (0, _factory)(_config.getContentTypeConfig("button-item"), this.parent.parent, this.parent.stageId, {});
      createBlockPromise.then(function (button) {
        _this3.parent.addChild(button);

        _this3.isLiveEditing(_this3.parent.children().indexOf(button));

        return button;
      }).catch(function (error) {
        console.error(error);
      });
    };

    return Buttons;
  }(_previewCollection);

  return Buttons;
});
//# sourceMappingURL=buttons.js.map
