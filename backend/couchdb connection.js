
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const nano = require('nano');

const config = {
  url: 'https://192.168.57.185:5984',
  auth: {
    username: 'd_couchdb',
    password: 'Welcome#2'
  },
  dbName: 'cred-demo'
};

const couch = nano({
  url: config.url,
  requestDefaults: {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${config.auth.username}:${config.auth.password}`).toString('base64')
    }
  }
});

// Test connection immediately
const usersDB = couch.use(config.dbName);
usersDB.info()
  .then(() => console.log('Connected to CouchDB'))
  .catch(err => console.error('CouchDB connection failed:', err.message));

module.exports = usersDB;