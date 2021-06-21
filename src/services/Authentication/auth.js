import http from "../../http-common";
import authHeader from "./auth-header";

export function login({ nickName, password }) {
    return http
        .post("/user/signin", {
            nickName,
            password
        })
        .then(response => {
            return response.data;
        });
}


export function register({ nickName, email, rol, password, firstName, lastName }) {
    return http
        .post("/user/signup", {
            nickName,
            email,
            rol,
            password,
            firstName,
            lastName
        })
        .then(response => {
            return response.data;
        });
}


export function update({ nickName, email, oldPassword, password, confirmPassword }) {
    return http
        .post("/user/updateProfile", {
            nickName,
            email,
            oldPassword,
            password,
            confirmPassword
        })
        .then(response => {
            return response.data;
        });
}

export function checkToken() {
    return http.get("auth/checkToken", {headers: authHeader()})
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
}