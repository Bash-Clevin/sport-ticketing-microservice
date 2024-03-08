import type { AppContext, AppInitialProps, AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '@/api/build-client';
import App from 'next/app';
import Header from '@/components/header';

type MyAppProps = {
  currentUser: {
    id: string;
    email: string;
    iat: number;
  };
};

export default function MyApp({
  Component,
  pageProps,
  currentUser,
}: AppProps & MyAppProps) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />;
    </div>
  );
}

MyApp.getInitialProps = async (
  context: AppContext,
): Promise<MyAppProps & AppInitialProps> => {
  const client = buildClient(context.ctx);
  const { data } = await client.get('/api/users/currentuser');

  const ctx = await App.getInitialProps(context);

  return { ...ctx, currentUser: data.currentUser };
};
