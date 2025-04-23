import { env } from '../../utils/lib/env';

export const jwtConfig = {
    secret: {
        public: env.JWT_PUBLIC_KEY,
        private: env.JWT_PRIVATE_KEY
    },
    sign: {
        algorithm: env.JWT_ALGORITHM,
        expiresIn: env.JWT_EXPIRATION_TIME
    },
    cookie: {
        cookieName: env.REFRESH_TOKEN_NAME,
        signed: true
    }
};