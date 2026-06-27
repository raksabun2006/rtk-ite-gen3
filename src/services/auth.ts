import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type UserLoginType = {
    email: string;
    password: string;
};

// Added types for registration payload and typical response
type UserRegisterType = {
    name: string;
    email: string;
    password: string;
};

type AuthResponse = {
    success: boolean;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    token?: string; // If your backend returns a JWT right away
};

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_ISHOP_BASE_URL,
    }),
    endpoints: (builder) => ({
        // Login
        loginUser: builder.mutation<AuthResponse, UserLoginType>({
            query: ({ email, password }) => ({
                url: '/auth/login',
                method: "POST",
                body: { email, password }
            })
        }),

        // Register
        registerUser: builder.mutation<AuthResponse, UserRegisterType>({
            query: ({ name, email, password }) => ({
                url: '/auth/register', // Adjust this URL to match your backend path
                method: "POST",
                body: { name, email, password }
            })
        })
    })
});

export const {
    useLoginUserMutation,
    useRegisterUserMutation // Export the new hook
} = authApi;