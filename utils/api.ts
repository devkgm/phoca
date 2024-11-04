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
};

export const diaryAPI = {
    getDiary: (userId: string, date: string) => api.get(API_URL.GET_DIARY(userId, date)),
    saveDiary: (data: any) => api.post(API_URL.SAVE_DIARY, data),
    shareDiary: (data: any) => api.post(API_URL.SHARE_DIARY, data),
    getSharedPosts: () => api.get(API_URL.GET_SHARED_POSTS),
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
    signup: (data: any) => api.post(API_URL.SIGNUP, data),
}; 