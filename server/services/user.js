import User from '../models/user.js';
import FireBaseToken from '../models/fireBaseToken.js';
import jwt from 'jsonwebtoken'

import admin from 'firebase-admin';

// import serviceAccount from '../makore-8407b-firebase-adminsdk-vnd15-25ae054a5b.json' assert {type: 'json'};

const  serviceAccount = {
    "type": "service_account",
    "project_id": "makore-8407b",
    "private_key_id": "25ae054a5bf264ed7b0b3cdf95f4ae9c5882807b",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD1B9G5AiDVvPZi\n6ha2SemGRDD+cx4O0Idf0iSkctwKnWAJ5yU/NLYtkmLf3CeUyvrSN1l2INKQF1NR\nWgbd1MPAnIBqfjO1OFpxl4mRaG1Yj3GcuNYLKuJqAuOwSukrjeWYIu3iXMBn2oru\n6jDXCqSt8Ni33EDOOJfKlPusiYM2/VLDxTNpSP5hWaQWCC88XB7rO0Th6LRPy0Wc\na+9p2naaNBcl8EyjlsZKloXdKH8URhEIBItZXPKSKgJGtx8iE5AJk2QgqVJKMXB8\nKAq5G8ACv6hQcLyyuDrE7REIahYJ9P0FBDk93hwYkFQ9eLmlHEhGcxXI/vHXgo1z\nMv6EjvZJAgMBAAECggEAN6E51RYNnFkVWymoVGR9dzU+Jla+aUCgq3mLRiapnGNU\nbYsj4rC196y3c/mIpvhab6WPUwlqpLoW+W5GBtEKTE17vjG+zZLovcdYvUGHKccP\nVTSFq+1lkAnt5ZVsUK4bhSnQ9kZ2jF2Kk2lqAzhwYOlAWqXPtMIWfDDM3sQtnSr+\nhgrS4ClgAspCPUebXpMrKH8yP9elO21qGq3M9xJ17SEYnGrNdaESfYjxyvssfx+Q\nm1G5/gyWpJwfeoy6ixSb8iK1kbv7+MtFAsje5jeYIpJrh3O02vHnyhU61yylUelK\nLl48y2t7qi/mTI3tBZzD74il4NrFvSjXaNTaOXFOMQKBgQD+AEHSrLRKyT2SZFS/\nQL5zW0Wh7JsgNFu/N1FkcldFtamMFcm5QlQ+un5qgQRyZvnj22TZQdvCK5vI/72C\nu0ticHJ7beXENPvEiNs/PU2raNLnrLgo5zvR0wehEtcUeLtVaQPN9vyb8ITsvp6l\nRkUUsYFZQOa5ThBv0FWKPrcopQKBgQD29X0z2Q00odxJuRoXWrxRU1JGbTWtyy2i\n2eVd7NZ3JlE4FuwqUONqbG/dxAK/rWq87Yr5lZfsOqsgnDl52zECsTAOCzC+8z3v\nBC456B8/8F9obepdWHi7iAN2UX6gWMxLlVGXcv2qG+etaSJ8x/g5/oqVKCm5zXu9\ntEXAscOB1QKBgEyLe0qn7TVUbA+/2KJCOqK88MEZcq5D2RpI62hf5NkHI+8pab9A\ns+6reQlTlCl9yvTV2xB1/moHhk0OdOf+1Xr29CkqN0Hnza+uppPqP4vWbSiQLnd1\nJ9vVwsjRyqtKrvnQSes58Wp1EzndQCYChTL1Q0vIeT+CvQVVPVIKEFxZAoGBAN4p\nATS/MY4DffQkPEB+M6LFXeJVJFDv0mIJuri/8j7FjZLzrAh1M9/tJMVPK1nbW4YR\n+0+DL2QncwKnB12DvZc6Zox7rKJal4CJNjyJgHM4fdun5YmLqTCqrtKlhVAiEcZ8\n0SV5IJEDAWuShJ/UFI23WlvMAZ1QKN0DayxpvgLxAoGAZwqLHPQ+YsvFMJ11zbtL\npyCYLiB7oV4gePLtgGwjtfgClaZ/IgRBNbUwqkqGZSH3C1JQDfkrEf2KsSdQPGSN\noe9ilIsrFviWjsmI7jAFF6Xp4l5XyV93Bdwaf25J7PWUPPczpdlg7MZ0CCYh2MY5\nvEXD00pZXGpSLmTEjqSbIMM=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-vnd15@makore-8407b.iam.gserviceaccount.com",
    "client_id": "106914126638349531264",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-vnd15%40makore-8407b.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const getFireBaseTokenByUsername =  async (username) => {
    const fireBaseToken = await FireBaseToken.findOne({username : username});
    return fireBaseToken;
};

const sendNotification =  async (otherUser, loginUser, body, token, chatId, picture, otherUsername) => {
    const fireBaseToken = await getFireBaseTokenByUsername(otherUser);
    if(fireBaseToken !== null) {
        // console.log(otherUser);
        // console.log(loginUser);
        // console.log(body);
        // console.log(chatId);
        // console.log(picture);
        // console.log(otherUsername);
        // console.log(token);
        var payload = {
            notification: {
              title: loginUser,
              body: body
            },
            data: {
                token: token,
                chatId: chatId,
                otherUser: loginUser,
                username: otherUser,
                // picture : picture,
            }
            
          };
    
          var options = {
            priority: "high",
            timeToLive: 60 * 60 *24
          };
          
        admin.messaging().sendToDevice(fireBaseToken.token, payload, options)
      .then(function(response) {
        // console.log("Successfully sent message:", response.results);
      })
      .catch(function(error) {
        console.log("Error sending message:", error);
      });
    }
};

const createUser = async (username, password, email) => {
    
    const user = new User({username, password, email});
    return await user.save();
};


const isUsernameExists = async (username) => {
    const username1 = await User.find({username : username});
    if(username1.length === 0) {
        return false;
    }
    return true;
}

const isUsernameAndPasswordValid = async(username, password) => {
    const user = await User.findOne({username : username, password : password});
    if(user===null) {
        return false;
    }
    return true;
}

const createToken = (username) => {
    const key = "RoiAndYarin";
    const data = { username: username };
        // Generate and return the token.
    return jwt.sign(data, key);
}

const getUser = async (username) => {
    const user = await User.findOne({username : username});
    if(user) {
        const tempJson = {'username' : user.username, 'displayName' : user.displayName, 'profilePic' : user.profilePic};
        return tempJson;
    }
    else {
        return null;
    } 
}


const usernameFromToken = (token) => {
    const key = "RoiAndYarin";
    try {
        const data = jwt.verify(token, key);
        return data.username;
    }
    catch (err) {
    return null;
    }
    
}

const saveFirebaseToken = async (username, token) => {
    const fireBaseToken = await FireBaseToken.findOne({username : username});
    if(fireBaseToken === null) {
        const fireBaseToken = new FireBaseToken({username, token});
        return await fireBaseToken.save();
    } else {
        fireBaseToken.token = token; // Update the token value
        return await fireBaseToken.save();
    }
}

export default {createUser, isUsernameExists, createToken, isUsernameAndPasswordValid, getUser, usernameFromToken, saveFirebaseToken, sendNotification};
