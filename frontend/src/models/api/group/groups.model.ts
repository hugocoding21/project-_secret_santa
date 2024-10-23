export interface Group {
  _id: string;
  name: string;
  santaDate: Date;
  ownerId: string;
  members: Number;
  santaAssigned: string;
  createdAt: Date;
  updatedAt: Date;
  receiver?: {username:string, email:string}
}
