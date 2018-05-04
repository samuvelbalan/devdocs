/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "tabs", "uiEvents", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/content-type-menu/option", "Magento_PageBuilder/js/content-type/preview-collection"], function (_jquery, _knockout, _translate, _tabs, _uiEvents, _underscore, _config, _contentTypeFactory, _option, _previewCollection) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Preview =
  /*#__PURE__*/
  function (_PreviewCollection) {
    _inheritsLoose(Preview, _PreviewCollection);

    /**
     * Assign a debounce and delay to the init of tabs to ensure the DOM has updated
     *
     * @type {(() => any) & _.Cancelable}
     */

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Preview(parent, config, observableUpdater) {
      var _this;

      _this = _PreviewCollection.call(this, parent, config, observableUpdater) || this;
      _this.focusedTab = _knockout.observable();
      _this.element = void 0;
      _this.buildTabs = _underscore.debounce(function (activeTabIndex) {
        if (activeTabIndex === void 0) {
          activeTabIndex = _this.previewData.default_active();
        }

        if (_this.element && _this.element.children.length > 0) {
          try {
            (0, _jquery)(_this.element).tabs("destroy");
          } catch (e) {// We aren't concerned if this fails, tabs throws an Exception when we cannot destroy
          }

          (0, _jquery)(_this.element).tabs({
            create: function create(event, ui) {
              _this.setFocusedTab(activeTabIndex || 0);
            }
          });
        }
      }, 10);

      _uiEvents.on("tabs:block:ready", function (args) {
        if (args.id === _this.parent.id && _this.element) {
          _this.buildTabs();
        }
      });

      _uiEvents.on("tab-item:block:create", function (args) {
        if (_this.element && args.block.parent.id === _this.parent.id) {
          _this.buildTabs();
        }
      });

      _uiEvents.on("tab-item:block:removed", function (args) {
        if (_this.element && args.block.parent.id === _this.parent.id) {
          _this.buildTabs();
        }
      }); // Set the stage to interacting when a tab is focused


      var focusTabValue;

      _this.focusedTab.subscribe(function (value) {
        focusTabValue = value; // If we're stopping the interaction we need to wait, to ensure any other actions can complete

        _underscore.delay(function () {
          if (focusTabValue === value) {
            if (value !== null) {
              _uiEvents.trigger("interaction:start");
            } else {
              _uiEvents.trigger("interaction:stop");
            }
          }
        }, value === null ? 200 : 0);
      });

      return _this;
    }
    /**
     * Set the active tab, we maintain a reference to it in an observable for when we rebuild the tab instance
     *
     * @param {number} index
     */


    var _proto = Preview.prototype;

    _proto.setActiveTab = function setActiveTab(index) {
      (0, _jquery)(this.element).tabs("option", "active", index);
    };
    /**
     * Set the focused tab
     *
     * @param {number} index
     * @param {boolean} force
     */


    _proto.setFocusedTab = function setFocusedTab(index, force) {
      if (force === void 0) {
        force = false;
      }

      this.setActiveTab(index);

      if (force) {
        this.focusedTab(null);
      }

      this.focusedTab(index);

      if (this.element) {
        if (this.element.getElementsByTagName("span")[index]) {
          this.element.getElementsByTagName("span")[index].focus();
        }

        _underscore.defer(function () {
          if ((0, _jquery)(":focus").hasClass("tab-name") && (0, _jquery)(":focus").prop("contenteditable")) {
            document.execCommand("selectAll", false, null);
          } else {
            // If the active element isn't the tab title, we're not interacting with the stage
            _uiEvents.trigger("interaction:stop");
          }
        });
      }
    };
    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */


    _proto.retrieveOptions = function retrieveOptions() {
      var options = _PreviewCollection.prototype.retrieveOptions.call(this);

      options.push(new _option(this, "add", "<i class='icon-pagebuilder-add'></i>", (0, _translate)("Add"), this.addTab, ["add-child"], 10));
      return options;
    };
    /**
     * Add a tab
     */


    _proto.addTab = function addTab() {
      var _this2 = this;

      (0, _contentTypeFactory)(_config.getContentTypeConfig("tab-item"), this.parent, this.parent.stageId).then(function (tab) {
        _uiEvents.on("tab-item:block:mount", function (args) {
          if (args.id === tab.id) {
            _this2.setFocusedTab(_this2.parent.children().length - 1);

            _uiEvents.off("tab-item:block:mount:" + tab.id);
          }
        }, "tab-item:block:mount:" + tab.id);

        _this2.parent.addChild(tab, _this2.parent.children().length); // Update the default tab title when adding a new tab


        tab.store.updateKey(tab.id, (0, _translate)("Tab") + " " + (_this2.parent.children.indexOf(tab) + 1), "tab_name");
      });
    };
    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */


    _proto.onContainerRender = function onContainerRender(element) {
      this.element = element;
      this.buildTabs();
    };
    /**
     * Handle clicking on a tab
     *
     * @param {number} index
     * @param {Event} event
     */


    _proto.onTabClick = function onTabClick(index, event) {
      // The options menu is within the tab, so don't change the focus if we click an item within
      if ((0, _jquery)(event.target).parents(".pagebuilder-options").length > 0) {
        return;
      }

      this.setFocusedTab(index);
    };
    /**
     * Copy over border styles to the tab headers
     *
     * @returns {any}
     */


    _proto.getTabHeaderStyles = function getTabHeaderStyles() {
      var headerStyles = this.data.headers.style();
      return { ...headerStyles,
        marginBottom: "-" + headerStyles.borderWidth,
        marginLeft: "-" + headerStyles.borderWidth
      };
    };
    /**
     * Bind events
     */


    _proto.bindEvents = function bindEvents() {
      var _this3 = this;

      _PreviewCollection.prototype.bindEvents.call(this); // Block being mounted onto container


      _uiEvents.on("tabs:block:dropped:create", function (args) {
        if (args.id === _this3.parent.id && _this3.parent.children().length === 0) {
          _this3.addTab();
        }
      }); // Block being removed from container


      _uiEvents.on("tab-item:block:removed", function (args) {
        if (args.parent.id === _this3.parent.id) {
          // Mark the previous slide as active
          var newIndex = args.index - 1 >= 0 ? args.index - 1 : 0;

          _this3.setFocusedTab(newIndex);
        }
      });

      _uiEvents.on("tab-item:block:duplicate", function (args) {
        _this3.buildTabs(args.index);
      });

      _uiEvents.on("tab-item:block:mount", function (args) {
        if (_this3.parent.id === args.block.parent.id) {
          _this3.updateTabNamesInDataStore();

          _this3.parent.store.subscribe(function () {
            _this3.updateTabNamesInDataStore();
          }, args.block.id);
        }
      });
    };
    /**
     * Update data store with active options
     */


    _proto.updateTabNamesInDataStore = function updateTabNamesInDataStore() {
      var activeOptions = [];
      this.parent.children().forEach(function (tab, index) {
        var tabData = tab.store.get(tab.id);
        activeOptions.push({
          label: tabData.tab_name.toString(),
          labeltitle: tabData.tab_name.toString(),
          value: index
        });
      });
      this.parent.store.updateKey(this.parent.id, activeOptions, "_default_active_options");
    };

    return Preview;
  }(_previewCollection); // Resolve issue with jQuery UI tabs blocking events on content editable areas


  var originalTabKeyDown = _jquery.ui.tabs.prototype._tabKeydown;

  _jquery.ui.tabs.prototype._tabKeydown = function (event) {
    // If the target is content editable don't handle any events
    if ((0, _jquery)(event.target).attr("contenteditable")) {
      return;
    }

    originalTabKeyDown.call(this, event);
  };

  return Preview;
});
//# sourceMappingURL=preview.js.map
