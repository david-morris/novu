import { ICacheService } from './cache.service';
import { buildKey, CacheInterceptorTypeEnum } from '../../interceptors';

export async function invalidateCache({
  service,
  storeKeyPrefix,
  credentials,
}: {
  service: ICacheService;
  storeKeyPrefix: CacheKeyPrefixEnum | CacheKeyPrefixEnum[];
  credentials: Record<string, unknown>;
}) {
  if (storeKeyPrefix instanceof Array) {
    await Promise.all(
      storeKeyPrefix.map(async (prefix) => {
        await invalidateCase(prefix, credentials, service);
      })
    );
  } else {
    await invalidateCase(storeKeyPrefix, credentials, service);
  }
}

async function invalidateCase(storeKeyPrefix: CacheKeyPrefixEnum, credentials: Record<string, unknown>, service) {
  const cacheKey = buildKey(storeKeyPrefix, credentials, CacheInterceptorTypeEnum.INVALIDATE);

  if (!cacheKey) {
    return;
  }

  try {
    await service.delByPattern(cacheKey);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`An error has occurred when deleting "key: ${cacheKey}",`, 'InvalidateCache', err);
  }
}

export enum CacheKeyPrefixEnum {
  MESSAGE_COUNT = 'message_count',
  FEED = 'feed',
  SUBSCRIBER = 'subscriber',
  NOTIFICATION_TEMPLATE = 'notification_template',
  USER = 'user',
  INTEGRATION = 'integration',
}