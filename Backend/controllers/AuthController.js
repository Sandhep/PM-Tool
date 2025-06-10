import AuthService from "../services/AuthService.js";

class AuthController{

    async login(req, res){

      const { email, password } = req.body;
    
      try {
        const result = await AuthService.login({ email, password });
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }

    };

    async register(req,res){

       const { name, email, password } = req.body;
       
       try {
           const newUser = await AuthService.register({ name, email, password });
           res.status(201).json({ message: 'User registered successfully', user: newUser });
         } catch (error) {
           res.status(400).json({ message: error.message });
        }
    }
}

export default new AuthController();
