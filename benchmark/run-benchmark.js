import { getSize, pad, runBenchmark } from './utils.js';
import * as THREE from '../node_modules/three/build/three.module.js';
import '../index.js';

const geometry = new THREE.TorusBufferGeometry( 5, 5, 1000, 25 );
const mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial() );
const raycaster = new THREE.Raycaster();
raycaster.ray.origin.set( 0, 0, - 10 );
raycaster.ray.direction.set( 0, 0, 1 );

runBenchmark(

	'Compute Bounds Tree',
	() => {

		geometry.computeBoundsTree();
		geometry.boundsTree = null;

	},
	3000,
	50

);


geometry.boundsTree = null;
raycaster.firstHitOnly = false;
runBenchmark(

	'Default Raycast',
	() => mesh.raycast( raycaster, [] ),
	3000

);

geometry.computeBoundsTree();
raycaster.firstHitOnly = false;
runBenchmark(

	'BVH Raycast',
	() => mesh.raycast( raycaster, [] ),
	3000

);


geometry.computeBoundsTree();
raycaster.firstHitOnly = true;
runBenchmark(

	'First Hit Raycast',
	() => mesh.raycast( raycaster, [] ),
	3000

);

console.log( '' );

geometry.computeBoundsTree();
const bvhSize = getSize( geometry.boundsTree );
console.log( `${ pad( 'Total Memory Usage', 25 ) }: ${ bvhSize / 1000 } kb` );

// NOTE: There is a reference to the geometry in the bounds tree so the
// geometry will get rolled up with the tree. Subtract it out here.
// If the reference is removed then this will no longer be valid.
geometry.boundsTree = null;
const geoSize = getSize( geometry );
console.log( `${ pad( 'Geometry Memory Usage', 25 ) }: ${ geoSize / 1000 } kb` );

console.log( `${ pad( 'Bounds Tree Memory Usage', 25 ) }: ${ ( bvhSize - geoSize ) / 1000 } kb` );
