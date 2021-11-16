import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import Head from 'next/head';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  const readingTime = (): number => {
    const wordCollection = post.data.content.reduce((words, content) => {
      const heading = content.heading.split(' ');
      const body = RichText.asText(content.body).split(' ');
      return words.concat(heading, body);
    }, []);
    const wordsPerMinute = Math.ceil(wordCollection.length / 200);
    return wordsPerMinute;
  };

  const contentHtml = (): string => {
    const contentArray = post.data.content.map(content => {
      const htmlHeading = `<h2>${content.heading}</h2>`;
      const htmlBody = RichText.asHtml(content.body);
      const htmlOutput = htmlHeading + htmlBody;
      return htmlOutput;
    });
    return contentArray.join('');
  };

  const postDate = format(new Date(post.first_publication_date), 'd MMM yyyy', {
    locale: ptBR,
  });

  return (
    <>
      <Head>
        <title>{post.data.title} | Spacetravelling</title>
      </Head>
      <main>
        <img
          className={styles.postBanner}
          src={post.data.banner.url}
          alt="banner"
        />
        <article className={`${styles.postContent} ${commonStyles.container}`}>
          <h1>{post.data.title}</h1>
          <div className={styles.postMetaContainer}>
            <div className={commonStyles.postMeta}>
              <FiCalendar />
              <time>{postDate}</time>
            </div>
            <div className={commonStyles.postMeta}>
              <FiUser />
              <span>{post.data.author}</span>
            </div>
            <div className={commonStyles.postMeta}>
              <FiClock />
              <span>{`${readingTime()} min`}</span>
            </div>
          </div>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: contentHtml() }}
          />
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      pageSize: 3,
    }
  );
  const postSlugs = posts.results.map(post => {
    return { params: { slug: post.uid } };
  });

  return {
    paths: postSlugs,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const post = await prismic.getByUID('post', String(slug), {});

  return {
    props: {
      post,
    },
  };
};
