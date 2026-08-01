import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

/**
 * Best-effort background flush. The OS decides when (and whether) to run this;
 * the reliable path remains the foreground triggers in ./connectivity. The task
 * must be defined at module scope, so this file is imported once at app startup.
 */
export const SYNC_TASK_NAME = 'farmos-sync-flush';

let flushRunner: (() => Promise<void>) | null = null;

/** Provide the function the background task should call (usually engine.flush). */
export function setBackgroundFlushRunner(runner: () => Promise<void>): void {
  flushRunner = runner;
}

if (!TaskManager.isTaskDefined(SYNC_TASK_NAME)) {
  TaskManager.defineTask(SYNC_TASK_NAME, async () => {
    try {
      await flushRunner?.();
      return BackgroundTask.BackgroundTaskResult.Success;
    } catch {
      return BackgroundTask.BackgroundTaskResult.Failed;
    }
  });
}

/** Register the periodic background task (minimum interval in minutes). */
export async function registerSyncBackgroundTask(
  minimumIntervalMinutes = 15,
): Promise<void> {
  await BackgroundTask.registerTaskAsync(SYNC_TASK_NAME, {
    minimumInterval: minimumIntervalMinutes,
  });
}

export async function unregisterSyncBackgroundTask(): Promise<void> {
  await BackgroundTask.unregisterTaskAsync(SYNC_TASK_NAME);
}
