export enum SubscriptionStep {
  SupportLevel = 'SupportLevel',
  PaymentDetails = 'PaymentDetails',
  Finished = 'Finished',
}

export const initialState = {
  processing: false,
  artistPageId: 0,
  subscriptionLevelValue: 637,
  paymentToken: '',
  status: SubscriptionStep.SupportLevel,
  cancelled: false,
  artistName: undefined,
};

export interface Reducer {
  [key: string]: (state: typeof initialState, action: any) => typeof initialState;
}
