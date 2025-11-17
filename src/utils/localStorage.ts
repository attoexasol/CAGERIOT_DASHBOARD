const STORAGE_KEY = "user_releases";

export const saveRelease = (release: any) => {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  existing.push(release);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
};

export const getAllReleases = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

export const getReleaseById = (id: string) => {
  const releases = getAllReleases();
  return releases.find((r: any) => r.id === id);
};
