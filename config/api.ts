export const API_DOMAIN = 'http://192.168.0.43:3000';
export const API_URL = {
    LOGIN: `${API_DOMAIN}/api/login`,
    SIGNUP: `${API_DOMAIN}/api/signup`,
    UPLOAD_IMAGES: `${API_DOMAIN}/api/upload/multiple`,
    GET_USER: (userId: string) => `${API_DOMAIN}/api/user/${userId}`,
    UPDATE_USER: (userId: string) => `${API_DOMAIN}/api/user/${userId}`,
    GET_DIARY: (userId: string, date: string) => `${API_DOMAIN}/api/diary/${userId}/${date}`,
    SAVE_DIARY: `${API_DOMAIN}/api/diary`,
    SHARE_DIARY: `${API_DOMAIN}/api/diary/share`,
    GET_SHARED_POSTS: `${API_DOMAIN}/api/shared-posts`,
    GET_SHARED_POSTS_BY_USER_DATE: (userId: string, date: string) => `${API_DOMAIN}/api/shared-posts/${userId}/${date}`,
    DELETE_IMAGE: (imageId: string) => `${API_DOMAIN}/api/images/${imageId}`,
    REORDER_IMAGES: `${API_DOMAIN}/api/images/reorder`,
    GET_IMAGES_BY_DAY: (userId: string, year: number, month: number, day: number) => `${API_DOMAIN}/api/images/${userId}/day/${year}/${month}/${day}`,
    GET_IMAGES_BY_MONTH: (userId: string, year: number, month: number) => `${API_DOMAIN}/api/images/${userId}/month/${year}/${month}`,
    GET_DIARY_IMAGES_STATUS: (userId: string, year: number, month: number) => 
        `${API_DOMAIN}/api/diary/images-status/${userId}/${year}/${month}`,
    FOLLOW_USER: (userId: string) => `${API_DOMAIN}/api/follow/${userId}`,
    UNFOLLOW_USER: (userId: string) => `${API_DOMAIN}/api/unfollow/${userId}`,
    GET_FOLLOWERS: (userId: string) => `${API_DOMAIN}/api/user/${userId}/followers`,
    GET_FOLLOWING: (userId: string) => `${API_DOMAIN}/api/user/${userId}/following`,
    UPLOAD_PROFILE_IMAGE: (userId: string) => `${API_DOMAIN}/api/user/profile-image/${userId}`,
    TOGGLE_LIKE: (diaryId: string) => `${API_DOMAIN}/api/diary/${diaryId}/like`,
    ADD_COMMENT: (diaryId: string) => `${API_DOMAIN}/api/diary/${diaryId}/comment`,
    DELETE_COMMENT: (commentId: string) => `${API_DOMAIN}/api/diary/comment/${commentId}`,
    GET_SOCIAL_INFO: (diaryId: string) => `${API_DOMAIN}/api/diary/${diaryId}/social`,
}; 
