function updateDynamicCache(key, req, res) {
  if (res.ok) {
    return caches.open(key).then(cache => {
      cache.put(req, res.clone());
      return res.clone();
    });
  }
  return res;
}
