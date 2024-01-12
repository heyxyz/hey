import { OpenActionModuleType } from '@hey/lens';

const allowedOpenActionModules = [
  OpenActionModuleType.SimpleCollectOpenActionModule,
  OpenActionModuleType.MultirecipientFeeCollectOpenActionModule,
  OpenActionModuleType.LegacySimpleCollectModule,
  OpenActionModuleType.LegacyMultirecipientFeeCollectModule,
  OpenActionModuleType.LegacyFreeCollectModule,
  OpenActionModuleType.LegacyFeeCollectModule,
  OpenActionModuleType.LegacyLimitedFeeCollectModule,
  OpenActionModuleType.LegacyTimedFeeCollectModule,
  OpenActionModuleType.LegacyLimitedTimedFeeCollectModule
];

export default allowedOpenActionModules;
