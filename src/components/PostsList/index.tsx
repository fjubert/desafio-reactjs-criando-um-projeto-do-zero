import Link from 'next/link';

import { FiUser, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import commonStyles from '../../styles/common.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface Posts {
  posts: Post[];
}

export default function PostsList(postsList: Posts): JSX.Element {
  const { posts } = postsList;
  return (
    <>
      {posts.map(post => (
        <Link href={`/post/${post.uid}`} key={post.uid}>
          <a>
            <h1>{post.data.title}</h1>
            <p>{post.data.subtitle}</p>
            <div className={commonStyles.postMeta}>
              <FiCalendar />
              <time>
                {format(new Date(post.first_publication_date), 'd MMM yyyy', {
                  locale: ptBR,
                })}
              </time>
            </div>
            <div className={commonStyles.postMeta}>
              <FiUser />
              <span>{post.data.author}</span>
            </div>
          </a>
        </Link>
      ))}
    </>
  );
}
