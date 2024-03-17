export class Constants {
    static readonly IS_PREVIEW = process.env.ENV !== 'production';
    static readonly LOCAL_STORAGE_KEY = 'ai-chatbot-token';
}