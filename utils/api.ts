import axios from 'axios';
import { API_URL } from '@/config/api';

// 공통 axios 인스턴스 생성
const api = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const userAPI = {
    getUser: (userId: string) => api.get(API_URL.GET_USER(userId)),
    updateUser: (userId: string, data: any) => api.put(API_URL.UPDATE_USER(userId), data),
    followUser: (userId: string, followerId: string) => 
        api.post(API_URL.FOLLOW_USER(userId), { followerId }),
    unfollowUser: (userId: string, followerId: string) => 
        api.post(API_URL.UNFOLLOW_USER(userId), { followerId }),
    getFollowers: (userId: string) => 
        api.get(API_URL.GET_FOLLOWERS(userId)),
    getFollowing: (userId: string) => 
        api.get(API_URL.GET_FOLLOWING(userId)),
    uploadProfileImage: (userId: string, formData: FormData) => 
        api.post(API_URL.UPLOAD_PROFILE_IMAGE(userId), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),
    deleteUser: (userId: string) => api.delete(API_URL.DELETE_USER(userId)),
    changePassword: (userId: string, data: { currentPassword: string; newPassword: string }) => 
        api.put(API_URL.CHANGE_PASSWORD(userId), data),
};

export const diaryAPI = {
    getDiary: (userId: string, date: string) => api.get(API_URL.GET_DIARY(userId, date)),
    saveDiary: (data: any) => api.post(API_URL.SAVE_DIARY, data),
    shareDiary: (data: any) => api.post(API_URL.SHARE_DIARY, data),
    getSharedPosts: () => api.get(API_URL.GET_SHARED_POSTS),
    getSharedPostsByUserDate: (userId: string, date: string) => 
        api.get(API_URL.GET_SHARED_POSTS_BY_USER_DATE(userId, date)),
    getDiaryImagesStatus: (userId: string, year: number, month: number) => 
        api.get(API_URL.GET_DIARY_IMAGES_STATUS(userId, year, month)),
};

export const imageAPI = {
    uploadImages: (formData: FormData) => 
        api.post(API_URL.UPLOAD_IMAGES, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),
    deleteImage: (imageId: string) => api.delete(API_URL.DELETE_IMAGE(imageId)),
    reorderImages: (data: any) => api.put(API_URL.REORDER_IMAGES, data),
    getImagesByMonth: (userId: string, year: number, month: number) => api.get(API_URL.GET_IMAGES_BY_MONTH(userId, year, month)),
    getImagesByDay: (userId: string, year: number, month: number, day: number) => api.get(API_URL.GET_IMAGES_BY_DAY(userId, year, month, day)),
};

export const authAPI = {
    login: (data: any) => api.post(API_URL.LOGIN, data),
    signup: (formData: FormData) => 
        api.post(API_URL.SIGNUP, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),
    googleLogin: (data: { email: string; name: string }) => 
        api.post(API_URL.GOOGLE_LOGIN, data),
};

export const socialAPI = {
    toggleLike: (diaryId: string, userId: string) => 
        api.post(API_URL.TOGGLE_LIKE(diaryId), { userId }),
    addComment: (diaryId: string, userId: string, content: string) => 
        api.post(API_URL.ADD_COMMENT(diaryId), { userId, content }),
    deleteComment: (commentId: string) => 
        api.delete(API_URL.DELETE_COMMENT(commentId)),
    getSocialInfo: (diaryId: string) => 
        api.get(API_URL.GET_SOCIAL_INFO(diaryId)),
}; 