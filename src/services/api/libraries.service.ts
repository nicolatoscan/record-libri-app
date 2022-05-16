import { BudgetUsedDTO, LibraryDTO } from '@/types/dto';
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

    async add(library: LibraryDTO): Promise<number> {
        return await this.axiosHandler(async () => {
            return await this.axios.post(this.baseUrl, library);
        })
    }

    async update(id: number, library: LibraryDTO): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.patch(this.baseUrl + `/${id}`, library);
        })
    }

    async updateBudget(id: number, budget: number): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.patch(this.baseUrl + `/${id}/budget`, { budget });
        })
    }

    async delete(id: number): Promise<void> {
        return await this.axiosHandler(async () => {
            return await this.axios.delete(this.baseUrl + `/${id}`);
        })
    }

    async getBudgetUsed(): Promise<BudgetUsedDTO[]> {
        return await this.axiosHandler(async () => {
            return await this.axios.get(this.baseUrl + '/budget-used');
        })
    }

}

export default LibrariesService;
