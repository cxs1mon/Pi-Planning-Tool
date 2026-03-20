export interface PiResponse {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
}

export const initialPiResponse: PiResponse = {
  id: 1,
  name: '',
  startDate: '',
  endDate: '',
};
