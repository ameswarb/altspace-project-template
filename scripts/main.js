/*jslint node: true */

var config = {
  appId: 'SpinningCube',
  authorId: 'ideacombine',
};
var CUBE_SCALE = 200;

var sim = altspace.utilities.Simulation();
var sceneSync;
altspace.utilities.sync.connect(config).then(function (connection) {
  // TODO: add baseRefUrl support
  sceneSync = altspace.utilities.behaviors.SceneSync(connection.instance, {
    instantiators: { Cube: createCube },
    ready: ready,
  });
  sim.scene.addBehavior(sceneSync);
});

function createCube() {
  // Use MTLLoader for loadTexture, to ensure image is power of 2
  // else antialiasing won't work (this is a limitation of WebGL)
  var materialCreator = new THREE.MTLLoader.MaterialCreator();
  materialCreator.crossOrigin = 'anonymous';
  var url = 'models/examples/cube/altspace-logo.jpg';
  var texture = materialCreator.loadTexture(url);
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshBasicMaterial({ color:'#ffffff', map: texture });
  var cube = new THREE.Mesh(geometry, material);
  cube.scale.multiplyScalar(CUBE_SCALE);
  cube.addBehaviors(
		altspace.utilities.behaviors.Object3DSync(),
		altspace.utilities.behaviors.Spin({ speed: 0.001 }),
    ChangeColor()
	);
  sim.scene.add(cube);
  return cube;
}

function ready(firstInstance) {
  if (firstInstance) {
    sceneSync.instantiate('Cube');
  }
}

function ChangeColor() { // define a custom behavior
  var object3d;
  var lastColor;
  var colorRef;

  function awake(o) {
    console.log('--- awake ---');

    object3d = o;
    var sync = object3d.getBehaviorByType('Object3DSync');//TODO: better way of doing this
    colorRef = sync.dataRef.child('color');
    colorRef.on('value', function (snapshot) {
      var value = snapshot.val();
      if (!value) return; //we are first to create the cube, no color set yet
      object3d.material.color = new THREE.Color(value);
      object3d.material.needsUpdate = true;//currently required in Altspace
    });

    object3d.addEventListener('cursordown', function () {
      console.log('--- cursordown ---');
      var color = Please.make_color()[0]; // random color
      colorRef.set(color);
    });
  }

  function update(deltaTime) {
    /* no updating needed, color changes in Firebase 'value' callback above */
  }

  return { awake: awake, update: update };
}
