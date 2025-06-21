import BadRequestException from "../exceptions/BadRequestException";

export default class UpdateMemberScopeDTO {

  constructor(data) {

        if (!data.userId) throw new BadRequestException('UserId is required'); 

        if (!['Full', 'Restricted', 'ReadOnly'].includes(data.scope)) {
            throw new BadRequestException('Invalid scope value');
        }

        this.userId = data.userId;
        this.scope = data.scope;
   }
}
