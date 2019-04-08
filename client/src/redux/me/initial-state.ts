export const initialState = {
  me: undefined,
  loadingMe: false,
  error: null,
};

export interface Reducer {
  [key: string]: (state: typeof initialState, action: any) => typeof initialState;
}
