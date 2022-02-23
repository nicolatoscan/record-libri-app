import { TagDTO } from '@/types/dto';
import { AxiosStatic } from 'axios';
import APIBaseService from './apibase.service';


class TagsService extends APIBaseService {
    constructor(
        private readonly axios: AxiosStatic,
        private readonly baseUrl: string
    ) {
        super();
        this.baseUrl += '/tags';
    }

    async getAll(): Promise<TagDTO[]> {
        return await this.axiosHandler(async () => {
            return await this.axios.get(this.baseUrl);
        })
    }

    async add(tag: TagDTO): Promise<number> {
        return await this.axiosHandler(async () => {
            return await this.axios.post(this.baseUrl, tag);
        })
    }

    async update(id: number, tag: TagDTO): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.patch(this.baseUrl + `/${id}`, tag);
        })
    }

    async delete(id: number): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.delete(this.baseUrl + `/${id}`);
        })
    }

}

export default TagsService;