/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugin/controller.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/plugin/controller.ts":
/*!**********************************!*\
  !*** ./src/plugin/controller.ts ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/plugin/utils/index.tsx");

figma.showUI(__html__, { width: 280, height: 350 });
let svgStrings = [];
let svgErrors = [];
const postMsg = (type, data) => figma.ui.postMessage({
    type: type,
    data: data
});
const convertIcons = async () => {
    let selected = figma.currentPage.selection;
    if (selected.length === 0) {
        figma.notify("Please select icons");
        return;
    }
    return await selected.map((frame) => {
        let cloneFrame = figma.createFrame();
        cloneFrame.name = frame.name;
        cloneFrame.backgrounds = [];
        cloneFrame.resize(frame.width, frame.height);
        frame.children.forEach(child => {
            if (child.visible) {
                cloneFrame.x = child.x;
                cloneFrame.y = child.y;
                Object(_utils__WEBPACK_IMPORTED_MODULE_0__["clone"])(child, cloneFrame);
            }
        });
        try {
            return cloneFrame.exportAsync({ format: "SVG" }).then(result => {
                let svgString = String.fromCharCode.apply(null, result);
                let exportedNode = figma.createNodeFromSvg(svgString);
                figma.union(exportedNode.children, exportedNode);
                exportedNode.exportAsync({ format: "SVG" }).then(result => {
                    figma.flatten(exportedNode.children);
                    let svgString = String.fromCharCode.apply(null, result);
                    svgStrings.push(svgString);
                });
            });
        }
        catch (err) {
            let customErrorMsg = `Error in "${cloneFrame.name}" icon`;
            console.error(customErrorMsg);
            svgErrors.push(customErrorMsg);
            postMsg("svg-errors", svgErrors);
            cloneFrame.remove();
        }
    });
};
figma.on("selectionchange", () => {
    let selected = figma.currentPage.selection;
    postMsg("selected-amount", selected.length);
});
figma.ui.onmessage = async (msg) => {
    if (msg.type === "preview") {
        await convertIcons().then(() => {
            postMsg("svg-strings", svgStrings);
            svgStrings = [];
            svgErrors = [];
        });
    }
};


/***/ }),

/***/ "./src/plugin/utils/clone.tsx":
/*!************************************!*\
  !*** ./src/plugin/utils/clone.tsx ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ */ "./src/plugin/utils/index.tsx");

const clone = (frame, parent) => {
    if (frame.visible) {
        if (frame.type === "INSTANCE") {
            frame.children.forEach(child => {
                clone(child, parent);
            });
        }
        else if (frame.type === "GROUP") {
            Object(___WEBPACK_IMPORTED_MODULE_0__["ungroup"])(frame, parent);
        }
        else {
            Object(___WEBPACK_IMPORTED_MODULE_0__["outline"])(frame).map(item => {
                parent.appendChild(item);
            });
        }
    }
};
/* harmony default export */ __webpack_exports__["default"] = (clone);


/***/ }),

/***/ "./src/plugin/utils/index.tsx":
/*!************************************!*\
  !*** ./src/plugin/utils/index.tsx ***!
  \************************************/
/*! exports provided: ungroup, outline, clone */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ungroup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ungroup */ "./src/plugin/utils/ungroup.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ungroup", function() { return _ungroup__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _outline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./outline */ "./src/plugin/utils/outline.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "outline", function() { return _outline__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _clone__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./clone */ "./src/plugin/utils/clone.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "clone", function() { return _clone__WEBPACK_IMPORTED_MODULE_2__["default"]; });






/***/ }),

/***/ "./src/plugin/utils/outline.tsx":
/*!**************************************!*\
  !*** ./src/plugin/utils/outline.tsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const outline = item => {
    if ((item.strokes && item.strokes.length > 0 && !item.fills) ||
        item.fills.length === 0) {
        return [item.outlineStroke()];
    }
    else if (item.strokes &&
        item.strokes.length > 0 &&
        item.fills &&
        item.fills.length > 0) {
        let fills = item.fills.filter(fill => fill.visible === true);
        if (fills.length > 0) {
            return [item.outlineStroke(), item.clone()];
        }
        return [item.outlineStroke()];
    }
    else if (!item.strokes ||
        (item.strokes.length === 0 && item.fills && item.fills.length > 0)) {
        return [item.clone()];
    }
};
/* harmony default export */ __webpack_exports__["default"] = (outline);


/***/ }),

/***/ "./src/plugin/utils/ungroup.tsx":
/*!**************************************!*\
  !*** ./src/plugin/utils/ungroup.tsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _outline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./outline */ "./src/plugin/utils/outline.tsx");

const ungroup = (group, parent) => {
    if (!group.children)
        return;
    group.children.forEach(child => {
        let outlinedChildren = Object(_outline__WEBPACK_IMPORTED_MODULE_0__["default"])(child);
        console.log(outlinedChildren);
        outlinedChildren.forEach(child => {
            parent.appendChild(child);
            child.x = child.x + parent.x;
            child.y = child.y + parent.y;
        });
    });
};
/* harmony default export */ __webpack_exports__["default"] = (ungroup);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdXRpbHMvY2xvbmUudHN4Iiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdXRpbHMvaW5kZXgudHN4Iiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdXRpbHMvb3V0bGluZS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi91dGlscy91bmdyb3VwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBZ0M7QUFDaEMsd0JBQXdCLDBCQUEwQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixvREFBSztBQUNyQjtBQUNBLFNBQVM7QUFDVDtBQUNBLDJDQUEyQyxnQkFBZ0I7QUFDM0Q7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLGdCQUFnQjtBQUMxRDtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQSw4Q0FBOEMsZ0JBQWdCO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUMzREE7QUFBQTtBQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxZQUFZLGlEQUFPO0FBQ25CO0FBQ0E7QUFDQSxZQUFZLGlEQUFPO0FBQ25CO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNlLG9FQUFLLEVBQUM7Ozs7Ozs7Ozs7Ozs7QUNsQnJCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQStDO0FBQ0E7QUFDSjs7Ozs7Ozs7Ozs7OztBQ0YzQztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxzRUFBTyxFQUFDOzs7Ozs7Ozs7Ozs7O0FDcEJ2QjtBQUFBO0FBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLHdEQUFPO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ2Usc0VBQU8sRUFBQyIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvcGx1Z2luL2NvbnRyb2xsZXIudHNcIik7XG4iLCJpbXBvcnQgeyBjbG9uZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDI4MCwgaGVpZ2h0OiAzNTAgfSk7XG5sZXQgc3ZnU3RyaW5ncyA9IFtdO1xubGV0IHN2Z0Vycm9ycyA9IFtdO1xuY29uc3QgcG9zdE1zZyA9ICh0eXBlLCBkYXRhKSA9PiBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBkYXRhXG59KTtcbmNvbnN0IGNvbnZlcnRJY29ucyA9IGFzeW5jICgpID0+IHtcbiAgICBsZXQgc2VsZWN0ZWQgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBmaWdtYS5ub3RpZnkoXCJQbGVhc2Ugc2VsZWN0IGljb25zXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBhd2FpdCBzZWxlY3RlZC5tYXAoKGZyYW1lKSA9PiB7XG4gICAgICAgIGxldCBjbG9uZUZyYW1lID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcbiAgICAgICAgY2xvbmVGcmFtZS5uYW1lID0gZnJhbWUubmFtZTtcbiAgICAgICAgY2xvbmVGcmFtZS5iYWNrZ3JvdW5kcyA9IFtdO1xuICAgICAgICBjbG9uZUZyYW1lLnJlc2l6ZShmcmFtZS53aWR0aCwgZnJhbWUuaGVpZ2h0KTtcbiAgICAgICAgZnJhbWUuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICBpZiAoY2hpbGQudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIGNsb25lRnJhbWUueCA9IGNoaWxkLng7XG4gICAgICAgICAgICAgICAgY2xvbmVGcmFtZS55ID0gY2hpbGQueTtcbiAgICAgICAgICAgICAgICBjbG9uZShjaGlsZCwgY2xvbmVGcmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGNsb25lRnJhbWUuZXhwb3J0QXN5bmMoeyBmb3JtYXQ6IFwiU1ZHXCIgfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzdmdTdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgbGV0IGV4cG9ydGVkTm9kZSA9IGZpZ21hLmNyZWF0ZU5vZGVGcm9tU3ZnKHN2Z1N0cmluZyk7XG4gICAgICAgICAgICAgICAgZmlnbWEudW5pb24oZXhwb3J0ZWROb2RlLmNoaWxkcmVuLCBleHBvcnRlZE5vZGUpO1xuICAgICAgICAgICAgICAgIGV4cG9ydGVkTm9kZS5leHBvcnRBc3luYyh7IGZvcm1hdDogXCJTVkdcIiB9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLmZsYXR0ZW4oZXhwb3J0ZWROb2RlLmNoaWxkcmVuKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN2Z1N0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgc3ZnU3RyaW5ncy5wdXNoKHN2Z1N0cmluZyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsZXQgY3VzdG9tRXJyb3JNc2cgPSBgRXJyb3IgaW4gXCIke2Nsb25lRnJhbWUubmFtZX1cIiBpY29uYDtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY3VzdG9tRXJyb3JNc2cpO1xuICAgICAgICAgICAgc3ZnRXJyb3JzLnB1c2goY3VzdG9tRXJyb3JNc2cpO1xuICAgICAgICAgICAgcG9zdE1zZyhcInN2Zy1lcnJvcnNcIiwgc3ZnRXJyb3JzKTtcbiAgICAgICAgICAgIGNsb25lRnJhbWUucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5maWdtYS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCAoKSA9PiB7XG4gICAgbGV0IHNlbGVjdGVkID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIHBvc3RNc2coXCJzZWxlY3RlZC1hbW91bnRcIiwgc2VsZWN0ZWQubGVuZ3RoKTtcbn0pO1xuZmlnbWEudWkub25tZXNzYWdlID0gYXN5bmMgKG1zZykgPT4ge1xuICAgIGlmIChtc2cudHlwZSA9PT0gXCJwcmV2aWV3XCIpIHtcbiAgICAgICAgYXdhaXQgY29udmVydEljb25zKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBwb3N0TXNnKFwic3ZnLXN0cmluZ3NcIiwgc3ZnU3RyaW5ncyk7XG4gICAgICAgICAgICBzdmdTdHJpbmdzID0gW107XG4gICAgICAgICAgICBzdmdFcnJvcnMgPSBbXTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsImltcG9ydCB7IHVuZ3JvdXAsIG91dGxpbmUgfSBmcm9tIFwiLi9cIjtcbmNvbnN0IGNsb25lID0gKGZyYW1lLCBwYXJlbnQpID0+IHtcbiAgICBpZiAoZnJhbWUudmlzaWJsZSkge1xuICAgICAgICBpZiAoZnJhbWUudHlwZSA9PT0gXCJJTlNUQU5DRVwiKSB7XG4gICAgICAgICAgICBmcmFtZS5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgICAgICBjbG9uZShjaGlsZCwgcGFyZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZyYW1lLnR5cGUgPT09IFwiR1JPVVBcIikge1xuICAgICAgICAgICAgdW5ncm91cChmcmFtZSwgcGFyZW50KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG91dGxpbmUoZnJhbWUpLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBjbG9uZTtcbiIsImV4cG9ydCB7IGRlZmF1bHQgYXMgdW5ncm91cCB9IGZyb20gXCIuL3VuZ3JvdXBcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgb3V0bGluZSB9IGZyb20gXCIuL291dGxpbmVcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgY2xvbmUgfSBmcm9tIFwiLi9jbG9uZVwiO1xuIiwiY29uc3Qgb3V0bGluZSA9IGl0ZW0gPT4ge1xuICAgIGlmICgoaXRlbS5zdHJva2VzICYmIGl0ZW0uc3Ryb2tlcy5sZW5ndGggPiAwICYmICFpdGVtLmZpbGxzKSB8fFxuICAgICAgICBpdGVtLmZpbGxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gW2l0ZW0ub3V0bGluZVN0cm9rZSgpXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXRlbS5zdHJva2VzICYmXG4gICAgICAgIGl0ZW0uc3Ryb2tlcy5sZW5ndGggPiAwICYmXG4gICAgICAgIGl0ZW0uZmlsbHMgJiZcbiAgICAgICAgaXRlbS5maWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCBmaWxscyA9IGl0ZW0uZmlsbHMuZmlsdGVyKGZpbGwgPT4gZmlsbC52aXNpYmxlID09PSB0cnVlKTtcbiAgICAgICAgaWYgKGZpbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBbaXRlbS5vdXRsaW5lU3Ryb2tlKCksIGl0ZW0uY2xvbmUoKV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtpdGVtLm91dGxpbmVTdHJva2UoKV07XG4gICAgfVxuICAgIGVsc2UgaWYgKCFpdGVtLnN0cm9rZXMgfHxcbiAgICAgICAgKGl0ZW0uc3Ryb2tlcy5sZW5ndGggPT09IDAgJiYgaXRlbS5maWxscyAmJiBpdGVtLmZpbGxzLmxlbmd0aCA+IDApKSB7XG4gICAgICAgIHJldHVybiBbaXRlbS5jbG9uZSgpXTtcbiAgICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgb3V0bGluZTtcbiIsImltcG9ydCBvdXRsaW5lIGZyb20gXCIuL291dGxpbmVcIjtcbmNvbnN0IHVuZ3JvdXAgPSAoZ3JvdXAsIHBhcmVudCkgPT4ge1xuICAgIGlmICghZ3JvdXAuY2hpbGRyZW4pXG4gICAgICAgIHJldHVybjtcbiAgICBncm91cC5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgbGV0IG91dGxpbmVkQ2hpbGRyZW4gPSBvdXRsaW5lKGNoaWxkKTtcbiAgICAgICAgY29uc29sZS5sb2cob3V0bGluZWRDaGlsZHJlbik7XG4gICAgICAgIG91dGxpbmVkQ2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgICAgY2hpbGQueCA9IGNoaWxkLnggKyBwYXJlbnQueDtcbiAgICAgICAgICAgIGNoaWxkLnkgPSBjaGlsZC55ICsgcGFyZW50Lnk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcbmV4cG9ydCBkZWZhdWx0IHVuZ3JvdXA7XG4iXSwic291cmNlUm9vdCI6IiJ9