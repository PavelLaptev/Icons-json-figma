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
const convertIcons = async () => {
    let selected = figma.currentPage.selection;
    if (selected.length === 0) {
        figma.notify("Please select icons");
        return;
    }
    selected.forEach((frame) => {
        let cloneFrame = figma.createFrame();
        cloneFrame.name = frame.name;
        cloneFrame.resize(frame.width, frame.height);
        frame.children.forEach(child => {
            if (child.visible) {
                console.log(child);
                cloneFrame.x = child.x;
                cloneFrame.y = child.y;
                Object(_utils__WEBPACK_IMPORTED_MODULE_0__["clone"])(child, cloneFrame);
            }
        });
        figma.flatten(cloneFrame.children);
        cloneFrame.exportAsync({ format: "SVG" }).then(result => {
            let svgString = String.fromCharCode.apply(null, result);
            svgStrings.push(svgString);
        });
    });
    return;
};
figma.on("selectionchange", () => {
    let selected = figma.currentPage.selection;
    figma.ui.postMessage({
        type: "selected-amount",
        data: selected.length
    });
});
figma.ui.onmessage = async (msg) => {
    if (msg.type === "preview") {
        await convertIcons();
        figma.ui.postMessage({
            type: "svg-strings",
            data: svgStrings
        });
        svgStrings = [];
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
            console.log(frame.name);
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
        return [item.outlineStroke(), item.clone()];
    }
    else if (!item.strokes ||
        (item.strokes.length === 0 && item.fills && item.fills.length > 0)) {
        console.log(item.strokes.length, item.fills.length);
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
    return group.children.map(child => {
        let outlinedChild = Object(_outline__WEBPACK_IMPORTED_MODULE_0__["default"])(child)[0];
        parent.appendChild(outlinedChild);
        outlinedChild.x = outlinedChild.x + parent.x;
        outlinedChild.y = outlinedChild.y + parent.y;
    });
};
/* harmony default export */ __webpack_exports__["default"] = (ungroup);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdXRpbHMvY2xvbmUudHN4Iiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdXRpbHMvaW5kZXgudHN4Iiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdXRpbHMvb3V0bGluZS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi91dGlscy91bmdyb3VwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBZ0M7QUFDaEMsd0JBQXdCLDBCQUEwQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixvREFBSztBQUNyQjtBQUNBLFNBQVM7QUFDVDtBQUNBLGdDQUFnQyxnQkFBZ0I7QUFDaEQ7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM3Q0E7QUFBQTtBQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxZQUFZLGlEQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLFlBQVksaURBQU87QUFDbkI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ2Usb0VBQUssRUFBQzs7Ozs7Ozs7Ozs7OztBQ25CckI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBK0M7QUFDQTtBQUNKOzs7Ozs7Ozs7Ozs7O0FDRjNDO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlLHNFQUFPLEVBQUM7Ozs7Ozs7Ozs7Ozs7QUNqQnZCO0FBQUE7QUFBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0RBQU87QUFDbkM7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ2Usc0VBQU8sRUFBQyIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvcGx1Z2luL2NvbnRyb2xsZXIudHNcIik7XG4iLCJpbXBvcnQgeyBjbG9uZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDI4MCwgaGVpZ2h0OiAzNTAgfSk7XG5sZXQgc3ZnU3RyaW5ncyA9IFtdO1xuY29uc3QgY29udmVydEljb25zID0gYXN5bmMgKCkgPT4ge1xuICAgIGxldCBzZWxlY3RlZCA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeShcIlBsZWFzZSBzZWxlY3QgaWNvbnNcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2VsZWN0ZWQuZm9yRWFjaCgoZnJhbWUpID0+IHtcbiAgICAgICAgbGV0IGNsb25lRnJhbWUgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xuICAgICAgICBjbG9uZUZyYW1lLm5hbWUgPSBmcmFtZS5uYW1lO1xuICAgICAgICBjbG9uZUZyYW1lLnJlc2l6ZShmcmFtZS53aWR0aCwgZnJhbWUuaGVpZ2h0KTtcbiAgICAgICAgZnJhbWUuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICBpZiAoY2hpbGQudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoaWxkKTtcbiAgICAgICAgICAgICAgICBjbG9uZUZyYW1lLnggPSBjaGlsZC54O1xuICAgICAgICAgICAgICAgIGNsb25lRnJhbWUueSA9IGNoaWxkLnk7XG4gICAgICAgICAgICAgICAgY2xvbmUoY2hpbGQsIGNsb25lRnJhbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmlnbWEuZmxhdHRlbihjbG9uZUZyYW1lLmNoaWxkcmVuKTtcbiAgICAgICAgY2xvbmVGcmFtZS5leHBvcnRBc3luYyh7IGZvcm1hdDogXCJTVkdcIiB9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBsZXQgc3ZnU3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCByZXN1bHQpO1xuICAgICAgICAgICAgc3ZnU3RyaW5ncy5wdXNoKHN2Z1N0cmluZyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybjtcbn07XG5maWdtYS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCAoKSA9PiB7XG4gICAgbGV0IHNlbGVjdGVkID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogXCJzZWxlY3RlZC1hbW91bnRcIixcbiAgICAgICAgZGF0YTogc2VsZWN0ZWQubGVuZ3RoXG4gICAgfSk7XG59KTtcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IGFzeW5jIChtc2cpID0+IHtcbiAgICBpZiAobXNnLnR5cGUgPT09IFwicHJldmlld1wiKSB7XG4gICAgICAgIGF3YWl0IGNvbnZlcnRJY29ucygpO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiBcInN2Zy1zdHJpbmdzXCIsXG4gICAgICAgICAgICBkYXRhOiBzdmdTdHJpbmdzXG4gICAgICAgIH0pO1xuICAgICAgICBzdmdTdHJpbmdzID0gW107XG4gICAgfVxufTtcbiIsImltcG9ydCB7IHVuZ3JvdXAsIG91dGxpbmUgfSBmcm9tIFwiLi9cIjtcbmNvbnN0IGNsb25lID0gKGZyYW1lLCBwYXJlbnQpID0+IHtcbiAgICBpZiAoZnJhbWUudmlzaWJsZSkge1xuICAgICAgICBpZiAoZnJhbWUudHlwZSA9PT0gXCJJTlNUQU5DRVwiKSB7XG4gICAgICAgICAgICBmcmFtZS5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgICAgICBjbG9uZShjaGlsZCwgcGFyZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZyYW1lLnR5cGUgPT09IFwiR1JPVVBcIikge1xuICAgICAgICAgICAgdW5ncm91cChmcmFtZSwgcGFyZW50KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGZyYW1lLm5hbWUpO1xuICAgICAgICAgICAgb3V0bGluZShmcmFtZSkubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChpdGVtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IGNsb25lO1xuIiwiZXhwb3J0IHsgZGVmYXVsdCBhcyB1bmdyb3VwIH0gZnJvbSBcIi4vdW5ncm91cFwiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBvdXRsaW5lIH0gZnJvbSBcIi4vb3V0bGluZVwiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBjbG9uZSB9IGZyb20gXCIuL2Nsb25lXCI7XG4iLCJjb25zdCBvdXRsaW5lID0gaXRlbSA9PiB7XG4gICAgaWYgKChpdGVtLnN0cm9rZXMgJiYgaXRlbS5zdHJva2VzLmxlbmd0aCA+IDAgJiYgIWl0ZW0uZmlsbHMpIHx8XG4gICAgICAgIGl0ZW0uZmlsbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBbaXRlbS5vdXRsaW5lU3Ryb2tlKCldO1xuICAgIH1cbiAgICBlbHNlIGlmIChpdGVtLnN0cm9rZXMgJiZcbiAgICAgICAgaXRlbS5zdHJva2VzLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgaXRlbS5maWxscyAmJlxuICAgICAgICBpdGVtLmZpbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIFtpdGVtLm91dGxpbmVTdHJva2UoKSwgaXRlbS5jbG9uZSgpXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIWl0ZW0uc3Ryb2tlcyB8fFxuICAgICAgICAoaXRlbS5zdHJva2VzLmxlbmd0aCA9PT0gMCAmJiBpdGVtLmZpbGxzICYmIGl0ZW0uZmlsbHMubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgY29uc29sZS5sb2coaXRlbS5zdHJva2VzLmxlbmd0aCwgaXRlbS5maWxscy5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gW2l0ZW0uY2xvbmUoKV07XG4gICAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IG91dGxpbmU7XG4iLCJpbXBvcnQgb3V0bGluZSBmcm9tIFwiLi9vdXRsaW5lXCI7XG5jb25zdCB1bmdyb3VwID0gKGdyb3VwLCBwYXJlbnQpID0+IHtcbiAgICBpZiAoIWdyb3VwLmNoaWxkcmVuKVxuICAgICAgICByZXR1cm47XG4gICAgcmV0dXJuIGdyb3VwLmNoaWxkcmVuLm1hcChjaGlsZCA9PiB7XG4gICAgICAgIGxldCBvdXRsaW5lZENoaWxkID0gb3V0bGluZShjaGlsZClbMF07XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChvdXRsaW5lZENoaWxkKTtcbiAgICAgICAgb3V0bGluZWRDaGlsZC54ID0gb3V0bGluZWRDaGlsZC54ICsgcGFyZW50Lng7XG4gICAgICAgIG91dGxpbmVkQ2hpbGQueSA9IG91dGxpbmVkQ2hpbGQueSArIHBhcmVudC55O1xuICAgIH0pO1xufTtcbmV4cG9ydCBkZWZhdWx0IHVuZ3JvdXA7XG4iXSwic291cmNlUm9vdCI6IiJ9