/*jslint node: true */

var Firebase = require('Firebase');
window.Firebase = Firebase;

var THREE = require('three');
window.THREE = THREE;
require('../../vendor/altspace/MTLLoader.js');

var altspace = require('../../vendor/altspace/altspace.min.js');
window.altspace = altspace;

var Please = require('../../vendor/altspace/lib/Please.js');
window.Please = Please;

require('../../vendor/altspace/utilities/simulation.js');
require('../../vendor/altspace/utilities/sync.js');
require('../../vendor/altspace/utilities/shims/behaviors.js');
require('../../vendor/altspace/utilities/shims/bubbling.js');
require('../../vendor/altspace/utilities/shims/cursor.js');
require('../../vendor/altspace/utilities/behaviors/Bob.js');
require('../../vendor/altspace/utilities/behaviors/ButtonStateStyle.js');
require('../../vendor/altspace/utilities/behaviors/Drag.js');
require('../../vendor/altspace/utilities/behaviors/GamepadControls.js');
require('../../vendor/altspace/utilities/behaviors/HoverColor.js');
require('../../vendor/altspace/utilities/behaviors/Object3DSync.js');
require('../../vendor/altspace/utilities/behaviors/SceneSync.js');
require('../../vendor/altspace/utilities/behaviors/Spin.js');
require('../../vendor/altspace/utilities/behaviors/TouchpadRotate.js');

// require('../../vendor/altspace/utilities/behaviors/Layout.es6.js');
