import { UserDTO } from '@/types/dto';
import { AxiosStatic } from 'axios';


class AuthService {
    constructor(
        private readonly axios: AxiosStatic,
        private readonly baseUrl: string
    ) {
        this.baseUrl += '/auth';
    }

    async login(username: string, password: string): Promise<UserDTO | null> {
        try {
            const res = await this.axios.post(this.baseUrl + '/login', { username, password });
            return res.data;
        } catch {
            return null;
        }
    }    

}


export default AuthService;
