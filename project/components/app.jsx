/* global React, ReactDOM, parseMarkdownDocument, sortPosts, Shell, BlogIndex, PostReader, LoadingState, ErrorState */

const { useEffect, useMemo, useState } = React;

const MANIFEST_URL = 'posts/index.json';

async function loadPosts() {
  const manifestResponse = await fetch(MANIFEST_URL, { cache: 'no-store' });
  if (!manifestResponse.ok) {
    throw new Error(`Unable to load ${MANIFEST_URL} (${manifestResponse.status}).`);
  }

  const manifest = await manifestResponse.json();
  const files = Array.isArray(manifest) ? manifest : manifest.posts;
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error(`${MANIFEST_URL} must contain a non-empty "posts" array.`);
  }

  const posts = await Promise.all(files.map(async file => {
    const response = await fetch(file, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Unable to load ${file} (${response.status}).`);
    }
    return parseMarkdownDocument(await response.text(), file);
  }));

  return sortPosts(posts);
}

function readHash() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return {
    post: params.get('post'),
    category: params.get('category') || 'all'
  };
}

function setHash(next) {
  const params = new URLSearchParams();
  if (next.post) params.set('post', next.post);
  if (next.category && next.category !== 'all') params.set('category', next.category);
  const hash = params.toString();
  const url = `${window.location.pathname}${window.location.search}${hash ? `#${hash}` : ''}`;
  window.history.pushState(null, '', url);
}

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategoryState] = useState(() => readHash().category);
  const [query, setQuery] = useState('');
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    let mounted = true;
    loadPosts()
      .then(nextPosts => {
        if (!mounted) return;
        setPosts(nextPosts);
        setLoading(false);
      })
      .catch(nextError => {
        if (!mounted) return;
        setError(nextError.message || String(nextError));
        setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!posts.length) return undefined;

    const syncFromHash = () => {
      const route = readHash();
      setActiveCategoryState(route.category);
      setActivePost(route.post ? posts.find(post => post.slug === route.post) || null : null);
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('popstate', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('popstate', syncFromHash);
    };
  }, [posts]);

  useEffect(() => {
    const onOpenPost = event => {
      const post = posts.find(candidate => candidate.slug === event.detail);
      if (post) openPost(post);
    };
    window.addEventListener('open-post', onOpenPost);
    return () => window.removeEventListener('open-post', onOpenPost);
  }, [posts]);

  const setActiveCategory = (category) => {
    setActivePost(null);
    setActiveCategoryState(category);
    setHash({ category });
  };

  const openPost = (post) => {
    setActivePost(post);
    setHash({ post: post.slug, category: activeCategory });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToIndex = () => {
    setActivePost(null);
    setHash({ category: activeCategory });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredPosts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter(post => {
      const categoryMatch = activeCategory === 'all' || post.category === activeCategory;
      const queryMatch = !needle || post.searchText.includes(needle);
      return categoryMatch && queryMatch;
    });
  }, [posts, activeCategory, query]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <Shell
      posts={posts}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      query={query}
      setQuery={setQuery}
      activePost={activePost}
      onOpenPost={openPost}
    >
      {activePost ? (
        <PostReader post={activePost} posts={posts} onBack={backToIndex} />
      ) : (
        <BlogIndex
          posts={posts}
          filteredPosts={filteredPosts}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          query={query}
          onOpenPost={openPost}
        />
      )}
    </Shell>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
