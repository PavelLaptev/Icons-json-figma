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
        cloneFrame.backgrounds = [];
        cloneFrame.name = frame.name;
        cloneFrame.resize(frame.width, frame.height);
        frame.children.forEach(child => {
            if (child.visible) {
                cloneFrame.relativeTransform = child.relativeTransform;
                Object(_utils__WEBPACK_IMPORTED_MODULE_0__["clone"])(child, cloneFrame);
            }
        });
        cloneFrame.children.forEach(child => {
            figma.flatten([child]);
        });
        let unionSVG = figma.union([cloneFrame], figma.currentPage);
        let childrenGroup = figma.group(cloneFrame.children, cloneFrame);
        let groupPosition = {
            x: childrenGroup.x,
            y: childrenGroup.y
        };
        let exportContainer = figma.createFrame();
        exportContainer.resize(cloneFrame.width, cloneFrame.height);
        exportContainer.backgrounds = [];
        exportContainer.appendChild(unionSVG);
        unionSVG.x = groupPosition.x;
        unionSVG.y = groupPosition.y;
        exportContainer.exportAsync({ format: "SVG" }).then(result => {
            let svgString = String.fromCharCode.apply(null, result);
            svgStrings.push(svgString);
            exportContainer.remove();
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
            parent.appendChild(Object(___WEBPACK_IMPORTED_MODULE_0__["outline"])(frame));
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
const outline = child => {
    if (child.strokes.length > 0) {
        return child.outlineStroke();
    }
    else {
        return child.clone();
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
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ */ "./src/plugin/utils/index.tsx");

const ungroup = (group, parent) => {
    if (!group.children)
        return;
    return group.children.map(child => {
        let outlinedChild = Object(___WEBPACK_IMPORTED_MODULE_0__["outline"])(child);
        parent.appendChild(outlinedChild);
        outlinedChild.x = outlinedChild.x + parent.x;
        outlinedChild.y = outlinedChild.y + parent.y;
    });
};
/* harmony default export */ __webpack_exports__["default"] = (ungroup);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdXRpbHMvY2xvbmUudHN4Iiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdXRpbHMvaW5kZXgudHN4Iiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdXRpbHMvb3V0bGluZS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi91dGlscy91bmdyb3VwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBZ0M7QUFDaEMsd0JBQXdCLDBCQUEwQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0Isb0RBQUs7QUFDckI7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsZ0JBQWdCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUMzREE7QUFBQTtBQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxZQUFZLGlEQUFPO0FBQ25CO0FBQ0E7QUFDQSwrQkFBK0IsaURBQU87QUFDdEM7QUFDQTtBQUNBO0FBQ2Usb0VBQUssRUFBQzs7Ozs7Ozs7Ozs7OztBQ2hCckI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBK0M7QUFDQTtBQUNKOzs7Ozs7Ozs7Ozs7O0FDRjNDO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlLHNFQUFPLEVBQUM7Ozs7Ozs7Ozs7Ozs7QUNSdkI7QUFBQTtBQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixpREFBTztBQUNuQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDZSxzRUFBTyxFQUFDIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wbHVnaW4vY29udHJvbGxlci50c1wiKTtcbiIsImltcG9ydCB7IGNsb25lIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMjgwLCBoZWlnaHQ6IDM1MCB9KTtcbmxldCBzdmdTdHJpbmdzID0gW107XG5jb25zdCBjb252ZXJ0SWNvbnMgPSBhc3luYyAoKSA9PiB7XG4gICAgbGV0IHNlbGVjdGVkID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KFwiUGxlYXNlIHNlbGVjdCBpY29uc1wiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZWxlY3RlZC5mb3JFYWNoKChmcmFtZSkgPT4ge1xuICAgICAgICBsZXQgY2xvbmVGcmFtZSA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgICAgIGNsb25lRnJhbWUuYmFja2dyb3VuZHMgPSBbXTtcbiAgICAgICAgY2xvbmVGcmFtZS5uYW1lID0gZnJhbWUubmFtZTtcbiAgICAgICAgY2xvbmVGcmFtZS5yZXNpemUoZnJhbWUud2lkdGgsIGZyYW1lLmhlaWdodCk7XG4gICAgICAgIGZyYW1lLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgaWYgKGNoaWxkLnZpc2libGUpIHtcbiAgICAgICAgICAgICAgICBjbG9uZUZyYW1lLnJlbGF0aXZlVHJhbnNmb3JtID0gY2hpbGQucmVsYXRpdmVUcmFuc2Zvcm07XG4gICAgICAgICAgICAgICAgY2xvbmUoY2hpbGQsIGNsb25lRnJhbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY2xvbmVGcmFtZS5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgIGZpZ21hLmZsYXR0ZW4oW2NoaWxkXSk7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgdW5pb25TVkcgPSBmaWdtYS51bmlvbihbY2xvbmVGcmFtZV0sIGZpZ21hLmN1cnJlbnRQYWdlKTtcbiAgICAgICAgbGV0IGNoaWxkcmVuR3JvdXAgPSBmaWdtYS5ncm91cChjbG9uZUZyYW1lLmNoaWxkcmVuLCBjbG9uZUZyYW1lKTtcbiAgICAgICAgbGV0IGdyb3VwUG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiBjaGlsZHJlbkdyb3VwLngsXG4gICAgICAgICAgICB5OiBjaGlsZHJlbkdyb3VwLnlcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGV4cG9ydENvbnRhaW5lciA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgICAgIGV4cG9ydENvbnRhaW5lci5yZXNpemUoY2xvbmVGcmFtZS53aWR0aCwgY2xvbmVGcmFtZS5oZWlnaHQpO1xuICAgICAgICBleHBvcnRDb250YWluZXIuYmFja2dyb3VuZHMgPSBbXTtcbiAgICAgICAgZXhwb3J0Q29udGFpbmVyLmFwcGVuZENoaWxkKHVuaW9uU1ZHKTtcbiAgICAgICAgdW5pb25TVkcueCA9IGdyb3VwUG9zaXRpb24ueDtcbiAgICAgICAgdW5pb25TVkcueSA9IGdyb3VwUG9zaXRpb24ueTtcbiAgICAgICAgZXhwb3J0Q29udGFpbmVyLmV4cG9ydEFzeW5jKHsgZm9ybWF0OiBcIlNWR1wiIH0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGxldCBzdmdTdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIHJlc3VsdCk7XG4gICAgICAgICAgICBzdmdTdHJpbmdzLnB1c2goc3ZnU3RyaW5nKTtcbiAgICAgICAgICAgIGV4cG9ydENvbnRhaW5lci5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuO1xufTtcbmZpZ21hLm9uKFwic2VsZWN0aW9uY2hhbmdlXCIsICgpID0+IHtcbiAgICBsZXQgc2VsZWN0ZWQgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiBcInNlbGVjdGVkLWFtb3VudFwiLFxuICAgICAgICBkYXRhOiBzZWxlY3RlZC5sZW5ndGhcbiAgICB9KTtcbn0pO1xuZmlnbWEudWkub25tZXNzYWdlID0gYXN5bmMgKG1zZykgPT4ge1xuICAgIGlmIChtc2cudHlwZSA9PT0gXCJwcmV2aWV3XCIpIHtcbiAgICAgICAgYXdhaXQgY29udmVydEljb25zKCk7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6IFwic3ZnLXN0cmluZ3NcIixcbiAgICAgICAgICAgIGRhdGE6IHN2Z1N0cmluZ3NcbiAgICAgICAgfSk7XG4gICAgICAgIHN2Z1N0cmluZ3MgPSBbXTtcbiAgICB9XG59O1xuIiwiaW1wb3J0IHsgdW5ncm91cCwgb3V0bGluZSB9IGZyb20gXCIuL1wiO1xuY29uc3QgY2xvbmUgPSAoZnJhbWUsIHBhcmVudCkgPT4ge1xuICAgIGlmIChmcmFtZS52aXNpYmxlKSB7XG4gICAgICAgIGlmIChmcmFtZS50eXBlID09PSBcIklOU1RBTkNFXCIpIHtcbiAgICAgICAgICAgIGZyYW1lLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgICAgIGNsb25lKGNoaWxkLCBwYXJlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZnJhbWUudHlwZSA9PT0gXCJHUk9VUFwiKSB7XG4gICAgICAgICAgICB1bmdyb3VwKGZyYW1lLCBwYXJlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKG91dGxpbmUoZnJhbWUpKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBjbG9uZTtcbiIsImV4cG9ydCB7IGRlZmF1bHQgYXMgdW5ncm91cCB9IGZyb20gXCIuL3VuZ3JvdXBcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgb3V0bGluZSB9IGZyb20gXCIuL291dGxpbmVcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgY2xvbmUgfSBmcm9tIFwiLi9jbG9uZVwiO1xuIiwiY29uc3Qgb3V0bGluZSA9IGNoaWxkID0+IHtcbiAgICBpZiAoY2hpbGQuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBjaGlsZC5vdXRsaW5lU3Ryb2tlKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gY2hpbGQuY2xvbmUoKTtcbiAgICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgb3V0bGluZTtcbiIsImltcG9ydCB7IG91dGxpbmUgfSBmcm9tIFwiLi9cIjtcbmNvbnN0IHVuZ3JvdXAgPSAoZ3JvdXAsIHBhcmVudCkgPT4ge1xuICAgIGlmICghZ3JvdXAuY2hpbGRyZW4pXG4gICAgICAgIHJldHVybjtcbiAgICByZXR1cm4gZ3JvdXAuY2hpbGRyZW4ubWFwKGNoaWxkID0+IHtcbiAgICAgICAgbGV0IG91dGxpbmVkQ2hpbGQgPSBvdXRsaW5lKGNoaWxkKTtcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKG91dGxpbmVkQ2hpbGQpO1xuICAgICAgICBvdXRsaW5lZENoaWxkLnggPSBvdXRsaW5lZENoaWxkLnggKyBwYXJlbnQueDtcbiAgICAgICAgb3V0bGluZWRDaGlsZC55ID0gb3V0bGluZWRDaGlsZC55ICsgcGFyZW50Lnk7XG4gICAgfSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgdW5ncm91cDtcbiJdLCJzb3VyY2VSb290IjoiIn0=