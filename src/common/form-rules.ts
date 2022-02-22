
type FnHandler = (value: string) => boolean | string;

export default {
    
    notEmpty(message = ''): FnHandler {
        return (v: string) => !!v || message
    },
    
    length(maxLenght: number, minLenght = 0, message = ''): FnHandler {
        return (v: string) => (v && v.length >= minLenght && v.length <= maxLenght) || message;
    }
}

