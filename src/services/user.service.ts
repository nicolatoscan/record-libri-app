import { UserDTO } from '@/types/dto';

class UserService {

    public readonly LOCAL_STORAGE_KEY = 'user';
    private user: UserDTO | null  = null;

    constructor() {
        const userString = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        if (userString) {
            const user = JSON.parse(userString);
            if (user.token) {
                this.user = user;
            }
        }
    }

    public login(user: UserDTO): void {
        this.user = user;
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(user));
    }

    public isLoggedIn(): boolean {
        return !!this.user?.token;
    }

    public getToken(): string | null {
        return this.user?.token ?? null;
    }

    public getUser(): UserDTO | null {
        return this.user ?? null;
    }
}

export default new UserService();