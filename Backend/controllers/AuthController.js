import AuthService from "../services/AuthService.js";

class AuthController{

    async login(req, res){

      const { email, password } = req.body;

      if (!email || !password) {
         return res.status(400).json({ message: 'Email and password are required' });
      } 
    
      try {
       
        const result = await AuthService.login({ email, password });
        res.status(200).json(result);
     
      } catch (error) {

        if(error.message === "Invalid credentials"){
          return res.status(400).json({ message: error.message });
        }else if(error.message === "User Not Found"){
          return res.status(404).json({ message: error.message });
        }else{
          res.status(500).json({ message: error.message });
        }
      }

    };

    async register(req,res){

      const { name, email, password } = req.body;

      if (!name || !email || !password) {
         return res.status(400).json({ message: 'Missing required fields' });
      } 
       
      try {

          const newUser = await AuthService.register({ name, email, password });
          res.status(201).json({ message: 'User registered successfully', user: newUser });4

      } catch (error) {

          if(error.message === "User already exists"){
            return res.status(400).json({ message: error.message });
          }else{
            res.status(500).json({ message: error.message });
          }
      }
    
    }

    async inviteUser(req, res) {
  
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
          res.status(500).json({ message: error.message });
      }
    }
    
    async acceptInvitation(req, res) {

      const { token, name, password } = req.body;

      if (!token || !name || !password ) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      try {

        const dataObject = {token,name,password};
        const user = await AuthService.acceptInvitation(dataObject);
        res.status(201).json({ message: 'Invitation accepted', user });

      } catch (error) {

        if(error.message === "Invite Accept Failed: Invitation expired or invalid"){
          res.status(400).json({ message: error.message });
        }else{
          res.status(500).json({ message: error.message });
        }
      }
    } 
}

export default new AuthController();
