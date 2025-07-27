export const host = process.env.REACT_APP_API_URL;

/// === USER ROUTE ===///
export const userLoginRoute = `${host}/api/auth/login`;
export const getUserPagesRoute  = `${host}/api/auth/get-pages`;
export const getPageDetailsRoute  = `${host}/api/auth/get-page-details`;

/// ==== ADMIN ROUTES === ////
export const adminLoginRoute = `${host}/api/admin/login`;
export const adminRegisterRoute = `${host}/api/admin/register`;
export const addLinkRoute = `${host}/api/admin/add-link`;
export const getLinksRoute = `${host}/api/admin/get-links`;
export const updateLinkRoute = `${host}/api/admin/update-links`;
export const deleteLinkRoute = `${host}/api/admin/delete-link`;
export const getPagesRoute = `${host}/api/admin/get-pages`;
export const getTeachersRoute = `${host}/api/admin/get-teachers`;
export const addUserRoute = `${host}/api/admin/add-user`;
export const addTeacherRoute = `${host}/api/admin/add-teacher`;
export const getUsersRoute = `${host}/api/admin/get-users`;
export const getSinglePageRoute = `${host}/api/admin/get-single-page`;
export const authorizeUserRoute = `${host}/api/admin/authorize`;
export const removeUserAccessRoute = `${host}/api/admin/remove-user-access`;
export const assignTeacherRoute = `${host}/api/admin/assign-teacher`;
export const unAssignTeacherRoute = `${host}/api/admin/unassign-teacher`;


// === GOOGLE DRIVE FETCH ROUTE === ///
export const getDriveFileRoute = `${host}/api/player/file`;
