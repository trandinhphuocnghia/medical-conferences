import * as migration_20260122_080441_add_conference_to_topics from './20260122_080441_add_conference_to_topics';
import * as migration_20260122_081808_init from './20260122_081808_init';
import * as migration_20260122_085903_reset_schema from './20260122_085903_reset_schema';
import * as migration_20260123_074442_fix_schema from './20260123_074442_fix_schema';

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
    name: '20260123_074442_fix_schema'
  },
];
