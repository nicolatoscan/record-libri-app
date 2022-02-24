import { FormatDTO } from '@/types/dto';
import { AxiosStatic } from 'axios';
import APIBaseService from './apibase.service';


class FormatsService extends APIBaseService {
    constructor(
        private readonly axios: AxiosStatic,
        private readonly baseUrl: string
    ) {
        super();
        this.baseUrl += '/formats';
    }

    async getAll(): Promise<FormatDTO[]> {
        return await this.axiosHandler(async () => {
            return await this.axios.get(this.baseUrl);
        })
    }

    async add(type: FormatDTO): Promise<number> {
        return await this.axiosHandler(async () => {
            return await this.axios.post(this.baseUrl, type);
        })
    }

    async update(id: number, type: FormatDTO): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.patch(this.baseUrl + `/${id}`, type);
        })
    }

    async delete(id: number): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.delete(this.baseUrl + `/${id}`);
        })
    }

}


export default FormatsService;
