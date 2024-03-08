import axios, { Method } from 'axios';
import { useState } from 'react';

interface ErrorResponse {
  message: string;
}

interface RequestConfig {
  url: string;
  method: Method;
  body?: any;
  onSuccess?: (data: any) => void;
}

interface UseRequestResult {
  doRequest: () => Promise<any>;
  errors: JSX.Element | null;
}

const useRequest = ({
  url,
  method,
  body,
  onSuccess,
}: RequestConfig): UseRequestResult => {
  const [errors, setErrors] = useState<JSX.Element | null>(null);

  const doRequest = async (): Promise<any> => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);

      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (error) {
      const errorResponse: ErrorResponse[] = error.response?.data.errors || [];
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {errorResponse.map((err, index) => (
              <li key={index}>{err.message}</li>
            ))}
          </ul>
        </div>,
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
