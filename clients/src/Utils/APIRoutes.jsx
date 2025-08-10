export const host = process.env.REACT_APP_API_URL;

/// === USER ROUTE ===///
export const userLoginRoute = `${host}/api/auth/login`;
export const getUserPagesRoute  = `${host}/api/auth/get-pages`;
export const getPageDetailsRoute  = `${host}/api/auth/get-page-details`;

/// === TEACHER ROUTE === ///
export const teacherLoginRoute = `${host}/api/teacher/login`;
export const getStudentsRoute = `${host}/api/teacher/get-students`;
export const getStudentsLessonRoute = `${host}/api/teacher/get-lessons`;
export const updateProgress = `${host}/api/teacher/update-progress`;
export const submitRemarkRoute = `${host}/api/teacher/submit-remark`;

/// ==== ADMIN ROUTES === ////
export const adminLoginRoute = `${host}/api/admin/login`;
export const adminRegisterRoute = `${host}/api/admin/register`;
export const addLinkRoute = `${host}/api/admin/add-link`;
export const getLinksRoute = `${host}/api/admin/get-links`;
export const updateLinkRoute = `${host}/api/admin/update-links`;
export const deleteLinkRoute = `${host}/api/admin/delete-link`;
export const getPagesRoute = `${host}/api/admin/get-pages`;
export const getAssignedLessonsRoute = `${host}/api/admin/get-assigned-lessons`;
export const getTeachersRoute = `${host}/api/admin/get-teachers`;
export const addUserRoute = `${host}/api/admin/add-user`;
export const addTeacherRoute = `${host}/api/admin/add-teacher`;
export const getUsersRoute = `${host}/api/admin/get-users`;
export const getSinglePageRoute = `${host}/api/admin/get-single-page`;
export const authorizeUserRoute = `${host}/api/admin/authorize`;
export const removeUserAccessRoute = `${host}/api/admin/remove-user-access`;
export const assignTeacherRoute = `${host}/api/admin/assign-teacher`;
export const unAssignTeacherRoute = `${host}/api/admin/unassign-teacher`;
export const scheduleClassRoute = `${host}/api/admin/schedule-class`;
export const updateNextPaymentRoute = `${host}/api/admin/update-next-payment`;
export const deleteStudentRoute  = `${host}/api/admin/delete-student`;
export const deleteTeacherRoute  = `${host}/api/admin/delete-teacher`;


// === GOOGLE DRIVE FETCH ROUTE === ///
export const getDriveFileRoute = `${host}/api/player/file`;
