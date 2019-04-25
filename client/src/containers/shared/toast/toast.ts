import './toast.scss'

import * as toastr from 'toastr'

const toastConfig = {
  closeButton: true,
  positionClass: 'toast-top-full-width',
  preventDuplicates: true,
  timeOut: 5000,
  extendedTimeOut: 1000,
}

const messages = {
  error: (message: string) => {
    return toastr.error(message, '', toastConfig)
  },
  success: (message: string) => {
    return toastr.success(message, '', toastConfig)
  },
  warning: (message: string) => {
    return toastr.warning(message, '', toastConfig)
  },
}

export enum MessageType {
  ERROR,
  SUCCESS,
  WARNING,
}

export const showToastMessage = (message: string, messageType: MessageType) => {
  const type = MessageType[messageType].toLowerCase()

  return messages[type](message)
}
