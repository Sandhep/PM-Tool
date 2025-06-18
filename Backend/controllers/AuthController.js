import AuthService from "../services/AuthService.js";

class AuthController{

    async login(req, res, next){

      const { email, password } = req.body;

      if (!email || !password) {
         return res.status(400).json({ message: 'Email and password are required' });
      } 
    
      try {
       
        const result = await AuthService.login({ email, password });
        res.status(200).json(result);
     
      } catch (error) {
        next(error);
      }

    };

    async register(req,res,next){

      const { name, email, password } = req.body;

      if (!name || !email || !password) {
         return res.status(400).json({ message: 'Missing required fields' });
      } 
       
      try {

          const newUser = await AuthService.register({ name, email, password });
          res.status(201).json({ message: 'User registered successfully', user: newUser });4

      } catch (error) {
          next(error);
      }
    
    }

    async inviteUser(req, res, next) {
  
      const { email, projectId, role } = req.body;
      const invitedBy = req.user.userId;

      if (!email || !projectId || !role || !invitedBy) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      try {

        const dataObject = {email,projectId,role,invitedBy};
        const invitation = await AuthService.inviteUser(dataObject);

        res.status(200).json({ message: 'Invitation sent successfully' , invitation});

      } catch (error) {
         next(error);
      }
    }
    
    async acceptInvitation(req, res, next) {

      const { token, name, password } = req.body;

      if (!token || !name || !password ) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      try {

        const dataObject = {token,name,password};
        const user = await AuthService.acceptInvitation(dataObject);
        res.status(201).json({ message: 'Invitation accepted', user });

      } catch (error) {
        next(error);
      }
    } 
}

export default new AuthController();
