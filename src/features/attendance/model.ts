/** Log Attendance domain vocabulary (canvas `1a` frame 9). */

export const ATTENDANCE_STATUSES = ['full', 'half', 'absent'] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const ATTENDANCE_STATUS_LABEL: Record<AttendanceStatus, string> = {
  full: 'Full',
  half: 'Half',
  absent: 'Absent',
};

/** Wage multiplier per day, by attendance status. */
export const ATTENDANCE_MULTIPLIER: Record<AttendanceStatus, string> = {
  full: '1',
  half: '0.5',
  absent: '0',
};
