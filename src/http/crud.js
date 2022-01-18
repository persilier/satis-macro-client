import axios from "axios";

//AUTH
export function resetPassword(input) {
	return axios.put(`/change-password`, input);
}