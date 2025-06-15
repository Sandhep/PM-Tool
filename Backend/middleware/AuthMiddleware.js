import jwt from 'jsonwebtoken';

class AuthMiddleware {

    authenticateToken(req, res, next) {
      const token = req.headers['authorization']?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    
      jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user; // Attach user information to the request object
        next();
      });
    };
    
    authenticateSocketToken(socket, next){
      const token = socket.handshake.auth.token; // Get token from the socket handshake
    
      if (token) {
        jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
          if (err) {
            return next(new Error('Authentication error'));
          }
          socket.user = user; 
          next(); 
        });
      } else {
        next(new Error('Authentication error: No token provided'));
      }
    }
    
}

export default new AuthMiddleware();