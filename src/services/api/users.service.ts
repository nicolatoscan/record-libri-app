import { UserDTO } from '@/types/dto';
import { AxiosStatic } from 'axios';
import APIBaseService from './apibase.service';


class UsersService extends APIBaseService {
    constructor(
        private readonly axios: AxiosStatic,
        private readonly baseUrl: string
    ) {
        super();
        this.baseUrl += '/users';
    }

    async getRoles(): Promise<{ [id: string]: number }> {
        try {
            const res = await this.axios.get(this.baseUrl + '/roles');
            return res.data;
        } catch {
            return {};
        }
    }

    async getAll(): Promise<UserDTO[]> {
        return await this.axiosHandler(async () => {
            return await this.axios.get(this.baseUrl);
        })
    }

    async getById(id: number): Promise<UserDTO | null> {
        return await this.axiosHandler(async () => {
            return await this.axios.get(this.baseUrl + `/${id}`);
        })
    }

    async getByUsername(username: string): Promise<UserDTO | null> {
        return await this.axiosHandler(async () => {
            return await this.axios.get(this.baseUrl + `/username/${username}`);
        })
    }

    async add(user: UserDTO): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.post(this.baseUrl, user);
        })
    }

    async update(id: number, user: UserDTO): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.patch(this.baseUrl + `/${id}`, user);
        })
    }

    async updatePassword(id: number, password: string): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.patch(this.baseUrl + `/${id}`, { password });
        })
    }

    async delete(id: number): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.delete(this.baseUrl + `/${id}`);
        })
    }

}


export default UsersService;
