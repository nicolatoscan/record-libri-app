import { NonCompliancesDTO } from '@/types/dto';
import { AxiosStatic } from 'axios';
import APIBaseService from './apibase.service';


class NonCompliancesService extends APIBaseService {
    constructor(
        private readonly axios: AxiosStatic,
        private readonly baseUrl: string
    ) {
        super();
        this.baseUrl += '/non-compliances';
    }

    async getGroups(): Promise<string[]> {
        return await this.axiosHandler(async () => {
            return await this.axios.get(this.baseUrl + '/groups');
        })  
    }

    async getLanguages(): Promise<string[]> {
        return await this.axiosHandler(async () => {
            return await this.axios.get(this.baseUrl + '/languages');
        })  
    }

    async getAll(): Promise<NonCompliancesDTO[]> {
        return await this.axiosHandler(async () => {
            return await this.axios.get(this.baseUrl);
        })
    }

    async add(nc: NonCompliancesDTO): Promise<number> {
        return await this.axiosHandler(async () => {
            return await this.axios.post(this.baseUrl, nc);
        })
    }

    async update(id: number, nc: NonCompliancesDTO): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.patch(this.baseUrl + `/${id}`, nc);
        })
    }

    async delete(id: number): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.delete(this.baseUrl + `/${id}`);
        })
    }

}

export default NonCompliancesService;