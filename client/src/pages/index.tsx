import buildClient from '@/api/build-client';

import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  try {
    const { data } = await buildClient({ req }).get('/api/users/currentuser');
    return { props: { data } };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { props: {} };
  }
}

export default function Home({ data }) {
  return data.currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
}
