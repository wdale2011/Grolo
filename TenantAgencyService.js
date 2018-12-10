import axios from "axios";

export function getClientListCall(req) {
  return axios.get(`/api/agencyHome/agencyBusinesses/${req.pageIndex}/${req.pageSize}`);
}
export function getRepListCall(req) {
  return axios.get(`/api/agencyHome/agencyRepresentatives/${req.pageIndex}/${req.pageSize}`);
}
export function getRepDetailsCall(req) {
  return axios.get(`/api/agencyHome/agencyRepresentatives/${req.arId}`);
}
export function getGraphDataCall(req) {
  return axios.get(`/api/agencyHome/agencyMetrics`);
}
