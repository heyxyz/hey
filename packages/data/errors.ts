export enum Errors {
  AppNotAllowed = 'This app is not allowed to perform this action!',
  InvalidBody = 'Invalid body!',
  InvalidSecret = 'Invalid secret!',
  Limit500 = 'Limit must be less than 500!',
  NoBody = 'No body provided!',
  NoPermission = 'You do not have permission to perform this action!',
  NotAllowed = 'Not allowed!',
  RateLimited = 'You are being rate limited!',
  SignWallet = 'Please sign in your wallet.',
  SomethingWentWrong = 'Something went wrong!',
  Suspended = 'Your profile has been suspended!',
  UnpredictableGasLimit = 'Unpredictable gas limit!'
}
