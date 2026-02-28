import * as migration_20260122_080441_add_conference_to_topics from './20260122_080441_add_conference_to_topics';
import * as migration_20260122_081808_init from './20260122_081808_init';
import * as migration_20260122_085903_reset_schema from './20260122_085903_reset_schema';
import * as migration_20260123_074442_fix_schema from './20260123_074442_fix_schema';
import * as migration_20260125_041610_add_indexes_and_fixes from './20260125_041610_add_indexes_and_fixes';
import * as migration_20260127_032534_add_media_sizes from './20260127_032534_add_media_sizes';
import * as migration_20260127_071401_add_abstracts_files from './20260127_071401_add_abstracts_files';
import * as migration_20260225_101751 from './20260225_101751';
import * as migration_20260228_122854_add_public_files from './20260228_122854_add_public_files';

export const migrations = [
  {
    up: migration_20260122_080441_add_conference_to_topics.up,
    down: migration_20260122_080441_add_conference_to_topics.down,
    name: '20260122_080441_add_conference_to_topics',
  },
  {
    up: migration_20260122_081808_init.up,
    down: migration_20260122_081808_init.down,
    name: '20260122_081808_init',
  },
  {
    up: migration_20260122_085903_reset_schema.up,
    down: migration_20260122_085903_reset_schema.down,
    name: '20260122_085903_reset_schema',
  },
  {
    up: migration_20260123_074442_fix_schema.up,
    down: migration_20260123_074442_fix_schema.down,
    name: '20260123_074442_fix_schema',
  },
  {
    up: migration_20260125_041610_add_indexes_and_fixes.up,
    down: migration_20260125_041610_add_indexes_and_fixes.down,
    name: '20260125_041610_add_indexes_and_fixes',
  },
  {
    up: migration_20260127_032534_add_media_sizes.up,
    down: migration_20260127_032534_add_media_sizes.down,
    name: '20260127_032534_add_media_sizes',
  },
  {
    up: migration_20260127_071401_add_abstracts_files.up,
    down: migration_20260127_071401_add_abstracts_files.down,
    name: '20260127_071401_add_abstracts_files',
  },
  {
    up: migration_20260225_101751.up,
    down: migration_20260225_101751.down,
    name: '20260225_101751',
  },
  {
    up: migration_20260228_122854_add_public_files.up,
    down: migration_20260228_122854_add_public_files.down,
    name: '20260228_122854_add_public_files'
  },
];
