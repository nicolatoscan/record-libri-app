import { LibraryDTO } from '@/types/dto';
import { AxiosStatic } from 'axios';
import APIBaseService from './apibase.service';


class LibrariesService extends APIBaseService {
    constructor(
        private readonly axios: AxiosStatic,
        private readonly baseUrl: string
    ) {
        super();
        this.baseUrl += '/libraries';
    }

    async getAll(): Promise<LibraryDTO[]> {
        try {
            const res = await this.axios.get(this.baseUrl);
            return res.data;
        } catch {
            return [];
        }
    }

    async add(library: LibraryDTO): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.post(this.baseUrl, library);
        })
    }

    async patch(code: string, library: LibraryDTO): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.patch(this.baseUrl + `/${code}`, library);
        })
    }

    async delete(code: string): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.delete(this.baseUrl + `/${code}`);
        })
    }

}

export default LibrariesService;
