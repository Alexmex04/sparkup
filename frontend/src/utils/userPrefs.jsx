const LS_KEY = "sparkup:prefs";

function getAll() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {}
}

export function getUserKey(user) {
  return (user && (user.email || user.id || user.username)) || "guest";
}

export function getLikes(user) {
  const all = getAll();
  const key = getUserKey(user);
  return all[key] || { tags: {}, roadmaps: {} };
}

export function setLikes(user, likes) {
  const all = getAll();
  const key = getUserKey(user);
  all[key] = likes;
  saveAll(all);
}

export function toggleTagLike(user, tag) {
  const likes = getLikes(user);
  likes.tags[tag] = !likes.tags[tag];
  setLikes(user, likes);
  return likes;
}

export function toggleRoadmapLike(user, roadmapId) {
  const likes = getLikes(user);
  likes.roadmaps[roadmapId] = !likes.roadmaps[roadmapId];
  setLikes(user, likes);
  return likes;
}

export function isTagLiked(user, tag) {
  const likes = getLikes(user);
  return !!likes.tags[tag];
}

export function isRoadmapLiked(user, roadmapId) {
  const likes = getLikes(user);
  return !!likes.roadmaps[roadmapId];
}
