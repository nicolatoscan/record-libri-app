
import axios, { AxiosError } from 'axios';

export default class APIBaseService {
    async axiosHandler<T>(fn: () => T): Promise<T | undefined> {
        try {
            return await fn();
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const ae = (e as AxiosError);
                throw new Error(ae.response?.data?.message ?? 'Unknown error');
            }
        }
    }
}