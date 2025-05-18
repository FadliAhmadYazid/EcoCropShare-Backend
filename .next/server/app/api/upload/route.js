"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/upload/route";
exports.ids = ["app/api/upload/route"];
exports.modules = {

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=D%3A%5CSemester%206%5Cppl%5Cmk%5Capa%20nih%5CEcoCropShare%20-%20Backend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CSemester%206%5Cppl%5Cmk%5Capa%20nih%5CEcoCropShare%20-%20Backend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=D%3A%5CSemester%206%5Cppl%5Cmk%5Capa%20nih%5CEcoCropShare%20-%20Backend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CSemester%206%5Cppl%5Cmk%5Capa%20nih%5CEcoCropShare%20-%20Backend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Semester_6_ppl_mk_apa_nih_EcoCropShare_Backend_app_api_upload_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/upload/route.ts */ \"(rsc)/./app/api/upload/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/upload/route\",\n        pathname: \"/api/upload\",\n        filename: \"route\",\n        bundlePath: \"app/api/upload/route\"\n    },\n    resolvedPagePath: \"D:\\\\Semester 6\\\\ppl\\\\mk\\\\apa nih\\\\EcoCropShare - Backend\\\\app\\\\api\\\\upload\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Semester_6_ppl_mk_apa_nih_EcoCropShare_Backend_app_api_upload_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/upload/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZ1cGxvYWQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnVwbG9hZCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnVwbG9hZCUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDU2VtZXN0ZXIlMjA2JTVDcHBsJTVDbWslNUNhcGElMjBuaWglNUNFY29Dcm9wU2hhcmUlMjAtJTIwQmFja2VuZCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9RCUzQSU1Q1NlbWVzdGVyJTIwNiU1Q3BwbCU1Q21rJTVDYXBhJTIwbmloJTVDRWNvQ3JvcFNoYXJlJTIwLSUyMEJhY2tlbmQmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ29DO0FBQ2pIO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZWNvY3JvcHNoYXJlLz82NjJkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkQ6XFxcXFNlbWVzdGVyIDZcXFxccHBsXFxcXG1rXFxcXGFwYSBuaWhcXFxcRWNvQ3JvcFNoYXJlIC0gQmFja2VuZFxcXFxhcHBcXFxcYXBpXFxcXHVwbG9hZFxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvdXBsb2FkL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvdXBsb2FkXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS91cGxvYWQvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJEOlxcXFxTZW1lc3RlciA2XFxcXHBwbFxcXFxta1xcXFxhcGEgbmloXFxcXEVjb0Nyb3BTaGFyZSAtIEJhY2tlbmRcXFxcYXBwXFxcXGFwaVxcXFx1cGxvYWRcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL3VwbG9hZC9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=D%3A%5CSemester%206%5Cppl%5Cmk%5Capa%20nih%5CEcoCropShare%20-%20Backend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CSemester%206%5Cppl%5Cmk%5Capa%20nih%5CEcoCropShare%20-%20Backend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/upload/route.ts":
/*!*********************************!*\
  !*** ./app/api/upload/route.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var cloudinary__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cloudinary */ \"(rsc)/./node_modules/cloudinary/cloudinary.js\");\n/* harmony import */ var cloudinary__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(cloudinary__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_auth_next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/next */ \"(rsc)/./node_modules/next-auth/next/index.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\n\n\n// Cloudinary configuration\ncloudinary__WEBPACK_IMPORTED_MODULE_1__.v2.config({\n    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,\n    api_key: process.env.CLOUDINARY_API_KEY,\n    api_secret: process.env.CLOUDINARY_API_SECRET\n});\nasync function POST(req) {\n    try {\n        console.log(\"Upload endpoint called\");\n        const session = await (0,next_auth_next__WEBPACK_IMPORTED_MODULE_2__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_3__.authOptions);\n        if (!session) {\n            console.log(\"Unauthorized: No session found\");\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                success: false,\n                message: \"Unauthorized\"\n            }, {\n                status: 401\n            });\n        }\n        console.log(\"User ID from session:\", session.user.id);\n        // Get data from form\n        const formData = await req.formData();\n        const file = formData.get(\"file\");\n        if (!file) {\n            console.log(\"No file uploaded\");\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                success: false,\n                message: \"No file uploaded\"\n            }, {\n                status: 400\n            });\n        }\n        console.log(\"File received:\", file.name, file.type, file.size);\n        // Read file as buffer\n        const buffer = await file.arrayBuffer();\n        const base64Data = Buffer.from(buffer).toString(\"base64\");\n        const dataURI = `data:${file.type};base64,${base64Data}`;\n        console.log(\"Uploading to Cloudinary...\");\n        // Upload to Cloudinary with profiles folder\n        const result = await new Promise((resolve, reject)=>{\n            cloudinary__WEBPACK_IMPORTED_MODULE_1__.v2.uploader.upload(dataURI, {\n                folder: \"ecocropshare/profiles\",\n                public_id: `user_${session.user.id}`,\n                overwrite: true // Overwrite old image with the same ID\n            }, (error, result)=>{\n                if (error) {\n                    console.error(\"Cloudinary upload error:\", error);\n                    reject(error);\n                } else {\n                    console.log(\"Cloudinary upload success:\", result?.secure_url);\n                    resolve(result);\n                }\n            });\n        });\n        // Return URL of successfully uploaded image\n        const imageUrl = result.secure_url;\n        console.log(\"Returning image URL:\", imageUrl);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            imageUrl: imageUrl\n        }, {\n            status: 200\n        });\n    } catch (error) {\n        console.error(\"Upload error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            message: error.message || \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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dXRlLnRzP2E4OGQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlLCBOZXh0UmVxdWVzdCB9IGZyb20gJ25leHQvc2VydmVyJztcclxuaW1wb3J0IHsgdjIgYXMgY2xvdWRpbmFyeSB9IGZyb20gJ2Nsb3VkaW5hcnknO1xyXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoL25leHQnO1xyXG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gJ0AvbGliL2F1dGgnO1xyXG5cclxuLy8gQ2xvdWRpbmFyeSBjb25maWd1cmF0aW9uXHJcbmNsb3VkaW5hcnkuY29uZmlnKHtcclxuICBjbG91ZF9uYW1lOiBwcm9jZXNzLmVudi5DTE9VRElOQVJZX0NMT1VEX05BTUUsXHJcbiAgYXBpX2tleTogcHJvY2Vzcy5lbnYuQ0xPVURJTkFSWV9BUElfS0VZLFxyXG4gIGFwaV9zZWNyZXQ6IHByb2Nlc3MuZW52LkNMT1VESU5BUllfQVBJX1NFQ1JFVFxyXG59KTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogTmV4dFJlcXVlc3QpIHtcclxuICB0cnkge1xyXG4gICAgY29uc29sZS5sb2coJ1VwbG9hZCBlbmRwb2ludCBjYWxsZWQnKTtcclxuICAgIFxyXG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xyXG4gICAgaWYgKCFzZXNzaW9uKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdVbmF1dGhvcml6ZWQ6IE5vIHNlc3Npb24gZm91bmQnKTtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICAgIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICdVbmF1dGhvcml6ZWQnIH0sXHJcbiAgICAgICAgeyBzdGF0dXM6IDQwMSB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnNvbGUubG9nKCdVc2VyIElEIGZyb20gc2Vzc2lvbjonLCBzZXNzaW9uLnVzZXIuaWQpO1xyXG4gICAgXHJcbiAgICAvLyBHZXQgZGF0YSBmcm9tIGZvcm1cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gYXdhaXQgcmVxLmZvcm1EYXRhKCk7XHJcbiAgICBjb25zdCBmaWxlID0gZm9ybURhdGEuZ2V0KCdmaWxlJykgYXMgRmlsZTtcclxuICAgIFxyXG4gICAgaWYgKCFmaWxlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdObyBmaWxlIHVwbG9hZGVkJyk7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiAnTm8gZmlsZSB1cGxvYWRlZCcgfSxcclxuICAgICAgICB7IHN0YXR1czogNDAwIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc29sZS5sb2coJ0ZpbGUgcmVjZWl2ZWQ6JywgZmlsZS5uYW1lLCBmaWxlLnR5cGUsIGZpbGUuc2l6ZSk7XHJcbiAgICBcclxuICAgIC8vIFJlYWQgZmlsZSBhcyBidWZmZXJcclxuICAgIGNvbnN0IGJ1ZmZlciA9IGF3YWl0IGZpbGUuYXJyYXlCdWZmZXIoKTtcclxuICAgIGNvbnN0IGJhc2U2NERhdGEgPSBCdWZmZXIuZnJvbShidWZmZXIpLnRvU3RyaW5nKCdiYXNlNjQnKTtcclxuICAgIGNvbnN0IGRhdGFVUkkgPSBgZGF0YToke2ZpbGUudHlwZX07YmFzZTY0LCR7YmFzZTY0RGF0YX1gO1xyXG4gICAgXHJcbiAgICBjb25zb2xlLmxvZygnVXBsb2FkaW5nIHRvIENsb3VkaW5hcnkuLi4nKTtcclxuICAgIFxyXG4gICAgLy8gVXBsb2FkIHRvIENsb3VkaW5hcnkgd2l0aCBwcm9maWxlcyBmb2xkZXJcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY2xvdWRpbmFyeS51cGxvYWRlci51cGxvYWQoXHJcbiAgICAgICAgZGF0YVVSSSxcclxuICAgICAgICB7IFxyXG4gICAgICAgICAgZm9sZGVyOiAnZWNvY3JvcHNoYXJlL3Byb2ZpbGVzJyxcclxuICAgICAgICAgIHB1YmxpY19pZDogYHVzZXJfJHtzZXNzaW9uLnVzZXIuaWR9YCxcclxuICAgICAgICAgIG92ZXJ3cml0ZTogdHJ1ZSAvLyBPdmVyd3JpdGUgb2xkIGltYWdlIHdpdGggdGhlIHNhbWUgSURcclxuICAgICAgICB9LFxyXG4gICAgICAgIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ2xvdWRpbmFyeSB1cGxvYWQgZXJyb3I6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0Nsb3VkaW5hcnkgdXBsb2FkIHN1Y2Nlc3M6JywgcmVzdWx0Py5zZWN1cmVfdXJsKTtcclxuICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICAvLyBSZXR1cm4gVVJMIG9mIHN1Y2Nlc3NmdWxseSB1cGxvYWRlZCBpbWFnZVxyXG4gICAgY29uc3QgaW1hZ2VVcmwgPSAocmVzdWx0IGFzIGFueSkuc2VjdXJlX3VybDtcclxuICAgIGNvbnNvbGUubG9nKCdSZXR1cm5pbmcgaW1hZ2UgVVJMOicsIGltYWdlVXJsKTtcclxuICAgIFxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcclxuICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgaW1hZ2VVcmw6IGltYWdlVXJsXHJcbiAgICB9LCB7IHN0YXR1czogMjAwIH0pO1xyXG4gICAgXHJcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5lcnJvcignVXBsb2FkIGVycm9yOicsIGVycm9yKTtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgeyBzdWNjZXNzOiBmYWxzZSwgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnSW50ZXJuYWwgc2VydmVyIGVycm9yJyB9LFxyXG4gICAgICB7IHN0YXR1czogNTAwIH1cclxuICAgICk7XHJcbiAgfVxyXG59Il0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInYyIiwiY2xvdWRpbmFyeSIsImdldFNlcnZlclNlc3Npb24iLCJhdXRoT3B0aW9ucyIsImNvbmZpZyIsImNsb3VkX25hbWUiLCJwcm9jZXNzIiwiZW52IiwiQ0xPVURJTkFSWV9DTE9VRF9OQU1FIiwiYXBpX2tleSIsIkNMT1VESU5BUllfQVBJX0tFWSIsImFwaV9zZWNyZXQiLCJDTE9VRElOQVJZX0FQSV9TRUNSRVQiLCJQT1NUIiwicmVxIiwiY29uc29sZSIsImxvZyIsInNlc3Npb24iLCJqc29uIiwic3VjY2VzcyIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJ1c2VyIiwiaWQiLCJmb3JtRGF0YSIsImZpbGUiLCJnZXQiLCJuYW1lIiwidHlwZSIsInNpemUiLCJidWZmZXIiLCJhcnJheUJ1ZmZlciIsImJhc2U2NERhdGEiLCJCdWZmZXIiLCJmcm9tIiwidG9TdHJpbmciLCJkYXRhVVJJIiwicmVzdWx0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJ1cGxvYWRlciIsInVwbG9hZCIsImZvbGRlciIsInB1YmxpY19pZCIsIm92ZXJ3cml0ZSIsImVycm9yIiwic2VjdXJlX3VybCIsImltYWdlVXJsIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/upload/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _models_User__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/models/User */ \"(rsc)/./models/User.ts\");\n\n\n\n\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials, req) {\n                if (!credentials?.email || !credentials?.password) {\n                    return null;\n                }\n                await (0,_db__WEBPACK_IMPORTED_MODULE_2__[\"default\"])();\n                const user = await _models_User__WEBPACK_IMPORTED_MODULE_3__[\"default\"].findOne({\n                    email: credentials.email\n                });\n                if (!user) {\n                    return null;\n                }\n                const isPasswordMatch = await bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().compare(credentials.password, user.password);\n                if (!isPasswordMatch) {\n                    return null;\n                }\n                // Return user data with optional fields\n                return {\n                    id: user._id.toString(),\n                    name: user.name,\n                    email: user.email,\n                    location: user.location,\n                    favoritePlants: user.favoritePlants || [],\n                    profileImage: user.profileImage || \"\",\n                    image: user.profileImage || \"\"\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user, trigger, session }) {\n            // Initial sign in\n            if (user) {\n                token.id = user.id;\n                token.name = user.name;\n                token.email = user.email;\n                token.location = user.location;\n                token.favoritePlants = user.favoritePlants || [];\n                token.profileImage = user.profileImage || \"\";\n            }\n            // Handle session update\n            if (trigger === \"update\" && session?.user) {\n                // Update the token with new data from the session\n                token.name = session.user.name || token.name;\n                token.email = session.user.email || token.email;\n                token.location = session.user.location || token.location;\n                token.favoritePlants = session.user.favoritePlants || [];\n                token.profileImage = session.user.profileImage || \"\";\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            // Send properties to the client\n            if (token && session.user) {\n                session.user.id = token.id;\n                session.user.name = token.name;\n                session.user.email = token.email;\n                session.user.location = token.location;\n                session.user.favoritePlants = token.favoritePlants || [];\n                session.user.profileImage = token.profileImage || \"\";\n            }\n            return session;\n        }\n    },\n    pages: {\n        signIn: \"/auth\"\n    },\n    session: {\n        strategy: \"jwt\",\n        maxAge: 30 * 24 * 60 * 60\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDa0U7QUFDcEM7QUFDRDtBQUNJO0FBRTFCLE1BQU1JLGNBQStCO0lBQzFDQyxXQUFXO1FBQ1RMLDJFQUFtQkEsQ0FBQztZQUNsQk0sTUFBTTtZQUNOQyxhQUFhO2dCQUNYQyxPQUFPO29CQUFFQyxPQUFPO29CQUFTQyxNQUFNO2dCQUFRO2dCQUN2Q0MsVUFBVTtvQkFBRUYsT0FBTztvQkFBWUMsTUFBTTtnQkFBVztZQUNsRDtZQUNBLE1BQU1FLFdBQVVMLFdBQVcsRUFBRU0sR0FBRztnQkFDOUIsSUFBSSxDQUFDTixhQUFhQyxTQUFTLENBQUNELGFBQWFJLFVBQVU7b0JBQ2pELE9BQU87Z0JBQ1Q7Z0JBRUEsTUFBTVQsK0NBQVNBO2dCQUVmLE1BQU1ZLE9BQU8sTUFBTVgsb0RBQUlBLENBQUNZLE9BQU8sQ0FBQztvQkFBRVAsT0FBT0QsWUFBWUMsS0FBSztnQkFBQztnQkFFM0QsSUFBSSxDQUFDTSxNQUFNO29CQUNULE9BQU87Z0JBQ1Q7Z0JBRUEsTUFBTUUsa0JBQWtCLE1BQU1mLHVEQUFjLENBQzFDTSxZQUFZSSxRQUFRLEVBQ3BCRyxLQUFLSCxRQUFRO2dCQUdmLElBQUksQ0FBQ0ssaUJBQWlCO29CQUNwQixPQUFPO2dCQUNUO2dCQUVBLHdDQUF3QztnQkFDeEMsT0FBTztvQkFDTEUsSUFBSUosS0FBS0ssR0FBRyxDQUFDQyxRQUFRO29CQUNyQmQsTUFBTVEsS0FBS1IsSUFBSTtvQkFDZkUsT0FBT00sS0FBS04sS0FBSztvQkFDakJhLFVBQVVQLEtBQUtPLFFBQVE7b0JBQ3ZCQyxnQkFBZ0JSLEtBQUtRLGNBQWMsSUFBSSxFQUFFO29CQUN6Q0MsY0FBY1QsS0FBS1MsWUFBWSxJQUFJO29CQUNuQ0MsT0FBT1YsS0FBS1MsWUFBWSxJQUFJO2dCQUM5QjtZQUNGO1FBQ0Y7S0FDRDtJQUNERSxXQUFXO1FBQ1QsTUFBTUMsS0FBSSxFQUFFQyxLQUFLLEVBQUViLElBQUksRUFBRWMsT0FBTyxFQUFFQyxPQUFPLEVBQUU7WUFDekMsa0JBQWtCO1lBQ2xCLElBQUlmLE1BQU07Z0JBQ1JhLE1BQU1ULEVBQUUsR0FBR0osS0FBS0ksRUFBRTtnQkFDbEJTLE1BQU1yQixJQUFJLEdBQUdRLEtBQUtSLElBQUk7Z0JBQ3RCcUIsTUFBTW5CLEtBQUssR0FBR00sS0FBS04sS0FBSztnQkFDeEJtQixNQUFNTixRQUFRLEdBQUdQLEtBQUtPLFFBQVE7Z0JBQzlCTSxNQUFNTCxjQUFjLEdBQUdSLEtBQUtRLGNBQWMsSUFBSSxFQUFFO2dCQUNoREssTUFBTUosWUFBWSxHQUFHVCxLQUFLUyxZQUFZLElBQUk7WUFDNUM7WUFFQSx3QkFBd0I7WUFDeEIsSUFBSUssWUFBWSxZQUFZQyxTQUFTZixNQUFNO2dCQUN6QyxrREFBa0Q7Z0JBQ2xEYSxNQUFNckIsSUFBSSxHQUFHdUIsUUFBUWYsSUFBSSxDQUFDUixJQUFJLElBQUlxQixNQUFNckIsSUFBSTtnQkFDNUNxQixNQUFNbkIsS0FBSyxHQUFHcUIsUUFBUWYsSUFBSSxDQUFDTixLQUFLLElBQUltQixNQUFNbkIsS0FBSztnQkFDL0NtQixNQUFNTixRQUFRLEdBQUdRLFFBQVFmLElBQUksQ0FBQ08sUUFBUSxJQUFJTSxNQUFNTixRQUFRO2dCQUN4RE0sTUFBTUwsY0FBYyxHQUFHTyxRQUFRZixJQUFJLENBQUNRLGNBQWMsSUFBSSxFQUFFO2dCQUN4REssTUFBTUosWUFBWSxHQUFHTSxRQUFRZixJQUFJLENBQUNTLFlBQVksSUFBSTtZQUNwRDtZQUVBLE9BQU9JO1FBQ1Q7UUFDQSxNQUFNRSxTQUFRLEVBQUVBLE9BQU8sRUFBRUYsS0FBSyxFQUFFO1lBQzlCLGdDQUFnQztZQUNoQyxJQUFJQSxTQUFTRSxRQUFRZixJQUFJLEVBQUU7Z0JBQ3pCZSxRQUFRZixJQUFJLENBQUNJLEVBQUUsR0FBR1MsTUFBTVQsRUFBRTtnQkFDMUJXLFFBQVFmLElBQUksQ0FBQ1IsSUFBSSxHQUFHcUIsTUFBTXJCLElBQUk7Z0JBQzlCdUIsUUFBUWYsSUFBSSxDQUFDTixLQUFLLEdBQUdtQixNQUFNbkIsS0FBSztnQkFDaENxQixRQUFRZixJQUFJLENBQUNPLFFBQVEsR0FBR00sTUFBTU4sUUFBUTtnQkFDdENRLFFBQVFmLElBQUksQ0FBQ1EsY0FBYyxHQUFHLE1BQU9BLGNBQWMsSUFBaUIsRUFBRTtnQkFDdEVPLFFBQVFmLElBQUksQ0FBQ1MsWUFBWSxHQUFHLE1BQU9BLFlBQVksSUFBZTtZQUNoRTtZQUNBLE9BQU9NO1FBQ1Q7SUFDRjtJQUNBQyxPQUFPO1FBQ0xDLFFBQVE7SUFDVjtJQUNBRixTQUFTO1FBQ1BHLFVBQVU7UUFDVkMsUUFBUSxLQUFLLEtBQUssS0FBSztJQUN6QjtJQUNBQyxRQUFRQyxRQUFRQyxHQUFHLENBQUNDLGVBQWU7QUFDckMsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Vjb2Nyb3BzaGFyZS8uL2xpYi9hdXRoLnRzP2JmN2UiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSBcIm5leHQtYXV0aFwiO1xyXG5pbXBvcnQgQ3JlZGVudGlhbHNQcm92aWRlciBmcm9tIFwibmV4dC1hdXRoL3Byb3ZpZGVycy9jcmVkZW50aWFsc1wiO1xyXG5pbXBvcnQgYmNyeXB0IGZyb20gXCJiY3J5cHRqc1wiO1xyXG5pbXBvcnQgY29ubmVjdERCIGZyb20gXCIuL2RiXCI7XHJcbmltcG9ydCBVc2VyIGZyb20gXCJAL21vZGVscy9Vc2VyXCI7XHJcblxyXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcclxuICBwcm92aWRlcnM6IFtcclxuICAgIENyZWRlbnRpYWxzUHJvdmlkZXIoe1xyXG4gICAgICBuYW1lOiBcIkNyZWRlbnRpYWxzXCIsXHJcbiAgICAgIGNyZWRlbnRpYWxzOiB7XHJcbiAgICAgICAgZW1haWw6IHsgbGFiZWw6IFwiRW1haWxcIiwgdHlwZTogXCJlbWFpbFwiIH0sXHJcbiAgICAgICAgcGFzc3dvcmQ6IHsgbGFiZWw6IFwiUGFzc3dvcmRcIiwgdHlwZTogXCJwYXNzd29yZFwiIH1cclxuICAgICAgfSxcclxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzLCByZXEpIHtcclxuICAgICAgICBpZiAoIWNyZWRlbnRpYWxzPy5lbWFpbCB8fCAhY3JlZGVudGlhbHM/LnBhc3N3b3JkKSB7XHJcbiAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF3YWl0IGNvbm5lY3REQigpO1xyXG5cclxuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5maW5kT25lKHsgZW1haWw6IGNyZWRlbnRpYWxzLmVtYWlsIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghdXNlcikge1xyXG4gICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpc1Bhc3N3b3JkTWF0Y2ggPSBhd2FpdCBiY3J5cHQuY29tcGFyZShcclxuICAgICAgICAgIGNyZWRlbnRpYWxzLnBhc3N3b3JkLFxyXG4gICAgICAgICAgdXNlci5wYXNzd29yZFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICghaXNQYXNzd29yZE1hdGNoKSB7XHJcbiAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJldHVybiB1c2VyIGRhdGEgd2l0aCBvcHRpb25hbCBmaWVsZHNcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgaWQ6IHVzZXIuX2lkLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICBuYW1lOiB1c2VyLm5hbWUsXHJcbiAgICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcclxuICAgICAgICAgIGxvY2F0aW9uOiB1c2VyLmxvY2F0aW9uLFxyXG4gICAgICAgICAgZmF2b3JpdGVQbGFudHM6IHVzZXIuZmF2b3JpdGVQbGFudHMgfHwgW10sXHJcbiAgICAgICAgICBwcm9maWxlSW1hZ2U6IHVzZXIucHJvZmlsZUltYWdlIHx8IFwiXCIsXHJcbiAgICAgICAgICBpbWFnZTogdXNlci5wcm9maWxlSW1hZ2UgfHwgXCJcIiwgLy8gU3RhbmRhcmQgTmV4dEF1dGggZmllbGRcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIF0sXHJcbiAgY2FsbGJhY2tzOiB7XHJcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciwgdHJpZ2dlciwgc2Vzc2lvbiB9KSB7XHJcbiAgICAgIC8vIEluaXRpYWwgc2lnbiBpblxyXG4gICAgICBpZiAodXNlcikge1xyXG4gICAgICAgIHRva2VuLmlkID0gdXNlci5pZDtcclxuICAgICAgICB0b2tlbi5uYW1lID0gdXNlci5uYW1lO1xyXG4gICAgICAgIHRva2VuLmVtYWlsID0gdXNlci5lbWFpbDtcclxuICAgICAgICB0b2tlbi5sb2NhdGlvbiA9IHVzZXIubG9jYXRpb247XHJcbiAgICAgICAgdG9rZW4uZmF2b3JpdGVQbGFudHMgPSB1c2VyLmZhdm9yaXRlUGxhbnRzIHx8IFtdO1xyXG4gICAgICAgIHRva2VuLnByb2ZpbGVJbWFnZSA9IHVzZXIucHJvZmlsZUltYWdlIHx8IFwiXCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEhhbmRsZSBzZXNzaW9uIHVwZGF0ZVxyXG4gICAgICBpZiAodHJpZ2dlciA9PT0gXCJ1cGRhdGVcIiAmJiBzZXNzaW9uPy51c2VyKSB7XHJcbiAgICAgICAgLy8gVXBkYXRlIHRoZSB0b2tlbiB3aXRoIG5ldyBkYXRhIGZyb20gdGhlIHNlc3Npb25cclxuICAgICAgICB0b2tlbi5uYW1lID0gc2Vzc2lvbi51c2VyLm5hbWUgfHwgdG9rZW4ubmFtZTtcclxuICAgICAgICB0b2tlbi5lbWFpbCA9IHNlc3Npb24udXNlci5lbWFpbCB8fCB0b2tlbi5lbWFpbDtcclxuICAgICAgICB0b2tlbi5sb2NhdGlvbiA9IHNlc3Npb24udXNlci5sb2NhdGlvbiB8fCB0b2tlbi5sb2NhdGlvbjtcclxuICAgICAgICB0b2tlbi5mYXZvcml0ZVBsYW50cyA9IHNlc3Npb24udXNlci5mYXZvcml0ZVBsYW50cyB8fCBbXTtcclxuICAgICAgICB0b2tlbi5wcm9maWxlSW1hZ2UgPSBzZXNzaW9uLnVzZXIucHJvZmlsZUltYWdlIHx8IFwiXCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0b2tlbjtcclxuICAgIH0sXHJcbiAgICBhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfSkge1xyXG4gICAgICAvLyBTZW5kIHByb3BlcnRpZXMgdG8gdGhlIGNsaWVudFxyXG4gICAgICBpZiAodG9rZW4gJiYgc2Vzc2lvbi51c2VyKSB7XHJcbiAgICAgICAgc2Vzc2lvbi51c2VyLmlkID0gdG9rZW4uaWQgYXMgc3RyaW5nO1xyXG4gICAgICAgIHNlc3Npb24udXNlci5uYW1lID0gdG9rZW4ubmFtZSBhcyBzdHJpbmc7XHJcbiAgICAgICAgc2Vzc2lvbi51c2VyLmVtYWlsID0gdG9rZW4uZW1haWwgYXMgc3RyaW5nO1xyXG4gICAgICAgIHNlc3Npb24udXNlci5sb2NhdGlvbiA9IHRva2VuLmxvY2F0aW9uIGFzIHN0cmluZztcclxuICAgICAgICBzZXNzaW9uLnVzZXIuZmF2b3JpdGVQbGFudHMgPSAodG9rZW4uZmF2b3JpdGVQbGFudHMgYXMgc3RyaW5nW10pIHx8IFtdO1xyXG4gICAgICAgIHNlc3Npb24udXNlci5wcm9maWxlSW1hZ2UgPSAodG9rZW4ucHJvZmlsZUltYWdlIGFzIHN0cmluZykgfHwgXCJcIjtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc2Vzc2lvbjtcclxuICAgIH1cclxuICB9LFxyXG4gIHBhZ2VzOiB7XHJcbiAgICBzaWduSW46IFwiL2F1dGhcIixcclxuICB9LFxyXG4gIHNlc3Npb246IHtcclxuICAgIHN0cmF0ZWd5OiBcImp3dFwiLFxyXG4gICAgbWF4QWdlOiAzMCAqIDI0ICogNjAgKiA2MCwgLy8gMzAgZGF5c1xyXG4gIH0sXHJcbiAgc2VjcmV0OiBwcm9jZXNzLmVudi5ORVhUQVVUSF9TRUNSRVQsXHJcbn0iXSwibmFtZXMiOlsiQ3JlZGVudGlhbHNQcm92aWRlciIsImJjcnlwdCIsImNvbm5lY3REQiIsIlVzZXIiLCJhdXRoT3B0aW9ucyIsInByb3ZpZGVycyIsIm5hbWUiLCJjcmVkZW50aWFscyIsImVtYWlsIiwibGFiZWwiLCJ0eXBlIiwicGFzc3dvcmQiLCJhdXRob3JpemUiLCJyZXEiLCJ1c2VyIiwiZmluZE9uZSIsImlzUGFzc3dvcmRNYXRjaCIsImNvbXBhcmUiLCJpZCIsIl9pZCIsInRvU3RyaW5nIiwibG9jYXRpb24iLCJmYXZvcml0ZVBsYW50cyIsInByb2ZpbGVJbWFnZSIsImltYWdlIiwiY2FsbGJhY2tzIiwiand0IiwidG9rZW4iLCJ0cmlnZ2VyIiwic2Vzc2lvbiIsInBhZ2VzIiwic2lnbkluIiwic3RyYXRlZ3kiLCJtYXhBZ2UiLCJzZWNyZXQiLCJwcm9jZXNzIiwiZW52IiwiTkVYVEFVVEhfU0VDUkVUIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst MONGODB_URI = process.env.MONGODB_URI;\nif (!MONGODB_URI) {\n    throw new Error(\"Please define the MONGODB_URI environment variable\");\n}\n// Gunakan nilai default jika global.mongoose undefined\nlet cached = global.mongoose || {\n    conn: null,\n    promise: null\n};\n// Simpan cache pada global object jika belum ada\nif (!global.mongoose) {\n    global.mongoose = cached;\n}\nasync function connectDB() {\n    if (cached.conn) {\n        return cached.conn;\n    }\n    if (!cached.promise) {\n        const opts = {\n            bufferCommands: false\n        };\n        cached.promise = mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(MONGODB_URI, opts).then((mongoose)=>{\n            return mongoose;\n        });\n    }\n    try {\n        cached.conn = await cached.promise;\n    } catch (e) {\n        cached.promise = null;\n        throw e;\n    }\n    return cached.conn;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (connectDB);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWdDO0FBRWhDLE1BQU1DLGNBQWNDLFFBQVFDLEdBQUcsQ0FBQ0YsV0FBVztBQUUzQyxJQUFJLENBQUNBLGFBQWE7SUFDaEIsTUFBTSxJQUFJRyxNQUFNO0FBQ2xCO0FBYUEsdURBQXVEO0FBQ3ZELElBQUlDLFNBQXdCQyxPQUFPTixRQUFRLElBQUk7SUFBRU8sTUFBTTtJQUFNQyxTQUFTO0FBQUs7QUFFM0UsaURBQWlEO0FBQ2pELElBQUksQ0FBQ0YsT0FBT04sUUFBUSxFQUFFO0lBQ3BCTSxPQUFPTixRQUFRLEdBQUdLO0FBQ3BCO0FBRUEsZUFBZUk7SUFDYixJQUFJSixPQUFPRSxJQUFJLEVBQUU7UUFDZixPQUFPRixPQUFPRSxJQUFJO0lBQ3BCO0lBRUEsSUFBSSxDQUFDRixPQUFPRyxPQUFPLEVBQUU7UUFDbkIsTUFBTUUsT0FBTztZQUNYQyxnQkFBZ0I7UUFDbEI7UUFFQU4sT0FBT0csT0FBTyxHQUFHUix1REFBZ0IsQ0FBQ0MsYUFBY1MsTUFBTUcsSUFBSSxDQUFDLENBQUNiO1lBQzFELE9BQU9BO1FBQ1Q7SUFDRjtJQUVBLElBQUk7UUFDRkssT0FBT0UsSUFBSSxHQUFHLE1BQU1GLE9BQU9HLE9BQU87SUFDcEMsRUFBRSxPQUFPTSxHQUFHO1FBQ1ZULE9BQU9HLE9BQU8sR0FBRztRQUNqQixNQUFNTTtJQUNSO0lBRUEsT0FBT1QsT0FBT0UsSUFBSTtBQUNwQjtBQUVBLGlFQUFlRSxTQUFTQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZWNvY3JvcHNoYXJlLy4vbGliL2RiLnRzPzFkZjAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IE1PTkdPREJfVVJJID0gcHJvY2Vzcy5lbnYuTU9OR09EQl9VUkk7XHJcblxyXG5pZiAoIU1PTkdPREJfVVJJKSB7XHJcbiAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgZGVmaW5lIHRoZSBNT05HT0RCX1VSSSBlbnZpcm9ubWVudCB2YXJpYWJsZScpO1xyXG59XHJcblxyXG4vLyBEZWZpbmlzaWthbiB0aXBlIHVudHVrIGNhY2hlIG1vbmdvb3NlXHJcbmludGVyZmFjZSBNb25nb29zZUNhY2hlIHtcclxuICBjb25uOiB0eXBlb2YgbW9uZ29vc2UgfCBudWxsO1xyXG4gIHByb21pc2U6IFByb21pc2U8dHlwZW9mIG1vbmdvb3NlPiB8IG51bGw7XHJcbn1cclxuXHJcbi8vIERla2xhcmFzaWthbiBwYWRhIG5hbWVzcGFjZSBnbG9iYWxcclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gIHZhciBtb25nb29zZTogTW9uZ29vc2VDYWNoZSB8IHVuZGVmaW5lZDtcclxufVxyXG5cclxuLy8gR3VuYWthbiBuaWxhaSBkZWZhdWx0IGppa2EgZ2xvYmFsLm1vbmdvb3NlIHVuZGVmaW5lZFxyXG5sZXQgY2FjaGVkOiBNb25nb29zZUNhY2hlID0gZ2xvYmFsLm1vbmdvb3NlIHx8IHsgY29ubjogbnVsbCwgcHJvbWlzZTogbnVsbCB9O1xyXG5cclxuLy8gU2ltcGFuIGNhY2hlIHBhZGEgZ2xvYmFsIG9iamVjdCBqaWthIGJlbHVtIGFkYVxyXG5pZiAoIWdsb2JhbC5tb25nb29zZSkge1xyXG4gIGdsb2JhbC5tb25nb29zZSA9IGNhY2hlZDtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gY29ubmVjdERCKCkge1xyXG4gIGlmIChjYWNoZWQuY29ubikge1xyXG4gICAgcmV0dXJuIGNhY2hlZC5jb25uO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFjYWNoZWQucHJvbWlzZSkge1xyXG4gICAgY29uc3Qgb3B0cyA9IHtcclxuICAgICAgYnVmZmVyQ29tbWFuZHM6IGZhbHNlLFxyXG4gICAgfTtcclxuXHJcbiAgICBjYWNoZWQucHJvbWlzZSA9IG1vbmdvb3NlLmNvbm5lY3QoTU9OR09EQl9VUkkhLCBvcHRzKS50aGVuKChtb25nb29zZSkgPT4ge1xyXG4gICAgICByZXR1cm4gbW9uZ29vc2U7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjYWNoZWQuY29ubiA9IGF3YWl0IGNhY2hlZC5wcm9taXNlO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNhY2hlZC5wcm9taXNlID0gbnVsbDtcclxuICAgIHRocm93IGU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY2FjaGVkLmNvbm47XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3REQjsiXSwibmFtZXMiOlsibW9uZ29vc2UiLCJNT05HT0RCX1VSSSIsInByb2Nlc3MiLCJlbnYiLCJFcnJvciIsImNhY2hlZCIsImdsb2JhbCIsImNvbm4iLCJwcm9taXNlIiwiY29ubmVjdERCIiwib3B0cyIsImJ1ZmZlckNvbW1hbmRzIiwiY29ubmVjdCIsInRoZW4iLCJlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ }),

/***/ "(rsc)/./models/User.ts":
/*!************************!*\
  !*** ./models/User.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst userSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({\n    name: {\n        type: String,\n        required: true\n    },\n    email: {\n        type: String,\n        required: true,\n        unique: true\n    },\n    password: {\n        type: String,\n        required: true\n    },\n    location: {\n        type: String,\n        required: true\n    },\n    favoritePlants: {\n        type: [\n            String\n        ],\n        default: []\n    },\n    profileImage: {\n        type: String,\n        default: \"\"\n    },\n    createdAt: {\n        type: Date,\n        default: Date.now\n    }\n});\n// Hash password before saving\nuserSchema.pre(\"save\", async function(next) {\n    if (!this.isModified(\"password\")) {\n        return next();\n    }\n    try {\n        const salt = await bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().genSalt(10);\n        this.password = await bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().hash(this.password, salt);\n        next();\n    } catch (error) {\n        next(error);\n    }\n});\n// Method to compare passwords\nuserSchema.methods.comparePassword = async function(candidatePassword) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().compare(candidatePassword, this.password);\n};\n// Add virtual 'id' property\nuserSchema.virtual(\"id\").get(function() {\n    return this._id.toHexString();\n});\n// Ensure virtual fields are included when converting to JSON\nuserSchema.set(\"toJSON\", {\n    virtuals: true,\n    transform: (doc, ret)=>{\n        delete ret.__v;\n        return ret;\n    }\n});\nconst User = mongoose__WEBPACK_IMPORTED_MODULE_0__.models.User || mongoose__WEBPACK_IMPORTED_MODULE_0___default().model(\"User\", userSchema);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (User);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9tb2RlbHMvVXNlci50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFvRDtBQUN0QjtBQUU5QixNQUFNSSxhQUFhLElBQUlILDRDQUFNQSxDQUFDO0lBQzVCSSxNQUFNO1FBQ0pDLE1BQU1DO1FBQ05DLFVBQVU7SUFDWjtJQUNBQyxPQUFPO1FBQ0xILE1BQU1DO1FBQ05DLFVBQVU7UUFDVkUsUUFBUTtJQUNWO0lBQ0FDLFVBQVU7UUFDUkwsTUFBTUM7UUFDTkMsVUFBVTtJQUNaO0lBQ0FJLFVBQVU7UUFDUk4sTUFBTUM7UUFDTkMsVUFBVTtJQUNaO0lBQ0FLLGdCQUFnQjtRQUNkUCxNQUFNO1lBQUNDO1NBQU87UUFDZE8sU0FBUyxFQUFFO0lBQ2I7SUFDQUMsY0FBYztRQUNaVCxNQUFNQztRQUNOTyxTQUFTO0lBQ1g7SUFDQUUsV0FBVztRQUNUVixNQUFNVztRQUNOSCxTQUFTRyxLQUFLQyxHQUFHO0lBQ25CO0FBQ0Y7QUFFQSw4QkFBOEI7QUFDOUJkLFdBQVdlLEdBQUcsQ0FBQyxRQUFRLGVBQWdCQyxJQUFJO0lBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUNDLFVBQVUsQ0FBQyxhQUFhO1FBQ2hDLE9BQU9EO0lBQ1Q7SUFFQSxJQUFJO1FBQ0YsTUFBTUUsT0FBTyxNQUFNbkIsdURBQWMsQ0FBQztRQUNsQyxJQUFJLENBQUNRLFFBQVEsR0FBRyxNQUFNUixvREFBVyxDQUFDLElBQUksQ0FBQ1EsUUFBUSxFQUFFVztRQUNqREY7SUFDRixFQUFFLE9BQU9LLE9BQVk7UUFDbkJMLEtBQUtLO0lBQ1A7QUFDRjtBQUVBLDhCQUE4QjtBQUM5QnJCLFdBQVdzQixPQUFPLENBQUNDLGVBQWUsR0FBRyxlQUFnQkMsaUJBQXlCO0lBQzVFLE9BQU96Qix1REFBYyxDQUFDeUIsbUJBQW1CLElBQUksQ0FBQ2pCLFFBQVE7QUFDeEQ7QUFFQSw0QkFBNEI7QUFDNUJQLFdBQVcwQixPQUFPLENBQUMsTUFBTUMsR0FBRyxDQUFDO0lBQzNCLE9BQU8sSUFBSSxDQUFDQyxHQUFHLENBQUNDLFdBQVc7QUFDN0I7QUFFQSw2REFBNkQ7QUFDN0Q3QixXQUFXOEIsR0FBRyxDQUFDLFVBQVU7SUFDdkJDLFVBQVU7SUFDVkMsV0FBVyxDQUFDQyxLQUFLQztRQUNmLE9BQU9BLElBQUlDLEdBQUc7UUFDZCxPQUFPRDtJQUNUO0FBQ0Y7QUFFQSxNQUFNRSxPQUFPdEMsNENBQU1BLENBQUNzQyxJQUFJLElBQUl4QyxxREFBYyxDQUFDLFFBQVFJO0FBRW5ELGlFQUFlb0MsSUFBSUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Vjb2Nyb3BzaGFyZS8uL21vZGVscy9Vc2VyLnRzPzZkYzYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlLCB7IFNjaGVtYSwgbW9kZWxzIH0gZnJvbSAnbW9uZ29vc2UnO1xyXG5pbXBvcnQgYmNyeXB0IGZyb20gJ2JjcnlwdGpzJztcclxuXHJcbmNvbnN0IHVzZXJTY2hlbWEgPSBuZXcgU2NoZW1hKHtcclxuICBuYW1lOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICByZXF1aXJlZDogdHJ1ZSxcclxuICB9LFxyXG4gIGVtYWlsOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgIHVuaXF1ZTogdHJ1ZSxcclxuICB9LFxyXG4gIHBhc3N3b3JkOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICByZXF1aXJlZDogdHJ1ZSxcclxuICB9LFxyXG4gIGxvY2F0aW9uOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICByZXF1aXJlZDogdHJ1ZSxcclxuICB9LFxyXG4gIGZhdm9yaXRlUGxhbnRzOiB7XHJcbiAgICB0eXBlOiBbU3RyaW5nXSxcclxuICAgIGRlZmF1bHQ6IFtdLFxyXG4gIH0sXHJcbiAgcHJvZmlsZUltYWdlOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnJyxcclxuICB9LFxyXG4gIGNyZWF0ZWRBdDoge1xyXG4gICAgdHlwZTogRGF0ZSxcclxuICAgIGRlZmF1bHQ6IERhdGUubm93LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuLy8gSGFzaCBwYXNzd29yZCBiZWZvcmUgc2F2aW5nXHJcbnVzZXJTY2hlbWEucHJlKCdzYXZlJywgYXN5bmMgZnVuY3Rpb24gKG5leHQpIHtcclxuICBpZiAoIXRoaXMuaXNNb2RpZmllZCgncGFzc3dvcmQnKSkge1xyXG4gICAgcmV0dXJuIG5leHQoKTtcclxuICB9XHJcbiAgXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHNhbHQgPSBhd2FpdCBiY3J5cHQuZ2VuU2FsdCgxMCk7XHJcbiAgICB0aGlzLnBhc3N3b3JkID0gYXdhaXQgYmNyeXB0Lmhhc2godGhpcy5wYXNzd29yZCwgc2FsdCk7XHJcbiAgICBuZXh0KCk7XHJcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgbmV4dChlcnJvcik7XHJcbiAgfVxyXG59KTtcclxuXHJcbi8vIE1ldGhvZCB0byBjb21wYXJlIHBhc3N3b3Jkc1xyXG51c2VyU2NoZW1hLm1ldGhvZHMuY29tcGFyZVBhc3N3b3JkID0gYXN5bmMgZnVuY3Rpb24gKGNhbmRpZGF0ZVBhc3N3b3JkOiBzdHJpbmcpIHtcclxuICByZXR1cm4gYmNyeXB0LmNvbXBhcmUoY2FuZGlkYXRlUGFzc3dvcmQsIHRoaXMucGFzc3dvcmQpO1xyXG59O1xyXG5cclxuLy8gQWRkIHZpcnR1YWwgJ2lkJyBwcm9wZXJ0eVxyXG51c2VyU2NoZW1hLnZpcnR1YWwoJ2lkJykuZ2V0KGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLl9pZC50b0hleFN0cmluZygpO1xyXG59KTtcclxuXHJcbi8vIEVuc3VyZSB2aXJ0dWFsIGZpZWxkcyBhcmUgaW5jbHVkZWQgd2hlbiBjb252ZXJ0aW5nIHRvIEpTT05cclxudXNlclNjaGVtYS5zZXQoJ3RvSlNPTicsIHtcclxuICB2aXJ0dWFsczogdHJ1ZSxcclxuICB0cmFuc2Zvcm06IChkb2MsIHJldCkgPT4ge1xyXG4gICAgZGVsZXRlIHJldC5fX3Y7XHJcbiAgICByZXR1cm4gcmV0O1xyXG4gIH1cclxufSk7XHJcblxyXG5jb25zdCBVc2VyID0gbW9kZWxzLlVzZXIgfHwgbW9uZ29vc2UubW9kZWwoJ1VzZXInLCB1c2VyU2NoZW1hKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFVzZXI7Il0sIm5hbWVzIjpbIm1vbmdvb3NlIiwiU2NoZW1hIiwibW9kZWxzIiwiYmNyeXB0IiwidXNlclNjaGVtYSIsIm5hbWUiLCJ0eXBlIiwiU3RyaW5nIiwicmVxdWlyZWQiLCJlbWFpbCIsInVuaXF1ZSIsInBhc3N3b3JkIiwibG9jYXRpb24iLCJmYXZvcml0ZVBsYW50cyIsImRlZmF1bHQiLCJwcm9maWxlSW1hZ2UiLCJjcmVhdGVkQXQiLCJEYXRlIiwibm93IiwicHJlIiwibmV4dCIsImlzTW9kaWZpZWQiLCJzYWx0IiwiZ2VuU2FsdCIsImhhc2giLCJlcnJvciIsIm1ldGhvZHMiLCJjb21wYXJlUGFzc3dvcmQiLCJjYW5kaWRhdGVQYXNzd29yZCIsImNvbXBhcmUiLCJ2aXJ0dWFsIiwiZ2V0IiwiX2lkIiwidG9IZXhTdHJpbmciLCJzZXQiLCJ2aXJ0dWFscyIsInRyYW5zZm9ybSIsImRvYyIsInJldCIsIl9fdiIsIlVzZXIiLCJtb2RlbCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./models/User.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/bcryptjs","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva","vendor-chunks/lodash","vendor-chunks/cloudinary","vendor-chunks/q"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=D%3A%5CSemester%206%5Cppl%5Cmk%5Capa%20nih%5CEcoCropShare%20-%20Backend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CSemester%206%5Cppl%5Cmk%5Capa%20nih%5CEcoCropShare%20-%20Backend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();