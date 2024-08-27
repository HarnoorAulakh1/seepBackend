export default interface user{
    _id?: any;
    username:string,
    password:string,
    email:string,
    firstName:string,
    lastName:string,
    friends:Array<string>,
    status:boolean
}