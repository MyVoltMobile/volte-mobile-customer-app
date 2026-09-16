import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CHUNK_SIZE = 1800;
const MANIFEST_SUFFIX = '.manifest';

type SecureManifest = {
  version: 1;
  generation: string;
  chunks: number;
};

function safeKey(key: string) {
  return key.replace(
    /[^A-Za-z0-9._-]/g,
    '_',
  );
}

function manifestKey(key: string) {
  return `${safeKey(key)}${MANIFEST_SUFFIX}`;
}

function chunkKey(
  key: string,
  generation: string,
  index: number,
) {
  return `${safeKey(key)}.${generation}.${index}`;
}

function createGeneration() {
  return [
    'v1',
    Date.now().toString(36),
    Math.random()
      .toString(36)
      .slice(2, 10),
  ].join('_');
}

function splitValue(value: string) {
  const chunks: string[] = [];

  for (
    let offset = 0;
    offset < value.length;
    offset += CHUNK_SIZE
  ) {
    chunks.push(
      value.slice(
        offset,
        offset + CHUNK_SIZE,
      ),
    );
  }

  return chunks.length > 0
    ? chunks
    : [''];
}

function parseManifest(
  value: string | null,
): SecureManifest | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      value,
    ) as Partial<SecureManifest>;

    if (
      parsed.version !== 1 ||
      typeof parsed.generation !== 'string' ||
      !parsed.generation ||
      typeof parsed.chunks !== 'number' ||
      !Number.isInteger(parsed.chunks) ||
      parsed.chunks < 1
    ) {
      return null;
    }

    return {
      version: 1,
      generation:
        parsed.generation,
      chunks:
        parsed.chunks,
    };
  } catch {
    return null;
  }
}

async function readNative(
  key: string,
) {
  const manifest =
    parseManifest(
      await SecureStore.getItemAsync(
        manifestKey(key),
      ),
    );

  if (!manifest) {
    return null;
  }

  const chunks: string[] = [];

  for (
    let index = 0;
    index < manifest.chunks;
    index += 1
  ) {
    const chunk =
      await SecureStore.getItemAsync(
        chunkKey(
          key,
          manifest.generation,
          index,
        ),
      );

    if (chunk === null) {
      return null;
    }

    chunks.push(chunk);
  }

  return chunks.join('');
}

async function removeGeneration(
  key: string,
  manifest: SecureManifest | null,
) {
  if (!manifest) {
    return;
  }

  for (
    let index = 0;
    index < manifest.chunks;
    index += 1
  ) {
    await SecureStore.deleteItemAsync(
      chunkKey(
        key,
        manifest.generation,
        index,
      ),
    );
  }
}

async function writeNative(
  key: string,
  value: string,
) {
  const keyForManifest =
    manifestKey(key);

  const previousManifest =
    parseManifest(
      await SecureStore.getItemAsync(
        keyForManifest,
      ),
    );

  const generation =
    createGeneration();

  const chunks =
    splitValue(value);

  let writtenChunks = 0;

  try {
    for (
      let index = 0;
      index < chunks.length;
      index += 1
    ) {
      await SecureStore.setItemAsync(
        chunkKey(
          key,
          generation,
          index,
        ),
        chunks[index],
      );

      writtenChunks += 1;
    }

    const nextManifest:
      SecureManifest = {
        version: 1,
        generation,
        chunks: chunks.length,
      };

    /*
     * Publish only after every new chunk
     * has been written successfully.
     */
    await SecureStore.setItemAsync(
      keyForManifest,
      JSON.stringify(
        nextManifest,
      ),
    );
  } catch (error) {
    /*
     * The previous manifest remains
     * authoritative when publishing the
     * new generation fails. Remove any
     * new chunks that were written.
     */
    for (
      let index = 0;
      index < writtenChunks;
      index += 1
    ) {
      try {
        await SecureStore.deleteItemAsync(
          chunkKey(
            key,
            generation,
            index,
          ),
        );
      } catch {
        /*
         * Best-effort cleanup only.
         * Never replace the original
         * storage error.
         */
      }
    }

    throw error;
  }

  /*
   * The new manifest is authoritative at
   * this point. Failure to clean an older
   * generation must not invalidate the
   * successful current session write.
   */
  try {
    await removeGeneration(
      key,
      previousManifest,
    );
  } catch {
    /*
     * Best-effort cleanup. Any remaining
     * old chunks are no longer referenced.
     */
  }
}

async function removeNative(
  key: string,
) {
  const keyForManifest =
    manifestKey(key);

  const manifest =
    parseManifest(
      await SecureStore.getItemAsync(
        keyForManifest,
      ),
    );

  await removeGeneration(
    key,
    manifest,
  );

  await SecureStore.deleteItemAsync(
    keyForManifest,
  );
}

function webAvailable() {
  return (
    typeof window !==
    'undefined'
  );
}

export const authSessionStorage = {
  async getItem(
    key: string,
  ): Promise<string | null> {
    if (
      Platform.OS === 'web'
    ) {
      if (!webAvailable()) {
        return null;
      }

      return AsyncStorage.getItem(
        key,
      );
    }

    return readNative(key);
  },

  async setItem(
    key: string,
    value: string,
  ): Promise<void> {
    if (
      Platform.OS === 'web'
    ) {
      if (!webAvailable()) {
        return;
      }

      await AsyncStorage.setItem(
        key,
        value,
      );

      return;
    }

    await writeNative(
      key,
      value,
    );
  },

  async removeItem(
    key: string,
  ): Promise<void> {
    if (
      Platform.OS === 'web'
    ) {
      if (!webAvailable()) {
        return;
      }

      await AsyncStorage.removeItem(
        key,
      );

      return;
    }

    await removeNative(key);
  },
};
