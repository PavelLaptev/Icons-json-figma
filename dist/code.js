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
                    cloneFrame.remove();
                    exportedNode.remove();
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
        if (fills.lenght > 0) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdXRpbHMvY2xvbmUudHN4Iiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdXRpbHMvaW5kZXgudHN4Iiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdXRpbHMvb3V0bGluZS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi91dGlscy91bmdyb3VwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBZ0M7QUFDaEMsd0JBQXdCLDBCQUEwQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixvREFBSztBQUNyQjtBQUNBLFNBQVM7QUFDVDtBQUNBLDJDQUEyQyxnQkFBZ0I7QUFDM0Q7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLGdCQUFnQjtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBO0FBQ0EsOENBQThDLGdCQUFnQjtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOzs7Ozs7Ozs7Ozs7O0FDN0RBO0FBQUE7QUFBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsWUFBWSxpREFBTztBQUNuQjtBQUNBO0FBQ0EsWUFBWSxpREFBTztBQUNuQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDZSxvRUFBSyxFQUFDOzs7Ozs7Ozs7Ozs7O0FDbEJyQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUErQztBQUNBO0FBQ0o7Ozs7Ozs7Ozs7Ozs7QUNGM0M7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2Usc0VBQU8sRUFBQzs7Ozs7Ozs7Ozs7OztBQ3BCdkI7QUFBQTtBQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix3REFBTztBQUNuQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDZSxzRUFBTyxFQUFDIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wbHVnaW4vY29udHJvbGxlci50c1wiKTtcbiIsImltcG9ydCB7IGNsb25lIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMjgwLCBoZWlnaHQ6IDM1MCB9KTtcbmxldCBzdmdTdHJpbmdzID0gW107XG5sZXQgc3ZnRXJyb3JzID0gW107XG5jb25zdCBwb3N0TXNnID0gKHR5cGUsIGRhdGEpID0+IGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGE6IGRhdGFcbn0pO1xuY29uc3QgY29udmVydEljb25zID0gYXN5bmMgKCkgPT4ge1xuICAgIGxldCBzZWxlY3RlZCA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeShcIlBsZWFzZSBzZWxlY3QgaWNvbnNcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IHNlbGVjdGVkLm1hcCgoZnJhbWUpID0+IHtcbiAgICAgICAgbGV0IGNsb25lRnJhbWUgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xuICAgICAgICBjbG9uZUZyYW1lLm5hbWUgPSBmcmFtZS5uYW1lO1xuICAgICAgICBjbG9uZUZyYW1lLmJhY2tncm91bmRzID0gW107XG4gICAgICAgIGNsb25lRnJhbWUucmVzaXplKGZyYW1lLndpZHRoLCBmcmFtZS5oZWlnaHQpO1xuICAgICAgICBmcmFtZS5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgIGlmIChjaGlsZC52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgY2xvbmVGcmFtZS54ID0gY2hpbGQueDtcbiAgICAgICAgICAgICAgICBjbG9uZUZyYW1lLnkgPSBjaGlsZC55O1xuICAgICAgICAgICAgICAgIGNsb25lKGNoaWxkLCBjbG9uZUZyYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gY2xvbmVGcmFtZS5leHBvcnRBc3luYyh7IGZvcm1hdDogXCJTVkdcIiB9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHN2Z1N0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICBsZXQgZXhwb3J0ZWROb2RlID0gZmlnbWEuY3JlYXRlTm9kZUZyb21Tdmcoc3ZnU3RyaW5nKTtcbiAgICAgICAgICAgICAgICBmaWdtYS51bmlvbihleHBvcnRlZE5vZGUuY2hpbGRyZW4sIGV4cG9ydGVkTm9kZSk7XG4gICAgICAgICAgICAgICAgZXhwb3J0ZWROb2RlLmV4cG9ydEFzeW5jKHsgZm9ybWF0OiBcIlNWR1wiIH0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEuZmxhdHRlbihleHBvcnRlZE5vZGUuY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3ZnU3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICBzdmdTdHJpbmdzLnB1c2goc3ZnU3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgY2xvbmVGcmFtZS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0ZWROb2RlLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbGV0IGN1c3RvbUVycm9yTXNnID0gYEVycm9yIGluIFwiJHtjbG9uZUZyYW1lLm5hbWV9XCIgaWNvbmA7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGN1c3RvbUVycm9yTXNnKTtcbiAgICAgICAgICAgIHN2Z0Vycm9ycy5wdXNoKGN1c3RvbUVycm9yTXNnKTtcbiAgICAgICAgICAgIHBvc3RNc2coXCJzdmctZXJyb3JzXCIsIHN2Z0Vycm9ycyk7XG4gICAgICAgICAgICBjbG9uZUZyYW1lLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuZmlnbWEub24oXCJzZWxlY3Rpb25jaGFuZ2VcIiwgKCkgPT4ge1xuICAgIGxldCBzZWxlY3RlZCA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBwb3N0TXNnKFwic2VsZWN0ZWQtYW1vdW50XCIsIHNlbGVjdGVkLmxlbmd0aCk7XG59KTtcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IGFzeW5jIChtc2cpID0+IHtcbiAgICBpZiAobXNnLnR5cGUgPT09IFwicHJldmlld1wiKSB7XG4gICAgICAgIGF3YWl0IGNvbnZlcnRJY29ucygpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcG9zdE1zZyhcInN2Zy1zdHJpbmdzXCIsIHN2Z1N0cmluZ3MpO1xuICAgICAgICAgICAgc3ZnU3RyaW5ncyA9IFtdO1xuICAgICAgICAgICAgc3ZnRXJyb3JzID0gW107XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJpbXBvcnQgeyB1bmdyb3VwLCBvdXRsaW5lIH0gZnJvbSBcIi4vXCI7XG5jb25zdCBjbG9uZSA9IChmcmFtZSwgcGFyZW50KSA9PiB7XG4gICAgaWYgKGZyYW1lLnZpc2libGUpIHtcbiAgICAgICAgaWYgKGZyYW1lLnR5cGUgPT09IFwiSU5TVEFOQ0VcIikge1xuICAgICAgICAgICAgZnJhbWUuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICAgICAgY2xvbmUoY2hpbGQsIHBhcmVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmcmFtZS50eXBlID09PSBcIkdST1VQXCIpIHtcbiAgICAgICAgICAgIHVuZ3JvdXAoZnJhbWUsIHBhcmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvdXRsaW5lKGZyYW1lKS5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgY2xvbmU7XG4iLCJleHBvcnQgeyBkZWZhdWx0IGFzIHVuZ3JvdXAgfSBmcm9tIFwiLi91bmdyb3VwXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIG91dGxpbmUgfSBmcm9tIFwiLi9vdXRsaW5lXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGNsb25lIH0gZnJvbSBcIi4vY2xvbmVcIjtcbiIsImNvbnN0IG91dGxpbmUgPSBpdGVtID0+IHtcbiAgICBpZiAoKGl0ZW0uc3Ryb2tlcyAmJiBpdGVtLnN0cm9rZXMubGVuZ3RoID4gMCAmJiAhaXRlbS5maWxscykgfHxcbiAgICAgICAgaXRlbS5maWxscy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFtpdGVtLm91dGxpbmVTdHJva2UoKV07XG4gICAgfVxuICAgIGVsc2UgaWYgKGl0ZW0uc3Ryb2tlcyAmJlxuICAgICAgICBpdGVtLnN0cm9rZXMubGVuZ3RoID4gMCAmJlxuICAgICAgICBpdGVtLmZpbGxzICYmXG4gICAgICAgIGl0ZW0uZmlsbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgZmlsbHMgPSBpdGVtLmZpbGxzLmZpbHRlcihmaWxsID0+IGZpbGwudmlzaWJsZSA9PT0gdHJ1ZSk7XG4gICAgICAgIGlmIChmaWxscy5sZW5naHQgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gW2l0ZW0ub3V0bGluZVN0cm9rZSgpLCBpdGVtLmNsb25lKCldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbaXRlbS5vdXRsaW5lU3Ryb2tlKCldO1xuICAgIH1cbiAgICBlbHNlIGlmICghaXRlbS5zdHJva2VzIHx8XG4gICAgICAgIChpdGVtLnN0cm9rZXMubGVuZ3RoID09PSAwICYmIGl0ZW0uZmlsbHMgJiYgaXRlbS5maWxscy5sZW5ndGggPiAwKSkge1xuICAgICAgICByZXR1cm4gW2l0ZW0uY2xvbmUoKV07XG4gICAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IG91dGxpbmU7XG4iLCJpbXBvcnQgb3V0bGluZSBmcm9tIFwiLi9vdXRsaW5lXCI7XG5jb25zdCB1bmdyb3VwID0gKGdyb3VwLCBwYXJlbnQpID0+IHtcbiAgICBpZiAoIWdyb3VwLmNoaWxkcmVuKVxuICAgICAgICByZXR1cm47XG4gICAgcmV0dXJuIGdyb3VwLmNoaWxkcmVuLm1hcChjaGlsZCA9PiB7XG4gICAgICAgIGxldCBvdXRsaW5lZENoaWxkID0gb3V0bGluZShjaGlsZClbMF07XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChvdXRsaW5lZENoaWxkKTtcbiAgICAgICAgb3V0bGluZWRDaGlsZC54ID0gb3V0bGluZWRDaGlsZC54ICsgcGFyZW50Lng7XG4gICAgICAgIG91dGxpbmVkQ2hpbGQueSA9IG91dGxpbmVkQ2hpbGQueSArIHBhcmVudC55O1xuICAgIH0pO1xufTtcbmV4cG9ydCBkZWZhdWx0IHVuZ3JvdXA7XG4iXSwic291cmNlUm9vdCI6IiJ9