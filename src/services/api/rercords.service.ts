import { RecordDTO } from '@/types/dto';
import { AxiosStatic } from 'axios';
import APIBaseService from './apibase.service';


class RecordsService extends APIBaseService {
    constructor(
        private readonly axios: AxiosStatic,
        private readonly baseUrl: string
    ) {
        super();
        this.baseUrl += '/records';
    }

    async getTypes(): Promise<string[]> {
        return await this.axiosHandler(async () => {
            return await this.axios.get(this.baseUrl + '/types');
        })  
    }

    async getAll(): Promise<RecordDTO[]> {
        return await this.axiosHandler(async () => {
            return await this.axios.get(this.baseUrl);
        })
    }

    async getMine(): Promise<RecordDTO[]> {
        return await this.axiosHandler(async () => {
            return await this.axios.get(this.baseUrl + '/mine');
        })
    }

    async getById(id: number): Promise<RecordDTO> {
        return await this.axiosHandler(async () => {
            return await this.axios.get(this.baseUrl + `/${id}`);
        })
    }

    async getNumbers(): Promise<{ id: number, number: number }[]> {
        return await this.axiosHandler(async () => {
            return await this.axios.get(this.baseUrl + `/numbers`);
        })
    }

    async add(record: RecordDTO): Promise<number> {
        return await this.axiosHandler(async () => {
            return await this.axios.post(this.baseUrl, record);
        })
    }

    async update(id: number, record: RecordDTO): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.patch(this.baseUrl + `/${id}`, record);
        })
    }

    async delete(id: number): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.delete(this.baseUrl + `/${id}`);
        })
    }

}


export default RecordsService;
