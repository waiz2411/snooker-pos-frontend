import { http } from "../utils/httpService";

export const Signup = (data) => http.post(`/signup`, data, {
  headers: {}, // no need to set Content-Type manually
});

export const Login = (data) => http.post(`/login`, data, {
  headers: {}, // no need to set Content-Type manually
});

export const EditClub = (id, data) => http.put(`/clubs/${id}`, data, {
  headers: {}, // no need to set Content-Type manually
});

export const deleteClub = (id) => http.delete(`/clubs/${id}`, {
  headers: {}, // no need to set Content-Type manually
}); 

export const createCustomer = (id, data) => http.post(`/clubs/${id}/customers`, data, {
  headers: {}, // no need to set Content-Type manually
});

export const getCustomers = (id) => http.get(`/clubs/${id}/customers`, {
  headers: {}, // no need to set Content-Type manually
});

export const GetCustomerbyId = (clubId, customerId) => http.get(`/clubs/${clubId}/customers/${customerId}`, {
  headers: {}, // no need to set Content-Type manually
});

export const UpdateCustomer = (clubId, customerId, data) => http.put(`/clubs/${clubId}/customers/${customerId}`, data, {
  headers: {}, // no need to set Content-Type manually
});

export const DeleteCustomer = (id, customerId) => http.delete(`/clubs/${id}/customers/${customerId}`, {
  headers: {}, // no need to set Content-Type manually
});

export const createTable = (club_id, data) => http.post(`/clubs/${club_id}/tables`, data, {
  headers: {}, // no need to set Content-Type manually
});

export const getTables = (club_id) => http.get(`/clubs/${club_id}/tables`, {
  headers: {}, // no need to set Content-Type manually
});

export const getTableById = (table_id) => http.get(`/tables/${table_id}`, {
  headers: {}, // no need to set Content-Type manually
});

export const UpdateTable = (table_id, data) => http.put(`/tables/${table_id}`, data, {
  headers: {}, // no need to set Content-Type manually
});


export const DeleteTable = (table_id) => http.delete(`/tables/${table_id}`, {
  headers: {}, // no need to set Content-Type manually
});

export const createGame = (club_id, data) => http.post(`/clubs/${club_id}/games`, data, {
  headers: {}, // no need to set Content-Type manually
});

export const getGames = (club_id) => http.get(`/clubs/${club_id}/games`, {
  headers: {}, // no need to set Content-Type manually
});

export const completeGame = (game_id, data) => http.put(`/games/${game_id}/complete`, data, {
  headers: {}, // no need to set Content-Type manually
});

export const GetAllClubs = (data) => http.get(`/clubs`, data, {
  headers: {}, // no need to set Content-Type manually
});
