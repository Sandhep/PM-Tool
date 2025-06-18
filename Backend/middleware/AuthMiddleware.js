// /middlewares/AuthMiddleware.js
import jwt from 'jsonwebtoken';
import UnauthorizedException from '../exceptions/UnauthorizedException.js';
import ForbiddenException from '../exceptions/ForbiddenException.js';

class AuthMiddleware {
  authenticateToken(req, res, next) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Access token missing');
      }

      jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
          next(new ForbiddenException('Invalid access token'));
        } else {
          req.user = user;
          next();
        }
      });
    } catch (error) {
      next(error); // Pass to centralized error handler
    }
  }

  authenticateSocketToken(socket, next) {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new UnauthorizedException('Socket token missing'));
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
      if (err) {
        return next(new ForbiddenException('Invalid socket token'));
      }

      socket.user = user;
      next();
    });
  }
  
}

export default new AuthMiddleware();
