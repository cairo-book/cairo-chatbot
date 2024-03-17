export class ValidateKeyUtils {

    static isKeyValid(key: string | null): boolean {
        const isAuthenticationEnabled = process.env.AUTHENTICATION_ENABLED === 'true';

        if (!isAuthenticationEnabled) {
            return true;
        }

        const validKey = process.env.KEY; 
        if (validKey === null ) {
            console.log('An error occurred while validating the key. Please check the environment variables.');
            return false;
        }
        return key === validKey;
    }
}