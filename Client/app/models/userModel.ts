export class UserModel {
    public constructor(public _id?: string, public username?: string, public password?: string,
        public profileImg?: string, public activated?: boolean, public premium?: boolean) {
    }
}