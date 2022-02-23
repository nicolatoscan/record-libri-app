import axios from 'axios';
import userService from './user.service';
import AuthService from './api/auth.service';
import LibrariesService from './api/libraries.service';
import UsersService from './api/users.service';
import RecordTypesService from './api/rercord-types.service';
import RecordsService from './api/rercords.service';
import TagsService from './api/tags.service';
import NonCompliancesService from './api/non-compliances.service';

class APIService {

    private readonly apiUrl = process.env.VUE_APP_API_URL;

    public readonly auth            = new AuthService(axios, this.apiUrl);
    public readonly libraries       = new LibrariesService(axios, this.apiUrl);
    public readonly users           = new UsersService(axios, this.apiUrl);
    public readonly recordTypes     = new RecordTypesService(axios, this.apiUrl);
    public readonly records         = new RecordsService(axios, this.apiUrl);
    public readonly tags            = new TagsService(axios, this.apiUrl);
    public readonly nonCompliances  = new NonCompliancesService(axios, this.apiUrl);

    constructor() {
        const token = userService.getToken();
        if (token) {
            this.setToken(token);
        }
    }

    public setToken(token: string) {
        axios.interceptors.request.use((config) => {
            if (config?.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

}

export default new APIService();