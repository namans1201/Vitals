/** Small fetch helpers for client components - every write goes through the
 * API routes in src/app/api/, keeping validation server-side in one place. */

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ? JSON.stringify(body.error) : `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function patchDay(date: string, body: Record<string, unknown>) {
  return request(`/api/days/${date}`, { method: "PATCH", body: JSON.stringify(body) });
}

export function saveWeekPlan(body: {
  date: string;
  runDays: number[];
  offDays: number[];
  flexChoice: "run" | "mobility";
}) {
  return request("/api/week-plan", { method: "PUT", body: JSON.stringify(body) });
}

export function createWorkout(body: { date: string; sessionType: string }) {
  return request("/api/workouts", { method: "POST", body: JSON.stringify(body) });
}

export function addWorkoutSet(workoutId: number, body: { exerciseId: number; targetSets?: number }) {
  return request(`/api/workouts/${workoutId}/sets`, { method: "POST", body: JSON.stringify(body) });
}

export function patchWorkoutSet(
  workoutId: number,
  setId: number,
  body: { reps?: number | null; weightKg?: number | null; rir?: number | null; completed?: boolean },
) {
  return request(`/api/workouts/${workoutId}/sets/${setId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function createRun(body: Record<string, unknown>) {
  return request("/api/runs", { method: "POST", body: JSON.stringify(body) });
}

export function deleteRun(id: number) {
  return request(`/api/runs/${id}`, { method: "DELETE" });
}

export function createMeal(body: Record<string, unknown>) {
  return request("/api/meals", { method: "POST", body: JSON.stringify(body) });
}

export function deleteMeal(id: number) {
  return request(`/api/meals/${id}`, { method: "DELETE" });
}

export function patchProfileTargets(body: {
  proteinTargetG?: number;
  calorieTargetKcal?: number;
  fatTargetG?: number;
  carbTargetG?: number;
}) {
  return request("/api/profile", { method: "PATCH", body: JSON.stringify(body) });
}
