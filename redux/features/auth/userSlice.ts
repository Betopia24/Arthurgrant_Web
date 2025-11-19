// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createSlice } from '@reduxjs/toolkit';
// import { RootState } from '../../store';

// type TUserState = {
//   userId: string | null;
//   visitCount: number;
//   lastVisit: string | null;
//   sessionStart: string | null;
//   pageViews: Record<string, number>;
//   isLoaded: boolean;
// };

// const initialState: TUserState = {
//   userId: null,
//   visitCount: 0,
//   lastVisit: null,
//   sessionStart: null,
//   pageViews: {},
//   isLoaded: false,
// };

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     setUserData: (state, action) => {
//       const {
//         userId,
//         visitCount,
//         lastVisit,
//         sessionStart,
//         pageViews,
//         isLoaded,
//       } = action.payload;

//       if (userId !== undefined) state.userId = userId;
//       if (visitCount !== undefined) state.visitCount = visitCount;
//       if (lastVisit !== undefined) state.lastVisit = lastVisit;
//       if (sessionStart !== undefined) state.sessionStart = sessionStart;
//       if (pageViews !== undefined) state.pageViews = pageViews;
//       if (isLoaded !== undefined) state.isLoaded = isLoaded;
//     },
//     incrementVisitCount: (state) => {
//       state.visitCount += 1;
//     },
//     incrementPageView: (state, action) => {
//       const page = action.payload;
//       state.pageViews[page] = (state.pageViews[page] || 0) + 1;
//     },
//     resetUser: (state) => {
//       state.userId = null;
//       state.visitCount = 0;
//       state.lastVisit = null;
//       state.sessionStart = null;
//       state.pageViews = {};
//       state.isLoaded = false;
//     },
//   },
// });

// export const { setUserData, incrementVisitCount, incrementPageView, resetUser } =
//   userSlice.actions;

// export default userSlice.reducer;

// // --- Selectors ---
// export const selectUser = (state: RootState) => state.user;
// export const selectUserId = (state: RootState) => state.user.userId;
// export const selectVisitCount = (state: RootState) => state.user.visitCount;
// export const selectLastVisit = (state: RootState) => state.user.lastVisit;
// export const selectSessionStart = (state: RootState) => state.user.sessionStart;
// export const selectPageViews = (state: RootState) => state.user.pageViews;
// export const selectIsLoaded = (state: RootState) => state.user.isLoaded;
