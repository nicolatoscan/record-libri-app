
type FnHandler = (value: string) => boolean | string;

export default {
    
    notEmpty(message = ''): FnHandler {
        return v => !!v || message
    },
    
    length(maxLenght: number, minLenght = 0, message = ''): FnHandler {
        return v => (v && v.length >= minLenght && v.length <= maxLenght) || message;
    },

    email(message = ''): FnHandler {
        return v => /.+@.+/.test(v) || message;
    },

}

