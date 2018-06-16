var jwt = require('jsonwebtoken');
var promisifyAll = require('bluebird').promisifyAll;
var redis = promisifyAll(require('redis').createClient());

async function verifyTokenFromCache(token){
    if(token){
        try{
            const exists = await redis.existsAsync(token);          
            if(!exists){
                throw 'Invalid Token'
            }
        }catch(err){
            throw err;
        }
    }
   
}

module.exports  = function(token, secretOrKey, options, callback,custom=false,) {
   if(custom){ 
       return verifyTokenFromCache(token.split('.')[2])
        .then(res=>{
            return jwt.verify(token, secretOrKey, options, callback);
        })
        .catch(err=>{
            callback(err);
        })
    }else{
        return jwt.verify(token,secretOrKey, options, callback)
    }
};
