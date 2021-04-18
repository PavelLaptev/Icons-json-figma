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
/*! no static exports found */
/***/ (function(module, exports) {

figma.showUI(__html__, { width: 320, height: 420 });
let svgStrings = [];
const isNode = (c) => c.type === "INSTANCE" ||
    c.type === "FRAME" ||
    c.type === "COMPONENT" ||
    c.type === "GROUP";
const postMsg = (type, data) => figma.ui.postMessage({
    type: type,
    data: data
});
const cloneFrame = ref => {
    let clone = figma.createFrame();
    clone.name = ref.name;
    clone.fills = ref.fills ? ref.fills : [];
    clone.resize(ref.width, ref.height);
    clone.x = ref.x;
    clone.y = ref.y;
    clone.rotation = ref.rotation;
    return clone;
};
const detachAndUnion = (page) => {
    const selection = page.selection.map(c => c.clone());
    const frameClones = selection.map(c => cloneFrame(c));
    selection.filter(isNode).forEach((c, i) => figma.union([c], frameClones[i]));
    return frameClones;
};
const convertIcons = async () => {
    const nodes = detachAndUnion(figma.currentPage);
    await nodes.forEach(c => {
        try {
            c.exportAsync({ format: "SVG" }).then(result => {
                let svgString = String.fromCharCode.apply(null, result);
                let rawSVGNode = figma.createNodeFromSvg(svgString);
                figma.flatten([figma.union(rawSVGNode.children, rawSVGNode)]);
                rawSVGNode.exportAsync({ format: "SVG" }).then(result => {
                    svgStrings.push({
                        name: c.name,
                        data: String.fromCharCode.apply(null, result)
                    });
                    c.remove();
                    rawSVGNode.remove();
                });
            });
        }
        catch (err) {
            let errorMsg = `📛 "${c.name}" icon error. Try to simplify it manually`;
            figma.notify(errorMsg, { timeout: 2000 });
            console.error(errorMsg);
            console.error(err);
            c.remove();
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
        });
    }
};


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQSx3QkFBd0IsMEJBQTBCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixnQkFBZ0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLGdCQUFnQjtBQUN4RDtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBLGtDQUFrQyxPQUFPO0FBQ3pDLG9DQUFvQyxnQkFBZ0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wbHVnaW4vY29udHJvbGxlci50c1wiKTtcbiIsImZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMzIwLCBoZWlnaHQ6IDQyMCB9KTtcbmxldCBzdmdTdHJpbmdzID0gW107XG5jb25zdCBpc05vZGUgPSAoYykgPT4gYy50eXBlID09PSBcIklOU1RBTkNFXCIgfHxcbiAgICBjLnR5cGUgPT09IFwiRlJBTUVcIiB8fFxuICAgIGMudHlwZSA9PT0gXCJDT01QT05FTlRcIiB8fFxuICAgIGMudHlwZSA9PT0gXCJHUk9VUFwiO1xuY29uc3QgcG9zdE1zZyA9ICh0eXBlLCBkYXRhKSA9PiBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBkYXRhXG59KTtcbmNvbnN0IGNsb25lRnJhbWUgPSByZWYgPT4ge1xuICAgIGxldCBjbG9uZSA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgY2xvbmUubmFtZSA9IHJlZi5uYW1lO1xuICAgIGNsb25lLmZpbGxzID0gcmVmLmZpbGxzID8gcmVmLmZpbGxzIDogW107XG4gICAgY2xvbmUucmVzaXplKHJlZi53aWR0aCwgcmVmLmhlaWdodCk7XG4gICAgY2xvbmUueCA9IHJlZi54O1xuICAgIGNsb25lLnkgPSByZWYueTtcbiAgICBjbG9uZS5yb3RhdGlvbiA9IHJlZi5yb3RhdGlvbjtcbiAgICByZXR1cm4gY2xvbmU7XG59O1xuY29uc3QgZGV0YWNoQW5kVW5pb24gPSAocGFnZSkgPT4ge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHBhZ2Uuc2VsZWN0aW9uLm1hcChjID0+IGMuY2xvbmUoKSk7XG4gICAgY29uc3QgZnJhbWVDbG9uZXMgPSBzZWxlY3Rpb24ubWFwKGMgPT4gY2xvbmVGcmFtZShjKSk7XG4gICAgc2VsZWN0aW9uLmZpbHRlcihpc05vZGUpLmZvckVhY2goKGMsIGkpID0+IGZpZ21hLnVuaW9uKFtjXSwgZnJhbWVDbG9uZXNbaV0pKTtcbiAgICByZXR1cm4gZnJhbWVDbG9uZXM7XG59O1xuY29uc3QgY29udmVydEljb25zID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG5vZGVzID0gZGV0YWNoQW5kVW5pb24oZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgIGF3YWl0IG5vZGVzLmZvckVhY2goYyA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjLmV4cG9ydEFzeW5jKHsgZm9ybWF0OiBcIlNWR1wiIH0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc3ZnU3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgIGxldCByYXdTVkdOb2RlID0gZmlnbWEuY3JlYXRlTm9kZUZyb21Tdmcoc3ZnU3RyaW5nKTtcbiAgICAgICAgICAgICAgICBmaWdtYS5mbGF0dGVuKFtmaWdtYS51bmlvbihyYXdTVkdOb2RlLmNoaWxkcmVuLCByYXdTVkdOb2RlKV0pO1xuICAgICAgICAgICAgICAgIHJhd1NWR05vZGUuZXhwb3J0QXN5bmMoeyBmb3JtYXQ6IFwiU1ZHXCIgfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdmdTdHJpbmdzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCByZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICByYXdTVkdOb2RlLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbGV0IGVycm9yTXNnID0gYPCfk5sgXCIke2MubmFtZX1cIiBpY29uIGVycm9yLiBUcnkgdG8gc2ltcGxpZnkgaXQgbWFudWFsbHlgO1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGVycm9yTXNnLCB7IHRpbWVvdXQ6IDIwMDAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yTXNnKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIGMucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5maWdtYS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCAoKSA9PiB7XG4gICAgbGV0IHNlbGVjdGVkID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIHBvc3RNc2coXCJzZWxlY3RlZC1hbW91bnRcIiwgc2VsZWN0ZWQubGVuZ3RoKTtcbn0pO1xuZmlnbWEudWkub25tZXNzYWdlID0gYXN5bmMgKG1zZykgPT4ge1xuICAgIGlmIChtc2cudHlwZSA9PT0gXCJwcmV2aWV3XCIpIHtcbiAgICAgICAgYXdhaXQgY29udmVydEljb25zKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBwb3N0TXNnKFwic3ZnLXN0cmluZ3NcIiwgc3ZnU3RyaW5ncyk7XG4gICAgICAgICAgICBzdmdTdHJpbmdzID0gW107XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iXSwic291cmNlUm9vdCI6IiJ9