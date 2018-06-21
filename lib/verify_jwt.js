var jwt = require('jsonwebtoken');
var promisifyAll = require('bluebird').promisifyAll;
var redis;

async function verifyTokenFromCache(token, redisOptions){
    redis = promisifyAll(require('redis').createClient(redisOptions));
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

module.exports  = function(token, secretOrKey, options, callback,custom=false,redisOptions) {
   if(custom){ 
       return verifyTokenFromCache(token.split('.')[2], redisOptions)
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
