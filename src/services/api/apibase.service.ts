
import axios, { AxiosError, AxiosResponse } from 'axios';

export default class APIBaseService {
    async axiosHandler(fn: () => Promise<AxiosResponse>): Promise<any> {
        try {
            const res = await fn();
            return res?.data;
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const ae = (e as AxiosError);
                throw new Error(ae.response?.data?.message ?? 'Unknown error');
            }
            throw e;
        }
    }
}