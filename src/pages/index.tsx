import { useState } from 'react';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import Head from 'next/head';
import { getPrismicClient } from '../services/prismic';
import PostsList from '../components/PostsList';
import LoadMoreButton from '../components/LoadMoreButton';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { results } = postsPagination;
  const { next_page } = postsPagination;
  const [nextPage, setNextPage] = useState(next_page);
  const [postsList, setPostsList] = useState<Post[]>(results);

  const handleLoadMorePosts = async (): Promise<void> => {
    await fetch(nextPage)
      .then(response => response.json())
      .then(data => {
        const postsData = data.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: post.first_publication_date,
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          };
        });
        setPostsList([...postsList, ...postsData]);
        setNextPage(data.next_page);
      });
  };

  return (
    <>
      <Head>
        <title>Home | Spacetravelling</title>
      </Head>

      <main className={commonStyles.container}>
        <div className={styles.posts}>
          <PostsList posts={postsList} />
          {nextPage !== null ? (
            <LoadMoreButton handleLoadMorePosts={handleLoadMorePosts} />
          ) : (
            ''
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 3,
    }
  );
  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const { next_page } = postsResponse;

  return {
    props: {
      postsPagination: {
        next_page,
        results,
      },
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
