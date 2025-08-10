import UnsupportedMediaTypeException from '../exceptions/UnsupportedMediaException.js';

class ContentTypeMiddleware {
  /**
   * Accept only given content types for POST/PUT/PATCH
   */
  allow(types = ['application/json']) {
    
    return (req, res, next) => {

      // Only check for payload-carrying requests
      if (['POST', 'PUT','PATCH'].includes(req.method)) {
        
        const isValid = types.some(type => req.is(type));

        if (!isValid) {
         
          return next(new UnsupportedMediaTypeException(
            `Unsupported content type: ${req.headers['content-type']}. Allowed: ${types.join(', ')}`
          ));
        }
      }

      next();

    };
  }
}

export default new ContentTypeMiddleware();
