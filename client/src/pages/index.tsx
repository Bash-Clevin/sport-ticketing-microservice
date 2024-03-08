import axios from 'axios';

interface ServerResponse {
  currentUser: string | null;
}

export async function getServerSideProps({ req }) {
  if (typeof window === 'undefined') {
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: req.headers,
      },
    );
    return { props: { data } };
  } else {
    const { data } = await axios.get('/api/users/currentuser');
    return { props: { data } };
  }
}

export default function Home({ data }) {
  return (
    <main>
      <h1 className="text-danger">Hello Bootstrap</h1>
    </main>
  );
}
