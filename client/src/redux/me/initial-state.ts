export const initialState = {
  userData: undefined,
  loadingMe: false,
  error: null,
};

export interface Reducer {
  [key: string]: (state: typeof initialState, action: any) => typeof initialState;
}
