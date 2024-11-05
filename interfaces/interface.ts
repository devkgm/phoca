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
    createdAt: string;
    likes: Like[];
    comments: Comment[];
}

export interface UserInfo {
    _id?: string;
    name: string;
    email: string;
    bio: string;
    profileImage?: string;
}

export interface SharedPost extends Diary {
    userId: string;
    userName: string;
    profileImage?: string;
    images: DayImage[];
}

export interface FollowUser {
    _id: string;
    name: string;
    email: string;
    bio: string;
    profileImage?: string;
}

export interface Like {
    _id: string;
    userId: {
        _id: string;
        name: string;
        profileImage?: string;
    };
    createdAt: string;
}

export interface Comment {
    _id: string;
    userId: {
        _id: string;
        name: string;
        profileImage?: string;
    };
    content: string;
    createdAt: string;
}