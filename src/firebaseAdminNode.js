var firebaseAdmin = require('firebase-admin');

function FirebaseAdminNode(config) {
  if (!config.serviceAccountJson){
    throw 'Service Account Json Not Present';
  }

  this.app = firebaseAdmin.initializeApp({
	  credential: firebaseAdmin.credential.cert(config.serviceAccountJson),
	  databaseURL: `https://${config.serviceAccountJson.project_id}.firebaseio.com`,
		storageBucket: `${config.serviceAccountJson.project_id}.appspot.com`
	});

	this._firebaseAdmin = firebaseAdmin;
	config.messaging = firebaseAdmin.messaging();
	config.database = firebaseAdmin.database();
	config.bucket = firebaseAdmin.storage().bucket();
}

FirebaseAdminNode.prototype.onClose = function(removed, done) {
	let deletePromises = [];
	firebaseAdmin.apps.forEach((app) => {
    deletePromises.push(app.delete());
  });
  Promise.all(deletePromises)
  .then(()=>{
 		done()
 	})
 	.catch((e)=>{
  	console.error(e)
 		done()
 });
};

module.exports = FirebaseAdminNode