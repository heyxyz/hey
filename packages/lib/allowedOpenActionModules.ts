import { OpenActionModuleType } from '@hey/lens';

const allowedOpenActionModules = [
  OpenActionModuleType.SimpleCollectOpenActionModule,
  OpenActionModuleType.MultirecipientFeeCollectOpenActionModule,
  OpenActionModuleType.LegacySimpleCollectModule,
  OpenActionModuleType.LegacyMultirecipientFeeCollectModule,
  OpenActionModuleType.LegacyFreeCollectModule
];

export default allowedOpenActionModules;
