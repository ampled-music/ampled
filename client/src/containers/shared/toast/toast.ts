import './toast.scss';

import * as toastr from 'toastr';

import { merge } from 'ramda';

interface ToastConfig {
  closeButton: boolean;
  positionClass: string;
  preventDuplicates: boolean;
  timeOut: number;
  extendedTimeOut: number;
}

type ToastConfigOpts = Partial<ToastConfig>;

const toastConfig: ToastConfig = {
  closeButton: true,
  positionClass: 'toast-top-full-width',
  preventDuplicates: true,
  timeOut: 5500,
  extendedTimeOut: 1000,
};

const messages = {
  error: (message: string, config: ToastConfigOpts) => {
    return toastr.error(message, '', merge(toastConfig, config));
  },
  success: (message: string, config: ToastConfigOpts) => {
    return toastr.success(message, '', merge(toastConfig, config));
  },
};

export enum MessageType {
  ERROR,
  SUCCESS,
}

export const showToastMessage = (
  message: string,
  messageType: MessageType,
  opts: ToastConfigOpts = {},
) => {
  const type = MessageType[messageType].toLowerCase();

  return messages[type](message, opts);
};
