export class MessageModal {
    public constructor(
        public _id?: string,
        public senderName?: string,
        public sender_id?: string,
        public adventure_id?: string,
        public message?: string,
        public date?: number,
        public adventureIdentifier?: string,
        public uid?: string,
    ) { }
}