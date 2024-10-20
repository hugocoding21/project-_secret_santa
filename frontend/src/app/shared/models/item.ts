export interface Item {
    id: string|number;
    name: string;
    itemName?:string;
    content?:any;//{type:any}
    deleteLoading?:any;
    projectSessions?:any;
    statusName?:any;
    sessionsFormatted?:any;
    subProjects?:any;
    expanded?:any;//boolean
    slug?: any;
}
