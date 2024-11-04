export interface DayImage {
    _id: string;
    path: string;
    createdAt: string;
    date: string;
}

export interface Diary {
    _id: string;
    content: string;
    images: Array<DayImage>;
    date: string;
}

export interface UserInfo {
    name: string;
    email: string;
    bio: string;
}

export interface SharedPost extends Diary {
    userName: string;
    images: DayImage[];
}