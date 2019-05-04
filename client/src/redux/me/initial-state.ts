export const initialState = {
  userData: undefined,
  loadingMe: false,
  error: null,
  updating: false,
  updated: false,
  updatedData: undefined,
};

export interface Reducer {
  [key: string]: (state: typeof initialState, action: any) => typeof initialState;
}
