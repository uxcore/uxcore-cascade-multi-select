/**
 * only require other specs here
 */

 const req = require.context('.', false, /CascadeMultiModal\.spec\.js(x)?$/);
 req.keys().forEach(req);
