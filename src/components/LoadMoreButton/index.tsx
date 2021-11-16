interface LoadMorePostsProps {
  handleLoadMorePosts: () => Promise<void>;
}

export default function LoadMoreButton(props: LoadMorePostsProps): JSX.Element {
  const { handleLoadMorePosts } = props;
  return (
    <button type="button" onClick={handleLoadMorePosts}>
      Carregar mais posts
    </button>
  );
}
