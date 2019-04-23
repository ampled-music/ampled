export enum SubscriptionStep {
  SupportLevel = 'SupportLevel',
  PaymentDetails = 'PaymentDetails',
  Finished = 'Finished',
}

export const initialState = {
  processing: false,
  artistPageId: 0,
  subscriptionLevelValue: 6.37,
  paymentToken: '',
  status: SubscriptionStep.SupportLevel,
};

export interface Reducer {
  [key: string]: (state: typeof initialState, action: any) => typeof initialState;
}
