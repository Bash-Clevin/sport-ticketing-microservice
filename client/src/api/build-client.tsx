import axios, { AxiosInstance } from 'axios';
import { IncomingMessage } from 'http';

interface BuildClientOptions {
  req?: IncomingMessage;
}

const buildClient = ({ req }: BuildClientOptions): AxiosInstance => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req?.headers,
    });
  } else {
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
